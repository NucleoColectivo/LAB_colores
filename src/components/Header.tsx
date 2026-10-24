import React from 'react';
import { Sparkles, Tv, Compass, Layers, Users, QrCode } from 'lucide-react';

interface HeaderProps {
  onOpenProjector: () => void;
  contributionCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProjector, contributionCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111111] text-white border-b-4 border-[#f8c300] px-4 sm:px-8 py-3.5 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 text-white no-underline group">
            <span className="w-8 h-8 rounded-lg bg-[#f8c300] text-[#111111] flex items-center justify-center font-black text-lg group-hover:rotate-6 transition-transform">
              ✦
            </span>
            <div className="leading-tight">
              <span className="font-black tracking-wider text-base sm:text-lg block">
                NÚCLEO <span className="text-[#f8c300]">COLECTIVO</span>
              </span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-stone-400 block -mt-0.5">
                LABORATORIO DE IDEAS
              </span>
            </div>
          </a>

          {/* Mobile projector trigger */}
          <button
            onClick={onOpenProjector}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#f8c300] text-[#111111] rounded-full text-xs font-bold hover:bg-[#e5b300] transition"
            aria-label="Abrir modo proyección"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Proyector</span>
          </button>
        </div>

        <nav aria-label="Navegación principal" className="flex items-center gap-1 sm:gap-2 flex-wrap text-xs sm:text-sm">
          <a
            href="#ruta"
            className="px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-[#f8c300]" />
            <span>Ruta</span>
          </a>
          <a
            href="#participar"
            className="px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5 text-[#ff4fa3]" />
            <span>Participar</span>
          </a>
          <a
            href="#mapa"
            className="px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1 relative"
          >
            <Layers className="w-3.5 h-3.5 text-[#7656ff]" />
            <span>Mapa colectivo</span>
            {contributionCount > 0 && (
              <span className="bg-[#7656ff] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {contributionCount}
              </span>
            )}
          </a>
          <a
            href="#ideas"
            className="px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f8c300]" />
            <span>Cruces</span>
          </a>
          <a
            href="#conexion"
            className="px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <QrCode className="w-3.5 h-3.5 text-stone-300" />
            <span>Acceso QR</span>
          </a>

          {/* Desktop projector button */}
          <button
            onClick={onOpenProjector}
            className="hidden md:inline-flex items-center gap-1.5 ml-2 px-3.5 py-1.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-bold rounded-full text-xs shadow-sm transition active:scale-95"
            title="Abrir vista de gran formato para proyectar en muro o pantalla colectiva"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Modo Proyector</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
