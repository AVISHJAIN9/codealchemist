import { useMediaVaultStore } from '@/lib/mediavault-store';
import { formatBytes } from '@/lib/mediavault-types';

const StorageWidget = () => {
  const { driveFiles } = useMediaVaultStore();
  const totalBytes = driveFiles.reduce((a, f) => a + (f.size || 0), 0);
  const pct = Math.min((totalBytes / (15 * 1024 * 1024 * 1024)) * 100, 100).toFixed(2);

  const counts = {
    text: driveFiles.filter(f => f.type === 'text').length,
    video: driveFiles.filter(f => f.type === 'video').length,
    audio: driveFiles.filter(f => f.type === 'audio').length,
    url: driveFiles.filter(f => f.type === 'url').length,
  };

  return (
    <div className="bg-surface-1 border border-border p-5 px-6 flex gap-6 items-center flex-wrap">
      <div>
        <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-2">// DRIVE STORAGE</div>
        <div className="font-display text-[26px] font-extrabold text-primary">{formatBytes(totalBytes)}</div>
        <div className="font-mono text-[10px] text-muted-foreground">of 15 GB</div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-2">USED CAPACITY</div>
        <div className="h-1.5 bg-surface-3 relative">
          <div className="absolute top-0 left-0 h-full transition-all duration-1000"
               style={{ width: `${pct}%`, background: 'linear-gradient(90deg, hsl(var(--nv-green)), #8fd400)', boxShadow: '0 0 10px hsl(var(--nv-green-glow))' }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="font-mono text-[10px] text-muted-foreground">{pct}%</span>
          <span className="font-mono text-[10px] text-muted-foreground">15 GB FREE</span>
        </div>
      </div>
      <div className="flex gap-4">
        {[
          { count: counts.text, label: 'TEXT FILES', color: 'text-nv-cyan' },
          { count: counts.video, label: 'VIDEO', color: 'text-nv-amber' },
          { count: counts.audio, label: 'AUDIO', color: 'text-nv-purple' },
          { count: counts.url, label: 'URLs', color: 'text-primary' },
        ].map(item => (
          <div key={item.label} className="text-center">
            <div className={`font-display text-[22px] font-extrabold ${item.color}`}>{item.count}</div>
            <div className="font-mono text-[9px] text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorageWidget;
