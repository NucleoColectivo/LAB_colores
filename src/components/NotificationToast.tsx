import React, { useEffect, useState } from 'react';
import { SparkNotification } from '../types';
import { Zap, X, ArrowRight, Volume2, VolumeX, Sparkles, Clock } from 'lucide-react';
import { isNotificationSoundEnabled, setNotificationSoundEnabled } from '../utils/audioNotification';

interface NotificationToastProps {
  notification: SparkNotification | null;
  onOpenSpark: (notification: SparkNotification) => void;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onOpenSpark,
  onDismiss
}) => {
  const [soundOn, setSoundOn] = useState(isNotificationSoundEnabled());
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!notification) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 8000; // 8 seconds
    const intervalTime = 80;
    const decrement = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= decrement) {
            clearInterval(timer);
            onDismiss();
            return 0;
          }
          return prev - decrement;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [notification, isPaused, onDismiss]);

  if (!notification) return null;

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !soundOn;
    setSoundOn(next);
    setNotificationSoundEnabled(next);
  };

  return (
    <aside
      aria-label="Notificación de nueva sugerencia de prompt"
      aria-live="polite"
      className="fixed top-18 right-3 sm:right-6 z-50 max-w-md w-[calc(100%-1.5rem)] bg-[#111111] text-white rounded-2xl border-2 border-[#f8c300] shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress timer bar */}
      <div className="h-1 bg-stone-800 w-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#f8c300] via-[#ff4fa3] to-[#7656ff] transition-all linear duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        {/* Header line */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f8c300] text-[#111111] font-black">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#f8c300]">
              Nueva sugerencia de prompt generada
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleSound}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title={soundOn ? 'Silenciar sonidos de aviso' : 'Activar sonido de aviso'}
              aria-label={soundOn ? 'Silenciar avisos' : 'Activar sonido'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#f8c300]" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onDismiss}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title="Cerrar aviso"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advance title & authors */}
        <h4 className="font-bold text-sm text-stone-100 line-clamp-2 mb-1.5 leading-snug">
          {notification.advanceTitle}
        </h4>

        <div className="flex items-center gap-2 text-xs text-stone-400 mb-2 flex-wrap">
          <span className="text-[#f8c300] font-medium">
            {notification.authors.join(' · ')}
          </span>
          <span>•</span>
          <span className="text-stone-400 text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3" /> hace un instante
          </span>
        </div>

        {/* Categories tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {notification.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300"
            >
              {cat}
            </span>
          ))}
          {notification.categories.length > 3 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-800 text-stone-400">
              +{notification.categories.length - 3}
            </span>
          )}
        </div>

        {/* Preview of prompt */}
        <p className="text-xs text-stone-300 bg-stone-900/90 border border-stone-800 p-2.5 rounded-xl italic mb-3 line-clamp-2">
          "{notification.previewPrompt}"
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-800">
          <span className="text-[11px] text-stone-400 font-mono">
            Runway · Midjourney · p5.js
          </span>
          <button
            onClick={() => onOpenSpark(notification)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition shadow-md cursor-pointer active:scale-95"
          >
            <span>Ver Prompt (15 min)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
