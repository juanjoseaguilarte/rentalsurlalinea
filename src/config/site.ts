/*
  Configuración central del sitio.
  👉 SUSTITUYE los valores marcados como PLACEHOLDER cuando tengas los datos reales.
*/

export const site = {
  name: 'Rentalsur La Línea',
  // Dominio actual (cámbialo también en astro.config.mjs -> site cuando tengas dominio propio)
  url: 'https://rentalsurlalinea.vercel.app',

  // Motor de reservas Kross.
  // Estructura de URLs verificada con otra web del mismo motor (rentalbenidorm):
  //   Listado / reservar:   /accommodations   (EN: /en/accommodations)
  //   Ficha de propiedad:   /details/room/id/<ID>/
  //   Búsqueda con fechas:  /book/step1?adults=2&children=0&rooms=1&guests=2
  //                         &n_guests=2&guests_rooms=2,0;&kross_lang=en&from=&to=
  booking: {
    baseUrl: 'https://rentallalinea.kross.travel/',
    accommodationsPath: 'accommodations',
    searchPath: 'book/step1',
    roomPath: 'details/room/id', // + /<ID>/
    // Formato de las fechas from/to. Si el motor no las recoge bien al probar,
    // cámbialo a 'YYYY-MM-DD'.
    dateFormat: 'DD/MM/YYYY' as 'DD/MM/YYYY' | 'YYYY-MM-DD',
  },

  // Contacto
  contact: {
    email: 'rentalsurlalinea@gmail.com',
    // Teléfono en formato internacional sin espacios para tel: y wa.me
    phone: '+34623182453',
    phoneDisplay: '+34 623 18 24 53',
    whatsapp: '34623182453', // sin +
    address: 'Calle Moreno de Mora, 40 · 11300 La Línea de la Concepción (Cádiz)',
    cif: 'B19463165',
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

/** Convierte YYYY-MM-DD (input nativo) al formato que espera el motor. */
export function formatBookingDate(isoDate: string): string {
  if (!isoDate) return '';
  if (site.booking.dateFormat === 'YYYY-MM-DD') return isoDate;
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Búsqueda de disponibilidad (/book/step1) con fechas y huéspedes, con el mismo
 * formato de parámetros que usa rentalbenidorm con este motor.
 * Sin fechas, devuelve el listado de alojamientos. Fallback siempre seguro.
 */
export function buildBookingUrl(opts: {
  locale?: Locale;
  checkin?: string; // YYYY-MM-DD
  checkout?: string; // YYYY-MM-DD
  guests?: string | number;
} = {}): string {
  const locale = opts.locale ?? 'es';
  if (!opts.checkin && !opts.checkout) return bookingHomeUrl(locale);
  const { baseUrl, searchPath } = site.booking;
  const adults = Number(opts.guests) || 2;
  const url = new URL(searchPath, baseUrl);
  url.searchParams.set('adults', String(adults));
  url.searchParams.set('children', '0');
  url.searchParams.set('rooms', '1');
  url.searchParams.set('guests', String(adults));
  url.searchParams.set('n_guests', String(adults));
  url.searchParams.set('guests_rooms', `${adults},0;`);
  url.searchParams.set('kross_lang', locale);
  url.searchParams.set('from', formatBookingDate(opts.checkin ?? ''));
  url.searchParams.set('to', formatBookingDate(opts.checkout ?? ''));
  return url.toString();
}

export const whatsappLink = (text = '') =>
  `https://wa.me/${site.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
