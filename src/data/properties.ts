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
  guests: number;
  bedrooms: number;
  bathrooms: number;
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
    slug: 'apartamento-atunara-playa',
    name: 'Apartamento Atunara Playa',
    krossUrl: '',
    image: '/images/apartment-1.svg',
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    area: { es: 'La Atunara', en: 'La Atunara' },
    short: {
      es: 'Luminoso apartamento a metros de la playa de La Atunara.',
      en: 'Bright apartment steps from La Atunara beach.',
    },
    description: {
      es: 'Apartamento reformado a pocos metros del paseo marítimo de La Atunara. Perfecto para familias: dos dormitorios, cocina totalmente equipada y terraza para disfrutar de las tardes de verano. A un paseo del mejor pescaíto de La Línea.',
      en: 'Renovated apartment just steps from La Atunara seafront. Ideal for families: two bedrooms, a fully equipped kitchen and a terrace for summer evenings. A short walk from the best fried fish in La Línea.',
    },
    features: {
      es: ['A 2 min de la playa', 'Wi-Fi de alta velocidad', 'Aire acondicionado', 'Cocina equipada', 'Terraza'],
      en: ['2 min to the beach', 'High-speed Wi-Fi', 'Air conditioning', 'Equipped kitchen', 'Terrace'],
    },
  },
  {
    slug: 'atico-vistas-gibraltar',
    name: 'Ático Vistas Gibraltar',
    krossUrl: '',
    image: '/images/apartment-2.svg',
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    area: { es: 'Centro', en: 'Town centre' },
    short: {
      es: 'Ático moderno con vistas al Peñón de Gibraltar.',
      en: 'Modern penthouse with views of the Rock of Gibraltar.',
    },
    description: {
      es: 'Ático céntrico con una terraza espectacular y vistas directas al Peñón de Gibraltar. Ideal para parejas o viajes de trabajo a la frontera. A pie de comercios, restaurantes y a diez minutos andando del paso fronterizo.',
      en: 'Central penthouse with a stunning terrace and direct views of the Rock of Gibraltar. Ideal for couples or work trips to the border. Walking distance to shops, restaurants and ten minutes from the border crossing.',
    },
    features: {
      es: ['Vistas a Gibraltar', 'Terraza privada', 'Cerca de la frontera', 'Wi-Fi', 'Aire acondicionado'],
      en: ['Gibraltar views', 'Private terrace', 'Near the border', 'Wi-Fi', 'Air conditioning'],
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
  if (p.krossUrl && p.krossUrl.length > 0) return p.krossUrl;
  return bookingHomeUrl(locale);
}
