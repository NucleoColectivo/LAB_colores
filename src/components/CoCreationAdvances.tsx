import React, { useState, useMemo } from 'react';
import {
  WorkshopAdvance,
  ParticipantContribution,
  WORKSHOP_THEMATIC_AXES,
  WorkshopThematicAxis,
  CreativeSpark,
  OFFICIAL_WORKSHOP_URL,
  FACILITATOR_NAME,
  FACILITATOR_PHONE,
  FACILITATOR_WA_NUMBER
} from '../types';
import { generateCreativeSpark } from '../utils/sparkGenerator';
import { SparkModal } from './SparkModal';
import {
  Sparkles,
  Users,
  Palette,
  HandMetal,
  Video,
  Film,
  Camera,
  Code2,
  Scissors,
  Activity,
  Leaf,
  GraduationCap,
  ExternalLink,
  PlusCircle,
  FileText,
  MessageCircle,
  Download,
  Share2,
  Check,
  Tag,
  ArrowRight,
  GitBranch,
  Layers,
  CheckCircle2,
  Clock,
  Trash2,
  Zap,
  Bell
} from 'lucide-react';

interface CoCreationAdvancesProps {
  contributions: ParticipantContribution[];
  advances: WorkshopAdvance[];
  onAddAdvance: (advance: WorkshopAdvance) => void;
  onDeleteAdvance?: (id: string | number) => void;
  onRefresh?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
}

export const CoCreationAdvances: React.FC<CoCreationAdvancesProps> = ({
  contributions,
  advances,
  onAddAdvance,
  onDeleteAdvance,
  onRefresh,
  onOpenNotifications,
  unreadNotificationCount = 0
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [filterType, setFilterType] = useState<'todos' | 'individual' | 'colectivo'>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Spark modal state
  const [isSparkOpen, setIsSparkOpen] = useState(false);
  const [currentSpark, setCurrentSpark] = useState<CreativeSpark | null>(null);
  const [sparkSourceTitle, setSparkSourceTitle] = useState<string>('');
  const [sparkSourceContext, setSparkSourceContext] = useState<string>('');

  // Form states
  const [advanceType, setAdvanceType] = useState<'individual' | 'colectivo'>('colectivo');
  const [title, setTitle] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [customAuthor, setCustomAuthor] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Imagen', 'Interactivo']);
  const [individualIdea, setIndividualIdea] = useState('');
  const [collectiveIntersection, setCollectiveIntersection] = useState('');
  const [milestone, setMilestone] = useState('');
  const [status, setStatus] = useState<'boceto' | 'prototipo' | 'pruebas' | 'listo'>('prototipo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper to render icon for the 10 thematic categories
  const renderCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Palette':
        return <Palette className={className} />;
      case 'HandMetal':
        return <HandMetal className={className} />;
      case 'Video':
        return <Video className={className} />;
      case 'Film':
        return <Film className={className} />;
      case 'Camera':
        return <Camera className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Leaf':
        return <Leaf className={className} />;
      case 'GraduationCap':
      default:
        return <GraduationCap className={className} />;
    }
  };

  // Compute participant count per category
  const categoryStats = useMemo(() => {
    return WORKSHOP_THEMATIC_AXES.map((axis) => {
      const matchingParticipants = contributions.filter((c) =>
        (c.languages || []).some(
          (lang) =>
            lang.toLowerCase().includes(axis.name.toLowerCase()) ||
            axis.name.toLowerCase().includes(lang.toLowerCase())
        )
      );
      return {
        ...axis,
        count: matchingParticipants.length,
        participants: matchingParticipants
      };
    });
  }, [contributions]);

  // Filtered advances
  const filteredAdvances = useMemo(() => {
    return advances.filter((adv) => {
      const matchType = filterType === 'todos' || adv.type === filterType;
      const matchCategory =
        selectedCategory === 'todos' ||
        (adv.commonPoints || []).some(
          (p) => p.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                 selectedCategory.toLowerCase().includes(p.toLowerCase())
        );
      return matchType && matchCategory;
    });
  }, [advances, filterType, selectedCategory]);

  // Participants matching active category filter
  const activeCategoryParticipants = useMemo(() => {
    if (selectedCategory === 'todos') return [];
    const axis = WORKSHOP_THEMATIC_AXES.find(
      (a) => a.name.toLowerCase() === selectedCategory.toLowerCase()
    );
    if (!axis) return [];
    return contributions.filter((c) =>
      (c.languages || []).some(
        (lang) =>
          lang.toLowerCase().includes(axis.name.toLowerCase()) ||
          axis.name.toLowerCase().includes(lang.toLowerCase())
      )
    );
  }, [contributions, selectedCategory]);

  // Toggle author selection in form
  const toggleAuthor = (name: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Toggle category selection in form
  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((p) => p !== catName)
        : [...prev, catName]
    );
  };

  // Trigger spark for a specific category
  const triggerCategorySpark = (axis: WorkshopThematicAxis) => {
    const participants = contributions.filter((c) =>
      (c.languages || []).some((l) => l.toLowerCase().includes(axis.name.toLowerCase()))
    );
    const authorNames = participants.map((p) => p.name || p.alias);

    const spark = generateCreativeSpark({
      title: `Chispa de ${axis.name}`,
      categories: [axis.name],
      individualIdea: `Exploración creativa desde ${axis.name} y sus posibilidades técnicas.`,
      collectiveIntersection: `Crear un prototipo de 15 minutos articulando ${axis.shortDesc}.`,
      authors: authorNames
    });

    setCurrentSpark(spark);
    setSparkSourceTitle(`Categoría: ${axis.name}`);
    setSparkSourceContext(`${participants.length} participantes con afinidad en ${axis.name}`);
    setIsSparkOpen(true);
  };

  // Trigger spark for an existing advance
  const triggerAdvanceSpark = (adv: WorkshopAdvance) => {
    const spark = generateCreativeSpark({
      title: adv.title,
      categories: adv.commonPoints || ['Imagen', 'Interactivo'],
      individualIdea: adv.individualIdea,
      collectiveIntersection: adv.collectiveIntersection,
      authors: adv.authors
    });

    setCurrentSpark(spark);
    setSparkSourceTitle(adv.title);
    setSparkSourceContext(`Avance Colectivo de ${adv.authors.join(', ')}`);
    setIsSparkOpen(true);
  };

  // Handle Form Submission with AUTOMATIC SPARK TRIGGER for collective advances
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor escribe un título para este avance.');
      return;
    }

    const allAuthors = [...selectedAuthors];
    if (customAuthor.trim() && !allAuthors.includes(customAuthor.trim())) {
      allAuthors.push(customAuthor.trim());
    }
    if (allAuthors.length === 0) {
      allAuthors.push(FACILITATOR_NAME);
    }

    const finalCategories =
      selectedCategories.length > 0 ? selectedCategories : ['Imagen', 'Interactivo'];

    const newAdvance: WorkshopAdvance = {
      id: `adv-${Date.now()}`,
      type: advanceType,
      title: title.trim(),
      authors: allAuthors,
      commonPoints: finalCategories,
      individualIdea:
        individualIdea.trim() || 'Inquietud disciplinar de partida planteada en el taller.',
      collectiveIntersection:
        advanceType === 'colectivo' ? collectiveIntersection.trim() : undefined,
      milestone: milestone.trim() || 'Avance documentado durante la sesión del laboratorio.',
      status,
      mediaUrl: mediaUrl.trim() || OFFICIAL_WORKSHOP_URL,
      createdAt: new Date().toISOString()
    };

    onAddAdvance(newAdvance);

    // AUTOMATIC TRIGGER: If collective advance, open the 15-minute spark immediately!
    if (advanceType === 'colectivo') {
      const spark = generateCreativeSpark({
        title: newAdvance.title,
        categories: finalCategories,
        individualIdea: newAdvance.individualIdea,
        collectiveIntersection: newAdvance.collectiveIntersection,
        authors: allAuthors
      });

      setCurrentSpark(spark);
      setSparkSourceTitle(newAdvance.title);
      setSparkSourceContext(`¡Avance Colectivo recién registrado!`);
      setIsSparkOpen(true);
    }

    // Reset Form
    setTitle('');
    setSelectedAuthors([]);
    setCustomAuthor('');
    setIndividualIdea('');
    setCollectiveIntersection('');
    setMilestone('');
    setMediaUrl('');
    setIsFormOpen(false);
  };

  // Copy advance summary
  const handleCopyAdvance = async (adv: WorkshopAdvance) => {
    const text = `✦ [${adv.type === 'colectivo' ? 'AVANCE COLECTIVO' : 'AVANCE INDIVIDUAL'}] ${adv.title}
Creador(es): ${adv.authors.join(', ')}
Categorías: ${adv.commonPoints.join(', ')}
Idea individual de origen: ${adv.individualIdea}
${adv.collectiveIntersection ? `Punto de encuentro / Cruce: ${adv.collectiveIntersection}\n` : ''}Hito alcanzado: ${adv.milestone}
Estado: ${adv.status.toUpperCase()}
Enlace / Repositorio: ${adv.mediaUrl || OFFICIAL_WORKSHOP_URL}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(String(adv.id));
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  // Export full markdown repository log
  const handleExportRepositoryMarkdown = () => {
    if (advances.length === 0 && contributions.length === 0) {
      alert('Aún no hay avances o participantes registrados.');
      return;
    }

    const md = `# Laboratorio de Medios Digitales e Inteligencia Artificial
## Sesión 1: Escuchar y Enfocar — Núcleo Colectivo
- **Facilitador:** ${FACILITATOR_NAME} (${FACILITATOR_PHONE})
- **Repositorio / Web del Proyecto:** [${OFFICIAL_WORKSHOP_URL}](${OFFICIAL_WORKSHOP_URL})
- **Fecha de registro:** ${new Date().toLocaleDateString('es-CO', { dateStyle: 'full' })}
- **Participantes registrados:** ${contributions.length}
- **Avances registrados hoy:** ${advances.length}

---

## 1. Categorías y Ejes Temáticos del Taller
${WORKSHOP_THEMATIC_AXES.map((axis) => {
  const match = contributions.filter((c) =>
    (c.languages || []).some((l) => l.toLowerCase().includes(axis.name.toLowerCase()))
  );
  return `### ✦ ${axis.name} (${match.length} creadores conectados)
- **Áreas:** ${axis.shortDesc}
- **Creadores en este nodo:** ${match.map((m) => m.name || m.alias).join(', ') || 'Pendientes por sumar'}
- **Prompt Runway sugerido:** ${axis.runwayKeyword}
- **Estilo Midjourney:** ${axis.midjourneyStyle}
`;
}).join('\n')}

---

## 2. Bitácora de Avances Colectivos (Alianzas y Cruces)
${
  advances.filter((a) => a.type === 'colectivo').length === 0
    ? '_Aún no se han consolidado avances colectivos._'
    : advances
        .filter((a) => a.type === 'colectivo')
        .map(
          (a, i) => `### 🤝 [Avance Colectivo ${i + 1}] ${a.title}
- **Creadores:** ${a.authors.join(', ')}
- **Categorías:** ${a.commonPoints.join(' · ')}
- **Estado:** \`${a.status.toUpperCase()}\`
- **Idea de partida:** ${a.individualIdea}
- **Punto de Encuentro / Intersección:** ${a.collectiveIntersection || 'Convergencia metodológica'}
- **Hito alcanzado:** ${a.milestone}
- **Demo / Repositorio:** ${a.mediaUrl || OFFICIAL_WORKSHOP_URL}
`
        )
        .join('\n')
}

---

## 3. Bitácora de Avances Individuales
${
  advances.filter((a) => a.type === 'individual').length === 0
    ? '_Aún no se han registrado avances individuales._'
    : advances
        .filter((a) => a.type === 'individual')
        .map(
          (a, i) => `### 👤 [Avance Individual ${i + 1}] ${a.title}
- **Autor/a:** ${a.authors.join(', ')}
- **Categorías:** ${a.commonPoints.join(' · ')}
- **Estado:** \`${a.status.toUpperCase()}\`
- **Idea / Inquietud original:** ${a.individualIdea}
- **Hito alcanzado hoy:** ${a.milestone}
- **Enlace:** ${a.mediaUrl || OFFICIAL_WORKSHOP_URL}
`
        )
        .join('\n')
}

---

## 4. Directorio de Creadores y Habeas Data
${contributions
  .map(
    (c, i) =>
      `${i + 1}. **${c.name || c.alias}** (${c.role || 'Creador/a'}) — Territorio: ${c.location || 'N/D'} | Lenguajes: ${(c.languages || []).join(', ')} | Consentimiento Habeas Data: SÍ (Manuel Palacio)`
  )
  .join('\n')}

---
_Documento generado automáticamente para sincronización con [${OFFICIAL_WORKSHOP_URL}](${OFFICIAL_WORKSHOP_URL}) y repositorio de Núcleo Colectivo._
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LAB_COLORES_BITACORA_AVANCES_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send WhatsApp summary of advances to Manuel
  const handleSendAdvancesToManuel = () => {
    if (advances.length === 0) {
      alert('Aún no hay avances registrados.');
      return;
    }

    const lines = advances.map((a, i) => {
      const badge = a.type === 'colectivo' ? '🤝 COLECTIVO' : '👤 INDIVIDUAL';
      return `${i + 1}. *[${badge}] ${a.title}*\n- Autores: ${a.authors.join(', ')}\n- Categorías: ${a.commonPoints.join(', ')}\n- Hito: ${a.milestone}\n- Estado: ${a.status}`;
    });

    const msg = `*BITÁCORA DE AVANCES · TALLER NÚCLEO COLECTIVO*\nFacilitador: ${FACILITATOR_NAME} (${FACILITATOR_PHONE})\nWeb/Repositorio: ${OFFICIAL_WORKSHOP_URL}\nTotal avances logrados: ${advances.length}\n\n${lines.join('\n\n')}`;

    window.open(`https://wa.me/${FACILITATOR_WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="co-creacion" className="py-10 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Paso 04 · Co-creación, Categorías y Chispas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            04. Unir ideas y avances colectivos
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-2xl">
            Cada participante parte de <strong>su propia idea e interés</strong>, organizados en 10 categorías clave. Al registrar un avance colectivo se activa automáticamente un <strong>disparador de prompt generativo (Runway, Midjourney o p5.js)</strong> como chispa para prototipar en los primeros 15 minutos.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isFormOpen ? 'Cerrar formulario' : 'Publicar nuevo avance'}</span>
          </button>

          <button
            onClick={handleExportRepositoryMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#111111] hover:bg-stone-800 text-white font-bold rounded-full text-xs transition shadow-xs cursor-pointer"
            title="Descargar archivo Markdown formateado para subir al repositorio de Vercel/GitHub"
          >
            <FileText className="w-3.5 h-3.5 text-[#f8c300]" />
            <span>Exportar para repositorio (.md)</span>
          </button>
        </div>
      </div>

      {/* PROMPT SUGGESTIONS NOTIFICATION BANNER */}
      <div className="mb-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#171324] via-[#1a1829] to-[#121212] border-2 border-[#7656ff]/60 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7656ff] text-white flex items-center justify-center shrink-0 shadow-md">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <strong className="text-sm sm:text-base font-black text-white">
                Sistema de Notificaciones: Prompts Generativos de Avances
              </strong>
              {unreadNotificationCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#f8c300] text-[#111111] text-[10px] font-black uppercase tracking-wider animate-pulse">
                  {unreadNotificationCount} {unreadNotificationCount === 1 ? 'nuevo aviso' : 'nuevos avisos'}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Cada avance registrado dispara sugerencias de prompts para Runway, Midjourney y p5.js adaptadas a los intereses de tu mesa de trabajo.
            </p>
          </div>
        </div>

        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7656ff] hover:bg-[#6545e8] text-white font-bold rounded-full text-xs transition cursor-pointer shrink-0 shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Ver Centro de Avisos</span>
          </button>
        )}
      </div>

      {/* REPOSITORY & VERCEL QUICK CONNECTOR BANNER */}
      <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-[#111111] text-white border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#f8c300] shrink-0 border border-white/10">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <strong className="text-sm sm:text-base font-black text-white">
                Repositorio & Web del Taller: lab-colores.vercel.app
              </strong>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                ENLACE ACTIVO
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Aquí se integran las ideas individuales de cada creador con los avances colaborativos y las chispas generativas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <a
            href={OFFICIAL_WORKSHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-xs transition cursor-pointer shadow-xs"
          >
            <span>Abrir lab-colores.vercel.app</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSendAdvancesToManuel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full text-xs transition cursor-pointer"
            title="Enviar bitácora al WhatsApp de Manuel Palacio (+57 300 610 1221)"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Enviar a Manuel</span>
          </button>
        </div>
      </div>

      {/* 10 EXPLICIT CATEGORIES WITH 15-MINUTE SPARK TRIGGERS */}
      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4 mb-6">
          <div>
            <span className="text-xs font-black uppercase text-[#7656ff] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#f8c300]" />
              <span>Grupos por Categorías · Disparadores de Prototipado</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#111111]">
              Puntos en común entre intereses (10 Ejes del Taller)
            </h3>
          </div>
          <p className="text-xs text-stone-500 max-w-md">
            Haz clic en <strong>⚡ Chispa 15 min</strong> en cualquier categoría para generar prompts inmediatos para <strong>Runway, Midjourney y p5.js</strong>.
          </p>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoryStats.map((axis) => {
            const isSelected = selectedCategory.toLowerCase() === axis.name.toLowerCase();
            return (
              <div
                key={axis.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between text-left group ${
                  isSelected
                    ? 'border-[#7656ff] bg-[#f5f2ff] ring-2 ring-[#7656ff]/30 shadow-xs'
                    : 'border-[#dedbd3] bg-[#faf9f6] hover:bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: axis.color }}
                    >
                      {renderCategoryIcon(axis.iconName, 'w-4 h-4')}
                    </div>
                    <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-full bg-white text-stone-800 border border-stone-200">
                      {axis.count} {axis.count === 1 ? 'creador' : 'creadores'}
                    </span>
                  </div>

                  <strong className="text-sm font-black text-[#111111] block leading-tight">
                    {axis.name}
                  </strong>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                    {axis.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/70 flex items-center justify-between gap-1 flex-wrap">
                  <button
                    onClick={() =>
                      setSelectedCategory(isSelected ? 'todos' : axis.name)
                    }
                    className="text-[11px] font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    {isSelected ? 'Ver todos' : 'Filtrar'}
                  </button>

                  <button
                    onClick={() => triggerCategorySpark(axis)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] text-[10px] font-black rounded-lg transition shadow-2xs cursor-pointer active:scale-95"
                    title={`Disparar chispa generativa para ${axis.name}`}
                  >
                    <Zap className="w-3 h-3 text-[#111111]" />
                    <span>Chispa 15 min</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Category Detail Box */}
        {selectedCategory !== 'todos' && activeCategoryParticipants.length > 0 && (
          <div className="mt-6 p-5 rounded-2xl bg-[#faf9f6] border border-stone-200">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#7656ff]">
                  Categoría seleccionada:
                </span>
                <strong className="text-sm font-black text-[#111111]">
                  {selectedCategory}
                </strong>
                <span className="px-2 py-0.5 rounded-full bg-white border border-stone-300 text-[11px] font-bold text-stone-700">
                  {activeCategoryParticipants.length} creadores conectados
                </span>
              </div>
              <button
                onClick={() => setSelectedCategory('todos')}
                className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
              >
                Quitar filtro
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeCategoryParticipants.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="font-black text-stone-900">
                      {p.name || p.alias}
                    </strong>
                    <span className="text-[10px] text-stone-500 font-medium">
                      {p.role}
                    </span>
                  </div>
                  {p.wish ? (
                    <p className="text-stone-600 italic text-[11px] leading-snug">
                      "{p.wish}"
                    </p>
                  ) : (
                    <p className="text-stone-400 text-[11px]">
                      Interesado en {p.themes || 'exploración interdisciplinaria'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-stone-200">
              <span className="text-xs text-stone-600">
                ¿Listos para co-crear un avance en torno a <strong>{selectedCategory}</strong>?
              </span>
              <button
                onClick={() => {
                  setAdvanceType('colectivo');
                  setSelectedAuthors(
                    activeCategoryParticipants.map((p) => p.name || p.alias)
                  );
                  setSelectedCategories([selectedCategory]);
                  setTitle(`Cruce colaborativo en ${selectedCategory}`);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7656ff] hover:bg-[#6847ea] text-white rounded-full text-xs font-black transition cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Crear avance colectivo en {selectedCategory}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FORM TO ADD NEW ADVANCE (WITH AUTOMATIC TRIGGER ON SAVE) */}
      {isFormOpen && (
        <div className="mb-8 p-6 sm:p-8 bg-white rounded-3xl border-2 border-[#7656ff] shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7656ff] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#f8c300]" />
                <span>Registro de Bitácora con Disparador Automático</span>
              </span>
              <h3 className="text-xl font-black text-[#111111]">
                Registrar un avance en el taller
              </h3>
            </div>

            {/* Type selector switch */}
            <div className="flex items-center p-1 bg-stone-100 rounded-full border border-stone-200">
              <button
                type="button"
                onClick={() => setAdvanceType('individual')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
                  advanceType === 'individual'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                👤 Avance Individual
              </button>
              <button
                type="button"
                onClick={() => setAdvanceType('colectivo')}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
                  advanceType === 'colectivo'
                    ? 'bg-[#7656ff] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🤝 Avance Colectivo (Dispara Chispa ⚡)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                Título del Avance o Prototipo *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  advanceType === 'individual'
                    ? 'Ej.: Boceto de microvideo con archivo de memoria barrial'
                    : 'Ej.: Alianza Imagen + Programación: Tapiz interactivo reactivo'
                }
                className="w-full px-4 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-sm text-[#111111] bg-stone-50/50 outline-none"
              />
            </div>

            {/* Author selection */}
            <div>
              <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                {advanceType === 'individual' ? '¿Quién realiza este avance?' : 'Creadores participantes (Alianza)'}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {contributions.map((c) => {
                  const authorName = c.name || c.alias;
                  const isSelected = selectedAuthors.includes(authorName);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleAuthor(authorName)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {authorName}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={customAuthor}
                onChange={(e) => setCustomAuthor(e.target.value)}
                placeholder="O escribe otro nombre aquí si no está en la lista..."
                className="w-full px-3 py-2 border border-[#c9c5bc] focus:border-[#7656ff] rounded-lg text-xs text-stone-800 bg-white outline-none"
              />
            </div>

            {/* Categorías (Las 10 exactas separadas) */}
            <div>
              <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                Categorías que cruza este avance (elige las que apliquen)
              </label>
              <div className="flex flex-wrap gap-2">
                {WORKSHOP_THEMATIC_AXES.map((axis) => {
                  const isSelected = selectedCategories.includes(axis.name);
                  return (
                    <button
                      type="button"
                      key={axis.id}
                      onClick={() => toggleCategory(axis.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-[#eee9ff] text-[#5e48d5] border-[#7656ff] ring-1 ring-[#7656ff]'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {renderCategoryIcon(axis.iconName, 'w-3.5 h-3.5')}
                      <span>{axis.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ideas prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                  Idea individual de partida *
                </label>
                <textarea
                  rows={2}
                  required
                  value={individualIdea}
                  onChange={(e) => setIndividualIdea(e.target.value)}
                  placeholder="¿Cuál era la idea o interés personal con el que empezó el participante?"
                  className="w-full px-3 py-2 border border-[#c9c5bc] focus:border-[#7656ff] rounded-xl text-xs text-stone-800 bg-stone-50/50 outline-none resize-none"
                />
              </div>

              {advanceType === 'colectivo' ? (
                <div>
                  <label className="block text-xs font-black uppercase text-[#7656ff] mb-1">
                    Punto de encuentro / Cruce colaborativo *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={collectiveIntersection}
                    onChange={(e) => setCollectiveIntersection(e.target.value)}
                    placeholder="¿En qué punto convergieron las ideas y qué van a prototipar juntos?"
                    className="w-full px-3 py-2 border border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs text-stone-800 bg-[#f9f8ff] outline-none resize-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                    Enlace de recurso / Demo / Repositorio (Opcional)
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://lab-colores.vercel.app/ o enlace a boceto..."
                    className="w-full px-3 py-2 border border-[#c9c5bc] focus:border-[#7656ff] rounded-xl text-xs text-stone-800 bg-stone-50/50 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Milestone Description */}
            <div>
              <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                Avance o hito alcanzado en esta sesión *
              </label>
              <textarea
                rows={2}
                required
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                placeholder="Describe qué se logró hoy: boceto preliminar, código funcional, prueba de prompts, guión, etc."
                className="w-full px-3 py-2 border border-[#c9c5bc] focus:border-[#7656ff] rounded-xl text-xs text-stone-800 bg-white outline-none resize-none"
              />
            </div>

            {/* Status and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">Estado del avance:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 bg-white outline-none"
                >
                  <option value="boceto">Boceto inicial</option>
                  <option value="prototipo">Prototipo en marcha</option>
                  <option value="pruebas">En pruebas con el grupo</option>
                  <option value="listo">Listo para compartir</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#111111] hover:bg-stone-800 text-white rounded-full text-xs font-black transition cursor-pointer shadow-sm active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 text-[#f8c300]" />
                  <span>
                    {advanceType === 'colectivo'
                      ? 'Guardar y disparar chispa ⚡'
                      : 'Guardar avance'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ADVANCES WALL: INDIVIDUAL AND COLLECTIVE */}
      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterType('todos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
                filterType === 'todos'
                  ? 'bg-[#111111] text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos los avances ({advances.length})
            </button>
            <button
              onClick={() => setFilterType('individual')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
                filterType === 'individual'
                  ? 'bg-[#111111] text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              👤 Individuales ({advances.filter((a) => a.type === 'individual').length})
            </button>
            <button
              onClick={() => setFilterType('colectivo')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
                filterType === 'colectivo'
                  ? 'bg-[#7656ff] text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              🤝 Colectivos ({advances.filter((a) => a.type === 'colectivo').length})
            </button>
          </div>

          <span className="text-xs text-stone-500">
            Mostrando {filteredAdvances.length} hitos documentados
          </span>
        </div>

        {/* Advances Grid */}
        {filteredAdvances.length === 0 ? (
          <div className="p-12 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500">
            <Layers className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <p className="font-bold text-sm text-stone-700">
              Aún no hay avances registrados con este filtro.
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Pulsa en "Publicar nuevo avance" para registrar lo que están creando individual o colectivamente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAdvances.map((adv) => {
              const isCopied = copiedId === String(adv.id);
              const isColectivo = adv.type === 'colectivo';

              return (
                <div
                  key={adv.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between text-left group shadow-2xs hover:shadow-xs ${
                    isColectivo
                      ? 'bg-gradient-to-br from-white via-[#faf8ff] to-[#f5f2ff] border-[#ded4ff]'
                      : 'bg-[#faf9f6] hover:bg-white border-[#dedbd3]'
                  }`}
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isColectivo
                            ? 'bg-[#7656ff] text-white'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {isColectivo ? '🤝 Avance Colectivo' : '👤 Avance Individual'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            adv.status === 'listo'
                              ? 'bg-emerald-100 text-emerald-800'
                              : adv.status === 'pruebas'
                              ? 'bg-sky-100 text-sky-800'
                              : adv.status === 'prototipo'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {adv.status === 'listo'
                            ? 'Listo'
                            : adv.status === 'pruebas'
                            ? 'En Pruebas'
                            : adv.status === 'prototipo'
                            ? 'Prototipo'
                            : 'Boceto'}
                        </span>

                        <button
                          onClick={() => handleCopyAdvance(adv)}
                          className="p-1 rounded-md text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition cursor-pointer"
                          title="Copiar resumen del avance"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {onDeleteAdvance && (
                          <button
                            onClick={() => onDeleteAdvance(adv.id)}
                            className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Eliminar este avance"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-black text-[#111111] mb-1.5 leading-snug">
                      {adv.title}
                    </h4>

                    {/* Authors */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-3 flex-wrap">
                      <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-bold text-stone-800">
                        {adv.authors.join(' · ')}
                      </span>
                    </div>

                    {/* Categories Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(adv.commonPoints || []).map((cp) => (
                        <span
                          key={cp}
                          className="px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-800 text-[11px] font-bold shadow-2xs"
                        >
                          {cp}
                        </span>
                      ))}
                    </div>

                    {/* Individual Origin Idea */}
                    {adv.individualIdea && (
                      <div className="mb-2 text-xs bg-white/80 p-2.5 rounded-xl border border-stone-200/80">
                        <strong className="text-stone-900 block font-bold text-[11px] mb-0.5 text-[#5e48d5]">
                          Idea individual de origen:
                        </strong>
                        <p className="text-stone-700 italic leading-snug">
                          "{adv.individualIdea}"
                        </p>
                      </div>
                    )}

                    {/* Collective Intersection / Meeting Point */}
                    {adv.collectiveIntersection && (
                      <div className="mb-2 text-xs bg-[#f4f0ff] p-2.5 rounded-xl border border-[#ded4ff]">
                        <strong className="text-[#5e48d5] block font-bold text-[11px] mb-0.5">
                          Punto en común / Cruce colectivo:
                        </strong>
                        <p className="text-stone-800 font-medium leading-snug">
                          {adv.collectiveIntersection}
                        </p>
                      </div>
                    )}

                    {/* Milestone achieved */}
                    <div className="text-xs text-stone-800 mb-3 leading-relaxed">
                      <strong className="text-stone-900 font-bold block mb-0.5">
                        Hito alcanzado:
                      </strong>
                      <p>{adv.milestone}</p>
                    </div>
                  </div>

                  {/* Footer with repo URL & Spark button */}
                  <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between flex-wrap gap-2 text-xs">
                    {/* TRIGGER SPARK BUTTON FOR THIS ADVANCE */}
                    <button
                      onClick={() => triggerAdvanceSpark(adv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-lg text-xs transition shadow-2xs cursor-pointer active:scale-95"
                      title="Abrir chispa generativa para este avance (Runway / Midjourney / p5.js)"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#111111]" />
                      <span>Chispa 15 min ⚡</span>
                    </button>

                    <div className="flex items-center gap-3">
                      {adv.mediaUrl ? (
                        <a
                          href={adv.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5e48d5] hover:underline"
                        >
                          <span>Repositorio</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-stone-400">
                          {OFFICIAL_WORKSHOP_URL}
                        </span>
                      )}

                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(adv.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SPARK MODAL (TRIGGERED AUTOMATICALLY OR ON DEMAND) */}
      <SparkModal
        isOpen={isSparkOpen}
        onClose={() => setIsSparkOpen(false)}
        spark={currentSpark}
        sourceTitle={sparkSourceTitle}
        sourceContext={sparkSourceContext}
      />
    </section>
  );
};
