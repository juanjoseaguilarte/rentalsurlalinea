"""Indicadores básicos: MMS, pendiente, ATR y distancias a la media."""
from __future__ import annotations

import numpy as np
import pandas as pd


def sma(close: pd.Series, n: int) -> pd.Series:
    return close.rolling(n).mean()


def slope(series: pd.Series, k: int) -> pd.Series:
    """Pendiente normalizada: (s[t] - s[t-k]) / s[t-k].

    Al estar expresada en fracción del propio valor, los umbrales son
    portables entre marcos temporales.
    """
    prev = series.shift(k)
    return (series - prev) / prev


def slope_state(slope_val: float, flat_eps: float) -> str:
    if np.isnan(slope_val):
        return "plana"
    if slope_val > flat_eps:
        return "sube"
    if slope_val < -flat_eps:
        return "baja"
    return "plana"


def atr(df: pd.DataFrame, n: int) -> pd.Series:
    prev_close = df["close"].shift(1)
    tr = pd.concat(
        [
            df["high"] - df["low"],
            (df["high"] - prev_close).abs(),
            (df["low"] - prev_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    return tr.rolling(n).mean()


def compute_indicators(df: pd.DataFrame, cfg) -> pd.DataFrame:
    """Devuelve un DataFrame de indicadores alineado con `df`.

    Columnas: sma20, sma40, slope20, slope40, atr, dist_pct, dist_atr.
    (Los nombres 20/40 son los del método; los periodos reales salen de cfg.)
    """
    out = pd.DataFrame(index=df.index)
    out["sma20"] = sma(df["close"], cfg.sma_fast)
    out["sma40"] = sma(df["close"], cfg.sma_slow)
    out["slope20"] = slope(out["sma20"], cfg.slope_k)
    out["slope40"] = slope(out["sma40"], cfg.slope_k)
    out["atr"] = atr(df, cfg.atr_n)
    out["dist_pct"] = (df["close"] - out["sma20"]) / out["sma20"]
    out["dist_atr"] = (df["close"] - out["sma20"]) / out["atr"]
    return out
