import { useMediaVaultStore } from '@/lib/mediavault-store';

const TopNav = () => {
  const { currentSection, setSection } = useMediaVaultStore();

  const navItems = [
    { id: 'upload' as const, label: 'INGEST' },
    { id: 'library' as const, label: 'MY DRIVE' },
    { id: 'activity' as const, label: 'ACTIVITY' },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-[500] h-[58px] flex items-center">
      <div className="max-w-[1380px] mx-auto px-8 flex items-center w-full">
        <div className="flex items-center gap-3 mr-10 cursor-pointer" onClick={() => setSection('upload')}>
          <div className="w-9 h-9 bg-primary flex items-center justify-center font-display text-[15px] font-black text-primary-foreground flex-shrink-0"
               style={{ clipPath: 'polygon(0 0,100% 0,100% 68%,68% 100%,0 100%)' }}>
            M
          </div>
          <span className="font-display text-[22px] font-extrabold tracking-wider text-foreground uppercase">
            Media<span className="text-primary">Vault</span>
          </span>
          <span className="font-mono text-[9px] text-muted-foreground bg-secondary border border-border px-1.5 py-0.5 tracking-widest">
            DRIVE
          </span>
        </div>

        <div className="hidden md:flex flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`font-mono text-[11px] tracking-wider px-[18px] h-[58px] flex items-center border-b-2 mb-[-1px] transition-colors bg-transparent border-x-0 border-t-0 whitespace-nowrap ${
                currentSection === item.id
                  ? 'text-primary border-b-primary'
                  : 'text-muted-foreground border-b-transparent hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">API v2.0</span>
          <button
            onClick={() => setSection('settings')}
            className="bg-secondary border border-border-bright text-muted-foreground px-3.5 py-1.5 font-mono text-[10px] tracking-wider transition-all hover:bg-nv-green-glow hover:border-nv-green-border hover:text-primary"
          >
            ⚙ SETTINGS
          </button>
          <button
            onClick={() => setSection('library')}
            className="bg-primary text-primary-foreground border border-primary px-3.5 py-1.5 font-mono text-[10px] tracking-wider font-bold hover:brightness-110 transition-all"
          >
            MY DRIVE ▶
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
