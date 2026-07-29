"""Señales operativas Power 4: respiración, acunamiento y patrones PC1/PV1.

Todas las funciones evalúan la vela t usando solo información disponible a
su cierre (pivotes con confirmed_at <= t incluidos).
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np
import pandas as pd

from .relevantes import Relevante, ultimo

EXHAL_ALCISTA = "exhalacion_alcista"
EXHAL_BAJISTA = "exhalacion_bajista"
INHALACION = "inhalacion"
NEUTRAL = "neutral"


@dataclass(frozen=True)
class Setup:
    kind: str          # "PC1" | "PV1"
    idx: int
    ts: pd.Timestamp
    trigger: float
    stop: float
    target: float
    inhal_count: int
    valido: bool
    motivo: str = ""   # razón de invalidez cuando valido=False


# ---------------------------------------------------------------- respiración

def respiracion(t: int, df: pd.DataFrame, ind: pd.DataFrame, cfg) -> str:
    """Estado respiratorio del precio respecto a la MMS20 en la vela t."""
    dist_atr = ind["dist_atr"].to_numpy()
    dist_pct = ind["dist_pct"].to_numpy()
    if t < cfg.slope_k or np.isnan(dist_atr[t]):
        return NEUTRAL
    if abs(dist_atr[t]) > cfg.exhal_atr and abs(dist_pct[t]) > abs(dist_pct[t - 3]):
        return EXHAL_ALCISTA if dist_atr[t] > 0 else EXHAL_BAJISTA
    k = cfg.inhal_contract_bars
    if t >= k and all(
        abs(dist_pct[t - i]) < abs(dist_pct[t - i - 1]) for i in range(k)
    ):
        return INHALACION
    return NEUTRAL


# ---------------------------------------------------------------- acunamiento

def acunamiento(t: int, df: pd.DataFrame, ind: pd.DataFrame, etapa: str, cfg) -> bool:
    """Precio apoyado en la MMS20 mientras la media se gira a favor.

    Solo tiene sentido al final de E1 (versión alcista) o E3 (bajista).
    """
    if etapa not in ("E1", "E3"):
        return False
    nb = cfg.acun_bars
    if t < nb + cfg.slope_k:
        return False
    close = df["close"].to_numpy()
    high = df["high"].to_numpy()
    low = df["low"].to_numpy()
    sma20 = ind["sma20"].to_numpy()
    slope20 = ind["slope20"].to_numpy()
    if np.isnan(sma20[t - nb + 1]):
        return False

    win = range(t - nb + 1, t + 1)
    if etapa == "E1":
        pegado = all(close[i] >= sma20[i] * (1 - cfg.acun_band) for i in win)
        cruces = sum(1 for i in win if close[i] < sma20[i])
        girada = slope20[t] >= 0 and slope20[t - nb] < 0
    else:
        pegado = all(close[i] <= sma20[i] * (1 + cfg.acun_band) for i in win)
        cruces = sum(1 for i in win if close[i] > sma20[i])
        girada = slope20[t] <= 0 and slope20[t - nb] > 0

    rangos = high - low
    contraccion = rangos[t - 2:t + 1].mean() < rangos[t - 5:t - 2].mean()
    return pegado and cruces <= cfg.acun_max_cruces and girada and contraccion


# ---------------------------------------------------------------- PC1 / PV1

def _racha(values: np.ndarray, t: int, decreciente: bool, tope: int) -> int:
    """Nº de velas consecutivas terminando en t con extremos decrecientes/crecientes."""
    count = 0
    for i in range(tope):
        a, b = values[t - i], values[t - i - 1]
        if (decreciente and a < b) or (not decreciente and a > b):
            count += 1
        else:
            break
    return count


def _es_gvs(i: int, df: pd.DataFrame, ind: pd.DataFrame, contra_alcista: bool, cfg) -> bool:
    """Gran Vela Sólida en la vela i (contra_alcista: vela bajista en tendencia alcista)."""
    o, c = df["open"].iloc[i], df["close"].iloc[i]
    h, l = df["high"].iloc[i], df["low"].iloc[i]
    rng = h - l
    a = ind["atr"].iloc[i]
    if rng <= 0 or np.isnan(a):
        return False
    solida = abs(c - o) / rng >= cfg.gvs_body_ratio and rng >= cfg.gvs_range_atr * a
    return solida and ((c < o) if contra_alcista else (c > o))


def _hubo_explosion(t_inicio: int, df: pd.DataFrame, ind: pd.DataFrame, cfg) -> bool:
    """Movimiento vertical en las velas previas al inicio de la inhalación."""
    desde = max(0, t_inicio - cfg.explos_lookback)
    rng = (df["high"] - df["low"]).to_numpy()
    a = ind["atr"].to_numpy()
    d = ind["dist_atr"].to_numpy()
    for i in range(desde, t_inicio + 1):
        if not np.isnan(a[i]) and rng[i] > cfg.explos_range_atr * a[i]:
            return True
        if not np.isnan(d[i]) and abs(d[i]) > cfg.exhal_extreme_atr:
            return True
    return False


def detectar_setup(
    t: int,
    df: pd.DataFrame,
    ind: pd.DataFrame,
    etapa: str,
    pivots: list[Relevante],
    cfg,
) -> Optional[Setup]:
    """Setup PC1 (en E2) o PV1 (en E4) evaluado al cierre de la vela t.

    Devuelve None si no hay racha 3–5; devuelve un Setup con valido=False
    cuando el patrón existe pero un filtro de seguridad lo descarta.
    """
    if etapa == "E2":
        kind, decreciente = "PC1", True
    elif etapa == "E4":
        kind, decreciente = "PV1", False
    else:
        return None
    if t < cfg.new_extreme_lookback + cfg.inhal_max + 1:
        return None

    high = df["high"].to_numpy()
    low = df["low"].to_numpy()
    serie = high if kind == "PC1" else low
    count = _racha(serie, t, decreciente, cfg.inhal_max + 1)
    if not (cfg.inhal_min <= count <= cfg.inhal_max):
        return None

    ts = df.index[t]
    if kind == "PC1":
        trigger = float(high[t]) * (1 + cfg.trigger_pct)
        stop = float(min(low[t], low[t - 1])) * (1 - cfg.stop_buffer_pct)
        mr = ultimo(pivots, "MR", t)
        target = mr.price if mr else trigger * 1.05
    else:
        trigger = float(low[t]) * (1 - cfg.trigger_pct)
        stop = float(max(high[t], high[t - 1])) * (1 + cfg.stop_buffer_pct)
        mr = ultimo(pivots, "mR", t)
        target = mr.price if mr else trigger * 0.95

    def invalido(motivo: str) -> Setup:
        return Setup(kind, t, ts, trigger, stop, target, count, False, motivo)

    inicio = t - count  # vela del extremo desde el que arranca la inhalación

    # Tras un nuevo extremo: el punto de partida debe ser máximo/mínimo reciente
    lb = cfg.new_extreme_lookback
    if kind == "PC1" and high[inicio] < high[max(0, inicio - lb):inicio].max():
        return invalido("la inhalación no parte de un nuevo máximo")
    if kind == "PV1" and low[inicio] > low[max(0, inicio - lb):inicio].min():
        return invalido("la inhalación no parte de un nuevo mínimo")

    # Regla de "cerca": distancia a la MMS20 acotada
    dist = ind["dist_pct"].iloc[t]
    if np.isnan(dist) or abs(dist) > cfg.near_sma_pct:
        return invalido(f"lejos de la MMS20 ({dist:+.2%})")

    # Vías del tren: ambas medias con pendiente a favor
    sl20, sl40 = ind["slope20"].iloc[t], ind["slope40"].iloc[t]
    if kind == "PC1" and not (sl20 > cfg.flat_eps and sl40 > 0):
        return invalido("las medias no suben paralelas")
    if kind == "PV1" and not (sl20 < -cfg.flat_eps and sl40 < 0):
        return invalido("las medias no bajan paralelas")

    # Filtro GVS: primera vela de la inhalación como Gran Vela Sólida en contra
    if _es_gvs(inicio + 1, df, ind, contra_alcista=(kind == "PC1"), cfg=cfg):
        return invalido("la inhalación arranca con una GVS en contra")

    # Filtro de explosividad: no operar el primer patrón tras un movimiento vertical
    if _hubo_explosion(inicio, df, ind, cfg):
        return invalido("primer setup tras movimiento explosivo")

    return Setup(kind, t, ts, trigger, stop, target, count, True)
