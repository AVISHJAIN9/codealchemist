import { motion } from 'framer-motion';
import { Camera, Calendar, MapPin, FileText, Image, Aperture, Pencil } from 'lucide-react';
import type { FileMetadata } from '@/lib/fileAnalyzer';

const MetadataPanel = ({ metadata }: { metadata: FileMetadata }) => {
  const sections = [
    {
      title: 'FILE IDENTITY',
      icon: FileText,
      items: [
        { label: 'File Name', value: metadata.fileName },
        { label: 'Type', value: `${metadata.fileType} (${metadata.mimeType})` },
        { label: 'Size', value: formatSize(metadata.fileSize) },
        { label: 'Last Modified', value: metadata.lastModified.toLocaleString() },
        metadata.fileHash ? { label: 'SHA-256', value: metadata.fileHash.slice(0, 24) + '...', mono: true } : null,
      ].filter(Boolean),
    },
    metadata.cameraMake || metadata.cameraModel ? {
      title: 'CAMERA / DEVICE',
      icon: Camera,
      items: [
        metadata.cameraMake ? { label: 'Manufacturer', value: metadata.cameraMake } : null,
        metadata.cameraModel ? { label: 'Model', value: metadata.cameraModel } : null,
        metadata.lens ? { label: 'Lens', value: metadata.lens } : null,
      ].filter(Boolean),
    } : null,
    metadata.focalLength || metadata.aperture || metadata.iso ? {
      title: 'SHOT SETTINGS',
      icon: Aperture,
      items: [
        metadata.focalLength ? { label: 'Focal Length', value: metadata.focalLength } : null,
        metadata.aperture ? { label: 'Aperture', value: metadata.aperture } : null,
        metadata.shutterSpeed ? { label: 'Shutter Speed', value: metadata.shutterSpeed } : null,
        metadata.iso ? { label: 'ISO', value: String(metadata.iso) } : null,
        metadata.flash ? { label: 'Flash', value: metadata.flash } : null,
        metadata.whiteBalance ? { label: 'White Balance', value: metadata.whiteBalance } : null,
        metadata.exposureMode ? { label: 'Exposure Mode', value: metadata.exposureMode } : null,
        metadata.meteringMode ? { label: 'Metering', value: metadata.meteringMode } : null,
        metadata.colorSpace ? { label: 'Color Space', value: metadata.colorSpace } : null,
      ].filter(Boolean),
    } : null,
    {
      title: 'TIMESTAMPS',
      icon: Calendar,
      items: [
        metadata.dateOriginal ? { label: 'Original Capture', value: metadata.dateOriginal.toLocaleString(), highlight: true } : null,
        metadata.dateCreated ? { label: 'Digitized', value: metadata.dateCreated.toLocaleString() } : null,
        metadata.dateModified ? { label: 'Modified', value: metadata.dateModified.toLocaleString() } : null,
        { label: 'File System Date', value: metadata.lastModified.toLocaleString() },
      ].filter(Boolean),
    },
    metadata.width || metadata.height ? {
      title: 'DIMENSIONS',
      icon: Image,
      items: [
        { label: 'Resolution', value: `${metadata.width} × ${metadata.height} px` },
        metadata.width && metadata.height ? { label: 'Megapixels', value: `${((metadata.width * metadata.height) / 1e6).toFixed(1)} MP` } : null,
      ].filter(Boolean),
    } : null,
    metadata.software || metadata.creator || metadata.copyright ? {
      title: 'SOFTWARE / AUTHOR',
      icon: Pencil,
      items: [
        metadata.software ? { label: 'Software', value: metadata.software } : null,
        metadata.creator ? { label: 'Creator', value: metadata.creator } : null,
        metadata.copyright ? { label: 'Copyright', value: metadata.copyright } : null,
        metadata.description ? { label: 'Description', value: metadata.description } : null,
      ].filter(Boolean),
    } : null,
    metadata.latitude !== undefined ? {
      title: 'GPS LOCATION',
      icon: MapPin,
      items: [
        { label: 'Latitude', value: metadata.latitude!.toFixed(6) + '°' },
        { label: 'Longitude', value: metadata.longitude!.toFixed(6) + '°' },
        metadata.altitude ? { label: 'Altitude', value: `${metadata.altitude.toFixed(1)}m` } : null,
      ].filter(Boolean),
    } : null,
  ].filter(Boolean) as { title: string; icon: any; items: { label: string; value: string; mono?: boolean; highlight?: boolean }[] }[];

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
            <section.icon className="w-4 h-4 text-primary" />
            <span className="font-display text-xs tracking-widest text-primary">{section.title}</span>
          </div>
          <div className="divide-y divide-border">
            {section.items.map((item, j) => (
              <div key={j} className="flex justify-between items-center px-4 py-2 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={`text-right max-w-[60%] truncate ${item.mono ? 'font-mono-code text-xs' : ''} ${item.highlight ? 'text-primary font-semibold' : 'text-foreground'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

export default MetadataPanel;
