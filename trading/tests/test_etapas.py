from conftest import make_df
from power4.core.indicators import compute_indicators
from power4.core.etapas import clasificar_etapas
from power4.core.relevantes import detectar_relevantes, ultimo


def test_ciclo_completo_orden_de_transiciones(df_ciclo, cfg):
    ind = compute_indicators(df_ciclo, cfg)
    etapas, trans = clasificar_etapas(df_ciclo, ind, cfg)

    pares = [(t.desde, t.hacia) for t in trans]
    # Las dos reversiones núcleo deben aparecer y en orden
    assert ("E1", "E2") in pares
    assert ("E3", "E4") in pares
    i_12 = pares.index(("E1", "E2"))
    i_34 = pares.index(("E3", "E4"))
    assert i_12 < i_34

    # La serie recorre las cuatro etapas y termina bajista
    assert set(etapas.dropna().unique()) == {"E1", "E2", "E3", "E4"}
    assert etapas.iloc[-1] == "E4"


def test_e1_a_e2_solo_tras_romper_mr(df_ciclo, cfg):
    ind = compute_indicators(df_ciclo, cfg)
    pivots = detectar_relevantes(df_ciclo, cfg.pivot_wing)
    _, trans = clasificar_etapas(df_ciclo, ind, cfg, pivots)
    t12 = next(t for t in trans if (t.desde, t.hacia) == ("E1", "E2"))
    # En la vela de la transición, el cierre supera algún MR ya confirmado
    mr = ultimo(pivots, "MR", t12.idx)
    assert mr is not None
    assert df_ciclo["close"].iloc[t12.idx] > mr.price


def test_sin_etapas_antes_del_warmup(df_ciclo, cfg):
    ind = compute_indicators(df_ciclo, cfg)
    etapas, _ = clasificar_etapas(df_ciclo, ind, cfg)
    assert etapas.iloc[: cfg.warmup].isna().all()
    assert etapas.iloc[cfg.warmup:].notna().all()


def test_causalidad_por_prefijos(df_ciclo, cfg):
    """Anti-lookahead: la etapa en t sobre df[:t+1] == etapa en t sobre el df completo."""
    ind_full = compute_indicators(df_ciclo, cfg)
    etapas_full, _ = clasificar_etapas(df_ciclo, ind_full, cfg)
    for t in range(cfg.warmup + 5, len(df_ciclo), 37):
        sub = df_ciclo.iloc[: t + 1]
        ind_sub = compute_indicators(sub, cfg)
        etapas_sub, _ = clasificar_etapas(sub, ind_sub, cfg)
        assert etapas_sub.iloc[-1] == etapas_full.iloc[t], f"divergencia en t={t}"
