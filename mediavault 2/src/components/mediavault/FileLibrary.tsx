import { useMediaVaultStore } from '@/lib/mediavault-store';
import { TYPE_ICONS, formatBytes } from '@/lib/mediavault-types';
import type { DriveFile } from '@/lib/mediavault-types';

const FileLibrary = () => {
  const { driveFiles, currentFilter, setFilter, searchQuery, setSearch, openDetail, deleteFile, downloadFile } = useMediaVaultStore();

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'text', label: '📄 TEXT' },
    { id: 'url', label: '🌐 URL' },
    { id: 'video', label: '🎬 VIDEO' },
    { id: 'audio', label: '🎵 AUDIO' },
  ];

  let files = driveFiles;
  if (currentFilter !== 'all') files = files.filter(f => f.type === currentFilter);
  if (searchQuery) files = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-[1380px] mx-auto px-8 py-12">
      <div className="mb-7">
        <div className="font-mono text-[10px] text-primary tracking-[0.15em] uppercase mb-2">// DRIVE CONTENTS</div>
        <div className="font-display text-[32px] font-extrabold text-foreground uppercase tracking-wider">MY DRIVE</div>
        <div className="text-[13px] text-muted-foreground mt-1.5 font-light">All your saved media — text, URLs, video and audio. Available for AI analysis.</div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap items-center">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`py-[7px] px-4 border font-mono text-[10px] tracking-wider transition-all ${
              currentFilter === f.id
                ? 'bg-[rgba(118,185,0,0.1)] border-primary text-primary'
                : 'bg-surface-2 border-border text-muted-foreground hover:border-nv-green-border hover:text-primary'
            }`}>
            {f.label}
          </button>
        ))}
        <div className="ml-auto relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[13px] pointer-events-none">🔍</span>
          <input type="text" value={searchQuery} onChange={e => setSearch(e.target.value)}
            placeholder="Search drive…"
            className="bg-surface-2 border border-border text-foreground py-[7px] pl-9 pr-3.5 font-mono text-xs outline-none w-[220px] transition-colors focus:border-nv-green-border placeholder:text-muted-foreground" />
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-xs">
          // NO FILES{currentFilter !== 'all' ? ` OF TYPE ${currentFilter.toUpperCase()}` : ''} FOUND
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
          {files.map(f => <FileCard key={f.id} file={f} onOpen={openDetail} onDelete={deleteFile} onDownload={downloadFile} />)}
        </div>
      )}
    </div>
  );
};

function FileCard({ file: f, onOpen, onDelete, onDownload }: { file: DriveFile; onOpen: (id: string) => void; onDelete: (id: string) => void; onDownload: (id: string) => void }) {
  const icon = TYPE_ICONS[f.type] || '📦';
  const date = new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const thumbBg = f.type === 'video' ? 'bg-gradient-to-br from-[#0d1117] to-[#161b22]'
    : f.type === 'audio' ? 'bg-gradient-to-br from-[#0d0d1a] to-[#111125]'
    : f.type === 'url' ? 'bg-gradient-to-br from-[#001a00] to-[#001400]'
    : 'bg-gradient-to-br from-[#0a0a0a] to-[#141414]';

  return (
    <div className="bg-surface-1 border border-border transition-all relative overflow-hidden animate-fade-up cursor-pointer group hover:border-nv-green-border hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
         onClick={() => onOpen(f.id)}>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent transition-colors group-hover:bg-primary" />
      <div className={`h-[130px] ${thumbBg} flex items-center justify-center text-[44px] relative border-b border-border`}>
        {f.type === 'video' ? (
          <div className="w-[52px] h-[52px] border-2 border-[rgba(255,255,255,0.3)] rounded-full flex items-center justify-center text-lg pl-1 text-foreground opacity-70 group-hover:opacity-100 group-hover:border-primary group-hover:text-primary transition-all">▶</div>
        ) : f.type === 'audio' ? (
          <div className="flex items-center gap-0.5 h-12">
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} className="w-[3px] bg-primary rounded-sm"
                   style={{ height: `${8 + Math.random() * 32}px`, animation: `waveAnim ${0.5 + Math.random() * 0.7}s ease infinite alternate`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        ) : (
          <span className="text-[40px]">{icon}</span>
        )}
        <span className="absolute bottom-2 right-2 font-mono text-[9px] bg-[rgba(0,0,0,0.7)] text-muted-foreground px-1.5 py-0.5 tracking-wider">{f.type.toUpperCase()}</span>
      </div>
      <div className="p-3.5">
        <div className="text-[13px] font-semibold text-foreground mb-1 truncate">{f.name}</div>
        <div className="font-mono text-[10px] text-muted-foreground flex gap-2.5">
          <span>{date}</span>
          <span>{f.size ? formatBytes(f.size) : 'URL'}</span>
        </div>
        <div className="flex gap-1.5 mt-2.5" onClick={e => e.stopPropagation()}>
          <button 
            onClick={() => onDownload(f.id)}
            className="flex-1 py-[7px] bg-surface-3 border border-border text-muted-foreground font-mono text-[10px] tracking-wider transition-all text-center hover:border-nv-green-border hover:text-primary">
            ⬇ GET
          </button>
          <button onClick={() => onDelete(f.id)} className="flex-1 py-[7px] bg-surface-3 border border-border text-muted-foreground font-mono text-[10px] tracking-wider transition-all text-center hover:border-[rgba(255,59,48,0.4)] hover:text-destructive">✕</button>
        </div>
      </div>
    </div>
  );
}

export default FileLibrary;
