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
  dataConsent: boolean;
  role: string;
  languages: string[];
  themes: string;
  memory: string;
  wish: string;
  resources: string;
  createdAt: string;
  pin?: string;
  qrCodeData?: string;
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

export interface WorkshopAdvance {
  id: number | string;
  type: 'individual' | 'colectivo';
  title: string;
  authors: string[];
  commonPoints: string[];
  individualIdea: string;
  collectiveIntersection?: string;
  milestone: string;
  status: 'boceto' | 'prototipo' | 'pruebas' | 'listo';
  mediaUrl?: string;
  createdAt: string;
}

export interface CreativeSpark {
  sparkTitle: string;
  thematicBridge: string;
  fifteenMinPlan: {
    min0to5: string;
    min5to10: string;
    min10to15: string;
  };
  runway: {
    prompt: string;
    cameraMotion: string;
    tips: string;
  };
  midjourney: {
    prompt: string;
    aspectRatio: string;
    styleTips: string;
  };
  p5js: {
    title: string;
    code: string;
    interactionHint: string;
  };
}

export interface ThemeGroup {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  color: string;
  keywords: string[];
  suggestedCommonPoints: string[];
}

export interface CommonPointCategory {
  id: string;
  name: string;
  shortLabel: string;
  iconName: string;
  color: string;
  description: string;
  relatedLanguages: string[];
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

export const FACILITATOR_NAME = "Manuel Palacio";
export const FACILITATOR_PHONE = "+57 300 610 1221";
export const FACILITATOR_WA_NUMBER = "573006101221";
export const FACILITATOR_EMAIL = "nucleo.colectivo.art@gmail.com";

export const WORKSHOP_STEPS: WorkshopStep[] = [
  {
    num: "01",
    time: "9:00 – 9:25",
    title: "Conocernos",
    desc: "Roles, expectativas, Habeas Data y conexión al grupo de WhatsApp.",
    objective: "Generar confianza y reconocer la diversidad del grupo."
  },
  {
    num: "02",
    time: "9:25 – 10:15",
    title: "Ideas individuales",
    desc: "Cada participante plantea su idea de partida, intereses y memorias.",
    objective: "Mapear los deseos creativos propios y recursos disponibles."
  },
  {
    num: "03",
    time: "10:15 – 11:15",
    title: "Puntos en común",
    desc: "Encontrar intersecciones: la imagen, lo interactivo, el video, la IA y el sonido.",
    objective: "Construir alianzas y cruces interdisciplinarios inesperados."
  },
  {
    num: "04",
    time: "11:15 – 12:30",
    title: "Avances y Repositorio",
    desc: "Documentar avances individuales y colectivos para lab-colores.vercel.app.",
    objective: "Consolidar prototipos y publicar la memoria viva del taller."
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
  },
  {
    id: "textil-biomateriales",
    name: "Textil, bordado y materias vivas",
    category: "Material",
    desc: "Costura comunitaria, fibras naturales, tintes y biomateriales",
    iconName: "Scissors",
    color: "#db2777"
  },
  {
    id: "escritura-fanzine",
    name: "Escritura, poesía y fanzine",
    category: "Palabra",
    desc: "Relatos breves, poesía expandida, fanzines y autopublicación",
    iconName: "PenTool",
    color: "#4f46e5"
  },
  {
    id: "animacion-3d",
    name: "Animación y 3D",
    category: "Movimiento",
    desc: "Stop-motion, modelado 3D, animación cuadro a cuadro y motion",
    iconName: "Film",
    color: "#0891b2"
  },
  {
    id: "performance-cuerpo",
    name: "Performance y cuerpo",
    category: "Presencia",
    desc: "Artes vivas, movimiento, intervenciones en el espacio público",
    iconName: "Activity",
    color: "#ca8a04"
  },
  {
    id: "ecologia-bioarte",
    name: "Ecología y ciencia ciudadana",
    category: "Naturaleza",
    desc: "Huertos, bioarte, sensores ambientales y cuidado del agua",
    iconName: "Leaf",
    color: "#15803d"
  },
  {
    id: "pedagogia-comunitaria",
    name: "Pedagogía y saberes tradicionales",
    category: "Comunidad",
    desc: "Educación popular, mediación cultural y oficios locales",
    iconName: "GraduationCap",
    color: "#b45309"
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
    id: 1719820000000,
    name: "Manuel Palacio",
    alias: "Manuel",
    email: "nucleo.colectivo.art@gmail.com",
    phone: "+57 300 610 1221",
    location: "Núcleo Colectivo",
    organization: "Núcleo Colectivo · Laboratorio de Medios Digitales e IA",
    social: "@nucleo.colectivo",
    shareContact: true,
    dataConsent: true,
    role: "Artista o creador/a",
    languages: [
      "IA y experimentación",
      "Programación creativa",
      "Imagen e ilustración",
      "Experiencias inmersivas",
      "Video y audiovisual",
      "Sonido y música"
    ],
    themes: "Inteligencia artificial para procesos creativos, arte generativo, medios interactivos y memoria comunitaria",
    memory: "Exploración de la frontera entre el arte sensible y los modelos generativos de IA en comunidad.",
    wish: "Consolidar el Laboratorio de Medios Digitales e IA como un espacio vivo de co-creación y experimentación abierta.",
    resources: "Dirección creativa, diseño estratégico, programación, experimentación con IA y gestión comunitaria.",
    createdAt: "2026-10-24T07:43:04.063Z",
    pin: "1221",
    qrCodeData: "nucleo://pass/1719820000000"
  }
];

export const COMMON_POINTS: CommonPointCategory[] = [
  {
    id: "la-imagen",
    name: "La Imagen",
    shortLabel: "Imagen & Gráfica",
    iconName: "Palette",
    color: "#ff4fa3",
    description: "Composición visual, ilustración, dibujo, memoria gráfica y fotografía.",
    relatedLanguages: [
      "Imagen e ilustración",
      "Fotografía y memoria visual",
      "Cómic y narrativas gráficas"
    ]
  },
  {
    id: "lo-interactivo",
    name: "Lo Interactivo",
    shortLabel: "Interactivo & Código",
    iconName: "HandMetal",
    color: "#059669",
    description: "Participación del público, dispositivos sensibles, programación generativa y p5.js.",
    relatedLanguages: [
      "Arte interactivo",
      "Programación creativa",
      "Experiencias inmersivas"
    ]
  },
  {
    id: "el-video",
    name: "El Video & Movimiento",
    shortLabel: "Video & Cine",
    iconName: "Video",
    color: "#e11d48",
    description: "Narrativas temporales, microdocumental, animación 3D y secuencias audiovisuales.",
    relatedLanguages: [
      "Video y audiovisual",
      "Animación y 3D"
    ]
  },
  {
    id: "ia-emergente",
    name: "Inteligencia Artificial",
    shortLabel: "IA & Modelos",
    iconName: "Cpu",
    color: "#7c3aed",
    description: "Modelos generativos, diálogos humano-máquina y especulación de futuros.",
    relatedLanguages: [
      "IA y experimentación",
      "Futuros imaginados"
    ]
  },
  {
    id: "el-sonido",
    name: "El Sonido & La Música",
    shortLabel: "Sonido & Paisaje",
    iconName: "Volume2",
    color: "#2563eb",
    description: "Frecuencias, audios de campo, atmósfera sonora e instrumentos reactivos.",
    relatedLanguages: [
      "Sonido y música"
    ]
  },
  {
    id: "territorio-memoria",
    name: "Territorio & Memoria",
    shortLabel: "Territorio & Archivo",
    iconName: "MapPin",
    color: "#16a34a",
    description: "Cartografía afectiva, bio-arte, saberes comunitarios y materia viva.",
    relatedLanguages: [
      "Cartografía y territorio",
      "Textil, bordado y materias vivas",
      "Instalación y objetos",
      "Ecología y ciencia ciudadana",
      "Pedagogía y saberes tradicionales"
    ]
  }
];

export const INITIAL_SEED_ADVANCES: WorkshopAdvance[] = [
  {
    id: "adv-1",
    type: "individual",
    title: "Oráculo Interactivo: Modelado de prompts con memorias comunitarias",
    authors: ["Manuel Palacio"],
    commonPoints: ["Inteligencia Artificial", "Lo Interactivo", "La Imagen"],
    individualIdea: "Explorar cómo la IA puede actuar como un espejo sensible de las memorias de un territorio sin despojarlo de su identidad.",
    milestone: "Estructuración de prompt y flujo en servidor para condensar relatos orales en imágenes y preguntas generadoras.",
    status: "prototipo",
    mediaUrl: "https://lab-colores.vercel.app/",
    createdAt: "2026-10-24T09:45:00.000Z"
  }
];

export interface WorkshopThematicAxis {
  id: string;
  name: string;
  iconName: string;
  color: string;
  shortDesc: string;
  runwayKeyword: string;
  midjourneyStyle: string;
  p5Concept: string;
}

export const WORKSHOP_THEMATIC_AXES: WorkshopThematicAxis[] = [
  {
    id: "imagen",
    name: "Imagen",
    iconName: "Palette",
    color: "#ff4fa3",
    shortDesc: "Ilustración, grabado, diseño, collage, pintura y dibujo",
    runwayKeyword: "high visual contrast, textured botanical and archival illustrations, hand-crafted details",
    midjourneyStyle: "contemporary Risograph art and mixed-media collage, rich earthy pigments, detailed organic linework --ar 16:9 --v 6.1",
    p5Concept: "canvas generativo con texturas de dibujo y paletas de color mutables"
  },
  {
    id: "interactivo",
    name: "Interactivo",
    iconName: "HandMetal",
    color: "#059669",
    shortDesc: "Instalaciones táctiles, sensores, interfaces vivas y participación",
    runwayKeyword: "dynamic interactive light projections reacting to human gestures, glowing tactile sensors",
    midjourneyStyle: "interactive public art installation, responsive bioluminescent lighting, people touching glowing panels in dark gallery space --ar 16:9",
    p5Concept: "interfaz interactiva sensible a la posición del mouse y clics del público"
  },
  {
    id: "video",
    name: "Video",
    iconName: "Video",
    color: "#e11d48",
    shortDesc: "Cine, microdocumental, tomas vivas y narrativas en movimiento",
    runwayKeyword: "cinematic handheld 35mm film shot, slow smooth tracking shot through neighborhood streets at golden hour, nostalgic warmth",
    midjourneyStyle: "cinematography still from independent Latin American documentary, 35mm film grain, natural rim lighting, emotional street portrait --ar 16:9",
    p5Concept: "reproductor de secuencias temporales con filtros cromáticos dinámicos"
  },
  {
    id: "animacion-video",
    name: "Animación de video",
    iconName: "Film",
    color: "#0891b2",
    shortDesc: "Stop-motion, 2D/3D, motion graphics y animación cuadro a cuadro",
    runwayKeyword: "tactile claymation and cut-out stop-motion animation coming to life, fluid rhythmic transformation",
    midjourneyStyle: "tactile stop-motion paper craft animation frame, visible textures of cardboard, fabric, and hand-cut silhouette characters --ar 16:9",
    p5Concept: "animación cuadro a cuadro por bucles matemáticos y deformación de vectores"
  },
  {
    id: "lenguaje-audiovisual",
    name: "Lenguaje audiovisual",
    iconName: "Camera",
    color: "#7656ff",
    shortDesc: "Montaje, plano secuencia, ritmo, voz en off y sincronía sonora",
    runwayKeyword: "atmospheric slow motion visual poem, dynamic editing pacing, atmospheric smoke and shadow play",
    midjourneyStyle: "experimental film still, split-screen collage of memory and territory, dreamlike cinematic composition, chiaroscuro --ar 16:9",
    p5Concept: "modulador visual de ritmo con ondas y frecuencias que bailan al compás"
  },
  {
    id: "programacion-creativa",
    name: "Programación creativa",
    iconName: "Code2",
    color: "#0284c7",
    shortDesc: "p5.js, algoritmos generativos, visuales de código y shaders",
    runwayKeyword: "generative mathematical algorithms evolving in real time, glowing vector lines and organic particle constellations",
    midjourneyStyle: "generative code art visualization, complex vector mesh floating in volumetric space, glowing cyan and violet nodes --ar 16:9",
    p5Concept: "sistema de partículas orgánicas que orbitan y reaccionan con física interactiva"
  },
  {
    id: "textil",
    name: "Textil",
    iconName: "Scissors",
    color: "#db2777",
    shortDesc: "Bordado, costura comunitaria, fibras naturales y tapices vivos",
    runwayKeyword: "extreme macro slow pan over colorful embroidered cotton threads, woven yarn landscapes and tactile stitches",
    midjourneyStyle: "intricate community embroidered tapestry, natural dyed wool threads, indigenous and contemporary motifs intertwined, textile relief --ar 16:9",
    p5Concept: "patrón generativo de telar y tejido digital con hilos entrelazados"
  },
  {
    id: "performance",
    name: "Performance",
    iconName: "Activity",
    color: "#ca8a04",
    shortDesc: "Cuerpo como territorio, artes vivas y presencia en el espacio público",
    runwayKeyword: "expressive contemporary dancer performing in an urban plaza, trailing ribbons of projected light and shadow, cinematic depth",
    midjourneyStyle: "powerful live performance art in public square, expressive body movement interacting with projected shadows and earth pigments --ar 16:9",
    p5Concept: "trazado de movimiento gestual que dibuja estelas de luz según el cursor"
  },
  {
    id: "ecologia",
    name: "Ecología",
    iconName: "Leaf",
    color: "#15803d",
    shortDesc: "Bioarte, plantas, agua, ríos, huertos y ciencia ciudadana",
    runwayKeyword: "time-lapse of river water flowing through lush native moss and riparian vegetation, glistening dew droplets, cinematic macro",
    midjourneyStyle: "speculative bio-art installation, living moss and mycelium circuits connected to water droplets, lush green and amber tones, photorealistic --ar 16:9",
    p5Concept: "simulación biológica de crecimiento vegetal y flujo de corrientes de agua"
  },
  {
    id: "pedagogia",
    name: "Pedagogía",
    iconName: "GraduationCap",
    color: "#b45309",
    shortDesc: "Educación popular, saberes tradicionales, mediación y círculo",
    runwayKeyword: "warm circular community workshop, hands sharing tools, drawings and ancestral stories around a wooden table, soft morning sun",
    midjourneyStyle: "intergenerational popular education circle, people of different ages collaborating over a large illustrated mural, communal warmth, documentary photograph --ar 16:9",
    p5Concept: "círculo participativo de intercambio de palabras e ideas que convergen al centro"
  }
];

export interface SparkNotification {
  id: string;
  advanceId: string | number;
  title: string;
  advanceTitle: string;
  authors: string[];
  categories: string[];
  spark: CreativeSpark;
  createdAt: string;
  read: boolean;
  previewPrompt: string;
}
