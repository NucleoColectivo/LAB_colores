import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WorkshopRoute } from './components/WorkshopRoute';
import { ConnectionQR } from './components/ConnectionQR';
import { ParticipantForm } from './components/ParticipantForm';
import { CollectiveMap } from './components/CollectiveMap';
import { UserNetwork } from './components/UserNetwork';
import { CreativeCrosses } from './components/CreativeCrosses';
import { CoCreationAdvances } from './components/CoCreationAdvances';
import { ProjectorModal } from './components/ProjectorModal';
import { WelcomeModal } from './components/WelcomeModal';
import { SparkModal } from './components/SparkModal';
import { NotificationToast } from './components/NotificationToast';
import { NotificationCenterModal } from './components/NotificationCenterModal';
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

export default function App() {
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
  const lastSyncCount = useRef<number>(0);
  const knownAdvanceIds = useRef<Set<string>>(new Set(INITIAL_SEED_ADVANCES.map((a) => String(a.id))));
  const isFirstLoad = useRef(true);

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

    const networkSection = document.getElementById('comunidad');
    if (networkSection) {
      setTimeout(() => {
        networkSection.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
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
        contributionCount={contributions.length}
        unreadNotificationCount={unreadNotificationCount}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-4">
        {/* HERO SECTION */}
        <Hero
          onScrollToForm={scrollToForm}
          onScrollToQr={scrollToQr}
          onScrollToMap={scrollToMap}
          onScrollToNetwork={scrollToNetwork}
          onScrollToCoCreation={scrollToCoCreation}
          onOpenWelcome={() => setIsWelcomeOpen(true)}
          totalContributions={contributions.length}
        />

        {/* METODOLOGÍA VIVA: RUTA DE LA MAÑANA */}
        <WorkshopRoute />

        {/* 00. ESCANEA PARA INICIAR: LOS QR ANTES DE LOS DATOS */}
        <ConnectionQR onScrollToForm={scrollToForm} />

        {/* 01. REGISTRO Y AFINIDADES: FICHA CON DATOS Y LENGUAJES */}
        <ParticipantForm onSubmit={handleSubmitContribution} />

        {/* 02. MAPA COLECTIVO DE AFINIDADES */}
        <CollectiveMap
          contributions={contributions}
          onRefresh={handleRefresh}
          onClearAll={handleClearAll}
          onImportJson={handleImportJson}
          onLoadSeedData={handleLoadSeedData}
        />

        {/* 03. RED DE CREADORES DEL TALLER (DIRECTORIO DE PARTICIPANTES) */}
        <UserNetwork contributions={contributions} />

        {/* 04. CRUCES PARA IMAGINAR (LABORATORIO DE CRUCES CREATIVOS) */}
        <CreativeCrosses contributions={contributions} />

        {/* 05. UNIR IDEAS Y AVANCES DEL TALLER (INDIVIDUALES Y COLECTIVOS -> REPOSITORIO LAB-COLORES.VERCEL.APP) */}
        <CoCreationAdvances
          contributions={contributions}
          advances={advances}
          onAddAdvance={handleAddAdvance}
          onDeleteAdvance={handleDeleteAdvance}
          onRefresh={fetchAdvancesFromServer}
          onOpenNotifications={() => setIsNotificationCenterOpen(true)}
          unreadNotificationCount={unreadNotificationCount}
        />
      </main>

      <Footer />

      {/* Live Toast alert when prompts are generated */}
      <NotificationToast
        notification={activeToast}
        onOpenSpark={handleOpenSparkFromNotification}
        onDismiss={() => setActiveToast(null)}
      />

      {/* Notification Center Drawer / Modal */}
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

      {/* Spark Modal opened from notification */}
      {activeSparkData && (
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

      <ProjectorModal
        isOpen={isProjectorOpen}
        onClose={() => setIsProjectorOpen(false)}
        contributions={contributions}
      />

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={handleCloseWelcome}
        onStartParticipation={scrollToForm}
      />
    </div>
  );
}
