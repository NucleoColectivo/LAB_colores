import React, { useEffect, useState } from 'react';
import { ParticipantContribution, CREATIVE_LANGUAGES, WORKSHOP_STEPS } from '../types';
import { X, Tv, QrCode, Sparkles, Layers, Users, Clock } from 'lucide-react';
import QRCode from 'qrcode';

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
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href, {
        width: 240,
        margin: 1,
        color: { dark: '#111111', light: '#ffffff' }
      }).then(setQrUrl).catch(() => {});
    }
  }, []);

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
              <span className="text-[#f8c300] font-mono text-sm uppercase px-2 py-0.5 rounded bg-stone-900 border border-stone-800">
                PANTALLA DE TALLER
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Sesión 1 · Escuchar y enfocar · Proyección comunitaria en vivo
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-[#7656ff]" />
                <span>Cartografía de Afinidades Creativas</span>
              </h2>
              <span className="text-sm font-bold text-[#f8c300] bg-[#f8c300]/10 px-3 py-1 rounded-full border border-[#f8c300]/30">
                {contributions.length} participantes han sumado sus voces
              </span>
            </div>

            {sortedLanguages.length === 0 ? (
              <div className="py-20 text-center text-stone-500 text-lg">
                Esperando los primeros aportes desde los celulares...
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

          <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>METODOLOGÍA NÚCLEO COLECTIVO</span>
            <span>CREAR CON LO QUE TENEMOS</span>
          </div>
        </div>

        {/* Right: QR Code to scan + Workshop moment */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* QR Code Big Scan Box */}
          <div className="bg-[#f8c300] text-[#111111] rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-lg">
            <span className="text-xs font-black uppercase tracking-widest bg-[#111111] text-[#f8c300] px-3 py-1 rounded-full mb-3">
              ESCANEA CON TU CELULAR
            </span>
            <div className="bg-white p-3 rounded-2xl shadow-sm border-2 border-[#111111] mb-3">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="QR para participar"
                  className="w-44 h-44 object-contain block mx-auto"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center font-mono text-xs text-stone-500">
                  Cargando QR...
                </div>
              )}
            </div>
            <strong className="text-lg font-black leading-tight text-[#111111]">
              Suma tu mirada al taller
            </strong>
            <p className="text-xs font-medium text-stone-800 mt-1">
              Abre la cámara de tu celular y enfoca el código
            </p>
          </div>

          {/* Current Workshop Stage Reminder */}
          <div className="bg-[#161616] border border-stone-800 rounded-3xl p-6 text-stone-300">
            <span className="text-xs font-black uppercase text-[#7656ff] tracking-widest block mb-2">
              RUTA DE LA SESIÓN
            </span>
            <div className="space-y-2.5 text-xs">
              {WORKSHOP_STEPS.map((s, i) => (
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
