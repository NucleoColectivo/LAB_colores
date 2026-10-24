import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  FileText,
  Download,
  Share2,
  Edit3,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Copy,
  Zap,
  Target,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CreativeProject, CreativeStage, CreativeToolId, GeneratedOutput, EstadoFicha, ESTADO_FICHA_CONFIG } from '../../types/creativeSystem';
import { CREATIVE_TOOLS } from '../../utils/creativeCatalogData';
import { calculateProjectProgress } from '../../utils/creativeProgress';

interface ProjectWorkspaceProps {
  project: CreativeProject;
  onUpdateProject: (updated: CreativeProject) => void;
  onOpenTool: (toolId: CreativeToolId) => void;
  onNewProject: () => void;
  onNavigateToIntention?: () => void;
  estadoFicha?: EstadoFicha;
  onChangeEstadoFicha?: (estado: EstadoFicha) => void;
}

const STAGES: { stage: CreativeStage; order: string; label: string; desc: string }[] = [
  { stage: 'comprender', order: '01', label: 'Comprender', desc: 'Propósito, necesidad y pregunta generadora' },
  { stage: 'imaginar', order: '02', label: 'Imaginar', desc: 'Concepto, estilo, paleta y narrativa' },
  { stage: 'producir', order: '03', label: 'Producir', desc: 'Imagen, video, audio o código' },
  { stage: 'conectar', order: '04', label: 'Conectar', desc: 'Interacción, interfaz y comunidad' },
  { stage: 'integrar', order: '05', label: 'Integrar & Activar', desc: 'Pruebas, coherencia y publicación' }
];

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  onUpdateProject,
  onOpenTool,
  onNewProject,
  onNavigateToIntention,
  estadoFicha = 'exploracion',
  onChangeEstadoFicha
}) => {
  const [modulesFilter, setModulesFilter] = useState<'all' | 'suggested'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [editIntention, setEditIntention] = useState(project.intention);
  const [editAuthor, setEditAuthor] = useState(project.author);
  const [editQuestion, setEditQuestion] = useState(project.guidingQuestion || '');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [showDeliverablesDrawer, setShowDeliverablesDrawer] = useState(false);

  // Dynamic progress calculation based on project deliverables
  const stageProgress = useMemo(() => {
    return calculateProjectProgress(project, estadoFicha);
  }, [project, estadoFicha]);

  const handleSaveEdit = () => {
    onUpdateProject({
      ...project,
      title: editTitle,
      intention: editIntention,
      author: editAuthor,
      guidingQuestion: editQuestion,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleSetStage = (stage: CreativeStage) => {
    onUpdateProject({
      ...project,
      activeStage: stage,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteOutput = (outputId: string) => {
    onUpdateProject({
      ...project,
      generatedOutputs: project.generatedOutputs.filter((o) => o.id !== outputId),
      updatedAt: new Date().toISOString()
    });
  };

  const generateMarkdownExport = (): string => {
    return `# ${project.title}
**Autor/a:** ${project.author}  
**Fecha:** ${new Date(project.updatedAt).toLocaleDateString()}  
**Plataforma:** Núcleo Colectivo · [lab-colores.vercel.app](https://lab-colores.vercel.app/)

---

## 1. La Lógica Central: De la Intención al Sistema Creativo
- **Intención Principal:** ${project.intention}
- **Pregunta Generadora:** ${project.guidingQuestion || '¿Cómo transformar esta idea en un dispositivo sensible?'}
- **Contexto:** ${project.context}
- **Público:** ${project.targetAudience}
- **Recursos:** ${project.resources}
- **Resultado Deseado:** ${project.desiredResult}

---

## 2. Decisiones de Dirección de Arte & Estilo
- **Estética:** ${project.decisions?.artDirection?.aesthetic || 'Definida en el taller'}
- **Paleta Cromática:** ${project.decisions?.artDirection?.palette?.join(', ') || 'Dorado, violeta, negro mineral, crudo'}
- **Referencias:** ${project.decisions?.artDirection?.references || 'Artes visuales y comunitarias'}
- **Reglas:** ${project.decisions?.artDirection?.rules || 'Sin clichés, texturas reales'}

---

## 3. Entregables y Prompts Generados (${project.generatedOutputs.length})
${project.generatedOutputs
  .map(
    (out, idx) => `### ${idx + 1}. ${out.title} (${out.toolName})
**Plataforma sugerida:** ${out.targetPlatform || 'General'}  
**Fecha:** ${new Date(out.timestamp).toLocaleTimeString()}

\`\`\`
${out.promptText}
\`\`\`

#### Resultado / Análisis:
${out.resultAnalysis || 'Pendiente de generación.'}
`
  )
  .join('\n---\n')}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownExport());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `proyecto-${project.title.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* 5-Stage Ribbon */}
      <div className="bg-[#111111] text-white p-5 rounded-2xl border-2 border-stone-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f8c300] animate-pulse" />
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#f8c300] font-black">
              Ciclo Creativo: De la Intención a la Obra
            </h4>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Etapa actual: <strong className="text-white uppercase">{project.activeStage}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {STAGES.map((s) => {
            const isCurrent = project.activeStage === s.stage;
            return (
              <button
                key={s.stage}
                onClick={() => handleSetStage(s.stage)}
                className={`p-3 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-stone-900 border-[#f8c300] shadow-sm ring-1 ring-[#f8c300]'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#f8c300]">{s.order}</span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#f8c300]" />}
                  </div>
                  <strong className="block text-xs text-white font-bold mt-1">{s.label}</strong>
                </div>
                <span className="text-[10px] text-stone-400 leading-tight mt-1 line-clamp-2">
                  {s.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Project Card */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8c300]/20 text-[#111111] text-xs font-mono font-bold uppercase tracking-wider">
                <FolderKanban className="w-3.5 h-3.5 text-[#111111]" />
                Proyecto Activo
              </div>

              {/* Estado de Ficha Badge & Quick Switcher */}
              <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase px-1.5">
                  Estado:
                </span>
                {(['exploracion', 'produccion', 'integracion'] as EstadoFicha[]).map((st) => {
                  const isCurrent = estadoFicha === st;
                  const conf = ESTADO_FICHA_CONFIG[st];
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onChangeEstadoFicha && onChangeEstadoFicha(st)}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg transition cursor-pointer ${
                        isCurrent
                          ? 'bg-[#111111] text-white shadow-xs'
                          : 'text-stone-600 hover:text-black hover:bg-stone-200'
                      }`}
                    >
                      {conf.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-lg font-black border border-stone-300 rounded-lg p-2"
                  placeholder="Título del proyecto"
                />
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2 text-stone-700"
                  placeholder="Autor/a o colectivo"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
                  {project.title}
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Por <strong className="text-stone-800">{project.author}</strong> · Etapa: <strong className="text-stone-900">{ESTADO_FICHA_CONFIG[estadoFicha]?.label}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onNavigateToIntention && (
              <button
                onClick={onNavigateToIntention}
                className="px-3 py-1.5 bg-[#f8c300]/25 hover:bg-[#f8c300]/35 text-[#111111] font-black rounded-lg text-xs transition flex items-center gap-1.5 border border-[#f8c300]/60 cursor-pointer"
                title="Abrir el Asistente de Intención y gestionar Fichas de Proyecto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Asistente de Intención</span>
              </button>
            )}

            {isEditing ? (
              <button
                onClick={handleSaveEdit}
                className="px-3.5 py-1.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Guardar cambios
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditTitle(project.title);
                  setEditIntention(project.intention);
                  setEditAuthor(project.author);
                  setEditQuestion(project.guidingQuestion || '');
                  setIsEditing(true);
                }}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editar ficha
              </button>
            )}

            <button
              onClick={() => setIsExportOpen(true)}
              className="px-3.5 py-1.5 bg-[#111111] hover:bg-stone-800 text-[#f8c300] font-black rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar para lab-colores
            </button>

            <button
              onClick={onNewProject}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
              title="Crear un nuevo proyecto desde cero"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo
            </button>
          </div>
        </div>

        {/* Indicador de Avance Porcentual de Entregables */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#f8c300] text-[#111111] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-black uppercase text-stone-900 tracking-wider">
                    Avance de Entregables · {stageProgress.label}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                    {stageProgress.completedCount} de {stageProgress.totalCount} completados
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Calculado automáticamente según la pregunta generadora, dirección de arte y módulos activados.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">
                {stageProgress.percentage}%
              </span>
              <button
                type="button"
                onClick={() => setShowDeliverablesDrawer(!showDeliverablesDrawer)}
                className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-mono font-bold rounded-lg border border-stone-300 transition flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span>{showDeliverablesDrawer ? 'Ocultar' : 'Ver Checklist'}</span>
                {showDeliverablesDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-[#7656ff]" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-200 rounded-full h-3 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-amber-500 via-[#f8c300] to-emerald-500"
              style={{ width: `${Math.max(6, stageProgress.percentage)}%` }}
            />
          </div>

          {/* Expandable Checklist */}
          {showDeliverablesDrawer && (
            <div className="pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-200">
              {stageProgress.checklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 text-xs transition ${
                    item.completed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-white border-stone-200 text-stone-600'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <span className={`font-bold block ${item.completed ? 'text-emerald-900' : 'text-stone-900'}`}>
                        {item.label}
                      </span>
                      <p className="text-[10px] text-stone-500 leading-snug line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {item.actionToolId && !item.completed && (
                    <button
                      type="button"
                      onClick={() => onOpenTool(item.actionToolId as CreativeToolId)}
                      className="px-2 py-1 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] rounded text-[10px] font-mono font-bold shrink-0 transition cursor-pointer"
                    >
                      Ir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Intention and Guiding Question */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#fcfbf9] p-4 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-stone-500 font-black block">
                Intención Creativa Central:
              </span>
              {onNavigateToIntention && (
                <button
                  type="button"
                  onClick={onNavigateToIntention}
                  className="text-[10px] font-mono font-bold text-[#7656ff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Ir al Asistente
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea
                rows={3}
                value={editIntention}
                onChange={(e) => setEditIntention(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2 text-stone-900"
              />
            ) : (
              <p className="text-stone-800 text-sm leading-relaxed font-medium">
                {project.intention}
              </p>
            )}
          </div>

          <div className="bg-[#fcfbf9] p-4 rounded-xl border-l-4 border-[#7656ff] border-stone-200">
            <span className="text-[10px] font-mono uppercase text-[#7656ff] font-black block mb-1">
              Pregunta Generadora:
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2 text-stone-900 font-serif"
                placeholder="¿De qué manera...?"
              />
            ) : (
              <p className="text-[#111111] text-sm font-serif italic leading-relaxed">
                "{project.guidingQuestion || '¿De qué maneras podemos hacer visible esta inquietud en el territorio?'}"
              </p>
            )}
          </div>
        </div>

        {/* Active Modules Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-600" />
              <h4 className="text-xs font-mono uppercase tracking-wider font-black text-stone-700">
                Módulos del Sistema en este Proyecto
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModulesFilter('all')}
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  modulesFilter === 'all'
                    ? 'bg-[#111111] text-white'
                    : 'bg-stone-100 text-stone-600 hover:text-black hover:bg-stone-200'
                }`}
              >
                Todos ({project.activeTools.length})
              </button>

              <button
                type="button"
                onClick={() => setModulesFilter('suggested')}
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  modulesFilter === 'suggested'
                    ? 'bg-[#f8c300] text-[#111111] shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-black hover:bg-stone-200'
                }`}
              >
                <span>Sugeridos para {ESTADO_FICHA_CONFIG[estadoFicha]?.label}</span>
                <span className="text-[10px] bg-black/10 px-1 rounded">
                  {project.activeTools.filter((tId) => ESTADO_FICHA_CONFIG[estadoFicha]?.tools.includes(tId)).length}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {project.activeTools
              .filter((toolId) => {
                if (modulesFilter === 'suggested') {
                  return ESTADO_FICHA_CONFIG[estadoFicha]?.tools.includes(toolId);
                }
                return true;
              })
              .map((toolId) => {
                const def = CREATIVE_TOOLS.find((t) => t.id === toolId);
                if (!def) return null;
                const isSuggested = ESTADO_FICHA_CONFIG[estadoFicha]?.tools.includes(toolId);

                return (
                  <div
                    key={toolId}
                    onClick={() => onOpenTool(toolId)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between group shadow-2xs ${
                      isSuggested
                        ? 'border-stone-400 bg-white hover:bg-stone-50 ring-1 ring-[#f8c300]/40'
                        : 'border-stone-200 hover:border-[#111111] bg-white hover:bg-[#fcfbf9]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] text-[#111111]"
                          style={{ backgroundColor: def.color }}
                        >
                          {def.orderNumber}
                        </span>
                        <span className="text-[9px] font-mono uppercase font-bold text-stone-400">
                          {def.stageLabel}
                        </span>
                      </div>
                      <strong className="block text-xs font-black text-[#111111] group-hover:text-[#7656ff] transition-colors leading-tight">
                        {def.title}
                      </strong>
                      {isSuggested && (
                        <span className="inline-block mt-1 text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                          ✦ Sugerido para {ESTADO_FICHA_CONFIG[estadoFicha]?.label}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
                      <span>Abrir módulo</span>
                      <ArrowRight className="w-3 h-3 text-[#111111] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Generated Outputs / Prompts in this project */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f8c300]" />
              <h4 className="text-xs font-mono uppercase tracking-wider font-black text-stone-700">
                Piezas y Prompts Guardados en el Proyecto ({project.generatedOutputs.length})
              </h4>
            </div>
            {project.generatedOutputs.length > 0 && (
              <span className="text-xs text-stone-500">
                Listas para la mesa de trabajo o lab-colores
              </span>
            )}
          </div>

          {project.generatedOutputs.length === 0 ? (
            <div className="bg-[#fcfbf9] border border-dashed border-stone-300 rounded-xl p-8 text-center space-y-2">
              <p className="text-xs text-stone-500">
                Aún no has guardado prompts o decisiones en este proyecto.
              </p>
              <p className="text-xs font-bold text-stone-800">
                Abre cualquier módulo del catálogo, ajusta los parámetros y pulsa "Guardar en el Proyecto".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {project.generatedOutputs.map((out) => (
                <div
                  key={out.id}
                  className="bg-white border border-stone-200 rounded-xl p-4 hover:border-stone-400 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                        {out.toolName}
                      </span>
                      <strong className="text-xs font-black text-[#111111]">{out.title}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-stone-400">
                        {new Date(out.timestamp).toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => handleDeleteOutput(out.id)}
                        className="p-1 text-stone-400 hover:text-red-500 transition"
                        title="Eliminar del proyecto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <pre className="bg-[#111111] text-stone-200 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-32">
                    {out.promptText}
                  </pre>

                  {out.resultAnalysis && (
                    <div className="bg-[#f8f7f4] border border-stone-200 p-3 rounded-lg text-xs text-stone-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {out.resultAnalysis}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111111] text-white w-full max-w-3xl rounded-2xl border-2 border-stone-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <h4 className="font-black text-lg text-white">
                  Exportar Proyecto para lab-colores.vercel.app
                </h4>
                <p className="text-xs text-stone-400">
                  Lleva tu ficha, dirección de arte y prompts a Notion, GitHub o al repositorio del taller.
                </p>
              </div>
              <button
                onClick={() => setIsExportOpen(false)}
                className="text-stone-400 hover:text-white text-sm font-mono font-bold"
              >
                ✕ Cerrar
              </button>
            </div>

            <pre className="bg-black/70 border border-stone-800 p-4 rounded-xl text-xs font-mono text-stone-200 max-h-[350px] overflow-y-auto whitespace-pre-wrap">
              {generateMarkdownExport()}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-stone-400">
                Formato Markdown estructurado con WCAG y sistema de creación por etapas
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Descargar JSON
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="px-4 py-2 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedMd ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedMd ? '¡Copiado a portapapeles!' : 'Copiar Markdown'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
