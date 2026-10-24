import React, { useState, useMemo } from 'react';
import {
  WorkshopAdvance,
  ParticipantContribution,
  COMMON_POINTS,
  OFFICIAL_WORKSHOP_URL,
  FACILITATOR_NAME,
  FACILITATOR_PHONE,
  FACILITATOR_WA_NUMBER
} from '../types';
import {
  Sparkles,
  Users,
  Palette,
  HandMetal,
  Video,
  Cpu,
  Volume2,
  MapPin,
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
  Trash2
} from 'lucide-react';

interface CoCreationAdvancesProps {
  contributions: ParticipantContribution[];
  advances: WorkshopAdvance[];
  onAddAdvance: (advance: WorkshopAdvance) => void;
  onDeleteAdvance?: (id: string | number) => void;
  onRefresh?: () => void;
}

export const CoCreationAdvances: React.FC<CoCreationAdvancesProps> = ({
  contributions,
  advances,
  onAddAdvance,
  onDeleteAdvance,
  onRefresh
}) => {
  const [selectedCommonPoint, setSelectedCommonPoint] = useState<string>('todos');
  const [filterType, setFilterType] = useState<'todos' | 'individual' | 'colectivo'>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [advanceType, setAdvanceType] = useState<'individual' | 'colectivo'>('individual');
  const [title, setTitle] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [customAuthor, setCustomAuthor] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<string[]>(['La Imagen']);
  const [individualIdea, setIndividualIdea] = useState('');
  const [collectiveIntersection, setCollectiveIntersection] = useState('');
  const [milestone, setMilestone] = useState('');
  const [status, setStatus] = useState<'boceto' | 'prototipo' | 'pruebas' | 'listo'>('prototipo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Map icon component helper
  const renderPointIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Palette':
        return <Palette className={className} />;
      case 'HandMetal':
        return <HandMetal className={className} />;
      case 'Video':
        return <Video className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Volume2':
        return <Volume2 className={className} />;
      case 'MapPin':
      default:
        return <MapPin className={className} />;
    }
  };

  // Compute how many participants belong to each common point based on their selected languages
  const commonPointStats = useMemo(() => {
    return COMMON_POINTS.map((cp) => {
      const matchingParticipants = contributions.filter((c) =>
        (c.languages || []).some((lang) => cp.relatedLanguages.includes(lang))
      );
      return {
        ...cp,
        count: matchingParticipants.length,
        participants: matchingParticipants
      };
    });
  }, [contributions]);

  // Filtered advances
  const filteredAdvances = useMemo(() => {
    return advances.filter((adv) => {
      const matchType = filterType === 'todos' || adv.type === filterType;
      const matchPoint =
        selectedCommonPoint === 'todos' ||
        (adv.commonPoints || []).some(
          (p) => p.toLowerCase() === selectedCommonPoint.toLowerCase()
        );
      return matchType && matchPoint;
    });
  }, [advances, filterType, selectedCommonPoint]);

  // Participants who match the active common point filter
  const activePointParticipants = useMemo(() => {
    if (selectedCommonPoint === 'todos') return [];
    const cp = COMMON_POINTS.find(
      (p) => p.name.toLowerCase() === selectedCommonPoint.toLowerCase()
    );
    if (!cp) return [];
    return contributions.filter((c) =>
      (c.languages || []).some((lang) => cp.relatedLanguages.includes(lang))
    );
  }, [contributions, selectedCommonPoint]);

  // Toggle author selection in form
  const toggleAuthor = (name: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Toggle point selection in form
  const togglePoint = (pointName: string) => {
    setSelectedPoints((prev) =>
      prev.includes(pointName)
        ? prev.filter((p) => p !== pointName)
        : [...prev, pointName]
    );
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor asigna un título o nombre a este avance.');
      return;
    }

    const allAuthors = [...selectedAuthors];
    if (customAuthor.trim() && !allAuthors.includes(customAuthor.trim())) {
      allAuthors.push(customAuthor.trim());
    }

    if (allAuthors.length === 0) {
      allAuthors.push(FACILITATOR_NAME);
    }

    const newAdvance: WorkshopAdvance = {
      id: `adv-${Date.now()}`,
      type: advanceType,
      title: title.trim(),
      authors: allAuthors,
      commonPoints: selectedPoints.length > 0 ? selectedPoints : ['La Imagen'],
      individualIdea: individualIdea.trim() || 'Exploración inicial a partir de intereses disciplinares.',
      collectiveIntersection:
        advanceType === 'colectivo' ? collectiveIntersection.trim() : undefined,
      milestone: milestone.trim() || 'Avance documentado durante la sesión del laboratorio.',
      status,
      mediaUrl: mediaUrl.trim() || OFFICIAL_WORKSHOP_URL,
      createdAt: new Date().toISOString()
    };

    onAddAdvance(newAdvance);

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
Puntos en común: ${adv.commonPoints.join(', ')}
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

## 1. Puntos en Común Detectados en el Taller
${COMMON_POINTS.map((cp) => {
  const match = contributions.filter((c) =>
    (c.languages || []).some((l) => cp.relatedLanguages.includes(l))
  );
  return `### ✦ ${cp.name} (${match.length} creadores conectados)
- **Descripción:** ${cp.description}
- **Creadores en este nodo:** ${match.map((m) => m.name || m.alias).join(', ') || 'Pendientes por sumar'}
`;
}).join('\n')}

---

## 2. Bitácora de Avances Colectivos (Alianzas y Puntos de Encuentro)
${
  advances.filter((a) => a.type === 'colectivo').length === 0
    ? '_Aún no se han consolidado avances colectivos._'
    : advances
        .filter((a) => a.type === 'colectivo')
        .map(
          (a, i) => `### 🤝 [Avance Colectivo ${i + 1}] ${a.title}
- **Creadores:** ${a.authors.join(', ')}
- **Puntos en Común:** ${a.commonPoints.join(' · ')}
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

## 3. Bitácora de Avances Individuales (Desde la propia idea e interés)
${
  advances.filter((a) => a.type === 'individual').length === 0
    ? '_Aún no se han registrado avances individuales._'
    : advances
        .filter((a) => a.type === 'individual')
        .map(
          (a, i) => `### 👤 [Avance Individual ${i + 1}] ${a.title}
- **Autor/a:** ${a.authors.join(', ')}
- **Puntos en Común:** ${a.commonPoints.join(' · ')}
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
      return `${i + 1}. *[${badge}] ${a.title}*\n- Autores: ${a.authors.join(', ')}\n- Puntos en común: ${a.commonPoints.join(', ')}\n- Hito: ${a.milestone}\n- Estado: ${a.status}`;
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
            Paso 04 · Co-creación y Puntos de Encuentro
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            04. Unir ideas y avances colectivos
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-2xl">
            Cada participante parte de <strong>su propia idea e interés</strong>, pero encontramos puntos en común (la imagen, lo interactivo, el video...) para lograr <strong>avances individuales y colectivos</strong> que reflejamos en el repositorio vivo.
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
              Aquí se integran las ideas individuales de cada creador con los avances colaborativos de la jornada.
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

      {/* FORM TO ADD NEW ADVANCE (ACCORDION / MODAL) */}
      {isFormOpen && (
        <div className="mb-8 p-6 sm:p-8 bg-white rounded-3xl border-2 border-[#7656ff] shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7656ff]">
                Registro de Bitácora Viva
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
                🤝 Avance Colectivo
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
                    ? 'Ej.: Boceto de personajes animados para microvideo'
                    : 'Ej.: Alianza Imagen + Código Sonoro: Fanzine reactivo del río'
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

            {/* Common points tags */}
            <div>
              <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                Puntos en común que conecta este trabajo
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_POINTS.map((cp) => {
                  const isSelected = selectedPoints.includes(cp.name);
                  return (
                    <button
                      type="button"
                      key={cp.id}
                      onClick={() => togglePoint(cp.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-[#eee9ff] text-[#5e48d5] border-[#7656ff] ring-1 ring-[#7656ff]'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {renderPointIcon(cp.iconName, 'w-3 h-3')}
                      <span>{cp.name}</span>
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
                    placeholder="¿En qué punto convergieron las ideas y cómo se complementan?"
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
                  className="px-5 py-2.5 bg-[#111111] hover:bg-stone-800 text-white rounded-full text-xs font-black transition cursor-pointer shadow-sm active:scale-98"
                >
                  Guardar y publicar avance
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* COMMON POINTS MATRICES (THE BRIDGES) */}
      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4 mb-6">
          <div>
            <span className="text-xs font-black uppercase text-[#7656ff]">
              Intersecciones Detectadas
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#111111]">
              Puntos en común entre las ideas del grupo
            </h3>
          </div>
          <p className="text-xs text-stone-500 max-w-sm">
            Haz clic en un eje para ver quiénes comparten este medio expresivo y qué ideas pueden cruzarse.
          </p>
        </div>

        {/* Common Points Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {commonPointStats.map((cp) => {
            const isSelected = selectedCommonPoint === cp.name;
            return (
              <button
                key={cp.id}
                onClick={() =>
                  setSelectedCommonPoint(isSelected ? 'todos' : cp.name)
                }
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'border-[#7656ff] bg-[#f5f2ff] ring-2 ring-[#7656ff]/30 shadow-xs'
                    : 'border-[#dedbd3] bg-[#faf9f6] hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: cp.color }}
                    >
                      {renderPointIcon(cp.iconName, 'w-3.5 h-3.5')}
                    </div>
                    <span className="text-[11px] font-mono font-black px-1.5 py-0.5 rounded-full bg-white text-stone-800 border border-stone-200">
                      {cp.count}
                    </span>
                  </div>
                  <strong className="text-xs font-black text-[#111111] block leading-tight">
                    {cp.name}
                  </strong>
                  <span className="text-[10px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                    {cp.description}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 text-[10px] font-bold text-[#5e48d5] flex items-center justify-between">
                  <span>{isSelected ? 'Filtrando' : 'Ver cruces'}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Common Point Detail Box */}
        {selectedCommonPoint !== 'todos' && activePointParticipants.length > 0 && (
          <div className="mt-6 p-5 rounded-2xl bg-[#faf9f6] border border-stone-200">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#7656ff]">
                  Punto de Convergencia:
                </span>
                <strong className="text-sm font-black text-[#111111]">
                  {selectedCommonPoint}
                </strong>
                <span className="px-2 py-0.5 rounded-full bg-white border border-stone-300 text-[11px] font-bold text-stone-700">
                  {activePointParticipants.length} creadores conectados
                </span>
              </div>
              <button
                onClick={() => setSelectedCommonPoint('todos')}
                className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
              >
                Quitar filtro
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activePointParticipants.map((p) => (
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
                ¿Quieres generar un avance colaborativo con este grupo?
              </span>
              <button
                onClick={() => {
                  setAdvanceType('colectivo');
                  setSelectedAuthors(
                    activePointParticipants.map((p) => p.name || p.alias)
                  );
                  setSelectedPoints([selectedCommonPoint]);
                  setTitle(`Cruce en torno a ${selectedCommonPoint}`);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7656ff] hover:bg-[#6847ea] text-white rounded-full text-xs font-bold transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Crear avance colaborativo con este punto en común</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADVANCES WALL: INDIVIDUAL AND COLLECTIVE */}
      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
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

                    {/* Common Points Badges */}
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
                    <div className="text-xs text-stone-800 mb-2 leading-relaxed">
                      <strong className="text-stone-900 font-bold block mb-0.5">
                        Hito alcanzado:
                      </strong>
                      <p>{adv.milestone}</p>
                    </div>
                  </div>

                  {/* Footer with repo URL & date */}
                  <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between flex-wrap gap-2 text-xs">
                    {adv.mediaUrl ? (
                      <a
                        href={adv.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5e48d5] hover:underline"
                      >
                        <span>Ver en repositorio</span>
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
