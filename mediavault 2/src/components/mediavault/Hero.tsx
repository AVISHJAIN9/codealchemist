import { useMediaVaultStore } from '@/lib/mediavault-store';
import { formatBytes } from '@/lib/mediavault-types';

const Hero = () => {
  const { driveFiles } = useMediaVaultStore();
  const totalBytes = driveFiles.reduce((a, f) => a + (f.size || 0), 0);

  return (
    <div className="relative overflow-hidden py-20 px-8 border-b border-border">
      <div className="absolute inset-0 animate-grid-pulse"
           style={{
             backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
             backgroundSize: '60px 60px'
           }} />
      <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, hsl(var(--nv-green-glow)) 0%, transparent 70%)' }} />

      <div className="max-w-[1380px] mx-auto relative z-10">
        <div className="font-mono text-[11px] text-primary tracking-[0.18em] mb-3.5 flex items-center gap-2">
          <span className="w-6 h-0.5 bg-primary inline-block" />
          // NVIDIA DRIVE · CONTENT INGESTION PIPELINE
        </div>
        <h1 className="font-display text-[clamp(44px,6vw,80px)] font-black leading-[0.95] uppercase tracking-wider text-foreground mb-[18px]">
          SAVE ANY<br />
          <span className="text-primary">MEDIA</span><br />
          TO DRIVE
        </h1>
        <p className="text-[15px] text-muted-foreground max-w-[540px] leading-relaxed font-light mb-9">
          Drop text files, paste URLs, upload videos and audio — everything is processed and saved to your secure drive instantly. Files are stored for AI analysis.
        </p>
        <div className="flex gap-8 flex-wrap">
          <div className="border-l-2 border-nv-green-border pl-3.5">
            <div className="font-display text-[28px] font-extrabold text-primary">{driveFiles.length}</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider mt-0.5">FILES STORED</div>
          </div>
          <div className="border-l-2 border-nv-green-border pl-3.5">
            <div className="font-display text-[28px] font-extrabold text-primary">{formatBytes(totalBytes)}</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider mt-0.5">DRIVE USED</div>
          </div>
          <div className="border-l-2 border-nv-green-border pl-3.5">
            <div className="font-display text-[28px] font-extrabold text-primary">4</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider mt-0.5">INPUT TYPES</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
