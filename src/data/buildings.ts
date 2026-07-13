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
  short: { es: string; en: string };
  description: { es: string; en: string };
}

export const buildings: Building[] = [
  {
    slug: 'rockside-suites-residences',
    name: 'RockSide Suites Residences La Línea',
    image: 'https://cdn.krossbooking.com/juanjoseaguilarteviegas/images/3/1/1775746156131.webp',
    short: {
      es: 'Edificio de 8 apartamentos modernos junto a Gibraltar.',
      en: 'Building with 8 modern apartments next to Gibraltar.',
    },
    description: {
      es: 'RockSide Suites Residences La Línea es un edificio de 8 apartamentos modernos y totalmente equipados en La Línea de la Concepción, a un paso de Gibraltar. Suites y apartamentos de 1 y 2 dormitorios, perfectos para parejas, familias y estancias de trabajo en el Peñón. Todos con reserva directa, mejor precio garantizado y check-in flexible 24h.',
      en: 'RockSide Suites Residences La Línea is a building with 8 modern, fully equipped apartments in La Línea de la Concepción, steps from Gibraltar. One and two-bedroom suites and apartments, perfect for couples, families and work stays on the Rock. All with direct booking, best price guaranteed and flexible 24h check-in.',
    },
  },
];

/** Unidades de un edificio (propiedades cuyo buildingSlug coincide). */
export function buildingUnits(slug: string): Property[] {
  return properties.filter((p) => p.buildingSlug === slug);
}
