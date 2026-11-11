import React from 'react';

export type SupportedToolBrand =
  | 'chatgpt'
  | 'gemini'
  | 'aistudio'
  | 'claude'
  | 'deepseek'
  | 'midjourney'
  | 'flux'
  | 'runway'
  | 'kling'
  | 'suno'
  | 'udio'
  | 'stableaudio'
  | 'elevenlabs'
  | 'bolt'
  | 'lovable'
  | 'p5js'
  | 'figma'
  | 'capcut'
  | 'canva'
  | 'notion'
  | 'meshy'
  | 'magnific'
  | 'v0'
  | 'perplexity'
  | 'generic';

interface ToolLogoProps {
  brand?: string;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const getBrandFromToolName = (toolName: string): SupportedToolBrand => {
  const norm = toolName.toLowerCase();
  if (norm.includes('chatgpt') || norm.includes('gpt-4') || norm.includes('openai') || norm.includes('dall-e')) return 'chatgpt';
  if (norm.includes('google ai studio')) return 'aistudio';
  if (norm.includes('gemini') || norm.includes('imagen')) return 'gemini';
  if (norm.includes('claude') || norm.includes('anthropic')) return 'claude';
  if (norm.includes('deepseek')) return 'deepseek';
  if (norm.includes('midjourney')) return 'midjourney';
  if (norm.includes('flux') || norm.includes('black forest')) return 'flux';
  if (norm.includes('runway')) return 'runway';
  if (norm.includes('kling')) return 'kling';
  if (norm.includes('suno')) return 'suno';
  if (norm.includes('udio')) return 'udio';
  if (norm.includes('stable audio') || norm.includes('stability')) return 'stableaudio';
  if (norm.includes('elevenlabs') || norm.includes('eleven')) return 'elevenlabs';
  if (norm.includes('bolt')) return 'bolt';
  if (norm.includes('lovable')) return 'lovable';
  if (norm.includes('p5.js') || norm.includes('p5js') || norm.includes('processing')) return 'p5js';
  if (norm.includes('figma')) return 'figma';
  if (norm.includes('capcut')) return 'capcut';
  if (norm.includes('canva')) return 'canva';
  if (norm.includes('notion')) return 'notion';
  if (norm.includes('meshy') || norm.includes('tripo') || norm.includes('spline') || norm.includes('luma')) return 'meshy';
  if (norm.includes('magnific')) return 'magnific';
  if (norm.includes('v0')) return 'v0';
  if (norm.includes('perplexity')) return 'perplexity';
  return 'generic';
};

export const ToolLogo: React.FC<ToolLogoProps> = ({
  brand,
  name,
  className = '',
  size = 'md'
}) => {
  const resolvedBrand: SupportedToolBrand = brand
    ? (brand.toLowerCase() as SupportedToolBrand)
    : name
    ? getBrandFromToolName(name)
    : 'generic';

  const sizeClasses = {
    xs: 'w-4 h-4 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }[size];

  switch (resolvedBrand) {
    case 'chatgpt':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#10a37f] text-white flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title="ChatGPT (OpenAI)"
          aria-label="ChatGPT logo"
        >
          <svg className="w-60% h-60%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.28 10.7a6.22 6.22 0 0 0-.52-5.06 6.36 6.36 0 0 0-4.44-3.23 6.3 6.3 0 0 0-5.4 1.15A6.23 6.23 0 0 0 7.8 2.2 6.36 6.36 0 0 0 3.7 4.7a6.28 6.28 0 0 0-.9 5.48 6.24 6.24 0 0 0-.53 5.06 6.36 6.36 0 0 0 4.45 3.23 6.27 6.27 0 0 0 5.4-1.15 6.22 6.22 0 0 0 4.12 1.36 6.36 6.36 0 0 0 4.1-2.5 6.28 6.28 0 0 0 .94-5.48zm-8.86 10.22a4.93 4.93 0 0 1-3.1-.73l.15-.09 5.17-2.98a.72.72 0 0 0 .36-.62v-7.3l2.2 1.27a.06.06 0 0 1 .03.05v6a4.96 4.96 0 0 1-4.81 4.4zm-9.35-4.14a4.93 4.93 0 0 1-.37-3.17l.16.1 5.17 2.98a.71.71 0 0 0 .72 0l6.32-3.65v2.54a.06.06 0 0 1-.03.05l-5.2 3a4.95 4.95 0 0 1-6.77-1.85zm-1.1-9.92a4.93 4.93 0 0 1 2.73-2.45v6.15a.72.72 0 0 0 .36.62l6.32 3.65-2.2 1.27a.06.06 0 0 1-.06 0l-5.2-3a4.95 4.95 0 0 1-1.95-6.24zm15.42 4.1-6.32-3.65 2.2-1.27a.06.06 0 0 1 .06 0l5.2 3a4.95 4.95 0 0 1 1.95 6.24 4.93 4.93 0 0 1-2.73 2.45v-6.15a.72.72 0 0 0-.36-.62zm2.08-3.08l-.16-.09-5.17-2.98a.71.71 0 0 0-.72 0L8.2 8.44V5.9a.06.06 0 0 1 .03-.05l5.2-3a4.95 4.95 0 0 1 6.77 1.85 4.93 4.93 0 0 1 .37 3.18zM9.54 13.06l-2.2-1.27a.06.06 0 0 1-.03-.05v-6a4.95 4.95 0 0 1 4.81-4.4 4.93 4.93 0 0 1 3.1.73l-.15.09-5.17 2.98a.72.72 0 0 0-.36.62v7.3zm1.18-.68l2.78-1.6 2.78 1.6v3.22L13.5 17.2l-2.78-1.6z" />
          </svg>
        </div>
      );

    case 'gemini':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-[#1B72E8] via-[#8E75FF] to-[#D96570] text-white flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title="Google Gemini"
          aria-label="Google Gemini logo"
        >
          <svg className="w-65% h-65%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.627 5.627-12 12-12-6.627 0-12-5.627-12-12z" />
          </svg>
        </div>
      );

    case 'aistudio':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#1a73e8] text-white flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title="Google AI Studio"
          aria-label="Google AI Studio logo"
        >
          <svg className="w-65% h-65%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      );

    case 'claude':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#D97706] text-white flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title="Claude (Anthropic)"
          aria-label="Claude logo"
        >
          <svg className="w-65% h-65%" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'deepseek':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#1E40AF] text-white flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title="DeepSeek"
          aria-label="DeepSeek logo"
        >
          <svg className="w-65% h-65%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 14c2-4 7-8 12-6 3 1.5 5 4 4 7-1 3-5 5-9 4-3-.8-5-3-7-5zm13-2c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1z" />
          </svg>
        </div>
      );

    case 'midjourney':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#0f172a] text-[#f8c300] border border-stone-700 flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title="Midjourney"
          aria-label="Midjourney logo"
        >
          <svg className="w-65% h-65%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18l8-14 4 14zm11-10l5 10h-6z" />
          </svg>
        </div>
      );

    case 'flux':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-black text-white flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="FLUX (Black Forest Labs)"
          aria-label="FLUX logo"
        >
          <span className="font-mono tracking-tighter text-xs">FLX</span>
        </div>
      );

    case 'runway':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#111111] text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="Runway Gen-3"
          aria-label="Runway logo"
        >
          <span className="font-black font-mono text-xs">R:3</span>
        </div>
      );

    case 'kling':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="Kling AI"
          aria-label="Kling AI logo"
        >
          <span className="font-mono text-xs font-black">KL</span>
        </div>
      );

    case 'suno':
    case 'udio':
    case 'stableaudio':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title={name || 'Audio Generativo'}
          aria-label="Audio tool logo"
        >
          <svg className="w-60% h-60%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
      );

    case 'elevenlabs':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-black text-white flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="ElevenLabs"
          aria-label="ElevenLabs logo"
        >
          <span className="font-black text-xs tracking-widest">II</span>
        </div>
      );

    case 'bolt':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#F59E0B] text-black flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="Bolt.new"
          aria-label="Bolt.new logo"
        >
          <svg className="w-60% h-60%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      );

    case 'lovable':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#EC4899] text-white flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="Lovable"
          aria-label="Lovable logo"
        >
          <svg className="w-60% h-60%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      );

    case 'p5js':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#ED225D] text-white flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="p5.js"
          aria-label="p5.js logo"
        >
          <span className="font-bold text-sm leading-none">*</span>
        </div>
      );

    case 'figma':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#2C2C2C] text-white flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title="Figma"
          aria-label="Figma logo"
        >
          <div className="grid grid-cols-2 gap-0.5 w-60% h-60%">
            <span className="bg-[#F24E1E] rounded-tl-full rounded-bl-full" />
            <span className="bg-[#FF7262] rounded-full" />
            <span className="bg-[#A259FF] rounded-tl-full rounded-bl-full" />
            <span className="bg-[#1ABCFE] rounded-full" />
          </div>
        </div>
      );

    case 'capcut':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-2xs shrink-0 ${className}`}
          title="CapCut"
          aria-label="CapCut logo"
        >
          <svg className="w-60% h-60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 8l8 8 8-8M4 16l8-8 8 8" />
          </svg>
        </div>
      );

    case 'canva':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-[#00C4CC] text-white flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="Canva"
          aria-label="Canva logo"
        >
          <span className="italic font-serif text-sm">C</span>
        </div>
      );

    case 'notion':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-black text-white border border-stone-700 flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title="Notion"
          aria-label="Notion logo"
        >
          <span className="font-serif font-black text-xs">N</span>
        </div>
      );

    default:
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-stone-900 text-[#f8c300] border border-stone-800 flex items-center justify-center font-black shadow-2xs shrink-0 ${className}`}
          title={name || 'Herramienta IA'}
          aria-label="Tool icon"
        >
          <span className="text-xs">✦</span>
        </div>
      );
  }
};
