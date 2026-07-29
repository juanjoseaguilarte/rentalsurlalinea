"""Análisis Power 4 de un par de marcos (operativo + referencia).

`compute_frame` hace el trabajo por marco; `analyze` combina 1h + 4h en un
snapshot `Power4State` que usan tanto el CLI en vivo como los informes.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

import pandas as pd

from .config import Power4Config
from .core import (
    Relevante,
    Setup,
    Transicion,
    acunamiento,
    clasificar_etapas,
    compute_indicators,
    detectar_relevantes,
    detectar_setup,
    respiracion,
    ultimo,
)

LADO = {"E1": "comprador", "E2": "comprador", "E3": "vendedor", "E4": "vendedor"}


@dataclass
class FrameAnalysis:
    df: pd.DataFrame
    ind: pd.DataFrame
    pivots: list[Relevante]
    etapas: pd.Series
    transiciones: list[Transicion]

    @property
    def etapa_actual(self) -> Optional[str]:
        return self.etapas.iloc[-1] if len(self.etapas) else None


@dataclass
class Power4State:
    ts: pd.Timestamp
    precio: float
    sma20: float
    sma40: float
    dist_pct: float
    dist_atr: float
    respiracion: str
    etapa_1h: str
    etapa_4h: Optional[str]
    alineado: bool
    alineado_lado: bool
    mr: Optional[Relevante]
    mr_bajo: Optional[Relevante]  # mR (mínimo relevante)
    acunamiento: bool
    setup: Optional[Setup]
    transiciones_recientes: list[Transicion] = field(default_factory=list)


def compute_frame(df: pd.DataFrame, cfg: Power4Config) -> FrameAnalysis:
    ind = compute_indicators(df, cfg)
    pivots = detectar_relevantes(df, cfg.pivot_wing)
    etapas, transiciones = clasificar_etapas(df, ind, cfg, pivots)
    return FrameAnalysis(df, ind, pivots, etapas, transiciones)


def analyze(
    df_1h: pd.DataFrame,
    df_4h: Optional[pd.DataFrame],
    cfg: Power4Config,
    n_trans: int = 3,
) -> Power4State:
    f1 = compute_frame(df_1h, cfg)
    t = len(df_1h) - 1
    etapa_1h = f1.etapa_actual

    etapa_4h = None
    if df_4h is not None and len(df_4h) > cfg.warmup:
        etapa_4h = compute_frame(df_4h, cfg).etapa_actual

    alineado = etapa_4h is not None and etapa_1h == etapa_4h
    alineado_lado = (
        etapa_4h is not None
        and etapa_1h is not None
        and LADO[etapa_1h] == LADO[etapa_4h]
    )

    setup = None
    if etapa_1h in ("E2", "E4"):
        setup = detectar_setup(t, df_1h, f1.ind, etapa_1h, f1.pivots, cfg)

    return Power4State(
        ts=df_1h.index[t],
        precio=float(df_1h["close"].iloc[t]),
        sma20=float(f1.ind["sma20"].iloc[t]),
        sma40=float(f1.ind["sma40"].iloc[t]),
        dist_pct=float(f1.ind["dist_pct"].iloc[t]),
        dist_atr=float(f1.ind["dist_atr"].iloc[t]),
        respiracion=respiracion(t, df_1h, f1.ind, cfg),
        etapa_1h=etapa_1h,
        etapa_4h=etapa_4h,
        alineado=alineado,
        alineado_lado=alineado_lado,
        mr=ultimo(f1.pivots, "MR", t),
        mr_bajo=ultimo(f1.pivots, "mR", t),
        acunamiento=acunamiento(t, df_1h, f1.ind, etapa_1h, cfg),
        setup=setup,
        transiciones_recientes=f1.transiciones[-n_trans:],
    )
