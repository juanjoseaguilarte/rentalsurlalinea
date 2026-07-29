import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

# Permite importar `power4` ejecutando pytest desde trading/ o desde la raíz
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from power4.config import Power4Config


def make_df(closes, highs=None, lows=None, opens=None, start="2024-01-01"):
    closes = np.asarray(closes, dtype=float)
    n = len(closes)
    if opens is None:
        opens = np.concatenate([[closes[0]], closes[:-1]])
    if highs is None:
        highs = np.maximum(opens, closes) + 0.2
    if lows is None:
        lows = np.minimum(opens, closes) - 0.2
    idx = pd.date_range(start, periods=n, freq="1h", tz="UTC")
    return pd.DataFrame(
        {"open": opens, "high": highs, "low": lows, "close": closes, "volume": 1.0},
        index=idx,
    )


def ciclo_sintetico():
    """Serie que recorre E4 → E1 → E2 → E3 → E4 con zigzag para generar pivotes."""
    rng = np.random.default_rng(7)
    tramos = [
        np.linspace(100, 60, 80),    # caída inicial (E4)
        np.full(70, 60.0),           # acumulación (E1)
        np.linspace(60, 100, 80),    # tendencia alcista (E2)
        np.full(70, 100.0),          # distribución (E3)
        np.linspace(100, 60, 80),    # tendencia bajista (E4)
    ]
    base = np.concatenate(tramos)
    i = np.arange(len(base))
    zig = 1.2 * np.sin(i * 2 * np.pi / 9)
    ruido = rng.normal(0, 0.15, len(base))
    closes = base + zig + ruido
    # Mechas variables para que los extremos locales sean únicos (pivotes limpios)
    highs = closes + 0.25 + 0.1 * np.abs(np.sin(i * 0.73))
    lows = closes - 0.25 - 0.1 * np.abs(np.cos(i * 1.31))
    return make_df(closes, highs=highs, lows=lows)


@pytest.fixture
def cfg():
    return Power4Config()


@pytest.fixture
def df_ciclo():
    return ciclo_sintetico()
