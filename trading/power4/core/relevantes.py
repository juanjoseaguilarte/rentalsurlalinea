"""Máximos y Mínimos Relevantes (MR / mR) del método Power 4.

Un MR es un máximo con `wing` máximos más bajos a cada lado; un mR es el
espejo con mínimos. Un pivote solo existe para el algoritmo a partir de
`confirmed_at = idx + wing`: antes de esa vela las `wing` velas de la
derecha aún no habían cerrado. Todo consumidor debe filtrar por
`confirmed_at <= t` — es el mecanismo único anti-lookahead.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Optional

import numpy as np
import pandas as pd


@dataclass(frozen=True)
class Relevante:
    kind: str  # "MR" | "mR"
    idx: int
    ts: pd.Timestamp
    price: float
    confirmed_at: int


def detectar_relevantes(df: pd.DataFrame, wing: int = 3) -> list[Relevante]:
    """Detecta todos los MR/mR de la serie, ordenados por idx."""
    highs = df["high"].to_numpy()
    lows = df["low"].to_numpy()
    index = df.index
    pivots: list[Relevante] = []
    for i in range(wing, len(df) - wing):
        left_h = highs[i - wing:i]
        right_h = highs[i + 1:i + 1 + wing]
        if highs[i] > left_h.max() and highs[i] > right_h.max():
            pivots.append(Relevante("MR", i, index[i], float(highs[i]), i + wing))
        left_l = lows[i - wing:i]
        right_l = lows[i + 1:i + 1 + wing]
        if lows[i] < left_l.min() and lows[i] < right_l.min():
            pivots.append(Relevante("mR", i, index[i], float(lows[i]), i + wing))
    pivots.sort(key=lambda p: p.idx)
    return pivots


def conocidos(pivots: Iterable[Relevante], t: int) -> list[Relevante]:
    """Pivotes ya confirmados en la vela t."""
    return [p for p in pivots if p.confirmed_at <= t]


def ultimo(
    pivots: Iterable[Relevante],
    kind: str,
    t: int,
    desde_idx: Optional[int] = None,
) -> Optional[Relevante]:
    """Último pivote `kind` conocido en t, opcionalmente formado desde `desde_idx`."""
    best = None
    for p in pivots:
        if p.kind != kind or p.confirmed_at > t:
            continue
        if desde_idx is not None and p.idx < desde_idx:
            continue
        if best is None or p.idx > best.idx:
            best = p
    return best
