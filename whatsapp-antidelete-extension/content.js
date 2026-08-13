/*
 * WA Anti-Delete
 * -----------------------------------------------------------------------------
 * Estrategia:
 *   1. Observamos el DOM de WhatsApp Web. Cada vez que aparece una burbuja de
 *      mensaje con texto, guardamos su contenido (indexado por el data-id que
 *      WhatsApp asigna a cada mensaje) en chrome.storage.local.
 *   2. Cuando WhatsApp reemplaza una burbuja por el texto placeholder de
 *      "mensaje eliminado", buscamos el data-id en nuestro registro y volvemos
 *      a inyectar el texto original marcado visualmente.
 *
 * No usamos ninguna API interna de WhatsApp ni interceptamos tráfico: solo
 * leemos lo que ya se ha renderizado en pantalla. Por eso solo funciona para
 * mensajes que llegaron mientras la pestaña estaba abierta con la extensión.
 */

(() => {
  "use strict";

  const STORE_KEY = "wa_antidelete_messages";
  const MAX_STORED = 5000; // límite para no crecer sin control

  // Frases placeholder que usa WhatsApp al eliminar un mensaje, en varios idiomas.
  const DELETED_MARKERS = [
    "this message was deleted",
    "you deleted this message",
    "este mensaje fue eliminado",
    "eliminaste este mensaje",
    "has eliminado este mensaje",
    "se eliminó este mensaje",
    "aquest missatge s'ha eliminat",
    "esta mensagem foi apagada",
    "ce message a été supprimé",
    "diese nachricht wurde gelöscht",
  ];

  /** Caché en memoria: dataId -> { text, ts, author } */
  let cache = {};

  /* ---------------------------------------------------------------------- */
  /* Persistencia                                                            */
  /* ---------------------------------------------------------------------- */

  function loadCache() {
    try {
      chrome.storage.local.get([STORE_KEY], (res) => {
        cache = (res && res[STORE_KEY]) || {};
      });
    } catch (e) {
      cache = {};
    }
  }

  let saveTimer = null;
  function scheduleSave() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      pruneCache();
      try {
        chrome.storage.local.set({ [STORE_KEY]: cache });
      } catch (e) {
        /* extensión recargada; se ignora */
      }
    }, 800);
  }

  function pruneCache() {
    const keys = Object.keys(cache);
    if (keys.length <= MAX_STORED) return;
    keys
      .sort((a, b) => (cache[a].ts || 0) - (cache[b].ts || 0))
      .slice(0, keys.length - MAX_STORED)
      .forEach((k) => delete cache[k]);
  }

  /* ---------------------------------------------------------------------- */
  /* Utilidades de DOM                                                       */
  /* ---------------------------------------------------------------------- */

  function getMessageNode(el) {
    return el.closest ? el.closest("[data-id]") : null;
  }

  function getDataId(node) {
    return node ? node.getAttribute("data-id") : null;
  }

  // Extrae el texto visible del mensaje sin arrastrar hora, checks, etc.
  function extractText(node) {
    const span = node.querySelector(
      "span.selectable-text.copyable-text, div.copyable-text span.selectable-text"
    );
    if (span && span.textContent && span.textContent.trim()) {
      return span.textContent.trim();
    }
    return null;
  }

  function looksDeleted(node) {
    const text = (node.textContent || "").toLowerCase();
    return DELETED_MARKERS.some((m) => text.includes(m));
  }

  function isOwnMessage(node) {
    return !!node.closest(".message-out");
  }

  /* ---------------------------------------------------------------------- */
  /* Captura y restauración                                                  */
  /* ---------------------------------------------------------------------- */

  function captureMessage(node) {
    if (!node) return;
    const dataId = getDataId(node);
    if (!dataId) return;

    // Si ya está marcado como restaurado por nosotros, no re-capturar.
    if (node.querySelector(".wa-antidelete-restored")) return;

    if (looksDeleted(node)) {
      restoreMessage(node, dataId);
      return;
    }

    const text = extractText(node);
    if (!text) return;

    const existing = cache[dataId];
    if (existing && existing.text === text) return;

    cache[dataId] = {
      text,
      ts: Date.now(),
      author: isOwnMessage(node) ? "tú" : "contacto",
    };
    scheduleSave();
  }

  function restoreMessage(node, dataId) {
    if (node.querySelector(".wa-antidelete-restored")) return;
    const saved = cache[dataId];
    if (!saved) return;

    const banner = document.createElement("div");
    banner.className = "wa-antidelete-restored";

    const tag = document.createElement("span");
    tag.className = "wa-antidelete-tag";
    tag.textContent = "🕵️ Mensaje eliminado — recuperado";

    const body = document.createElement("div");
    body.className = "wa-antidelete-body";
    body.textContent = saved.text;

    banner.appendChild(tag);
    banner.appendChild(body);

    // Insertamos dentro de la burbuja, junto al placeholder de WhatsApp.
    const bubble =
      node.querySelector(".copyable-text") ||
      node.querySelector('[data-pre-plain-text]') ||
      node;
    bubble.appendChild(banner);
  }

  /* ---------------------------------------------------------------------- */
  /* Escaneo                                                                 */
  /* ---------------------------------------------------------------------- */

  function scan(root) {
    let nodes;
    if (root && root.matches && root.matches("[data-id]")) {
      nodes = [root];
    } else if (root && root.querySelectorAll) {
      nodes = root.querySelectorAll("[data-id]");
    } else {
      return;
    }
    nodes.forEach(captureMessage);
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (n.nodeType === 1) scan(n);
      });
      // Cuando WhatsApp muta el contenido de una burbuja existente
      // (p. ej. la reemplaza por el placeholder de eliminado).
      if (m.type === "characterData" && m.target.parentElement) {
        const node = getMessageNode(m.target.parentElement);
        if (node) captureMessage(node);
      }
    }
  });

  function start() {
    loadCache();
    // Escaneo inicial de lo que ya está en pantalla.
    scan(document.body);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    // Re-escaneo periódico por si algún cambio se escapa del observer.
    setInterval(() => scan(document.body), 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
