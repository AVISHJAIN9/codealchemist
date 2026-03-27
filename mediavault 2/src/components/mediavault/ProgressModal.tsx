import { useMediaVaultStore } from '@/lib/mediavault-store';

const ProgressModal = () => {
  const { showProgressModal, queue, closeProgressModal, isUploading } = useMediaVaultStore();
  if (!showProgressModal) return null;

  const total = queue.length;
  const done = queue.filter(i => i.status === 'done').length;
  const errors = queue.filter(i => i.status === 'error').length;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.85)] z-[900] flex items-center justify-center backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-1 border border-border-bright w-[440px] max-w-[90vw] animate-fade-up">
        <div className="py-[22px] px-6 border-b border-border">
          <div className="font-display text-xl font-extrabold text-foreground uppercase tracking-wider">
            {isUploading ? 'UPLOADING...' : 'UPLOAD COMPLETE'}
          </div>
        </div>
        <div className="p-6">
          <div className="font-mono text-[10px] text-primary tracking-wider mb-4">
            // {done}/{total} FILES PROCESSED {errors > 0 ? `· ${errors} ERRORS` : ''}
          </div>

          <div className="max-h-[200px] overflow-y-auto flex flex-col gap-2">
            {queue.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2 px-3 bg-surface-2 border border-border">
                <span className="text-sm">
                  {item.status === 'done' ? '✅' : item.status === 'error' ? '❌' : item.status === 'uploading' ? '⏳' : '⏸'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-foreground truncate">{item.name}</div>
                  {item.status === 'uploading' && (
                    <div className="h-1 bg-surface-3 mt-1 relative">
                      <div className="absolute top-0 left-0 h-full bg-primary transition-all" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isUploading && (
            <button
              onClick={closeProgressModal}
              className="w-full mt-5 py-3 bg-primary text-primary-foreground border border-primary font-display text-sm font-extrabold tracking-wider uppercase transition-all hover:brightness-110"
            >
              DONE ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
