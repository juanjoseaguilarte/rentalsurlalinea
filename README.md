# Rentalsur La Línea — Web de alquiler vacacional

Web bilingüe (español / inglés) para **Rentalsur La Línea**, alquiler vacacional en
La Línea de la Concepción (Cádiz). Sitio estático hecho con **Astro + Tailwind CSS**,
que enlaza al motor de reservas **Kross** (`rentallalinea.kross.travel`).

## Puesta en marcha

```bash
npm install
npm run dev      # desarrollo en http://localhost:4321
npm run build    # genera el sitio estático en dist/
npm run preview  # previsualiza el build
```

## Cómo personalizar (lo importante)

Casi todo se cambia en pocos ficheros:

| Qué quieres cambiar | Fichero |
| --- | --- |
| Teléfono, WhatsApp, email, redes, URL del motor Kross | `src/config/site.ts` |
| Textos en español | `src/i18n/es.json` |
| Textos en inglés | `src/i18n/en.json` |
| Apartamentos (nombre, fotos, descripción, `krossRoomId`) | `src/data/properties.ts` |
| Colores y tipografías de marca | `src/styles/global.css` (bloque `@theme`) |
| Fotos e imágenes | carpeta `public/images/` |
| Dominio final | `astro.config.mjs` (`site`) y `src/config/site.ts` (`url`) |

### SEO: nombres de las propiedades

En `src/data/properties.ts`, escribe el campo `name` **exactamente igual** que aparece
en Airbnb/Booking y en el motor Kross. Así, cuando alguien busque ese nombre en Google,
encontrará esta web y podrá reservar directo. Indica también el `krossRoomId` (el número
de la ficha en el motor). Cada propiedad genera su propia página indexable en
`/apartamentos/<slug>` (y `/en/apartments/<slug>`).

### Motor de reservas

La estructura de enlaces al motor está verificada con otra web del mismo Kross:

- **Listado / "Reservar"** → `/accommodations` (inglés: `/en/accommodations`)
- **Ficha de propiedad** → `/details/room/id/<ID>/` (usa `krossRoomId`)
- **Buscador con fechas** → `/book/view`

Todo se configura en `src/config/site.ts` (`booking`). Si el motor ignora algún
parámetro de fecha, el buscador abre igualmente el listado de alojamientos (fallback
seguro), así que nunca queda un botón "roto".

## Despliegue

- **Netlify**: conecta el repositorio; el `netlify.toml` ya configura el build.
  Los formularios de contacto/propietarios usan **Netlify Forms** automáticamente.
- **Vercel**: importa el repositorio (Astro se autodetecta). Los formularios harán
  *fallback* a `mailto:` abriendo el cliente de correo del visitante.

## Pendiente (cuando tengas el material)

- Logo, fotos reales de los apartamentos y colores de marca.
- Teléfono/WhatsApp e Instagram/Facebook reales (`src/config/site.ts`).
- Nombres y enlaces Kross reales de cada propiedad.
- Textos legales definitivos (aviso legal, privacidad, cookies).
