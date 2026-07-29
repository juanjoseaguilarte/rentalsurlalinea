"""CLI del sistema Power 4.

Comandos:
  live      estado actual 1h/4h con datos de GeckoTerminal
  backtest  validación sobre histórico 1h de Binance
  chart     gráfico de velas con etapas y señales (requiere matplotlib)
"""
from __future__ import annotations

import argparse
import sys

from .analysis import analyze
from .config import Power4Config

ETIQUETA = {
    "E1": "E1 · Acumulación",
    "E2": "E2 · Tendencia alcista",
    "E3": "E3 · Distribución",
    "E4": "E4 · Tendencia bajista",
}
RESPIRACION = {
    "exhalacion_alcista": "exhalación alcista (impulso)",
    "exhalacion_bajista": "exhalación bajista (desplome)",
    "inhalacion": "inhalación (vuelta a la zona de valor)",
    "neutral": "neutral",
}


def cmd_live(args) -> int:
    from .data import gecko

    cfg = Power4Config()
    try:
        r1 = gecko.load_candles(cfg, "1h", refresh=args.refresh)
        r4 = gecko.load_candles(cfg, "4h", refresh=args.refresh)
    except Exception as exc:
        print(f"Error al obtener velas de GeckoTerminal y sin caché disponible: {exc}")
        return 1

    for tf, r in (("1h", r1), ("4h", r4)):
        origen = "caché" if r.from_cache else "descargadas"
        aviso = "  ⚠ DATOS OBSOLETOS (fallo de red)" if r.stale else ""
        print(f"[{tf}] {len(r.df)} velas ({origen}, última {r.df.index[-1]:%Y-%m-%d %H:%M} UTC){aviso}")

    if len(r1.df) <= cfg.warmup:
        print(f"Insuficientes velas 1h ({len(r1.df)}) para clasificar etapas (mínimo {cfg.warmup + 1}).")
        return 1

    st = analyze(r1.df, r4.df, cfg)
    print()
    print("═" * 64)
    print(f"POWER 4 · BTC  1H (operativo) + 4H (referencia)   {st.ts:%Y-%m-%d %H:%M} UTC")
    print("═" * 64)
    print(f"Precio:        ${st.precio:,.0f}")
    print(f"MMS20 (1h):    ${st.sma20:,.0f}   MMS40 (1h): ${st.sma40:,.0f}")
    print(f"Distancia:     {st.dist_pct:+.2%} / {st.dist_atr:+.1f} ATR → {RESPIRACION[st.respiracion]}")
    e4h = ETIQUETA.get(st.etapa_4h, "sin datos suficientes")
    print(f"Etapa 1H:      {ETIQUETA.get(st.etapa_1h, '—')}")
    print(f"Etapa 4H:      {e4h}")
    alineacion = "SÍ (operable)" if st.alineado else (
        "solo por lado" if st.alineado_lado else "NO (esperar)"
    )
    print(f"Alineación:    {alineacion}")
    if st.mr:
        print(f"MR último:     ${st.mr.price:,.0f}  ({st.mr.ts:%m-%d %H:%M})  ← resistencia/objetivo")
    if st.mr_bajo:
        print(f"mR último:     ${st.mr_bajo.price:,.0f}  ({st.mr_bajo.ts:%m-%d %H:%M})  ← soporte")
    print(f"Acunamiento:   {'SÍ — posible transición inminente' if st.acunamiento else 'no'}")

    if st.setup is None:
        print("Patrón:        ninguno")
    elif st.setup.valido:
        s = st.setup
        print(f"Patrón:        {s.kind} ACTIVO (inhalación de {s.inhal_count} velas)")
        print(f"  Entry:       ${s.trigger:,.0f}")
        print(f"  Stop:        ${s.stop:,.0f}")
        print(f"  Objetivo:    ${s.target:,.0f}")
    else:
        print(f"Patrón:        {st.setup.kind} descartado — {st.setup.motivo}")

    if st.transiciones_recientes:
        print("Transiciones recientes (1h):")
        for tr in st.transiciones_recientes:
            marca = " (atajo)" if tr.atajo else ""
            print(f"  {tr.desde}→{tr.hacia}{marca} @ {tr.ts:%Y-%m-%d %H:%M} (${tr.precio:,.0f}) — {tr.motivo}")
    return 0


def cmd_backtest(args) -> int:
    from .backtest import informe, run_backtest, trades_a_df
    from .data import binance

    cfg = Power4Config()
    if args.fees_bps is not None:
        cfg.fees_bps = args.fees_bps

    print(f"Cargando histórico {cfg.binance_symbol} 1h desde {args.start}…")
    try:
        df = binance.load_history(cfg.binance_symbol, "1h", start=args.start)
    except Exception as exc:
        print(f"Error al descargar histórico de Binance: {exc}")
        return 1
    if args.end:
        df = df[df.index < args.end]
    print(f"{len(df)} velas · {df.index[0]:%Y-%m-%d} → {df.index[-1]:%Y-%m-%d %H:%M} UTC")

    result = run_backtest(df, cfg, align_filter=not args.no_align_filter)
    print(informe(result, cfg.fees_bps))

    if args.csv:
        trades_a_df(result.trades, cfg.fees_bps).to_csv(args.csv, index=False)
        print(f"\nOperaciones guardadas en {args.csv}")
    return 0


def cmd_chart(args) -> int:
    from .data import gecko

    cfg = Power4Config()
    try:
        from . import chart
    except ImportError:
        print("El gráfico requiere matplotlib: pip install matplotlib")
        return 1
    r1 = gecko.load_candles(cfg, "1h", refresh=args.refresh)
    out = chart.plot(r1.df.iloc[-args.last:], cfg, args.out)
    print(f"Gráfico guardado en {out}")
    return 0


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="power4", description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_live = sub.add_parser("live", help="estado actual con datos de GeckoTerminal")
    p_live.add_argument("--refresh", action="store_true", help="fuerza la descarga aunque haya caché fresca")
    p_live.set_defaults(func=cmd_live)

    p_bt = sub.add_parser("backtest", help="backtest sobre histórico de Binance")
    p_bt.add_argument("--start", default="2021-01-01")
    p_bt.add_argument("--end", default=None)
    p_bt.add_argument("--fees-bps", type=float, default=None, help="comisión por lado en pb (default 5)")
    p_bt.add_argument("--no-align-filter", action="store_true", help="sin filtro de alineamiento 1h/4h")
    p_bt.add_argument("--csv", default=None, help="ruta para volcar las operaciones")
    p_bt.set_defaults(func=cmd_backtest)

    p_ch = sub.add_parser("chart", help="gráfico de velas con etapas y señales")
    p_ch.add_argument("--last", type=int, default=300, help="número de velas a dibujar")
    p_ch.add_argument("--refresh", action="store_true")
    p_ch.add_argument("--out", default=None, help="ruta del PNG de salida")
    p_ch.set_defaults(func=cmd_chart)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
