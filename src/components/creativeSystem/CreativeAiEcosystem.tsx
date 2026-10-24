import React, { useState } from 'react';
import { ExternalLink, Sparkles, Zap, Tag, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AiToolItem {
  id: string;
  name: string;
  category: 'razonamiento' | 'prototipado' | 'imagen' | 'video' | 'audio';
  categoryLabel: string;
  costBadge: '100% Gratis' | 'Gratis con créditos' | 'Freemium / Ensayos' | 'Prueba sin costo';
  costBadgeColor: string;
  description: string;
  whyUseful: string;
  url: string;
  testedInWorkshop: boolean;
}

const AI_ECOSYSTEM_DATA: AiToolItem[] = [
  {
    id: 'ai-studio',
    name: 'Google AI Studio',
    category: 'razonamiento',
    categoryLabel: 'Modelos & IA',
    costBadge: '100% Gratis',
    costBadgeColor: '#22c55e',
    description: 'Entorno oficial de Google para probar modelos Gemini (Gemini 2.5 Flash, Gemini Pro, Thinking) con cuota generosa de API gratuita.',
    whyUseful: 'Ideal para estructurar proyectos, formular preguntas generadoras y procesar documentos de memoria comunitaria.',
    url: 'https://aistudio.google.com/',
    testedInWorkshop: true
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    category: 'razonamiento',
    categoryLabel: 'Modelos & IA',
    costBadge: '100% Gratis',
    costBadgeColor: '#22c55e',
    description: 'Asistente multimodal en tiempo real para ideación, análisis de imágenes, síntesis de textos y redacción conceptual.',
    whyUseful: 'Acceso inmediato sin configuración para pulir la intención del proyecto y desglosar ideas.',
    url: 'https://gemini.google.com/',
    testedInWorkshop: true
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    category: 'razonamiento',
    categoryLabel: 'Modelos & IA',
    costBadge: 'Freemium / Ensayos',
    costBadgeColor: '#3b82f6',
    description: 'Acceso gratuito a GPT-4o mini y funciones multimodales para lluvia de ideas y refinamiento de textos.',
    whyUseful: 'Excelente para crear diálogos, guiones de video y contrastar perspectivas sobre el proyecto.',
    url: 'https://chatgpt.com/',
    testedInWorkshop: true
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    category: 'razonamiento',
    categoryLabel: 'Modelos & IA',
    costBadge: 'Freemium / Ensayos',
    costBadgeColor: '#3b82f6',
    description: 'Destaca por su prosa sensible, matices conceptuales profundos, diseño de artefactos y pensamiento crítico.',
    whyUseful: 'Perfecto para la dirección de arte, manifiestos culturales y redacción de propuestas de valor comunitario.',
    url: 'https://claude.ai/',
    testedInWorkshop: true
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    category: 'razonamiento',
    categoryLabel: 'Modelos & IA',
    costBadge: '100% Gratis',
    costBadgeColor: '#22c55e',
    description: 'Modelo de razonamiento abierto de alto rendimiento para lógica, programación y estructuración sistemática.',
    whyUseful: 'Permite desglosar problemas complejos y diseñar arquitecturas sin coste de suscripción.',
    url: 'https://chat.deepseek.com/',
    testedInWorkshop: false
  },
  {
    id: 'bolt',
    name: 'Bolt.new (StackBlitz)',
    category: 'prototipado',
    categoryLabel: 'Código & Prototipado Web',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#f97316',
    description: 'Entorno de desarrollo con IA en el navegador que genera aplicaciones web completas en React y Node.js en segundos.',
    whyUseful: 'Prototipa interfaces vivas, visualizadores y tableros interactivos para la mesa de trabajo.',
    url: 'https://bolt.new/',
    testedInWorkshop: true
  },
  {
    id: 'lovable',
    name: 'Lovable.dev',
    category: 'prototipado',
    categoryLabel: 'Código & Prototipado Web',
    costBadge: 'Freemium / Ensayos',
    costBadgeColor: '#f97316',
    description: 'Constructor de aplicaciones web mediante lenguaje natural y componentes accesibles en Tailwind CSS.',
    whyUseful: 'Permite pasar de una idea descrita en texto a una pantalla navegable para pruebas con usuarios.',
    url: 'https://lovable.dev/',
    testedInWorkshop: false
  },
  {
    id: 'v0-vercel',
    name: 'v0 (Vercel)',
    category: 'prototipado',
    categoryLabel: 'Código & Prototipado Web',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#f97316',
    description: 'Generador de interfaces de usuario y componentes interactivos creado por el equipo de Vercel.',
    whyUseful: 'Crea maquetas limpias y código modular listo para integrar en lab-colores.vercel.app.',
    url: 'https://v0.dev/',
    testedInWorkshop: true
  },
  {
    id: 'p5js-editor',
    name: 'p5.js Web Editor',
    category: 'prototipado',
    categoryLabel: 'Código & Prototipado Web',
    costBadge: '100% Gratis',
    costBadgeColor: '#22c55e',
    description: 'Entorno web libre y de código abierto para artes visuales, visuales generativos e interacción con mouse/cámara.',
    whyUseful: 'Sin registro obligatorio ni costos para probar los códigos de partículas del Módulo 05.',
    url: 'https://editor.p5js.org/',
    testedInWorkshop: true
  },
  {
    id: 'runway',
    name: 'Runway ML (Gen-2 / Gen-3)',
    category: 'video',
    categoryLabel: 'Video Cinematográfico',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#a855f7',
    description: 'Suite audiovisual generativa para convertir texto o imágenes fijas en planos de video cinematográficos.',
    whyUseful: 'Ideal para probar el primer plano de 5 segundos en los primeros 15 minutos del taller.',
    url: 'https://runwayml.com/',
    testedInWorkshop: true
  },
  {
    id: 'kling',
    name: 'Kling AI',
    category: 'video',
    categoryLabel: 'Video Cinematográfico',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#a855f7',
    description: 'Modelo de video generativo con créditos diarios gratuitos, alta fidelidad física y movimientos de cámara suaves.',
    whyUseful: 'Permite ensayar secuencias realistas sin coste inicial de tarjeta de crédito.',
    url: 'https://klingai.com/',
    testedInWorkshop: true
  },
  {
    id: 'luma',
    name: 'Luma Dream Machine',
    category: 'video',
    categoryLabel: 'Video Cinematográfico',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#a855f7',
    description: 'Generación de tomas continuas y dinámicas en 3D/video a partir de descripciones cinematográficas.',
    whyUseful: 'Pruebas rápidas de movimientos de cámara (dolly, grúa, paneo).',
    url: 'https://lumalabs.ai/dream-machine',
    testedInWorkshop: false
  },
  {
    id: 'krea',
    name: 'Krea.ai / Flux',
    category: 'imagen',
    categoryLabel: 'Imagen & Fotografía',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#ff4fa3',
    description: 'Generación visual en tiempo real y reescalado de imágenes con grano analógico y modelos de alta resolución.',
    whyUseful: 'Renderiza bocetos y fotografías preliminares inmediatamente para validar el estilo.',
    url: 'https://www.krea.ai/',
    testedInWorkshop: true
  },
  {
    id: 'leonardo',
    name: 'Leonardo.Ai',
    category: 'imagen',
    categoryLabel: 'Imagen & Fotografía',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#ff4fa3',
    description: 'Plataforma con 150 créditos diarios renovables para crear series de arte conceptual, texturas y retratos.',
    whyUseful: 'Mantiene consistencia estética al alimentar el modelo con la guía de estilo del Módulo 02.',
    url: 'https://leonardo.ai/',
    testedInWorkshop: true
  },
  {
    id: 'suno',
    name: 'Suno AI',
    category: 'audio',
    categoryLabel: 'Audio & Música',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#7656ff',
    description: 'Generador musical con créditos diarios gratuitos que produce piezas completas con instrumentación y voz.',
    whyUseful: 'Ensaya la atmósfera sonora de fondo para videos y proyecciones colectivas.',
    url: 'https://suno.com/',
    testedInWorkshop: true
  },
  {
    id: 'udio',
    name: 'Udio Music',
    category: 'audio',
    categoryLabel: 'Audio & Música',
    costBadge: 'Gratis con créditos',
    costBadgeColor: '#7656ff',
    description: 'Motor de música experimental y paisaje sonoro de alta fidelidad acústica y timbres orgánicos.',
    whyUseful: 'Crea paisajes sonoros y texturas ambientales para complementar el Módulo 06.',
    url: 'https://www.udio.com/',
    testedInWorkshop: false
  }
];

export const CreativeAiEcosystem: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'razonamiento' | 'prototipado' | 'imagen' | 'video' | 'audio'>('all');

  const filtered = AI_ECOSYSTEM_DATA.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#111111] text-white rounded-2xl p-6 sm:p-7 border-2 border-stone-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8c300] text-[#111111] text-xs font-mono font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              Ecosistema Abierto para Ensayos
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Herramientas de IA Gratuitas o de Bajo Costo para Ensayar
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Selección curada para los participantes del taller: plataformas que ofrecen <strong>versión 100% gratuita, créditos diarios renovables o ensayos sin costo</strong> para prototipar en los primeros 15 minutos de la mesa de trabajo sin barreras de entrada.
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl text-xs space-y-1 shrink-0">
            <span className="text-[#f8c300] font-mono font-bold block uppercase text-[10px]">
              Regla de oro del taller:
            </span>
            <p className="text-stone-300">
              Probar primero en versión gratuita. Invertir solo cuando el prototipo esté validado con el público.
            </p>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-800 overflow-x-auto scrollbar-none text-xs font-mono font-bold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            Todas ({AI_ECOSYSTEM_DATA.length})
          </button>
          <button
            onClick={() => setActiveFilter('razonamiento')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'razonamiento'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            Modelos & Razonamiento
          </button>
          <button
            onClick={() => setActiveFilter('prototipado')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'prototipado'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            Código & Prototipado Web
          </button>
          <button
            onClick={() => setActiveFilter('imagen')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'imagen'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            Imagen & Fotografía
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'video'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            Video Cinematográfico
          </button>
          <button
            onClick={() => setActiveFilter('audio')}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'audio'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            Audio & Paisaje Sonoro
          </button>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border-2 border-stone-200 p-5 flex flex-col justify-between hover:border-stone-400 transition-all shadow-xs space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {item.categoryLabel}
                </span>

                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${item.costBadgeColor}15`,
                    color: item.costBadgeColor
                  }}
                >
                  {item.costBadge}
                </span>
              </div>

              <div>
                <h4 className="font-black text-lg text-[#111111] leading-tight">
                  {item.name}
                </h4>
                <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="bg-[#fcfbf9] border border-stone-200 p-3 rounded-xl text-[11px] text-stone-700 space-y-0.5">
                <strong className="block text-stone-900 font-bold uppercase text-[9px] font-mono text-[#7656ff]">
                  ✦ Para qué usarla en el taller:
                </strong>
                <p>{item.whyUseful}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              {item.testedInWorkshop ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-green-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verificada en taller
                </span>
              ) : (
                <span className="text-[11px] font-mono text-stone-400">
                  Opción de ensayo
                </span>
              )}

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] hover:bg-stone-800 text-[#f8c300] font-black rounded-lg text-xs transition cursor-pointer shadow-xs"
              >
                <span>Abrir y Ensayar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
