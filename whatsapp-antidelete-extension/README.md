# WA Anti-Delete — Ver mensajes eliminados en WhatsApp Web

Extensión de Chrome que guarda los mensajes que aparecen en WhatsApp Web y,
cuando el remitente los elimina ("Este mensaje fue eliminado"), vuelve a
mostrarte el texto original dentro de la misma conversación.

## Cómo funciona

La extensión **no** intercepta el tráfico de WhatsApp ni usa APIs internas.
Simplemente lee lo que ya se ha renderizado en tu pantalla:

1. Un *content script* observa el DOM de `web.whatsapp.com` y guarda el texto de
   cada mensaje (indexado por el `data-id` que WhatsApp asigna) en
   `chrome.storage.local`.
2. Cuando WhatsApp reemplaza una burbuja por el aviso de "mensaje eliminado", la
   extensión recupera el texto guardado y lo re-inyecta con una etiqueta verde
   **"🕵️ Mensaje eliminado — recuperado"**.
3. Desde el icono de la extensión puedes ver todos los mensajes capturados y
   borrar el registro.

### Limitaciones importantes

- **Solo funciona con la pestaña abierta.** Únicamente puede recuperar mensajes
  que llegaron mientras WhatsApp Web estaba abierto con la extensión activa. No
  recupera nada de forma retroactiva.
- Funciona con mensajes de **texto**. Fotos, audios o vídeos no se guardan.
- WhatsApp cambia su HTML con frecuencia; si algún día deja de detectar
  mensajes, hay que actualizar los selectores en `content.js`.

## Instalación (modo desarrollador)

1. Descarga o clona esta carpeta (`whatsapp-antidelete-extension`).
2. Abre Chrome y ve a `chrome://extensions`.
3. Activa el **Modo de desarrollador** (arriba a la derecha).
4. Pulsa **Cargar descomprimida** y selecciona la carpeta
   `whatsapp-antidelete-extension`.
5. Abre o recarga `https://web.whatsapp.com` y deja la pestaña abierta.

Funciona igual en Microsoft Edge y Brave (usan el mismo motor):
`edge://extensions` / `brave://extensions`.

## Archivos

| Archivo         | Función                                                        |
| --------------- | ------------------------------------------------------------- |
| `manifest.json` | Configuración de la extensión (Manifest V3).                  |
| `content.js`    | Captura y restaura mensajes en la página de WhatsApp Web.     |
| `content.css`   | Estilo del bloque de mensaje recuperado.                      |
| `popup.html`    | Ventana del icono de la extensión.                            |
| `popup.js`      | Lista y gestiona los mensajes guardados.                      |

## Aviso legal / privacidad

- Todos los datos se guardan **localmente** en tu navegador. Nada se envía a
  ningún servidor.
- Úsala de forma responsable y respetando la privacidad de las personas con las
  que hablas y la legislación aplicable en tu país.
