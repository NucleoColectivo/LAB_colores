import React, { useState, useEffect, useRef } from 'react';
import { CreativeSpark, OFFICIAL_WHATSAPP_GROUP_URL } from '../types';
import {
  X,
  Sparkles,
  Video,
  Palette,
  Code2,
  Copy,
  Check,
  Download,
  Share2,
  Clock,
  Play,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Lightbulb,
  Cpu,
  Layers,
  Wand2,
  Flame,
  Globe
} from 'lucide-react';

interface SparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  spark: CreativeSpark | null;
  sourceTitle?: string;
  sourceContext?: string;
}

type ToolTab =
  | 'runway'
  | 'midjourney'
  | 'p5js'
  | 'chatgpt'
  | 'gemini'
  | 'aistudio'
  | 'claude'
  | 'deepseek'
  | 'bolt'
  | 'lovable'
  | 'flow';

interface AiToolOption {
  id: ToolTab;
  label: string;
  category: 'video' | 'image' | 'code' | 'llm' | 'app';
  badge: string;
  color: string;
  url: string;
  description: string;
}

const AI_TOOLS_LIST: AiToolOption[] = [
  {
    id: 'runway',
    label: 'Runway',
    category: 'video',
    badge: 'Video IA',
    color: '#e11d48',
    url: 'https://runwayml.com/',
    description: 'Generación y animación cinematográfica con Gen-3 Alpha y Gen-2.'
  },
  {
    id: 'midjourney',
    label: 'Midjourney',
    category: 'image',
    badge: 'Imagen IA',
    color: '#7656ff',
    url: 'https://www.midjourney.com/',
    description: 'Composición visual, estética fotográfica y texturas pictóricas.'
  },
  {
    id: 'p5js',
    label: 'p5.js',
    category: 'code',
    badge: 'Código Libre',
    color: '#0284c7',
    url: 'https://editor.p5js.org/',
    description: 'Programación creativa interactiva en canvas accesible en la web.'
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    category: 'llm',
    badge: 'Gratis Web',
    color: '#10a37f',
    url: 'https://chatgpt.com/',
    description: 'Guionización, diálogo sensible, contra-argumentación y lluvia de ideas.'
  },
  {
    id: 'gemini',
    label: 'Gemini',
    category: 'llm',
    badge: 'Gratis Google',
    color: '#4285f4',
    url: 'https://gemini.google.com/',
    description: 'Análisis conceptual multimodal, cruce de fuentes y síntesis poética.'
  },
  {
    id: 'aistudio',
    label: 'Google AI Studio',
    category: 'llm',
    badge: 'API Gratuita',
    color: '#f8c300',
    url: 'https://aistudio.google.com/',
    description: 'Entorno de prototipado para desarrolladores con modelos Gemini 2.0 y Flash.'
  },
  {
    id: 'claude',
    label: 'Claude',
    category: 'llm',
    badge: 'Ensayos Libres',
    color: '#d97706',
    url: 'https://claude.ai/',
    description: 'Dirección narrativa, consistencia poética y pensamiento crítico.'
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    category: 'llm',
    badge: 'Gratis',
    color: '#3b82f6',
    url: 'https://chat.deepseek.com/',
    description: 'Razonamiento lógico, estructuración técnica y algoritmos paso a paso.'
  },
  {
    id: 'bolt',
    label: 'BOLT.new',
    category: 'app',
    badge: 'App en Navegador',
    color: '#8b5cf6',
    url: 'https://bolt.new/',
    description: 'Construcción y despliegue de aplicaciones web React en segundos.'
  },
  {
    id: 'lovable',
    label: 'LOVABLE.dev',
    category: 'app',
    badge: 'Prototipado Web',
    color: '#ec4899',
    url: 'https://lovable.dev/',
    description: 'Generación visual de aplicaciones interactivas y prototipos funcionales.'
  },
  {
    id: 'flow',
    label: 'Flow / Kling AI',
    category: 'video',
    badge: 'Créditos Gratis',
    color: '#14b8a6',
    url: 'https://klingai.com/',
    description: 'Video generativo con física realista y créditos de prueba diarios.'
  }
];

export const SparkModal: React.FC<SparkModalProps> = ({
  isOpen,
  onClose,
  spark,
  sourceTitle,
  sourceContext
}) => {
  const [activeTab, setActiveTab] = useState<ToolTab>('runway');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Run a real-time reactive canvas animation for the p5 tab preview
  useEffect(() => {
    if (!isOpen || activeTab !== 'p5js' || !canvasRef.current) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 260);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let isHovered = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const particles = Array.from({ length: 36 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 3 + 2,
      color: ['#ff4fa3', '#7656ff', '#f8c300', '#059669', '#0284c7'][
        Math.floor(Math.random() * 5)
      ]
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = 'rgba(15, 15, 19, 0.25)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (isHovered) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.x += (dx / dist) * 0.8;
            p.y += (dy / dist) * 0.8;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 70) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(248, 195, 0, ${1 - dist / 70})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen, activeTab]);

  if (!isOpen || !spark) return null;

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };

  // Generate specialized prompt for each tool
  const getPromptForTool = (tool: ToolTab): string => {
    switch (tool) {
      case 'runway':
        return spark.runway.prompt;
      case 'midjourney':
        return spark.midjourney.prompt;
      case 'p5js':
        return spark.p5js.code;
      case 'chatgpt':
        return `Actúa como facilitador/a de creación artística y tecnológica. Ayúdame a explorar y desglosar este cruce creativo en 15 minutos:

Proyecto: ${spark.sparkTitle}
Eje sensible: ${spark.thematicBridge}
Fuente / Contexto: ${sourceTitle || 'Núcleo Colectivo'}

Entrega:
1. Una pregunta generadora potente que no presuponga una solución técnica obvia.
2. Tres micro-escenas narrativas o testimoniales listas para dialogar con el público.
3. Un guion breve de 3 actos de 30 segundos cada uno.`;
      case 'gemini':
        return `Actúa como investigador/a creativo/a multimodal en arte, ciencia y territorio.
Analiza este concepto creativo: "${spark.sparkTitle}"
Puente temático: "${spark.thematicBridge}"

Propón:
1. Conexiones inesperadas con archivos históricos, memoria botánica y lenguaje sonoro.
2. Una estructura de interacción donde el público sea co-creador en vivo.
3. Tres prompts listos para generación visual y acústica combinada.`;
      case 'aistudio':
        return `System Instruction: Eres el motor de prototipado sensible de Núcleo Colectivo (lab-colores.vercel.app). Tu meta es transformar intuiciones artísticas en código limpio, prompts precisos y sistemas interactivos sin tecnicismos innecesarios.

User Intent: "${spark.sparkTitle}"
Context: "${spark.thematicBridge}"

Estructura el output en JSON con los siguientes campos:
{
  "pregunta_generadora": string,
  "prototipo_15min": string,
  "visual_prompt": string,
  "p5js_sketch_concept": string
}`;
      case 'claude':
        return `Actúa como director/a de arte y dramaturgo/a de experiencias inmersivas.
Estamos diseñando una obra interactiva titulada: "${spark.sparkTitle}"
Premisa poética: "${spark.thematicBridge}"

Escribe:
1. El manifiesto o declaración de intención en 2 párrafos de alta densidad estética.
2. Tres metáforas visuales no convencionales (evitar luces de neón o estética sci-fi genérica).
3. Una guía de estilo para diseño gráfico, sonoro y espacial.`;
      case 'deepseek':
        return `Actúa como arquitecto de software creativo y especialista en p5.js / Web Audio API.
Idea de interacción: "${spark.sparkTitle}"
Mecánica: "${spark.thematicBridge}"

Diseña el flujo algorítmico:
1. ENTRADA (Input: mouse, touch, micrófono o webcam)
2. PROCESAMIENTO (Mapeo de datos a escalas armónicas o figuras geométricas fractales)
3. SALIDA (Visualización canvas reactiva a 60 fps)
Proporciona el código modular listo para compilar sin dependencias externas.`;
      case 'bolt':
        return `Create a high-impact interactive web prototype for Núcleo Colectivo inspired by: "${spark.sparkTitle}".
Context & Purpose: "${spark.thematicBridge}"

Requirements:
- Single-page React application with Tailwind CSS and Lucide icons.
- An interactive generative visualizer responding to mouse movements and clicks.
- Dark minimalist aesthetic (#111111 base, #f8c300 accent yellow, #7656ff purple accents).
- Export button to download user co-created artifact as text or image.
- Responsive for mobile and desktop screens.`;
      case 'lovable':
        return `Build an interactive web experience titled: "${spark.sparkTitle}".
Sensory Bridge: "${spark.thematicBridge}"

Include:
- Hero section with live interactive canvas or animated cards.
- Prompt playground where participants can tweak 3 sliders (Intensidad, Textura, Tiempo).
- Community contribution drawer to submit their own reflection.
- Fully accessible with dark mode and vibrant high-contrast accents.`;
      case 'flow':
        return `Cinematic photorealistic sequence, slow poetic pacing, 4k resolution:
${spark.runway.prompt}
Camera movement: ${spark.runway.cameraMotion}. High physical consistency, natural organic textures, 24fps motion blur.`;
      default:
        return spark.runway.prompt;
    }
  };

  const currentTool = AI_TOOLS_LIST.find((t) => t.id === activeTab) || AI_TOOLS_LIST[0];
  const activePromptText = getPromptForTool(activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#111111] text-white border-2 border-[#f8c300] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8c300] text-[#111111] text-xs font-mono font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Disparador de Prototipado Rápido · 15 Minutos
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {spark.sparkTitle}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition cursor-pointer"
              title="Cerrar modal"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context banner */}
          <div className="my-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-300 space-y-1 max-w-2xl">
              <span className="text-[#f8c300] font-black font-mono uppercase tracking-wider block">
                Conexión con: {sourceTitle || 'Avance Colectivo'}
              </span>
              <p className="leading-relaxed">{spark.thematicBridge}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(activePromptText, 'quick-active')}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-stone-700 cursor-pointer"
              >
                {copiedKey === 'quick-active' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Prompt</span>
                  </>
                )}
              </button>

              <a
                href={currentTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Abrir {currentTool.label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 15-Minute Roadmap Timeline */}
          <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs">
              <div className="flex items-center gap-1.5 text-[#f8c300] font-black mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Min 00 – 05 · Alinear</span>
              </div>
              <p className="text-stone-300 text-[11px] leading-snug">
                {spark.fifteenMinPlan.min0to5}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs">
              <div className="flex items-center gap-1.5 text-[#7656ff] font-black mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Min 05 – 10 · Disparar</span>
              </div>
              <p className="text-stone-300 text-[11px] leading-snug">
                {spark.fifteenMinPlan.min5to10}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-black mb-1">
                <Check className="w-3.5 h-3.5" />
                <span>Min 10 – 15 · Ensamblar</span>
              </div>
              <p className="text-stone-300 text-[11px] leading-snug">
                {spark.fifteenMinPlan.min10to15}
              </p>
            </div>
          </div>

          {/* Tool Tabs Switcher: Runway, Midjourney, p5.js, ChatGPT, Gemini, AI Studio, Claude, Bolt, Lovable, Flow, DeepSeek */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-black tracking-wider text-stone-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#f8c300]" />
                Ensayar Prompt en Herramientas IA Libres & Low-Cost ({AI_TOOLS_LIST.length})
              </span>
              <span className="text-[10px] font-mono text-[#f8c300]">
                {currentTool.badge}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-stone-800">
              {AI_TOOLS_LIST.map((tool) => {
                const isSelected = activeTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                      isSelected
                        ? 'bg-stone-800 text-white border-[#f8c300] shadow-sm'
                        : 'bg-stone-900 text-stone-400 hover:text-white border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tool.color }} />
                    <span>{tool.label}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-black/30 text-[#f8c300]' : 'bg-stone-800 text-stone-500'
                    }`}>
                      {tool.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tool Content */}
          <div className="space-y-4">
            {/* Tool Header Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-xs">
              <div className="space-y-0.5">
                <strong className="text-white text-sm font-bold flex items-center gap-2">
                  <span>{currentTool.label}</span>
                  <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                    {currentTool.badge}
                  </span>
                </strong>
                <p className="text-stone-400 text-xs">{currentTool.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(activePromptText, activeTab)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-lg text-xs transition cursor-pointer shadow-xs"
                >
                  {copiedKey === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Prompt {currentTool.label}</span>
                    </>
                  )}
                </button>

                <a
                  href={currentTool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-lg text-xs transition cursor-pointer border border-stone-700"
                >
                  <span>Abrir web</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-300" />
                </a>
              </div>
            </div>

            {/* Prompt Code/Text Container */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-400 uppercase">
                  Prompt adaptado para {currentTool.label}:
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  Listo para copiar y ensayar
                </span>
              </div>
              <div className="p-3.5 bg-black/70 rounded-xl font-mono text-xs text-stone-200 leading-relaxed border border-stone-800 select-all max-h-52 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{activePromptText}</pre>
              </div>
            </div>

            {/* If p5.js, show live interactive canvas simulator */}
            {activeTab === 'p5js' && (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-stone-200">
                    Simulador Reactivo en Vivo (Mueve el cursor por el canvas)
                  </span>
                </div>

                <div className="w-full rounded-xl overflow-hidden border border-stone-800 relative bg-[#0f0f13]">
                  <canvas ref={canvasRef} className="w-full h-[220px] block cursor-crosshair" />
                  <div className="absolute bottom-2 right-3 text-[10px] font-mono text-stone-400 bg-black/60 px-2 py-0.5 rounded pointer-events-none">
                    p5.js live canvas preview
                  </div>
                </div>

                <p className="text-[11px] text-stone-400">
                  💡 <strong>Interacción:</strong> {spark.p5js.interactionHint}
                </p>
              </div>
            )}

            {/* Additional parameters if Runway or Midjourney */}
            {activeTab === 'runway' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block font-bold mb-1">
                    🎥 Movimiento de cámara sugerido:
                  </span>
                  <p className="text-stone-200">{spark.runway.cameraMotion}</p>
                </div>
                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block font-bold mb-1">
                    ✨ Atmósfera y textura:
                  </span>
                  <p className="text-stone-200">{spark.runway.tips}</p>
                </div>
              </div>
            )}

            {activeTab === 'midjourney' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block font-bold mb-1">
                    📐 Parámetro de encuadre:
                  </span>
                  <p className="text-stone-200 font-mono">{spark.midjourney.aspectRatio}</p>
                </div>
                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block font-bold mb-1">
                    🎨 Estilo gráfico y técnica:
                  </span>
                  <p className="text-stone-200">{spark.midjourney.styleTips}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between flex-wrap gap-2 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="text-[#f8c300] font-bold">Núcleo Colectivo</span>
            <span>·</span>
            <span>lab-colores.vercel.app</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-full font-bold transition cursor-pointer"
          >
            Listo, volver a la mesa
          </button>
        </div>
      </div>
    </div>
  );
};
