import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, Compass, Layers, Clock, QrCode, ArrowRight, Tv, User, ExternalLink } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WelcomeSection } from './components/WelcomeSection';
import { WorkshopRoute } from './components/WorkshopRoute';
import { ConnectionQR } from './components/ConnectionQR';
import { AiToolsSection } from './components/AiToolsSection';
import { CreativeSystemSection } from './components/creativeSystem/CreativeSystemSection';
import { CoCreationAdvances } from './components/CoCreationAdvances';
import { ProjectorModal } from './components/ProjectorModal';
import { WelcomeModal } from './components/WelcomeModal';
import { SparkModal } from './components/SparkModal';
import { NotificationToast } from './components/NotificationToast';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { UserAuthProfileModal } from './components/UserAuthProfileModal';
import { Footer } from './components/Footer';
import {
  ParticipantContribution,
  INITIAL_SEED_DATA,
  WorkshopAdvance,
  INITIAL_SEED_ADVANCES,
  SparkNotification,
  CreativeSpark
} from './types';
import { generateCreativeSpark } from './utils/sparkGenerator';
import { playSparkChime } from './utils/audioNotification';

const STORAGE_KEY = 'nucleo-lab-aportes-v2';
const ADVANCES_STORAGE_KEY = 'nucleo-lab-avances-v2';
const NOTIFICATIONS_STORAGE_KEY = 'nucleo-lab-notifs-v2';
const WELCOME_SEEN_KEY = 'nucleo-lab-welcome-seen-v1';
const CURRENT_USER_KEY = 'nucleo-lab-current-user-id';

// Demo entries that must be purged so only real participants + Manuel are shown
const isDemoPerson = (name?: string) =>
  name === 'Lucía Morales Mendoza' || name === 'Camilo Rengifo Ortiz';

// Helper to construct a notification from an advance
const createNotificationFromAdvance = (adv: WorkshopAdvance, isRead = false): SparkNotification => {
  const spark = generateCreativeSpark({
    title: adv.title,
    categories: adv.commonPoints && adv.commonPoints.length > 0 ? adv.commonPoints : ['Imagen', 'Interactivo'],
    individualIdea: adv.individualIdea || '',
    collectiveIntersection: adv.collectiveIntersection || '',
    authors: adv.authors || ['Participante del taller']
  });

  const preview = spark.runway?.prompt && spark.runway.prompt.length > 0
    ? spark.runway.prompt
    : (spark.midjourney?.prompt || 'Prompt generado para el avance');

  return {
    id: `notif-${adv.id}-${Date.now()}`,
    advanceId: adv.id,
    title: `Sugerencia de prompt para: ${adv.title}`,
    advanceTitle: adv.title,
    authors: adv.authors,
    categories: adv.commonPoints || [],
    spark,
    createdAt: adv.createdAt || new Date().toISOString(),
    read: isRead,
    previewPrompt: preview.slice(0, 130) + '...'
  };
};

export type AppSection = 'bienvenida' | 'herramientas' | 'sistema' | 'avances' | 'conexion';

const parseHashToSection = (): AppSection => {
  if (typeof window === 'undefined') return 'bienvenida';
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('herramienta')) return 'herramientas';
  if (hash.includes('sistema')) return 'sistema';
  if (hash.includes('avance') || hash.includes('co-creacion')) return 'avances';
  if (hash.includes('conexion') || hash.includes('qr')) return 'conexion';
  if (hash.includes('bienvenida') || hash.includes('ruta')) return 'bienvenida';
  return 'bienvenida';
};

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(() => parseHashToSection());

  useEffect(() => {
    const onHashChange = () => {
      setActiveSection(parseHashToSection());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigateSection = (section: AppSection) => {
    setActiveSection(section);
    const hashMap: Record<AppSection, string> = {
      bienvenida: '#bienvenida',
      herramientas: '#herramientas-ia',
      sistema: '#sistema-creativo',
      avances: '#co-creacion',
      conexion: '#conexion'
    };
    try {
      history.replaceState(null, '', hashMap[section]);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [contributions, setContributions] = useState<ParticipantContribution[]>(INITIAL_SEED_DATA);
  const [advances, setAdvances] = useState<WorkshopAdvance[]>(INITIAL_SEED_ADVANCES);
  const [notifications, setNotifications] = useState<SparkNotification[]>(() => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    // Initial notification for baseline advance
    return INITIAL_SEED_ADVANCES.map((adv) => createNotificationFromAdvance(adv, false));
  });

  const [activeToast, setActiveToast] = useState<SparkNotification | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isSparkModalOpen, setIsSparkModalOpen] = useState(false);
  const [activeSparkData, setActiveSparkData] = useState<{
    spark: CreativeSpark;
    title: string;
    context: string;
  } | null>(null);

  const [isProjectorOpen, setIsProjectorOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Active current user state (defaults to Manuel Palacio or saved ID)
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) return saved;
    } catch {}
    return '1719820000000';
  });
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [userProfileTab, setUserProfileTab] = useState<'carnet' | 'edit' | 'switch'>('carnet');

  const lastSyncCount = useRef<number>(0);
  const knownAdvanceIds = useRef<Set<string>>(new Set(INITIAL_SEED_ADVANCES.map((a) => String(a.id))));
  const isFirstLoad = useRef(true);

  // Determine current active user
  const currentUser = useMemo(() => {
    const found = contributions.find((c) => String(c.id) === String(currentUserId));
    return found || contributions[0] || INITIAL_SEED_DATA[0];
  }, [contributions, currentUserId]);

  const handleSelectUser = (user: ParticipantContribution) => {
    setCurrentUserId(String(user.id));
    try {
      localStorage.setItem(CURRENT_USER_KEY, String(user.id));
    } catch {}
  };

  const handleOpenUserProfileModal = (tab: 'carnet' | 'edit' | 'switch' = 'carnet') => {
    setUserProfileTab(tab);
    setIsUserProfileOpen(true);
  };

  // Save notifications to localStorage
  const saveNotifications = (newNotifs: SparkNotification[]) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifs));
    } catch {}
  };

  // Fetch from server /api/contributions
  const fetchContributionsFromServer = async () => {
    try {
      const res = await fetch('/api/contributions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const realData = data.filter((c: ParticipantContribution) => !isDemoPerson(c.name));
          setContributions(realData.length > 0 ? realData : INITIAL_SEED_DATA);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(realData.length > 0 ? realData : INITIAL_SEED_DATA));
          } catch {}
          lastSyncCount.current = realData.length;
          return;
        }
      }
    } catch (e) {
      // Fallback to localStorage
    }

    // LocalStorage fallback
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const realData = parsed.filter((c: ParticipantContribution) => !isDemoPerson(c.name));
          setContributions(realData.length > 0 ? realData : INITIAL_SEED_DATA);
          return;
        }
      }
    } catch {}

    setContributions(INITIAL_SEED_DATA);
  };

  // Fetch from server /api/advances
  const fetchAdvancesFromServer = async () => {
    try {
      const res = await fetch('/api/advances');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const realAdvances = data.filter((a: WorkshopAdvance) => a.id !== 'adv-2' && a.id !== 'adv-3');
          setAdvances(realAdvances.length > 0 ? realAdvances : INITIAL_SEED_ADVANCES);
          try {
            localStorage.setItem(ADVANCES_STORAGE_KEY, JSON.stringify(realAdvances.length > 0 ? realAdvances : INITIAL_SEED_ADVANCES));
          } catch {}

          // Check if any advance is new to trigger notification
          if (!isFirstLoad.current) {
            const newlyDetected = realAdvances.filter((a: WorkshopAdvance) => !knownAdvanceIds.current.has(String(a.id)));
            if (newlyDetected.length > 0) {
              const newNotifs = newlyDetected.map((adv: WorkshopAdvance) => createNotificationFromAdvance(adv, false));
              setNotifications((prev) => {
                const updated = [...newNotifs, ...prev];
                try {
                  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
                } catch {}
                return updated;
              });
              // Show toast for the latest one
              setActiveToast(newNotifs[0]);
              playSparkChime();
            }
          }

          // Update known IDs
          realAdvances.forEach((a: WorkshopAdvance) => knownAdvanceIds.current.add(String(a.id)));
          isFirstLoad.current = false;
          return;
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem(ADVANCES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const realAdvances = parsed.filter((a: WorkshopAdvance) => a.id !== 'adv-2' && a.id !== 'adv-3');
          setAdvances(realAdvances.length > 0 ? realAdvances : INITIAL_SEED_ADVANCES);
          realAdvances.forEach((a: WorkshopAdvance) => knownAdvanceIds.current.add(String(a.id)));
          isFirstLoad.current = false;
          return;
        }
      }
    } catch {}

    setAdvances(INITIAL_SEED_ADVANCES);
    isFirstLoad.current = false;
  };

  // Notification handlers
  const handleOpenSparkFromNotification = (notif: SparkNotification) => {
    // Mark as read
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n));
    saveNotifications(updated);

    setActiveSparkData({
      spark: notif.spark,
      title: notif.advanceTitle,
      context: `Sugerencia detonada para: ${notif.authors.join(' · ')} (${notif.categories.join(', ')})`
    });
    setIsSparkModalOpen(true);
    if (activeToast?.id === notif.id) {
      setActiveToast(null);
    }
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleClearAllNotifications = () => {
    saveNotifications([]);
    setActiveToast(null);
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const participantNames = useMemo(() => {
    const names = contributions.map((c) => c.name || c.alias).filter(Boolean);
    return Array.from(new Set(names)) as string[];
  }, [contributions]);

  // Initial load and real-time polling every 3.5 seconds
  useEffect(() => {
    fetchContributionsFromServer();
    fetchAdvancesFromServer();

    const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!welcomeSeen) {
      setIsWelcomeOpen(true);
    }

    // Polling interval for live multi-device synchronization
    const interval = setInterval(() => {
      fetchContributionsFromServer();
      fetchAdvancesFromServer();
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleCloseWelcome = () => {
    setIsWelcomeOpen(false);
    try {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    } catch {}
  };

  // Save changes locally and to backend server
  const saveContributions = async (data: ParticipantContribution[], newRecord?: ParticipantContribution) => {
    setContributions(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}

    if (newRecord) {
      setIsSyncing(true);
      try {
        await fetch('/api/contributions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
        });
      } catch (err) {
        console.error('Error syncing to server:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleSubmitContribution = async (newRecord: ParticipantContribution) => {
    // Check if duplicate ID exists, otherwise append
    const exists = contributions.some((c) => String(c.id) === String(newRecord.id));
    const updated = exists
      ? contributions.map((c) => (String(c.id) === String(newRecord.id) ? newRecord : c))
      : [newRecord, ...contributions];

    await saveContributions(updated, newRecord);

    // If new contribution was submitted, set as current user
    setCurrentUserId(String(newRecord.id));
    try {
      localStorage.setItem(CURRENT_USER_KEY, String(newRecord.id));
    } catch {}

    const networkSection = document.getElementById('comunidad');
    if (networkSection) {
      setTimeout(() => {
        networkSection.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
  };

  const handleUpdateUserProfile = async (updatedUser: ParticipantContribution) => {
    const updated = contributions.map((c) => (String(c.id) === String(updatedUser.id) ? updatedUser : c));
    await saveContributions(updated, updatedUser);
  };

  const handleClearAll = async () => {
    if (
      window.confirm(
        '¿Deseas borrar los aportes y participantes guardados en este navegador y en el servidor? Esta acción no se puede deshacer.'
      )
    ) {
      try {
        await fetch('/api/contributions', { method: 'DELETE' });
      } catch {}
      saveContributions([]);
    }
  };

  const handleLoadSeedData = async () => {
    for (const item of INITIAL_SEED_DATA) {
      try {
        await fetch('/api/contributions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch {}
    }
    saveContributions(INITIAL_SEED_DATA);
  };

  const handleImportJson = async (imported: ParticipantContribution[]) => {
    const existingIds = new Set(contributions.map((c) => String(c.id)));
    const filteredNew = imported.filter((item) => !existingIds.has(String(item.id)));
    for (const item of filteredNew) {
      try {
        await fetch('/api/contributions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch {}
    }
    saveContributions([...filteredNew, ...contributions]);
  };

  const handleAddAdvance = async (newAdvance: WorkshopAdvance) => {
    const updated = [newAdvance, ...advances.filter((a) => String(a.id) !== String(newAdvance.id))];
    setAdvances(updated);
    knownAdvanceIds.current.add(String(newAdvance.id));
    try {
      localStorage.setItem(ADVANCES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    // Detonar notificación y sugerencia de prompt generativo
    const newNotif = createNotificationFromAdvance(newAdvance, false);
    const updatedNotifs = [newNotif, ...notifications.filter((n) => n.advanceId !== newAdvance.id)];
    saveNotifications(updatedNotifs);
    setActiveToast(newNotif);
    playSparkChime();

    try {
      await fetch('/api/advances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdvance),
      });
    } catch (e) {
      console.error('Error saving advance to server:', e);
    }
  };

  const handleDeleteAdvance = async (id: string | number) => {
    const updated = advances.filter((a) => String(a.id) !== String(id));
    setAdvances(updated);
    try {
      localStorage.setItem(ADVANCES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`/api/advances/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error deleting advance on server:', e);
    }
  };

  const handleRefresh = () => {
    fetchContributionsFromServer();
    fetchAdvancesFromServer();
  };

  const scrollToQr = () => {
    const el = document.getElementById('conexion');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    const el = document.getElementById('participar');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMap = () => {
    const el = document.getElementById('mapa');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToNetwork = () => {
    const el = document.getElementById('comunidad');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCoCreation = () => {
    const el = document.getElementById('co-creacion');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f3ee] text-[#111111]">
      <Header
        onOpenProjector={() => setIsProjectorOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenUserProfile={() => handleOpenUserProfileModal('carnet')}
        currentUserName={currentUser.name || currentUser.alias}
        contributionCount={contributions.length}
        unreadNotificationCount={unreadNotificationCount}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
      />

      {/* WORKSPACE NAVIGATION BAR */}
      <div className="bg-[#191919] text-white border-b border-stone-800 sticky top-[61px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'bienvenida', label: '01. Bienvenida & Ruta', icon: Compass, badge: '5 Clases' },
              { id: 'herramientas', label: '02. Herramientas IA', icon: Sparkles, badge: '9 Temas' },
              { id: 'sistema', label: '03. Sistema Creativo', icon: Layers, badge: 'Ficha & Prompts' },
              { id: 'avances', label: '04. Avances del Taller', icon: Tv, badge: `${advances.length}` },
              { id: 'conexion', label: '05. Conexión QR', icon: QrCode, badge: 'Móvil' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigateSection(tab.id as AppSection)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#f8c300] text-[#111111] shadow-sm ring-2 ring-[#f8c300]/50'
                      : 'bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#111111]' : 'text-[#f8c300]'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-[#111111] text-[#f8c300]' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="text-stone-400 text-xs font-mono">
              ✦ Núcleo Colectivo · Taller en Vivo
            </span>
            <button
              onClick={() => setIsProjectorOpen(true)}
              className="px-2.5 py-1 bg-stone-800 hover:bg-[#f8c300] hover:text-[#111111] text-[#f8c300] rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer border border-stone-700"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Sprint 15m</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">
        {/* SECCIÓN 1: BIENVENIDA, MANIFIESTO, 4 MOMENTOS & 5 CLASES */}
        {activeSection === 'bienvenida' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <WelcomeSection
              onNavigateSection={handleNavigateSection}
              onOpenProjector={() => setIsProjectorOpen(true)}
              onOpenUserProfile={() => handleOpenUserProfileModal('carnet')}
              currentUserName={currentUser.name || currentUser.alias}
            />
          </div>
        )}

        {/* SECCIÓN 2: HERRAMIENTAS IA POR TEMAS */}
        {activeSection === 'herramientas' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <AiToolsSection />

            {/* Cross-navigation bar */}
            <div className="bg-[#111111] text-white p-6 sm:p-7 rounded-3xl border-2 border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <span className="text-xs font-mono font-black text-[#f8c300] uppercase tracking-wider block">
                  Paso siguiente en la mesa de trabajo:
                </span>
                <h4 className="text-lg sm:text-xl font-black">
                  ¿Ya encontraste la herramienta para tu idea? Dale propósito en el Sistema Creativo
                </h4>
                <p className="text-xs text-stone-400">
                  Define tu pregunta generadora, dirección de arte y genera prompts maestros paso a paso.
                </p>
              </div>
              <button
                onClick={() => handleNavigateSection('sistema')}
                className="px-6 py-3 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-2xl text-xs transition flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
              >
                <span>Ir al Sistema Creativo & Ficha</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: SISTEMA CREATIVO ASISTIDO POR IA */}
        {activeSection === 'sistema' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <CreativeSystemSection
              onAddAdvance={handleAddAdvance}
              onOpenNotifications={() => setIsNotificationCenterOpen(true)}
            />

            {/* Cross-navigation bar */}
            <div className="bg-[#111111] text-white p-6 sm:p-7 rounded-3xl border-2 border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <span className="text-xs font-mono font-black text-[#f8c300] uppercase tracking-wider block">
                  Paso siguiente en la mesa de trabajo:
                </span>
                <h4 className="text-lg sm:text-xl font-black">
                  ¿Ya tienes tu prompt, imagen o boceto listo? Publícalo en los Avances
                </h4>
                <p className="text-xs text-stone-400">
                  Comparte tu prototipo con el grupo para alimentarlo con música, video o interactividad.
                </p>
              </div>
              <button
                onClick={() => handleNavigateSection('avances')}
                className="px-6 py-3 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-2xl text-xs transition flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
              >
                <span>Ver y Registrar Avances</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 4: AVANCES Y PROTOTIPOS DEL TALLER */}
        {activeSection === 'avances' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <CoCreationAdvances
              contributions={contributions}
              advances={advances}
              onAddAdvance={handleAddAdvance}
              onDeleteAdvance={handleDeleteAdvance}
              onRefresh={fetchAdvancesFromServer}
              onOpenNotifications={() => setIsNotificationCenterOpen(true)}
              unreadNotificationCount={unreadNotificationCount}
            />

            {/* Cross-navigation bar */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#dedbd3] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono font-black text-[#7656ff] uppercase tracking-wider block">
                  Continuar explorando:
                </span>
                <h4 className="text-lg sm:text-xl font-black text-[#111111]">
                  ¿Quieres ensayar con otra herramienta o ajustar tu ficha?
                </h4>
                <p className="text-xs text-stone-600">
                  Explora video, audio, 3D o regresa a los prompts maestros en cualquier momento.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  onClick={() => handleNavigateSection('herramientas')}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#111111] font-bold rounded-xl text-xs transition cursor-pointer border border-stone-300"
                >
                  Herramientas IA
                </button>
                <button
                  onClick={() => handleNavigateSection('sistema')}
                  className="px-5 py-2.5 bg-[#111111] hover:bg-stone-800 text-[#f8c300] font-black rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Sistema Creativo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 5: CONEXIÓN & QR EN VIVO */}
        {activeSection === 'conexion' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <ConnectionQR onScrollToForm={() => handleNavigateSection('herramientas')} />

            {/* Quick jump */}
            <div className="bg-[#111111] text-white p-6 sm:p-7 rounded-3xl border-2 border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <span className="text-xs font-mono font-black text-[#f8c300] uppercase tracking-wider block">
                  Dispositivos conectados:
                </span>
                <h4 className="text-lg sm:text-xl font-black">
                  ¿Ya tienes abierta la plataforma en tu móvil? Comienza a explorar
                </h4>
              </div>
              <button
                onClick={() => handleNavigateSection('herramientas')}
                className="px-6 py-3 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-2xl text-xs transition flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
              >
                <span>Comenzar en Herramientas IA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Live Toast alert when prompts are generated */}
      <NotificationToast
        notification={activeToast}
        onOpenSpark={handleOpenSparkFromNotification}
        onDismiss={() => setActiveToast(null)}
      />

      {/* Notification Center Drawer / Modal */}
      {isNotificationCenterOpen && (
        <NotificationCenterModal
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          notifications={notifications}
          onOpenSpark={handleOpenSparkFromNotification}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAllNotifications}
          participantNames={participantNames}
        />
      )}

      {/* Spark Modal opened from notification */}
      {isSparkModalOpen && activeSparkData && (
        <SparkModal
          isOpen={isSparkModalOpen}
          onClose={() => {
            setIsSparkModalOpen(false);
            setActiveSparkData(null);
          }}
          spark={activeSparkData.spark}
          sourceTitle={activeSparkData.title}
          sourceContext={activeSparkData.context}
        />
      )}

      {isProjectorOpen && (
        <ProjectorModal
          isOpen={isProjectorOpen}
          onClose={() => setIsProjectorOpen(false)}
          contributions={contributions}
          advances={advances}
        />
      )}

      {isWelcomeOpen && (
        <WelcomeModal
          isOpen={isWelcomeOpen}
          onClose={handleCloseWelcome}
          onStartParticipation={scrollToForm}
        />
      )}

      {/* User Identity, QR Carnet Pass & Protected Profile Editor */}
      <UserAuthProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        currentUser={currentUser}
        allParticipants={contributions}
        onSelectUser={handleSelectUser}
        onUpdateUser={handleUpdateUserProfile}
        initialTab={userProfileTab}
      />
    </div>
  );
}
