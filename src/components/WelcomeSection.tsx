import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Layers,
  Clock,
  QrCode,
  ArrowRight,
  Tv,
  User,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  HeartHandshake,
  Cpu,
  Palette,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  BookOpen,
  Camera,
  Film,
  Music,
  Share2,
  ChevronRight,
  Check
} from 'lucide-react';
import {
  OFFICIAL_WORKSHOP_URL,
  OFFICIAL_WHATSAPP_GROUP_URL,
  WORKSHOP_STEPS,
  WorkshopStep
} from '../types';
import { AppSection } from './Header';
import { ToolLogo } from './common/ToolLogo';

interface WelcomeSectionProps {
  onNavigateSection: (section: AppSection) => void;
  onOpenProjector: () => void;
  onOpenUserProfile: () => void;
  currentUserName: string;
}

interface WorkshopClassInfo {
  number: number;
  title: string;
  duration: string;
  goal: string;
  activities: string[];
  deliverable: string;
  toolsRecommended: string[];
}

const WORKSHOP_CLASSES: WorkshopClassInfo[] = [
  {
    number: 1,
    title: 'Escuchar, explorar e imaginar',
    duration: '3:30 h',
    goal: 'Crear acuerdos de cuidado mutuo, identificar intereses creativos individuales y mapear afinidades colectivas usando IA como catalizador sensible.',
    activities: [
      'Bienvenida e integración: acuerdos de convivencia y cuidado colectivo.',
      'Cartografía de intereses: selección de lenguajes artísticos afines.',
      'Conversación y preguntas generadoras: ¿qué queremos contar desde nuestro territorio?',
      'Primeros diálogos con modelos de lenguaje (ChatGPT, Gemini, Claude) para estructurar ideas.'
    ],
    deliverable: 'Ficha de Proyecto inicial con pregunta generadora y dirección de arte preliminar.',
    toolsRecommended: ['ChatGPT', 'Gemini', 'Claude', 'Google AI Studio', 'DeepSeek']
  },
  {
    number: 2,
    title: 'Imagen, memoria y transformación digital',
    duration: '3:30 h',
    goal: 'Aprender la fórmula de 7 elementos para prompts visuales y extraer estilos fotográficos en formato JSON preservando la identidad comunitaria.',
    activities: [
      'Desmitificación de la IA visual: cómo "lee" la máquina la luz, óptica y composición.',
      'Fórmula maestra: Sujeto + Acción + Escenario + Medio + Estilo + Iluminación + Composición.',
      'Método JSON: extracción de paleta y textura fotográfica sin perder rasgos propios.',
      'Generación y curaduría de imágenes de memoria territorial en Midjourney, Flux e Imagen 3.'
    ],
    deliverable: 'Serie de 3 imágenes de alta resolución con estilo coherente y prompt documentado.',
    toolsRecommended: ['Midjourney', 'FLUX', 'Gemini', 'Canva']
  },
  {
    number: 3,
    title: 'Narrativas audiovisuales y experiencias interactivas',
    duration: '3:30 h',
    goal: 'Dar movimiento al relato estático a través de animación generativa de video, paisajes sonoros con IA y experiencias interactivas con códigos QR.',
    activities: [
      'De la imagen al movimiento: consistencia de planos y movimientos de cámara en Runway y Kling.',
      'Diseño sonoro y paisaje auditivo con Stable Audio, Suno y ElevenLabs.',
      'Interacción creativa: vinculación de piezas a códigos QR y bocetos en código p5.js.',
      'Reto de 15 minutos: generación de una micro-secuencia audiovisual continua.'
    ],
    deliverable: 'Micro-clip audiovisual (10-30 seg) con audio sincronizado y enlace QR.',
    toolsRecommended: ['Runway', 'Kling', 'Suno', 'ElevenLabs', 'p5.js']
  },
  {
    number: 4,
    title: 'Producción, edición y prototipado colaborativo',
    duration: '3:30 h',
    goal: 'Ensamblar las piezas producidas en un prototipo narrativo terminado mediante cruces entre participantes con saberes complementarios.',
    activities: [
      'Mesa de trabajo colaborativa: emparejamiento de proyectos según afinidades temáticas.',
      'Edición y post-producción ligera (CapCut, Canva, Figma) integrando audio e imagen.',
      'Registro de ficha técnica en la plataforma del taller: ficha de proyecto terminada.',
      'Revisión con el checklist ético: autoría, sesgos, territorio y dignidad comunitaria.'
    ],
    deliverable: 'Prototipo interactivo o audiovisual listo para exhibición comunitaria.',
    toolsRecommended: ['CapCut', 'Figma', 'Canva', 'Bolt', 'Lovable']
  },
  {
    number: 5,
    title: 'Vitrina creativa: compartir, interactuar y activar',
    duration: '4:00 h',
    goal: 'Activar la muestra colectiva abierta a la comunidad de Casa de Cultura Los Colores con recorrido interactivo por pantallas, proyecciones y QR.',
    activities: [
      'Montaje de la estación interactiva y proyección en pantalla gigante en el proyector.',
      'Conversatorio comunitario: aprendizajes, tensiones críticas y futuro del laboratorio.',
      'Activación de códigos QR para que vecinos y asistentes interactúen desde sus móviles.',
      'Cierre simbólico y entrega de carnet de creador/a de Núcleo Colectivo.'
    ],
    deliverable: 'Publicación permanente en el repositorio colectivo y muestra pública en vivo.',
    toolsRecommended: ['Notion', 'Figma', 'Canva', 'p5.js']
  }
];

const ETHICAL_QUESTIONS = [
  {
    q: '1. ¿De dónde vienen las referencias visuales de mi prompt?',
    desc: 'Pregúntate si estás reconociendo tradiciones, estéticas locales o si la máquina está homogeneizando la mirada con estilos globales vacíos.'
  },
  {
    q: '2. ¿Estoy reforzando estereotipos de género, raza o territorio?',
    desc: 'Los modelos suelen amplificar clichés. Revisa si tus personajes y barrios están representados con dignidad, matiz y respeto.'
  },
  {
    q: '3. ¿Reconozco la autoría y los saberes de la comunidad?',
    desc: 'Si una obra nace de una anécdota de un vecino o una foto histórica familiar, cítalo como co-creador en la ficha técnica.'
  },
  {
    q: '4. ¿Qué voz propia aporto yo que la máquina jamás podría inventar?',
    desc: 'La IA aporta combinatoria probabilística; el afecto, la memoria viva, la intención poética y el sentido crítico los pones tú.'
  },
  {
    q: '5. ¿Es necesaria la IA para esto o es más potente hacerlo a mano?',
    desc: 'La tecnología no es un fin en sí misma. A veces una acuarela, una voz directa de audio o un bordado tienen más fuerza que 100 renders.'
  },
  {
    q: '6. ¿Preservo la privacidad y el consentimiento de las personas representadas?',
    desc: 'Nunca generes rostros identificables ni uses fotos íntimas sin consentimiento explícito de las personas retratadas.'
  },
  {
    q: '7. ¿Cuál es el impacto ambiental y energético de mis ensayos?',
    desc: 'Enfoca la intención antes de apretar "generar": menos generaciones a ciegas y más calibración previa con prompts estructurados.'
  }
];

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  onNavigateSection,
  onOpenProjector,
  onOpenUserProfile,
  currentUserName
}) => {
  const [selectedClassIndex, setSelectedClassIndex] = useState<number>(0);
  const [activeMomentIndex, setActiveMomentIndex] = useState<number>(0);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const toggleQuestion = (index: number) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const selectedClass = WORKSHOP_CLASSES[selectedClassIndex];

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* 1. HERO INSTITUCIONAL BIENVENIDA CON IMAGEN DOCUMENTAL */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] text-white border-2 border-[#111111] shadow-xl p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Header Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="font-black text-[#f8c300] uppercase tracking-wider flex items-center gap-1.5">
                ✦ NÚCLEO COLECTIVO
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f8c300]" />
                Casa de Cultura Los Colores · Medellín
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400">
                Facilitador: <strong className="text-white">Manuel Palacio</strong>
              </span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.08] text-white">
                Laboratorio de Medios Digitales & <span className="text-[#f8c300]">Inteligencia Artificial</span>
              </h1>
              <p className="text-base sm:text-lg text-stone-300 font-medium leading-relaxed">
                ¡Te damos la bienvenida al espacio de co-creación! Aquí no vienes a consumir tecnología pasivamente, sino a <strong>transformarla en herramientas de memoria, arte visual, video, sonido y expresión comunitaria</strong>.
              </p>
            </div>

            {/* Manifesto highlight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#f8c300] text-[#111111] flex items-center justify-center font-black text-base shrink-0 mt-0.5">
                ✦
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-black text-[#f8c300] uppercase tracking-wider">
                  Manifiesto Vivo del Taller
                </span>
                <p className="text-sm sm:text-base font-bold text-white">
                  "Crear con lo que tenemos. Imaginar lo que podemos ser."
                </p>
                <p className="text-xs text-stone-400 leading-relaxed">
                  La tecnología se adapta a nuestra voz y territorio, no al revés. No requieres conocimientos previos de programación ni diseño: avanzamos paso a paso desde tu propia intuición.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <button
                onClick={() => onNavigateSection('herramientas')}
                className="px-6 py-3.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-2xl text-sm transition cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#111111]" />
                <span>02. Explorar Herramientas IA (9 Temas)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateSection('sistema')}
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white font-bold rounded-2xl text-sm transition border border-stone-700 cursor-pointer flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#f8c300]" />
                <span>03. Ficha & Prompts Maestros</span>
              </button>

              <a
                href={OFFICIAL_WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-xs"
                title="Abrir grupo oficial de WhatsApp del taller"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Grupo WhatsApp</span>
                <ExternalLink className="w-3 h-3 opacity-75" />
              </a>
            </div>

            {/* User identification bar */}
            <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sesión activa en Casa de Cultura Los Colores</span>
                <span className="text-stone-600">·</span>
                <span>Usuario: <strong className="text-[#f8c300]">{currentUserName}</strong></span>
              </div>
              <button
                onClick={onOpenUserProfile}
                className="text-[#f8c300] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <User className="w-3.5 h-3.5" />
                <span>Mi Carnet QR y Datos Protegidos →</span>
              </button>
            </div>
          </div>

          {/* Hero Photography Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-stone-700 shadow-2xl group">
              <img
                src="/src/assets/images/hero_laboratorio_colores_1794090698313.jpg"
                alt="Laboratorio de Medios Digitales e Inteligencia Artificial en Casa de Cultura Los Colores"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="font-mono text-[10px] text-[#f8c300] uppercase tracking-wider font-bold mb-1">
                  Mesa de Trabajo Presencial
                </span>
                <h3 className="font-black text-sm sm:text-base leading-snug">
                  Casa de Cultura Los Colores · Comuna 11
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                  Artistas, gestores y vecinos explorando sonido, imagen, video y código con IA sensible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOS 3 PILARES METODOLÓGICOS CON FOTOGRAFÍA EDITORIAL */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#7656ff]">
              Fundamentos Pedagógicos
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
              Los 3 Pilares del Laboratorio
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Metodología viva y participativa · Núcleo Colectivo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border-2 border-[#dedbd3] shadow-xs hover:border-[#111111] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#fff1a8] text-[#8a6800] flex items-center justify-center font-black">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                  Pilar 01
                </span>
                <h3 className="text-lg font-black text-[#111111]">
                  Escuchar y reconocer
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Partimos de las memorias barriales, las historias familiares, las preguntas íntimas y los lenguajes artísticos que cada persona ya trae en su cuerpo y memoria.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 text-xs text-[#8a6800] font-mono font-bold">
              ✦ Memoria local + Territorio + Afecto
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#dedbd3] shadow-xs hover:border-[#111111] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#eee9ff] text-[#5e48d5] flex items-center justify-center font-black">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                  Pilar 02
                </span>
                <h3 className="text-lg font-black text-[#111111]">
                  IA y medios críticos
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Experimentamos con modelos de lenguaje, imagen, video y sonido sin tecnicismos vacíos ni fascinación ciega. Aprendemos a calibrar prompts con precisión y ética.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 text-xs text-[#5e48d5] font-mono font-bold">
              ✦ Desmitificación + Prompts calibrados
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#dedbd3] shadow-xs hover:border-[#111111] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                  Pilar 03
                </span>
                <h3 className="text-lg font-black text-[#111111]">
                  Co-creación comunitaria
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Nadie crea en solitario. La obra se enriquece cuando quien escribe se cruza con quien sonoriza, ilustra o programa, activando una red solidaria de creadores.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 text-xs text-emerald-700 font-mono font-bold">
              ✦ Saberes complementarios + Red viva
            </div>
          </div>
        </div>

        {/* Process photo banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <div className="rounded-3xl overflow-hidden border-2 border-stone-200 relative group h-56 sm:h-64 shadow-xs">
            <img
              src="/src/assets/images/manos_creador_proceso_1794090700159.jpg"
              alt="Proceso de calibración de prompts y notas en Medellín"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="font-mono text-[10px] text-[#f8c300] uppercase tracking-wider font-bold">
                Metodología del Taller
              </span>
              <h4 className="font-black text-sm sm:text-base">
                De la anécdota y la memoria analógica al prompt calibrado
              </h4>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border-2 border-stone-200 relative group h-56 sm:h-64 shadow-xs">
            <img
              src="/src/assets/images/comunidad_conversacion_taller_1794090700467.jpg"
              alt="Conversación colectiva entre creadores en Casa de Cultura"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="font-mono text-[10px] text-[#f8c300] uppercase tracking-wider font-bold">
                Red Comunitaria
              </span>
              <h4 className="font-black text-sm sm:text-base">
                Cruce de saberes: sonido, letras, memoria y artes plásticas
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LA RUTA DE LA MAÑANA: 4 MOMENTOS */}
      <section className="bg-white rounded-3xl border-2 border-[#dedbd3] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-[#5e48d5] uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5" />
              Agenda de la Jornada Presencial
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
              La Ruta de la Mañana: 4 Momentos
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Una jornada viva estructurada de 9:00 a 12:30 donde pasamos de la conversación inicial al prototipo tangible exhibible.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProjector}
              className="px-4 py-2 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
              title="Abrir proyector en pantalla completa con temporizador"
            >
              <Tv className="w-4 h-4" />
              <span>Abrir Modo Proyector</span>
            </button>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKSHOP_STEPS.map((step: WorkshopStep, index: number) => {
            const isActive = index === activeMomentIndex;
            return (
              <div
                key={step.num}
                onClick={() => setActiveMomentIndex(index)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative text-left flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#111111] text-white border-[#111111] shadow-md -translate-y-1'
                    : 'bg-[#faf9f6] hover:bg-white border-stone-200 hover:border-stone-400 text-[#111111]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                        isActive ? 'bg-[#f8c300] text-[#111111]' : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {step.num}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isActive ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {step.time}
                    </span>
                  </div>

                  <h3 className="text-base font-black mb-1.5 leading-snug">
                    {step.title}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-4 ${
                    isActive ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {step.desc}
                  </p>
                </div>

                <div className={`pt-3 border-t text-[11px] font-mono ${
                  isActive ? 'border-stone-800 text-[#f8c300]' : 'border-stone-200 text-stone-700'
                }`}>
                  <span className="font-bold">Objetivo:</span> {step.objective}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#fcfbf9] border border-stone-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Haz clic en cualquiera de los 4 momentos para revisarlo en el proyector de sala.</span>
          </div>
          <span className="font-mono text-stone-500">
            Momento seleccionado: <strong className="text-stone-900">{WORKSHOP_STEPS[activeMomentIndex].title}</strong>
          </span>
        </div>
      </section>

      {/* 4. PLANEACIÓN COMPLETA DEL CURSO CON LOGOS DE APPS (CASA DE CULTURA LOS COLORES) */}
      <section className="bg-white rounded-3xl border-2 border-[#dedbd3] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-[#5e48d5] uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            Curriculum Oficial · 5 Sesiones Presenciales
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            Planeación del Taller en Casa de Cultura Los Colores
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
            Diseñado y facilitado por <strong>Manuel Palacio</strong> para la Alcaldía de Medellín y Núcleo Colectivo. Consulta la progresión pedagógica y las herramientas sugeridas para cada clase.
          </p>
        </div>

        {/* Tab selector for the 5 classes */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {WORKSHOP_CLASSES.map((cls, idx) => {
            const isSelected = idx === selectedClassIndex;
            return (
              <button
                key={cls.number}
                onClick={() => setSelectedClassIndex(idx)}
                className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] text-[#f8c300] shadow-md ring-2 ring-[#f8c300]/50'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                  isSelected ? 'bg-[#f8c300] text-[#111111]' : 'bg-stone-300 text-stone-800'
                }`}>
                  {cls.number}
                </span>
                <span>Clase {cls.number}: {cls.title.split(' ')[0]}...</span>
                <span className="text-[10px] font-mono opacity-70">({cls.duration})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Class Detail Box */}
        <div className="bg-[#faf9f6] rounded-2xl border-2 border-stone-300 p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-[#111111] text-[#f8c300] font-mono font-black text-xs">
                  CLASE 0{selectedClass.number}
                </span>
                <span className="text-xs font-mono font-bold text-stone-500">
                  Duración: {selectedClass.duration}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
                {selectedClass.title}
              </h3>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-xl border border-stone-200 shrink-0">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                Entregable Esperado:
              </span>
              <strong className="text-xs text-stone-900 block mt-0.5">
                {selectedClass.deliverable}
              </strong>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-black text-stone-900 uppercase tracking-wider block">
              Propósito Pedagógico:
            </span>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-stone-200">
              {selectedClass.goal}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-black text-stone-900 uppercase tracking-wider block">
              Actividades y Dinámicas de la Sesión:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {selectedClass.activities.map((act, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5 leading-snug"
                >
                  <span className="w-5 h-5 rounded-full bg-[#f8c300] text-[#111111] font-mono font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {i + 1}
                  </span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended tools with authentic brand logos */}
          <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                Herramientas recomendadas para esta clase:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {selectedClass.toolsRecommended.map((toolName) => (
                  <div
                    key={toolName}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-stone-200 text-xs font-bold text-[#111111] shadow-2xs"
                  >
                    <ToolLogo name={toolName} size="xs" />
                    <span>{toolName}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigateSection('herramientas')}
              className="px-4 py-2.5 bg-[#111111] hover:bg-stone-800 text-[#f8c300] font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Abrir Catálogo de Herramientas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. MUESTRA FINAL & CHECKLIST ÉTICO DE AUTORÍA CON IMAGEN DE EXPOSICIÓN */}
      <section className="bg-[#111111] text-white rounded-3xl border-2 border-stone-800 p-6 sm:p-8 shadow-sm space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-[#f8c300] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Ética, Autoría Consciente y Comunidad
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              7 Preguntas de Revisión Crítica antes de Publicar
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              De la <em>Biblioteca de Prompts de Núcleo Colectivo</em>. Utiliza esta lista de chequeo antes de registrar una imagen, video o texto como entregable en la vitrina del taller.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-700 shadow-md">
              <img
                src="/src/assets/images/muestra_arte_interactivo_1794090699241.jpg"
                alt="Instalación interactiva comunitaria con cerámica y fibra óptica"
                className="w-full h-44 sm:h-52 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-mono text-[#f8c300] font-bold">
                  Vitrina Comunitaria · Casa de Cultura
                </span>
                <p className="text-xs font-bold leading-tight">
                  Cerámica tradicional, memoria oral y visuales interactivos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ETHICAL_QUESTIONS.map((item, idx) => {
            const isChecked = !!checkedQuestions[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleQuestion(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isChecked
                    ? 'bg-stone-900 border-[#f8c300] text-white'
                    : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800 text-stone-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-bold transition-all ${
                  isChecked
                    ? 'bg-[#f8c300] text-[#111111]'
                    : 'border border-stone-700 text-transparent'
                }`}>
                  {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-[#f8c300]' : 'text-white'}`}>
                    {item.q}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300 font-mono">
          <span>
            Preguntas revisadas: <strong className="text-[#f8c300]">{Object.values(checkedQuestions).filter(Boolean).length} de 7</strong>
          </span>
          <span className="text-stone-400">
            "La inteligencia artificial es un pincel, no el artista ni el territorio."
          </span>
        </div>
      </section>

      {/* 6. PIE DE NAVEGACIÓN HACIA LA SIGUIENTE SECCIÓN */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#111111] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <span className="text-xs font-mono font-black text-[#7656ff] uppercase tracking-wider block">
            Listo para empezar:
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#111111]">
            ¿Tienes clara la intención? Explora las herramientas por tema
          </h3>
          <p className="text-xs text-stone-600">
            Descubre 9 categorías con logos auténticos: Texto, Imagen, Video, Sonido, 3D, Código, Productividad, Prototipado y Agentes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateSection('herramientas')}
            className="px-6 py-3.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <span>Ir a Herramientas IA (Paso 02)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
