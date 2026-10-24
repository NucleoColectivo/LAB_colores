export type CreativeStage = 'comprender' | 'imaginar' | 'producir' | 'conectar' | 'integrar';

export type CreativeToolId = 
  | '01-explorador-ideas'
  | '02-director-arte'
  | '03-generador-imagenes'
  | '04-director-video'
  | '05-disenador-interactivo'
  | '06-laboratorio-sonido'
  | '07-productos-digitales'
  | '08-productor-gestor';

export interface GeneratedOutput {
  id: string;
  toolId: CreativeToolId;
  toolName: string;
  title: string;
  timestamp: string;
  promptText: string;
  resultAnalysis?: string;
  parameters: Record<string, any>;
  targetPlatform?: string; // 'Midjourney' | 'Runway' | 'p5.js' | 'Web' | 'Audio' | 'Document'
}

export type EstadoFicha = 'exploracion' | 'produccion' | 'integracion';

export interface CreativeProject {
  id: string;
  title: string;
  author: string;
  intention: string; // ¿Qué quiero expresar, explorar, comunicar, imaginar o transformar?
  context: string;
  targetAudience: string;
  resources: string;
  desiredResult: string;
  guidingQuestion?: string; // Pregunta generadora
  activeStage: CreativeStage;
  fichaStatus?: EstadoFicha; // Estado de Ficha: Exploración, Producción, Integración
  activeTools: CreativeToolId[];
  decisions: {
    artDirection?: {
      aesthetic?: string;
      palette?: string[];
      contrast?: string;
      references?: string;
      rules?: string;
    };
    imageParams?: {
      subject?: string;
      cameraType?: string;
      lens?: string;
      framing?: string;
      angle?: string;
      lighting?: string;
      depth?: string;
      aspectRatio?: string;
    };
    videoParams?: {
      format?: string;
      duration?: string;
      shotSequence?: string;
      movement?: string;
      rhythm?: string;
      audioCues?: string;
    };
    interactionParams?: {
      inputType?: string;
      processingType?: string;
      outputType?: string;
      interactionFlow?: string;
    };
    soundParams?: {
      soundscape?: string;
      voices?: string;
      musicalTone?: string;
      reactiveElements?: string;
    };
    productionPlan?: {
      prototype15min?: string;
      phase2?: string;
      phase3?: string;
      qualityCriteria?: string;
    };
  };
  generatedOutputs: GeneratedOutput[];
  updatedAt: string;
}

export interface RouteDiagnosisAnswer {
  q1Intent: string; // ¿Qué quieres hacer hoy?
  q2Output: string; // ¿Qué resultado imaginas?
  q3Audience: string; // ¿Para quién es?
  q4Resources: string; // ¿Con qué recursos cuentas?
  q5Support: string; // ¿Cómo quieres que te acompañe?
}

export interface RecommendedRoute {
  id: string;
  title: string;
  badge: string;
  description: string;
  guidingQuestion: string;
  firstStep15min: string;
  recommendedTools: CreativeToolId[];
  macroPhases: {
    stage: CreativeStage;
    action: string;
    tools: CreativeToolId[];
  }[];
}

export interface ToolDefinition {
  id: CreativeToolId;
  orderNumber: string;
  title: string;
  stage: CreativeStage;
  stageLabel: string;
  badge: string;
  color: string;
  summary: string;
  deliverable: string;
  recommendedFirst?: boolean;
}

export interface FichaProyecto {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  estado?: EstadoFicha; // Estado de Ficha: 'exploracion' | 'produccion' | 'integracion'
  intention: string;
  purposeOneLiner: string;
  guidingQuestion: string;
  context: string;
  targetAudience: string;
  resources: string;
  desiredResult: string;
  emotionalTone: string;
  firstAction15Min: string;
  recommendedTools: CreativeToolId[];
  notes?: string;
}

export const ESTADO_FICHA_CONFIG: Record<
  EstadoFicha,
  {
    label: string;
    description: string;
    badge: string;
    stageLabel: string;
    color: string;
    textColor: string;
    accentBorder: string;
    tools: CreativeToolId[];
  }
> = {
  exploracion: {
    label: 'Exploración',
    description: 'Comprender e imaginar: intención, dirección de arte, preguntas generadoras y primeras imágenes',
    badge: '01 · Exploración',
    stageLabel: 'Comprender & Imaginar',
    color: 'bg-amber-400',
    textColor: 'text-amber-950',
    accentBorder: 'border-amber-400',
    tools: ['01-explorador-ideas', '02-director-arte', '03-generador-imagenes']
  },
  produccion: {
    label: 'Producción',
    description: 'Crear y producir: fotografía profesional, cinematografía, diseño sonoro y prototipado',
    badge: '02 · Producción',
    stageLabel: 'Producir',
    color: 'bg-fuchsia-500',
    textColor: 'text-white',
    accentBorder: 'border-fuchsia-500',
    tools: ['03-generador-imagenes', '04-director-video', '05-disenador-interactivo', '06-laboratorio-sonido']
  },
  integracion: {
    label: 'Integración',
    description: 'Conectar y publicar: experiencia interactiva, producto digital web y plan de entrega',
    badge: '03 · Integración',
    stageLabel: 'Conectar & Integrar',
    color: 'bg-emerald-500',
    textColor: 'text-white',
    accentBorder: 'border-emerald-500',
    tools: ['05-disenador-interactivo', '07-productos-digitales', '08-productor-gestor']
  }
};


