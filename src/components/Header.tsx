import React from 'react';
import { Sparkles, Tv, Compass, Layers, Users, QrCode, ExternalLink, Network, MessageCircle, HelpCircle, Bell, Zap, User, ShieldCheck, Cpu } from 'lucide-react';
import { OFFICIAL_WORKSHOP_URL, OFFICIAL_WHATSAPP_GROUP_URL } from '../types';

export type AppSection = 'bienvenida' | 'herramientas' | 'sistema' | 'avances' | 'conexion';

interface HeaderProps {
  onOpenProjector: () => void;
  onOpenWelcome: () => void;
  onOpenNotifications: () => void;
  onOpenUserProfile?: () => void;
  currentUserName?: string;
  contributionCount: number;
  unreadNotificationCount: number;
  activeSection?: AppSection;
  onNavigateSection?: (section: AppSection) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProjector,
  onOpenWelcome,
  onOpenNotifications,
  onOpenUserProfile,
  currentUserName = 'Manuel Palacio',
  contributionCount,
  unreadNotificationCount,
  activeSection = 'bienvenida',
  onNavigateSection
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111111] text-white border-b-4 border-[#f8c300] px-4 sm:px-8 py-3 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateSection ? onNavigateSection('bienvenida') : (window.location.hash = '#bienvenida')}
            className="flex items-center gap-2.5 text-white no-underline group text-left cursor-pointer"
          >
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
          </button>

          {/* Mobile controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            {onOpenUserProfile && (
              <button
                onClick={onOpenUserProfile}
                className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-[#f8c300] hover:text-[#111111] text-[#f8c300] border border-[#f8c300]/40 rounded-full text-xs font-mono font-bold transition cursor-pointer"
                title="Mi Carnet QR y Datos Protegidos"
                aria-label="Abrir Carnet QR"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[70px] truncate">{currentUserName.split(' ')[0]}</span>
              </button>
            )}
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 bg-stone-800 text-[#f8c300] rounded-full text-xs font-bold"
              title="Notificaciones de prompts creativos"
              aria-label="Ver avisos de prompts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#111111]">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>
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

        {/* Mobile Section Switcher */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto scrollbar-none py-1 border-t border-stone-800 text-xs font-mono font-bold">
          <button
            onClick={() => onNavigateSection ? onNavigateSection('bienvenida') : (window.location.hash = '#bienvenida')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeSection === 'bienvenida'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300'
            }`}
          >
            <span>01. Bienvenida</span>
          </button>
          <button
            onClick={() => onNavigateSection ? onNavigateSection('herramientas') : (window.location.hash = '#herramientas-ia')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeSection === 'herramientas'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>02. Herramientas</span>
          </button>
          <button
            onClick={() => onNavigateSection ? onNavigateSection('sistema') : (window.location.hash = '#sistema-creativo')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeSection === 'sistema'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>03. Sistema</span>
          </button>
          <button
            onClick={() => onNavigateSection ? onNavigateSection('avances') : (window.location.hash = '#co-creacion')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeSection === 'avances'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>04. Avances</span>
          </button>
          <button
            onClick={() => onNavigateSection ? onNavigateSection('conexion') : (window.location.hash = '#conexion')}
            className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSection === 'conexion'
                ? 'bg-[#f8c300] text-[#111111]'
                : 'bg-stone-900 text-stone-300'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>05. QR</span>
          </button>
        </div>

        {/* Desktop Navigation Bar */}
        <nav aria-label="Navegación de secciones del taller" className="hidden md:flex items-center gap-1 sm:gap-1.5 flex-wrap text-xs sm:text-sm">
          <button
            onClick={() => onNavigateSection ? onNavigateSection('bienvenida') : (window.location.hash = '#bienvenida')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-bold cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'bienvenida'
                ? 'bg-[#f8c300] text-[#111111] shadow-xs ring-2 ring-[#f8c300]/50'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Bienvenida, manifiesto, 4 momentos y programa de 5 clases"
          >
            <span className="font-mono text-xs">01.</span>
            <span>Bienvenida & Ruta</span>
          </button>

          <button
            onClick={() => onNavigateSection ? onNavigateSection('herramientas') : (window.location.hash = '#herramientas-ia')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-bold cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'herramientas'
                ? 'bg-[#f8c300] text-[#111111] shadow-xs ring-2 ring-[#f8c300]/50'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Herramientas IA organizadas por temas y necesidades del taller"
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeSection === 'herramientas' ? 'text-[#111111]' : 'text-[#f8c300]'}`} />
            <span>02. Herramientas IA</span>
          </button>

          <button
            onClick={() => onNavigateSection ? onNavigateSection('sistema') : (window.location.hash = '#sistema-creativo')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-bold cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'sistema'
                ? 'bg-[#f8c300] text-[#111111] shadow-xs ring-2 ring-[#f8c300]/50'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Sistema de Creación Asistida por IA: De la intención a la obra"
          >
            <Compass className={`w-3.5 h-3.5 ${activeSection === 'sistema' ? 'text-[#111111]' : 'text-[#f8c300]'}`} />
            <span>03. Sistema Creativo</span>
          </button>

          <button
            onClick={() => onNavigateSection ? onNavigateSection('avances') : (window.location.hash = '#co-creacion')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-bold cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'avances'
                ? 'bg-[#f8c300] text-[#111111] shadow-xs ring-2 ring-[#f8c300]/50'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Avances y entregables del taller"
          >
            <Layers className={`w-3.5 h-3.5 ${activeSection === 'avances' ? 'text-[#111111]' : 'text-[#f8c300]'}`} />
            <span>04. Avances ({contributionCount})</span>
          </button>

          <button
            onClick={() => onNavigateSection ? onNavigateSection('conexion') : (window.location.hash = '#conexion')}
            className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 font-bold cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === 'conexion'
                ? 'bg-[#f8c300] text-[#111111] shadow-xs ring-2 ring-[#f8c300]/50'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Códigos QR y conexión en vivo"
          >
            <QrCode className="w-3.5 h-3.5 text-stone-300" />
            <span>05. Conexión QR</span>
          </button>

          {/* Desktop Notification Center button */}
          <button
            onClick={onOpenNotifications}
            className="relative px-2.5 py-1.5 rounded-lg text-stone-200 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5 font-bold cursor-pointer whitespace-nowrap shrink-0 ml-1"
            title="Avisos de sugerencias de prompt para la mesa de trabajo"
          >
            <Bell className={`w-3.5 h-3.5 ${unreadNotificationCount > 0 ? 'text-[#f8c300] animate-pulse' : 'text-stone-300'}`} />
            <span>Prompts 15m</span>
            {unreadNotificationCount > 0 ? (
              <span className="bg-[#f8c300] text-[#111111] text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                {unreadNotificationCount}
              </span>
            ) : null}
          </button>

          {/* User Profile & Carnet QR Button */}
          {onOpenUserProfile && (
            <button
              onClick={onOpenUserProfile}
              className="px-2.5 py-1 bg-stone-900 hover:bg-[#f8c300] hover:text-[#111111] text-[#f8c300] border border-[#f8c300]/40 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs group whitespace-nowrap shrink-0"
              title="Ver mi Carnet QR de pase y editar mis datos personales protegidos"
            >
              <User className="w-3.5 h-3.5 text-[#f8c300] group-hover:text-[#111111]" />
              <span className="hidden lg:inline">{currentUserName}</span>
              <span className="lg:hidden">{currentUserName.split(' ')[0]}</span>
              <span className="text-[10px] px-1 py-0.2 bg-[#f8c300]/20 group-hover:bg-[#111111]/20 rounded text-[#f8c300] group-hover:text-[#111111]">
                QR
              </span>
            </button>
          )}

          {/* WhatsApp Direct Group Link */}
          <a
            href={OFFICIAL_WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-xs font-bold transition shadow-xs whitespace-nowrap shrink-0"
            title="Unirme al Grupo de WhatsApp del Taller"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Desktop projector button */}
          <button
            onClick={onOpenProjector}
            className="hidden md:inline-flex items-center gap-1.5 ml-1 px-3 py-1 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-bold rounded-full text-xs shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            title="Abrir pantalla de proyección con temporizador de 15 min, ruleta de cruces y mapa"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Proyector</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
