"""Velas en vivo desde GeckoTerminal (pool cbBTC/USDC en Base).

Mismo pool, endpoints y política de caché que la skill btc-lp-hedger:
si la caché tiene menos de un periodo de antigüedad se reutiliza; si la
red falla se devuelve la caché con un aviso de datos obsoletos.
"""
from __future__ import annotations

import time

import pandas as pd
import requests

from . import cache

API = "https://api.geckoterminal.com/api/v2/networks/{network}/pools/{pool}/ohlcv/{endpoint}"


class GeckoResult:
    def __init__(self, df: pd.DataFrame, from_cache: bool, stale: bool, error: str = ""):
        self.df = df
        self.from_cache = from_cache
        self.stale = stale
        self.error = error


def _fetch(cfg, tf: str) -> list[list]:
    spec = cfg.gecko_timeframes[tf]
    url = API.format(network=cfg.gecko_network, pool=cfg.gecko_pool, endpoint=spec["endpoint"])
    resp = requests.get(
        url,
        params={"aggregate": spec["aggregate"], "limit": spec["limit"]},
        headers={"Accept": "application/json"},
        timeout=30,
    )
    resp.raise_for_status()
    ohlcv = resp.json().get("data", {}).get("attributes", {}).get("ohlcv_list", [])
    # GeckoTerminal puede devolver de más nuevo a más antiguo; normalizamos
    candles = sorted(
        ([int(c[0]), float(c[1]), float(c[2]), float(c[3]), float(c[4]), float(c[5])] for c in ohlcv),
        key=lambda c: c[0],
    )
    return candles


def load_candles(cfg, tf: str, refresh: bool = False) -> GeckoResult:
    """Carga velas del marco `tf` ('1h' | '4h') con caché incremental."""
    spec = cfg.gecko_timeframes[tf]
    name = f"gecko_{tf}"
    stored = cache.load(name)
    now = time.time()

    if (
        stored
        and not refresh
        and now - stored["last_ts"] < spec["seconds"]
    ):
        return GeckoResult(cache.to_df(stored["data"]), from_cache=True, stale=False)

    try:
        nuevas = _fetch(cfg, tf)
    except requests.RequestException as exc:
        if stored:
            return GeckoResult(
                cache.to_df(stored["data"]), from_cache=True, stale=True, error=str(exc)
            )
        raise

    merged = cache.merge(stored["data"] if stored else [], nuevas, max_len=spec["limit"])
    cache.save(name, merged)
    return GeckoResult(cache.to_df(merged), from_cache=False, stale=False)
