import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Filter,
  ShieldCheck,
  Tag,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  HelpCircle,
  Clock,
  Flame,
  Globe,
  Code2,
  Video,
  Palette,
  Volume2,
  Box,
  FileText
} from 'lucide-react';
import { AI_TOOLS_CATALOG, WORKSHOP_TRIAL_RULES, AiTool } from '../data/aiToolsData';

interface AiToolsLibraryProps {
  onSelectToolForProject?: (toolName: string) => void;
}

export const AiToolsLibrary: React.FC<AiToolsLibraryProps> = ({
  onSelectToolForProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedCost, setSelectedCost] = useState<string>('todos');
  const [selectedPhase, setSelectedPhase] = useState<string>('todas');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [showTrialRules, setShowTrialRules] = useState(false);

  // Copy prompt helper
  const handleCopyPrompt = (toolId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(toolId);
    setTimeout(() => {
      setCopiedPromptId(null);
    }, 2200);
  };

  // Copy URL helper
  const handleCopyUrl = (toolId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(toolId);
    setTimeout(() => {
      setCopiedUrlId(null);
    }, 2000);
  };

  // Filtered tools calculation
  const filteredTools = useMemo(() => {
    return AI_TOOLS_CATALOG.filter((tool) => {
      // Category match
      if (selectedCategory !== 'todas' && tool.category !== selectedCategory) {
        return false;
      }

      // Cost match
      if (selectedCost !== 'todos' && tool.costType !== selectedCost) {
        return false;
      }

      // Phase match
      if (selectedPhase !== 'todas' && tool.phase !== selectedPhase && tool.phase !== 'todas') {
        return false;
      }

      // Search query match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const inName = tool.name.toLowerCase().includes(query);
        const inProvider = tool.provider.toLowerCase().includes(query);
        const inDesc = tool.description.toLowerCase().includes(query);
        const inWhy = tool.whyUseful.toLowerCase().includes(query);
        const inCat = tool.categoryLabel.toLowerCase().includes(query);
        const inPrompt = tool.suggestedPrompt.toLowerCase().includes(query);
        if (!inName && !inProvider && !inDesc && !inWhy && !inCat && !inPrompt) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedCost, selectedPhase]);

  // Categories list with icons and counts
  const categories = [
    { id: 'todas', label: 'Todas', icon: Sparkles, count: AI_TOOLS_CATALOG.length },
    { id: 'modelos', label: 'Modelos & Razonamiento', icon: Cpu, count: AI_TOOLS_CATALOG.filter(t => t.category === 'modelos').length },
    { id: 'codigo', label: 'Código & Web Apps', icon: Code2, count: AI_TOOLS_CATALOG.filter(t => t.category === 'codigo').length },
    { id: 'video', label: 'Video & Cine', icon: Video, count: AI_TOOLS_CATALOG.filter(t => t.category === 'video').length },
    { id: 'imagen', label: 'Imagen & Fotografía', icon: Palette, count: AI_TOOLS_CATALOG.filter(t => t.category === 'imagen').length },
    { id: 'audio', label: 'Audio & Música', icon: Volume2, count: AI_TOOLS_CATALOG.filter(t => t.category === 'audio').length },
    { id: '3d', label: '3D & Espacial', icon: Box, count: AI_TOOLS_CATALOG.filter(t => t.category === '3d').length },
    { id: 'archivo', label: 'Archivo & Investigación', icon: FileText, count: AI_TOOLS_CATALOG.filter(t => t.category === 'archivo').length },
  ];

  return (
    <section id="biblioteca-ia" className="pt-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-9 border-4 border-[#f8c300] shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-96 h-96 bg-radial from-[#f8c300]/20 via-[#7656ff]/15 to-transparent pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8c300] text-[#111111] text-xs font-mono font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Núcleo Colectivo · Directorio Abierto
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Biblioteca de <span className="text-[#f8c300]">Herramientas IA</span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Curaduría viva de plataformas de inteligencia artificial para arte, diseño, prototipado web, cine, sonido y memoria. Todas seleccionadas por ofrecer <strong>versión 100% gratuita, créditos diarios renovables o ensayos sin costo inicial</strong> para crear sin barreras financieras.
            </p>
          </div>

          {/* Quick Counter and Guide Toggle */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f8c300]/20 border border-[#f8c300]/40 flex items-center justify-center font-black text-[#f8c300] text-lg font-mono">
                {AI_TOOLS_CATALOG.length}
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase text-stone-200 block">
                  Herramientas Curadas
                </span>
                <span className="text-[11px] text-[#f8c300] font-mono">
                  Ensayos y pruebas sin costo
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowTrialRules(!showTrialRules)}
              className="px-4 py-3 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{showTrialRules ? 'Ocultar Estrategia' : 'Estrategia de Ensayos sin Costo'}</span>
              {showTrialRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Workshop Trial Strategy Guide */}
        {showTrialRules && (
          <div className="mt-6 pt-6 border-t border-stone-800 animate-in fade-in duration-200">
            <div className="bg-stone-900/90 rounded-2xl p-5 sm:p-6 border border-stone-800 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f8c300]" />
                <h3 className="text-sm font-mono font-black uppercase tracking-wider text-white">
                  Reglas de Oro para Ensayar con IA en el Taller sin Gastar:
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {WORKSHOP_TRIAL_RULES.map((rule) => (
                  <div key={rule.number} className="bg-stone-950/80 p-4 rounded-xl border border-stone-800/80 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[#f8c300] font-mono font-black text-xs px-2 py-0.5 rounded bg-stone-900 border border-stone-800">
                        {rule.number}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {rule.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-300 leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search & Multi-Filters Toolbar */}
        <div className="mt-8 pt-6 border-t border-stone-800 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, herramienta (ChatGPT, Flow, Gemini, Bolt, Kling, Suno...) o palabras clave (video, audio, código, gratis)..."
              className="w-full bg-stone-900/90 border border-stone-700/80 rounded-2xl pl-11 pr-24 py-3.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f8c300] focus:border-transparent font-medium shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs text-stone-400 hover:text-white bg-stone-800 rounded-lg cursor-pointer transition font-mono"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Secondary filter selectors (Cost and Phase) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Cost Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-stone-400 font-bold uppercase text-[11px] mr-1">Costo:</span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'gratis', label: '100% Gratis' },
                { id: 'creditos', label: 'Créditos Diarios' },
                { id: 'freemium', label: 'Freemium / Ensayos' },
                { id: 'bajo_costo', label: 'Bajo Costo' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCost(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    selectedCost === c.id
                      ? 'bg-[#f8c300] text-[#111111] shadow-xs'
                      : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Phase Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-stone-400 font-bold uppercase text-[11px] mr-1">Fase:</span>
              {[
                { id: 'todas', label: 'Todas las Fases' },
                { id: 'exploracion', label: '01 · Exploración' },
                { id: 'produccion', label: '02 · Producción' },
                { id: 'integracion', label: '03 · Integración' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhase(p.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    selectedPhase === p.id
                      ? 'bg-[#7656ff] text-white shadow-xs'
                      : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto scrollbar-none text-xs font-mono font-bold">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-white text-[#111111] shadow-md ring-2 ring-[#f8c300]'
                      : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#111111]' : 'text-[#f8c300]'}`} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#111111] text-white' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-[#55524d]">
        <div className="flex items-center gap-2">
          <span>Mostrando <strong>{filteredTools.length}</strong> de {AI_TOOLS_CATALOG.length} herramientas</span>
          {(selectedCategory !== 'todas' || selectedCost !== 'todos' || selectedPhase !== 'todas' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSelectedCost('todos');
                setSelectedPhase('todas');
                setSearchQuery('');
              }}
              className="text-[#7656ff] hover:underline cursor-pointer font-bold ml-2"
            >
              Resetear filtros
            </button>
          )}
        </div>
        <span className="hidden sm:inline text-stone-500">
          Haz clic en "Copiar Prompt" para probar de inmediato en la plataforma
        </span>
      </div>

      {/* Grid of AI Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => {
          const isPromptCopied = copiedPromptId === tool.id;
          const isUrlCopied = copiedUrlId === tool.id;

          return (
            <div
              key={tool.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-lg relative group ${
                tool.featured
                  ? 'border-[#f8c300] ring-1 ring-[#f8c300]/40'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              {/* Card Top: Badges and Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                      {tool.provider}
                    </span>
                    <h3 className="text-xl font-black text-[#111111] tracking-tight group-hover:text-[#7656ff] transition-colors">
                      {tool.name}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border shadow-2xs whitespace-nowrap"
                      style={{
                        backgroundColor: `${tool.costBadgeColor}15`,
                        color: tool.costBadgeColor,
                        borderColor: `${tool.costBadgeColor}40`
                      }}
                    >
                      {tool.costBadge}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                      {tool.phaseLabel}
                    </span>
                  </div>
                </div>

                {/* Category & Workshop tested indicator */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                    <Tag className="w-3 h-3 text-[#7656ff]" />
                    {tool.categoryLabel}
                  </span>
                  {tool.testedInWorkshop && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Probado en taller
                    </span>
                  )}
                  {tool.featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Recomendado
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  {tool.description}
                </p>

                {/* Why useful for the workshop */}
                <div className="bg-[#fcfbf9] border border-stone-200/80 rounded-xl p-3 text-xs space-y-1">
                  <span className="text-[10px] font-mono font-black uppercase text-[#7656ff] block">
                    ¿Por qué sirve para el proyecto?
                  </span>
                  <p className="text-stone-700 text-[11px] leading-snug">
                    {tool.whyUseful}
                  </p>
                </div>

                {/* Free trial strategy tip */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-mono font-black uppercase text-amber-900">
                    <Zap className="w-3 h-3 text-amber-600" />
                    <span>¿Cómo ensayar sin pagar?</span>
                  </div>
                  <p className="text-stone-700 text-[11px] leading-snug">
                    {tool.trialTip}
                  </p>
                </div>

                {/* Prompt de ensayo listo para copiar */}
                <div className="bg-stone-900 text-stone-200 rounded-xl p-3 text-xs space-y-2 border border-stone-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-black uppercase text-[#f8c300] flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      Prompt de Ensayo Listo
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(tool.id, tool.suggestedPrompt)}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer ${
                        isPromptCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                      }`}
                      title="Copiar prompt al portapapeles"
                    >
                      {isPromptCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#f8c300]" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-stone-300 leading-relaxed line-clamp-3 bg-stone-950 p-2 rounded border border-stone-800 select-all">
                    {tool.suggestedPrompt}
                  </p>
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-2">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-[#111111] hover:bg-[#7656ff] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs group/btn cursor-pointer"
                >
                  <span>Probar Herramienta</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>

                <button
                  onClick={() => handleCopyUrl(tool.id, tool.url)}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition cursor-pointer border border-stone-200"
                  title="Copiar enlace de la herramienta"
                >
                  {isUrlCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>

                {onSelectToolForProject && (
                  <button
                    onClick={() => onSelectToolForProject(tool.name)}
                    className="p-2.5 bg-[#f8c300]/20 hover:bg-[#f8c300] text-[#111111] border border-[#f8c300]/60 rounded-xl text-xs font-bold transition cursor-pointer"
                    title="Vincular herramienta a mi proyecto activo"
                  >
                    + Proyecto
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-stone-200 max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#111111]">
              No encontramos herramientas con esos filtros
            </h3>
            <p className="text-xs text-stone-500">
              Prueba cambiando la categoría, el tipo de costo o borrando el término de búsqueda.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todas');
              setSelectedCost('todos');
              setSelectedPhase('todas');
            }}
            className="px-4 py-2 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}
    </section>
  );
};
