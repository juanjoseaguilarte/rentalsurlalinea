/*
  Configuración central del sitio.
  👉 SUSTITUYE los valores marcados como PLACEHOLDER cuando tengas los datos reales.
*/

export const site = {
  name: 'Rentalsur La Línea',
  // Dominio final (cámbialo también en astro.config.mjs -> site)
  url: 'https://rentalsurlalinea.com',

  // Motor de reservas Kross.
  // Estructura de URLs verificada con otra web del mismo motor (rentalbenidorm.kross.travel):
  //   Listado / reservar:   /accommodations   (EN: /en/accommodations)
  //   Ficha de propiedad:   /details/room/id/<ID>/
  //   Buscador de fechas:   /book/view
  booking: {
    baseUrl: 'https://rentallalinea.kross.travel/',
    accommodationsPath: 'accommodations',
    searchPath: 'book/view',
    roomPath: 'details/room/id', // + /<ID>/
    // Nombres de parámetros de fecha/huéspedes (best-effort; si el motor los ignora,
    // el enlace sigue abriendo el buscador igualmente).
    params: {
      checkin: 'checkin',
      checkout: 'checkout',
      guests: 'guests',
      lang: 'lang',
    },
  },

  // Contacto — PLACEHOLDERS, cámbialos por los reales
  contact: {
    email: 'rentalsurlalinea@gmail.com',
    // Teléfono en formato internacional sin espacios para tel: y wa.me
    phone: '+34600000000', // PLACEHOLDER
    phoneDisplay: '+34 600 000 000', // PLACEHOLDER
    whatsapp: '34600000000', // PLACEHOLDER (sin +)
    address: 'La Línea de la Concepción, Cádiz, España',
  },

  social: {
    instagram: 'https://instagram.com/rentalsurlalinea', // PLACEHOLDER
    facebook: 'https://facebook.com/rentalsurlalinea', // PLACEHOLDER
  },
} as const;

export type Locale = 'es' | 'en';

/** Prefijo de idioma para las rutas del motor (EN usa /en/, ES la raíz). */
function langPrefix(locale: Locale = 'es'): string {
  return locale === 'en' ? 'en/' : '';
}

/** Página principal del motor: listado de alojamientos (botones "Reservar"/"Ver todos"). */
export function bookingHomeUrl(locale: Locale = 'es'): string {
  const { baseUrl, accommodationsPath } = site.booking;
  return new URL(`${langPrefix(locale)}${accommodationsPath}`, baseUrl).toString();
}

/** Ficha de una propiedad concreta en el motor, por su ID de habitación de Kross. */
export function roomUrl(roomId: string | number, locale: Locale = 'es'): string {
  const { baseUrl, roomPath } = site.booking;
  return new URL(`${roomPath}/${roomId}/`, baseUrl).toString();
}

/**
 * Buscador de disponibilidad con fechas/huéspedes (best-effort).
 * Si no hay fechas, devuelve el listado de alojamientos. Fallback siempre seguro.
 */
export function buildBookingUrl(opts: {
  locale?: Locale;
  checkin?: string;
  checkout?: string;
  guests?: string | number;
} = {}): string {
  const locale = opts.locale ?? 'es';
  if (!opts.checkin && !opts.checkout) return bookingHomeUrl(locale);
  const { baseUrl, searchPath, params } = site.booking;
  const url = new URL(`${langPrefix(locale)}${searchPath}`, baseUrl);
  if (opts.checkin) url.searchParams.set(params.checkin, opts.checkin);
  if (opts.checkout) url.searchParams.set(params.checkout, opts.checkout);
  if (opts.guests) url.searchParams.set(params.guests, String(opts.guests));
  return url.toString();
}

export const whatsappLink = (text = '') =>
  `https://wa.me/${site.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
