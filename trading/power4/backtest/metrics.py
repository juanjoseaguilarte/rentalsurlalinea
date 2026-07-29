"""Métricas del backtest: win rate, expectativa, profit factor, drawdown."""
from __future__ import annotations

import numpy as np
import pandas as pd

from .engine import BacktestResult, Trade


def trades_a_df(trades: list[Trade], fees_bps: float) -> pd.DataFrame:
    filas = []
    for t in trades:
        filas.append(
            {
                "ts_in": t.ts_in,
                "ts_out": t.ts_out,
                "señal": t.señal,
                "lado": "largo" if t.side == 1 else "corto",
                "entry": t.entry,
                "exit": t.exit,
                "stop": t.stop,
                "target": t.target,
                "motivo_salida": t.motivo_salida,
                "etapa_4h": t.etapa_4h,
                "pnl_pct": t.pnl_pct(fees_bps),
                "r_multiple": t.r_multiple(fees_bps),
                "horas": (t.ts_out - t.ts_in) / pd.Timedelta(hours=1),
            }
        )
    return pd.DataFrame(filas)


def _resumen(df: pd.DataFrame) -> dict:
    if df.empty:
        return {"trades": 0}
    pnl = df["pnl_pct"]
    ganadores = pnl[pnl > 0]
    perdedores = pnl[pnl <= 0]
    pf = (
        ganadores.sum() / abs(perdedores.sum())
        if len(perdedores) and perdedores.sum() != 0
        else np.inf
    )
    return {
        "trades": len(df),
        "win_rate": len(ganadores) / len(df),
        "avg_win_pct": ganadores.mean() if len(ganadores) else 0.0,
        "avg_loss_pct": perdedores.mean() if len(perdedores) else 0.0,
        "expectativa_pct": pnl.mean(),
        "expectativa_r": df["r_multiple"].mean(),
        "profit_factor": pf,
        "horas_media": df["horas"].mean(),
    }


def max_drawdown(equity: pd.Series) -> float:
    pico = equity.cummax()
    return float((equity / pico - 1).min())


def informe(result: BacktestResult, fees_bps: float) -> str:
    df = trades_a_df(result.trades, fees_bps)
    lineas = ["", "═" * 64, "RESULTADOS DEL BACKTEST POWER 4", "═" * 64]

    total = _resumen(df)
    if total["trades"] == 0:
        lineas.append("Sin operaciones en el periodo.")
        return "\n".join(lineas)

    retorno_total = result.equity.iloc[-1] - 1
    lineas += [
        f"Operaciones:      {total['trades']}",
        f"Win rate:         {total['win_rate']:.1%}",
        f"Ganancia media:   {total['avg_win_pct']:+.2%}   Pérdida media: {total['avg_loss_pct']:+.2%}",
        f"Expectativa:      {total['expectativa_pct']:+.3%} por trade  ({total['expectativa_r']:+.2f} R)",
        f"Profit factor:    {total['profit_factor']:.2f}",
        f"Retorno total:    {retorno_total:+.1%}   Max drawdown: {max_drawdown(result.equity):+.1%}",
        f"Duración media:   {total['horas_media']:.0f} h",
    ]

    lineas.append("\n— Por tipo de señal —")
    for señal, grupo in df.groupby("señal"):
        r = _resumen(grupo)
        lineas.append(
            f"  {señal:8s} {r['trades']:4d} trades · win {r['win_rate']:.0%} · "
            f"expectativa {r['expectativa_pct']:+.3%} · PF {r['profit_factor']:.2f}"
        )

    lineas.append("\n— Por año —")
    for año, grupo in df.groupby(df["ts_in"].dt.year):
        r = _resumen(grupo)
        lineas.append(
            f"  {año}   {r['trades']:4d} trades · win {r['win_rate']:.0%} · "
            f"expectativa {r['expectativa_pct']:+.3%}"
        )

    fwd = result.transiciones_fwd
    if not fwd.empty:
        lineas.append("\n— Calidad de las reversiones detectadas (retorno medio posterior) —")
        for cambio, grupo in fwd.groupby("cambio"):
            m12, m24, m72 = (
                grupo["ret_12h"].mean(),
                grupo["ret_24h"].mean(),
                grupo["ret_72h"].mean(),
            )
            lineas.append(
                f"  {cambio}  n={len(grupo):3d} · +12h {m12:+.2%} · +24h {m24:+.2%} · +72h {m72:+.2%}"
            )
    return "\n".join(lineas)
