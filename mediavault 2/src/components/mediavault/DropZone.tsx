import { useCallback, useRef, useState } from 'react';
import { useMediaVaultStore } from '@/lib/mediavault-store';

const DropZone = () => {
  const { addFilesToQueue } = useMediaVaultStore();
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) addFilesToQueue(files);
  }, [addFilesToQueue]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) addFilesToQueue(files);
    e.target.value = '';
  }, [addFilesToQueue]);

  return (
    <>
      <div
        className={`bg-surface-1 border-2 border-dashed py-14 px-8 text-center transition-all relative overflow-hidden cursor-pointer group ${
          dragover ? 'border-primary bg-nv-green-glow shadow-[inset_0_0_60px_hsl(var(--nv-green-glow)),0_0_0_1px_hsl(var(--nv-green))]' : 'border-border-bright hover:border-primary hover:bg-[rgba(118,185,0,0.04)]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 pointer-events-none"
             style={{ background: 'linear-gradient(90deg,transparent,rgba(118,185,0,0.4),transparent)', animation: 'scanline 3s linear infinite' }} />

        <div className="w-16 h-16 border-2 border-nv-green-border flex items-center justify-center mx-auto mb-[18px] text-[28px] text-primary relative">
          📁
          <div className="absolute -inset-2 border border-nv-green-border opacity-40" />
        </div>
        <div className="font-display text-[22px] font-bold text-foreground uppercase tracking-wider mb-2">DROP FILES HERE</div>
        <div className="text-[13px] text-muted-foreground">or <strong className="text-primary">click to browse</strong> your computer</div>
        <div className="flex gap-2 justify-center mt-5 flex-wrap">
          {['TXT / MD / PDF / DOCX', 'MP4 / MOV / AVI / MKV', 'MP3 / WAV / OGG / M4A', 'ANY FILE TYPE'].map(t => (
            <span key={t} className="font-mono text-[10px] bg-surface-3 border border-border-bright text-muted-foreground px-2.5 py-1 tracking-wider">{t}</span>
          ))}
        </div>
      </div>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
    </>
  );
};

export default DropZone;
