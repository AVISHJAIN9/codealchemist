import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Shield, Cpu } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const FileUploadZone = ({ onFileSelect, isAnalyzing }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-16 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragging
            ? 'border-primary bg-primary/5 nvidia-glow-strong'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }
        `}
      >
        <input
          type="file"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*,video/*,audio/*,.txt,.pdf,.doc,.docx,.csv,.json,.xml"
          disabled={isAnalyzing}
        />

        <div className="scan-line absolute inset-0 rounded-xl pointer-events-none opacity-50" />

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Cpu className="w-16 h-16 text-primary" />
              </motion.div>
              <p className="font-display text-lg text-primary nvidia-text-glow">
                ANALYZING FILE...
              </p>
              <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <Shield className="w-16 h-16 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                <Upload className="w-6 h-6 text-primary absolute -bottom-1 -right-1" />
              </div>
              <div>
                <p className="font-display text-xl text-foreground mb-2">
                  DROP FILE FOR FORENSIC ANALYSIS
                </p>
                <p className="text-muted-foreground text-sm">
                  Images • Videos • Audio • Documents — Max 20MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FileUploadZone;
