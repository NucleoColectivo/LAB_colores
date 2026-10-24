import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, Save, ArrowRight, Compass, Eye, RefreshCw, Layers } from 'lucide-react';
import { ToolDefinition, CreativeProject, GeneratedOutput, CreativeToolId } from '../../types/creativeSystem';
import { PHOTO_OPTIONS, VIDEO_OPTIONS, INTERACTION_OPTIONS } from '../../utils/creativeCatalogData';
import { compileMasterPrompt } from '../../utils/creativePromptTemplates';

interface ToolModalProps {
  tool: ToolDefinition | null;
  project: CreativeProject;
  isOpen: boolean;
  onClose: () => void;
  onSaveOutputToProject: (output: GeneratedOutput) => void;
  onRegisterAdvanceFromTool?: (title: string, idea: string, milestone: string) => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({
  tool,
  project,
  isOpen,
  onClose,
  onSaveOutputToProject,
  onRegisterAdvanceFromTool
}) => {
  // Local state for tool-specific parameters - declared unconditionally
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    return {
      intention: project?.intention || '',
      context: project?.context || '',
      targetAudience: project?.targetAudience || '',
      resources: project?.resources || '',
      desiredResult: project?.desiredResult || '',
      aesthetic: project?.decisions?.artDirection?.aesthetic || 'Fotografía documental poética con texturas táctiles y grano 35mm',
      palette: project?.decisions?.artDirection?.palette?.join(', ') || 'Dorado (#f8c300), violeta (#7656ff), negro mineral (#111111), crudo (#f5f3ee)',
      references: project?.decisions?.artDirection?.references || 'Graciela Iturbide, Bill Viola, arte textil local y shaders interactivos',
      // Photography
      subject: project?.decisions?.imageParams?.subject || 'Retrato de artesano/a tejiendo con hilos que emiten luz tenue sobre un telar tradicional',
      cameraType: project?.decisions?.imageParams?.cameraType || 'auto',
      lens: project?.decisions?.imageParams?.lens || 'auto',
      framing: project?.decisions?.imageParams?.framing || 'auto',
      lighting: project?.decisions?.imageParams?.lighting || 'auto',
      depth: project?.decisions?.imageParams?.depth || 'auto',
      aspectRatio: project?.decisions?.imageParams?.aspectRatio || '16:9',
      // Video
      movement: 'auto',
      rhythm: 'auto',
      format: '16:9 cinematográfico',
      // Interaction
      inputType: 'auto',
      outputType: 'auto',
      userQuery: ''
    };
  });

  const [compiled, setCompiled] = useState(() =>
    compileMasterPrompt(tool?.id || '01-explorador-ideas', project, formData)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'decision' | 'prompt' | 'resultado'>('decision');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when tool or project updates
  useEffect(() => {
    if (!tool) return;
    setFormData((prev) => ({
      ...prev,
      intention: project?.intention || prev.intention,
      context: project?.context || prev.context,
      targetAudience: project?.targetAudience || prev.targetAudience,
      resources: project?.resources || prev.resources,
      desiredResult: project?.desiredResult || prev.desiredResult,
      aesthetic: project?.decisions?.artDirection?.aesthetic || prev.aesthetic,
      palette: project?.decisions?.artDirection?.palette?.join(', ') || prev.palette,
      subject: project?.decisions?.imageParams?.subject || prev.subject
    }));
  }, [tool?.id, project]);

  // Recalculate prompt when form changes
  useEffect(() => {
    if (!tool) return;
    const res = compileMasterPrompt(tool.id, project, formData);
    setCompiled(res);
  }, [formData, tool, project]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!tool) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/creative-system/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          masterPrompt: compiled.masterPrompt,
          userQuery: formData.userQuery
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          setGeneratedResult(data.content);
        } else {
          // Use structured rich deliverable
          setGeneratedResult(compiled.fallbackDeliverable);
        }
      } else {
        setGeneratedResult(compiled.fallbackDeliverable);
      }
    } catch (e) {
      setGeneratedResult(compiled.fallbackDeliverable);
    } finally {
      setIsGenerating(false);
      setActiveTab('resultado');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToProject = () => {
    if (!tool) return;
    const output: GeneratedOutput = {
      id: `out-${Date.now()}`,
      toolId: tool.id,
      toolName: tool.title,
      title: `${tool.title} · ${project.title}`,
      timestamp: new Date().toISOString(),
      promptText: compiled.masterPrompt,
      resultAnalysis: generatedResult || compiled.fallbackDeliverable,
      parameters: formData,
      targetPlatform: tool.id === '03-generador-imagenes' ? 'Midjourney' : tool.id === '04-director-video' ? 'Runway' : tool.id === '05-disenador-interactivo' ? 'p5.js' : 'Document'
    };
    onSaveOutputToProject(output);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRegisterAsAdvance = () => {
    if (!tool) return;
    if (onRegisterAdvanceFromTool) {
      onRegisterAdvanceFromTool(
        `${tool.title}: ${project.title}`,
        formData.intention || project.intention,
        `Resultado generado con el ${tool.title}: entrega validada para la mesa de trabajo.`
      );
    }
  };

  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] text-white w-full max-w-4xl max-h-[92vh] rounded-2xl border-2 border-stone-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/80">
          <div className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-[#111111]"
              style={{ backgroundColor: tool.color }}
            >
              {tool.orderNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">{tool.title}</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold">
                  {tool.stageLabel}
                </span>
              </div>
              <p className="text-xs text-stone-400 line-clamp-1">{tool.summary}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-stone-900 border-b border-stone-800 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('decision')}
            className={`px-4 py-2 border-b-2 transition cursor-pointer ${
              activeTab === 'decision'
                ? 'border-[#f8c300] text-[#f8c300]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            1. Decisiones Creativas
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-4 py-2 border-b-2 transition cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-[#f8c300] text-[#f8c300]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            2. Prompt Maestro Compilado
          </button>
          <button
            onClick={() => setActiveTab('resultado')}
            className={`px-4 py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resultado'
                ? 'border-[#f8c300] text-[#f8c300]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f8c300]" />
            3. Resultado & Entregable
            {generatedResult && <span className="w-2 h-2 rounded-full bg-[#f8c300]" />}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* TAB 1: DECISIONES CREATIVAS */}
          {activeTab === 'decision' && (
            <div className="space-y-6">
              {/* Inherited project banner */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#f8c300] font-bold">
                    Proyecto Activo Conectado:
                  </span>
                  <p className="font-bold text-white text-sm mt-0.5">{project.title}</p>
                  <p className="text-stone-400 text-xs line-clamp-1">Intención: {project.intention}</p>
                </div>
                <div className="text-[11px] font-mono text-stone-400 bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700">
                  Creador/a: <strong className="text-stone-200">{project.author}</strong>
                </div>
              </div>

              {/* Tool 01: Explorador */}
              {tool.id === '01-explorador-ideas' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                      ¿Qué quiero expresar, explorar, comunicar, imaginar o transformar?
                    </label>
                    <textarea
                      rows={3}
                      value={formData.intention}
                      onChange={(e) => handleFieldChange('intention', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-[#f8c300]"
                      placeholder="Escribe aquí tu intención sin filtros..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                        Contexto y motivo:
                      </label>
                      <input
                        type="text"
                        value={formData.context}
                        onChange={(e) => handleFieldChange('context', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                        Público o comunidad:
                      </label>
                      <input
                        type="text"
                        value={formData.targetAudience}
                        onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tool 02: Director de arte */}
              {tool.id === '02-director-arte' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                      Estética deseada:
                    </label>
                    <input
                      type="text"
                      value={formData.aesthetic}
                      onChange={(e) => handleFieldChange('aesthetic', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-[#7656ff]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                        Referencias visuales y artistas:
                      </label>
                      <input
                        type="text"
                        value={formData.references}
                        onChange={(e) => handleFieldChange('references', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                        Paleta cromática:
                      </label>
                      <input
                        type="text"
                        value={formData.palette}
                        onChange={(e) => handleFieldChange('palette', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tool 03: Generador de Imágenes Fotográficas */}
              {tool.id === '03-generador-imagenes' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                      Sujeto y acción en la escena:
                    </label>
                    <textarea
                      rows={2}
                      value={formData.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-[#ff4fa3]"
                      placeholder="Describe el sujeto, sus acciones y elementos materiales..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cámara */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#ff4fa3] font-bold mb-1">
                        Tipo de cámara:
                      </label>
                      <select
                        value={formData.cameraType}
                        onChange={(e) => handleFieldChange('cameraType', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {PHOTO_OPTIONS.cameraType.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Lente */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#ff4fa3] font-bold mb-1">
                        Lente y óptica:
                      </label>
                      <select
                        value={formData.lens}
                        onChange={(e) => handleFieldChange('lens', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {PHOTO_OPTIONS.lens.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Encuadre */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                        Encuadre:
                      </label>
                      <select
                        value={formData.framing}
                        onChange={(e) => handleFieldChange('framing', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {PHOTO_OPTIONS.framing.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Iluminación */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                        Iluminación:
                      </label>
                      <select
                        value={formData.lighting}
                        onChange={(e) => handleFieldChange('lighting', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {PHOTO_OPTIONS.lighting.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Profundidad de campo */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                        Profundidad de campo:
                      </label>
                      <select
                        value={formData.depth}
                        onChange={(e) => handleFieldChange('depth', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {PHOTO_OPTIONS.depth.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1">
                        Formato / Relación de Aspecto:
                      </label>
                      <select
                        value={formData.aspectRatio}
                        onChange={(e) => handleFieldChange('aspectRatio', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {PHOTO_OPTIONS.aspectRatio.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tool 04: Director de Video */}
              {tool.id === '04-director-video' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#22c55e] font-bold mb-1">
                        Movimiento de cámara:
                      </label>
                      <select
                        value={formData.movement}
                        onChange={(e) => handleFieldChange('movement', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {VIDEO_OPTIONS.movement.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#22c55e] font-bold mb-1">
                        Ritmo cinematográfico:
                      </label>
                      <select
                        value={formData.rhythm}
                        onChange={(e) => handleFieldChange('rhythm', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {VIDEO_OPTIONS.rhythm.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tool 05: Diseñador Interactivo */}
              {tool.id === '05-disenador-interactivo' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#06b6d4] font-bold mb-1">
                        Entrada (Sensado):
                      </label>
                      <select
                        value={formData.inputType}
                        onChange={(e) => handleFieldChange('inputType', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {INTERACTION_OPTIONS.inputType.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#06b6d4] font-bold mb-1">
                        Salida (Transformación estética):
                      </label>
                      <select
                        value={formData.outputType}
                        onChange={(e) => handleFieldChange('outputType', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-white"
                      >
                        {INTERACTION_OPTIONS.outputType.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional user query */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 font-bold mb-1">
                  Ajuste o inquietud adicional para el asistente (opcional):
                </label>
                <input
                  type="text"
                  value={formData.userQuery}
                  onChange={(e) => handleFieldChange('userQuery', e.target.value)}
                  placeholder="Ej: Quiero que enfatice el grano 35mm y evite rostros artificiales..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PROMPT MAESTRO COMPILADO */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Prompt Maestro Listo para Copiar</h4>
                  <p className="text-stone-400 text-xs">
                    Modelo recomendado: <span className="text-[#f8c300] font-mono">{compiled.recommendedModel}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(compiled.masterPrompt)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-mono font-bold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '¡Copiado!' : 'Copiar Prompt'}
                </button>
              </div>

              <pre className="bg-black/60 border border-stone-800 p-4 rounded-xl text-stone-200 text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[350px]">
                {compiled.masterPrompt}
              </pre>
            </div>
          )}

          {/* TAB 3: RESULTADO & ENTREGABLE */}
          {activeTab === 'resultado' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Entregable para la Mesa de Trabajo</h4>
                  <p className="text-stone-400 text-xs">{tool.deliverable}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(generatedResult || compiled.fallbackDeliverable)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-mono font-bold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar
                  </button>

                  <button
                    onClick={handleSaveToProject}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] rounded-lg text-xs font-black transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savedSuccess ? '¡Guardado en Proyecto!' : 'Guardar en Proyecto'}
                  </button>
                </div>
              </div>

              <div className="bg-black/80 border border-stone-800 p-5 rounded-xl text-stone-200 text-xs font-sans leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[380px]">
                {generatedResult || compiled.fallbackDeliverable}
              </div>

              {/* Extra action to register as collective advance */}
              {onRegisterAdvanceFromTool && (
                <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-stone-300">
                    ¿Quieres compartir este resultado con el grupo del taller?
                  </span>
                  <button
                    onClick={handleRegisterAsAdvance}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-[#f8c300] font-bold rounded-lg transition"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Registrar en Repositorio Colectivo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-4">
          <div className="text-xs text-stone-400">
            Entrega esperada: <strong className="text-stone-200">{tool.deliverable}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando decisión creativa...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>✦ Generar con Asistente Creativo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
