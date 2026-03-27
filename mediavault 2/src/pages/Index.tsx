import { useEffect } from 'react';
import { useMediaVaultStore } from '@/lib/mediavault-store';
import Ticker from '@/components/mediavault/Ticker';
import TopNav from '@/components/mediavault/TopNav';
import Hero from '@/components/mediavault/Hero';
import StorageWidget from '@/components/mediavault/StorageWidget';
import DropZone from '@/components/mediavault/DropZone';
import URLInput from '@/components/mediavault/URLInput';
import QueuePanel from '@/components/mediavault/QueuePanel';
import FileLibrary from '@/components/mediavault/FileLibrary';
import ActivityLog from '@/components/mediavault/ActivityLog';
import ProgressModal from '@/components/mediavault/ProgressModal';
import FileDetailModal from '@/components/mediavault/FileDetailModal';
import SettingsPanel from '@/components/mediavault/SettingsPanel';

const Index = () => {
  const { currentSection, loadData, isLoading } = useMediaVaultStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-surface-3 border-t-primary rounded-full animate-spin-fast mx-auto mb-4" />
          <div className="font-mono text-[11px] text-muted-foreground tracking-wider">LOADING MEDIAVAULT...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Ticker />
      <TopNav />

      {currentSection === 'upload' && (
        <>
          <Hero />
          <div className="max-w-[1380px] mx-auto px-8">
            <div className="py-12 pb-0">
              <StorageWidget />
            </div>
            <div className="py-12">
              <div className="mb-7">
                <div className="font-mono text-[10px] text-primary tracking-[0.15em] uppercase mb-2">// INGEST PIPELINE</div>
                <div className="font-display text-[32px] font-extrabold text-foreground uppercase tracking-wider">ADD TO DRIVE</div>
                <div className="text-[13px] text-muted-foreground mt-1.5 font-light">Drag & drop files or paste URLs below. All content is saved to your drive.</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
                <div>
                  <DropZone />
                  <URLInput />
                </div>
                <QueuePanel />
              </div>
            </div>
          </div>
        </>
      )}

      {currentSection === 'library' && <FileLibrary />}
      {currentSection === 'activity' && <ActivityLog />}
      {currentSection === 'settings' && <SettingsPanel />}

      <ProgressModal />
      <FileDetailModal />

      <footer className="border-t border-border py-6 px-8 flex items-center justify-between flex-wrap gap-3">
        <div className="font-mono text-[10px] text-muted-foreground">© MEDIAVAULT DRIVE 2025 · REACT + TYPESCRIPT · v2.0.0</div>
        <div className="flex gap-1.5">
          {['REACT', 'TYPESCRIPT', 'ZUSTAND', 'TAILWIND', 'LOCAL'].map(tag => (
            <span key={tag} className="font-mono text-[9px] text-muted-foreground border border-border px-[7px] py-0.5">{tag}</span>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Index;
