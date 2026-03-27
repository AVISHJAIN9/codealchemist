import { useState } from 'react';
import { useMediaVaultStore } from '@/lib/mediavault-store';

const SettingsPanel = () => {
  const { driveFolderLink, saveDriveFolderLink } = useMediaVaultStore();
  const [link, setLink] = useState(driveFolderLink);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveDriveFolderLink(link.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[1380px] mx-auto px-8 py-12">
      <div className="mb-7">
        <div className="font-mono text-[10px] text-primary tracking-[0.15em] uppercase mb-2">// CONFIGURATION</div>
        <div className="font-display text-[32px] font-extrabold text-foreground uppercase tracking-wider">SETTINGS</div>
      </div>

      <div className="bg-surface-1 border border-border p-6 max-w-[640px]">
        <div className="font-mono text-[10px] text-primary tracking-wider mb-4">// GOOGLE DRIVE INTEGRATION</div>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">
          Paste your Google Drive folder link below. This is where all uploaded files will be saved and made available for AI analysis.
        </p>

        <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-2">GOOGLE DRIVE FOLDER LINK</label>
        <input
          type="text"
          value={link}
          onChange={e => setLink(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="https://drive.google.com/drive/folders/..."
          className="w-full bg-surface-2 border border-border text-foreground py-3 px-3.5 font-mono text-[13px] outline-none transition-colors focus:border-nv-green-border placeholder:text-muted-foreground mb-4"
        />

        <div className="bg-surface-2 border border-nv-green-border p-4 mb-5">
          <div className="font-mono text-[10px] text-primary tracking-wider mb-1.5">💡 HOW TO GET YOUR DRIVE LINK</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            1. Open <span className="text-nv-cyan">Google Drive</span><br/>
            2. Create or open a folder for MediaVault<br/>
            3. Copy the URL from your browser's address bar<br/>
            4. Paste it above
          </div>
        </div>

        <button
          onClick={handleSave}
          className="py-3 px-8 bg-primary text-primary-foreground border border-primary font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:brightness-110"
        >
          {saved ? '✓ SAVED' : 'SAVE DRIVE LINK ▶'}
        </button>
      </div>

      <div className="bg-surface-1 border border-border p-6 max-w-[640px] mt-5">
        <div className="font-mono text-[10px] text-primary tracking-wider mb-4">// DATA MANAGEMENT</div>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          All files and history are stored locally in your browser. Data persists across page reloads.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (confirm('Clear all activity history?')) {
                localStorage.removeItem('mediavault_activity');
                window.location.reload();
              }
            }}
            className="py-2.5 px-5 bg-surface-3 border border-border-bright text-muted-foreground font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:opacity-85"
          >
            CLEAR HISTORY
          </button>
          <button
            onClick={() => {
              if (confirm('Delete ALL files and history? This cannot be undone.')) {
                localStorage.removeItem('mediavault_files');
                localStorage.removeItem('mediavault_activity');
                window.location.reload();
              }
            }}
            className="py-2.5 px-5 bg-destructive text-destructive-foreground border-none font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:opacity-85"
          >
            RESET ALL DATA
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
