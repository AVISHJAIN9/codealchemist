import { useMediaVaultStore } from '@/lib/mediavault-store';
import { TYPE_ICONS, formatBytes } from '@/lib/mediavault-types';

const QueuePanel = () => {
  const { queue, removeFromQueue, clearQueue, startUpload, isUploading } = useMediaVaultStore();
  const pending = queue.filter(i => i.status === 'pending');

  return (
    <div className="bg-surface-1 border border-border">
      <div className="py-4 px-5 border-b border-border flex justify-between items-center">
        <div>
          <div className="font-mono text-[10px] text-primary tracking-widest">// UPLOAD QUEUE</div>
          <div className="font-display text-lg font-extrabold text-foreground uppercase tracking-wider mt-1">
            {pending.length} ITEM{pending.length !== 1 ? 'S' : ''} READY
          </div>
        </div>
        {pending.length > 0 && (
          <button onClick={clearQueue}
            className="font-mono text-[10px] text-muted-foreground hover:text-destructive transition-colors">
            CLEAR
          </button>
        )}
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        {queue.length === 0 ? (
          <div className="py-10 text-center font-mono text-[11px] text-muted-foreground">
            // QUEUE EMPTY — ADD FILES OR URLS
          </div>
        ) : (
          queue.map(item => {
            const icon = TYPE_ICONS[item.type] || '📦';
            return (
              <div key={item.id} className="flex items-center gap-3 py-3 px-5 border-b border-border last:border-b-0">
                <span className="text-lg">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-foreground truncate">{item.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {item.type.toUpperCase()} · {item.size ? formatBytes(item.size) : 'URL'}
                  </div>
                  {item.status === 'uploading' && (
                    <div className="h-1 bg-surface-3 mt-1.5 relative">
                      <div className="absolute top-0 left-0 h-full bg-primary transition-all" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}
                </div>
                {item.status === 'pending' && (
                  <button onClick={() => removeFromQueue(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors text-sm">✕</button>
                )}
                {item.status === 'done' && <span className="text-primary text-sm">✓</span>}
                {item.status === 'error' && <span className="text-destructive text-sm">✕</span>}
              </div>
            );
          })
        )}
      </div>

      {pending.length > 0 && (
        <div className="p-5 border-t border-border">
          <button
            onClick={startUpload}
            disabled={isUploading}
            className="w-full py-3.5 bg-primary text-primary-foreground border border-primary font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isUploading ? 'UPLOADING...' : `UPLOAD ${pending.length} FILE${pending.length !== 1 ? 'S' : ''} ▶`}
          </button>
        </div>
      )}
    </div>
  );
};

export default QueuePanel;
