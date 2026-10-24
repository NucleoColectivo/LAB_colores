import React, { useState } from 'react';
import { BookOpen, Copy, Check, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { CreativeProject, CreativeToolId } from '../../types/creativeSystem';
import { compileMasterPrompt } from '../../utils/creativePromptTemplates';

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

export const MasterPromptsLibrary: React.FC<MasterPromptsLibraryProps> = ({
  project,
  onOpenTool
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (card: PromptCardData) => {
    const compiled = compileMasterPrompt(card.toolId, project, {});
    navigator.clipboard.writeText(compiled.masterPrompt);
    setCopiedId(card.letter);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfbf9] border border-stone-200 rounded-2xl p-6 sm:p-7">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7656ff]/15 text-[#7656ff] text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Plantillas Adaptables
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
          Biblioteca de Prompts Maestros para lab-colores.vercel.app
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl mt-1 leading-relaxed">
          Cada prompt está calibrado para resolver una decisión concreta. Los campos heredan automáticamente los datos de tu proyecto activo (<strong>{project.title}</strong>) o pueden adaptarse con tus propios selectores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROMPT_CARDS.map((card) => {
          const compiled = compileMasterPrompt(card.toolId, project, {});

          return (
            <div
              key={card.letter}
              className="bg-white rounded-2xl border-2 border-stone-200 p-5 flex flex-col justify-between hover:border-stone-400 transition-all shadow-xs space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#111111] text-[#f8c300] flex items-center justify-center font-mono font-black text-xs">
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

                <div className="bg-[#111111] text-stone-200 p-3 rounded-xl border border-stone-800 text-xs font-mono max-h-36 overflow-y-auto whitespace-pre-wrap">
                  {compiled.masterPrompt}
                </div>

                <div className="text-[11px] font-mono text-stone-500">
                  Modelos sugeridos: <strong className="text-stone-800">{card.targetModels}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyPrompt(card)}
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
  );
};
