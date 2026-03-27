import { useMediaVaultStore } from '@/lib/mediavault-store';
import { TYPE_ICONS, formatBytes } from '@/lib/mediavault-types';

const FileDetailModal = () => {
  const { showDetailModal, detailFile, closeDetail, deleteFile, downloadFile } = useMediaVaultStore();
  if (!showDetailModal || !detailFile) return null;

  const f = detailFile;
  const icon = TYPE_ICONS[f.type] || '📦';

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.85)] z-[900] flex items-center justify-center backdrop-blur-sm animate-fade-in"
         onClick={closeDetail}>
      <div className="bg-surface-1 border border-border-bright w-[680px] max-w-[95vw] animate-fade-up" onClick={e => e.stopPropagation()}>
        <div className="py-[22px] px-6 border-b border-border flex justify-between items-center">
          <div className="font-display text-xl font-extrabold text-foreground uppercase tracking-wider truncate">{f.name}</div>
          <button onClick={closeDetail} className="bg-transparent border-none text-muted-foreground text-xl transition-colors hover:text-destructive">×</button>
        </div>
        <div className="h-[220px] bg-surface-2 flex items-center justify-center text-[64px] border-b border-border">{icon}</div>
        <div className="p-6">
          {[
            ['FILE NAME', f.name],
            ['TYPE', f.type.toUpperCase()],
            ['SIZE', f.size ? formatBytes(f.size) : 'URL — N/A'],
            ['MIME TYPE', f.mimeType || 'N/A'],
            ['SAVED ON', new Date(f.createdAt).toLocaleString()],
          ].map(([key, val]) => (
            <div key={key} className="flex justify-between py-2.5 border-b border-border last:border-b-0">
              <span className="font-mono text-[11px] text-muted-foreground tracking-wider">{key}</span>
              <span className="font-mono text-[11px] text-foreground">{val}</span>
            </div>
          ))}
          {f.url && (
            <div className="flex justify-between py-2.5 border-b border-border">
              <span className="font-mono text-[11px] text-muted-foreground tracking-wider">SOURCE URL</span>
              <a href={f.url} target="_blank" rel="noopener" className="font-mono text-[11px] text-nv-cyan max-w-[280px] truncate">{f.url}</a>
            </div>
          )}
        </div>
        <div className="flex gap-2.5 p-5 pt-0">
          <button onClick={() => downloadFile(f.id)} className="flex-1 py-3 bg-primary text-primary-foreground border border-primary font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:brightness-110">⬇ DOWNLOAD</button>
          <button onClick={closeDetail} className="flex-1 py-3 bg-surface-3 border border-border-bright text-muted-foreground font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:opacity-85">CLOSE</button>
          <button onClick={() => deleteFile(f.id)} className="flex-1 py-3 bg-destructive text-destructive-foreground border-none font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:opacity-85">DELETE</button>
        </div>
      </div>
    </div>
  );
};

export default FileDetailModal;
