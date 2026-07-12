/*
  Guías de destino: páginas que desarrollan las tarjetas de "Descubre La Línea".
  Fotos: Wikimedia Commons (enlazadas directamente, con crédito a la ficha del
  archivo). Cada imagen tiene un `fallback` local por si la URL cambiara.
*/

interface Text2 {
  es: string;
  en: string;
}

export interface GuideSection {
  title: Text2;
  text: Text2;
  image?: string;
  fallback?: string;
  imageAlt: Text2;
  creditUrl?: string;
}

export interface Guide {
  key: 'beaches' | 'gibraltar' | 'food';
  /** Mismo slug en ES y EN para que el cambio de idioma nunca rompa. */
  slug: string;
  title: Text2;
  metaDescription: Text2;
  hero: { image: string; fallback: string; alt: Text2; creditUrl?: string };
  intro: Text2;
  sections: GuideSection[];
  cta: Text2;
}

export const guides: Guide[] = [
  {
    key: 'beaches',
    slug: 'playas',
    title: {
      es: 'Las playas de La Línea: 14 kilómetros de costa por descubrir',
      en: "La Línea's beaches: 14 kilometres of coastline to discover",
    },
    metaDescription: {
      es: 'Playa de Levante, La Atunara, Poniente, Santa Bárbara… descubre las playas de La Línea de la Concepción: arena dorada, aguas tranquilas y atardeceres con Gibraltar de fondo.',
      en: 'Playa de Levante, La Atunara, Poniente, Santa Bárbara… discover the beaches of La Línea de la Concepción: golden sand, calm waters and sunsets with Gibraltar as a backdrop.',
    },
    hero: {
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/La_Linea_de_la_Concepcion_2.jpg/1280px-La_Linea_de_la_Concepcion_2.jpg',
      fallback: '/images/beach.svg',
      alt: {
        es: 'Panorámica de la costa de La Línea de la Concepción',
        en: 'Panoramic view of the coastline of La Línea de la Concepción',
      },
      creditUrl: 'https://commons.wikimedia.org/wiki/File:La_Linea_de_la_Concepcion_2.jpg',
    },
    intro: {
      es: 'Pocos lugares en España pueden presumir de lo que presume La Línea: 14 kilómetros de litoral entre dos mares, con playas para todos los gustos y casi ningún día sin sol. Aquí el Mediterráneo y el Atlántico se dan la mano, y tú eliges cada mañana de qué lado quieres despertarte. Sin masificaciones, sin prisas: la playa como era antes.',
      en: "Few places in Spain can boast what La Línea has: 14 kilometres of coastline between two seas, with beaches for every taste and hardly a day without sunshine. Here the Mediterranean and the Atlantic meet, and every morning you choose which side to wake up on. No crowds, no rush: the beach as it used to be.",
    },
    sections: [
      {
        title: {
          es: 'Levante y La Atunara: el Mediterráneo en estado puro',
          en: 'Levante and La Atunara: the Mediterranean at its purest',
        },
        text: {
          es: 'La playa de Levante y La Atunara son el alma marinera de La Línea. Arena dorada, aguas limpias y tranquilas, y un antiguo barrio de pescadores donde las barcas siguen saliendo cada madrugada. Date un baño, pasea por la orilla hasta perder la vista y termina el día con pescado fresco en un chiringuito a pie de arena. Así de fácil, así de auténtico.',
          en: "Playa de Levante and La Atunara are La Línea's seafaring soul. Golden sand, clean and calm waters, and an old fishing quarter where the boats still set out at dawn. Take a swim, stroll along the shore as far as the eye can see and end the day with fresh fish at a beach bar right on the sand. That easy, that authentic.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/1/14/Playa_de_La_Atunara_%28La_L%C3%ADnea_de_la_Concepci%C3%B3n%29.jpg',
        fallback: '/images/beach.svg',
        imageAlt: {
          es: 'Playa de La Atunara, La Línea de la Concepción',
          en: 'La Atunara beach, La Línea de la Concepción',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Playa_de_La_Atunara_(La_L%C3%ADnea_de_la_Concepci%C3%B3n).jpg',
      },
      {
        title: {
          es: 'Poniente: atardeceres con el Peñón de fondo',
          en: 'Poniente: sunsets with the Rock as a backdrop',
        },
        text: {
          es: 'La playa de Poniente mira a la bahía de Algeciras y regala una de las postales más espectaculares del sur de Europa: el sol cayendo tras los barcos con el Peñón de Gibraltar recortado en el cielo. Aguas mansas perfectas para familias, paseo marítimo para caminar o correr, y esa luz del Estrecho que no se olvida. Ven una vez y entenderás por qué la gente vuelve.',
          en: "Playa de Poniente faces the Bay of Algeciras and offers one of the most spectacular postcards in southern Europe: the sun setting behind the ships with the Rock of Gibraltar silhouetted against the sky. Gentle waters perfect for families, a seafront promenade for walking or running, and that light of the Strait you never forget. Come once and you'll understand why people come back.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/View_of_the_Rock_of_Gibraltar_from_Playa_de_Poniente.jpg/1280px-View_of_the_Rock_of_Gibraltar_from_Playa_de_Poniente.jpg',
        fallback: '/images/beach.svg',
        imageAlt: {
          es: 'El Peñón de Gibraltar visto desde la playa de Poniente',
          en: 'The Rock of Gibraltar seen from Poniente beach',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:View_of_the_Rock_of_Gibraltar_from_Playa_de_Poniente.jpg',
      },
      {
        title: {
          es: 'Kilómetros para perderse: Santa Bárbara, Sobrevela y La Alcaidesa',
          en: 'Kilometres to lose yourself: Santa Bárbara, Sobrevela and La Alcaidesa',
        },
        text: {
          es: 'Si lo tuyo es la naturaleza, sigue la costa hacia el norte: playas amplias y salvajes como Santa Bárbara, Sobrevela o La Alcaidesa, con dunas, viento para los amantes del windsurf y el kitesurf, y espacio de sobra para plantar la sombrilla lejos de todo. En La Línea nunca te faltará un trozo de mar solo para ti.',
          en: "If nature is your thing, follow the coast north: wide, wild beaches like Santa Bárbara, Sobrevela and La Alcaidesa, with dunes, wind for windsurf and kitesurf lovers, and plenty of room to plant your umbrella far from everything. In La Línea you'll never be short of a piece of sea just for you.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/6/63/Playa_de_Poniente_%28La_L%C3%ADnea_de_la_Concepci%C3%B3n%29.jpg',
        fallback: '/images/beach.svg',
        imageAlt: {
          es: 'Playa de Poniente, La Línea de la Concepción',
          en: 'Poniente beach, La Línea de la Concepción',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Playa_de_Poniente_(La_L%C3%ADnea_de_la_Concepci%C3%B3n).jpg',
      },
    ],
    cta: {
      es: 'Despierta mañana a cinco minutos de estas playas.',
      en: 'Wake up tomorrow five minutes from these beaches.',
    },
  },
  {
    key: 'gibraltar',
    slug: 'gibraltar',
    title: {
      es: 'Gibraltar a pie: duerme en España, desayuna bajo el Peñón',
      en: 'Gibraltar on foot: sleep in Spain, have breakfast under the Rock',
    },
    metaDescription: {
      es: 'La Línea es la única ciudad desde la que se entra andando a Gibraltar. El Peñón, sus monos, sus túneles, Main Street y vistas a África: todo a un paseo de tu apartamento.',
      en: 'La Línea is the only city with a walking border into Gibraltar. The Rock, its monkeys, its tunnels, Main Street and views of Africa: all a stroll from your apartment.',
    },
    hero: {
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Rock_of_Gibraltar_from_the_Spanish_side_of_the_frontier.jpg/1280px-Rock_of_Gibraltar_from_the_Spanish_side_of_the_frontier.jpg',
      fallback: '/images/gibraltar.svg',
      alt: {
        es: 'El Peñón de Gibraltar visto desde La Línea',
        en: 'The Rock of Gibraltar seen from La Línea',
      },
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Rock_of_Gibraltar_from_the_Spanish_side_of_the_frontier.jpg',
    },
    intro: {
      es: 'Hay experiencias que solo puedes vivir en un lugar del mundo, y esta es una de ellas: alojarte en La Línea es dormir en España y cruzar andando a otro país antes del desayuno. Gibraltar está literalmente al final de la calle — la única frontera peatonal de su tipo, a unos minutos de tu apartamento. Ninguna otra ciudad te ofrece dos países, dos culturas y dos gastronomías en un mismo día, sin coche y sin planes complicados.',
      en: "Some experiences can only be lived in one place in the world, and this is one of them: staying in La Línea means sleeping in Spain and walking into another country before breakfast. Gibraltar is literally at the end of the street — a one-of-a-kind pedestrian border, minutes from your apartment. No other city offers you two countries, two cultures and two cuisines in a single day, no car and no complicated plans.",
    },
    sections: [
      {
        title: {
          es: 'Cruza la frontera andando (y la pista de un aeropuerto)',
          en: 'Cross the border on foot (and an airport runway)',
        },
        text: {
          es: 'Con tu DNI o pasaporte en el bolsillo, en cuestión de minutos estás al otro lado. Y nada más entrar te espera algo único en el mundo: cruzar a pie la pista del aeropuerto de Gibraltar, donde los aviones aterrizan a pocos metros de los peatones. Es el comienzo perfecto para un día de exploración que tus fotos no van a saber explicar.',
          en: "With your ID or passport in your pocket, you're on the other side in a matter of minutes. And as soon as you enter, something unique in the world awaits: walking across the runway of Gibraltar airport, where planes land a few metres from pedestrians. It's the perfect start to a day of exploring your photos won't quite know how to explain.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/La_Linea_overlooking_Gibraltar.JPG/1280px-La_Linea_overlooking_Gibraltar.JPG',
        fallback: '/images/gibraltar.svg',
        imageAlt: {
          es: 'La Línea con Gibraltar al fondo',
          en: 'La Línea with Gibraltar in the background',
        },
        creditUrl: 'https://commons.wikimedia.org/wiki/File:La_Linea_overlooking_Gibraltar.JPG',
      },
      {
        title: {
          es: 'El Peñón: monos, túneles y dos continentes a la vista',
          en: 'The Rock: monkeys, tunnels and two continents in sight',
        },
        text: {
          es: 'Sube en teleférico a la Reserva Natural del Peñón y saluda a sus famosos macacos, los únicos monos en libertad de Europa. Recorre los Túneles del Gran Asedio excavados en la roca, asómbrate en la cueva de San Miguel y, desde lo alto, contempla algo que pone la piel de gallina: España a un lado, África al otro, y el Estrecho entero a tus pies.',
          en: "Take the cable car up to the Rock Nature Reserve and say hello to its famous macaques, Europe's only wild monkeys. Walk the Great Siege Tunnels carved into the rock, marvel at St. Michael's Cave and, from the top, take in something that gives you goosebumps: Spain on one side, Africa on the other, and the whole Strait at your feet.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Wv_La_L%C3%ADnea_de_la_Concepci%C3%B3n%2C_from_the_Rock_of_Gibraltar_%28cropped%29.jpg/1280px-Wv_La_L%C3%ADnea_de_la_Concepci%C3%B3n%2C_from_the_Rock_of_Gibraltar_%28cropped%29.jpg',
        fallback: '/images/gibraltar.svg',
        imageAlt: {
          es: 'La Línea de la Concepción vista desde lo alto del Peñón de Gibraltar',
          en: 'La Línea de la Concepción seen from the top of the Rock of Gibraltar',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Wv_La_L%C3%ADnea_de_la_Concepci%C3%B3n,_from_the_Rock_of_Gibraltar_(cropped).jpg',
      },
      {
        title: {
          es: 'Main Street: compras, libras y fish & chips',
          en: 'Main Street: shopping, pounds and fish & chips',
        },
        text: {
          es: 'Al pie del Peñón te espera el ambiente más british del Mediterráneo: cabinas rojas, bobbies, pubs y una Main Street llena de tiendas libres de impuestos donde perfumes, electrónica y licores salen notablemente más baratos. Come un fish & chips, paga en libras y vuelve a España dando un paseo. ¿En qué otro sitio puedes contar algo así?',
          en: 'At the foot of the Rock awaits the most British atmosphere in the Mediterranean: red phone boxes, bobbies, pubs and a Main Street full of tax-free shops where perfume, electronics and spirits come notably cheaper. Have fish & chips, pay in pounds and stroll back into Spain. Where else can you tell a story like that?',
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/View_of_the_Rock_of_Gibraltar_from_Playa_de_Poniente.jpg/1280px-View_of_the_Rock_of_Gibraltar_from_Playa_de_Poniente.jpg',
        fallback: '/images/gibraltar.svg',
        imageAlt: {
          es: 'El Peñón de Gibraltar desde la costa de La Línea',
          en: "The Rock of Gibraltar from La Línea's shoreline",
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:View_of_the_Rock_of_Gibraltar_from_Playa_de_Poniente.jpg',
      },
    ],
    cta: {
      es: 'Tu base perfecta para vivir Gibraltar está en La Línea.',
      en: 'Your perfect base for experiencing Gibraltar is in La Línea.',
    },
  },
  {
    key: 'food',
    slug: 'gastronomia',
    title: {
      es: 'Gastronomía de La Línea: el sabor del Estrecho en cada plato',
      en: 'La Línea food: the taste of the Strait on every plate',
    },
    metaDescription: {
      es: 'Pescaíto frito de La Atunara, atún del Estrecho, tapas con solera y hasta fish & chips a un paseo: comer en La Línea de la Concepción es un viaje en sí mismo.',
      en: "Fried fish from La Atunara, tuna from the Strait, classic tapas and even fish & chips a stroll away: eating in La Línea de la Concepción is a journey in itself.",
    },
    hero: {
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Pescado_frito_diverso.jpg/1280px-Pescado_frito_diverso.jpg',
      fallback: '/images/food.svg',
      alt: {
        es: 'Pescaíto frito variado, plato típico andaluz',
        en: 'Assorted Andalusian fried fish',
      },
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Pescado_frito_diverso.jpg',
    },
    intro: {
      es: 'En La Línea se come como en pocos sitios, y no lo decimos nosotros: lo dice el mar. El pescado entra cada día por la lonja de La Atunara y a las pocas horas está en tu mesa, frito, a la plancha o en tapas que quitan el sentido. Añádele el ambiente andaluz, precios sin sustos y la posibilidad de cenar británico cruzando la frontera: aquí cada comida es un plan.',
      en: "Few places eat like La Línea, and it's not us saying it: it's the sea. Fish comes in every day through La Atunara's market and within hours it's on your table — fried, grilled or in tapas that will blow you away. Add the Andalusian atmosphere, prices with no nasty surprises and the option of a British dinner across the border: here, every meal is a plan.",
    },
    sections: [
      {
        title: {
          es: 'Pescaíto frito: la religión local',
          en: 'Pescaíto frito: the local religion',
        },
        text: {
          es: 'Boquerones, puntillitas, acedías, tortillitas de camarones… El pescaíto frito es la seña de identidad de la bahía y en La Línea se borda: rebozado ligero, aceite de oliva y producto recién desembarcado. Pídelo en un chiringuito de La Atunara con el mar de fondo y entenderás por qué los gaditanos no lo cambian por nada.',
          en: "Anchovies, baby squid, wedge sole, shrimp fritters… Fried fish is the identity of the bay and La Línea nails it: light batter, olive oil and produce fresh off the boat. Order it at a beach bar in La Atunara with the sea in the background and you'll see why people here wouldn't trade it for anything.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Pescado_adobado%2C_rebozado_y_frito.jpg/1280px-Pescado_adobado%2C_rebozado_y_frito.jpg',
        fallback: '/images/food.svg',
        imageAlt: {
          es: 'Pescado en adobo rebozado y frito, tapa andaluza',
          en: 'Marinated, battered and fried fish, an Andalusian tapa',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Pescado_adobado,_rebozado_y_frito.jpg',
      },
      {
        title: {
          es: 'Atún del Estrecho y cocina de lonja',
          en: 'Tuna from the Strait and market-fresh cooking',
        },
        text: {
          es: 'Estás en la provincia del atún rojo salvaje, el que se pesca desde hace tres mil años con el arte de la almadraba. En los bares y restaurantes linenses lo encontrarás en tartar, en tataki o a la plancha, junto a urta, borriquete y otras joyas de la lonja. Cocina honesta, de producto, a precios que en otras costas ya no existen.',
          en: "You're in the province of wild bluefin tuna, caught for three thousand years using the ancient almadraba technique. In La Línea's bars and restaurants you'll find it as tartare, tataki or grilled, alongside sea bream and other treasures from the fish market. Honest, product-first cooking at prices that no longer exist on other coasts.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/At%C3%BAn_rojo_a_la_plancha.jpg/1280px-At%C3%BAn_rojo_a_la_plancha.jpg',
        fallback: '/images/food.svg',
        imageAlt: {
          es: 'Atún rojo a la plancha, especialidad de la provincia de Cádiz',
          en: 'Grilled bluefin tuna, a Cádiz province speciality',
        },
        creditUrl: 'https://commons.wikimedia.org/wiki/File:At%C3%BAn_rojo_a_la_plancha.jpg',
      },
      {
        title: {
          es: 'De tapas por La Línea (con postre en otro país)',
          en: 'Tapas in La Línea (with dessert in another country)',
        },
        text: {
          es: 'El centro de La Línea vive de bar en bar: cañas bien tiradas, tapas generosas, terrazas al sol y sobremesas largas, como manda Andalucía. Y cuando quieras cambiar de tercio, cruza a Gibraltar a por un té con scones o un pie británico. Dos gastronomías, una caminata de diez minutos. Eso no lo tiene ningún otro destino.',
          en: "La Línea's centre lives from bar to bar: perfectly poured beers, generous tapas, sunny terraces and long, lazy lunches, the Andalusian way. And when you fancy a change, cross into Gibraltar for tea with scones or a British pie. Two cuisines, one ten-minute walk. No other destination has that.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Pescado_frito_diverso.jpg/1280px-Pescado_frito_diverso.jpg',
        fallback: '/images/food.svg',
        imageAlt: {
          es: 'Surtido de pescaíto frito andaluz',
          en: 'Assortment of Andalusian fried fish',
        },
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Pescado_frito_diverso.jpg',
      },
    ],
    cta: {
      es: 'Ven con hambre: tu mesa junto al mar te espera.',
      en: 'Come hungry: your table by the sea is waiting.',
    },
  },
];
