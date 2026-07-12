import { bookingHomeUrl, roomUrl } from '../config/site';
import type { Locale } from '../i18n/ui';

export interface Property {
  slug: string;
  /** Nombre EXACTO tal y como aparece en Airbnb/Booking/Kross (clave para el SEO). */
  name: string;
  /**
   * ID de la habitación en Kross → genera /details/room/id/<ID>/ automáticamente.
   * Lo encuentras en la URL de la ficha dentro del motor. Es la opción recomendada.
   */
  krossRoomId?: string | number;
  /** Alternativa: pega la URL completa de la ficha en el motor (si no usas krossRoomId). */
  krossUrl?: string;
  image: string;
  /** Galería de fotos (URLs absolutas del CDN de Kross o rutas locales). */
  gallery?: string[];
  guests: number;
  bedrooms: number;
  bathrooms: number;
  /** Superficie en m² (opcional). */
  sqm?: number;
  /** Zona/barrio para mostrar y para SEO local. */
  area: { es: string; en: string };
  short: { es: string; en: string };
  description: { es: string; en: string };
  features: {
    es: string[];
    en: string[];
  };
}

/*
  ⚠️ PLACEHOLDERS DE EJEMPLO
  Sustituye estos por tus propiedades reales. Lo MÁS importante para el SEO:
  - `name`: escríbelo IGUAL que aparece en Airbnb / Booking / vuestro motor Kross,
    para que quien busque ese nombre en Google encuentre esta web y reserve directo.
  - `krossRoomId`: el ID de la propiedad en el motor. La ficha en Kross tiene forma
    https://rentallalinea.kross.travel/details/room/id/47/  →  aquí pondrías 47.
*/
export const properties: Property[] = [
  {
    // ✅ PROPIEDAD REAL — datos y fotos importados de la ficha del motor Kross.
    slug: 'rockside-suites-a1',
    name: 'RockSide Suites A1',
    krossUrl: 'https://rentallalinea.kross.travel/rockside-suites-a1',
    image: 'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/1775746156131.webp',
    gallery: [
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/1775746156131.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/17757461564095.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/17757461588394.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/17757461587575.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/1775746159994.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/17757461601242.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/17757461609450.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/17757461618482.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/17757461619083.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/17757461622017.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/1775746162935.webp',
    ],
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    sqm: 40,
    area: { es: 'La Línea de la Concepción', en: 'La Línea de la Concepción' },
    short: {
      es: 'Suite moderna de 40 m² para 4 personas, con el Peñón de Gibraltar a un paso.',
      en: 'Modern 40 m² suite for 4 guests, steps from the Rock of Gibraltar.',
    },
    description: {
      es: 'RockSide Suites A1 es una suite moderna de 40 m² totalmente equipada en La Línea de la Concepción, con capacidad para 4 personas. Perfecta para parejas y familias que buscan comodidad junto a Gibraltar. Reserva directa con el mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites A1 is a modern, fully equipped 40 m² suite in La Línea de la Concepción, sleeping up to 4 guests. Perfect for couples and families looking for comfort next to Gibraltar. Book direct with the best price guaranteed and flexible 24h check-in.',
    },
    features: {
      es: ['40 m²', 'Hasta 4 personas', 'Junto a Gibraltar', 'Wi-Fi', 'Aire acondicionado', 'Check-in flexible 24h'],
      en: ['40 m²', 'Up to 4 guests', 'Next to Gibraltar', 'Wi-Fi', 'Air conditioning', 'Flexible 24h check-in'],
    },
  },
  {
    // ✅ PROPIEDAD REAL — datos y fotos importados de la ficha del motor Kross.
    slug: 'rockside-suites-a2',
    name: 'RockSide Suites A2',
    krossUrl: 'https://rentallalinea.kross.travel/rockside-suites-a2',
    image: 'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260455.webp',
    gallery: [
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260455.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260450.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260420.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260418.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260412.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260421.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260425.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260472.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260473.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260476.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/2/1574260480.webp',
    ],
    guests: 5,
    bedrooms: 2,
    bathrooms: 1,
    sqm: 60,
    area: { es: 'La Línea de la Concepción', en: 'La Línea de la Concepción' },
    short: {
      es: 'Amplio apartamento de 60 m² con 2 dormitorios para hasta 5 personas.',
      en: 'Spacious 60 m² apartment with 2 bedrooms for up to 5 guests.',
    },
    description: {
      es: 'RockSide Suites A2 es un amplio apartamento de 60 m² con dos dormitorios y capacidad para 5 personas, totalmente equipado, en La Línea de la Concepción. Ideal para familias y grupos que quieren disfrutar de las playas y de Gibraltar a un paso. Reserva directa con el mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites A2 is a spacious 60 m² apartment with two bedrooms sleeping up to 5 guests, fully equipped, in La Línea de la Concepción. Ideal for families and groups wanting the beaches and Gibraltar within easy reach. Book direct with the best price guaranteed and flexible 24h check-in.',
    },
    features: {
      es: ['60 m²', 'Hasta 5 personas', '2 dormitorios', 'Junto a Gibraltar', 'Wi-Fi', 'Check-in flexible 24h'],
      en: ['60 m²', 'Up to 5 guests', '2 bedrooms', 'Next to Gibraltar', 'Wi-Fi', 'Flexible 24h check-in'],
    },
  },
  {
    slug: 'casa-levante-familiar',
    name: 'Casa Levante Familiar',
    krossUrl: '',
    image: '/images/apartment-3.svg',
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    area: { es: 'Playa de Levante', en: 'Levante beach' },
    short: {
      es: 'Amplia casa para grupos junto a la playa de Levante.',
      en: 'Spacious house for groups by Levante beach.',
    },
    description: {
      es: 'Casa amplia y confortable a un paso de la playa de Levante, pensada para familias y grupos. Tres dormitorios, salón espacioso y patio andaluz. La base perfecta para explorar el Estrecho, Tarifa y la Costa del Sol.',
      en: 'Spacious, comfortable house steps from Levante beach, designed for families and groups. Three bedrooms, a large living room and an Andalusian patio. The perfect base to explore the Strait, Tarifa and the Costa del Sol.',
    },
    features: {
      es: ['Hasta 6 personas', 'Patio andaluz', 'Junto a la playa', 'Parking cercano', 'Cocina completa'],
      en: ['Up to 6 guests', 'Andalusian patio', 'By the beach', 'Nearby parking', 'Full kitchen'],
    },
  },
  {
    slug: 'estudio-poniente-parejas',
    name: 'Estudio Poniente',
    krossUrl: '',
    image: '/images/apartment-4.svg',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: { es: 'Playa de Poniente', en: 'Poniente beach' },
    short: {
      es: 'Acogedor estudio para parejas cerca de Poniente.',
      en: 'Cosy studio for couples near Poniente.',
    },
    description: {
      es: 'Estudio acogedor y coqueto, ideal para escapadas en pareja. Diseño moderno, todo lo necesario a mano y a pocos minutos de la playa de Poniente y del centro. Reserva directa con el mejor precio garantizado.',
      en: 'Cosy, charming studio, perfect for a couples getaway. Modern design, everything you need at hand and minutes from Poniente beach and the town centre. Book direct with the best price guaranteed.',
    },
    features: {
      es: ['Ideal parejas', 'Diseño moderno', 'Cerca del centro', 'Wi-Fi', 'Aire acondicionado'],
      en: ['Ideal for couples', 'Modern design', 'Near the centre', 'Wi-Fi', 'Air conditioning'],
    },
  },
];

/** Enlace de reserva de una propiedad: su ficha Kross si se conoce, o el listado. */
export function propertyBookingUrl(p: Property, locale: Locale): string {
  if (p.krossRoomId !== undefined && p.krossRoomId !== '') return roomUrl(p.krossRoomId, locale);
  if (p.krossUrl && p.krossUrl.length > 0) {
    // En inglés, pedir al motor esa versión (mismo formato que usa rentalbenidorm)
    if (locale === 'en') {
      const url = new URL(p.krossUrl);
      if (!url.searchParams.has('lang')) url.searchParams.set('lang', 'en');
      return url.toString();
    }
    return p.krossUrl;
  }
  return bookingHomeUrl(locale);
}
