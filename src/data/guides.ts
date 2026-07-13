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
  /** Enlace opcional destacado bajo el texto (p. ej. web de un sitio recomendado). */
  link?: { label: Text2; url: string };
  /** Citas breves (p. ej. reseñas públicas reales) mostradas como testimonios. */
  quotes?: { es: string[]; en: string[] };
}

export interface Guide {
  key: 'beaches' | 'gibraltar' | 'food' | 'city';
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
      es: 'Hay experiencias que solo puedes vivir en un lugar del mundo, y esta es una de ellas: alojarte en La Línea es dormir en España y pasear a otro país antes del desayuno. Y desde julio de 2026 es aún más fácil: la histórica Verja ha desaparecido y se cruza a Gibraltar libremente, sin enseñar pasaporte. El Peñón está literalmente al final de la calle, a unos minutos de tu apartamento. Ninguna otra ciudad te ofrece dos países, dos culturas y dos gastronomías en un mismo día, sin coche, sin colas y sin planes complicados.',
      en: "Some experiences can only be lived in one place in the world, and this is one of them: staying in La Línea means sleeping in Spain and strolling into another country before breakfast. And since July 2026 it's even easier: the historic border fence is gone and you cross into Gibraltar freely, with no passport checks. The Rock is literally at the end of the street, minutes from your apartment. No other city offers you two countries, two cultures and two cuisines in a single day — no car, no queues, no complicated plans.",
    },
    sections: [
      {
        title: {
          es: 'Sin Verja y sin controles: pasea a otro país',
          en: 'No fence, no checks: stroll into another country',
        },
        text: {
          es: 'El 15 de julio de 2026 pasó a la historia: tras más de un siglo, la Verja de Gibraltar desapareció y el Peñón se integró en el espacio Schengen. Hoy se entra andando, libremente, sin enseñar pasaporte y sin colas. Y nada más cruzar te espera algo único en el mundo: atravesar a pie la pista del aeropuerto de Gibraltar, donde los aviones aterrizan a pocos metros de los peatones. Estás viviendo un momento histórico — y tu apartamento está a diez minutos.',
          en: "On 15 July 2026, history was made: after more than a century, the Gibraltar border fence came down and the Rock joined the Schengen area. Today you simply walk in — freely, no passport checks, no queues. And right after crossing, something unique in the world awaits: walking across the runway of Gibraltar airport, where planes land a few metres from pedestrians. You're living a historic moment — and your apartment is ten minutes away.",
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
      es: 'Dónde comer en La Línea: El Rincón de Juan',
      en: 'Where to eat in La Línea: El Rincón de Juan',
    },
    metaDescription: {
      es: 'El Rincón de Juan (calle Méndez Núñez 3, La Línea): jamón de bellota cortado a cuchillo, atún rojo salvaje del Estrecho, carnes maduradas y sushi. 4,6/5 y nº 2 de la ciudad en Tripadvisor. Nuestra recomendación para comer en La Línea de la Concepción.',
      en: 'El Rincón de Juan (Calle Méndez Núñez 3, La Línea): hand-carved acorn-fed jamón, wild bluefin tuna from the Strait, aged beef and sushi. 4.6/5 and #2 in town on Tripadvisor. Our recommendation for eating out in La Línea de la Concepción.',
    },
    hero: {
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Pescado_frito_diverso.jpg/1280px-Pescado_frito_diverso.jpg',
      fallback: '/images/food.svg',
      alt: {
        es: 'Gastronomía andaluza en La Línea de la Concepción',
        en: 'Andalusian cuisine in La Línea de la Concepción',
      },
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Pescado_frito_diverso.jpg',
    },
    intro: {
      es: 'En La Línea se come de maravilla: pescaíto, tapas, cocina del Estrecho… Pero cuando nuestros huéspedes nos piden UN sitio que no falle, la respuesta lleva años siendo la misma: El Rincón de Juan, en pleno centro, en la calle Méndez Núñez 3. Aquí te contamos por qué es la mesa más segura de tu escapada — y por qué conviene reservar.',
      en: "You eat wonderfully in La Línea: fried fish, tapas, cooking from the Strait… But when our guests ask us for THE one place that never fails, the answer has been the same for years: El Rincón de Juan, right in the centre at Calle Méndez Núñez 3. Here's why it's the safest table of your stay — and why you should book ahead.",
    },
    sections: [
      {
        title: {
          es: 'Desde 2003, calidad y sabor en cada detalle',
          en: 'Since 2003, quality and flavour in every detail',
        },
        text: {
          es: 'Más de veinte años avalan esta casa, que apuesta por producto de excelencia: jamón de bellota de brida negra cortado a cuchillo al momento, atún rojo salvaje del Estrecho (JC Mackintosh), carnes maduradas, sushi fresco hecho con criterio y una cuidada selección de verduras. Todo ello con una bodega seria — no en vano lo llaman The Wine Bar — y tres espacios para elegir según el plan: terraza, barra e interior.',
          en: "More than twenty years back this house, built on outstanding produce: acorn-fed brida negra jamón hand-carved to order, wild bluefin tuna from the Strait (JC Mackintosh), aged beef, fresh sushi made with real craft and a careful selection of vegetables. All backed by a serious wine cellar — they don't call it The Wine Bar for nothing — and three spaces to choose from depending on the plan: terrace, bar and dining room.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/At%C3%BAn_rojo_a_la_plancha.jpg/1280px-At%C3%BAn_rojo_a_la_plancha.jpg',
        fallback: '/images/food.svg',
        imageAlt: {
          es: 'Atún rojo a la plancha, especialidad del Estrecho',
          en: 'Grilled bluefin tuna, a speciality of the Strait',
        },
        creditUrl: 'https://commons.wikimedia.org/wiki/File:At%C3%BAn_rojo_a_la_plancha.jpg',
      },
      {
        title: {
          es: 'No lo decimos nosotros: 4,6 sobre 5',
          en: "Don't take our word for it: 4.6 out of 5",
        },
        text: {
          es: 'Es el nº 2 de los 194 restaurantes de La Línea en Tripadvisor, con más de 500 opiniones y notas de 4,7 tanto en comida como en servicio. Las reseñas hablan solas:',
          en: "It ranks #2 of the 194 restaurants in La Línea on Tripadvisor, with more than 500 reviews and 4.7 scores for both food and service. The reviews speak for themselves:",
        },
        quotes: {
          es: [
            'Sitio de 10 y espectacular. Hemos vuelto a ir… porque se lo merecen.',
            'El servicio es muy atento y la comida espectacular. Sus sushis son exquisitos. Un sitio top.',
            'Experiencia de 10. Tanto la atención como la comida… El sitio muy bonito, muy limpio y cuidado.',
          ],
          en: [
            'A 10 out of 10, spectacular. We went back… because they deserve it.',
            'Very attentive service and spectacular food. Their sushi is exquisite. A top spot.',
            'A 10/10 experience. Both the service and the food… The place is lovely, spotless and well cared for.',
          ],
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Pescado_adobado%2C_rebozado_y_frito.jpg/1280px-Pescado_adobado%2C_rebozado_y_frito.jpg',
        fallback: '/images/food.svg',
        imageAlt: {
          es: 'Tapa andaluza de pescado en adobo',
          en: 'Andalusian marinated fried fish tapa',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Pescado_adobado,_rebozado_y_frito.jpg',
      },
      {
        title: {
          es: 'Qué pedir (según sus clientes)',
          en: 'What to order (according to its regulars)',
        },
        text: {
          es: 'Si es tu primera visita, ve a lo que más aplauden las reseñas: el tartar de atún rojo, los makis y el sushi, las albóndigas de solomillo de vaca y, por supuesto, el jamón cortado a cuchillo delante de ti. Los carnívoros tienen su fiesta con las carnes maduradas y las hamburguesas de la casa, y para el final quedan las tartas de Nutella y de Oreo. Déjate aconsejar con el vino: los camareros saben lo que hacen.',
          en: "If it's your first visit, go for what the reviews applaud the most: the bluefin tuna tartare, the maki rolls and sushi, the beef tenderloin meatballs and, of course, the jamón hand-carved right in front of you. Meat lovers get their feast with the aged beef and the house burgers, and save room for the Nutella and Oreo cakes. Let them guide you on the wine: the waiters know their stuff.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Pescado_frito_diverso.jpg/1280px-Pescado_frito_diverso.jpg',
        fallback: '/images/food.svg',
        imageAlt: {
          es: 'Surtido de platos andaluces',
          en: 'Assortment of Andalusian dishes',
        },
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Pescado_frito_diverso.jpg',
      },
      {
        title: {
          es: 'Información práctica (y un truco de local)',
          en: 'Practical info (and a local trick)',
        },
        text: {
          es: 'Lo encontrarás en la calle Méndez Núñez 3, en pleno centro y a un paseo de todos nuestros apartamentos — de hecho, nuestro alojamiento de Méndez Núñez 3 está en el mismo edificio: cenas y subes a dormir. Abre todos los días, con comidas de 12:00 a 16:00 y cenas de 20:00 hasta cerca de la medianoche. El truco de local: reserva mesa, sobre todo el fin de semana, en el +34 678 40 12 53. Y si el plan es de sofá, también tienen reparto a domicilio.',
          en: "You'll find it at Calle Méndez Núñez 3, right in the centre and a stroll from all our apartments — in fact, our Méndez Núñez 3 apartment is in the very same building: have dinner and walk upstairs to bed. Open every day, with lunch from 12:00 to 16:00 and dinner from 20:00 until close to midnight. The local trick: book a table, especially at weekends, on +34 678 40 12 53. And if it's a sofa kind of night, they deliver too.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Iglesia_de_la_Inmaculada_en_La_L%C3%ADnea_de_la_Concepci%C3%B3n_2.jpg/1280px-Iglesia_de_la_Inmaculada_en_La_L%C3%ADnea_de_la_Concepci%C3%B3n_2.jpg',
        fallback: '/images/hero.svg',
        imageAlt: {
          es: 'El centro de La Línea de la Concepción, junto a la iglesia de la Inmaculada',
          en: 'The centre of La Línea de la Concepción, by the Church of the Immaculate Conception',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Iglesia_de_la_Inmaculada_en_La_L%C3%ADnea_de_la_Concepci%C3%B3n_2.jpg',
        link: {
          label: { es: 'Ver El Rincón de Juan', en: 'See El Rincón de Juan' },
          url: 'https://www.elrincondejuan.es/',
        },
      },
    ],
    cta: {
      es: 'Reserva tu apartamento y ven con hambre: la mejor mesa de La Línea te espera a un paseo.',
      en: "Book your apartment and come hungry: La Línea's best table is a stroll away.",
    },
  },
  {
    key: 'city',
    slug: 'ciudad',
    title: {
      es: 'La Línea renace: una ciudad en su mejor momento',
      en: 'La Línea reborn: a city at its finest moment',
    },
    metaDescription: {
      es: 'Millones de euros en nuevos proyectos, barrios revitalizados con fondos europeos, un paseo marítimo renovado y el fin de la Verja: La Línea de la Concepción vive su mejor momento. Ven a descubrirla.',
      en: 'Millions of euros in new projects, neighbourhoods revitalised with European funds, a renewed seafront promenade and the end of the border fence: La Línea de la Concepción is living its finest moment. Come and discover it.',
    },
    hero: {
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Wv_La_L%C3%ADnea_de_la_Concepci%C3%B3n%2C_from_the_Rock_of_Gibraltar_%28cropped%29.jpg/1280px-Wv_La_L%C3%ADnea_de_la_Concepci%C3%B3n%2C_from_the_Rock_of_Gibraltar_%28cropped%29.jpg',
      fallback: '/images/hero.svg',
      alt: {
        es: 'Vista de La Línea de la Concepción desde el Peñón de Gibraltar',
        en: 'View of La Línea de la Concepción from the Rock of Gibraltar',
      },
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Wv_La_L%C3%ADnea_de_la_Concepci%C3%B3n,_from_the_Rock_of_Gibraltar_(cropped).jpg',
    },
    intro: {
      es: 'Si hace años que no visitas La Línea, prepárate: no la vas a reconocer. La ciudad vive una transformación histórica — millones de euros en nuevos proyectos, barrios enteros renovados con fondos europeos, un litoral cada vez más cuidado y, como guinda, la desaparición de la Verja que la convierte en la puerta abierta entre Europa y Gibraltar. La Línea no es solo un destino: es una ciudad en pleno despegue, y visitarla ahora es verla nacer de nuevo.',
      en: "If it's been years since you visited La Línea, get ready: you won't recognise it. The city is living through a historic transformation — millions of euros in new projects, whole neighbourhoods renewed with European funds, an ever more cared-for coastline and, as the icing on the cake, the removal of the border fence that makes it the open gateway between Europe and Gibraltar. La Línea isn't just a destination: it's a city taking off, and visiting now means watching it be reborn.",
    },
    sections: [
      {
        title: {
          es: 'Una ciudad en plena transformación',
          en: 'A city in full transformation',
        },
        text: {
          es: 'Más de 20 millones de euros en nuevos proyectos están cambiando la cara de La Línea. El plan "La Línea Revitaliza", cofinanciado con fondos europeos, ha renovado el barrio marinero de La Atunara, y el histórico Mercado de la Concepción — declarado Bien de Interés Cultural — se rehabilita de forma integral para volver a ser el corazón de la ciudad. Calles, plazas y fachadas estrenan vida, y se nota en cada paseo.',
          en: 'More than 20 million euros in new projects are changing the face of La Línea. The "La Línea Revitaliza" plan, co-financed with European funds, has renewed the seafaring quarter of La Atunara, and the historic Mercado de la Concepción — a listed heritage building — is being comprehensively restored to become the heart of the city once again. Streets, squares and façades are coming back to life, and you can feel it on every stroll.',
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Iglesia_de_la_Inmaculada_en_La_L%C3%ADnea_de_la_Concepci%C3%B3n_2.jpg/1280px-Iglesia_de_la_Inmaculada_en_La_L%C3%ADnea_de_la_Concepci%C3%B3n_2.jpg',
        fallback: '/images/hero.svg',
        imageAlt: {
          es: 'Iglesia de la Inmaculada, en el centro de La Línea de la Concepción',
          en: 'Church of the Immaculate Conception, in the centre of La Línea',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Iglesia_de_la_Inmaculada_en_La_L%C3%ADnea_de_la_Concepci%C3%B3n_2.jpg',
      },
      {
        title: {
          es: 'Un litoral cada vez más bonito',
          en: 'A coastline getting prettier every year',
        },
        text: {
          es: 'El Paseo de Poniente estrena zonas infantiles y áreas biosaludables renovadas, y muy pronto lucirá el gran fotocall con las letras de "LA LÍNEA", pensado para que te lleves la foto más bonita del viaje con el Peñón de fondo. Súmale las inversiones en La Alcaidesa y su puerto deportivo a los pies de Gibraltar: kilómetro a kilómetro, el litoral linense se está poniendo de postal.',
          en: 'The Paseo de Poniente has brand-new children\'s play areas and renovated outdoor fitness zones, and will soon unveil the big "LA LÍNEA" letters photocall, designed for you to take home the best photo of your trip with the Rock in the background. Add the investments in La Alcaidesa and its marina at the foot of Gibraltar: kilometre by kilometre, La Línea\'s seafront is becoming picture-perfect.',
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/La_Linea_de_la_Concepcion_2.jpg/1280px-La_Linea_de_la_Concepcion_2.jpg',
        fallback: '/images/beach.svg',
        imageAlt: {
          es: 'El litoral de La Línea de la Concepción',
          en: "La Línea de la Concepción's coastline",
        },
        creditUrl: 'https://commons.wikimedia.org/wiki/File:La_Linea_de_la_Concepcion_2.jpg',
      },
      {
        title: {
          es: 'Bien conectada, bien servida y con futuro',
          en: 'Well connected, well served and full of future',
        },
        text: {
          es: 'La Línea cuenta con un moderno hospital universitario de referencia para toda la comarca, un comercio local en plena efervescencia y, desde julio de 2026, la mayor ventaja de todas: el paso libre a Gibraltar sin controles, que está atrayendo visitantes, inversión y vida a ambos lados. Todo el Campo de Gibraltar mira hacia aquí. Los que la conocemos lo tenemos claro: el mejor momento para descubrir La Línea es ahora.',
          en: "La Línea has a modern university hospital serving the whole region, buzzing local commerce and, since July 2026, the greatest advantage of all: free passage to Gibraltar with no border checks, drawing visitors, investment and life to both sides. The whole Campo de Gibraltar is looking this way. Those of us who know the city are sure of it: the best time to discover La Línea is right now.",
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Rock_of_Gibraltar_from_the_Spanish_side_of_the_frontier.jpg/1280px-Rock_of_Gibraltar_from_the_Spanish_side_of_the_frontier.jpg',
        fallback: '/images/gibraltar.svg',
        imageAlt: {
          es: 'El Peñón de Gibraltar desde La Línea de la Concepción',
          en: 'The Rock of Gibraltar from La Línea de la Concepción',
        },
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Rock_of_Gibraltar_from_the_Spanish_side_of_the_frontier.jpg',
      },
    ],
    cta: {
      es: 'Descubre la nueva La Línea antes que nadie.',
      en: 'Discover the new La Línea before everyone else.',
    },
  },
];
