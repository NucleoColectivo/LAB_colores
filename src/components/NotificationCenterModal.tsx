import React, { useState, useMemo } from 'react';
import { SparkNotification } from '../types';
import {
  Bell,
  X,
  Zap,
  Check,
  CheckCheck,
  Trash2,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Filter,
  Layers
} from 'lucide-react';
import { isNotificationSoundEnabled, setNotificationSoundEnabled } from '../utils/audioNotification';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SparkNotification[];
  onOpenSpark: (notification: SparkNotification) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  participantNames: string[];
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onOpenSpark,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  participantNames
}) => {
  const [selectedAuthorFilter, setSelectedAuthorFilter] = useState<string>('todos');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [soundOn, setSoundOn] = useState(isNotificationSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setNotificationSoundEnabled(next);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (onlyUnread && notif.read) return false;
      if (selectedAuthorFilter !== 'todos') {
        const matchesAuthor = notif.authors.some(
          (author) => author.toLowerCase().includes(selectedAuthorFilter.toLowerCase())
        );
        if (!matchesAuthor) return false;
      }
      return true;
    });
  }, [notifications, selectedAuthorFilter, onlyUnread]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-center-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-[#181818] text-white border-2 border-stone-700 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#111111] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#f8c300] text-[#111111] flex items-center justify-center font-black shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="notification-center-title" className="text-base sm:text-lg font-black tracking-wide text-white">
                  Notificaciones de Prompts Creativos
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#f8c300] text-[#111111] text-xs font-black">
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Disparadores automáticos de Runway, Midjourney y p5.js según avances de tu mesa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl transition cursor-pointer border ${
                soundOn
                  ? 'bg-stone-800 border-stone-700 text-[#f8c300]'
                  : 'bg-stone-900 border-stone-800 text-stone-500'
              }`}
              title={soundOn ? 'Sonido de aviso activado (clic para silenciar)' : 'Sonido silenciado'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 hover:text-white hover:bg-stone-700 transition cursor-pointer"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and Actions Bar */}
        <div className="p-3 sm:px-5 sm:py-3 bg-stone-900/70 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Author filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-stone-400 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#f8c300]" />
              Filtrar por:
            </span>
            <select
              value={selectedAuthorFilter}
              onChange={(e) => setSelectedAuthorFilter(e.target.value)}
              className="bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-stone-200 outline-none focus:border-[#f8c300] cursor-pointer"
            >
              <option value="todos">Todos los participantes</option>
              {participantNames.map((name) => (
                <option key={name} value={name}>
                  Solo {name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOnlyUnread(!onlyUnread)}
              className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                onlyUnread
                  ? 'bg-[#f8c300] text-[#111111] border-[#f8c300]'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
            >
              {onlyUnread ? '✓ Solo no leídos' : 'Solo no leídos'}
            </button>
          </div>

          {/* Mass actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="inline-flex items-center gap-1 text-stone-300 hover:text-[#f8c300] transition cursor-pointer font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Marcar leídos</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1 text-stone-400 hover:text-rose-400 transition cursor-pointer font-medium ml-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-800 border border-stone-700 text-stone-500 mx-auto flex items-center justify-center mb-3">
                <Bell className="w-7 h-7" />
              </div>
              <h4 className="text-stone-300 font-bold text-sm mb-1">
                {notifications.length === 0
                  ? 'Aún no hay sugerencias de prompts generadas'
                  : 'No hay notificaciones con los filtros seleccionados'}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                Cada vez que se registre un avance colectivo en la mesa de trabajo, el disparador generará
                automáticamente los prompts para Runway, Midjourney y p5.js y te avisará aquí.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const formattedDate = new Date(notif.createdAt).toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    notif.read
                      ? 'bg-stone-900/60 border-stone-800 text-stone-300'
                      : 'bg-[#1e1e1e] border-stone-700 shadow-md ring-1 ring-[#f8c300]/40 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f8c300]/20 text-[#f8c300] border border-[#f8c300]/40 text-[10px] font-black uppercase tracking-wider">
                        <Zap className="w-3 h-3 fill-current" />
                        Chispa 15 Min
                      </span>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#f8c300] animate-pulse" />
                      )}
                    </div>

                    {!notif.read && (
                      <button
                        onClick={() => onMarkAsRead(notif.id)}
                        className="text-[11px] text-stone-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                        title="Marcar como leída"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Leída</span>
                      </button>
                    )}
                  </div>

                  <h4 className="font-black text-sm text-stone-100 mb-1 leading-snug">
                    {notif.advanceTitle}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2 flex-wrap">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    <span className="font-bold text-[#f8c300]">{notif.authors.join(' · ')}</span>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {notif.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Prompt preview */}
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs text-stone-300 font-mono mb-3 leading-relaxed">
                    <div className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#f8c300]" />
                      Extracto sugerencia de prompt:
                    </div>
                    <p className="line-clamp-2 italic text-stone-300">
                      "{notif.previewPrompt}"
                    </p>
                  </div>

                  {/* Open Spark Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-400">
                      Ideal para prototipar en los primeros 15 min de la mesa
                    </span>
                    <button
                      onClick={() => onOpenSpark(notif)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition shadow-sm cursor-pointer active:scale-95"
                    >
                      <span>Abrir Prompts & Código ⚡</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#111111] border-t border-stone-800 text-center text-[11px] text-stone-400 flex items-center justify-between flex-wrap gap-2">
          <span>
            ✦ Núcleo Colectivo — Laboratorio de Medios Digitales e Inteligencia Artificial
          </span>
          <span className="font-mono text-stone-400">
            {notifications.length} {notifications.length === 1 ? 'notificación' : 'notificaciones'}
          </span>
        </div>
      </div>
    </div>
  );
};
