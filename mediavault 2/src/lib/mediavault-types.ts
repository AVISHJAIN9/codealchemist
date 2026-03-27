export type FileType = 'text' | 'url' | 'video' | 'audio' | 'image' | 'other';
export type QueueStatus = 'pending' | 'uploading' | 'done' | 'error';

export interface QueueItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  file?: File;
  url?: string;
  status: QueueStatus;
  progress: number;
}

export interface DriveFile {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  url?: string;
  driveUrl?: string;
  downloadUrl?: string;
  createdAt: string;
  mimeType?: string;
  thumbnail?: string | null;
  blobData?: string; // base64 encoded file data for local storage
}

export interface ActivityEntry {
  action: 'upload' | 'delete';
  file: { id: string; name: string; type?: string };
  time: string;
}

export const TYPE_ICONS: Record<string, string> = {
  text: '📄', url: '🌐', video: '🎬', audio: '🎵', image: '🖼', other: '📦'
};

export const EXT_MAP: Record<string, FileType> = {
  txt: 'text', md: 'text', markdown: 'text', pdf: 'text', doc: 'text', docx: 'text',
  csv: 'text', json: 'text', xml: 'text', html: 'text',
  mp4: 'video', mov: 'video', avi: 'video', mkv: 'video', webm: 'video', m4v: 'video',
  wmv: 'video', flv: 'video',
  mp3: 'audio', wav: 'audio', ogg: 'audio', m4a: 'audio', aac: 'audio', flac: 'audio',
  opus: 'audio', wma: 'audio',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
};

export function getExtType(filename: string): FileType {
  if (!filename) return 'other';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return EXT_MAP[ext] || 'other';
}

export function formatBytes(bytes: number | null): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function uid(): string {
  return 'id_' + Math.random().toString(36).slice(2) + Date.now();
}
