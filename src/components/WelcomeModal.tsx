import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  X,
  Compass,
  Users,
  MessageCircle,
  ArrowRight,
  HeartHandshake,
  Cpu,
  Palette,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import {
  OFFICIAL_WORKSHOP_URL,
  OFFICIAL_WHATSAPP_GROUP_URL,
  OFFICIAL_WHATSAPP_QR_ASSET_PATH
} from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartParticipation: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onStartParticipation
}) => {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#f5f3ee] text-[#111111] border-2 border-[#111111] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 transition cursor-pointer"
          aria-label="Cerrar bienvenida"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] text-[#f8c300] text-xs font-black uppercase tracking-wider mb-4">
          <span>✦ NÚCLEO COLECTIVO</span>
          <span className="text-stone-400 font-normal">|</span>
          <span className="text-white">SESIÓN 01</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
          ¡Te damos la bienvenida al <span className="text-[#7656ff]">Laboratorio de Medios Digitales e IA!</span>
        </h2>

        <p className="text-sm sm:text-base text-[#45423d] leading-relaxed mb-6">
          Este no es un curso técnico tradicional. Es un espacio de encuentro para cruzar memoria, territorio, artes visuales, sonido y tecnología comunitaria. Aquí <strong>no necesitas experiencia previa</strong>: creamos a partir de lo que somos y tenemos a la mano.
        </p>

        {/* 3 Pillars of the Laboratory */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#fff1a8] text-[#8a6800] flex items-center justify-center mb-2 font-bold">
              <Palette className="w-4 h-4" />
            </div>
            <strong className="text-xs font-black text-stone-900 block mb-1">
              1. Escuchar y reconocer
            </strong>
            <p className="text-[11px] text-stone-600 leading-tight">
              Identificamos historias, recuerdos barriales y lenguajes afines.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#eee9ff] text-[#5e48d5] flex items-center justify-center mb-2 font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <strong className="text-xs font-black text-stone-900 block mb-1">
              2. IA y medios críticos
            </strong>
            <p className="text-[11px] text-stone-600 leading-tight">
              Experimentamos con modelos generativos sin mitos ni tecnicismos vacíos.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 font-bold">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <strong className="text-xs font-black text-stone-900 block mb-1">
              3. Co-creación en red
            </strong>
            <p className="text-[11px] text-stone-600 leading-tight">
              Conectamos saberes diversos para imaginar futuros posibles juntos.
            </p>
          </div>
        </div>

        {/* How to participate in 2 steps */}
        <div className="p-4 bg-white rounded-2xl border-l-4 border-[#f8c300] border-stone-200 mb-6 text-xs text-stone-800 space-y-1.5">
          <strong className="text-stone-900 font-bold block text-sm">
            ¿Cómo empezamos la jornada?
          </strong>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#f8c300] text-[#111111] text-[10px] font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span>Completa la ficha inicial seleccionando hasta 3 lenguajes artísticos que te convoquen.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span>Únete al grupo de WhatsApp del taller para recibir lecturas, prompts y compartir imágenes.</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onStartParticipation();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-sm transition shadow-sm cursor-pointer"
            >
              <span>Comenzar mi ficha participativa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <a
            href={OFFICIAL_WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full text-xs sm:text-sm transition shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Unirme a WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
