import { useMediaVaultStore } from '@/lib/mediavault-store';

const ActivityLog = () => {
  const { activityLog } = useMediaVaultStore();

  return (
    <div className="max-w-[1380px] mx-auto px-8 py-12">
      <div className="mb-7">
        <div className="font-mono text-[10px] text-primary tracking-[0.15em] uppercase mb-2">// UPLOAD HISTORY</div>
        <div className="font-display text-[32px] font-extrabold text-foreground uppercase tracking-wider">ACTIVITY LOG</div>
      </div>

      <div className="flex flex-col gap-2">
        {activityLog.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-mono text-xs">// NO ACTIVITY YET</div>
        ) : (
          activityLog.map((a, i) => {
            const icon = a.action === 'upload' ? '⬆' : '🗑';
            const color = a.action === 'upload' ? 'border-l-primary' : 'border-l-destructive';
            const time = new Date(a.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={i} className={`flex items-center gap-3.5 py-3 px-4 bg-surface-1 border border-border border-l-[3px] ${color}`}>
                <span className="text-base">{icon}</span>
                <div className="flex-1">
                  <div className="text-[13px] text-foreground font-medium">{a.file?.name || 'Unknown'}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{a.action.toUpperCase()} · {a.file?.type?.toUpperCase() || 'FILE'}</div>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">{time}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
