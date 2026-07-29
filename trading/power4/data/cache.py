"""Caché JSON de velas: {last_ts, data: [[ts,o,h,l,c,v], ...]}.

Mismo formato incremental que la memoria de velas de la skill btc-lp-hedger.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

import pandas as pd

CACHE_DIR = Path(__file__).resolve().parents[2] / "data_cache"


def cache_path(name: str) -> Path:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    return CACHE_DIR / f"{name}.json"


def load(name: str) -> Optional[dict]:
    path = cache_path(name)
    if not path.exists():
        return None
    try:
        stored = json.loads(path.read_text())
        if not stored.get("data"):
            return None
        return stored
    except (json.JSONDecodeError, OSError):
        return None


def save(name: str, candles: list[list]) -> None:
    if not candles:
        return
    payload = {"last_ts": candles[-1][0], "data": candles}
    cache_path(name).write_text(json.dumps(payload))


def merge(old: list[list], new: list[list], max_len: Optional[int] = None) -> list[list]:
    """Añade solo velas más nuevas que la última cacheada."""
    if not old:
        merged = list(new)
    else:
        last_ts = old[-1][0]
        merged = list(old) + [c for c in new if c[0] > last_ts]
    if max_len:
        merged = merged[-max_len:]
    return merged


def to_df(candles: list[list]) -> pd.DataFrame:
    df = pd.DataFrame(candles, columns=["ts", "open", "high", "low", "close", "volume"])
    df.index = pd.to_datetime(df["ts"], unit="s", utc=True)
    df.index.name = "time"
    return df.drop(columns=["ts"]).astype(float)
