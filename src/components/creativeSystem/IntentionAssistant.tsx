import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  Check,
  Copy,
  Plus,
  Trash2,
  FolderKanban,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Save,
  HelpCircle,
  Clock,
  Layers,
  Wand2,
  Lightbulb,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { FichaProyecto, CreativeToolId, CreativeProject } from '../../types/creativeSystem';
import { CREATIVE_TOOLS } from '../../utils/creativeCatalogData';

export const FICHAS_STORAGE_KEY = 'nucleo-fichas-de-proyecto';
export const ACTIVE_FICHA_ID_KEY = 'nucleo-ficha-activa-id';

export const DEFAULT_FICHAS_PRESETS: FichaProyecto[] = [
  {
    id: 'ficha-memoria-territorial',
    title: 'Memoria Territorial y Archivo Vivo',
    author: 'Manuel Palacio',
    createdAt: '2026-10-24T00:00:00.000Z',
    updatedAt: '2026-10-24T00:00:00.000Z',
    estado: 'exploracion',
    intention: 'Explorar memorias comunitarias, relatos orales y patrimonio sensible del territorio mediante archivos digitales interactivos.',
    purposeOneLiner: 'Tejer un puente intergeneracional entre testimonios orales comunitarios y lenguajes generativos contemporáneos.',
    guidingQuestion: '¿De qué manera los relatos orales de los mayores pueden dialogar con composiciones audiovisuales generativas creadas por jóvenes?',
    context: 'Taller barrial y comunitario con archivos fotográficos familiares, historias locales y grabaciones de audio en riesgo de olvido.',
    targetAudience: 'Vecinos de la comunidad, estudiantes y creadores interesados en patrimonio inmaterial.',
    resources: '1 teléfono móvil para grabaciones, laptop con navegador web y herramientas de IA gratuitas.',
    desiredResult: 'Fanzine digital interactivo con códigos QR a piezas sonoras y un visor reactivo en p5.js.',
    emotionalTone: 'Íntimo, afectivo, poético, documental y enraizado en el territorio.',
    firstAction15Min: 'Grabar un testimonio de 1 minuto sobre un recuerdo de infancia y extraer tres palabras clave para el prompt visual.',
    recommendedTools: ['01-explorador-ideas', '02-director-arte', '06-laboratorio-sonido', '05-disenador-interactivo'],
    notes: 'Priorizar voces reales y evitar representaciones folclóricas estetizadas artificialmente.'
  },
  {
    id: 'ficha-oraculo-generativo',
    title: 'Oráculo Generativo p5.js & Poesía Digital',
    author: 'Manuel Palacio',
    createdAt: '2026-10-24T01:00:00.000Z',
    updatedAt: '2026-10-24T01:00:00.000Z',
    estado: 'produccion',
    intention: 'Transformar reflexiones sobre el futuro colectivo en cartas oraculares interactivas que responden a la interacción del público.',
    purposeOneLiner: 'Desmitificar la IA como bola de cristal y convertirla en un espejo poético de la incertidumbre contemporánea.',
    guidingQuestion: '¿Cómo convertir dilemas éticos y ecológicos en un juego adivinatorio interactivo, lúdico y estéticamente cuidado?',
    context: 'Laboratorio de creatividad digital, diseño interactivo y filosofía contemporánea de la tecnología.',
    targetAudience: 'Creadores digitales, mediadores pedagógicos, estudiantes y público curioso de arte interactivo.',
    resources: 'Editor web de p5.js, navegador Chrome/Firefox, modelos de lenguaje para síntesis poética.',
    desiredResult: 'Aplicación web interactiva donde cada clic o gesto táctil genera un aforismo visual y una geometría algorítmica única.',
    emotionalTone: 'Misterioso, contemplativo, irónico, minimalista y lúcido.',
    firstAction15Min: 'Escribir 5 aforismos generadores en una libreta y probar una interacción elemental de cursor en p5.js.',
    recommendedTools: ['01-explorador-ideas', '05-disenador-interactivo', '02-director-arte', '03-generador-imagenes'],
    notes: 'La interfaz debe funcionar en pantallas táctiles y proyectores.'
  },
  {
    id: 'ficha-herbario-sonoro',
    title: 'Herbario Sonoro y Botánica Especulativa',
    author: 'Manuel Palacio',
    createdAt: '2026-10-24T02:00:00.000Z',
    updatedAt: '2026-10-24T02:00:00.000Z',
    estado: 'integracion',
    intention: 'Visualizar y sonorizar plantas medicinales y vegetación urbana a través de bio-datos y síntesis audiovisual.',
    purposeOneLiner: 'Conectar ecología, escucha atenta y tecnologías generativas para reconectar a las personas con su entorno vegetal cotidiano.',
    guidingQuestion: '¿Qué texturas y paisajes sonoros revelaría una planta si pudiésemos traducir sus ciclos vitales a frecuencias luminosas y acústicas?',
    context: 'Huerto urbano comunitario y laboratorio de experimentación ambiental.',
    targetAudience: 'Comunidad barrial, ambientalistas, familias, exploradores del sonido y diseñadores visuales.',
    resources: 'Cuaderno de campo, cámara de celular, Web Audio API o sintetizadores web gratuitos.',
    desiredResult: 'Instalación interactiva con micro-sitio móvil de fichas botánicas sonoras navegables.',
    emotionalTone: 'Orgánico, biofílico, calmo, meditativo y experimental.',
    firstAction15Min: 'Fotografiar 2 hojas locales en contraluz y asociarles un ritmo de respiración de 4 segundos.',
    recommendedTools: ['01-explorador-ideas', '06-laboratorio-sonido', '03-generador-imagenes', '04-director-video'],
    notes: 'Complementar con fichas botánicas reales del herbario local.'
  }
];

interface IntentionAssistantProps {
  currentProject: CreativeProject;
  onApplyFichaToProject: (ficha: FichaProyecto) => void;
  onOpenTool?: (toolId: CreativeToolId) => void;
  onActiveFichaChange?: (ficha: FichaProyecto) => void;
}

export const IntentionAssistant: React.FC<IntentionAssistantProps> = ({
  currentProject,
  onApplyFichaToProject,
  onOpenTool,
  onActiveFichaChange
}) => {
  // Load saved fichas from dedicated localStorage key
  const [fichas, setFichas] = useState<FichaProyecto[]>(() => {
    try {
      const stored = localStorage.getItem(FICHAS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading fichas from localStorage', e);
    }
    return DEFAULT_FICHAS_PRESETS;
  });

  const [activeFichaId, setActiveFichaId] = useState<string>(() => {
    try {
      const activeStored = localStorage.getItem(ACTIVE_FICHA_ID_KEY);
      if (activeStored && fichas.some((f) => f.id === activeStored)) {
        return activeStored;
      }
    } catch {}
    return fichas[0]?.id || 'ficha-memoria-territorial';
  });

  const handleSelectFicha = (id: string) => {
    setActiveFichaId(id);
    try {
      localStorage.setItem(ACTIVE_FICHA_ID_KEY, id);
    } catch {}
    const found = fichas.find((f) => f.id === id);
    if (found && onActiveFichaChange) {
      onActiveFichaChange(found);
    }
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);
  const [isLinkedFeedback, setIsLinkedFeedback] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Active ficha state
  const activeFicha = fichas.find((f) => f.id === activeFichaId) || fichas[0] || DEFAULT_FICHAS_PRESETS[0];

  // Helper to persist fichas array into localStorage
  const persistFichas = (updatedList: FichaProyecto[]) => {
    setFichas(updatedList);
    try {
      localStorage.setItem(FICHAS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save to localStorage:', FICHAS_STORAGE_KEY, e);
    }
  };

  // Update a single field in the active ficha
  const handleUpdateField = <K extends keyof FichaProyecto>(field: K, value: FichaProyecto[K]) => {
    let updatedActive: FichaProyecto | null = null;
    const updated = fichas.map((f) => {
      if (f.id === activeFicha.id) {
        const item = {
          ...f,
          [field]: value,
          updatedAt: new Date().toISOString()
        };
        updatedActive = item;
        return item;
      }
      return f;
    });
    persistFichas(updated);
    if (updatedActive && onActiveFichaChange) {
      onActiveFichaChange(updatedActive);
    }
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 1200);
  };

  // Toggle tool recommendation in ficha
  const handleToggleTool = (toolId: CreativeToolId) => {
    const current = activeFicha.recommendedTools || [];
    const next = current.includes(toolId)
      ? current.filter((id) => id !== toolId)
      : [...current, toolId];
    handleUpdateField('recommendedTools', next);
  };

  // Create a brand new blank ficha
  const handleCreateNewFicha = () => {
    const newFicha: FichaProyecto = {
      id: `ficha-${Date.now()}`,
      title: 'Nueva Ficha de Intención Creativa',
      author: currentProject.author || 'Manuel Palacio',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estado: 'exploracion',
      intention: '',
      purposeOneLiner: '',
      guidingQuestion: '¿De qué manera...?',
      context: 'Taller de creación digital y arte interactivo',
      targetAudience: 'Comunidad participante',
      resources: 'Navegador web, herramientas libres y 30 minutos',
      desiredResult: 'Prototipo sensible y viable',
      emotionalTone: 'Experimental y sensible',
      firstAction15Min: 'Definir el propósito en una frase y seleccionar 1 herramienta inicial',
      recommendedTools: ['01-explorador-ideas', '02-director-arte', '03-generador-imagenes'],
      notes: ''
    };
    const updated = [newFicha, ...fichas];
    persistFichas(updated);
    handleSelectFicha(newFicha.id);
    setCurrentStep(1);
  };

  // Duplicate the current ficha
  const handleDuplicateFicha = () => {
    const duplicated: FichaProyecto = {
      ...activeFicha,
      id: `ficha-${Date.now()}`,
      title: `${activeFicha.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [duplicated, ...fichas];
    persistFichas(updated);
    handleSelectFicha(duplicated.id);
  };

  // Delete current ficha
  const handleDeleteFicha = (idToDelete: string) => {
    if (fichas.length <= 1) {
      alert('Debes conservar al menos una ficha de proyecto.');
      return;
    }
    const filtered = fichas.filter((f) => f.id !== idToDelete);
    persistFichas(filtered);
    if (activeFichaId === idToDelete) {
      handleSelectFicha(filtered[0]?.id || '');
    }
  };

  // Reset to default presets if desired
  const handleRestoreDefaults = () => {
    if (window.confirm('¿Deseas restaurar las fichas maestras de Núcleo Colectivo? No borrará tus fichas nuevas, se añadirán al catálogo.')) {
      const merged = [...fichas];
      DEFAULT_FICHAS_PRESETS.forEach((preset) => {
        if (!merged.some((m) => m.id === preset.id)) {
          merged.push(preset);
        }
      });
      persistFichas(merged);
    }
  };

  // Link active ficha into CreativeSystemSection active project
  const handleLinkToSystem = () => {
    onApplyFichaToProject({
      ...activeFicha,
      estado: activeFicha.estado || 'exploracion'
    });
    setIsLinkedFeedback(true);
    setTimeout(() => setIsLinkedFeedback(false), 2500);
  };

  // Generate Master Prompt A from the active ficha
  const generatePromptMaestro = (): string => {
    return `Actúa como director/a creativo/a, investigador/a y diseñador/a de experiencias. Ayúdame a convertir una intención inicial en un proyecto creativo viable.

Mi intención: ${activeFicha.intention || '[describe qué quieres expresar o transformar]'}.
Propósito en una frase: ${activeFicha.purposeOneLiner || '[frase síntesis]'}.
Pregunta generadora: ${activeFicha.guidingQuestion || '¿De qué manera transformar esta inquietud en un sistema sensible?'}.
Estado de Ficha: ${activeFicha.estado === 'produccion' ? 'Producción' : activeFicha.estado === 'integracion' ? 'Integración' : 'Exploración'}.
Contexto: ${activeFicha.context || '[dónde surge y por qué es relevante]'}.
Público: ${activeFicha.targetAudience || '[con quién dialoga o participa]'}.
Recursos disponibles: ${activeFicha.resources || '[tiempo, dispositivos y herramientas disponibles]'}.
Resultado deseado: ${activeFicha.desiredResult || '[qué objeto, web o experiencia visual/sonora debe existir al final]'}.
Tono emocional / atmósfera: ${activeFicha.emotionalTone || 'Contemporáneo y cuidado'}.

Primero, identifica la intención principal y formula una pregunta generadora. No presupongas que la solución debe ser una imagen o un video.

Después:
1. Resume el propósito del proyecto en una frase.
2. Identifica la necesidad, el interés o la oportunidad que aborda.
3. Define el público y el contexto.
4. Propón hasta tres rutas creativas diferentes.
5. Para cada ruta, indica qué experiencia produciría, qué lenguajes utilizaría y qué valor aportaría.
6. Divide la ruta más pertinente en acciones o entregables independientes.
7. Explica qué decisiones faltan por tomar y cuáles pueden posponerse.
8. Sugiere una primera acción pequeña y viable para probar la idea (Prototipo 15 minutos).

No inventes información que no te haya dado. Si falta un dato decisivo, pregúntamelo antes de cerrar la propuesta.`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatePromptMaestro());
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Suggest guiding question formulas
  const questionSuggestions = [
    `¿De qué manera ${activeFicha.intention ? activeFicha.intention.toLowerCase().slice(0, 45) : 'esta memoria'} puede interactuar con el público sin perder su dimensión íntima?`,
    `¿Cómo transformar este relato en un dispositivo sensible de 15 minutos que active preguntas colectivas?`,
    `¿Qué pasa cuando cruzamos ${activeFicha.desiredResult || 'la imagen generativa'} con ${activeFicha.context || 'el territorio'} en una experiencia viva?`
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 border-2 border-stone-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#f8c300]/15 via-[#7656ff]/10 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8c300] text-[#111111] text-xs font-mono font-black uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Asistente de Intención · Núcleo Colectivo
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              De la Intención al <span className="text-[#f8c300]">Propósito Vivo</span>
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed">
              Define el <strong>por qué</strong> y el <strong>para qué</strong> de tu proyecto antes de generar imágenes, videos o código. Las fichas se almacenan localmente en <code>localStorage['{FICHAS_STORAGE_KEY}']</code> y se vinculan de inmediato al flujo de trabajo activo.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleLinkToSystem}
              className={`px-5 py-3 font-black rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isLinkedFeedback
                  ? 'bg-emerald-500 text-white scale-102'
                  : 'bg-[#f8c300] hover:bg-[#e5b300] text-[#111111]'
              }`}
            >
              {isLinkedFeedback ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Ficha Vinculada al Proyecto Activo!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>✦ Vincular Ficha al Proyecto Activo</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateNewFicha}
                className="flex-1 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-stone-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#f8c300]" />
                <span>Nueva Ficha</span>
              </button>

              <button
                onClick={handleDuplicateFicha}
                title="Duplicar esta ficha"
                className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl text-xs transition border border-stone-700 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestoreDefaults}
                title="Restaurar ejemplos de Núcleo Colectivo"
                className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl text-xs transition border border-stone-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fichas Drawer / Selector */}
        <div className="mt-6 pt-5 border-t border-stone-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-mono text-stone-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <FolderKanban className="w-3.5 h-3.5 text-[#f8c300]" />
              Fichas de Proyecto Guardadas ({fichas.length})
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              Almacén: <code className="text-[#f8c300] bg-stone-900 px-1.5 py-0.5 rounded">{FICHAS_STORAGE_KEY}</code>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {fichas.map((f) => {
              const isActive = f.id === activeFicha.id;
              const estadoLabel = f.estado === 'produccion' ? '⚡ Producción' : f.estado === 'integracion' ? '🌐 Integración' : '🔍 Exploración';
              return (
                <div
                  key={f.id}
                  className={`group shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    isActive
                      ? 'bg-[#f8c300] text-[#111111] border-[#f8c300] shadow-md'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                  }`}
                  onClick={() => handleSelectFicha(f.id)}
                >
                  <span className="max-w-[150px] truncate">{f.title || 'Sin título'}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-black/15 text-stone-900' : 'bg-stone-800 text-stone-400'}`}>
                    {estadoLabel}
                  </span>
                  {fichas.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFicha(f.id);
                      }}
                      className={`p-1 rounded opacity-60 hover:opacity-100 transition ${
                        isActive ? 'hover:bg-black/10 text-stone-900' : 'hover:bg-stone-800 text-stone-400'
                      }`}
                      title="Eliminar ficha"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Form Steps + Real-Time Preview & Master Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Guiding Questions Wizard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step Navigation Pill Bar */}
          <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between text-xs font-mono font-bold">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep === 1
                  ? 'bg-[#111111] text-white shadow'
                  : 'text-stone-600 hover:text-black hover:bg-stone-100'
              }`}
            >
              <span>01.</span>
              <span>Intención & Propósito</span>
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep === 2
                  ? 'bg-[#111111] text-white shadow'
                  : 'text-stone-600 hover:text-black hover:bg-stone-100'
              }`}
            >
              <span>02.</span>
              <span>Contexto & Comunidad</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep === 3
                  ? 'bg-[#111111] text-white shadow'
                  : 'text-stone-600 hover:text-black hover:bg-stone-100'
              }`}
            >
              <span>03.</span>
              <span>Salida & 15 Min</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep === 4
                  ? 'bg-[#111111] text-white shadow'
                  : 'text-stone-600 hover:text-black hover:bg-stone-100'
              }`}
            >
              <span>04.</span>
              <span>Herramientas</span>
            </button>
          </div>

          {/* Form Content Container */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            {/* Metadata Bar */}
            <div className="space-y-4 pb-5 border-b border-stone-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Nombre de la Ficha
                  </label>
                  <input
                    type="text"
                    value={activeFicha.title}
                    onChange={(e) => handleUpdateField('title', e.target.value)}
                    className="w-full text-base font-bold text-[#111111] bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#111111] transition"
                    placeholder="Ej: Archivo de Memoria Colectiva"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Autor/a o Colectivo
                  </label>
                  <input
                    type="text"
                    value={activeFicha.author}
                    onChange={(e) => handleUpdateField('author', e.target.value)}
                    className="w-full text-sm font-bold text-[#111111] bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#111111] transition"
                    placeholder="Manuel Palacio"
                  />
                </div>
              </div>

              {/* Selector de Estado de Ficha */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#f8c300]" />
                    Estado de Ficha (Etapa del Proyecto)
                  </label>
                  <span className="text-[11px] font-mono text-stone-500 font-bold">
                    {activeFicha.estado === 'produccion'
                      ? '02 · Producción'
                      : activeFicha.estado === 'integracion'
                      ? '03 · Integración'
                      : '01 · Exploración'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateField('estado', 'exploracion')}
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between cursor-pointer ${
                      activeFicha.estado === 'exploracion' || !activeFicha.estado
                        ? 'bg-[#111111] text-white border-[#111111] shadow-sm ring-2 ring-[#f8c300]/40'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="text-xs font-black flex items-center gap-1.5">
                      <span>🔍</span> Exploración
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      Comprender, imaginar, definir estilo y preguntas.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateField('estado', 'produccion')}
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between cursor-pointer ${
                      activeFicha.estado === 'produccion'
                        ? 'bg-[#111111] text-white border-[#111111] shadow-sm ring-2 ring-fuchsia-400/40'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="text-xs font-black flex items-center gap-1.5">
                      <span>⚡</span> Producción
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      Generar foto, video, sonido y código p5.js.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateField('estado', 'integracion')}
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between cursor-pointer ${
                      activeFicha.estado === 'integracion'
                        ? 'bg-[#111111] text-white border-[#111111] shadow-sm ring-2 ring-emerald-400/40'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="text-xs font-black flex items-center gap-1.5">
                      <span>🌐</span> Integración
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      Interacción, experiencia web y plan de entrega.
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 1: Intención & Propósito */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7656ff]">
                  <Lightbulb className="w-4 h-4" />
                  <span>ETAPA 01 · COMPRENDER LA INTENCIÓN</span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1.5">
                    1. ¿Qué quieres expresar, explorar, comunicar, imaginar o transformar?
                  </label>
                  <p className="text-xs text-stone-500 mb-2 leading-relaxed">
                    No te limites a decir "quiero hacer un video". Describe la inquietud sensible, la emoción, el tema ético o el concepto de fondo.
                  </p>
                  <textarea
                    rows={3}
                    value={activeFicha.intention}
                    onChange={(e) => handleUpdateField('intention', e.target.value)}
                    placeholder="Ej: Explorar cómo los relatos orales de mi abuela y las plantas medicinales de su huerto pueden generar una memoria viva que no muera en un cajón..."
                    className="w-full p-3.5 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1.5">
                    2. Propósito del proyecto en una sola frase
                  </label>
                  <p className="text-xs text-stone-500 mb-2">
                    La brújula que guiará todas las decisiones visuales, sonoras y tecnológicas.
                  </p>
                  <input
                    type="text"
                    value={activeFicha.purposeOneLiner}
                    onChange={(e) => handleUpdateField('purposeOneLiner', e.target.value)}
                    placeholder="Ej: Transformar la memoria botánica barrial en un oráculo interactivo accesible desde el celular."
                    className="w-full p-3 text-sm font-medium rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-bold text-[#111111]">
                      3. Pregunta Generadora (Catalizadora)
                    </label>
                    <span className="text-[11px] font-mono text-stone-400">¿De qué manera...?</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-2">
                    Una buena pregunta abre caminos sin prejuzgar la respuesta técnica.
                  </p>
                  <input
                    type="text"
                    value={activeFicha.guidingQuestion}
                    onChange={(e) => handleUpdateField('guidingQuestion', e.target.value)}
                    placeholder="Ej: ¿De qué manera la escucha atenta puede modificar la forma en que habitamos la ciudad?"
                    className="w-full p-3 text-sm font-medium rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition"
                  />

                  {/* Suggestions pills */}
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-stone-400 uppercase">
                      Inspiración de fórmulas para tu pregunta:
                    </span>
                    <div className="space-y-1.5">
                      {questionSuggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleUpdateField('guidingQuestion', sug)}
                          className="w-full text-left text-xs p-2 rounded-lg bg-stone-50 hover:bg-[#f8c300]/15 hover:border-[#f8c300] border border-stone-200/60 text-stone-700 transition flex items-center justify-between gap-2"
                        >
                          <span className="truncate">{sug}</span>
                          <span className="text-[10px] font-bold text-stone-400 shrink-0">Usar</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 bg-[#111111] hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Siguiente: Contexto & Comunidad</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Contexto & Comunidad */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7656ff]">
                  <Compass className="w-4 h-4" />
                  <span>ETAPA 02 · SITUAR EL PROYECTO</span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1.5">
                    4. Contexto y Territorio: ¿Dónde surge y por qué es importante?
                  </label>
                  <p className="text-xs text-stone-500 mb-2 leading-relaxed">
                    Indica las condiciones reales: taller, comunidad, espacio público, memoria colectiva, aula o espacio doméstico.
                  </p>
                  <textarea
                    rows={3}
                    value={activeFicha.context}
                    onChange={(e) => handleUpdateField('context', e.target.value)}
                    placeholder="Ej: Surge en el marco del Taller de Medios Digitales e IA de Núcleo Colectivo, ante la necesidad de registrar archivos orales antes de que se pierdan..."
                    className="w-full p-3.5 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1.5">
                    5. Público y Participantes: ¿Con quién dialoga o quién participa?
                  </label>
                  <p className="text-xs text-stone-500 mb-2">
                    ¿Son observadores pasivos, participantes activos, mediadores culturales o vecinos?
                  </p>
                  <input
                    type="text"
                    value={activeFicha.targetAudience}
                    onChange={(e) => handleUpdateField('targetAudience', e.target.value)}
                    placeholder="Ej: Jóvenes del taller, vecinos adultos mayores, comunidad interesada en arte y tecnología."
                    className="w-full p-3 text-sm font-medium rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1.5">
                    6. Tono sensible y atmósfera emocional
                  </label>
                  <p className="text-xs text-stone-500 mb-2">
                    ¿Qué resonancia anímica debe provocar? (Íntimo, contemplativo, poético, lúdico, crítico, testimonial...)
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[
                      'Íntimo y poético',
                      'Documental y testimonial',
                      'Crítico y reflexivo',
                      'Lúdico e interactivo',
                      'Orgánico y contemplativo',
                      'Cyberpunk / Mineral'
                    ].map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => handleUpdateField('emotionalTone', tone)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          activeFicha.emotionalTone === tone
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={activeFicha.emotionalTone}
                    onChange={(e) => handleUpdateField('emotionalTone', e.target.value)}
                    placeholder="Describe el tono emocional..."
                    className="w-full p-2.5 text-xs font-medium rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 bg-[#111111] hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Siguiente: Salida & 15 Min</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Salida & Prototipo 15 Min */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7656ff]">
                  <Clock className="w-4 h-4" />
                  <span>ETAPA 03 · PRODUCIR Y ACTIVAR</span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1.5">
                    7. ¿Qué te gustaría que existiera al final? (Resultado deseado)
                  </label>
                  <p className="text-xs text-stone-500 mb-2 leading-relaxed">
                    No tiene que ser una megaproducción. Puede ser una micro-experiencia interactiva, una serie de 3 postales, un fanzine o un paisaje sonoro.
                  </p>
                  <input
                    type="text"
                    value={activeFicha.desiredResult}
                    onChange={(e) => handleUpdateField('desiredResult', e.target.value)}
                    placeholder="Ej: Fanzine digital interactivo con visor de imágenes y paisaje sonoro binaural."
                    className="w-full p-3 text-sm font-medium rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1.5">
                    8. Recursos reales y restricciones
                  </label>
                  <p className="text-xs text-stone-500 mb-2">
                    Tiempo, conocimientos, dispositivos disponibles (móvil, laptop), presupuesto y herramientas accesibles.
                  </p>
                  <input
                    type="text"
                    value={activeFicha.resources}
                    onChange={(e) => handleUpdateField('resources', e.target.value)}
                    placeholder="Ej: 45 minutos de taller, 1 laptop, navegador web, sin presupuesto."
                    className="w-full p-3 text-sm font-medium rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition"
                  />
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>9. Primera acción pequeña y viable (Prototipo 15 minutos)</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Para vencer la parálisis creadora: ¿cuál es el paso mínimo inmediato que puedes hacer hoy mismo?
                  </p>
                  <input
                    type="text"
                    value={activeFicha.firstAction15Min}
                    onChange={(e) => handleUpdateField('firstAction15Min', e.target.value)}
                    placeholder="Ej: Redactar el prompt fotográfico en el Módulo 03 y generar 2 variantes de prueba."
                    className="w-full p-2.5 text-xs font-bold text-[#111111] bg-white rounded-xl border border-amber-300 focus:outline-none focus:border-[#111111] transition"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 bg-[#111111] hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Siguiente: Herramientas Sugeridas</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Herramientas Sugeridas */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7656ff]">
                  <Layers className="w-4 h-4" />
                  <span>ETAPA 04 · MODULARIDAD & CATÁLOGO</span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1.5">
                    10. Módulos del Catálogo Recomendados para esta Ficha
                  </label>
                  <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                    Selecciona las herramientas que se activarán en el sistema creativo. Recuerda: el proyecto es el centro; solo activa lo que el proyecto requiera.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CREATIVE_TOOLS.map((tool) => {
                      const isSelected = activeFicha.recommendedTools?.includes(tool.id);
                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleToggleTool(tool.id)}
                          className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5 ${
                              isSelected ? 'bg-[#f8c300] text-[#111111]' : 'border border-stone-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">{tool.title}</span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                  isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-600'
                                }`}
                              >
                                {tool.orderNumber}
                              </span>
                            </div>
                            <p
                              className={`text-[11px] leading-snug line-clamp-2 ${
                                isSelected ? 'text-stone-300' : 'text-stone-500'
                              }`}
                            >
                              {tool.deliverable}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Free notes */}
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Anotaciones libres / Decisiones pendientes
                  </label>
                  <textarea
                    rows={2}
                    value={activeFicha.notes || ''}
                    onChange={(e) => handleUpdateField('notes', e.target.value)}
                    placeholder="Ideas sueltas, referencias de artistas, enlaces o preguntas abiertas..."
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#111111] transition"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Atrás
                  </button>

                  <button
                    onClick={handleLinkToSystem}
                    className="px-5 py-2.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>✦ Vincular Ficha al Proyecto Activo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Ficha Summary & Prompt Maestro (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Card of the Ficha */}
          <div className="bg-stone-900 text-white p-6 rounded-3xl border border-stone-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#f8c300] font-black">
                    Ficha Activa
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    activeFicha.estado === 'produccion'
                      ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                      : activeFicha.estado === 'integracion'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  }`}>
                    {activeFicha.estado === 'produccion' ? '⚡ Producción' : activeFicha.estado === 'integracion' ? '🌐 Integración' : '🔍 Exploración'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white truncate max-w-[240px]">
                  {activeFicha.title || 'Sin título'}
                </h3>
              </div>

              <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2.5 py-1 rounded-full">
                {activeFicha.author || 'Manuel Palacio'}
              </span>
            </div>

            {/* Ficha Key Points */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60">
                <span className="text-[10px] font-mono text-stone-400 block mb-0.5">Propósito en una frase:</span>
                <p className="font-bold text-white text-xs">
                  {activeFicha.purposeOneLiner || 'Por definir...'}
                </p>
              </div>

              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60">
                <span className="text-[10px] font-mono text-stone-400 block mb-0.5">Pregunta Generadora:</span>
                <p className="font-mono text-[#f8c300] text-xs">
                  {activeFicha.guidingQuestion || '¿De qué manera...?'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-stone-800/40 rounded-lg">
                  <span className="text-stone-400 block text-[10px]">Tono Sensible:</span>
                  <span className="font-medium text-stone-200">{activeFicha.emotionalTone || 'Por definir'}</span>
                </div>
                <div className="p-2.5 bg-stone-800/40 rounded-lg">
                  <span className="text-stone-400 block text-[10px]">Prototipo 15m:</span>
                  <span className="font-medium text-stone-200 truncate block">{activeFicha.firstAction15Min || 'Por definir'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-stone-400 block mb-1">
                  Módulos Vinculados ({activeFicha.recommendedTools?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeFicha.recommendedTools || []).map((tId) => {
                    const tool = CREATIVE_TOOLS.find((t) => t.id === tId);
                    return (
                      <span
                        key={tId}
                        className="text-[10px] font-mono px-2 py-0.5 bg-[#f8c300]/20 text-[#f8c300] border border-[#f8c300]/30 rounded-md"
                      >
                        {tool?.title || tId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={handleLinkToSystem}
              className={`w-full py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isLinkedFeedback
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#f8c300] hover:bg-[#e5b300] text-[#111111]'
              }`}
            >
              {isLinkedFeedback ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Vinculada al Flujo Creativo!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>✦ Vincular Ficha al Proyecto Activo</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Master Prompt Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#111111]">
                <Wand2 className="w-4 h-4 text-[#7656ff]" />
                <span>Prompt Maestro Generado (Módulo A)</span>
              </div>

              <button
                onClick={handleCopyPrompt}
                className="px-2.5 py-1 text-xs font-mono font-bold text-stone-600 hover:text-black bg-stone-100 hover:bg-stone-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Listo para pegar en ChatGPT, Claude, Gemini o Google AI Studio para desglosar la dirección creativa paso a paso.
            </p>

            <div className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto border border-stone-800">
              <pre className="whitespace-pre-wrap">{generatePromptMaestro()}</pre>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 font-mono">
              <span>Plantilla oficial lab-colores</span>
              <a
                href="https://lab-colores.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#111111] hover:underline flex items-center gap-1 font-bold"
              >
                <span>lab-colores.vercel.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
