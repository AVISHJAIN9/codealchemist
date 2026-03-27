import { create } from 'zustand';
import type { QueueItem, DriveFile, ActivityEntry, FileType } from './mediavault-types';
import { uid, getExtType } from './mediavault-types';

const STORAGE_KEY_FILES = 'mediavault_files';
const STORAGE_KEY_ACTIVITY = 'mediavault_activity';
const STORAGE_KEY_DRIVE_LINK = 'mediavault_drive_link';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveToStorage(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface MediaVaultState {
  queue: QueueItem[];
  driveFiles: DriveFile[];
  activityLog: ActivityEntry[];
  currentSection: 'upload' | 'library' | 'activity' | 'settings';
  currentFilter: string;
  searchQuery: string;
  selectedUrlType: string;
  isUploading: boolean;
  showProgressModal: boolean;
  showDetailModal: boolean;
  detailFile: DriveFile | null;
  driveFolderLink: string;
  isLoading: boolean;

  setSection: (s: 'upload' | 'library' | 'activity' | 'settings') => void;
  setFilter: (f: string) => void;
  setSearch: (q: string) => void;
  setSelectedUrlType: (t: string) => void;
  addFilesToQueue: (files: File[]) => void;
  addUrlToQueue: (url: string, type: string) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  startUpload: () => Promise<void>;
  deleteFile: (id: string) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  closeProgressModal: () => void;
  loadData: () => void;
  saveDriveFolderLink: (link: string) => void;
  downloadFile: (id: string) => void;
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export const useMediaVaultStore = create<MediaVaultState>((set, get) => ({
  queue: [],
  driveFiles: [],
  activityLog: [],
  currentSection: 'upload',
  currentFilter: 'all',
  searchQuery: '',
  selectedUrlType: 'auto',
  isUploading: false,
  showProgressModal: false,
  showDetailModal: false,
  detailFile: null,
  driveFolderLink: '',
  isLoading: true,

  setSection: (s) => set({ currentSection: s }),
  setFilter: (f) => set({ currentFilter: f }),
  setSearch: (q) => set({ searchQuery: q }),
  setSelectedUrlType: (t) => set({ selectedUrlType: t }),

  loadData: () => {
    const driveFiles = loadFromStorage<DriveFile[]>(STORAGE_KEY_FILES, []);
    const activityLog = loadFromStorage<ActivityEntry[]>(STORAGE_KEY_ACTIVITY, []);
    const driveFolderLink = localStorage.getItem(STORAGE_KEY_DRIVE_LINK) || '';
    set({ driveFiles, activityLog, driveFolderLink, isLoading: false });
  },

  saveDriveFolderLink: (link: string) => {
    localStorage.setItem(STORAGE_KEY_DRIVE_LINK, link);
    set({ driveFolderLink: link });
  },

  addFilesToQueue: (files) => {
    const items: QueueItem[] = files.map(f => ({
      id: uid(), name: f.name, type: getExtType(f.name),
      size: f.size, file: f, status: 'pending', progress: 0,
    }));
    set(s => ({ queue: [...s.queue, ...items] }));
  },

  addUrlToQueue: (rawUrl, type) => {
    let urlStr = rawUrl;
    if (!urlStr.startsWith('http')) urlStr = 'https://' + urlStr;
    try { new URL(urlStr); } catch { return; }

    let detectedType: FileType = 'url';
    if (type === 'auto') {
      if (/youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com/.test(urlStr)) detectedType = 'video';
      else if (/soundcloud\.com|spotify\.com|podcast/.test(urlStr)) detectedType = 'audio';
      else if (/\.(mp4|mov|webm|avi|mkv)(\?.*)?$/.test(urlStr)) detectedType = 'video';
      else if (/\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/.test(urlStr)) detectedType = 'audio';
    } else if (type !== 'auto') {
      detectedType = type === 'webpage' ? 'url' : type as FileType;
    }

    const hostname = new URL(urlStr).hostname.replace('www.', '');
    const item: QueueItem = {
      id: uid(), name: hostname, type: detectedType,
      size: null, url: urlStr, status: 'pending', progress: 0,
    };
    set(s => ({ queue: [...s.queue, item] }));
  },

  removeFromQueue: (id) => set(s => ({ queue: s.queue.filter(i => i.id !== id) })),
  clearQueue: () => set(s => ({ queue: s.queue.filter(i => i.status !== 'pending') })),

  startUpload: async () => {
    const state = get();
    const pending = state.queue.filter(i => i.status === 'pending');
    if (pending.length === 0) return;

    set({ isUploading: true, showProgressModal: true });

    for (const item of pending) {
      set(s => ({ queue: s.queue.map(q => q.id === item.id ? { ...q, status: 'uploading' as const } : q) }));

      const progressInterval = setInterval(() => {
        set(s => ({
          queue: s.queue.map(q =>
            q.id === item.id && q.status === 'uploading'
              ? { ...q, progress: Math.min(q.progress + Math.random() * 15, 90) }
              : q
          )
        }));
      }, 200);

      // Convert file to base64 for localStorage persistence
      let blobData: string | undefined;
      if (item.file) {
        try {
          blobData = await fileToBase64(item.file);
        } catch {
          // If file is too large for localStorage, skip blob storage
        }
      }

      await delay(800 + Math.random() * 700);
      clearInterval(progressInterval);

      const saved: DriveFile = {
        id: uid(),
        name: item.name,
        type: item.type,
        size: item.size,
        url: item.url || undefined,
        createdAt: new Date().toISOString(),
        driveUrl: '#',
        downloadUrl: '#',
        mimeType: item.file?.type || 'application/octet-stream',
        blobData,
      };

      const newActivity: ActivityEntry = {
        action: 'upload',
        file: { id: saved.id, name: saved.name, type: saved.type },
        time: new Date().toISOString(),
      };

      set(s => {
        const newFiles = [saved, ...s.driveFiles];
        const newLog = [newActivity, ...s.activityLog];
        saveToStorage(STORAGE_KEY_FILES, newFiles);
        saveToStorage(STORAGE_KEY_ACTIVITY, newLog);
        return {
          queue: s.queue.map(q => q.id === item.id ? { ...q, status: 'done' as const, progress: 100 } : q),
          driveFiles: newFiles,
          activityLog: newLog,
        };
      });
    }

    set({ isUploading: false });
  },

  deleteFile: (id) => {
    const file = get().driveFiles.find(f => f.id === id);
    const newActivity: ActivityEntry = {
      action: 'delete',
      file: { id, name: file?.name || id },
      time: new Date().toISOString(),
    };
    set(s => {
      const newFiles = s.driveFiles.filter(f => f.id !== id);
      const newLog = [newActivity, ...s.activityLog];
      saveToStorage(STORAGE_KEY_FILES, newFiles);
      saveToStorage(STORAGE_KEY_ACTIVITY, newLog);
      return {
        driveFiles: newFiles,
        activityLog: newLog,
        showDetailModal: false,
      };
    });
  },

  downloadFile: (id) => {
    const file = get().driveFiles.find(f => f.id === id);
    if (!file) return;

    // If it's a URL type, open in new tab
    if (file.type === 'url' && file.url) {
      window.open(file.url, '_blank');
      return;
    }

    // If we have blob data (base64), download it
    if (file.blobData) {
      const link = document.createElement('a');
      link.href = file.blobData;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // If there's a source URL, open it
    if (file.url) {
      window.open(file.url, '_blank');
    }
  },

  openDetail: (id) => {
    const file = get().driveFiles.find(f => f.id === id);
    if (file) set({ showDetailModal: true, detailFile: file });
  },
  closeDetail: () => set({ showDetailModal: false, detailFile: null }),
  closeProgressModal: () => {
    set(s => ({ showProgressModal: false, queue: s.queue.filter(i => i.status !== 'done') }));
  },
}));
