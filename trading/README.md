# Power 4 · Detección de reversiones en velas japonesas (BTC, 1h)

Algoritmo 100% objetivo basado en el **Método Power 4**: clasifica cada vela
en una de las 4 etapas del ciclo de vida del activo y emite señales de
reversión (cambios de etapa), avisos de acunamiento y patrones operativos
PC1/PV1, con marco operativo **1h** y referencia **4h**.

Es un proyecto independiente de la web (carpeta `trading/` autónoma).

## Instalación

```bash
cd trading
pip install -r requirements.txt          # pandas + requests
pip install matplotlib pytest            # opcionales: gráficos y tests
```

## Uso

```bash
cd trading

# Estado actual: etapa 1h/4h, alineación, niveles y setups (GeckoTerminal)
python -m power4 live [--refresh]

# Backtest con histórico 1h de Binance (BTCUSDT)
python -m power4 backtest --start 2021-01-01 [--end 2025-01-01] \
    [--fees-bps 5] [--no-align-filter] [--csv trades.csv]

# Gráfico de velas con etapas, Relevantes y transiciones (PNG)
python -m power4 chart --last 300

# Tests
python -m pytest tests/
```

## Reglas implementadas

**Etapas (máquina de estados secuencial, al cierre de cada vela):**

| Transición | Condición |
|---|---|
| E1→E2 (reversión alcista) | cierre > último Máximo Relevante conocido de la E1 con la MMS20 girada al alza |
| E2→E3 | pérdida del último mínimo Relevante creciente con cierre bajo la MMS20 (o 3 cierres bajo la media cayendo) |
| E3→E4 (reversión bajista) | pérdida de la base de la Etapa 3 (mínimo de sus mR) |
| E4→E1 | cierre sobre la MMS20, media ya no cae y sin nuevos mR decrecientes |
| Atajos E1→E4 / E3→E2 | mercados que saltan fases, marcados como `atajo` |

**Relevantes:** MR/mR con 3 velas a cada lado. Cada pivote se confirma 3
velas después de formarse (`confirmed_at = idx + 3`) y el algoritmo nunca
usa un pivote antes de su confirmación — sin lookahead, ni en vivo ni en
backtest (verificado por test de invarianza por prefijos).

**PC1/PV1:** en E2/E4, tras nuevo extremo, inhalación de 3–5 máximos
decrecientes / mínimos crecientes. Entry ±0.3% de la vela previa, stop ±1%
del extremo de las dos últimas velas, objetivo en el último MR/mR. Filtros:

- **Regla de "cerca"**: distancia a la MMS20 ≤ 1.5% (análogo 1h del 4% diario).
- **Vías del tren**: MMS20 y MMS40 con pendiente a favor.
- **Explosividad**: se descarta el primer setup tras un movimiento vertical
  (vela > 2.5×ATR o distancia > 3 ATR en las 12 velas previas).
- **GVS**: inhalación que arranca con Gran Vela Sólida en contra → inválido.
- **Regla de los 2 días**: el stop es estático (nunca se mueve).

**Alineamiento (regla de oro):** solo se opera si el 4h está en la misma
etapa que el 1h (PC1 exige E2/E2; PV1 exige E4/E4). Desactivable con
`--no-align-filter` para comparar.

**Acunamiento:** cierres pegados a la MMS20 al final de E1/E3 con la media
girándose y rangos contrayéndose → aviso de transición inminente (nunca
entrada por sí solo).

Todos los umbrales están en `power4/config.py` (`Power4Config`).

## Datos

- **En vivo**: GeckoTerminal, pool cbBTC/USDC de Base (el mismo que usa la
  skill btc-lp-hedger), con caché incremental en `data_cache/` y fallback a
  caché si la red falla.
- **Backtest**: Binance `GET /api/v3/klines` BTCUSDT 1h, paginado y cacheado
  incrementalmente. El 4h del backtest se resamplea desde el 1h.

## Backtest: supuestos

- Decisión al cierre de t, ejecución contra t+1; con hueco en contra se
  llena al open (peor precio); si stop y objetivo caben en la misma vela
  cuenta el stop. Una posición a la vez, comisión 5 pb por lado por defecto.
- Salidas: stop → objetivo → cambio de etapa → señal contraria.
- Además de los trades, imprime la **calidad de cada reversión detectada**
  (retorno medio a 12/24/72 velas tras cada transición).

## Validación pendiente con histórico real

El entorno donde se desarrolló esto tiene bloqueados `api.binance.com` y
`api.geckoterminal.com`, así que el backtest con histórico real aún no se ha
ejecutado. Episodios de calibración sugeridos al correrlo por primera vez:

1. `python -m power4 backtest --start 2021-01-01 --end 2022-06-01` — debe
   detectar E3→E4 cerca del techo de noviembre de 2021.
2. `python -m power4 backtest --start 2023-06-01 --end 2024-04-01` — debe
   detectar E1→E2 en la rotura de octubre de 2023 / enero de 2024.

Si genera demasiadas transiciones (ruido), subir `flat_eps` o `warmup` en
`config.py`; si llega tarde a las reversiones, bajar `pivot_wing` (más
sensible) sabiendo que aumenta el ruido.
