import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WorkshopRoute } from './components/WorkshopRoute';
import { ParticipantForm } from './components/ParticipantForm';
import { CollectiveMap } from './components/CollectiveMap';
import { UserNetwork } from './components/UserNetwork';
import { CreativeCrosses } from './components/CreativeCrosses';
import { ConnectionQR } from './components/ConnectionQR';
import { ProjectorModal } from './components/ProjectorModal';
import { Footer } from './components/Footer';
import { ParticipantContribution, INITIAL_SEED_DATA } from './types';

const STORAGE_KEY = 'nucleo-lab-aportes-v1';

export default function App() {
  const [contributions, setContributions] = useState<ParticipantContribution[]>([]);
  const [isProjectorOpen, setIsProjectorOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize legacy entries if missing name/contact
          const normalized = parsed.map((item) => ({
            ...item,
            name: item.name || item.alias || 'Participante',
            email: item.email || '',
            shareContact: item.shareContact ?? true
          }));
          setContributions(normalized);
          return;
        }
      }
      // Seed initial sample data with realistic names and contacts
      setContributions(INITIAL_SEED_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_DATA));
    } catch (e) {
      console.error('Error loading contributions from localStorage:', e);
      setContributions(INITIAL_SEED_DATA);
    }
  }, []);

  // Save changes to localStorage
  const saveContributions = (data: ParticipantContribution[]) => {
    setContributions(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving contributions:', e);
    }
  };

  const handleSubmitContribution = (newRecord: ParticipantContribution) => {
    const updated = [...contributions, newRecord];
    saveContributions(updated);

    // Smooth scroll down to Community Network / Map so the participant sees themselves
    const networkSection = document.getElementById('comunidad');
    if (networkSection) {
      setTimeout(() => {
        networkSection.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        '¿Deseas borrar los aportes y participantes guardados en este navegador? Esta acción no se puede deshacer.'
      )
    ) {
      saveContributions([]);
    }
  };

  const handleLoadSeedData = () => {
    saveContributions(INITIAL_SEED_DATA);
  };

  const handleImportJson = (imported: ParticipantContribution[]) => {
    const existingIds = new Set(contributions.map((c) => String(c.id)));
    const filteredNew = imported
      .filter((item) => !existingIds.has(String(item.id)))
      .map((item) => ({
        ...item,
        name: item.name || item.alias || 'Participante',
        email: item.email || '',
        shareContact: item.shareContact ?? true
      }));

    saveContributions([...contributions, ...filteredNew]);
  };

  const handleRefresh = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setContributions(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f3ee] text-[#111111]">
      <Header
        onOpenProjector={() => setIsProjectorOpen(true)}
        contributionCount={contributions.length}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-4">
        <Hero
          onScrollToForm={scrollToForm}
          onScrollToMap={scrollToMap}
          onScrollToNetwork={scrollToNetwork}
          totalContributions={contributions.length}
        />

        <WorkshopRoute />

        <ParticipantForm onSubmit={handleSubmitContribution} />

        <CollectiveMap
          contributions={contributions}
          onRefresh={handleRefresh}
          onClearAll={handleClearAll}
          onImportJson={handleImportJson}
          onLoadSeedData={handleLoadSeedData}
        />

        <UserNetwork contributions={contributions} />

        <CreativeCrosses contributions={contributions} />

        <ConnectionQR />
      </main>

      <Footer />

      <ProjectorModal
        isOpen={isProjectorOpen}
        onClose={() => setIsProjectorOpen(false)}
        contributions={contributions}
      />
    </div>
  );
}
