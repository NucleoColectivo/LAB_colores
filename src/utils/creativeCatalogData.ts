import { ToolDefinition, CreativeToolId, CreativeProject, GeneratedOutput, RecommendedRoute, RouteDiagnosisAnswer } from '../types/creativeSystem';

export const CREATIVE_TOOLS: ToolDefinition[] = [
  {
    id: '01-explorador-ideas',
    orderNumber: '01',
    title: 'Explorador de ideas y proyectos',
    stage: 'comprender',
    stageLabel: '01. Comprender',
    badge: 'Inicio recomendado',
    color: '#f8c300',
    summary: 'Ayuda a descubrir la intención, el problema, el público, la pregunta generadora y el resultado que se quiere lograr.',
    deliverable: 'Ficha del proyecto, concepto inicial y lista de acciones.',
    recommendedFirst: true
  },
  {
    id: '02-director-arte',
    orderNumber: '02',
    title: 'Director de arte y estilo visual',
    stage: 'imaginar',
    stageLabel: '02. Imaginar',
    badge: 'Sistema Visual',
    color: '#7656ff',
    summary: 'Define estética, paleta cromática, referencias, composición, textura, iluminación y coherencia entre piezas.',
    deliverable: 'Dirección visual y guía de estilo reutilizable.'
  },
  {
    id: '03-generador-imagenes',
    orderNumber: '03',
    title: 'Generador de imágenes y fotografía',
    stage: 'producir',
    stageLabel: '03. Producir',
    badge: 'Foto & Prompt',
    color: '#ff4fa3',
    summary: 'Define tipo de imagen, sujeto, estilo, cámara, lente, encuadre, luz, profundidad de campo, formato y uso final.',
    deliverable: 'Prompt visual detallado y variantes de composición.'
  },
  {
    id: '04-director-video',
    orderNumber: '04',
    title: 'Director de video y cinematografía',
    stage: 'producir',
    stageLabel: '03. Producir',
    badge: 'Secuencia & Cine',
    color: '#22c55e',
    summary: 'Define formato horizontal o vertical, duración, planos, movimientos de cámara, ritmo, luz, sonido, continuidad y narrativa.',
    deliverable: 'Prompt de video, secuencia de planos y guion técnico.'
  },
  {
    id: '05-disenador-interactivo',
    orderNumber: '05',
    title: 'Diseñador de experiencias interactivas',
    stage: 'conectar',
    stageLabel: '04. Conectar',
    badge: 'Código & Sensores',
    color: '#06b6d4',
    summary: 'Convierte una idea en una experiencia web, juego, instalación, visualización de datos o sistema que responde al público.',
    deliverable: 'Flujo de interacción, pantallas, acciones y requisitos técnicos.'
  },
  {
    id: '06-laboratorio-sonido',
    orderNumber: '06',
    title: 'Laboratorio de sonido y audiovisual',
    stage: 'producir',
    stageLabel: '03. Producir',
    badge: 'Audio & Paisaje',
    color: '#a855f7',
    summary: 'Diseña paisajes sonoros, voces, música original, visuales reactivos al sonido, videoclips y experiencias sensoriales.',
    deliverable: 'Concepto sonoro, guion de audio y mapa de sincronización.'
  },
  {
    id: '07-productos-digitales',
    orderNumber: '07',
    title: 'Diseñador de productos digitales',
    stage: 'conectar',
    stageLabel: '04. Conectar',
    badge: 'UX / UI / Accesibilidad',
    color: '#3b82f6',
    summary: 'Organiza la navegación, los contenidos, las pantallas, los componentes, la accesibilidad y los estados de una web o app.',
    deliverable: 'Arquitectura de información, prototipo y especificación funcional.'
  },
  {
    id: '08-productor-gestor',
    orderNumber: '08',
    title: 'Productor y gestor del proyecto',
    stage: 'integrar',
    stageLabel: '05. Integrar',
    badge: 'Plan de Producción',
    color: '#f97316',
    summary: 'Divide la idea en tareas, recursos, responsables, entregables, tiempos y criterios de calidad.',
    deliverable: 'Plan de producción, lista de tareas y matriz de seguimiento.'
  }
];

export const DEFAULT_PROJECT_TEMPLATE: CreativeProject = {
  id: 'proj-manuel-oraculo',
  title: 'Oráculo Interactivo y Memoria Comunitaria',
  author: 'Manuel Palacio',
  intention: 'Explorar cómo la IA y el arte generativo pueden ser un espejo sensible de las memorias de un territorio sin despojarlo de su identidad.',
  context: 'Laboratorio de Medios Digitales e IA de Núcleo Colectivo, articulando artistas, educadores y tecnólogos.',
  targetAudience: 'Comunidades locales, creadores visuales, programadores creativos e investigadores de memoria.',
  resources: 'Laptops, navegadores web, modelos generativos, repositorio lab-colores.vercel.app y pantalla colectiva.',
  desiredResult: 'Un sistema vivo donde las voces se transforman en paisajes visuales e interrogantes poéticos compartidos.',
  guidingQuestion: '¿De qué maneras la inteligencia artificial puede amplificar relatos comunitarios en lugar de estandarizarlos?',
  activeStage: 'comprender',
  activeTools: ['01-explorador-ideas', '02-director-arte', '03-generador-imagenes', '05-disenador-interactivo'],
  decisions: {
    artDirection: {
      aesthetic: 'Fotografía documental poética combinada con arte generativo orgánico',
      palette: ['#111111', '#f8c300', '#7656ff', '#f5f3ee'],
      contrast: 'Alto contraste y texturas terrosas con acentos luminosos vibrantes',
      references: 'Graciela Iturbide, Bill Viola, arte textil contemporáneo, p5.js generative shaders',
      rules: 'Evitar clichés de neon cyberpunk; priorizar rostros genuinos, manos trabajadoras y grano analógico 35mm'
    },
    imageParams: {
      subject: 'Retrato en primer plano de una persona mayor tejedora con filamentos de luz proyectados sobre sus manos',
      cameraType: '35mm Film Camera (Hasselblad 500C / Kodak Portra 400)',
      lens: '85mm f/1.4 Portrait Lens',
      framing: 'Medium Close-Up (MCU)',
      angle: 'Eye-level, íntimo y directo',
      lighting: 'Golden Hour natural lateral con suave rebote cálido',
      depth: 'Profundidad de campo corta (f/1.8), fondo sutilmente desenfocado',
      aspectRatio: '16:9'
    }
  },
  generatedOutputs: [],
  updatedAt: new Date().toISOString()
};

// Diagnostic routing engine based on the 5 key questions
export function diagnoseCreativeRoute(answers: RouteDiagnosisAnswer): RecommendedRoute {
  const intentLower = answers.q1Intent.toLowerCase();
  const outputLower = answers.q2Output.toLowerCase();

  if (outputLower.includes('video') || intentLower.includes('video') || intentLower.includes('cine')) {
    return {
      id: 'route-audiovisual',
      title: 'Ruta Audiovisual y Cine Generativo',
      badge: 'Video · Cinematografía · Montaje',
      description: 'Construye un relato secuencial con coherencia lumínica, planos fluidos y ritmo sonoro para video generativo.',
      guidingQuestion: '¿Cómo narrar una transformación visual a través del tiempo sin perder la intimidad del plano?',
      firstStep15min: 'Escribir el desglose de 3 planos clave (apertura, clímax, cierre) y definir el movimiento de cámara principal.',
      recommendedTools: ['01-explorador-ideas', '02-director-arte', '04-director-video', '06-laboratorio-sonido'],
      macroPhases: [
        { stage: 'comprender', action: 'Definir la intención narrativa y la emoción dominante.', tools: ['01-explorador-ideas'] },
        { stage: 'imaginar', action: 'Fijar la biblia visual, paleta cromática y atmósfera lumínica.', tools: ['02-director-arte'] },
        { stage: 'producir', action: 'Generar secuencia de planos técnicos y guion sonoro.', tools: ['04-director-video', '06-laboratorio-sonido'] },
        { stage: 'integrar', action: 'Montar el prototipo en video y validar ritmo.', tools: ['08-productor-gestor'] }
      ]
    };
  }

  if (outputLower.includes('interactiv') || outputLower.includes('web') || outputLower.includes('código') || intentLower.includes('interactiv') || intentLower.includes('programaci')) {
    return {
      id: 'route-interactiva',
      title: 'Ruta de Experiencia Interactiva y Código Creativo',
      badge: 'Web · p5.js · Instalación',
      description: 'Transforma una idea en un flujo vivo de entrada, procesamiento sensible y visualización reactiva.',
      guidingQuestion: '¿Qué acción física o digital del público puede alterar poéticamente el universo visual?',
      firstStep15min: 'Diagramar el ciclo Entrada (mouse/voz/cámara) → Procesamiento → Salida visual en canvas interactivo.',
      recommendedTools: ['01-explorador-ideas', '02-director-arte', '05-disenador-interactivo', '07-productos-digitales'],
      macroPhases: [
        { stage: 'comprender', action: 'Definir el propósito y el tipo de público.', tools: ['01-explorador-ideas'] },
        { stage: 'imaginar', action: 'Diseñar el sistema de respuesta estética y metáforas.', tools: ['02-director-arte'] },
        { stage: 'conectar', action: 'Estructurar el flujo de interacción y estados de la pantalla.', tools: ['05-disenador-interactivo', '07-productos-digitales'] },
        { stage: 'integrar', action: 'Plan de pruebas con usuarios y montaje en el navegador.', tools: ['08-productor-gestor'] }
      ]
    };
  }

  if (outputLower.includes('sonido') || intentLower.includes('audio') || intentLower.includes('música')) {
    return {
      id: 'route-sonora',
      title: 'Ruta de Paisaje Sonoro y Experiencia Inmersiva',
      badge: 'Audio · Texturas · Reactivo',
      description: 'Construye un universo auditivo que complemente o guíe la experiencia estética comunitaria.',
      guidingQuestion: '¿Qué sonidos evocan la identidad del espacio y cómo entran en diálogo con la tecnología?',
      firstStep15min: 'Listar 3 capas de sonido: base atmosférica, eventos de detalle y voz o melodía principal.',
      recommendedTools: ['01-explorador-ideas', '06-laboratorio-sonido', '02-director-arte', '08-productor-gestor'],
      macroPhases: [
        { stage: 'comprender', action: 'Identificar memorias y timbres del territorio.', tools: ['01-explorador-ideas'] },
        { stage: 'producir', action: 'Diseñar guion de audio, frecuencias y espacialización.', tools: ['06-laboratorio-sonido'] },
        { stage: 'imaginar', action: 'Definir la identidad visual que acompaña al sonido.', tools: ['02-director-arte'] },
        { stage: 'integrar', action: 'Sincronizar y preparar la escucha compartida.', tools: ['08-productor-gestor'] }
      ]
    };
  }

  // Default: Imagen y Dirección Creativa Integral
  return {
    id: 'route-visual-integral',
    title: 'Ruta de Creación Visual y Narrativa Integral',
    badge: 'Imagen · Fotografía · Arte Generativo',
    description: 'Guía paso a paso desde el concepto central y la dirección de arte hasta prompts fotográficos de alta precisión.',
    guidingQuestion: '¿Qué imagen no existe aún en el mundo que resuma la fuerza de esta idea?',
    firstStep15min: 'Definir el sujeto en acción, la atmósfera lumínica de contraste y redactar el prompt maestro de imagen.',
    recommendedTools: ['01-explorador-ideas', '02-director-arte', '03-generador-imagenes', '08-productor-gestor'],
    macroPhases: [
      { stage: 'comprender', action: 'Formular la intención y la pregunta generadora.', tools: ['01-explorador-ideas'] },
      { stage: 'imaginar', action: 'Consolidar la guía de estilo, paleta y referencias.', tools: ['02-director-arte'] },
      { stage: 'producir', action: 'Elaborar prompts fotográficos precisos con óptica y luz.', tools: ['03-generador-imagenes'] },
      { stage: 'integrar', action: 'Seleccionar la mejor variante y planificar la serie.', tools: ['08-productor-gestor'] }
    ]
  };
}

// Photographic parameter options with "No sé, recomiéndame"
export const PHOTO_OPTIONS = {
  cameraType: [
    { value: 'auto', label: '✦ No sé, recomiéndame (Decisión del Director de Arte)' },
    { value: '35mm Film Camera (Kodak Portra 400)', label: '35mm Film Camera (Grano cálido analógico, Kodak Portra 400)' },
    { value: 'Medium Format Digital (Hasselblad H6D-100c)', label: 'Medio Formato Digital (Hasselblad H6D-100c, hiperdetalle clínico)' },
    { value: 'Cinematic 35mm (Arri Alexa LF)', label: 'Cinematográfica 35mm (Arri Alexa LF, rango dinámico suave)' },
    { value: 'Vintage TLR (Rolleiflex 2.8F)', label: 'Vintage TLR (Rolleiflex 6x6, profundidad envolvente)' },
    { value: 'Polaroid 600 Vintage', label: 'Polaroid Instantánea (Bordes orgánicos, ligera sobreexposición)' },
    { value: 'Documentary DSLR (Canon EOS R5)', label: 'Documental Digital (Canon R5, textura nítida y natural)' }
  ],
  lens: [
    { value: 'auto', label: '✦ No sé, recomiéndame según el encuadre' },
    { value: '85mm f/1.4 Portrait Lens', label: '85mm f/1.4 (Retrato íntimo con compresión y desenfoque poético)' },
    { value: '50mm f/1.2 Standard Prime', label: '50mm f/1.2 (Perspectiva ocular natural y bokeh sedoso)' },
    { value: '35mm f/1.4 Documentary Prime', label: '35mm f/1.4 (Documental inmersivo con sujeto en su entorno)' },
    { value: '24mm f/2.8 Ultra-Wide Lens', label: '24mm f/2.8 Gran Angular (Expansión espacial y dinamismo)' },
    { value: '100mm f/2.8 Macro Lens', label: '100mm f/2.8 Macro (Detalles microscópicos y texturas de materia)' },
    { value: 'Anamorphic 40mm Cinema Lens', label: '40mm Anamórfico (Bokeh ovalado, destellos horizontales de cine)' }
  ],
  framing: [
    { value: 'auto', label: '✦ No sé, recomiéndame la composición más expresiva' },
    { value: 'Extreme Close-Up (ECU)', label: 'Primerísimo primer plano (Ojos, manos, textura)' },
    { value: 'Close-Up (CU)', label: 'Primer plano (Rostro y emoción directa)' },
    { value: 'Medium Close-Up (MCU)', label: 'Plano medio corto (Busto y presencia)' },
    { value: 'Medium Shot (MS)', label: 'Plano medio (Cintura hacia arriba en acción)' },
    { value: 'Full Shot (FS)', label: 'Plano entero (Figura completa en relación al suelo)' },
    { value: 'Wide Landscape Shot (WS)', label: 'Plano general / Paisaje (Sujeto inmerso en el territorio)' }
  ],
  lighting: [
    { value: 'auto', label: '✦ No sé, recomiéndame la luz idónea para la intención' },
    { value: 'Golden Hour warm directional sunlight with soft rim light', label: 'Hora Dorada (Luz rasante cálida de atardecer)' },
    { value: 'Chiaroscuro Caravaggio-style high-contrast moody lighting', label: 'Claroscuro dramático (Inspiración Caravaggio, sombras profundas)' },
    { value: 'Overcast diffused cinematic natural daylight', label: 'Cielo cubierto difuso (Luz suave de día nublado, sin sombras duras)' },
    { value: 'Volumetric god rays filtering through mist and dust', label: 'Rayos volumétricos filtrados entre niebla o polvo suspendido' },
    { value: 'Bioluminescent organic glow with deep emerald shadows', label: 'Resplandor bioluminiscente tenue sobre penumbra' },
    { value: 'Studio softbox with subtle violet and gold bounce', label: 'Estudio suave con doble rebote violeta y dorado' }
  ],
  depth: [
    { value: 'auto', label: '✦ No sé, recomiéndame la profundidad' },
    { value: 'Shallow depth of field f/1.4 with creamy bokeh background', label: 'Corta (f/1.4, fondo desenfocado y sujeto aislado)' },
    { value: 'Deep depth of field f/11 everything in sharp crisp focus', label: 'Profunda (f/11, todo nítido desde el primer plano al infinito)' },
    { value: 'Moderate cinematic separation f/2.8', label: 'Moderada (f/2.8, separación natural cinematográfica)' }
  ],
  aspectRatio: [
    { value: '16:9', label: '16:9 (Panorámico / Cine / Web horizontal)' },
    { value: '9:16', label: '9:16 (Vertical / Historias / Móvil)' },
    { value: '1:1', label: '1:1 (Cuadrado / Retrato editorial)' },
    { value: '4:5', label: '4:5 (Vertical editorial / Instagram)' },
    { value: '2.39:1', label: '2.39:1 (Anamórfico cinematográfico ultra amplio)' }
  ]
};

// Video cinematic options
export const VIDEO_OPTIONS = {
  movement: [
    { value: 'auto', label: '✦ No sé, recomiéndame movimiento de cámara' },
    { value: 'Slow cinematic push-in dolly forward towards subject', label: 'Dolly in lento y sostenido hacia el centro' },
    { value: 'Gentle circular orbit tracking shot 180 degrees', label: 'Órbita circular lenta de 180 grados' },
    { value: 'Fixed static tripod frame with internal micro-movements', label: 'Cámara fija en trípode con acción interna sutil' },
    { value: 'Handheld organic documentary follow camera with subtle sway', label: 'Cámara en mano documental con respiración suave' },
    { value: 'Crane rising vertically revealing the surrounding landscape', label: 'Grúa elevándose verticalmente hacia el horizonte' }
  ],
  rhythm: [
    { value: 'auto', label: '✦ No sé, recomiéndame el ritmo' },
    { value: 'Contemplative and slow (5-8 seconds per transition)', label: 'Contemplativo y sosegado (Respiración larga)' },
    { value: 'Rhythmic and pulsating (Sync with beats)', label: 'Rítmico y pulsante (Sincronizado al pulso sonoro)' },
    { value: 'Dynamic crescendo with acceleration', label: 'Crescendo dinámico con aceleración gradual' }
  ]
};

// Interactive design presets
export const INTERACTION_OPTIONS = {
  inputType: [
    { value: 'auto', label: '✦ Recomendar entrada según el espacio' },
    { value: 'Movimiento del mouse y clics interactivos en pantalla', label: 'Mouse / Cursor táctil en navegador' },
    { value: 'Detección de voz o sonido en tiempo real vía micrófono', label: 'Micrófono (Voz, aplauso o murmullo)' },
    { value: 'Cámara web con tracking de rostro o manos (PoseNet/MediaPipe)', label: 'Cámara web (Gesto de manos o presencia)' },
    { value: 'Teclado y pulsadores numéricos', label: 'Teclado o botones físicos' },
    { value: 'Datos en vivo de un repositorio colectivo', label: 'Datos en vivo (Aportes del taller)' }
  ],
  outputType: [
    { value: 'auto', label: '✦ Recomendar salida estética' },
    { value: 'Lienzo interactivo en p5.js con partículas y formas vivas', label: 'Lienzo generativo en p5.js / WebGL' },
    { value: 'Oráculo de texto y preguntas que mutan con las decisiones', label: 'Oráculo de relatos y preguntas poéticas' },
    { value: 'Secuencia audiovisual reactiva con modulación sonora', label: 'Visuales reactivos con sonido sintetizado' },
    { value: 'Muro colectivo colaborativo en tiempo real', label: 'Muro visual compartido en tiempo real' }
  ]
};
