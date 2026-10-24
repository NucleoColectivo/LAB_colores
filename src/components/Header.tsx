import React from 'react';
import { Sparkles, Tv, Compass, Layers, Users, QrCode, ExternalLink, Network, MessageCircle } from 'lucide-react';
import { OFFICIAL_WORKSHOP_URL, OFFICIAL_WHATSAPP_GROUP_URL } from '../types';

interface HeaderProps {
  onOpenProjector: () => void;
  contributionCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProjector, contributionCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111111] text-white border-b-4 border-[#f8c300] px-4 sm:px-8 py-3 transition-all shadow-md">
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
              <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block -mt-0.5">
                LABORATORIO DE MEDIOS DIGITALES E IA
              </span>
            </div>
          </a>

          {/* Mobile controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            <a
              href={OFFICIAL_WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#25D366] text-white rounded-full text-xs font-bold"
              title="Grupo de WhatsApp"
              aria-label="Grupo de WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <button
              onClick={onOpenProjector}
              className="flex items-center gap-1 px-3 py-1 bg-[#f8c300] text-[#111111] rounded-full text-xs font-bold"
              aria-label="Abrir modo proyección"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Proyector</span>
            </button>
          </div>
        </div>

        <nav aria-label="Navegación principal" className="flex items-center gap-1 sm:gap-1.5 flex-wrap text-xs sm:text-sm">
          <a
            href="#ruta"
            className="px-2 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-[#f8c300]" />
            <span>Ruta</span>
          </a>
          <a
            href="#participar"
            className="px-2 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5 text-[#ff4fa3]" />
            <span>Participar</span>
          </a>
          <a
            href="#mapa"
            className="px-2 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1 relative"
          >
            <Layers className="w-3.5 h-3.5 text-[#7656ff]" />
            <span>Mapa</span>
            {contributionCount > 0 && (
              <span className="bg-[#7656ff] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {contributionCount}
              </span>
            )}
          </a>
          <a
            href="#comunidad"
            className="px-2 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <Network className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Red</span>
          </a>
          <a
            href="#ideas"
            className="px-2 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f8c300]" />
            <span>Cruces</span>
          </a>
          <a
            href="#conexion"
            className="px-2 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <QrCode className="w-3.5 h-3.5 text-stone-300" />
            <span>QR & Chat</span>
          </a>

          {/* WhatsApp Direct Group Link */}
          <a
            href={OFFICIAL_WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-xs font-bold transition shadow-xs"
            title="Unirme al Grupo de WhatsApp del Taller"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Taller</span>
          </a>

          {/* Desktop projector button */}
          <button
            onClick={onOpenProjector}
            className="hidden md:inline-flex items-center gap-1.5 ml-1 px-3 py-1 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-bold rounded-full text-xs shadow-sm transition active:scale-95 cursor-pointer"
            title="Abrir vista de gran formato para proyectar en muro o pantalla colectiva"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Proyector</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
