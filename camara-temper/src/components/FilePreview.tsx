import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Image, Film, Music, FileText } from 'lucide-react';

const FilePreview = ({ file }: { file: File }) => {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
        {isImage ? <Image className="w-4 h-4 text-primary" /> :
         isVideo ? <Film className="w-4 h-4 text-primary" /> :
         isAudio ? <Music className="w-4 h-4 text-primary" /> :
         <FileText className="w-4 h-4 text-primary" />}
        <span className="font-display text-xs tracking-widest text-primary">FILE PREVIEW</span>
      </div>

      <div className="p-4 flex items-center justify-center min-h-[200px] bg-background/50">
        {isImage && (
          <img src={previewUrl} alt="Preview" className="max-h-72 max-w-full object-contain rounded" />
        )}
        {isVideo && (
          <video src={previewUrl} controls className="max-h-72 max-w-full rounded" />
        )}
        {isAudio && (
          <div className="w-full px-4">
            <audio src={previewUrl} controls className="w-full" />
          </div>
        )}
        {!isImage && !isVideo && !isAudio && (
          <div className="text-center text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-2 opacity-30" />
            <p className="font-display text-sm">{file.name}</p>
            <p className="text-xs mt-1">{file.type || 'Unknown type'}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FilePreview;
