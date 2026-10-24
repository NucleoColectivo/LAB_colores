import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, CheckCircle2, RotateCcw, Zap } from 'lucide-react';
import { RouteDiagnosisAnswer, RecommendedRoute, CreativeProject } from '../../types/creativeSystem';
import { diagnoseCreativeRoute } from '../../utils/creativeCatalogData';

interface CreativeRouteExplorerProps {
  project: CreativeProject;
  onApplyRoute: (route: RecommendedRoute) => void;
  onOpenTool: (toolId: string) => void;
}

const QUESTION_OPTIONS = {
  q1Intent: [
    { value: 'Tengo una intuición abstracta o memoria comunitaria y quiero descubrir cómo darle forma', label: 'Tengo una intuición abstracta o memoria comunitaria' },
    { value: 'Quiero crear una serie visual o fotográfica con alta coherencia estética y de autor', label: 'Quiero crear una serie visual o fotográfica' },
    { value: 'Quiero producir un video cinematográfico o animación generativa con planos continuos', label: 'Quiero producir un video o animación cinematográfica' },
    { value: 'Quiero diseñar una experiencia web interactiva, sensible o generativa con p5.js', label: 'Quiero una experiencia web o instalación interactiva' },
    { value: 'Quiero explorar paisaje sonoro, voces y música reactiva para una obra inmersiva', label: 'Quiero explorar sonido, música y paisaje auditivo' },
    { value: 'Tengo varias ideas dispersas y necesito estructurar un plan de producción por etapas', label: 'Necesito estructurar un proyecto y armar su plan' }
  ],
  q2Output: [
    { value: 'Fotografía fija, póster o serie visual para exposición y redes', label: 'Serie de imágenes o fotografía fija' },
    { value: 'Video generativo de 15 a 60 segundos con ritmo y sonido', label: 'Video generativo con planos continuos' },
    { value: 'Prototipo interactivo en navegador web que responda al usuario', label: 'Prototipo interactivo web o canvas' },
    { value: 'Instalación espacial con proyección y sensores o interacción comunitaria', label: 'Instalación interactiva o performance' },
    { value: 'Paisaje sonoro espacializado o pieza de audio generativo', label: 'Paisaje sonoro o pieza musical' },
    { value: 'Ficha de proyecto completa y matriz de tareas para el equipo', label: 'Ficha conceptual y plan de producción' }
  ],
  q3Audience: [
    { value: 'Comunidad local, vecinos o participantes del territorio', label: 'Comunidad local y territorio' },
    { value: 'Público general en plataformas web y redes digitales', label: 'Público web y redes digitales' },
    { value: 'Comunidad artística, estudiantes e investigadores', label: 'Artistas, educadores y creadores' },
    { value: 'Visitantes de una sala de exposición o galería', label: 'Público presencial en sala' },
    { value: 'Proceso íntimo de autorreflexión y experimentación propia', label: 'Proceso personal de autor' }
  ],
  q4Resources: [
    { value: 'Solo un navegador web y conexión a internet (enfoque liviano)', label: 'Navegador web y laptop básica' },
    { value: 'Herramientas de IA generativa (Midjourney, Runway, Claude)', label: 'Modelos de IA generativa' },
    { value: 'Conocimientos de código creativo (HTML, p5.js, shaders)', label: 'Código y programación creativa' },
    { value: 'Cámaras, micrófonos o archivo histórico del territorio', label: 'Archivo físico o audiovisual' },
    { value: 'Tiempo express para prototipar en 15 a 30 minutos', label: 'Tiempo express (15 - 30 min)' }
  ],
  q5Support: [
    { value: 'Estructurar mi intención paso a paso sin términos técnicos complicados', label: 'Estructurar la idea paso a paso' },
    { value: 'Darme prompts listos para copiar en Midjourney, Runway o p5.js', label: 'Prompts listos para copiar y usar' },
    { value: 'Actuar como director de arte sofisticado y sugerir referencias de vanguardia', label: 'Dirección de arte y estética de vanguardia' },
    { value: 'Dividir el proyecto en acciones pequeñas realizables en este taller', label: 'Plan de acción para este taller' }
  ]
};

export const CreativeRouteExplorer: React.FC<CreativeRouteExplorerProps> = ({
  project,
  onApplyRoute,
  onOpenTool
}) => {
  const [answers, setAnswers] = useState<RouteDiagnosisAnswer>({
    q1Intent: QUESTION_OPTIONS.q1Intent[0].value,
    q2Output: QUESTION_OPTIONS.q2Output[0].value,
    q3Audience: QUESTION_OPTIONS.q3Audience[0].value,
    q4Resources: QUESTION_OPTIONS.q4Resources[0].value,
    q5Support: QUESTION_OPTIONS.q5Support[0].value
  });

  const [recommendedRoute, setRecommendedRoute] = useState<RecommendedRoute | null>(() =>
    diagnoseCreativeRoute({
      q1Intent: QUESTION_OPTIONS.q1Intent[0].value,
      q2Output: QUESTION_OPTIONS.q2Output[0].value,
      q3Audience: QUESTION_OPTIONS.q3Audience[0].value,
      q4Resources: QUESTION_OPTIONS.q4Resources[0].value,
      q5Support: QUESTION_OPTIONS.q5Support[0].value
    })
  );

  const [activeStep, setActiveStep] = useState(0);

  const handleDiagnose = () => {
    const route = diagnoseCreativeRoute(answers);
    setRecommendedRoute(route);
  };

  const handleSelectOption = (field: keyof RouteDiagnosisAnswer, value: string) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);
    setRecommendedRoute(diagnoseCreativeRoute(updated));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8c300]/20 text-[#111111] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-[#111111]" />
            Explorador de Rutas Creativas
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
            ¿Hacia dónde quieres llevar tu proyecto hoy?
          </h3>
          <p className="text-stone-600 text-sm max-w-2xl mt-1">
            Responde a estas 5 preguntas para diagnosticar la ruta óptima y activar los módulos especializados que tu proyecto necesita.
          </p>
        </div>

        <button
          onClick={() => {
            setAnswers({
              q1Intent: QUESTION_OPTIONS.q1Intent[0].value,
              q2Output: QUESTION_OPTIONS.q2Output[0].value,
              q3Audience: QUESTION_OPTIONS.q3Audience[0].value,
              q4Resources: QUESTION_OPTIONS.q4Resources[0].value,
              q5Support: QUESTION_OPTIONS.q5Support[0].value
            });
            setRecommendedRoute(diagnoseCreativeRoute({
              q1Intent: QUESTION_OPTIONS.q1Intent[0].value,
              q2Output: QUESTION_OPTIONS.q2Output[0].value,
              q3Audience: QUESTION_OPTIONS.q3Audience[0].value,
              q4Resources: QUESTION_OPTIONS.q4Resources[0].value,
              q5Support: QUESTION_OPTIONS.q5Support[0].value
            }));
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar opciones
        </button>
      </div>

      {/* Grid of the 5 Diagnostic Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-b border-stone-200">
        {/* Q1 */}
        <div className="bg-[#fcfbf9] p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-mono font-black text-[#f8c300] bg-[#111111] px-2 py-0.5 rounded uppercase">
            01. Intención
          </span>
          <label className="block text-sm font-black text-[#111111] mt-2 mb-2">
            ¿Qué quieres hacer hoy?
          </label>
          <select
            value={answers.q1Intent}
            onChange={(e) => handleSelectOption('q1Intent', e.target.value)}
            className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2.5 text-stone-800 font-medium focus:ring-2 focus:ring-[#f8c300] focus:border-transparent"
          >
            {QUESTION_OPTIONS.q1Intent.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Q2 */}
        <div className="bg-[#fcfbf9] p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-mono font-black text-[#ff4fa3] bg-[#111111] px-2 py-0.5 rounded uppercase">
            02. Salida
          </span>
          <label className="block text-sm font-black text-[#111111] mt-2 mb-2">
            ¿Qué resultado imaginas?
          </label>
          <select
            value={answers.q2Output}
            onChange={(e) => handleSelectOption('q2Output', e.target.value)}
            className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2.5 text-stone-800 font-medium focus:ring-2 focus:ring-[#ff4fa3] focus:border-transparent"
          >
            {QUESTION_OPTIONS.q2Output.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Q3 */}
        <div className="bg-[#fcfbf9] p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-mono font-black text-[#7656ff] bg-[#111111] px-2 py-0.5 rounded uppercase">
            03. Audiencia
          </span>
          <label className="block text-sm font-black text-[#111111] mt-2 mb-2">
            ¿Para quién es?
          </label>
          <select
            value={answers.q3Audience}
            onChange={(e) => handleSelectOption('q3Audience', e.target.value)}
            className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2.5 text-stone-800 font-medium focus:ring-2 focus:ring-[#7656ff] focus:border-transparent"
          >
            {QUESTION_OPTIONS.q3Audience.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Q4 */}
        <div className="bg-[#fcfbf9] p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-mono font-black text-[#22c55e] bg-[#111111] px-2 py-0.5 rounded uppercase">
            04. Recursos
          </span>
          <label className="block text-sm font-black text-[#111111] mt-2 mb-2">
            ¿Con qué recursos cuentas?
          </label>
          <select
            value={answers.q4Resources}
            onChange={(e) => handleSelectOption('q4Resources', e.target.value)}
            className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2.5 text-stone-800 font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
          >
            {QUESTION_OPTIONS.q4Resources.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Q5 */}
        <div className="bg-[#fcfbf9] p-4 rounded-xl border border-stone-200 md:col-span-2 lg:col-span-2">
          <span className="text-[11px] font-mono font-black text-white bg-[#111111] px-2 py-0.5 rounded uppercase">
            05. Modo de Acompañamiento
          </span>
          <label className="block text-sm font-black text-[#111111] mt-2 mb-2">
            ¿Cómo quieres que te acompañe la IA?
          </label>
          <select
            value={answers.q5Support}
            onChange={(e) => handleSelectOption('q5Support', e.target.value)}
            className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2.5 text-stone-800 font-medium focus:ring-2 focus:ring-[#111111] focus:border-transparent"
          >
            {QUESTION_OPTIONS.q5Support.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommended Route Card */}
      {recommendedRoute && (
        <div className="mt-6 bg-[#111111] text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#f8c300]/15 to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8c300] text-[#111111] text-xs font-black tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Ruta Diagnóstica Sugerida
              </div>

              <h4 className="text-2xl font-black text-white leading-tight">
                {recommendedRoute.title}
              </h4>

              <p className="text-stone-300 text-sm">
                {recommendedRoute.description}
              </p>

              <div className="bg-stone-900 border-l-4 border-[#f8c300] p-3 rounded-r-lg">
                <span className="text-[10px] font-mono uppercase text-[#f8c300] block font-bold">
                  Pregunta generadora para guiarte:
                </span>
                <p className="text-white text-sm font-serif italic mt-0.5">
                  "{recommendedRoute.guidingQuestion}"
                </p>
              </div>

              <div className="bg-stone-800/80 border border-stone-700 p-3 rounded-lg flex items-start gap-3">
                <Zap className="w-4 h-4 text-[#f8c300] mt-0.5 shrink-0" />
                <div className="text-xs">
                  <strong className="text-[#f8c300] block uppercase tracking-wider font-mono">
                    Chispa para los primeros 15 minutos:
                  </strong>
                  <span className="text-stone-200">{recommendedRoute.firstStep15min}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 min-w-[240px]">
              <button
                onClick={() => onApplyRoute(recommendedRoute)}
                className="w-full px-5 py-3.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-sm transition shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Activar Ruta en el Proyecto
              </button>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase text-stone-400 block font-bold">
                  Módulos recomendados para activar:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recommendedRoute.recommendedTools.map((tId) => (
                    <button
                      key={tId}
                      onClick={() => onOpenTool(tId)}
                      className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-md border border-stone-700 transition"
                    >
                      {tId.replace(/^\d+-/, '').replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
