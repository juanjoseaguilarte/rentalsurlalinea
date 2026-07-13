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
  /** Nombre del edificio (SEO/agrupación), p. ej. "RockSide Suites Residences La Línea". */
  building?: string;
  /** Slug del edificio en src/data/buildings.ts. */
  buildingSlug?: string;
  /** true = aún sin fotos/datos reales del motor ("Fotos próximamente"). */
  pending?: boolean;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
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
  Propiedades reales importadas del motor Kross.
  Para añadir una nueva: copia un bloque, y recuerda que para el SEO el `name`
  debe escribirse IGUAL que aparece en Airbnb / Booking / el motor.
*/
export const properties: Property[] = [
  {
    // ✅ PROPIEDAD REAL — datos y fotos importados de la ficha del motor Kross.
    slug: 'rockside-suites-residences-apartamento-1',
    name: 'RockSide Suites Residences Apartamento 1',
    krossUrl: 'https://rentallalinea.kross.travel/rockside-suites-residences-apartamento-1',
    building: 'RockSide Suites Residences La Línea',
    buildingSlug: 'rockside-suites-residences',
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
      es: 'RockSide Suites Residences Apartamento 1 es una suite moderna de 40 m² totalmente equipada en La Línea de la Concepción, con capacidad para 4 personas. Perfecta para parejas y familias que buscan comodidad junto a Gibraltar. Reserva directa con el mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites Residences Apartamento 1 is a modern, fully equipped 40 m² suite in La Línea de la Concepción, sleeping up to 4 guests. Perfect for couples and families looking for comfort next to Gibraltar. Book direct with the best price guaranteed and flexible 24h check-in.',
    },
    features: {
      es: ['40 m²', 'Hasta 4 personas', 'Junto a Gibraltar', 'Wi-Fi', 'Aire acondicionado', 'Check-in flexible 24h'],
      en: ['40 m²', 'Up to 4 guests', 'Next to Gibraltar', 'Wi-Fi', 'Air conditioning', 'Flexible 24h check-in'],
    },
  },
  {
    // ✅ PROPIEDAD REAL — datos y fotos importados de la ficha del motor Kross.
    slug: 'rockside-suites-residences-apartamento-2',
    name: 'RockSide Suites Residences Apartamento 2',
    krossUrl: 'https://rentallalinea.kross.travel/rockside-suites-residences-apartamento-2',
    building: 'RockSide Suites Residences La Línea',
    buildingSlug: 'rockside-suites-residences',
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
      es: 'RockSide Suites Residences Apartamento 2 es un amplio apartamento de 60 m² con dos dormitorios y capacidad para 5 personas, totalmente equipado, en La Línea de la Concepción. Ideal para familias y grupos que quieren disfrutar de las playas y de Gibraltar a un paso. Reserva directa con el mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites Residences Apartamento 2 is a spacious 60 m² apartment with two bedrooms sleeping up to 5 guests, fully equipped, in La Línea de la Concepción. Ideal for families and groups wanting the beaches and Gibraltar within easy reach. Book direct with the best price guaranteed and flexible 24h check-in.',
    },
    features: {
      es: ['60 m²', 'Hasta 5 personas', '2 dormitorios', 'Junto a Gibraltar', 'Wi-Fi', 'Check-in flexible 24h'],
      en: ['60 m²', 'Up to 5 guests', '2 bedrooms', 'Next to Gibraltar', 'Wi-Fi', 'Flexible 24h check-in'],
    },
  },
  {
    // ✅ PROPIEDAD REAL — datos y fotos importados de la ficha del motor Kross.
    slug: 'rockside-suites-residences-apartamento-3',
    name: 'RockSide Suites Residences Apartamento 3',
    krossUrl: 'https://rentallalinea.kross.travel/rockside-suites-residences-apartamento-3',
    building: 'RockSide Suites Residences La Línea',
    buildingSlug: 'rockside-suites-residences',
    image: 'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/1616710861.webp',
    gallery: [
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/1616710861.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/1616711075.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/1616710859.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/1616710921.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/17304518626539.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/17304518625678.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/17304518623468.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/17304518638819.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/17304518637516.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/3/17304518649252.webp',
    ],
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    area: { es: 'La Línea de la Concepción', en: 'La Línea de la Concepción' },
    short: {
      es: 'Apartamento moderno para 4 personas con 1 dormitorio, junto a Gibraltar.',
      en: 'Modern apartment for 4 guests with 1 bedroom, next to Gibraltar.',
    },
    description: {
      es: 'RockSide Suites Residences Apartamento 3 es un apartamento moderno y totalmente equipado en La Línea de la Concepción, con un dormitorio y capacidad para 4 personas. Perfecto para parejas y familias que buscan comodidad junto a Gibraltar. Reserva directa con el mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites Residences Apartamento 3 is a modern, fully equipped apartment in La Línea de la Concepción, with one bedroom and room for 4 guests. Perfect for couples and families looking for comfort next to Gibraltar. Book direct with the best price guaranteed and flexible 24h check-in.',
    },
    features: {
      es: ['Hasta 4 personas', '1 dormitorio', 'Junto a Gibraltar', 'Wi-Fi', 'Aire acondicionado', 'Check-in flexible 24h'],
      en: ['Up to 4 guests', '1 bedroom', 'Next to Gibraltar', 'Wi-Fi', 'Air conditioning', 'Flexible 24h check-in'],
    },
  },
  {
    // ✅ PROPIEDAD REAL — datos y fotos importados de la ficha del motor Kross.
    slug: 'rockside-suites-residences-apartamento-4',
    name: 'RockSide Suites Residences Apartamento 4',
    krossUrl: 'https://rentallalinea.kross.travel/rockside-suites-residences-apartamento-4',
    building: 'RockSide Suites Residences La Línea',
    buildingSlug: 'rockside-suites-residences',
    image: 'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131353363.webp',
    gallery: [
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131353363.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131367806.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131367498.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131375314.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131371516.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131389992.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131389641.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131393969.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131394606.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131398332.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131404513.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131406697.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131414350.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131419571.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131422651.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131422603.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131431802.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/5/17822131433608.webp',
    ],
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    area: { es: 'La Línea de la Concepción', en: 'La Línea de la Concepción' },
    short: {
      es: 'Apartamento moderno para 4 personas con 1 dormitorio, junto a Gibraltar.',
      en: 'Modern apartment for 4 guests with 1 bedroom, next to Gibraltar.',
    },
    description: {
      es: 'RockSide Suites Residences Apartamento 4 es un apartamento moderno y totalmente equipado en La Línea de la Concepción, con un dormitorio y capacidad para 4 personas, junto a Gibraltar. Reserva directa con el mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites Residences Apartamento 4 is a modern, fully equipped apartment in La Línea de la Concepción, with one bedroom and room for 4 guests, next to Gibraltar. Book direct with the best price guaranteed and flexible 24h check-in.',
    },
    features: {
      es: ['Hasta 4 personas', '1 dormitorio', 'Junto a Gibraltar', 'Wi-Fi', 'Aire acondicionado', 'Check-in flexible 24h'],
      en: ['Up to 4 guests', '1 bedroom', 'Next to Gibraltar', 'Wi-Fi', 'Air conditioning', 'Flexible 24h check-in'],
    },
  },
  {
    // ✅ PROPIEDAD REAL — datos y fotos importados de la ficha del motor Kross.
    slug: 'rockside-suites-residences-apartamento-5',
    name: 'RockSide Suites Residences Apartamento 5',
    krossUrl: 'https://rentallalinea.kross.travel/apartamento-5',
    building: 'RockSide Suites Residences La Línea',
    buildingSlug: 'rockside-suites-residences',
    image: 'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793442.webp',
    gallery: [
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793442.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793457.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793432.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793452.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793440.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793461.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793474.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793482.webp',
      'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/7/1641793485.webp',
    ],
    guests: 6,
    bedrooms: 2,
    bathrooms: 1,
    area: { es: 'La Línea de la Concepción', en: 'La Línea de la Concepción' },
    short: {
      es: 'Amplio apartamento con 2 dormitorios para hasta 6 personas, junto a Gibraltar.',
      en: 'Spacious apartment with 2 bedrooms for up to 6 guests, next to Gibraltar.',
    },
    description: {
      es: 'RockSide Suites Residences Apartamento 5 es un amplio apartamento con dos dormitorios y capacidad para 6 personas, totalmente equipado, en La Línea de la Concepción, junto a Gibraltar. Perfecto para familias y grupos. Reserva directa con el mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites Residences Apartamento 5 is a spacious apartment with two bedrooms sleeping up to 6 guests, fully equipped, in La Línea de la Concepción, next to Gibraltar. Perfect for families and groups. Book direct with the best price guaranteed and flexible 24h check-in.',
    },
    features: {
      es: ['Hasta 6 personas', '2 dormitorios', 'Junto a Gibraltar', 'Wi-Fi', 'Aire acondicionado', 'Check-in flexible 24h'],
      en: ['Up to 6 guests', '2 bedrooms', 'Next to Gibraltar', 'Wi-Fi', 'Air conditioning', 'Flexible 24h check-in'],
    },
  },
  {
    // ⏳ PENDIENTE: fotos y datos reales cuando llegue el HTML de su ficha en Kross.
    // Nombre EXACTO del anuncio en Airbnb (SEO).
    slug: 'rocamar',
    name: 'Apartamento junto al mar, con vistas Gibraltar',
    building: 'Rocamar',
    krossUrl: '',
    image: '/images/beach.svg',
    pending: true,
    area: { es: 'Junto al mar', en: 'By the sea' },
    short: {
      es: 'Apartamento en el edificio Rocamar, junto al mar y con vistas a Gibraltar.',
      en: 'Apartment in the Rocamar building, by the sea with views of Gibraltar.',
    },
    description: {
      es: 'Apartamento junto al mar en el edificio Rocamar de La Línea de la Concepción, con vistas a Gibraltar. Despierta con el Mediterráneo delante y el Peñón en el horizonte: una ubicación difícil de superar para unas vacaciones junto a la playa. Reserva directa con Rentalsur, sin comisiones y con check-in flexible 24h.',
      en: 'Seafront apartment in the Rocamar building in La Línea de la Concepción, with views of Gibraltar. Wake up with the Mediterranean in front of you and the Rock on the horizon: a location that is hard to beat for a beach holiday. Book direct with Rentalsur, no fees and flexible 24h check-in.',
    },
    features: {
      es: ['Junto al mar', 'Vistas a Gibraltar', 'Wi-Fi', 'Check-in flexible 24h'],
      en: ['By the sea', 'Gibraltar views', 'Wi-Fi', 'Flexible 24h check-in'],
    },
  },
  {
    // ⏳ PENDIENTE: fotos y datos reales cuando llegue el HTML de su ficha en Kross.
    slug: 'mendez-nunez-3',
    name: 'Centro ciudad. A 7 minutos andando a Gibraltar',
    building: 'Méndez Núñez 3',
    krossUrl: '',
    image: '/images/hero.svg',
    pending: true,
    area: { es: 'Centro', en: 'Town centre' },
    short: {
      es: 'En pleno centro, en Méndez Núñez 3: Gibraltar a 7 minutos andando.',
      en: 'Right in the centre, at Méndez Núñez 3: Gibraltar 7 minutes on foot.',
    },
    description: {
      es: 'Apartamento en pleno centro de La Línea de la Concepción, en la calle Méndez Núñez 3, a solo 7 minutos andando de Gibraltar. Comercios, restaurantes y toda la vida de la ciudad en la puerta, y el paso a Gibraltar —ya sin controles— a un paseo. Ideal para turismo y para estancias de trabajo en el Peñón. Reserva directa con Rentalsur.',
      en: 'Apartment in the heart of La Línea de la Concepción, at Méndez Núñez 3, just a 7-minute walk from Gibraltar. Shops, restaurants and all the city life on your doorstep, and the Gibraltar crossing — now without border checks — a stroll away. Ideal for tourism and for work stays on the Rock. Book direct with Rentalsur.',
    },
    features: {
      es: ['Centro ciudad', 'Gibraltar a 7 min a pie', 'Wi-Fi', 'Check-in flexible 24h'],
      en: ['Town centre', 'Gibraltar 7 min on foot', 'Wi-Fi', 'Flexible 24h check-in'],
    },
  },
  {
    // ⏳ PENDIENTE: fotos y datos reales cuando llegue el HTML de su ficha en Kross.
    slug: 'banqueta',
    name: 'Primera línea de playa y vistas a Gibraltar',
    building: 'Banqueta',
    krossUrl: '',
    image: '/images/beach.svg',
    pending: true,
    area: { es: 'Primera línea de playa', en: 'Beachfront' },
    short: {
      es: 'Primera línea de playa en La Banqueta, con vistas a Gibraltar.',
      en: 'Beachfront at La Banqueta, with views of Gibraltar.',
    },
    description: {
      es: 'Apartamento en primera línea de playa en la zona de La Banqueta, en La Línea de la Concepción, con vistas a Gibraltar. El mar como primer plano desde que te levantas, el paseo marítimo en la puerta y el Peñón presidiendo cada atardecer. Reserva directa con Rentalsur, sin comisiones y con check-in flexible 24h.',
      en: 'Beachfront apartment in the La Banqueta area of La Línea de la Concepción, with views of Gibraltar. The sea in the foreground from the moment you get up, the promenade at your door and the Rock presiding over every sunset. Book direct with Rentalsur, no fees and flexible 24h check-in.',
    },
    features: {
      es: ['Primera línea de playa', 'Vistas a Gibraltar', 'Wi-Fi', 'Check-in flexible 24h'],
      en: ['Beachfront', 'Gibraltar views', 'Wi-Fi', 'Flexible 24h check-in'],
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
