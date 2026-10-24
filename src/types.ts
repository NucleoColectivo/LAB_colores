export interface ParticipantContribution {
  id: number | string;
  name: string;
  alias: string;
  email: string;
  phone?: string;
  location?: string;
  organization?: string;
  social?: string;
  shareContact: boolean;
  role: string;
  languages: string[];
  themes: string;
  memory: string;
  wish: string;
  resources: string;
  createdAt: string;
}

export interface LanguageDefinition {
  id: string;
  name: string;
  category: string;
  desc: string;
  iconName: string;
  color: string;
}

export interface CreativeCrossTemplate {
  match: string[];
  title: string;
  desc: string;
  q: string;
  tagColor?: 'yellow' | 'purple' | 'pink' | 'emerald';
}

export interface WorkshopStep {
  num: string;
  time: string;
  title: string;
  desc: string;
  objective: string;
}

export const OFFICIAL_WORKSHOP_URL = "https://lab-colores.vercel.app/";
export const OFFICIAL_QR_ASSET_PATH = "/assets/aistudio/adobe-express-qr-code_c69d46d1.png";
export const OFFICIAL_WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/ErtCU75vz84H95zQ7Lj8rM";
export const OFFICIAL_WHATSAPP_QR_ASSET_PATH = "/assets/aistudio/WhatsApp_Image_2026-10-24_at_2.23.20_AM_d36c17ad.jpeg";

export const WORKSHOP_STEPS: WorkshopStep[] = [
  {
    num: "01",
    time: "9:00 – 9:25",
    title: "Conocernos",
    desc: "Roles, expectativas y acuerdos de cuidado para participar.",
    objective: "Generar confianza y reconocer la diversidad del grupo."
  },
  {
    num: "02",
    time: "9:25 – 10:15",
    title: "Reconocer",
    desc: "Intereses, experiencias, memorias e imágenes significativas.",
    objective: "Cartografiar el punto de partida de cada participante."
  },
  {
    num: "03",
    time: "10:15 – 11:15",
    title: "Explorar y cruzar",
    desc: "Lenguajes, referentes y conexiones entre intereses.",
    objective: "Descubrir puentes inesperados entre disciplinas."
  },
  {
    num: "04",
    time: "11:15 – 12:30",
    title: "Enfocar",
    desc: "Preguntas generadoras y elección de ideas colectivas.",
    objective: "Definir prototipos o iniciativas para dar continuidad."
  }
];

export const CREATIVE_LANGUAGES: LanguageDefinition[] = [
  {
    id: "imagen-ilustracion",
    name: "Imagen e ilustración",
    category: "Visual",
    desc: "Dibujo, collage, pintura, diseño gráfico y composición",
    iconName: "Palette",
    color: "#ff4fa3"
  },
  {
    id: "fotografia-memoria",
    name: "Fotografía y memoria visual",
    category: "Archivo & Luz",
    desc: "Retrato, archivo familiar, fotomontaje y territorio",
    iconName: "Camera",
    color: "#7656ff"
  },
  {
    id: "comic-narrativas",
    name: "Cómic y narrativas gráficas",
    category: "Narrativa",
    desc: "Personajes, viñetas, fanzine, historieta y diálogo",
    iconName: "BookOpen",
    color: "#f8c300"
  },
  {
    id: "video-audiovisual",
    name: "Video y audiovisual",
    category: "Movimiento",
    desc: "Historias, cortometrajes, microdocumental, montaje",
    iconName: "Video",
    color: "#e11d48"
  },
  {
    id: "experiencias-inmersivas",
    name: "Experiencias inmersivas",
    category: "Espacial",
    desc: "Videoarte, proyección en muro, mapping y ambientación",
    iconName: "Sparkles",
    color: "#9333ea"
  },
  {
    id: "sonido-musica",
    name: "Sonido y música",
    category: "Sonoro",
    desc: "Voz, paisajes sonoros, ambientes cotidianos, ritmos",
    iconName: "Volume2",
    color: "#2563eb"
  },
  {
    id: "arte-interactivo",
    name: "Arte interactivo",
    category: "Relacional",
    desc: "Participación del público, sensores, dispositivos táctiles",
    iconName: "HandMetal",
    color: "#059669"
  },
  {
    id: "programacion-creativa",
    name: "Programación creativa",
    category: "Código",
    desc: "Código generativo, p5.js, visuales de datos, algoritmos",
    iconName: "Code2",
    color: "#0284c7"
  },
  {
    id: "ia-experimentacion",
    name: "IA y experimentación",
    category: "Sintético & Emergente",
    desc: "Transformación de imagen, texto, video y diálogo con modelos",
    iconName: "Cpu",
    color: "#7c3aed"
  },
  {
    id: "instalacion-objetos",
    name: "Instalación y objetos",
    category: "Materia",
    desc: "Ensamblaje, escultura social, espacio expositivo y materia",
    iconName: "Box",
    color: "#d97706"
  },
  {
    id: "cartografia-territorio",
    name: "Cartografía y territorio",
    category: "Geográfico",
    desc: "Mapas afectivos, derivas, símbolos barriales y lugares",
    iconName: "MapPin",
    color: "#16a34a"
  },
  {
    id: "futuros-imaginados",
    name: "Futuros imaginados",
    category: "Especulativo",
    desc: "Ficción especulativa, mundos posibles, utopías locales",
    iconName: "Compass",
    color: "#ea580c"
  }
];

export const CROSS_TEMPLATES: CreativeCrossTemplate[] = [
  {
    match: ['Fotografía y memoria visual', 'Sonido y música'],
    title: 'Archivo vivo: imágenes que se escuchan',
    desc: 'Combinar fotografías, relatos orales y paisajes sonoros para crear un archivo sensible y afectivo del territorio.',
    q: '¿Qué historias de nuestro entorno merecen ser vistas y escuchadas con calma?',
    tagColor: 'purple'
  },
  {
    match: ['Cartografía y territorio', 'Imagen e ilustración'],
    title: 'Cartografía afectiva de lugares con alma',
    desc: 'Construir un mapa colectivo ilustrado con rutas, recuerdos, advertencias poéticas y símbolos creados en comunidad.',
    q: '¿Qué lugares cuentan quiénes somos y cómo habitamos este territorio?',
    tagColor: 'yellow'
  },
  {
    match: ['Video y audiovisual', 'Cómic y narrativas gráficas'],
    title: 'Historias en viñetas animadas',
    desc: 'Transformar relatos barriales o sueños compartidos en secuencias audiovisuales breves que mezclan dibujo y movimiento.',
    q: '¿Qué historia urgente queremos contar desde nuestra propia mirada y humor?',
    tagColor: 'pink'
  },
  {
    match: ['Arte interactivo', 'Programación creativa'],
    title: 'Espacio reactivo: el lugar que responde',
    desc: 'Imaginar una instalación interactiva sencilla donde la presencia o voz del público active imágenes proyectadas, luces o sonidos.',
    q: '¿Cómo podría este espacio físico reaccionar a lo que sentimos colectivamente?',
    tagColor: 'purple'
  },
  {
    match: ['IA y experimentación', 'Imagen e ilustración'],
    title: 'Imágenes de lo posible: dibujo + IA',
    desc: 'Bocetar visiones comunitarias a mano y explorar variaciones mediante IA generativa, manteniendo siempre la autoría del grupo.',
    q: '¿Qué horizonte o sueño colectivo queremos visualizar que hoy no existe?',
    tagColor: 'yellow'
  },
  {
    match: ['Instalación y objetos', 'Fotografía y memoria visual'],
    title: 'Museo portátil de pequeñas memorias',
    desc: 'Reunir objetos cotidianos, fotografías familiares y testimonios en un gabinete vivo o fanzine de archivo comunal.',
    q: '¿Qué objetos aparentemente sencillos custodian la memoria más profunda del barrio?',
    tagColor: 'pink'
  },
  {
    match: ['Futuros imaginados', 'Video y audiovisual'],
    title: 'Postales audiovisuales desde el año 2040',
    desc: 'Microcortos que imaginan cartas o testimonios enviados desde un futuro donde logramos sanar o transformar una problemática actual.',
    q: '¿Qué futuro queremos heredar y qué semilla tenemos que sembrar hoy?',
    tagColor: 'purple'
  },
  {
    match: ['Sonido y música', 'Video y audiovisual'],
    title: 'Sinfonía del barrio y paisajes cotidianos',
    desc: 'Registrar texturas sonoras (mercados, lluvia, pregones, pájaros) y sincronizarlas con planos visuales de detalle.',
    q: '¿A qué suena nuestro día a día y qué emoción despierta en quien lo escucha?',
    tagColor: 'emerald'
  },
  {
    match: ['IA y experimentación', 'Futuros imaginados'],
    title: 'Oráculo comunitario de futuros posibles',
    desc: 'Alimentar un asistente o prompt creativo con los deseos del taller para generar relatos de futuros alternativos.',
    q: '¿Qué preguntas le haríamos al futuro si supieramos que la tecnología escucha nuestros anhelos?',
    tagColor: 'yellow'
  },
  {
    match: ['Cartografía y territorio', 'Sonido y música'],
    title: 'Geografía sonora y paseos auditivos',
    desc: 'Mapear puntos geográficos clave con grabaciones de audio geolocalizadas o códigos QR pegados en esquinas significativas.',
    q: '¿Cómo cambia nuestra percepción de una calle cuando cerramos los ojos y solo escuchamos?',
    tagColor: 'purple'
  }
];

export const INITIAL_SEED_DATA: ParticipantContribution[] = [
  {
    id: 1719820000001,
    name: "Lucía Morales Mendoza",
    alias: "Lucía M.",
    email: "lucia.morales.arte@gmail.com",
    phone: "+57 312 456 7890",
    location: "Barrio San Antonio / Cali",
    organization: "Taller Gráfico La Madriguera",
    social: "@lucia_grabado",
    shareContact: true,
    role: "Artista o creador/a",
    languages: ["Imagen e ilustración", "Fotografía y memoria visual", "Cartografía y territorio"],
    themes: "Memorias del río, árboles antiguos del barrio, relatos de abuelas",
    memory: "Las tardes en la casa de mi abuela cosiendo retazos mientras escuchábamos la radio comunitaria.",
    wish: "Poder hacer un fanzine con mapas bordados y fotografías antiguas de los vecinos para repartir en las tiendas.",
    resources: "Cámara digital, acuarelas, scanner casero y muchas ganas de entrevistar adultos mayores.",
    createdAt: "2026-10-24T09:14:00.000Z"
  },
  {
    id: 1719820000002,
    name: "Camilo Rengifo Ortiz",
    alias: "Camilo R.",
    email: "camilo.creativecode@gmail.com",
    phone: "+57 301 987 6543",
    location: "Comuna 4 / Medellín",
    organization: "Colectivo Sintético Lab",
    social: "github.com/camilo-code",
    shareContact: true,
    role: "Estudiante",
    languages: ["Programación creativa", "IA y experimentación", "Sonido y música"],
    themes: "Música generativa, datos bioclimáticos, inteligencia artificial aplicada al paisaje sonoro",
    memory: "La primera vez que un sketch en p5.js comenzó a modular frecuencias sonoras según la temperatura ambiental.",
    wish: "Desarrollar una instalación interactiva donde las plantas del parque comunal generen melodías audibles para los transeúntes.",
    resources: "Laptop, sensores básicos Arduino, teclado MIDI y conocimientos en p5.js y Python.",
    createdAt: "2026-10-24T09:22:00.000Z"
  },
  {
    id: 1719820000003,
    name: "María Elena Zuleta",
    alias: "Elena Zuleta",
    email: "huertocomunal.semillas@gmail.com",
    phone: "+57 315 223 3445",
    location: "Vereda El Salado",
    organization: "Red Comunitaria de Semillas Vivas",
    social: "@semillasvivas_red",
    shareContact: true,
    role: "Integrante de un colectivo",
    languages: ["Cartografía y territorio", "Instalación y objetos", "Futuros imaginados"],
    themes: "Soberanía alimentaria, semillas nativas, saberes medicinales ancestrales y agua limpia",
    memory: "El trueque intergeneracional de semillas con campesinas de la cuenca alta hace tres veranos.",
    wish: "Un mapa vivo en el parque comunal con señalética ecológica y bancos hechos con madera y material recuperado.",
    resources: "Espacio en el huerto demostrativo, madera reciclada, herramientas de carpintería y catálogo de semillas.",
    createdAt: "2026-10-24T09:28:00.000Z"
  },
  {
    id: 1719820000004,
    name: "Mateo Bermúdez Silva",
    alias: "Mateo B.",
    email: "mateo.profe.artes@gmail.com",
    phone: "+57 320 889 9001",
    location: "Localidad Santa Fe / Bogotá",
    organization: "Colegio Distrital Policarpa Salavarrieta",
    social: "@mateo_fanzines",
    shareContact: true,
    role: "Docente o formador/a",
    languages: ["Cómic y narrativas gráficas", "Video y audiovisual", "IA y experimentación"],
    themes: "Juventudes y tecnología crítica, mitologías urbanas, animación cuadro a cuadro",
    memory: "Un cómic impreso en mimeógrafo que realizamos colectivamente con estudiantes de grado noveno.",
    wish: "Crear una serie de microhistorias en animación o cómic sobre los mitos y personajes nocturnos del barrio.",
    resources: "Tableta digitalizadora, micrófono de solapa, proyector portátil para muros comunitarios.",
    createdAt: "2026-10-24T09:35:00.000Z"
  }
];
