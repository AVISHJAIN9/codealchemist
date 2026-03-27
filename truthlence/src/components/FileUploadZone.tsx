import { useState, useCallback } from "react";
import { Upload, FileVideo, FileAudio, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const FileUploadZone = ({ onFileSelect, isAnalyzing }: FileUploadZoneProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("video/")) return <FileVideo className="w-6 h-6" />;
    if (type.startsWith("audio/")) return <FileAudio className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const clearFile = () => setSelectedFile(null);

  return (
    <div className="w-full">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? "border-primary bg-primary/5 glow-primary"
            : "border-border hover:border-primary/50"
        } ${isAnalyzing ? "pointer-events-none opacity-60" : ""}`}
        whileHover={{ scale: 1.01 }}
      >
        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="scan-line w-full h-full" />
        </div>

        <input
          type="file"
          accept="video/*,audio/*,text/*,.pdf,.doc,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="text-primary">{getFileIcon(selectedFile.type)}</div>
              <div className="text-left">
                <p className="text-foreground font-medium text-sm truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {!isAnalyzing && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-foreground font-medium text-sm">
                Drop media files here
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Video, Audio, Documents • Max 20MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FileUploadZone;
