import { useState } from 'react';
import { useMediaVaultStore } from '@/lib/mediavault-store';

const URLInput = () => {
  const { addUrlToQueue, selectedUrlType, setSelectedUrlType } = useMediaVaultStore();
  const [url, setUrl] = useState('');

  const types = [
    { id: 'auto', icon: '⬡', label: 'AUTO DETECT' },
    { id: 'webpage', icon: '🌐', label: 'WEBPAGE' },
    { id: 'video', icon: '🎬', label: 'VIDEO URL' },
    { id: 'audio', icon: '🎵', label: 'AUDIO URL' },
  ];

  const handleAdd = () => {
    if (!url.trim()) return;
    addUrlToQueue(url.trim(), selectedUrlType);
    setUrl('');
  };

  return (
    <div className="bg-surface-1 border border-border p-6 mt-4">
      <div className="font-mono text-[10px] text-primary tracking-widest mb-3.5">// OR INGEST FROM URL</div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedUrlType(t.id)}
            className={`py-2.5 px-2 border font-mono text-[10px] tracking-wider text-center flex flex-col items-center gap-1.5 transition-all ${
              selectedUrlType === t.id
                ? 'bg-[rgba(118,185,0,0.08)] border-primary text-primary'
                : 'bg-surface-2 border-border text-muted-foreground hover:border-nv-green-border'
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="https://youtube.com/watch?v=... or any URL"
          className="flex-1 bg-surface-2 border border-border text-foreground py-3 px-3.5 font-mono text-[13px] outline-none transition-colors focus:border-nv-green-border placeholder:text-muted-foreground"
        />
        <button
          onClick={handleAdd}
          disabled={!url.trim()}
          className="bg-primary text-primary-foreground border border-primary px-6 py-3 font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ADD ▶
        </button>
      </div>
    </div>
  );
};

export default URLInput;
