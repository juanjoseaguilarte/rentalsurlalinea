import numpy as np

from conftest import make_df
from power4.core.indicators import compute_indicators
from power4.core.relevantes import detectar_relevantes
from power4.core.senales import (
    Setup,
    acunamiento,
    detectar_setup,
    respiracion,
    _es_gvs,
    _hubo_explosion,
    EXHAL_ALCISTA,
    INHALACION,
)


def _df_pc1(n_inhal=4):
    """Suave tendencia alcista, nuevo máximo en la vela 90 e inhalación de n velas."""
    closes = [100 * 1.0005 ** i for i in range(90)]
    closes.append(closes[-1] * 1.004)          # vela 90: nuevo máximo
    for _ in range(n_inhal):
        closes.append(closes[-1] * 0.999)      # máximos decrecientes hacia la media
    closes = np.array(closes)
    return make_df(closes, highs=closes + 0.3, lows=closes - 0.3)


def test_pc1_activo_con_trigger_stop_y_objetivo(cfg):
    df = _df_pc1(4)
    ind = compute_indicators(df, cfg)
    pivots = detectar_relevantes(df, cfg.pivot_wing)
    t = len(df) - 1
    setup = detectar_setup(t, df, ind, "E2", pivots, cfg)
    assert setup is not None and setup.valido, getattr(setup, "motivo", "sin setup")
    assert setup.kind == "PC1"
    assert setup.inhal_count == 4
    assert setup.trigger == df["high"].iloc[t] * (1 + cfg.trigger_pct)
    assert setup.stop == min(df["low"].iloc[t], df["low"].iloc[t - 1]) * (1 - cfg.stop_buffer_pct)
    assert setup.target == df["high"].iloc[90]  # el MR del nuevo máximo


def test_pc1_requiere_racha_de_3_a_5(cfg):
    for n_inhal, esperado in [(2, False), (3, True), (5, True), (6, False)]:
        df = _df_pc1(n_inhal)
        ind = compute_indicators(df, cfg)
        pivots = detectar_relevantes(df, cfg.pivot_wing)
        setup = detectar_setup(len(df) - 1, df, ind, "E2", pivots, cfg)
        if esperado:
            assert setup is not None and setup.valido, f"n={n_inhal}: {setup}"
        else:
            assert setup is None, f"n={n_inhal} no debería dar setup"


def test_pv1_espejo(cfg):
    df_up = _df_pc1(4)
    # Espejo vertical de la serie alcista → escenario PV1 en E4
    ref = 250.0
    closes = ref - df_up["close"].to_numpy()
    df = make_df(closes, highs=closes + 0.3, lows=closes - 0.3)
    ind = compute_indicators(df, cfg)
    pivots = detectar_relevantes(df, cfg.pivot_wing)
    t = len(df) - 1
    setup = detectar_setup(t, df, ind, "E4", pivots, cfg)
    assert setup is not None and setup.valido, getattr(setup, "motivo", "sin setup")
    assert setup.kind == "PV1"
    assert setup.trigger == df["low"].iloc[t] * (1 - cfg.trigger_pct)
    assert setup.stop == max(df["high"].iloc[t], df["high"].iloc[t - 1]) * (1 + cfg.stop_buffer_pct)


def test_setup_none_fuera_de_e2_e4(cfg):
    df = _df_pc1(4)
    ind = compute_indicators(df, cfg)
    pivots = detectar_relevantes(df, cfg.pivot_wing)
    assert detectar_setup(len(df) - 1, df, ind, "E1", pivots, cfg) is None
    assert detectar_setup(len(df) - 1, df, ind, "E3", pivots, cfg) is None


def test_filtro_gvs(cfg):
    df = _df_pc1(4)
    # Convertimos la primera vela de la inhalación (91) en una Gran Vela Sólida roja
    i = 91
    o = df["close"].iloc[90]
    c = o * 0.988
    df.iloc[i, df.columns.get_loc("open")] = o
    df.iloc[i, df.columns.get_loc("close")] = c
    df.iloc[i, df.columns.get_loc("high")] = o + 0.05
    df.iloc[i, df.columns.get_loc("low")] = c - 0.05
    ind = compute_indicators(df, cfg)
    assert _es_gvs(i, df, ind, contra_alcista=True, cfg=cfg)
    # Y la misma vela no es GVS "en contra" para un corto (es bajista, a favor)
    assert not _es_gvs(i, df, ind, contra_alcista=False, cfg=cfg)


def test_filtro_explosividad(cfg):
    df = _df_pc1(4)
    ind = compute_indicators(df, cfg)
    assert not _hubo_explosion(90, df, ind, cfg)
    # Metemos una vela vertical justo antes de la inhalación
    i = 88
    df.iloc[i, df.columns.get_loc("high")] = df["close"].iloc[i] + 5.0
    ind2 = compute_indicators(df, cfg)
    assert _hubo_explosion(90, df, ind2, cfg)


def test_respiracion_exhalacion_e_inhalacion(cfg):
    # Subida vertical sostenida: el precio se aleja de la MMS20 → exhalación
    closes = np.concatenate([np.full(40, 100.0), 100 * 1.01 ** np.arange(1, 21)])
    df = make_df(closes, highs=closes + 0.3, lows=closes - 0.3)
    ind = compute_indicators(df, cfg)
    assert respiracion(len(df) - 1, df, ind, cfg) == EXHAL_ALCISTA
    # Vuelta hacia la media tras el impulso → inhalación
    closes2 = np.concatenate([closes, closes[-1] * 0.995 ** np.arange(1, 5)])
    df2 = make_df(closes2, highs=closes2 + 0.3, lows=closes2 - 0.3)
    ind2 = compute_indicators(df2, cfg)
    assert respiracion(len(df2) - 1, df2, ind2, cfg) == INHALACION


def test_acunamiento_alcista(cfg):
    # Caída, aplanamiento y apoyo sobre la MMS20 con rangos contrayéndose
    closes = np.concatenate([
        np.linspace(100, 90, 40),          # caída (la media baja)
        np.full(10, 90.0),                  # aplanamiento
        90 * 1.0004 ** np.arange(1, 31),    # apoyo con deriva suave al alza
    ])
    n = len(closes)
    r = np.concatenate([np.full(50, 0.4), np.linspace(0.4, 0.1, n - 50)])  # contracción en el apoyo
    df = make_df(closes, highs=closes + r, lows=closes - r)
    ind = compute_indicators(df, cfg)
    hits = [t for t in range(len(df)) if acunamiento(t, df, ind, "E1", cfg)]
    assert hits, "el acunamiento alcista debería detectarse en la fase de apoyo"
    assert all(t >= 50 for t in hits)
    # Nunca se señala en etapas tendenciales
    assert not any(acunamiento(t, df, ind, "E2", cfg) for t in hits)
