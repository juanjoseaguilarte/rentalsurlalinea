"""Motor de backtest walk-forward para el sistema Power 4 en 1h.

Reglas de ejecución (conservadoras):
- Todo se decide al cierre de la vela t y se ejecuta contra la vela t+1.
- Las órdenes stop-entry de PC1/PV1 solo son válidas para la vela siguiente
  (si el setup sigue vivo se rearman).
- Con hueco en contra, stops y entradas se llenan al open (peor precio).
- Si stop y objetivo caben en la misma vela, se cuenta el stop (pesimista).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

import numpy as np
import pandas as pd

from ..analysis import compute_frame
from ..core.relevantes import ultimo
from ..core.senales import detectar_setup
from ..data.binance import resample_4h

LONG, SHORT = 1, -1


@dataclass
class Trade:
    señal: str            # "PC1" | "PV1" | "E1→E2" | "E3→E4"
    side: int             # 1 largo, -1 corto
    ts_in: pd.Timestamp
    entry: float
    stop: float
    target: Optional[float]
    etapa_4h: Optional[str]
    ts_out: Optional[pd.Timestamp] = None
    exit: Optional[float] = None
    motivo_salida: str = ""

    def pnl_pct(self, fees_bps: float) -> float:
        bruto = (
            self.exit / self.entry - 1 if self.side == LONG else 1 - self.exit / self.entry
        )
        return bruto - 2 * fees_bps / 10_000

    def r_multiple(self, fees_bps: float) -> float:
        riesgo = abs(self.entry - self.stop) / self.entry
        return self.pnl_pct(fees_bps) / riesgo if riesgo > 0 else np.nan


@dataclass
class BacktestResult:
    trades: list[Trade]
    equity: pd.Series
    transiciones: list
    transiciones_fwd: pd.DataFrame  # calidad de cada reversión detectada
    config_usada: dict = field(default_factory=dict)


def _mapa_etapa_4h(index_1h: pd.DatetimeIndex, etapas_4h: pd.Series) -> np.ndarray:
    """Etapa 4h vigente al cierre de cada vela 1h (última vela 4h ya cerrada)."""
    cierres_4h = etapas_4h.index + pd.Timedelta(hours=4)
    cierres_1h = index_1h + pd.Timedelta(hours=1)
    pos = np.searchsorted(cierres_4h.asi8, cierres_1h.asi8, side="right") - 1
    vals = etapas_4h.to_numpy()
    return np.array(
        [vals[p] if p >= 0 else None for p in pos], dtype=object
    )


def run_backtest(
    df_1h: pd.DataFrame,
    cfg,
    align_filter: bool = True,
    incluir_transiciones: bool = True,
    incluir_patrones: bool = True,
) -> BacktestResult:
    f1 = compute_frame(df_1h, cfg)
    df_4h = resample_4h(df_1h)
    f4 = compute_frame(df_4h, cfg)
    etapa4 = _mapa_etapa_4h(df_1h.index, f4.etapas)

    n = len(df_1h)
    o = df_1h["open"].to_numpy()
    h = df_1h["high"].to_numpy()
    l = df_1h["low"].to_numpy()
    etapas = f1.etapas.to_numpy()
    trans_por_idx = {t.idx: t for t in f1.transiciones}

    trades: list[Trade] = []
    position: Optional[Trade] = None
    pending_stop: Optional[dict] = None    # orden stop-entry PC1/PV1 para la vela t
    pending_market: Optional[dict] = None  # entrada a mercado (transición) en el open
    exit_next = ""                         # motivo de salida programada al open

    def cerrar(t: int, precio: float, motivo: str):
        nonlocal position
        position.ts_out = df_1h.index[t]
        position.exit = float(precio)
        position.motivo_salida = motivo
        trades.append(position)
        position = None

    for t in range(cfg.warmup + 1, n):
        # --- 1) salida programada al open (cambio de etapa / señal contraria)
        if position is not None and exit_next:
            cerrar(t, o[t], exit_next)
        exit_next = ""

        # --- 2) entrada a mercado programada (transiciones)
        if pending_market is not None and position is None:
            position = Trade(
                señal=pending_market["señal"],
                side=pending_market["side"],
                ts_in=df_1h.index[t],
                entry=float(o[t]),
                stop=pending_market["stop"],
                target=None,
                etapa_4h=pending_market["etapa_4h"],
            )
        pending_market = None

        # --- 3) orden stop-entry de la vela anterior
        if pending_stop is not None and position is None:
            side, trg = pending_stop["side"], pending_stop["trigger"]
            filled = (h[t] >= trg) if side == LONG else (l[t] <= trg)
            if filled:
                entry = max(o[t], trg) if side == LONG else min(o[t], trg)
                position = Trade(
                    señal=pending_stop["señal"],
                    side=side,
                    ts_in=df_1h.index[t],
                    entry=float(entry),
                    stop=pending_stop["stop"],
                    target=pending_stop["target"],
                    etapa_4h=pending_stop["etapa_4h"],
                )
        pending_stop = None

        # --- 4) gestión intravela de stop y objetivo (stop primero: pesimista)
        if position is not None and position.ts_in <= df_1h.index[t]:
            s, tg = position.stop, position.target
            if position.side == LONG:
                if o[t] <= s or l[t] <= s:
                    cerrar(t, min(o[t], s), "stop")
                elif tg is not None and (o[t] >= tg or h[t] >= tg):
                    cerrar(t, max(o[t], tg), "objetivo")
            else:
                if o[t] >= s or h[t] >= s:
                    cerrar(t, max(o[t], s), "stop")
                elif tg is not None and (o[t] <= tg or l[t] <= tg):
                    cerrar(t, min(o[t], tg), "objetivo")

        # --- 5) decisiones al cierre de la vela t
        etapa_t, etapa4_t = etapas[t], etapa4[t]
        if etapa_t is None:
            continue

        if position is not None:
            fuera = (position.side == LONG and etapa_t != "E2") or (
                position.side == SHORT and etapa_t != "E4"
            )
            if fuera:
                exit_next = f"salida de etapa ({etapa_t})"

        # Señal de transición en t (reversión)
        tr = trans_por_idx.get(t)
        if incluir_transiciones and tr is not None and tr.hacia in ("E2", "E4"):
            side = LONG if tr.hacia == "E2" else SHORT
            ok_align = not align_filter or etapa4_t == tr.hacia
            if ok_align:
                if position is not None and position.side != side and not exit_next:
                    exit_next = f"señal contraria ({tr.desde}→{tr.hacia})"
                if position is None or position.side != side:
                    piv = f1.pivots
                    if side == LONG:
                        ref = ultimo(piv, "mR", t)
                        stop = (ref.price if ref else min(l[t], l[t - 1])) * (1 - cfg.stop_buffer_pct)
                    else:
                        ref = ultimo(piv, "MR", t)
                        stop = (ref.price if ref else max(h[t], h[t - 1])) * (1 + cfg.stop_buffer_pct)
                    pending_market = {
                        "señal": f"{tr.desde}→{tr.hacia}",
                        "side": side,
                        "stop": float(stop),
                        "etapa_4h": etapa4_t,
                    }

        # Setup PC1/PV1 en t → stop-entry para t+1
        if incluir_patrones and position is None and pending_market is None:
            if etapa_t in ("E2", "E4"):
                ok_align = not align_filter or etapa4_t == etapa_t
                if ok_align:
                    setup = detectar_setup(t, df_1h, f1.ind, etapa_t, f1.pivots, cfg)
                    if setup is not None and setup.valido:
                        pending_stop = {
                            "señal": setup.kind,
                            "side": LONG if setup.kind == "PC1" else SHORT,
                            "trigger": setup.trigger,
                            "stop": setup.stop,
                            "target": setup.target,
                            "etapa_4h": etapa4_t,
                        }

    # Cerrar posición abierta al final de la serie
    if position is not None:
        cerrar(n - 1, df_1h["close"].iloc[-1], "fin de datos")

    equity = _equity(trades, df_1h.index, cfg.fees_bps)
    fwd = _calidad_transiciones(df_1h, f1.transiciones)
    return BacktestResult(
        trades=trades,
        equity=equity,
        transiciones=f1.transiciones,
        transiciones_fwd=fwd,
        config_usada={"align_filter": align_filter, "fees_bps": cfg.fees_bps},
    )


def _equity(trades: list[Trade], index: pd.DatetimeIndex, fees_bps: float) -> pd.Series:
    eq = pd.Series(1.0, index=index)
    valor = 1.0
    for tr in trades:
        valor *= 1 + tr.pnl_pct(fees_bps)
        eq.loc[tr.ts_out:] = valor
    return eq


def _calidad_transiciones(df: pd.DataFrame, transiciones) -> pd.DataFrame:
    """Retorno a 12/24/72 velas tras cada transición (¿fue una reversión real?)."""
    close = df["close"].to_numpy()
    filas = []
    for tr in transiciones:
        fila = {
            "ts": tr.ts,
            "cambio": f"{tr.desde}→{tr.hacia}",
            "precio": tr.precio,
            "atajo": tr.atajo,
        }
        for horas in (12, 24, 72):
            j = tr.idx + horas
            fila[f"ret_{horas}h"] = (
                close[j] / close[tr.idx] - 1 if j < len(close) else np.nan
            )
        filas.append(fila)
    return pd.DataFrame(filas)
