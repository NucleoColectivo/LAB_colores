import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Terminal,
  Camera,
  FileCode,
  Palette,
  Film,
  Layers,
  HelpCircle,
  Clock,
  Eye,
  Sliders
} from 'lucide-react';
import { CreativeProject, CreativeToolId } from '../../types/creativeSystem';
import { compileMasterPrompt } from '../../utils/creativePromptTemplates';
import { ToolLogo } from '../common/ToolLogo';

interface MasterPromptsLibraryProps {
  project: CreativeProject;
  onOpenTool: (toolId: CreativeToolId) => void;
}

interface PromptCardData {
  letter: string;
  toolId: CreativeToolId;
  title: string;
  badge: string;
  description: string;
  targetModels: string;
}

const PROMPT_CARDS: PromptCardData[] = [
  {
    letter: 'A',
    toolId: '01-explorador-ideas',
    title: 'Prompt Maestro: Comprender la Intención',
    badge: 'Inicio Obligatorio',
    description: 'Actúa como director/a creativo/a e investigador/a para convertir una intención inicial en un sistema viable con pregunta generadora y 3 rutas.',
    targetModels: 'Gemini 3.8 Flash / Claude 3.7 / GPT-4o'
  },
  {
    letter: 'B',
    toolId: '02-director-arte',
    title: 'Director de Arte: Definir el Estilo Visual',
    badge: 'Sistema Visual Coherente',
    description: 'Fija concepto visual, paleta cromática, texturas terrosas, iluminación, encuadres y 3 variantes (conservadora, experimental, arriesgada).',
    targetModels: 'Gemini / Claude / Midjourney Moodboard'
  },
  {
    letter: 'C',
    toolId: '03-generador-imagenes',
    title: 'Generador de Imágenes: Fotografía Profesional',
    badge: 'Óptica & Textura',
    description: 'Separa la intención expresiva de los parámetros técnicos (cámara 35mm, lentes 85mm f/1.4, luz natural, profundidad) sin clichés.',
    targetModels: 'Midjourney v6.1 / Flux Pro / Imagen 3'
  },
  {
    letter: 'D',
    toolId: '04-director-video',
    title: 'Director de Video: Cinematografía y Secuencias',
    badge: 'Cine Generativo',
    description: 'Estructura una secuencia de 3 planos continuos con movimientos de cámara (dolly, órbita), ritmo, continuidad lumínica y guía sonora.',
    targetModels: 'Runway Gen-3 Alpha / Kling / Sora'
  },
  {
    letter: 'E',
    toolId: '05-disenador-interactivo',
    title: 'Diseñador de Experiencias Interactivas',
    badge: 'Código Creativo & Sensores',
    description: 'Convierte la idea en el ciclo: Entrada (mouse/voz/cámara) → Procesamiento sensible → Salida visual con código funcional en p5.js.',
    targetModels: 'p5.js Web Editor / Canvas WebGL'
  },
  {
    letter: 'F',
    toolId: '06-laboratorio-sonido',
    title: 'Laboratorio de Sonido & Paisaje Auditivo',
    badge: 'Audio Generativo & Resonancia',
    description: 'Define capas sonoras (drone de 55Hz, foley de manos, acordes analógicos) y prompts para sintetizar atmósferas inmersivas.',
    targetModels: 'Stable Audio / Udio / Suno'
  },
  {
    letter: 'G',
    toolId: '08-productor-gestor',
    title: 'Productor y Gestor: Plan en 3 Etapas',
    badge: 'Chispa 15min → Publicación',
    description: 'Divide la idea en Fase 1 (prototipo en 15-30 min), Fase 2 (desarrollo y coherencia) y Fase 3 (activación en lab-colores.vercel.app).',
    targetModels: 'Notion / Tablero de Producción'
  }
];

// The 7 official prompt families from biblioteca_prompts_generacion_imagenes_nucleo_colectivo.pdf
interface PromptFamilyItem {
  id: string;
  category: string;
  title: string;
  description: string;
  formulaApplied: string;
  promptExample: string;
  recommendedModel: string;
}

const OFFICIAL_FAMILIES: PromptFamilyItem[] = [
  {
    id: 'fam-1',
    category: '1. Ilustración y Creación Artística',
    title: 'Grabado xilográfico botánico contemporáneo',
    description: 'Ilustración con texturas de madera entintada, líneas de talla profundas y tintas vegetales.',
    formulaApplied: 'SUJETO (hojas de platanar y helechos) + ACCIÓN (brotando de grietas de arcilla) + ESCENARIO (paredón de barrio) + TIPO (grabado en relieve xilográfico) + ESTILO (tinta negra sobre papel de fibra natural hecho a mano) + ILUMINACIÓN (luz cenital que revela surcos) + COMPOSICIÓN (plano medio, textura táctil marcada)',
    promptExample: 'Contemporary woodblock print illustration of lush plantain leaves and wild mountain ferns sprouting from adobe cracks, deep engraved linework, organic black ink on warm handmade cotton paper, high tactile relief texture, visible woodgrain, dramatic top light revealing ink ridges, artistic minimalist composition, no digital gloss --ar 4:5 --v 6.1',
    recommendedModel: 'Midjourney v6.1 / FLUX.1 Dev'
  },
  {
    id: 'fam-2',
    category: '2. Fotografía y Dirección de Arte',
    title: 'Retrato editorial analógico 35mm con luz natural',
    description: 'Fotografía documental íntima capturada en película Kodak Portra 400 sin retoque plástico.',
    formulaApplied: 'SUJETO (artesano mayor de Medellín) + ACCIÓN (sosteniendo una pieza de barro húmedo con ternura) + ESCENARIO (taller en casa con ventana abierta) + TIPO (fotografía editorial 35mm) + ESTILO (Kodak Portra 400, grano fino orgánico, colores cálidos) + ILUMINACIÓN (luz dorada de 5:00 PM entrando de lado) + COMPOSICIÓN (óptica 50mm f/1.8, bokeh cremoso en el fondo, foco nítido en los ojos)',
    promptExample: '35mm editorial documentary portrait of an elderly Colombian artisan tenderly holding a freshly molded wet terracotta vessel, inside a sunlit patio workshop in Medellin, warm side golden hour light entering through brick breezeblock, shot on Leica M6 with 50mm Summilux f/1.4 lens, natural skin texture with authentic wrinkles, subtle organic 35mm film grain, Kodak Portra 400 color science, quiet emotional resonance, zero artificial smoothing --ar 3:4 --style raw',
    recommendedModel: 'FLUX.1 Schnell/Dev / Midjourney v6.1'
  },
  {
    id: 'fam-3',
    category: '3. Diseño Gráfico y Comunicación Visual',
    title: 'Póster tipográfico risográfico para evento cultural',
    description: 'Cartel con tintas fluorescentes superpuestas, desalineación táctil y tipografía condensada.',
    formulaApplied: 'SUJETO (formas geométricas abstractas inspiradas en montañas andinas) + ACCIÓN (superposición de capas) + ESCENARIO (espacio en blanco de papel periódico) + TIPO (diseño de póster risográfico a dos tintas) + ESTILO (tinta Azul Medio y Amarillo Solacote, medio tono de puntos visibles) + ILUMINACIÓN (plano gráfico puro) + COMPOSICIÓN (retícula modular suiza, contraste alto)',
    promptExample: 'Riso print cultural festival poster, bold condensed Swiss typography intersecting with abstract geometric mountain silhouettes of Medellin, dual-color ink overlay in fluorescent sunflower yellow and deep ultramarine blue, visible dot screen halftone texture, slight organic misregistration of layers, printed on off-white textured recycled newsprint, clean modern art poster composition --ar 2:3',
    recommendedModel: 'Midjourney v6.1 / Google Imagen 3'
  },
  {
    id: 'fam-4',
    category: '4. Personajes y Mundos Imaginarios',
    title: 'Guardián híbrido biomórfico del agua andina',
    description: 'Criatura mítica contemporánea que fusiona musgo, cerámica prehispánica y fibras vegetales.',
    formulaApplied: 'SUJETO (criatura guardiana ancestral) + ACCIÓN (descansando junto a una corriente de agua cristalina) + ESCENARIO (bosque de niebla en Santa Elena) + TIPO (escultura viva macro) + ESTILO (arcilla negra pulida con incrustaciones de liquen fosforescente sutil) + ILUMINACIÓN (niebla húmeda matutina que difumina los bordes) + COMPOSICIÓN (plano medio con reflejo en agua calma)',
    promptExample: 'Mystical Andean guardian entity resting beside a mountain stream in a cloud forest of Antioquia, body crafted from polished black ancestral pottery adorned with living humid moss and subtle bioluminescent lichen, early dawn mist diffusing cool ambient light, intimate cinematic medium shot, reflections in clear stream water, rich organic textures, evocative magical realism, high fidelity realism --ar 16:9',
    recommendedModel: 'FLUX.1 Dev / Midjourney v6.1'
  },
  {
    id: 'fam-5',
    category: '5. Memoria, Territorio y Creación Comunitaria',
    title: 'Archivo fotográfico barrial vivo y reconstruido',
    description: 'Fotografía de archivo documental de los años 80 restaurada y poetizada con memoria colectiva.',
    formulaApplied: 'SUJETO (grupo de jóvenes del barrio Los Colores conversando en la acera) + ACCIÓN (compartiendo un café y un radio de transistores) + ESCENARIO (esquina barrial con casas de ladrillo a la vista) + TIPO (fotografía callejera vintage) + ESTILO (blanco y negro tono cálido sepia suave, textura de papel fotográfico antiguo con esquinas desgastadas) + ILUMINACIÓN (luz tenue de farol de calle) + COMPOSICIÓN (plano general espontáneo)',
    promptExample: 'Authentic 1980s street documentary photo of Colombian neighborhood youth sitting on a sidewalk curb laughing around a portable transistor radio, red brick row houses in Medellin neighborhood background, warm toned black and white print, tender nostalgic atmosphere, Leica 35mm candid lens aesthetic, subtle silver gelatin paper grain, human dignity and community warmth --ar 4:3',
    recommendedModel: 'Midjourney v6.1 / ChatGPT DALL-E'
  },
  {
    id: 'fam-6',
    category: '6. Arte, Tecnología e IA Crítica',
    title: 'Cyber-ecología andina: Visualización de datos afectivos',
    description: 'Instalación interactiva con hilos de fibra óptica entretejidos en un telar de guasca de plátano.',
    formulaApplied: 'SUJETO (telar comunitario tradicional) + ACCIÓN (emitiendo pulsos de luz cálida según datos de voz grabados) + ESCENARIO (sala de exposiciones con piso de concreto oscuro) + TIPO (instalación interactiva de arte y nuevos medios) + ESTILO (fusión de artesanía textil campesina y cables de fibra óptica sutiles) + ILUMINACIÓN (claroscuro teatral donde la propia obra ilumina la sala) + COMPOSICIÓN (ángulo contrapicado monumental)',
    promptExample: 'Contemporary interactive media art installation, a giant traditional artisan loom woven with raw banana plant fibers interlaced with delicate optical fibers pulsing with warm amber ambient light, installed in an industrial dark concrete gallery space, theatrical chiaroscuro lighting, tactile organic fiber contrasting with ethereal digital luminescence, low angle monumental composition --ar 16:9',
    recommendedModel: 'FLUX.1 Pro / Midjourney v6.1'
  },
  {
    id: 'fam-7',
    category: '7. Sprint 15 Minutos: De la Idea al Video',
    title: 'Secuencia continua de 5 segundos para Runway o Kling',
    description: 'Prompt de movimiento cinematográfico continuo diseñado para los modelos de video generativo.',
    formulaApplied: 'SUJETO (mano de un artista) + ACCIÓN (dibujando un círculo en una mesa de arena que se transforma en agua ondulante) + CÁMARA (dolly in lento y constante de 5 segundos) + ILUMINACIÓN (luz lateral suave y constante) + CONTINUIDAD (sin cortes abruptos ni saltos temporales)',
    promptExample: 'Cinematic slow continuous forward dolly shot, close-up of a human hand gently tracing a circle into fine golden sand, as the sand magically ripples into clear water reflecting the blue sky, smooth 5-second camera motion, hyper-realistic physics, warm natural side lighting, steady focus, 24fps film look, no morphing glitches',
    recommendedModel: 'Runway Gen-3 Alpha / Kling AI / Luma Dream Machine'
  }
];

// The JSON photo style transfer prompts from guia_practica_fotografia_IA_JSON_nucleo_colectivo.pdf
interface JsonPromptItem {
  id: string;
  step: string;
  title: string;
  objective: string;
  promptText: string;
  copyLabel: string;
}

const JSON_PROMPTS: JsonPromptItem[] = [
  {
    id: 'json-step-1',
    step: 'Paso 01',
    title: 'Extracción de Parámetros Fotográficos en JSON',
    objective: 'Pega este prompt en ChatGPT junto a una fotografía de referencia de la que quieras clonar el estilo visual (luz, grano, paleta).',
    copyLabel: 'Copiar Prompt Extractor JSON',
    promptText: `Actúa como Director de Fotografía y Colorista Senior de cine analógico.
Analiza minuciosamente la fotografía que te adjunto y extrae su ADN visual exacto en un bloque de código JSON estricto sin texto adicional.

El JSON debe contener exactamente estas claves:
{
  "camera_and_format": "Modelo de cámara analógica o digital y formato (ej: 35mm, medio formato 120, sensor full-frame)",
  "lens_and_optics": "Distancia focal en mm, apertura f/, profundidad de campo y características ópticas (bokeh, viñeteado sutil)",
  "lighting_setup": "Tipo de luz (natural/artificial), dirección (cenital, lateral, contraluz), temperatura de color en Kelvin y contraste",
  "color_palette_hex": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"],
  "film_stock_and_grain": "Emulsión de película referencial (ej: Portra 400, Cinestill 800T, Tri-X 400) y tamaño de grano",
  "texture_and_skin": "Tratamiento de pieles y superficies (poros naturales, sin plastificado, textura táctil real)",
  "composition_and_framing": "Regla de composición, plano (primer plano, plano medio), ángulo y relación de aspecto",
  "mood_and_atmosphere": "Sensación emotiva en 3 adjetivos precisos"
}`
  },
  {
    id: 'json-step-2',
    step: 'Paso 02',
    title: 'Aplicar el JSON a un Retrato Propio Preservando Identidad',
    objective: 'Utiliza el JSON generado en el Paso 01 para transformar un retrato de un participante del taller sin alterar sus rasgos faciales ni tono de piel.',
    copyLabel: 'Copiar Prompt Aplicador a Retrato',
    promptText: `Actúa como fotógrafo retratista ético y respetuoso de la identidad comunitaria.
Voy a adjuntar una fotografía mía (o de un participante del taller). Aplica sobre ella EXCLUSIVAMENTE el estilo lumínico, óptico y cromático definido en el siguiente bloque JSON, PRESERVANDO rigurosamente mis rasgos faciales, forma de ojos, estructura ósea, tono natural de piel y expresiones reales sin rejuvenecer, deformar ni "blanquear":

[PEGA_AQUÍ_EL_JSON_OBTENIDO_EN_EL_PASO_1]

Instrucciones prioritarias:
1. NO plastificar la piel ni aplicar efecto beauty filter.
2. Mantener la mirada y la dignidad de la persona retratada.
3. El resultado debe parecer una toma auténtica de 35mm realizada en la misma sesión fotográfica.`
  },
  {
    id: 'json-step-3',
    step: 'Paso 03',
    title: 'Adaptar el Estilo a Espacios y Arquitectura Comunitaria',
    objective: 'Aplica los mismos parámetros lumínicos del JSON a paisajes, esquinas del barrio o espacios de Casa de Cultura Los Colores.',
    copyLabel: 'Copiar Prompt de Arquitectura & Territorio',
    promptText: `Actúa como fotógrafo de arquitectura y territorio barrial.
Toma los siguientes parámetros fotográficos del JSON y genera una composición de una esquina popular de Medellín (fachadas de ladrillo rojo, cables aéreos ordenados, plantas en macetas de tarros de pintura, luz de atardecer):

[PEGA_AQUÍ_EL_JSON_OBTENIDO_EN_EL_PASO_1]

Ajustes territoriales:
- Sujeto: Espacio público barrial con presencia humana sutil pero no protagónica.
- Preserva la paleta cromática y el grano del film stock indicado en el JSON.
- Evita clichés de violencia o exotismo; busca la poesía cotidiana y el cuidado comunitario.`
  },
  {
    id: 'json-step-4',
    step: 'Paso 04',
    title: 'Generación del Prompt de Imagen Final para Midjourney o FLUX',
    objective: 'Convierte el JSON a la fórmula de 7 elementos en una sola línea de texto en inglés para los generadores de imágenes.',
    copyLabel: 'Copiar Prompt Traductor a Midjourney/FLUX',
    promptText: `Convierte este bloque JSON de parámetros fotográficos en un solo prompt en inglés, altamente denso y optimizado para FLUX.1 o Midjourney v6.1:

[PEGA_AQUÍ_EL_JSON_OBTENIDO_EN_EL_PASO_1]

Aplica esta estructura exacta:
[Subject description with genuine posture], [setting and environmental details], shot on [camera_and_format] with [lens_and_optics], [lighting_setup], authentic [film_stock_and_grain], visible tactile micro-textures, [color_palette_hex highlights], [mood], cinematic realism, no digital sheen --ar 16:9 --style raw`
  },
  {
    id: 'json-step-5',
    step: 'Paso 05',
    title: 'Control de Coherencia para Series de 3 a 5 Imágenes',
    objective: 'Garantiza que una serie completa para la vitrina del taller mantenga la misma estética y parezca parte de la misma exposición.',
    copyLabel: 'Copiar Prompt de Serie Coherente',
    promptText: `Actúa como curador de una serie visual de 4 piezas para la vitrina de Núcleo Colectivo.
Basándote en el estilo fotográfico del JSON:

[PEGA_AQUÍ_EL_JSON_OBTENIDO_EN_EL_PASO_1]

Diseña los prompts para 4 planos complementarios de una misma historia comunitaria:
1. Plano Detalle (Macro): Un objeto con memoria afectiva (ej: llaves viejas, una taza de peltre, manos tejiendo).
2. Retrato Medio (Medium Close-Up): El rostro sereno de la persona creadora mirando a la cámara.
3. Plano Americano (Cowboy): La persona interactuando con su herramienta o espacio de trabajo.
4. Plano General (Wide): El entorno del barrio o de Casa de Cultura Los Colores al final de la tarde.

Todos deben compartir la misma luz, grano y paleta cromática exacta del JSON.`
  }
];

export const MasterPromptsLibrary: React.FC<MasterPromptsLibraryProps> = ({
  project,
  onOpenTool
}) => {
  const [activeTab, setActiveTab] = useState<'disciplinas' | 'familias' | 'json'>('familias');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyCard = (card: PromptCardData) => {
    const compiled = compileMasterPrompt(card.toolId, project, {});
    handleCopyText(compiled.masterPrompt, card.letter);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#fcfbf9] border-2 border-stone-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#7656ff] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                Biblioteca Oficial Núcleo Colectivo
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs font-mono text-stone-500">
                Ficha: <strong className="text-stone-900">{project.title}</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Biblioteca de Prompts & Métodos de Creación
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Basada en los manuales oficiales de <strong>Núcleo Colectivo</strong>: la fórmula de 7 elementos, las 7 familias creativas del taller y el método de extracción fotográfica en JSON para ChatGPT.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border-2 border-stone-300 w-full md:w-44 h-28 shrink-0 relative shadow-xs">
            <img
              src="/src/assets/images/manos_creador_proceso_1794090700159.jpg"
              alt="Manos de creador bocetando prompts"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end p-2 text-white">
              <span className="text-[10px] font-mono font-bold">Proceso analógico + IA</span>
            </div>
          </div>
        </div>

        {/* 3 Main Tabs */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-stone-200">
          <button
            onClick={() => setActiveTab('familias')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'familias'
                ? 'bg-[#f8c300] text-[#111111] shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>7 Familias de Prompts (Oficial)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111111] text-[#f8c300]">
              7
            </span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'json'
                ? 'bg-[#7656ff] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Método JSON de Estilo Fotográfico</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20 text-white">
              5 Pasos
            </span>
          </button>

          <button
            onClick={() => setActiveTab('disciplinas')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'disciplinas'
                ? 'bg-[#111111] text-[#f8c300] shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Prompts Maestros Adaptables (A-G)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-300 text-stone-800">
              7 Roles
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: 7 FAMILIAS DE PROMPTS */}
      {activeTab === 'familias' && (
        <div className="space-y-6">
          {/* Formula banner */}
          <div className="bg-[#111111] text-white p-5 rounded-2xl border-2 border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#f8c300] uppercase tracking-wider block">
                Fórmula Maestra de Núcleo Colectivo (7 Elementos):
              </span>
              <p className="text-xs sm:text-sm font-mono text-stone-200">
                SUJETO + ACCIÓN + ESCENARIO + MEDIO/TIPO + ESTILO + ILUMINACIÓN/ATMÓSFERA + COMPOSICIÓN/PARÁMETROS
              </p>
            </div>
            <span className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-xs font-mono shrink-0">
              Documento: biblioteca_prompts.pdf
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {OFFICIAL_FAMILIES.map((fam) => (
              <div
                key={fam.id}
                className="bg-white rounded-3xl border-2 border-stone-200 p-6 space-y-4 shadow-xs hover:border-stone-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-black text-[#7656ff] uppercase tracking-wider block">
                      {fam.category}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-[#111111]">
                      {fam.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-mono font-bold shrink-0 border border-stone-200">
                    <ToolLogo name={fam.recommendedModel} size="xs" />
                    <span>{fam.recommendedModel}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {fam.description}
                </p>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono space-y-1 text-stone-700">
                  <span className="font-bold text-stone-900 block">Desglose de la Fórmula:</span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">{fam.formulaApplied}</p>
                </div>

                {/* Prompt Ready to Copy */}
                <div className="relative">
                  <div className="bg-[#111111] text-stone-200 p-4 rounded-2xl border border-stone-800 text-xs font-mono leading-relaxed select-all">
                    {fam.promptExample}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleCopyText(fam.promptExample, fam.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    {copiedId === fam.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>¡Prompt Copiado al Portapapeles!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Prompt Listo para Generar</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] font-mono text-stone-400">
                    Listo para pegar en Midjourney / FLUX / Google Imagen
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MÉTODO JSON FOTOGRÁFICO EN CHATGPT */}
      {activeTab === 'json' && (
        <div className="space-y-6">
          <div className="bg-[#7656ff] text-white p-6 rounded-3xl border-2 border-[#5e48d5] space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-[#f8c300] block">
              Guía Práctica: Fotografía IA en Formato JSON
            </span>
            <h4 className="text-xl sm:text-2xl font-black">
              Cómo clonar el estilo fotográfico sin desdibujar la identidad propia
            </h4>
            <p className="text-xs sm:text-sm text-stone-100 max-w-3xl leading-relaxed">
              En lugar de usar prompts vagos como <em>"fotografía hiperrealista 8k"</em>, este método instruye a ChatGPT para analizar una foto real y producir una ficha JSON con óptica, temperatura de color, emulsión analógica y textura de piel. Luego, ese JSON se inyecta en retratos propios.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {JSON_PROMPTS.map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-3xl border-2 border-stone-200 p-6 space-y-4 shadow-xs hover:border-stone-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#111111] text-[#f8c300] font-mono font-black text-xs rounded-xl">
                      {step.step}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[#111111]">
                      {step.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-stone-500">
                    ChatGPT / Claude / Gemini
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {step.objective}
                </p>

                <div className="bg-[#111111] text-emerald-400 p-4 rounded-2xl border border-stone-800 text-xs font-mono whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed select-all">
                  {step.promptText}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => handleCopyText(step.promptText, step.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7656ff] hover:bg-[#5e48d5] text-white font-black rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    {copiedId === step.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>¡Instrucción Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{step.copyLabel}</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] font-mono text-stone-400">
                    Pega directamente en ChatGPT o tu LLM de preferencia
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROMPTS MAESTROS ADAPTABLES (A a G) */}
      {activeTab === 'disciplinas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROMPT_CARDS.map((card) => {
              const compiled = compileMasterPrompt(card.toolId, project, {});

              return (
                <div
                  key={card.letter}
                  className="bg-white rounded-3xl border-2 border-stone-200 p-5 flex flex-col justify-between hover:border-stone-400 transition-all shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-[#111111] text-[#f8c300] flex items-center justify-center font-mono font-black text-xs">
                          {card.letter}
                        </span>
                        <strong className="text-sm font-black text-[#111111]">
                          {card.title}
                        </strong>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {card.badge}
                      </span>
                    </div>

                    <p className="text-stone-600 text-xs leading-relaxed">
                      {card.description}
                    </p>

                    <div className="bg-[#111111] text-stone-200 p-3 rounded-xl border border-stone-800 text-xs font-mono max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
                      {compiled.masterPrompt}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-stone-600">
                      <ToolLogo name={card.targetModels} size="xs" />
                      <span>Modelos: <strong className="text-stone-900">{card.targetModels}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyCard(card)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-mono font-bold transition cursor-pointer"
                    >
                      {copiedId === card.letter ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Prompt</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenTool(card.toolId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-lg text-xs transition cursor-pointer"
                    >
                      <span>Abrir en Estudio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
