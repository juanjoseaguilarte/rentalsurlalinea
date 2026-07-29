"""Configuración central del algoritmo Power 4.

Todos los umbrales del método viven aquí para poder calibrarlos sin tocar
la lógica. Los valores por defecto están pensados para el marco operativo
de 1h con referencia en 4h.
"""
from dataclasses import dataclass, field


@dataclass
class Power4Config:
    # Medias móviles simples (MMS20 / MMS40 del método)
    sma_fast: int = 20
    sma_slow: int = 40

    # Pendiente: slope(s, k) = (s[t] - s[t-k]) / s[t-k]; |slope| <= flat_eps => plana
    slope_k: int = 4
    flat_eps: float = 0.0005

    # ATR para normalizar distancias y tamaños de vela
    atr_n: int = 14

    # Relevantes: MR/mR con `pivot_wing` velas a cada lado; se confirman
    # `pivot_wing` velas después de formarse (anti-lookahead)
    pivot_wing: int = 3

    # Barras de calentamiento antes de clasificar etapas
    warmup: int = 50

    # Regla de "cerca": distancia máxima a la MMS20 para operar un patrón.
    # El método usa 4% en diario; en 1h el rango por vela es menor.
    near_sma_pct: float = 0.015

    # Exhalación / inhalación
    exhal_atr: float = 2.0        # |dist| en ATRs para considerar exhalación
    exhal_extreme_atr: float = 3.0  # distancia "explosiva"
    inhal_contract_bars: int = 2  # velas seguidas acercándose a la media

    # Patrones PC1 / PV1
    inhal_min: int = 3            # máximos/mínimos consecutivos mínimos
    inhal_max: int = 5
    trigger_pct: float = 0.003    # gatillo ±0.3% sobre la vela previa
    stop_buffer_pct: float = 0.01  # stop ±1% del extremo de referencia
    new_extreme_lookback: int = 12  # la inhalación debe arrancar de un nuevo extremo

    # Acunamiento
    acun_bars: int = 6            # velas apoyadas en la media
    acun_band: float = 0.004      # banda alrededor de la MMS20 (0.4%)
    acun_max_cruces: int = 1      # cierres permitidos al otro lado de la media

    # Filtro de explosividad: no operar el primer setup tras un movimiento vertical
    explos_range_atr: float = 2.5  # vela con rango > 2.5×ATR
    explos_lookback: int = 12      # ventana donde buscar la vela explosiva

    # Filtro GVS: Gran Vela Sólida en contra al inicio de la inhalación
    gvs_body_ratio: float = 0.7
    gvs_range_atr: float = 1.5

    # Salida de E4: velas sin un nuevo mínimo relevante decreciente
    e4_quiet_bars: int = 8

    # Regla de los 2 días: velas iniciales con el stop congelado (si hubiera trailing)
    stop_freeze_bars: int = 2

    # Backtest
    fees_bps: float = 5.0         # comisión por lado en puntos básicos

    # Datos
    binance_symbol: str = "BTCUSDT"
    gecko_network: str = "base"
    gecko_pool: str = "0xfbb6eed8e7aa03b138556eedaf5d271a5e1e43ef"
    gecko_timeframes: dict = field(default_factory=lambda: {
        "1h": {"endpoint": "hour", "aggregate": 1, "limit": 168, "seconds": 3600},
        "4h": {"endpoint": "hour", "aggregate": 4, "limit": 90, "seconds": 14400},
    })


DEFAULT = Power4Config()
