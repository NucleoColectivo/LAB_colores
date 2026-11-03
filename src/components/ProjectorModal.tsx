import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  ParticipantContribution,
  WorkshopAdvance,
  CREATIVE_LANGUAGES,
  WORKSHOP_STEPS,
  OFFICIAL_WORKSHOP_URL,
  OFFICIAL_QR_ASSET_PATH,
  OFFICIAL_WHATSAPP_GROUP_URL,
  OFFICIAL_WHATSAPP_QR_ASSET_PATH,
  CREATIVE_CROSS_TEMPLATES
} from '../types';
import {
  X,
  Tv,
  Layers,
  Users,
  Clock,
  MessageCircle,
  Globe,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Dices,
  FolderKanban,
  CheckCircle2,
  Flame,
  ArrowRight
} from 'lucide-react';
import { playSprintBell, playSparkChime, isNotificationSoundEnabled, setNotificationSoundEnabled } from '../utils/audioNotification';

interface ProjectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributions: ParticipantContribution[];
  advances?: WorkshopAdvance[];
}

export const ProjectorModal: React.FC<ProjectorModalProps> = ({
  isOpen,
  onClose,
  contributions,
  advances = []
}) => {
  // Navigation mode for the projector
  const [activeMode, setActiveMode] = useState<'mapa' | 'sprint' | 'ruleta' | 'avances'>('mapa');
  const [projectorQrMode, setProjectorQrMode] = useState<'whatsapp' | 'web'>('whatsapp');

  // --- SPRINT TIMER (15 MINUTES = 900 SECONDS) ---
  const INITIAL_SECONDS = 15 * 60;
  const [timerSeconds, setTimerSeconds] = useState<number>(INITIAL_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(isNotificationSoundEnabled());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- RULETA DE CRUCES EN VIVO ---
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rouletteResult, setRouletteResult] = useState<{
    participantA: string;
    participantB: string;
    langA: string;
    langB: string;
    promptChallenge: string;
  } | null>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (soundActive) playSparkChime();
            return 0;
          }

          // Trigger transition bell at 10:00 (600s) and 05:00 (300s)
          if ((prev === 601 || prev === 301) && soundActive) {
            playSprintBell();
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, soundActive]);

  // Compute language frequency for the Map mode
  const counts: Record<string, number> = {};
  contributions.forEach((c) => {
    (c.languages || []).forEach((lang) => {
      counts[lang] = (counts[lang] || 0) + 1;
    });
  });

  const maxCount = Math.max(...Object.values(counts), 1);
  const sortedLanguages = Object.entries(counts)
    .map(([name, count]) => {
      const def = CREATIVE_LANGUAGES.find((l) => l.name === name);
      return {
        name,
        count,
        percentage: Math.round((count / Math.max(contributions.length, 1)) * 100),
        relativeBar: Math.max(8, Math.round((count / maxCount) * 100)),
        color: def?.color || '#f8c300'
      };
    })
    .sort((a, b) => b.count - a.count);

  // Spin Roulette Handler
  const handleSpinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    if (soundActive) playSprintBell();

    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      const pList = contributions.length > 0 ? contributions : [{ name: 'Manuel Palacio', alias: 'Manuel', languages: ['IA y experimentación', 'Programación creativa'] }];
      const partA = pList[Math.floor(Math.random() * pList.length)];
      const partB = pList[Math.floor(Math.random() * pList.length)];

      const langListA = partA.languages && partA.languages.length > 0 ? partA.languages : ['Arte generativo'];
      const langListB = partB.languages && partB.languages.length > 0 ? partB.languages : ['Paisaje sonoro'];

      const chosenLangA = langListA[Math.floor(Math.random() * langListA.length)];
      const chosenLangB = langListB[Math.floor(Math.random() * langListB.length)];

      const template = CREATIVE_CROSS_TEMPLATES[Math.floor(Math.random() * CREATIVE_CROSS_TEMPLATES.length)];

      const nameA = partA.name || ('alias' in partA && partA.alias ? partA.alias : 'Creador/a');
      const nameB = partB.name || ('alias' in partB && partB.alias ? partB.alias : 'Creador/a');

      setRouletteResult({
        participantA: nameA,
        participantB: nameB,
        langA: chosenLangA,
        langB: chosenLangB,
        promptChallenge: template ? template.q : `¿Cómo cruzar ${chosenLangA} con ${chosenLangB} en una pieza sensible de 15 minutos?`
      });

      if (counter > 14) {
        clearInterval(interval);
        setIsSpinning(false);
        if (soundActive) playSparkChime();
      }
    }, 100);
  };

  // Timer formatted strings
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Current Sprint Block Analysis
  const sprintBlock = useMemo(() => {
    const elapsed = INITIAL_SECONDS - timerSeconds;
    if (elapsed < 5 * 60) {
      return {
        number: 1,
        title: 'Bloque 1 · Intención & Pregunta Generadora (Min 0 a 5)',
        desc: 'Escriban en 1 frase la intención central del proyecto y la pregunta catalizadora "¿De qué manera...?"',
        color: '#f8c300',
        tools: 'Lápiz, papel, Asistente de Intención'
      };
    } else if (elapsed < 10 * 60) {
      return {
        number: 2,
        title: 'Bloque 2 · Estructuración de Prompts & Detonadores de IA (Min 5 a 10)',
        desc: 'Activen los prompts maestros en Runway, Midjourney, p5.js, ChatGPT o Gemini.',
        color: '#7656ff',
        tools: 'Runway, Midjourney, Google AI Studio, p5.js'
      };
    } else {
      return {
        number: 3,
        title: 'Bloque 3 · Probar Prototipo & Publicar Avance (Min 10 a 15)',
        desc: 'Evalúen el resultado sensible, guarden el hito y publiquen el avance individual o colectivo.',
        color: '#22c55e',
        tools: 'Muro de avances de lab-colores.vercel.app'
      };
    }
  }, [timerSeconds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] text-white flex flex-col overflow-y-auto p-4 sm:p-8 animate-in fade-in duration-200">
      {/* Top Header Bar for Projector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-800 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-[#f8c300] text-[#111111] flex items-center justify-center font-black text-xl shadow-lg">
            ✦
          </span>
          <div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>NÚCLEO COLECTIVO</span>
              <span className="text-[#f8c300] font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800">
                PANTALLA DE PROYECCIÓN
              </span>
            </div>
            <p className="text-xs text-stone-400 font-mono">
              Laboratorio de Medios Digitales e IA · lab-colores.vercel.app
            </p>
          </div>
        </div>

        {/* Projector Modes Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-900 p-1.5 rounded-2xl border border-stone-800 overflow-x-auto">
          <button
            onClick={() => setActiveMode('mapa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeMode === 'mapa'
                ? 'bg-[#f8c300] text-[#111111] shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>01. Afinidades & QR</span>
          </button>

          <button
            onClick={() => setActiveMode('sprint')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeMode === 'sprint'
                ? 'bg-[#f8c300] text-[#111111] shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>02. Sprint 15 Min</span>
            {isTimerRunning && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          <button
            onClick={() => setActiveMode('ruleta')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeMode === 'ruleta'
                ? 'bg-[#f8c300] text-[#111111] shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>03. Ruleta de Cruces</span>
          </button>

          <button
            onClick={() => setActiveMode('avances')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeMode === 'avances'
                ? 'bg-[#f8c300] text-[#111111] shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>04. Muro de Avances ({advances.length})</span>
          </button>
        </div>

        {/* Exit and Sound Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => {
              const next = !soundActive;
              setSoundActive(next);
              setNotificationSoundEnabled(next);
            }}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition cursor-pointer border border-stone-800"
            title={soundActive ? 'Silenciar avisos sonoros' : 'Activar avisos sonoros'}
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-[#f8c300]" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white transition cursor-pointer"
            aria-label="Cerrar modo proyector"
            title="Presiona ESC o clic para cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- MODE 1: CARTOGRAFÍA DE AFINIDADES & DUAL QR --- */}
      {activeMode === 'mapa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left: Collective Map Visual Bars */}
          <div className="lg:col-span-8 bg-[#141414] border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                  <Layers className="w-6 h-6 text-[#7656ff]" />
                  <span>Cartografía de Afinidades Creativas</span>
                </h2>
                <span className="text-xs font-mono font-bold text-[#f8c300] bg-[#f8c300]/10 px-3 py-1 rounded-full border border-[#f8c300]/30 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{contributions.length} participantes conectados</span>
                </span>
              </div>

              {sortedLanguages.length === 0 ? (
                <div className="py-24 text-center text-stone-500 text-base font-mono">
                  Esperando los primeros registros desde lab-colores.vercel.app...
                </div>
              ) : (
                <div className="space-y-4 my-4">
                  {sortedLanguages.slice(0, 8).map((item) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-sm sm:text-base font-bold text-stone-200 mb-1.5">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm">
                          <span className="text-stone-400">{item.percentage}%</span>
                          <span className="text-[#f8c300] font-black">{item.count} creadores</span>
                        </div>
                      </div>
                      <div className="h-3.5 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800/80">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${item.relativeBar}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Latest connected participants ticker */}
            <div className="pt-4 border-t border-stone-800 mt-4">
              <span className="text-[10px] font-mono uppercase text-stone-400 block mb-2 tracking-widest">
                ÚLTIMAS PERSONAS REGISTRADAS EN LA RED:
              </span>
              <div className="flex flex-wrap gap-2">
                {contributions.slice(-6).reverse().map((c) => (
                  <span
                    key={c.id}
                    className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f8c300]" />
                    <strong className="text-white">{c.name || c.alias}</strong>
                    {c.location && <span className="text-stone-500 text-[10px]">({c.location})</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Dual QR Selector */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div
              className={`rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-2xl transition-colors duration-200 ${
                projectorQrMode === 'whatsapp'
                  ? 'bg-[#128C7E] text-white'
                  : 'bg-[#f8c300] text-[#111111]'
              }`}
            >
              <div className="flex items-center gap-1 bg-black/25 p-1 rounded-full mb-3 text-xs font-black">
                <button
                  onClick={() => setProjectorQrMode('whatsapp')}
                  className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1 ${
                    projectorQrMode === 'whatsapp'
                      ? 'bg-white text-[#128C7E]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => setProjectorQrMode('web')}
                  className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1 ${
                    projectorQrMode === 'web'
                      ? 'bg-[#111111] text-[#f8c300]'
                      : 'text-stone-900/80 hover:text-stone-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web App</span>
                </button>
              </div>

              {/* QR Image Frame */}
              <div className="bg-white p-3 rounded-2xl shadow-xl border-2 border-black/20 mb-3 max-w-[210px]">
                <img
                  src={
                    projectorQrMode === 'whatsapp'
                      ? OFFICIAL_WHATSAPP_QR_ASSET_PATH
                      : OFFICIAL_QR_ASSET_PATH
                  }
                  alt="Código QR del taller"
                  className="w-44 h-44 object-contain block mx-auto rounded"
                />
              </div>

              <div
                className={`px-3 py-0.5 rounded font-mono text-[11px] font-bold mb-1 ${
                  projectorQrMode === 'whatsapp'
                    ? 'bg-black/30 text-emerald-100'
                    : 'bg-[#111111] text-white'
                }`}
              >
                {projectorQrMode === 'whatsapp'
                  ? 'chat.whatsapp.com/ErtCU75...'
                  : 'lab-colores.vercel.app'}
              </div>

              <strong className="text-base font-black leading-tight">
                {projectorQrMode === 'whatsapp'
                  ? 'Únete al Grupo de WhatsApp'
                  : 'Suma tu ficha y carnet'}
              </strong>
              <p className="text-xs opacity-90 mt-0.5">
                {projectorQrMode === 'whatsapp'
                  ? 'Comparte preguntas, prompts e imágenes'
                  : 'Escanea con la cámara de tu celular'}
              </p>
            </div>

            {/* Session Steps Box */}
            <div className="bg-[#141414] border border-stone-800 rounded-3xl p-5 text-stone-300">
              <span className="text-[10px] font-mono font-black uppercase text-[#7656ff] tracking-widest block mb-2">
                CRONOGRAMA DE LA SESIÓN
              </span>
              <div className="space-y-1.5 text-xs">
                {WORKSHOP_STEPS.map((s) => (
                  <div
                    key={s.num}
                    className="flex items-center justify-between p-2 rounded-xl bg-stone-900 border border-stone-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-stone-800 text-[#f8c300] text-[9px] font-bold flex items-center justify-center">
                        {s.num}
                      </span>
                      <strong className="text-white text-xs">{s.title}</strong>
                    </div>
                    <span className="text-stone-400 font-mono text-[10px]">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: SPRINT 15 MIN TIMER (PANTALLA MONUMENTAL) --- */}
      {activeMode === 'sprint' && (
        <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full py-4 space-y-6">
          {/* Big Digital Clock Display */}
          <div className="bg-gradient-to-b from-[#141414] to-[#101010] border-4 border-[#f8c300] rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#f8c300]/10 to-transparent pointer-events-none rounded-full" />

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8c300]/20 text-[#f8c300] text-xs font-mono font-bold uppercase tracking-widest border border-[#f8c300]/40">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>Sprint de Creación en Vivo · 15 Minutos</span>
              </span>

              {/* Giant Digits */}
              <div className="text-7xl sm:text-9xl md:text-[140px] font-mono font-black tracking-tight text-white leading-none drop-shadow-lg select-none">
                {formatTime(timerSeconds)}
              </div>

              {/* Progress Bar with 3 segments */}
              <div className="max-w-xl mx-auto space-y-2">
                <div className="w-full bg-stone-900 h-4 rounded-full overflow-hidden p-0.5 border border-stone-800 flex">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-amber-400 via-[#f8c300] to-emerald-400"
                    style={{ width: `${Math.min(100, Math.max(2, ((INITIAL_SECONDS - timerSeconds) / INITIAL_SECONDS) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-stone-500 px-1">
                  <span>0m: Intención</span>
                  <span>5m: Prompt IA</span>
                  <span>10m: Prototipo</span>
                  <span>15m: Publicar</span>
                </div>
              </div>

              {/* Current Active Sprint Block Callout */}
              <div className="mt-6 p-4 rounded-2xl bg-stone-900/90 border border-stone-800 max-w-2xl mx-auto text-left flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 text-[#111111]"
                  style={{ backgroundColor: sprintBlock.color }}
                >
                  {sprintBlock.number}
                </div>
                <div>
                  <h4 className="text-base font-black text-white">
                    {sprintBlock.title}
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                    {sprintBlock.desc}
                  </p>
                  <span className="text-[10px] font-mono text-[#f8c300] block mt-1">
                    Herramientas clave: {sprintBlock.tools}
                  </span>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-6 py-3 rounded-2xl font-black text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
                    isTimerRunning
                      ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                      : 'bg-[#f8c300] hover:bg-[#e5b300] text-[#111111]'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  <span>{isTimerRunning ? 'Pausar Sprint' : 'Iniciar Cuenta Regresiva'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(INITIAL_SECONDS);
                  }}
                  className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-2xl text-xs transition flex items-center gap-2 cursor-pointer border border-stone-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reiniciar (15:00)</span>
                </button>

                <button
                  onClick={() => setTimerSeconds((prev) => Math.min(INITIAL_SECONDS, prev + 60))}
                  className="px-3 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono font-bold rounded-2xl text-xs cursor-pointer border border-stone-800"
                  title="Añadir 1 minuto"
                >
                  +1 min
                </button>

                <button
                  onClick={() => setTimerSeconds((prev) => Math.max(0, prev - 60))}
                  className="px-3 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono font-bold rounded-2xl text-xs cursor-pointer border border-stone-800"
                  title="Restar 1 minuto"
                >
                  -1 min
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 3: RULETA DE CRUCES CREATIVOS EN VIVO --- */}
      {activeMode === 'ruleta' && (
        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-4 space-y-6">
          <div className="bg-[#141414] border-2 border-stone-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7656ff]/20 text-[#a38fff] text-xs font-mono font-bold uppercase tracking-widest border border-[#7656ff]/40">
                <Dices className="w-4 h-4" />
                <span>Emparejador Dinámico de Co-Creación</span>
              </span>

              <h3 className="text-2xl sm:text-4xl font-black text-white">
                Ruleta de Cruces para Imaginar en Vivo
              </h3>

              <p className="text-sm text-stone-400 max-w-xl mx-auto">
                Combina participantes y afinidades para detonar cruces inesperados entre lenguajes analógicos e inteligencia artificial.
              </p>

              {/* Roulette Visual Result */}
              {rouletteResult ? (
                <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all my-6 ${
                  isSpinning
                    ? 'bg-stone-900 border-amber-400/50 blur-[1px]'
                    : 'bg-gradient-to-br from-stone-900 via-stone-950 to-black border-[#f8c300] shadow-2xl animate-in zoom-in-95'
                }`}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center">
                    <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 w-full sm:w-1/2">
                      <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                        Creador/a A
                      </span>
                      <strong className="text-lg sm:text-xl font-black text-white block">
                        {rouletteResult.participantA}
                      </strong>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#f8c300]/20 text-[#f8c300] text-xs font-mono font-bold">
                        {rouletteResult.langA}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#7656ff] text-white flex items-center justify-center font-black text-base shrink-0 shadow-md">
                      ✕
                    </div>

                    <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 w-full sm:w-1/2">
                      <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                        Creador/a B
                      </span>
                      <strong className="text-lg sm:text-xl font-black text-white block">
                        {rouletteResult.participantB}
                      </strong>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                        {rouletteResult.langB}
                      </span>
                    </div>
                  </div>

                  {/* Catalytic Prompt Challenge */}
                  <div className="mt-6 pt-5 border-t border-stone-800 text-left">
                    <span className="text-[11px] font-mono font-black uppercase text-[#f8c300] block mb-1">
                      DESAFÍO CATALIZADOR DE CO-CREACIÓN:
                    </span>
                    <p className="text-base sm:text-lg text-white font-medium italic leading-relaxed">
                      "{rouletteResult.promptChallenge}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-stone-500 font-mono text-sm border-2 border-dashed border-stone-800 rounded-3xl my-6">
                  Pulsa el botón para hacer girar la ruleta de creadores y lenguajes.
                </div>
              )}

              {/* Spin Button */}
              <button
                onClick={handleSpinRoulette}
                disabled={isSpinning}
                className="px-8 py-4 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-2xl text-base transition flex items-center gap-2 mx-auto shadow-xl cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'GIRANDO RULETA EN VIVO...' : '✦ GIRAR RULETA DE CRUCES'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 4: MURO VIVO DE AVANCES EN PANTALLA GIGANTE --- */}
      {activeMode === 'avances' && (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#f8c300]" />
                <span>Muro Vivo de Hitos y Avances del Taller</span>
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Documentación continua transmitida en tiempo real desde las mesas de trabajo
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[#f8c300]">
              {advances.length} entregables guardados
            </span>
          </div>

          {advances.length === 0 ? (
            <div className="py-24 text-center text-stone-500 font-mono text-sm">
              Esperando los primeros avances publicados desde la sección "Avances & Repositorio".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1">
              {advances.map((adv) => (
                <div
                  key={adv.id}
                  className="p-5 rounded-2xl bg-[#141414] border border-stone-800 text-left flex flex-col justify-between hover:border-stone-700 transition space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                        adv.type === 'colectivo' ? 'bg-[#7656ff] text-white' : 'bg-stone-800 text-stone-300'
                      }`}>
                        {adv.type === 'colectivo' ? 'Colectivo' : 'Individual'}
                      </span>
                      <span className="text-stone-400">
                        {new Date(adv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white leading-snug">
                      {adv.title}
                    </h4>

                    <p className="text-xs text-[#f8c300] font-mono mt-1 font-bold">
                      {adv.authors.join(' · ')}
                    </p>

                    {adv.milestone && (
                      <p className="text-xs text-stone-300 mt-2 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-stone-800">
                        "{adv.milestone}"
                      </p>
                    )}
                  </div>

                  {adv.mediaUrl && (
                    <a
                      href={adv.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#7656ff] hover:underline flex items-center gap-1 font-mono pt-2 border-t border-stone-800/80"
                    >
                      <span>Abrir demo / archivo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
