import React, { useState, useMemo } from 'react';
import { ParticipantContribution, CREATIVE_LANGUAGES } from '../types';
import {
  Download,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  FileJson,
  Upload,
  Layers,
  Sparkles,
  Users,
  MessageSquare,
  HelpCircle,
  Tag,
  PlusCircle
} from 'lucide-react';

interface CollectiveMapProps {
  contributions: ParticipantContribution[];
  onRefresh: () => void;
  onClearAll: () => void;
  onImportJson: (importedData: ParticipantContribution[]) => void;
  onLoadSeedData: () => void;
}

export const CollectiveMap: React.FC<CollectiveMapProps> = ({
  contributions,
  onRefresh,
  onClearAll,
  onImportJson,
  onLoadSeedData
}) => {
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'stats' | 'voices'>('stats');

  // Compute language frequency
  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    contributions.forEach((c) => {
      (c.languages || []).forEach((lang) => {
        counts[lang] = (counts[lang] || 0) + 1;
      });
    });

    const maxCount = Math.max(...Object.values(counts), 1);
    const sorted = Object.entries(counts)
      .map(([name, count]) => {
        const langDef = CREATIVE_LANGUAGES.find((l) => l.name === name);
        return {
          name,
          count,
          percentage: Math.round((count / Math.max(contributions.length, 1)) * 100),
          relativeBar: Math.max(8, Math.round((count / maxCount) * 100)),
          color: langDef?.color || '#7656ff'
        };
      })
      .sort((a, b) => b.count - a.count);

    return sorted;
  }, [contributions]);

  // Compute emergent themes & keywords
  const themeKeywords = useMemo(() => {
    const wordCounts: Record<string, number> = {};
    contributions.forEach((c) => {
      if (!c.themes) return;
      // split by commas, semicolons, periods, or newlines
      const tokens = c.themes
        .split(/[,;.\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 3);

      tokens.forEach((token) => {
        const normalized = token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
        wordCounts[normalized] = (wordCounts[normalized] || 0) + 1;
      });
    });

    const list = Object.entries(wordCounts)
      .map(([text, count]) => ({ text, count }))
      .sort((a, b) => b.count - a.count);

    return list.slice(0, 16);
  }, [contributions]);

  // Unique roles count
  const uniqueRolesCount = useMemo(() => {
    const roles = new Set(contributions.map((c) => c.role).filter(Boolean));
    return roles.size;
  }, [contributions]);

  // Filtered contributions for Voices view
  const displayedContributions = useMemo(() => {
    if (!selectedTagFilter) return contributions;
    return contributions.filter(
      (c) =>
        c.themes?.toLowerCase().includes(selectedTagFilter.toLowerCase()) ||
        c.languages?.some((l) => l.toLowerCase().includes(selectedTagFilter.toLowerCase()))
    );
  }, [contributions, selectedTagFilter]);

  // Export CSV
  const handleExportCsv = () => {
    if (contributions.length === 0) {
      alert('Aún no hay aportes registrados para exportar.');
      return;
    }

    const headers = [
      'ID',
      'Seudónimo / Nombre',
      'Rol de afinidad',
      'Lenguajes Creativos',
      'Temas y preguntas',
      'Memoria / Imagen',
      'Deseo creativo',
      'Recursos disponibles',
      'Fecha y hora'
    ];

    const rows = contributions.map((c) => [
      c.id,
      c.alias || 'Anónimo',
      c.role || '',
      (c.languages || []).join(' | '),
      c.themes || '',
      c.memory || '',
      c.wish || '',
      c.resources || '',
      c.createdAt || ''
    ]);

    const csvContent =
      '\ufeff' +
      [headers, ...rows]
        .map((row) =>
          row
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aportes-nucleo-colectivo-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON
  const handleExportJson = () => {
    if (contributions.length === 0) {
      alert('Aún no hay aportes registrados para exportar.');
      return;
    }

    const jsonString = JSON.stringify(contributions, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo-aportes-nucleo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportJson(parsed);
          alert(`¡Se importaron ${parsed.length} aportes correctamente!`);
        } else {
          alert('El archivo JSON no tiene el formato de lista esperado.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON. Verifica el archivo.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <section id="mapa" className="py-10 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Paso 02
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            02. Mapa colectivo de afinidades
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-xl">
            Observa qué lenguajes aparecen, qué temas se repiten y dónde pueden surgir cruces inesperados.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-[#111111] rounded-full text-xs font-bold transition cursor-pointer"
            title="Refrescar vista"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refrescar</span>
          </button>

          {contributions.length === 0 && (
            <button
              onClick={onLoadSeedData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#eee9ff] hover:bg-[#ddd4ff] text-[#5e48d5] rounded-full text-xs font-bold transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Cargar ejemplos de prueba</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-[#111111] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-800">
          <span className="text-stone-400 text-xs font-medium block mb-1">
            Total de aportes
          </span>
          <strong className="text-3xl sm:text-4xl font-black tracking-tight text-white block">
            {contributions.length}
          </strong>
          <span className="text-[11px] text-[#f8c300] font-semibold mt-1 block">
            en este dispositivo
          </span>
        </div>

        <div className="bg-[#111111] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-800">
          <span className="text-stone-400 text-xs font-medium block mb-1">
            Lenguajes elegidos
          </span>
          <strong className="text-3xl sm:text-4xl font-black tracking-tight text-[#f8c300] block">
            {languageStats.length}
          </strong>
          <span className="text-[11px] text-stone-300 font-semibold mt-1 block">
            de 12 disciplinas
          </span>
        </div>

        <div className="bg-[#111111] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-800">
          <span className="text-stone-400 text-xs font-medium block mb-1">
            Temas y preguntas
          </span>
          <strong className="text-3xl sm:text-4xl font-black tracking-tight text-[#7656ff] block">
            {contributions.filter((c) => c.themes).length}
          </strong>
          <span className="text-[11px] text-stone-300 font-semibold mt-1 block">
            inquietudes vivas
          </span>
        </div>

        <div className="bg-[#111111] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-800">
          <span className="text-stone-400 text-xs font-medium block mb-1">
            Roles representados
          </span>
          <strong className="text-3xl sm:text-4xl font-black tracking-tight text-[#ff4fa3] block">
            {uniqueRolesCount}
          </strong>
          <span className="text-[11px] text-stone-300 font-semibold mt-1 block">
            miradas diversas
          </span>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Toggle between Analytics view and Voices view */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('stats')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer ${
                viewMode === 'stats'
                  ? 'bg-[#111111] text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              Gráfica de afinidades y temas
            </button>
            <button
              onClick={() => setViewMode('voices')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'voices'
                  ? 'bg-[#111111] text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Mosaico de aportes</span>
              <span className="bg-[#f8c300] text-[#111111] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {contributions.length}
              </span>
            </button>
          </div>

          {selectedTagFilter && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Filtrando por:</span>
              <span className="px-2.5 py-1 bg-[#f3f0ff] text-[#7656ff] font-bold rounded-full">
                {selectedTagFilter}
              </span>
              <button
                onClick={() => setSelectedTagFilter(null)}
                className="text-stone-400 hover:text-stone-700 underline text-[11px] cursor-pointer"
              >
                Quitar filtro
              </button>
            </div>
          )}
        </div>

        {viewMode === 'stats' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Languages bars */}
            <div className="lg:col-span-7">
              <h3 className="text-lg font-black text-[#111111] mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7656ff]" />
                <span>Lenguajes que nos convocan</span>
              </h3>
              <p className="text-xs text-[#6e6b66] mb-4">
                Frecuencia y peso de los medios expresivos priorizados por el grupo.
              </p>

              {languageStats.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 text-sm">
                  Cuando haya respuestas en el formulario, aquí se visualizarán las afinidades del grupo.
                </div>
              ) : (
                <div className="space-y-3">
                  {languageStats.map((item) => (
                    <div key={item.name} className="group">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#111111] mb-1">
                        <span className="truncate pr-2">{item.name}</span>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-stone-500">{item.percentage}%</span>
                          <span className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-800 font-bold">
                            {item.count} {item.count === 1 ? 'voto' : 'votos'}
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 group-hover:brightness-90"
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

            {/* Right: Emergent Themes Cloud */}
            <div className="lg:col-span-5">
              <h3 className="text-lg font-black text-[#111111] mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#f8c300]" />
                <span>Temas que están emergiendo</span>
              </h3>
              <p className="text-xs text-[#6e6b66] mb-4">
                Palabras clave e inquietudes repetidas. Haz clic en una etiqueta para filtrar.
              </p>

              {themeKeywords.length === 0 ? (
                <div className="flex flex-wrap gap-2">
                  {['Memoria', 'Territorio', 'Identidad', 'Futuros', 'Naturaleza', 'Comunidad'].map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                  <p className="text-xs text-stone-400 mt-2 block w-full">
                    Las etiquetas iniciales son detonadores de arranque. Se actualizarán con los aportes reales.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {themeKeywords.map((item) => {
                    const isSelected = selectedTagFilter === item.text;
                    return (
                      <button
                        key={item.text}
                        onClick={() =>
                          setSelectedTagFilter(isSelected ? null : item.text)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#7656ff] text-white ring-2 ring-[#7656ff]/40'
                            : item.count > 1
                            ? 'bg-[#eee9ff] text-[#5e48d5] hover:bg-[#ded4ff]'
                            : 'bg-stone-100 text-[#111111] hover:bg-stone-200'
                        }`}
                      >
                        <span>{item.text}</span>
                        {item.count > 1 && (
                          <span className="w-4 h-4 rounded-full bg-white/70 text-[#111111] text-[10px] flex items-center justify-center font-mono">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 p-4 rounded-2xl bg-[#fff9db] border-l-4 border-[#f8c300] text-xs text-stone-800 leading-relaxed">
                <strong>Clave de facilitación:</strong> Observa si hay lenguajes técnicos (como programación o IA) conviviendo con saberes tradicionales o memoria. Esos son los puentes más ricos para explorar en la siguiente fase.
              </div>
            </div>
          </div>
        ) : (
          /* Voices Mosaic View */
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-500">
                Mostrando {displayedContributions.length} aportes compartidos
              </span>
              {selectedTagFilter && (
                <button
                  onClick={() => setSelectedTagFilter(null)}
                  className="text-xs text-[#7656ff] font-bold hover:underline"
                >
                  Ver todos los aportes
                </button>
              )}
            </div>

            {displayedContributions.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-sm">
                No hay aportes que coincidan con el filtro actual.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedContributions.map((c) => (
                  <article
                    key={c.id}
                    className="p-5 rounded-2xl border border-[#dedbd3] bg-stone-50/70 hover:bg-white transition shadow-2xs text-left"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#111111]">
                          {c.alias || 'Participante anónimo'}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded-full">
                          {c.role || 'Participante'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">
                        {new Date(c.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Languages badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(c.languages || []).map((l) => (
                        <span
                          key={l}
                          className="px-2 py-0.5 rounded-full bg-[#eee9ff] text-[#5e48d5] text-[11px] font-bold"
                        >
                          {l}
                        </span>
                      ))}
                    </div>

                    {c.themes && (
                      <div className="mb-2 text-xs text-stone-800">
                        <strong className="text-stone-900 block font-bold mb-0.5">
                          Temas / Inquietudes:
                        </strong>
                        <p className="leading-snug">{c.themes}</p>
                      </div>
                    )}

                    {c.wish && (
                      <div className="mb-2 text-xs text-stone-800">
                        <strong className="text-stone-900 block font-bold mb-0.5">
                          Deseo creativo:
                        </strong>
                        <p className="italic text-stone-700 leading-snug">"{c.wish}"</p>
                      </div>
                    )}

                    {c.memory && (
                      <div className="mb-2 text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200/70">
                        <strong className="text-stone-800 block text-[11px] font-bold mb-0.5">
                          Memoria / Imagen guardada:
                        </strong>
                        <p className="text-[11px] leading-snug">{c.memory}</p>
                      </div>
                    )}

                    {c.resources && (
                      <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-200/60">
                        <span className="font-semibold text-stone-700">Recursos: </span>
                        {c.resources}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Bar: Exports & Management */}
        <div className="mt-8 pt-6 border-t border-[#dedbd3] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] hover:bg-stone-800 text-white rounded-full text-xs font-bold transition cursor-pointer active:scale-98"
              title="Descargar tabla compatible con Excel o Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#f8c300]" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#111111] border border-stone-300 rounded-full text-xs font-bold transition cursor-pointer"
              title="Descargar copia de seguridad en JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-[#7656ff]" />
              <span>Respaldo JSON</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-[#111111] border border-stone-300 rounded-full text-xs font-bold transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-stone-600" />
              <span>Importar JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-full text-xs font-semibold transition cursor-pointer ml-auto"
            title="Borrar únicamente los datos guardados en este navegador"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Borrar datos de este navegador</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] text-stone-500">
          Nota ética: No exportes ni proyectes respuestas identificables sin consentimiento previo. Acuerden con el grupo qué información desean poner en común en la pantalla compartida.
        </p>
      </div>
    </section>
  );
};
