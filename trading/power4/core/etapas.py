"""Máquina de estados de las 4 etapas del ciclo Power 4.

Secuencial y estrictamente causal: la etapa de la vela t se decide a su
cierre usando solo precios hasta t y Relevantes con confirmed_at <= t.
Las transiciones E1→E2 y E3→E4 son las señales de reversión del sistema.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np
import pandas as pd

from .relevantes import Relevante, detectar_relevantes, ultimo

E1, E2, E3, E4 = "E1", "E2", "E3", "E4"


@dataclass(frozen=True)
class Transicion:
    idx: int
    ts: pd.Timestamp
    desde: str
    hacia: str
    precio: float
    motivo: str
    atajo: bool = False


def _etapa_inicial(close, sma20, sma40, slope20, slope40, flat_eps) -> str:
    if np.isnan(sma40) or np.isnan(slope40):
        return E1
    if sma20 > sma40 and slope20 > flat_eps and slope40 > 0:
        return E2
    if sma20 < sma40 and slope20 < -flat_eps and slope40 < 0:
        return E4
    return E1 if close > sma20 else E3


def clasificar_etapas(
    df: pd.DataFrame,
    ind: pd.DataFrame,
    cfg,
    pivots: Optional[list[Relevante]] = None,
) -> tuple[pd.Series, list[Transicion]]:
    """Devuelve (serie de etapas por vela, lista de transiciones)."""
    if pivots is None:
        pivots = detectar_relevantes(df, cfg.pivot_wing)

    n = len(df)
    close = df["close"].to_numpy()
    low = df["low"].to_numpy()
    sma20 = ind["sma20"].to_numpy()
    sma40 = ind["sma40"].to_numpy()
    slope20 = ind["slope20"].to_numpy()
    slope40 = ind["slope40"].to_numpy()

    etapas = np.array([""] * n, dtype=object)
    transiciones: list[Transicion] = []

    if n <= cfg.warmup:
        return pd.Series(etapas, index=df.index, name="etapa"), transiciones

    t0 = cfg.warmup
    estado = _etapa_inicial(
        close[t0], sma20[t0], sma40[t0], slope20[t0], slope40[t0], cfg.flat_eps
    )
    etapa_start = t0
    etapas[:t0] = None
    bajo_media_seguidas = 0  # velas seguidas con cierre < MMS20 y media cayendo (E2→E3)

    def cambiar(t: int, nuevo: str, motivo: str, atajo: bool = False):
        nonlocal estado, etapa_start, bajo_media_seguidas
        transiciones.append(
            Transicion(t, df.index[t], estado, nuevo, float(close[t]), motivo, atajo)
        )
        estado = nuevo
        etapa_start = t
        bajo_media_seguidas = 0

    for t in range(t0, n):
        c, s20, s40 = close[t], sma20[t], sma40[t]
        sl20, sl40 = slope20[t], slope40[t]

        if estado == E1:
            mr = ultimo(pivots, "MR", t, desde_idx=etapa_start) or ultimo(pivots, "MR", t)
            mr_bajo = ultimo(pivots, "mR", t, desde_idx=etapa_start) or ultimo(pivots, "mR", t)
            if mr is not None and c > mr.price and sl20 >= 0:
                cambiar(t, E2, f"rotura del MR {mr.price:.2f} con MMS20 girada al alza")
            elif mr_bajo is not None and c < mr_bajo.price and sl20 < -cfg.flat_eps:
                cambiar(t, E4, f"pérdida del mR {mr_bajo.price:.2f} con MMS20 cayendo", atajo=True)

        elif estado == E2:
            mr_sube = ultimo(pivots, "mR", t, desde_idx=etapa_start)
            perdida_mr = mr_sube is not None and c < mr_sube.price and c < s20
            if c < s20 and sl20 < -cfg.flat_eps:
                bajo_media_seguidas += 1
            else:
                bajo_media_seguidas = 0
            if perdida_mr:
                cambiar(t, E3, f"pérdida del mR creciente {mr_sube.price:.2f} y cierre bajo la MMS20")
            elif bajo_media_seguidas >= 3:
                cambiar(t, E3, "3 cierres bajo la MMS20 con la media girada a la baja")

        elif estado == E3:
            # Base de la E3: el mínimo de los mR conocidos formados en la etapa;
            # si aún no hay ninguno, el low mínimo de la etapa excluyendo las
            # últimas `wing` velas (aún sin confirmar como pivote).
            mrs_e3 = [
                p for p in pivots
                if p.kind == "mR" and p.confirmed_at <= t and p.idx >= etapa_start
            ]
            if mrs_e3:
                base = min(p.price for p in mrs_e3)
            elif t - etapa_start > cfg.pivot_wing:
                base = float(low[etapa_start:t - cfg.pivot_wing + 1].min())
            else:
                base = None
            mr_techo = ultimo(pivots, "MR", t, desde_idx=etapa_start) or ultimo(pivots, "MR", t)
            if base is not None and c < base:
                cambiar(t, E4, f"pérdida de la base de la Etapa 3 en {base:.2f}")
            elif (
                mr_techo is not None
                and c > mr_techo.price
                and sl20 > cfg.flat_eps
                and sl40 > 0
            ):
                cambiar(t, E2, f"rotura del MR {mr_techo.price:.2f} con ambas medias subiendo", atajo=True)

        elif estado == E4:
            # Fin del deterioro: sin un nuevo mR decreciente confirmado en las
            # últimas `e4_quiet_bars` velas.
            mrs_conocidos = [p for p in pivots if p.kind == "mR" and p.confirmed_at <= t]
            nuevo_minimo_reciente = False
            for i, p in enumerate(mrs_conocidos):
                if p.confirmed_at > t - cfg.e4_quiet_bars and i > 0:
                    if p.price < mrs_conocidos[i - 1].price:
                        nuevo_minimo_reciente = True
            if c > s20 and sl20 > -cfg.flat_eps and not nuevo_minimo_reciente:
                cambiar(t, E1, "cierre sobre la MMS20 sin nuevos mínimos decrecientes")

        etapas[t] = estado

    return pd.Series(etapas, index=df.index, name="etapa"), transiciones
