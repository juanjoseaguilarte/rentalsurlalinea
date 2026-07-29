import numpy as np
import pandas as pd

from conftest import ciclo_sintetico, make_df
from power4.backtest import informe, run_backtest, trades_a_df
from power4.data.binance import resample_4h


def _ciclos_largos(n_ciclos=4):
    """Encadena varios ciclos sintéticos para tener suficientes operaciones."""
    df = ciclo_sintetico()
    bloques = []
    offset = 0.0
    for k in range(n_ciclos):
        b = df.copy()
        for col in ("open", "high", "low", "close"):
            b[col] = b[col] + offset
        bloques.append(b)
        offset += 0.0  # los ciclos empiezan y terminan en ~60/100, encadenan sin salto
    out = pd.concat(bloques, ignore_index=True)
    out.index = pd.date_range("2023-01-01", periods=len(out), freq="1h", tz="UTC")
    return out


def test_backtest_end_to_end():
    df = _ciclos_largos(4)
    from power4.config import Power4Config
    cfg = Power4Config()
    result = run_backtest(df, cfg, align_filter=False)

    assert len(result.trades) > 0, "el ciclo sintético debería generar operaciones"
    for t in result.trades:
        assert t.ts_out is not None and t.exit is not None
        assert t.ts_out >= t.ts_in
        if t.side == 1:
            assert t.stop < t.entry
        else:
            assert t.stop > t.entry

    assert np.isfinite(result.equity.iloc[-1])
    texto = informe(result, cfg.fees_bps)
    assert "RESULTADOS DEL BACKTEST" in texto

    tabla = trades_a_df(result.trades, cfg.fees_bps)
    assert not tabla.empty
    assert set(tabla["señal"]).issubset({"PC1", "PV1", "E1→E2", "E3→E4", "E3→E2", "E1→E4"})


def test_alineamiento_reduce_operaciones():
    df = _ciclos_largos(4)
    from power4.config import Power4Config
    cfg = Power4Config()
    con = run_backtest(df, cfg, align_filter=True)
    sin = run_backtest(df, cfg, align_filter=False)
    assert len(con.trades) <= len(sin.trades)


def test_resample_4h():
    df = _ciclos_largos(1)
    df4 = resample_4h(df)
    assert len(df4) == len(df) // 4
    bloque = df.iloc[:4]
    assert df4["open"].iloc[0] == bloque["open"].iloc[0]
    assert df4["close"].iloc[0] == bloque["close"].iloc[-1]
    assert df4["high"].iloc[0] == bloque["high"].max()
    assert df4["low"].iloc[0] == bloque["low"].min()
