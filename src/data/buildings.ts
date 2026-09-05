import { properties, type Property } from './properties';

/*
  Edificios con varias unidades. La página del edificio posiciona el nombre
  EXACTO del anuncio (Airbnb/Booking) y lista sus apartamentos.
*/

export interface Building {
  slug: string;
  /** Nombre EXACTO tal y como aparece en Airbnb/Booking (clave para el SEO). */
  name: string;
  image: string;
  /** Nº real de apartamentos del edificio (aunque sus fichas aún no estén creadas). */
  unitCount: number;
  short: { es: string; en: string };
  description: { es: string; en: string };
}

export const buildings: Building[] = [
  {
    slug: 'rockside-suites-residences',
    name: 'RockSide Suites Residences La Línea',
    image: '/images/ap1/ap1-13.webp',
    unitCount: 8,
    short: {
      es: 'Edificio de 8 apartamentos modernos junto a Gibraltar.',
      en: 'Building with 8 modern apartments next to Gibraltar.',
    },
    description: {
      es: 'RockSide Suites Residences La Línea es un edificio de 8 apartamentos modernos y totalmente equipados en La Línea de la Concepción, a un paso de Gibraltar. Estudios y apartamentos de 1 y 2 dormitorios, perfectos para parejas, familias y estancias de trabajo en el Peñón. Todos con reserva directa, mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites Residences La Línea is a building with 8 modern, fully equipped apartments in La Línea de la Concepción, steps from Gibraltar. Studios and one and two-bedroom apartments, perfect for couples, families and work stays on the Rock. All with direct booking, best price guaranteed and flexible 24h check-in.',
    },
  },
  {
    // ⏳ PENDIENTE: fotos y fichas de sus 3 pisos cuando lleguen los HTML de Kross.
    slug: 'edificio-manez',
    name: 'Edificio Mañez',
    image: '/images/manez-segundo/ms-17.webp',
    unitCount: 3,
    short: {
      es: 'Edificio con 3 apartamentos cómodos y bien situados en La Línea.',
      en: 'Building with 3 comfortable, well-located apartments in La Línea.',
    },
    description: {
      es: 'El Edificio Mañez cuenta con 3 apartamentos cómodos y totalmente equipados en La Línea de la Concepción, una base perfecta para disfrutar de las playas, la gastronomía y la cercanía única de Gibraltar. Todos con reserva directa, sin comisiones y check-in flexible 24h.',
      en: 'The Mañez Building has 3 comfortable, fully equipped apartments in La Línea de la Concepción — a perfect base to enjoy the beaches, the food scene and the unique closeness of Gibraltar. All with direct booking, no fees and flexible 24h check-in.',
    },
  },
];

/** Unidades de un edificio (propiedades cuyo buildingSlug coincide). */
export function buildingUnits(slug: string): Property[] {
  return properties.filter((p) => p.buildingSlug === slug);
}
