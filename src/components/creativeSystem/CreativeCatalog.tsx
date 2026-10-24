import React, { useState } from 'react';
import { Sparkles, ArrowRight, Layers, Eye, CheckCircle, Zap, Filter } from 'lucide-react';
import { ToolDefinition, CreativeToolId, CreativeStage, EstadoFicha, ESTADO_FICHA_CONFIG } from '../../types/creativeSystem';
import { CREATIVE_TOOLS } from '../../utils/creativeCatalogData';

interface CreativeCatalogProps {
  onOpenTool: (toolId: CreativeToolId) => void;
  activeTools?: CreativeToolId[];
  estadoFicha?: EstadoFicha;
  onChangeEstadoFicha?: (estado: EstadoFicha) => void;
}

export const CreativeCatalog: React.FC<CreativeCatalogProps> = ({
  onOpenTool,
  activeTools = [],
  estadoFicha = 'exploracion',
  onChangeEstadoFicha
}) => {
  const [filterMode, setFilterMode] = useState<'estado' | 'stage' | 'all'>('estado');
  const [stageFilter, setStageFilter] = useState<'all' | CreativeStage>('all');

  const estadoConfig = ESTADO_FICHA_CONFIG[estadoFicha] || ESTADO_FICHA_CONFIG.exploracion;

  const filteredTools = CREATIVE_TOOLS.filter((t) => {
    if (filterMode === 'estado') {
      return estadoConfig.tools.includes(t.id);
    }
    if (stageFilter === 'all') return true;
    return t.stage === stageFilter;
  });

  return (
    <div className="space-y-6">
      {/* Estado de Ficha Filter Ribbon */}
      <div className="bg-[#111111] text-white p-5 rounded-2xl border-2 border-stone-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f8c300] animate-pulse" />
            <span className="text-xs font-mono font-black uppercase tracking-wider text-[#f8c300]">
              Filtrar por Estado de Ficha
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilterMode('estado');
                setStageFilter('all');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                filterMode === 'estado'
                  ? 'bg-[#f8c300] text-[#111111]'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              Filtrar por Etapa Activa
            </button>
            <button
              onClick={() => {
                setFilterMode('all');
                setStageFilter('all');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#f8c300] text-[#111111]'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              Ver Todas (8)
            </button>
          </div>
        </div>

        {/* 3 Estado Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['exploracion', 'produccion', 'integracion'] as EstadoFicha[]).map((st) => {
            const conf = ESTADO_FICHA_CONFIG[st];
            const isSelected = estadoFicha === st;
            return (
              <button
                key={st}
                onClick={() => {
                  if (onChangeEstadoFicha) {
                    onChangeEstadoFicha(st);
                  }
                  setFilterMode('estado');
                }}
                className={`p-3.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-900 border-[#f8c300] ring-2 ring-[#f8c300]/50 shadow-md'
                    : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#f8c300] text-[#111111]' : 'bg-stone-800 text-stone-300'
                    }`}>
                      {conf.badge}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 font-bold">
                      {conf.tools.length} herramientas
                    </span>
                  </div>
                  <strong className="block text-sm text-white font-black mt-1">
                    {conf.label}
                  </strong>
                </div>
                <span className="text-[11px] text-stone-400 leading-snug mt-1.5">
                  {conf.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage filter pill buttons (Secondary when viewing all) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-mono font-bold">
          <button
            onClick={() => {
              setFilterMode('stage');
              setStageFilter('all');
            }}
            className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
              filterMode === 'stage' && stageFilter === 'all'
                ? 'bg-[#111111] text-[#f8c300]'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            Todas ({CREATIVE_TOOLS.length})
          </button>
          <button
            onClick={() => {
              setFilterMode('stage');
              setStageFilter('comprender');
            }}
            className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
              filterMode === 'stage' && stageFilter === 'comprender'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            01. Comprender
          </button>
          <button
            onClick={() => {
              setFilterMode('stage');
              setStageFilter('imaginar');
            }}
            className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
              filterMode === 'stage' && stageFilter === 'imaginar'
                ? 'bg-[#7656ff] text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            02. Imaginar
          </button>
          <button
            onClick={() => {
              setFilterMode('stage');
              setStageFilter('producir');
            }}
            className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
              filterMode === 'stage' && stageFilter === 'producir'
                ? 'bg-[#ff4fa3] text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            03. Producir
          </button>
          <button
            onClick={() => {
              setFilterMode('stage');
              setStageFilter('conectar');
            }}
            className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
              filterMode === 'stage' && stageFilter === 'conectar'
                ? 'bg-[#06b6d4] text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            04. Conectar
          </button>
          <button
            onClick={() => {
              setFilterMode('stage');
              setStageFilter('integrar');
            }}
            className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
              filterMode === 'stage' && stageFilter === 'integrar'
                ? 'bg-[#f97316] text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            05. Integrar & Activar
          </button>
        </div>

        <span className="text-xs font-mono text-stone-500">
          Mostrando <strong>{filteredTools.length}</strong> de {CREATIVE_TOOLS.length} herramientas
        </span>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTools.map((tool) => {
          const isActive = activeTools.includes(tool.id);
          const isSuggestedInCurrentEstado = estadoConfig.tools.includes(tool.id);

          return (
            <div
              key={tool.id}
              className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between group hover:shadow-md ${
                isSuggestedInCurrentEstado
                  ? 'border-stone-400 ring-2 ring-[#f8c300]/30 shadow-xs'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-[#111111]"
                      style={{ backgroundColor: tool.color }}
                    >
                      {tool.orderNumber}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-500">
                      {tool.stageLabel}
                    </span>
                  </div>

                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${tool.color}20`, color: '#111111' }}
                  >
                    {tool.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-base text-[#111111] group-hover:text-[#7656ff] transition-colors leading-tight">
                    {tool.title}
                  </h4>
                  {isSuggestedInCurrentEstado && (
                    <span className="inline-block text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      ✦ Sugerida para {estadoConfig.label}
                    </span>
                  )}
                </div>

                <p className="text-stone-600 text-xs leading-relaxed">
                  {tool.summary}
                </p>

                <div className="bg-[#f8f7f4] p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-700">
                  <span className="font-mono uppercase text-[9px] font-bold text-stone-500 block mb-0.5">
                    Entrega concreta:
                  </span>
                  <span className="font-medium text-stone-900">{tool.deliverable}</span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-stone-400">
                  {isActive ? '✦ En tu proyecto' : 'Módulo listo'}
                </span>

                <button
                  onClick={() => onOpenTool(tool.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] hover:bg-stone-800 text-[#f8c300] font-black rounded-lg text-xs transition cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Abrir</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#f8c300]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
