"""Histórico de velas 1h de Binance para el backtest.

API pública `GET /api/v3/klines`, paginada hacia delante con startTime y
cacheada de forma incremental en data_cache/.
"""
from __future__ import annotations

import time
from datetime import datetime, timezone

import pandas as pd
import requests

from . import cache

BASE_URL = "https://api.binance.com/api/v3/klines"
PAGE_LIMIT = 1000
INTERVAL_SECONDS = {"1h": 3600}


def _fetch_page(symbol: str, interval: str, start_ms: int) -> list[list]:
    resp = requests.get(
        BASE_URL,
        params={
            "symbol": symbol,
            "interval": interval,
            "startTime": start_ms,
            "limit": PAGE_LIMIT,
        },
        timeout=30,
    )
    resp.raise_for_status()
    # Kline: [openTime(ms), o, h, l, c, v, closeTime, ...] → [ts(s),o,h,l,c,v]
    return [
        [int(k[0] // 1000), float(k[1]), float(k[2]), float(k[3]), float(k[4]), float(k[5])]
        for k in resp.json()
    ]


def load_history(
    symbol: str = "BTCUSDT",
    interval: str = "1h",
    start: str = "2020-01-01",
    verbose: bool = True,
) -> pd.DataFrame:
    """Devuelve el histórico [start, ahora) como DataFrame OHLCV, usando y
    actualizando la caché incremental. Solo velas cerradas."""
    name = f"binance_{symbol}_{interval}"
    stored = cache.load(name)
    candles = stored["data"] if stored else []

    start_ts = int(datetime.fromisoformat(start).replace(tzinfo=timezone.utc).timestamp())
    step = INTERVAL_SECONDS[interval]
    now_ts = int(time.time())
    last_closed = (now_ts // step) * step - step  # última vela ya cerrada

    if candles and candles[0][0] > start_ts:
        # La caché empieza más tarde de lo pedido: rehacer desde el inicio
        candles = []

    next_ts = candles[-1][0] + step if candles else start_ts
    fetched = 0
    while next_ts <= last_closed:
        page = _fetch_page(symbol, interval, next_ts * 1000)
        if not page:
            break
        candles = cache.merge(candles, page)
        fetched += len(page)
        next_ts = candles[-1][0] + step
        if verbose:
            ultimo = datetime.fromtimestamp(candles[-1][0], tz=timezone.utc)
            print(f"  Binance {symbol} {interval}: {len(candles)} velas (hasta {ultimo:%Y-%m-%d %H:%M})")
        if len(page) < PAGE_LIMIT:
            break
        time.sleep(0.25)

    if fetched:
        cache.save(name, candles)

    df = cache.to_df(candles)
    df = df[df.index >= pd.Timestamp(start, tz="UTC")]
    # Descartar cualquier vela aún abierta
    df = df[df.index <= pd.Timestamp(last_closed, unit="s", tz="UTC")]
    return df


def resample_4h(df_1h: pd.DataFrame) -> pd.DataFrame:
    """Agrega el 1h a velas 4h alineadas a 00/04/08... UTC."""
    agg = {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}
    df = df_1h.resample("4h", label="left", closed="left").agg(agg).dropna()
    return df
