import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  FolderKanban,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
  Zap,
  ExternalLink,
  Plus,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Target
} from 'lucide-react';
import { CreativeProject, CreativeToolId, RecommendedRoute, GeneratedOutput, FichaProyecto, EstadoFicha, ESTADO_FICHA_CONFIG } from '../../types/creativeSystem';
import { CREATIVE_TOOLS, DEFAULT_PROJECT_TEMPLATE } from '../../utils/creativeCatalogData';
import { calculateProjectProgress } from '../../utils/creativeProgress';
import { CreativeRouteExplorer } from './CreativeRouteExplorer';
import { CreativeCatalog } from './CreativeCatalog';
import { ProjectWorkspace } from './ProjectWorkspace';
import { MasterPromptsLibrary } from './MasterPromptsLibrary';
import { CreativeAiEcosystem } from './CreativeAiEcosystem';
import { IntentionAssistant, FICHAS_STORAGE_KEY, ACTIVE_FICHA_ID_KEY } from './IntentionAssistant';
import { ToolModal } from './ToolModal';

const PROJECT_STORAGE_KEY = 'nucleo-lab-creative-project-v1';

interface CreativeSystemSectionProps {
  onAddAdvance?: (advance: any) => void;
  onOpenNotifications?: () => void;
}

export const CreativeSystemSection: React.FC<CreativeSystemSectionProps> = ({
  onAddAdvance,
  onOpenNotifications
}) => {
  // Load active Ficha de Proyecto from localStorage as initial context if available
  const [project, setProject] = useState<CreativeProject>(() => {
    let activeFicha: FichaProyecto | null = null;
    try {
      const fichasRaw = localStorage.getItem(FICHAS_STORAGE_KEY);
      if (fichasRaw) {
        const parsed: FichaProyecto[] = JSON.parse(fichasRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const activeId = localStorage.getItem(ACTIVE_FICHA_ID_KEY);
          activeFicha = parsed.find((f) => f.id === activeId) || parsed[0];
        }
      }
    } catch (e) {
      console.warn('Error reading active ficha from localStorage', e);
    }

    let savedProject: CreativeProject | null = null;
    try {
      const local = localStorage.getItem(PROJECT_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.title) {
          savedProject = parsed;
        }
      }
    } catch {}

    const baseProject = savedProject || DEFAULT_PROJECT_TEMPLATE;

    if (activeFicha) {
      return {
        ...baseProject,
        title: activeFicha.title || baseProject.title,
        author: activeFicha.author || baseProject.author || 'Manuel Palacio',
        intention: activeFicha.intention || baseProject.intention,
        guidingQuestion: activeFicha.guidingQuestion || baseProject.guidingQuestion,
        context: activeFicha.context || baseProject.context,
        targetAudience: activeFicha.targetAudience || baseProject.targetAudience,
        resources: activeFicha.resources || baseProject.resources,
        desiredResult: activeFicha.desiredResult || baseProject.desiredResult,
        fichaStatus: activeFicha.estado || baseProject.fichaStatus || 'exploracion',
        activeTools: activeFicha.recommendedTools && activeFicha.recommendedTools.length > 0
          ? Array.from(new Set([...activeFicha.recommendedTools, ...baseProject.activeTools]))
          : baseProject.activeTools,
        updatedAt: activeFicha.updatedAt || baseProject.updatedAt || new Date().toISOString()
      };
    }

    return baseProject;
  });

  const [estadoFicha, setEstadoFicha] = useState<EstadoFicha>(() => project.fichaStatus || 'exploracion');
  const [activeTab, setActiveTab] = useState<'intention' | 'workspace' | 'routes' | 'catalog' | 'library' | 'ecosystem'>('workspace');
  const [selectedToolId, setSelectedToolId] = useState<CreativeToolId | null>(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [showProgressChecklist, setShowProgressChecklist] = useState(false);

  // Calculate percentage progress of deliverables dynamically
  const stageProgress = useMemo(() => {
    return calculateProjectProgress(project, estadoFicha);
  }, [project, estadoFicha]);

  // Sync with server on initial mount
  useEffect(() => {
    const fetchProjectFromServer = async () => {
      try {
        const res = await fetch('/api/creative-system/project');
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            // Check if active ficha exists in local storage
            const fichasRaw = localStorage.getItem(FICHAS_STORAGE_KEY);
            if (fichasRaw) {
              const parsed: FichaProyecto[] = JSON.parse(fichasRaw);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const activeId = localStorage.getItem(ACTIVE_FICHA_ID_KEY);
                const activeFicha = parsed.find((f) => f.id === activeId) || parsed[0];
                if (activeFicha) {
                  const merged = {
                    ...data,
                    title: activeFicha.title || data.title,
                    author: activeFicha.author || data.author,
                    intention: activeFicha.intention || data.intention,
                    guidingQuestion: activeFicha.guidingQuestion || data.guidingQuestion,
                    context: activeFicha.context || data.context,
                    targetAudience: activeFicha.targetAudience || data.targetAudience,
                    resources: activeFicha.resources || data.resources,
                    desiredResult: activeFicha.desiredResult || data.desiredResult,
                    fichaStatus: activeFicha.estado || data.fichaStatus || 'exploracion'
                  };
                  setProject(merged);
                  setEstadoFicha(activeFicha.estado || 'exploracion');
                  return;
                }
              }
            }
            setProject(data);
            if (data.fichaStatus) {
              setEstadoFicha(data.fichaStatus);
            }
            try {
              localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(data));
            } catch {}
          }
        }
      } catch (err) {
        // Fallback to local
      }
    };
    fetchProjectFromServer();
  }, []);

  const saveProject = async (updated: CreativeProject) => {
    setProject(updated);
    try {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch('/api/creative-system/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.warn('Could not sync project with server:', e);
    }
  };

  const handleChangeEstadoFicha = (newEstado: EstadoFicha) => {
    setEstadoFicha(newEstado);
    const stageMap: Record<EstadoFicha, 'comprender' | 'producir' | 'conectar'> = {
      exploracion: 'comprender',
      produccion: 'producir',
      integracion: 'conectar'
    };
    const updated: CreativeProject = {
      ...project,
      fichaStatus: newEstado,
      activeStage: stageMap[newEstado] || project.activeStage,
      updatedAt: new Date().toISOString()
    };
    saveProject(updated);

    // Also update active ficha in localStorage['nucleo-fichas-de-proyecto']
    try {
      const fichasRaw = localStorage.getItem(FICHAS_STORAGE_KEY);
      if (fichasRaw) {
        const parsed: FichaProyecto[] = JSON.parse(fichasRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const activeId = localStorage.getItem(ACTIVE_FICHA_ID_KEY) || parsed[0].id;
          const updatedFichas = parsed.map((f) => (f.id === activeId ? { ...f, estado: newEstado } : f));
          localStorage.setItem(FICHAS_STORAGE_KEY, JSON.stringify(updatedFichas));
        }
      }
    } catch (e) {
      console.warn('Could not sync estado with active ficha in localStorage', e);
    }
  };

  const handleApplyRoute = (route: RecommendedRoute) => {
    const updated: CreativeProject = {
      ...project,
      activeTools: Array.from(new Set([...project.activeTools, ...route.recommendedTools])),
      guidingQuestion: route.guidingQuestion,
      updatedAt: new Date().toISOString()
    };
    saveProject(updated);
    setActiveTab('workspace');
  };

  const handleApplyFichaToProject = (ficha: FichaProyecto) => {
    const newEstado = ficha.estado || 'exploracion';
    setEstadoFicha(newEstado);
    const stageMap: Record<EstadoFicha, 'comprender' | 'producir' | 'conectar'> = {
      exploracion: 'comprender',
      produccion: 'producir',
      integracion: 'conectar'
    };
    const updated: CreativeProject = {
      ...project,
      title: ficha.title || project.title,
      author: ficha.author || project.author,
      intention: ficha.intention || project.intention,
      guidingQuestion: ficha.guidingQuestion || project.guidingQuestion,
      context: ficha.context || project.context,
      targetAudience: ficha.targetAudience || project.targetAudience,
      resources: ficha.resources || project.resources,
      desiredResult: ficha.desiredResult || project.desiredResult,
      fichaStatus: newEstado,
      activeStage: stageMap[newEstado] || project.activeStage,
      activeTools: Array.from(new Set([...project.activeTools, ...(ficha.recommendedTools || [])])),
      updatedAt: new Date().toISOString()
    };
    saveProject(updated);
    setActiveTab('workspace');
  };

  const handleOpenTool = (toolId: CreativeToolId | string) => {
    setSelectedToolId(toolId as CreativeToolId);
    setIsToolModalOpen(true);
  };

  const handleSaveOutputToProject = (output: GeneratedOutput) => {
    const updated: CreativeProject = {
      ...project,
      generatedOutputs: [output, ...project.generatedOutputs.filter((o) => o.id !== output.id)],
      updatedAt: new Date().toISOString()
    };
    saveProject(updated);
  };

  const handleRegisterAdvanceFromTool = (title: string, idea: string, milestone: string) => {
    if (onAddAdvance) {
      onAddAdvance({
        id: `adv-${Date.now()}`,
        type: 'individual',
        title,
        authors: [project.author || 'Manuel Palacio'],
        commonPoints: ['Inteligencia Artificial', 'La Imagen', 'Lo Interactivo'],
        individualIdea: idea,
        milestone,
        status: 'prototipo',
        mediaUrl: 'https://lab-colores.vercel.app/',
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleNewProject = () => {
    const newProj: CreativeProject = {
      id: `proj-${Date.now()}`,
      title: 'Nuevo Proyecto Creativo',
      author: project.author || 'Manuel Palacio',
      intention: '',
      context: 'Taller de Medios Digitales e IA',
      targetAudience: 'Comunidad del taller',
      resources: 'Navegador web y modelos generativos',
      desiredResult: 'Prototipo visual e interactivo',
      guidingQuestion: '¿Cómo dar vida a esta idea en 15 minutos?',
      activeStage: 'comprender',
      activeTools: ['01-explorador-ideas', '02-director-arte', '03-generador-imagenes'],
      decisions: {},
      generatedOutputs: [],
      updatedAt: new Date().toISOString()
    };
    saveProject(newProj);
    setActiveTab('workspace');
  };

  const selectedToolDef = selectedToolId ? CREATIVE_TOOLS.find((t) => t.id === selectedToolId) || null : null;

  return (
    <section id="sistema-creativo" className="pt-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 border-4 border-[#f8c300] shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-radial from-[#7656ff]/25 to-transparent pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8c300] text-[#111111] text-xs font-mono font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Sistema de Creación Asistida por IA
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              De la Intención al <span className="text-[#f8c300]">Sistema Creativo</span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Para <strong>lab-colores.vercel.app</strong>: el proyecto es el centro y las herramientas son módulos que se activan según lo que el proyecto necesita. No tienes que saber de cámaras, montaje o código para empezar: expresa qué quieres hacer y recibe orientación paso a paso.
            </p>
          </div>

          {/* Quick link button to lab-colores */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <a
              href="https://lab-colores.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Visitar lab-colores.vercel.app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setActiveTab('intention')}
              className="px-4 py-2.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ Asistente de Intención</span>
            </button>

            <button
              onClick={() => handleOpenTool('01-explorador-ideas')}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-stone-700 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#f8c300]" />
              <span>Chispa Inicial (Módulo 01)</span>
            </button>
          </div>
        </div>

        {/* Selector de Estado de Ficha (Exploración, Producción, Integración) */}
        <div className="mt-6 pt-5 border-t border-stone-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8c300] animate-pulse" />
              <span className="text-xs font-mono font-black uppercase tracking-wider text-stone-200">
                Estado de Ficha · Etapa Activa del Proyecto:
              </span>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                estadoFicha === 'produccion'
                  ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40'
                  : estadoFicha === 'integracion'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              }`}>
                {ESTADO_FICHA_CONFIG[estadoFicha]?.badge}
              </span>
            </div>

            <span className="text-xs text-stone-400 font-mono">
              Filtra y adapta las herramientas sugeridas a la etapa actual
            </span>
          </div>

          {/* 3 Interactive Buttons for Estado de Ficha */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(['exploracion', 'produccion', 'integracion'] as EstadoFicha[]).map((st) => {
              const conf = ESTADO_FICHA_CONFIG[st];
              const isSelected = estadoFicha === st;
              return (
                <button
                  key={st}
                  onClick={() => handleChangeEstadoFicha(st)}
                  className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-stone-900 border-[#f8c300] ring-2 ring-[#f8c300]/50 shadow-md text-white'
                      : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black flex items-center gap-1.5">
                      <span>{st === 'exploracion' ? '🔍' : st === 'produccion' ? '⚡' : '🌐'}</span>
                      <span className={isSelected ? 'text-[#f8c300]' : 'text-stone-200'}>{conf.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {conf.tools.length} sugeridas
                    </span>
                  </div>
                  <p className="text-[11px] leading-snug text-stone-400">
                    {conf.stageLabel}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Quick horizontal tray of suggested tools for this Estado */}
          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-300 shrink-0">
              <Sparkles className="w-4 h-4 text-[#f8c300] shrink-0" />
              <span>
                Módulos sugeridos para <strong>{ESTADO_FICHA_CONFIG[estadoFicha]?.label}</strong>:
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {ESTADO_FICHA_CONFIG[estadoFicha]?.tools.map((tId) => {
                const def = CREATIVE_TOOLS.find((t) => t.id === tId);
                if (!def) return null;
                return (
                  <button
                    key={tId}
                    onClick={() => handleOpenTool(tId)}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-[#f8c300] hover:text-[#111111] text-stone-200 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 shrink-0 border border-stone-700 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: def.color }} />
                    <span>{def.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indicador de Avance Porcentual de Entregables según Estado de Ficha */}
          <div className="p-4 bg-stone-950/90 rounded-2xl border border-stone-800 space-y-3 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f8c300]/20 text-[#f8c300] flex items-center justify-center font-black text-sm border border-[#f8c300]/40 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-white">
                      Avance de Entregables: {stageProgress.label}
                    </span>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-stone-800 text-[#f8c300] border border-[#f8c300]/40">
                      {stageProgress.completedCount} de {stageProgress.totalCount} completados
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Evaluación en vivo según la intención, pregunta generadora, dirección de arte y módulos ejecutados.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <span className="text-3xl font-black text-[#f8c300] font-mono tracking-tight">
                  {stageProgress.percentage}%
                </span>
                <button
                  type="button"
                  onClick={() => setShowProgressChecklist(!showProgressChecklist)}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition border border-stone-700"
                >
                  <span>{showProgressChecklist ? 'Ocultar' : 'Ver Entregables'}</span>
                  {showProgressChecklist ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-[#f8c300]" />}
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-stone-900 rounded-full h-3.5 p-0.5 overflow-hidden border border-stone-800">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-amber-400 via-[#f8c300] to-emerald-400 shadow-sm"
                style={{ width: `${Math.max(6, stageProgress.percentage)}%` }}
              />
            </div>

            {/* Checklist items */}
            {showProgressChecklist && (
              <div className="pt-3 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-200">
                {stageProgress.checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 text-xs transition ${
                      item.completed
                        ? 'bg-emerald-950/25 border-emerald-800/50 text-stone-200'
                        : 'bg-stone-900/80 border-stone-800 text-stone-400'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <span className={`font-bold block ${item.completed ? 'text-white' : 'text-stone-300'}`}>
                          {item.label}
                        </span>
                        <p className="text-[10px] text-stone-400 leading-snug line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {item.actionToolId && !item.completed && (
                      <button
                        onClick={() => handleOpenTool(item.actionToolId!)}
                        className="px-2.5 py-1 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] rounded-lg text-[10px] font-mono font-black shrink-0 transition cursor-pointer shadow-xs"
                        title="Ir al módulo para completar este entregable"
                      >
                        Completar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-5 border-t border-stone-800 overflow-x-auto scrollbar-none text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('intention')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'intention'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>00. Asistente de Intención</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'workspace'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>01. Proyecto Activo</span>
            {project.generatedOutputs.length > 0 && (
              <span className="bg-[#111111] text-[#f8c300] text-[10px] px-1.5 py-0.2 rounded-full">
                {project.generatedOutputs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'routes'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>02. Diagnóstico de Rutas</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>03. Catálogo de 8 Decisiones</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'library'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>04. Prompts Maestros</span>
          </button>

          <button
            onClick={() => setActiveTab('ecosystem')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'ecosystem'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Zap className="w-4 h-4 text-[#f8c300]" />
            <span>05. IA Gratis & Ensayos</span>
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div>
        {activeTab === 'intention' && (
          <IntentionAssistant
            currentProject={project}
            onApplyFichaToProject={handleApplyFichaToProject}
            onOpenTool={handleOpenTool}
          />
        )}

        {activeTab === 'workspace' && (
          <ProjectWorkspace
            project={project}
            onUpdateProject={saveProject}
            onOpenTool={handleOpenTool}
            onNewProject={handleNewProject}
            onNavigateToIntention={() => setActiveTab('intention')}
            estadoFicha={estadoFicha}
            onChangeEstadoFicha={handleChangeEstadoFicha}
          />
        )}

        {activeTab === 'routes' && (
          <CreativeRouteExplorer
            project={project}
            onApplyRoute={handleApplyRoute}
            onOpenTool={handleOpenTool}
          />
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#111111]">
                  Catálogo por Decisiones Creativas
                </h3>
                <p className="text-xs text-stone-600">
                  Organizadas por decisiones concretas, no solo por tecnología.
                </p>
              </div>
            </div>

            <CreativeCatalog
              onOpenTool={handleOpenTool}
              activeTools={project.activeTools}
              estadoFicha={estadoFicha}
              onChangeEstadoFicha={handleChangeEstadoFicha}
            />
          </div>
        )}

        {activeTab === 'library' && (
          <MasterPromptsLibrary
            project={project}
            onOpenTool={handleOpenTool}
          />
        )}

        {activeTab === 'ecosystem' && (
          <CreativeAiEcosystem />
        )}
      </div>

      {/* The Active Tool Studio Modal */}
      {isToolModalOpen && selectedToolDef && (
        <ToolModal
          tool={selectedToolDef}
          project={project}
          isOpen={isToolModalOpen}
          onClose={() => setIsToolModalOpen(false)}
          onSaveOutputToProject={handleSaveOutputToProject}
          onRegisterAdvanceFromTool={handleRegisterAdvanceFromTool}
        />
      )}
    </section>
  );
};
