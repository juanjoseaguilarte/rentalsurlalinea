"""Gráfico de velas con etapas, Relevantes y setups (matplotlib)."""
from __future__ import annotations

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

from .analysis import compute_frame

COLOR_ETAPA = {"E1": "#e8e4d8", "E2": "#d9ead3", "E3": "#fce8d6", "E4": "#f4cccc"}


def plot(df: pd.DataFrame, cfg, out: str | None = None) -> str:
    f = compute_frame(df, cfg)
    fig, ax = plt.subplots(figsize=(16, 8))

    # Fondo por etapa
    etapas = f.etapas
    inicio = None
    actual = None
    for i, e in enumerate(list(etapas) + [None]):
        if e != actual:
            if actual is not None and actual in COLOR_ETAPA and inicio is not None:
                ax.axvspan(inicio - 0.5, i - 0.5, color=COLOR_ETAPA[actual], alpha=0.5, lw=0)
            inicio, actual = i, e

    # Velas
    x = range(len(df))
    for i, (_, row) in enumerate(df.iterrows()):
        color = "#2e7d32" if row["close"] >= row["open"] else "#c62828"
        ax.plot([i, i], [row["low"], row["high"]], color=color, lw=0.7)
        ax.plot([i, i], [row["open"], row["close"]], color=color, lw=2.4, solid_capstyle="butt")

    ax.plot(x, f.ind["sma20"], color="#1a56a0", lw=1.4, label=f"MMS{cfg.sma_fast}")
    ax.plot(x, f.ind["sma40"], color="#8a4fbf", lw=1.4, label=f"MMS{cfg.sma_slow}")

    for p in f.pivots:
        if p.kind == "MR":
            ax.plot(p.idx, p.price, marker="v", color="#c62828", ms=7, mec="k", mew=0.4)
        else:
            ax.plot(p.idx, p.price, marker="^", color="#2e7d32", ms=7, mec="k", mew=0.4)

    for tr in f.transiciones:
        ax.axvline(tr.idx, color="#555", lw=0.8, ls="--", alpha=0.7)
        ax.annotate(
            f"{tr.desde}→{tr.hacia}",
            (tr.idx, df["high"].max()),
            fontsize=8,
            rotation=90,
            va="top",
        )

    ax.set_title(f"Power 4 · {df.index[0]:%Y-%m-%d} → {df.index[-1]:%Y-%m-%d %H:%M} UTC")
    ax.legend(loc="upper left")
    ax.margins(x=0.01)
    fig.tight_layout()

    destino = out or str(Path(__file__).resolve().parents[1] / "data_cache" / "power4_chart.png")
    fig.savefig(destino, dpi=110)
    plt.close(fig)
    return destino
