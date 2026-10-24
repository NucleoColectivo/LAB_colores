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
  Lightbulb
} from 'lucide-react';

interface SparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  spark: CreativeSpark | null;
  sourceTitle?: string;
  sourceContext?: string;
}

export const SparkModal: React.FC<SparkModalProps> = ({
  isOpen,
  onClose,
  spark,
  sourceTitle,
  sourceContext
}) => {
  const [activeTab, setActiveTab] = useState<'runway' | 'midjourney' | 'p5js'>('runway');
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

    // Particle nodes representing creative connections
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
      ctx.fillStyle = '#0f0f13';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = '#1f1f2e';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Attract gently to mouse
        if (isHovered) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            p.x += (dx / dist) * 0.8;
            p.y += (dy / dist) * 0.8;
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect near neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(118, 86, 255, ${1 - dist / 80})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      // Cursor pulse
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 16 + Math.sin(frame * 0.1) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#f8c300';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
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

  const handleDownloadSpark = () => {
    const content = `=====================================================
CHISPA DE PROTOTIPADO RÁPIDO · 15 MINUTOS
Laboratorio de Medios Digitales e IA · Núcleo Colectivo
Facilitador: Manuel Palacio (+57 300 610 1221)
=====================================================

TÍTULO DEL CRUCE:
${spark.sparkTitle}

CONTEXTO / FUENTE:
${sourceTitle || 'Avance Colectivo o Grupo por Temas'}
${sourceContext ? `[${sourceContext}]` : ''}

PUENTE TEMÁTICO:
${spark.thematicBridge}

-----------------------------------------------------
PLAN DE ACCIÓN · PRIMEROS 15 MINUTOS:
-----------------------------------------------------
⏱️ Minutos 00 a 05:
${spark.fifteenMinPlan.min0to5}

⏱️ Minutos 05 a 10:
${spark.fifteenMinPlan.min5to10}

⏱️ Minutos 10 a 15:
${spark.fifteenMinPlan.min10to15}

-----------------------------------------------------
1. DISPARADOR PARA RUNWAY (VIDEO GENERATIVO):
-----------------------------------------------------
Prompt:
${spark.runway.prompt}

Movimiento de cámara:
${spark.runway.cameraMotion}

Consejos de atmósfera:
${spark.runway.tips}

-----------------------------------------------------
2. DISPARADOR PARA MIDJOURNEY (IMAGEN GENERATIVA):
-----------------------------------------------------
Prompt:
${spark.midjourney.prompt}

Aspect Ratio:
${spark.midjourney.aspectRatio}

Estilo y técnica:
${spark.midjourney.styleTips}

-----------------------------------------------------
3. DISPARADOR PARA p5.js (CÓDIGO CREATIVO INTERACTIVO):
-----------------------------------------------------
${spark.p5js.code}

Interacción:
${spark.p5js.interactionHint}

=====================================================
Núcleo Colectivo · Crear con lo que tenemos. Imaginar lo que podemos ser.
Web & Repositorio: https://lab-colores.vercel.app/
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chispa-15min-${spark.sparkTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsApp = () => {
    const summary = `*⚡ CHISPA DE 15 MINUTOS · NÚCLEO COLECTIVO*\n*${spark.sparkTitle}*\n${spark.thematicBridge}\n\n🎬 *Runway Prompt:* ${spark.runway.prompt.slice(0, 160)}...\n\n🎨 *Midjourney Prompt:* ${spark.midjourney.prompt.slice(0, 160)}...\n\nWeb del taller: https://lab-colores.vercel.app/`;
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#111111] text-white border-2 border-[#f8c300] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-4 border-b border-stone-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f8c300] text-[#111111] flex items-center justify-center font-black text-xl shrink-0 shadow-sm animate-pulse">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#f8c300] bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                    Disparador de Prototipado
                  </span>
                  <span className="text-xs text-stone-400">
                    Primeros 15 Minutos en Mesa
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                  {spark.sparkTitle}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer shrink-0"
              aria-label="Cerrar ventana de chispa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context & Bridge */}
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <strong className="text-stone-300 block mb-0.5 font-bold">
                {sourceTitle ? `Conexión con: ${sourceTitle}` : 'Puente interdisciplinario'}
              </strong>
              <p className="text-stone-400 leading-snug">{spark.thematicBridge}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleDownloadSpark}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold transition cursor-pointer"
                title="Descargar ficha completa en texto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar TXT</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition cursor-pointer"
                title="Compartir chispa en WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>
            </div>
          </div>

          {/* 15-Minute Roadmap Timeline */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
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

          {/* Tool Tabs Switcher */}
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3 mb-5">
            <button
              onClick={() => setActiveTab('runway')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                activeTab === 'runway'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'bg-stone-900 text-stone-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Runway (Video Generativo)</span>
            </button>

            <button
              onClick={() => setActiveTab('midjourney')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                activeTab === 'midjourney'
                  ? 'bg-[#7656ff] text-white shadow-xs'
                  : 'bg-stone-900 text-stone-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Midjourney (Imagen IA)</span>
            </button>

            <button
              onClick={() => setActiveTab('p5js')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                activeTab === 'p5js'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'bg-stone-900 text-stone-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>p5.js (Código Interactivo)</span>
            </button>
          </div>

          {/* TAB 1: RUNWAY */}
          {activeTab === 'runway' && (
            <div className="space-y-4">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-400">
                    Prompt listo para copiar en Runway / Gen-3 / Pika:
                  </span>
                  <button
                    onClick={() => handleCopy(spark.runway.prompt, 'runway')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e11d48] hover:bg-[#c9183e] text-white font-bold rounded-lg text-xs transition cursor-pointer"
                  >
                    {copiedKey === 'runway' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Prompt Runway</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-black/60 rounded-xl font-mono text-xs text-stone-200 leading-relaxed border border-stone-800 select-all">
                  {spark.runway.prompt}
                </div>
              </div>

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
            </div>
          )}

          {/* TAB 2: MIDJOURNEY */}
          {activeTab === 'midjourney' && (
            <div className="space-y-4">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-400">
                    Prompt listo para Midjourney / DALL-E / Nano Banana:
                  </span>
                  <button
                    onClick={() => handleCopy(spark.midjourney.prompt, 'midjourney')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7656ff] hover:bg-[#6847ea] text-white font-bold rounded-lg text-xs transition cursor-pointer"
                  >
                    {copiedKey === 'midjourney' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Prompt Midjourney</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-black/60 rounded-xl font-mono text-xs text-stone-200 leading-relaxed border border-stone-800 select-all">
                  {spark.midjourney.prompt}
                </div>
              </div>

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
            </div>
          )}

          {/* TAB 3: P5.JS INTERACTIVE SIMULATOR */}
          {activeTab === 'p5js' && (
            <div className="space-y-4">
              {/* Interactive Live Canvas */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-stone-200">
                      Simulador Reactivo en Vivo (Mueve el mouse por el canvas)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(spark.p5js.code, 'p5js')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0284c7] hover:bg-[#0274ae] text-white font-bold rounded-lg text-xs transition cursor-pointer"
                  >
                    {copiedKey === 'p5js' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Código Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código p5.js</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="w-full rounded-xl overflow-hidden border border-stone-800 relative bg-[#0f0f13]">
                  <canvas ref={canvasRef} className="w-full h-[240px] block cursor-crosshair" />
                  <div className="absolute bottom-2 right-3 text-[10px] font-mono text-stone-400 bg-black/60 px-2 py-0.5 rounded pointer-events-none">
                    p5.js live canvas preview
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 mt-2">
                  💡 <strong>Interacción:</strong> {spark.p5js.interactionHint}
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-black/60 border border-stone-800 rounded-xl p-3 font-mono text-[11px] text-stone-300 max-h-40 overflow-y-auto">
                <pre>{spark.p5js.code}</pre>
              </div>
            </div>
          )}
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
