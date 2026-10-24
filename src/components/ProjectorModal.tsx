import React, { useEffect, useState } from 'react';
import {
  ParticipantContribution,
  CREATIVE_LANGUAGES,
  WORKSHOP_STEPS,
  OFFICIAL_WORKSHOP_URL,
  OFFICIAL_QR_ASSET_PATH,
  OFFICIAL_WHATSAPP_GROUP_URL,
  OFFICIAL_WHATSAPP_QR_ASSET_PATH
} from '../types';
import { X, Tv, Layers, Users, Clock, MessageCircle, Globe, ExternalLink } from 'lucide-react';

interface ProjectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributions: ParticipantContribution[];
}

export const ProjectorModal: React.FC<ProjectorModalProps> = ({
  isOpen,
  onClose,
  contributions
}) => {
  const [projectorQrMode, setProjectorQrMode] = useState<'whatsapp' | 'web'>('whatsapp');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Compute language frequency
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

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] text-white flex flex-col overflow-y-auto p-4 sm:p-8 animate-in fade-in duration-200">
      {/* Top Bar for Projector */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#f8c300] text-[#111111] flex items-center justify-center font-black text-xl">
            ✦
          </span>
          <div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>NÚCLEO COLECTIVO</span>
              <span className="text-[#f8c300] font-mono text-sm uppercase px-2.5 py-0.5 rounded bg-stone-900 border border-stone-800">
                PANTALLA DE PROYECCIÓN
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Sesión 1 · Escuchar y enfocar · Medios Digitales e Inteligencia Artificial
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-mono text-stone-400">
            Presiona ESC para salir
          </span>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition cursor-pointer"
            aria-label="Cerrar modo proyector"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Grid for Big Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left: Collective Map Visual Bars (Large) */}
        <div className="lg:col-span-8 bg-[#161616] border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-[#7656ff]" />
                <span>Cartografía de Afinidades Creativas</span>
              </h2>
              <span className="text-sm font-bold text-[#f8c300] bg-[#f8c300]/10 px-3 py-1 rounded-full border border-[#f8c300]/30 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{contributions.length} participantes conectados</span>
              </span>
            </div>

            {sortedLanguages.length === 0 ? (
              <div className="py-20 text-center text-stone-500 text-lg">
                Esperando los primeros registros desde lab-colores.vercel.app...
              </div>
            ) : (
              <div className="space-y-4 my-4">
                {sortedLanguages.slice(0, 8).map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-base font-bold text-stone-200 mb-1.5">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-3 font-mono text-sm">
                        <span className="text-stone-400">{item.percentage}%</span>
                        <span className="text-[#f8c300] font-black">{item.count} votos</span>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-stone-800 rounded-full overflow-hidden">
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
          <div className="pt-4 border-t border-stone-800">
            <span className="text-[11px] font-mono uppercase text-stone-400 block mb-2">
              ÚLTIMAS PERSONAS REGISTRADAS EN LA RED:
            </span>
            <div className="flex flex-wrap gap-2">
              {contributions.slice(-6).reverse().map((c) => (
                <span
                  key={c.id}
                  className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#f8c300]" />
                  <strong className="text-white">{c.name || c.alias}</strong>
                  {c.location && <span className="text-stone-400 text-[10px]">({c.location})</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Dual QR Selector (WhatsApp Group vs Web App) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div
            className={`rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-lg transition-colors duration-200 ${
              projectorQrMode === 'whatsapp'
                ? 'bg-[#128C7E] text-white'
                : 'bg-[#f8c300] text-[#111111]'
            }`}
          >
            {/* Toggle QR mode on projector */}
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full mb-3 text-xs font-black">
              <button
                onClick={() => setProjectorQrMode('whatsapp')}
                className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1 ${
                  projectorQrMode === 'whatsapp'
                    ? 'bg-white text-[#128C7E]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <MessageCircle className="w-3 h-3" />
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
                <Globe className="w-3 h-3" />
                <span>Web lab-colores</span>
              </button>
            </div>

            {/* QR Card */}
            <div className="bg-white p-3.5 rounded-2xl shadow-sm border-2 border-black/20 mb-3 max-w-[230px]">
              <img
                src={
                  projectorQrMode === 'whatsapp'
                    ? OFFICIAL_WHATSAPP_QR_ASSET_PATH
                    : OFFICIAL_QR_ASSET_PATH
                }
                alt={
                  projectorQrMode === 'whatsapp'
                    ? 'QR Grupo de WhatsApp'
                    : 'QR Web lab-colores'
                }
                className="w-48 h-48 object-contain block mx-auto rounded-md"
              />
            </div>

            <div
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold mb-1 ${
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
                : 'Suma tu nombre y datos al mapa'}
            </strong>
            <p className="text-xs font-medium opacity-90 mt-0.5">
              {projectorQrMode === 'whatsapp'
                ? 'Escanea con la cámara de WhatsApp'
                : 'Apunta con la cámara de tu celular'}
            </p>
          </div>

          {/* Current Workshop Stage Reminder */}
          <div className="bg-[#161616] border border-stone-800 rounded-3xl p-6 text-stone-300">
            <span className="text-xs font-black uppercase text-[#7656ff] tracking-widest block mb-2">
              RUTA DE LA SESIÓN
            </span>
            <div className="space-y-2 text-xs">
              {WORKSHOP_STEPS.map((s) => (
                <div
                  key={s.num}
                  className="flex items-center justify-between p-2 rounded-xl bg-stone-900 border border-stone-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-800 text-[#f8c300] text-[10px] font-bold flex items-center justify-center">
                      {s.num}
                    </span>
                    <strong className="text-white text-xs">{s.title}</strong>
                  </div>
                  <span className="text-stone-400 font-mono text-[11px]">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
