import React, { useState } from 'react';
import { ArrowDown, Clock, Compass, Sparkles, CheckCircle2, Globe, Users, ExternalLink, QrCode, Smartphone } from 'lucide-react';
import { OFFICIAL_WORKSHOP_URL, OFFICIAL_WHATSAPP_GROUP_URL } from '../types';

interface HeroProps {
  onScrollToForm: () => void;
  onScrollToQr: () => void;
  onScrollToMap: () => void;
  onScrollToNetwork: () => void;
  onScrollToCoCreation?: () => void;
  onOpenWelcome: () => void;
  totalContributions: number;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToForm,
  onScrollToQr,
  onScrollToMap,
  onScrollToNetwork,
  onScrollToCoCreation,
  onOpenWelcome,
  totalContributions
}) => {
  const [orbSymbols, setOrbSymbols] = useState(['✳', '◉', '✦']);

  const cycleSymbols = () => {
    const glyphs = ['✳', '◉', '✦', '▲', '●', '◈', '☼', '◓', '❖', '✺'];
    const s1 = glyphs[Math.floor(Math.random() * glyphs.length)];
    const s2 = glyphs[Math.floor(Math.random() * glyphs.length)];
    const s3 = glyphs[Math.floor(Math.random() * glyphs.length)];
    setOrbSymbols([s1, s2, s3]);
  };

  return (
    <section className="pt-8 sm:pt-14 pb-10 border-b border-[#dedbd3]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Narrative & Action */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={onOpenWelcome}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eee9ff] hover:bg-[#ded4ff] text-[#5e48d5] text-xs font-black uppercase tracking-widest transition cursor-pointer"
              title="Haz clic para ver la bienvenida general y los principios del laboratorio"
            >
              <span className="w-2 h-2 rounded-full bg-[#7656ff] animate-ping" />
              <span>Sesión 1 · Bienvenida al Laboratorio ✦</span>
            </button>

            <a
              href={OFFICIAL_WORKSHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff9db] border border-[#f8c300]/40 text-[#111111] text-xs font-mono font-bold hover:bg-[#fff2a8] transition"
            >
              <Globe className="w-3 h-3 text-[#f8c300]" />
              <span>lab-colores.vercel.app</span>
              <ExternalLink className="w-2.5 h-2.5 text-stone-500" />
            </a>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.94] text-[#111111] mb-5">
            Las ideas empiezan <em className="not-italic text-[#7656ff]">con nosotros.</em>
          </h1>

          <p className="text-base sm:text-lg text-[#45423d] leading-relaxed max-w-2xl mb-6">
            Un espacio para compartir intereses, recuerdos, preguntas y posibilidades. Escanea los códigos QR para ingresar desde tu celular, registrar tu nombre y conectar con la red de creadores.
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dedbd3] bg-white text-xs font-semibold text-[#111111] shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#5e48d5]" />
              9:00 a. m. – 12:30 p. m.
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dedbd3] bg-white text-xs font-semibold text-[#111111] shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-[#f8c300]" />
              Escuchar · Enfocar
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dedbd3] bg-white text-xs font-semibold text-[#111111] shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Conexión para participantes
            </span>
          </div>

          {/* Action buttons: QRs FIRST, then form, then WhatsApp */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onScrollToQr}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-sm sm:text-base transition transform active:scale-98 shadow-sm cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Escanear QR y conectar ↓</span>
            </button>

            <a
              href={OFFICIAL_WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full text-sm sm:text-base transition shadow-xs cursor-pointer"
            >
              <span>WhatsApp del taller</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onScrollToForm}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 bg-stone-100 hover:bg-stone-200 text-[#111111] border border-stone-300 font-bold rounded-full text-sm transition cursor-pointer"
            >
              <span>Llenar ficha aquí</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onScrollToNetwork}
              className="inline-flex items-center gap-2 px-4 py-3.5 bg-white hover:bg-stone-100 text-[#111111] border border-[#dedbd3] font-bold rounded-full text-sm transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#7656ff]" />
              <span>Red ({totalContributions})</span>
            </button>

            {onScrollToCoCreation && (
              <button
                onClick={onScrollToCoCreation}
                className="inline-flex items-center gap-1.5 px-4 py-3.5 bg-[#eee9ff] hover:bg-[#ded4ff] text-[#5e48d5] font-black rounded-full text-sm transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#7656ff]" />
                <span>Unir ideas y avances ↓</span>
              </button>
            )}

            <a
              href="#sistema-creativo"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 bg-[#f8c300]/20 hover:bg-[#f8c300]/35 text-[#111111] border border-[#f8c300] font-black rounded-full text-sm transition cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#111111]" />
              <span>Sistema Creativo IA ↓</span>
            </a>
          </div>
        </div>

        {/* Right Column: Visual Manifesto Card */}
        <div className="lg:col-span-5">
          <div
            onClick={cycleSymbols}
            className="group relative bg-[#f8c300] text-[#111111] rounded-3xl p-7 sm:p-9 shadow-md border-2 border-[#111111] rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[300px]"
            title="Haz clic para mutar los glifos creativos"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="font-mono text-xs uppercase tracking-widest font-black bg-[#111111] text-[#f8c300] px-2.5 py-1 rounded-md">
                MANIFIESTO
              </div>
              <span className="text-xs font-bold text-stone-900/70 group-hover:text-stone-900 transition">
                Toca para mutar ⟳
              </span>
            </div>

            <div className="my-6">
              <div className="text-5xl sm:text-6xl tracking-widest font-mono font-black mb-4 select-none transition-all duration-300">
                {orbSymbols.join(' ')}
              </div>
              <blockquote className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[#111111]">
                Crear con lo que tenemos.
                <br />
                <span className="underline decoration-wavy decoration-[#111111]/30">
                  Imaginar lo que podemos ser.
                </span>
              </blockquote>
            </div>

            <div className="pt-4 border-t border-[#111111]/20 flex items-center justify-between text-xs font-semibold">
              <span>Núcleo Colectivo</span>
              <span className="text-[#111111]/80 font-mono">lab-colores.vercel.app</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
