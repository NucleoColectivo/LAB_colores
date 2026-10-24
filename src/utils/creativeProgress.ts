import { CreativeProject, EstadoFicha, FichaProyecto } from '../types/creativeSystem';

export interface DeliverableCheck {
  id: string;
  label: string;
  description: string;
  weight: number;
  completed: boolean;
  actionToolId?: string;
}

export interface StageProgress {
  estado: EstadoFicha;
  label: string;
  percentage: number;
  completedCount: number;
  totalCount: number;
  checklist: DeliverableCheck[];
}

export function calculateProjectProgress(
  project: CreativeProject,
  estado: EstadoFicha = 'exploracion',
  ficha?: FichaProyecto | null
): StageProgress {
  if (estado === 'exploracion') {
    const hasIntention = Boolean(
      (project.intention && project.intention.trim().length > 8) ||
      (ficha?.intention && ficha.intention.trim().length > 8)
    );
    const hasPurpose = Boolean(
      (ficha?.purposeOneLiner && ficha.purposeOneLiner.trim().length > 5) ||
      (project.intention && project.intention.trim().length > 20)
    );
    const hasGuidingQuestion = Boolean(
      (project.guidingQuestion && project.guidingQuestion.trim().length > 8 && !project.guidingQuestion.includes('Por definir')) ||
      (ficha?.guidingQuestion && ficha.guidingQuestion.trim().length > 8)
    );
    const hasContext = Boolean(
      (project.context && project.context.trim().length > 5) ||
      (ficha?.context && ficha.context.trim().length > 5)
    );
    const hasArtDirection = Boolean(
      (project.decisions?.artDirection?.aesthetic && project.decisions.artDirection.aesthetic.trim().length > 0) ||
      project.generatedOutputs.some(
        (o) => o.toolId === '02-director-arte' || o.toolId === '01-explorador-ideas'
      )
    );

    const checklist: DeliverableCheck[] = [
      {
        id: 'intention',
        label: 'Intención Central Definida',
        description: 'Inquietud sensible, tema ético o territorio de exploración.',
        weight: 20,
        completed: hasIntention,
        actionToolId: '01-explorador-ideas'
      },
      {
        id: 'purpose',
        label: 'Propósito en una Frase',
        description: 'La síntesis rectora que orientará todas las piezas del proyecto.',
        weight: 15,
        completed: hasPurpose,
        actionToolId: '01-explorador-ideas'
      },
      {
        id: 'guiding-question',
        label: 'Pregunta Generadora Formulada',
        description: 'Disparador catalizador "¿De qué manera...?" que abre rutas creativas.',
        weight: 25,
        completed: hasGuidingQuestion,
        actionToolId: '01-explorador-ideas'
      },
      {
        id: 'context',
        label: 'Contexto & Comunidad Situados',
        description: 'Territorio de origen, público participante y recursos reales.',
        weight: 15,
        completed: hasContext,
        actionToolId: '01-explorador-ideas'
      },
      {
        id: 'art-direction',
        label: 'Dirección de Arte & Guía de Estilo',
        description: 'Paleta cromática, contrastes, texturas y referencias estéticas guardadas.',
        weight: 25,
        completed: hasArtDirection,
        actionToolId: '02-director-arte'
      }
    ];

    const percentage = checklist.reduce((acc, item) => (item.completed ? acc + item.weight : acc), 0);
    const completedCount = checklist.filter((item) => item.completed).length;

    return {
      estado: 'exploracion',
      label: 'Exploración (Comprender & Imaginar)',
      percentage: Math.min(100, Math.round(percentage)),
      completedCount,
      totalCount: checklist.length,
      checklist
    };
  }

  if (estado === 'produccion') {
    const hasImagePrompt = Boolean(
      project.decisions?.imageParams?.subject ||
      project.generatedOutputs.some((o) => o.toolId === '03-generador-imagenes')
    );
    const hasVideoPrompt = Boolean(
      project.decisions?.videoParams?.shotSequence ||
      project.generatedOutputs.some((o) => o.toolId === '04-director-video')
    );
    const hasSoundDesign = Boolean(
      project.decisions?.soundParams?.soundscape ||
      project.generatedOutputs.some((o) => o.toolId === '06-laboratorio-sonido')
    );
    const hasInteractivePrototype = Boolean(
      project.decisions?.interactionParams?.interactionFlow ||
      project.generatedOutputs.some((o) => o.toolId === '05-disenador-interactivo')
    );

    const checklist: DeliverableCheck[] = [
      {
        id: 'image-prompt',
        label: 'Prompt Fotográfico / Imagen Técnica',
        description: 'Encuadre, lente, iluminación y estética configurados.',
        weight: 25,
        completed: hasImagePrompt,
        actionToolId: '03-generador-imagenes'
      },
      {
        id: 'video-prompt',
        label: 'Dirección Cinematográfica / Video',
        description: 'Guion técnico de planos, movimientos de cámara y ritmo audiovisual.',
        weight: 25,
        completed: hasVideoPrompt,
        actionToolId: '04-director-video'
      },
      {
        id: 'sound-design',
        label: 'Laboratorio de Sonido & Acústica',
        description: 'Paisaje sonoro, voces, tono musical o reactividad al audio.',
        weight: 25,
        completed: hasSoundDesign,
        actionToolId: '06-laboratorio-sonido'
      },
      {
        id: 'interaction',
        label: 'Código Creativo / Interacción p5.js',
        description: 'Flujo de entrada, procesamiento y visual reactivo al público.',
        weight: 25,
        completed: hasInteractivePrototype,
        actionToolId: '05-disenador-interactivo'
      }
    ];

    const percentage = checklist.reduce((acc, item) => (item.completed ? acc + item.weight : acc), 0);
    const completedCount = checklist.filter((item) => item.completed).length;

    return {
      estado: 'produccion',
      label: 'Producción (Crear Piezas Técnicas)',
      percentage: Math.min(100, Math.round(percentage)),
      completedCount,
      totalCount: checklist.length,
      checklist
    };
  }

  // Estado === 'integracion'
  const hasExperienceFlow = Boolean(
    project.decisions?.interactionParams?.interactionFlow ||
    project.generatedOutputs.some((o) => o.toolId === '05-disenador-interactivo')
  );
  const hasDigitalProduct = Boolean(
    project.generatedOutputs.some((o) => o.toolId === '07-productos-digitales')
  );
  const hasProductionPlan = Boolean(
    project.decisions?.productionPlan?.prototype15min ||
    project.generatedOutputs.some((o) => o.toolId === '08-productor-gestor')
  );

  const checklist: DeliverableCheck[] = [
    {
      id: 'experience-flow',
      label: 'Flujo de Interacción & Experiencia',
      description: 'Mapa de pantallas y acciones del usuario en vivo.',
      weight: 35,
      completed: hasExperienceFlow,
      actionToolId: '05-disenador-interactivo'
    },
    {
      id: 'digital-product',
      label: 'Arquitectura de Producto Web/App',
      description: 'Estructura de navegación, accesibilidad y componentes digitales.',
      weight: 35,
      completed: hasDigitalProduct,
      actionToolId: '07-productos-digitales'
    },
    {
      id: 'production-plan',
      label: 'Plan de Producción & Entrega 15 Min',
      description: 'Checklist de tareas, recursos y criterios de calidad para publicación.',
      weight: 30,
      completed: hasProductionPlan,
      actionToolId: '08-productor-gestor'
    }
  ];

  const percentage = checklist.reduce((acc, item) => (item.completed ? acc + item.weight : acc), 0);
  const completedCount = checklist.filter((item) => item.completed).length;

  return {
    estado: 'integracion',
    label: 'Integración (Conectar, Producto & Publicar)',
    percentage: Math.min(100, Math.round(percentage)),
    completedCount,
    totalCount: checklist.length,
    checklist
  };
}
