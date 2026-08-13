const STORE_KEY = "wa_antidelete_messages";

const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear");

function fmt(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch (e) {
    return "";
  }
}

function render(cache) {
  const entries = Object.values(cache || {}).sort(
    (a, b) => (b.ts || 0) - (a.ts || 0)
  );

  countEl.textContent =
    entries.length + (entries.length === 1 ? " mensaje" : " mensajes");

  if (!entries.length) {
    listEl.innerHTML =
      '<div class="empty">Todavía no se ha capturado ningún mensaje.<br>Abre un chat en WhatsApp Web y deja la pestaña abierta.</div>';
    return;
  }

  listEl.innerHTML = "";
  for (const e of entries) {
    const item = document.createElement("div");
    item.className = "item";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${e.author || "?"} · ${fmt(e.ts)}`;

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = e.text || "";

    item.appendChild(meta);
    item.appendChild(text);
    listEl.appendChild(item);
  }
}

function load() {
  chrome.storage.local.get([STORE_KEY], (res) => {
    render((res && res[STORE_KEY]) || {});
  });
}

clearBtn.addEventListener("click", () => {
  chrome.storage.local.set({ [STORE_KEY]: {} }, load);
});

load();
