import numpy as np

from conftest import make_df
from power4.core.relevantes import detectar_relevantes, conocidos, ultimo


def _df_con_pico(pico_idx=6, n=13):
    # Highs crecientes hasta el pico y decrecientes después; lows espejo suave
    highs = np.array([10 + i if i <= pico_idx else 10 + 2 * pico_idx - i for i in range(n)], dtype=float)
    closes = highs - 0.5
    lows = highs - 1.0
    return make_df(closes, highs=highs, lows=lows)


def test_mr_detectado_con_precio_y_confirmacion():
    df = _df_con_pico()
    pivots = detectar_relevantes(df, wing=3)
    mrs = [p for p in pivots if p.kind == "MR"]
    assert len(mrs) == 1
    mr = mrs[0]
    assert mr.idx == 6
    assert mr.price == df["high"].iloc[6]
    assert mr.confirmed_at == 9


def test_pivote_invisible_antes_de_confirmarse():
    df = _df_con_pico()
    pivots = detectar_relevantes(df, wing=3)
    assert conocidos(pivots, t=8) == []          # en idx+2 aún no existe
    assert len(conocidos(pivots, t=9)) >= 1      # en idx+3 ya sí
    assert ultimo(pivots, "MR", t=8) is None
    assert ultimo(pivots, "MR", t=9).idx == 6


def test_mr_detectado_en_valle():
    df = _df_con_pico()
    df_inv = df.copy()
    # Invertimos la serie verticalmente: el pico pasa a ser valle
    for col in ("open", "high", "low", "close"):
        df_inv[col] = 30 - df[col]
    df_inv[["high", "low"]] = df_inv[["low", "high"]].to_numpy()
    pivots = detectar_relevantes(df_inv, wing=3)
    mrs = [p for p in pivots if p.kind == "mR"]
    assert len(mrs) == 1
    assert mrs[0].idx == 6
    assert mrs[0].confirmed_at == 9
