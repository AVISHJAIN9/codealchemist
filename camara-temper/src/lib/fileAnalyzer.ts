import exifr from 'exifr';

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModified: Date;
  mimeType: string;
  // Image specific
  width?: number;
  height?: number;
  cameraMake?: string;
  cameraModel?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  flash?: string;
  whiteBalance?: string;
  exposureMode?: string;
  meteringMode?: string;
  colorSpace?: string;
  // Date
  dateCreated?: Date;
  dateModified?: Date;
  dateOriginal?: Date;
  // GPS
  latitude?: number;
  longitude?: number;
  altitude?: number;
  gpsTimestamp?: string;
  // Software
  software?: string;
  creator?: string;
  copyright?: string;
  description?: string;
  // Analysis
  authenticityScore: number;
  flags: AnalysisFlag[];
  fileHash?: string;
}

export interface AnalysisFlag {
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  detail?: string;
}

async function computeHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function analyzeFile(file: File): Promise<FileMetadata> {
  const flags: AnalysisFlag[] = [];
  let authenticityScore = 75;

  const fileHash = await computeHash(file);

  const metadata: FileMetadata = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
    lastModified: new Date(file.lastModified),
    mimeType: file.type || 'application/octet-stream',
    authenticityScore,
    flags,
    fileHash,
  };

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');

  if (isImage) {
    try {
      const dims = await getImageDimensions(file);
      metadata.width = dims.width;
      metadata.height = dims.height;
    } catch {}

    try {
      const exif = await exifr.parse(file, true);

      if (exif) {
        metadata.cameraMake = exif.Make;
        metadata.cameraModel = exif.Model;
        metadata.lens = exif.LensModel || exif.LensMake;
        metadata.focalLength = exif.FocalLength ? `${exif.FocalLength}mm` : undefined;
        metadata.aperture = exif.FNumber ? `f/${exif.FNumber}` : undefined;
        metadata.shutterSpeed = exif.ExposureTime
          ? exif.ExposureTime < 1 ? `1/${Math.round(1 / exif.ExposureTime)}s` : `${exif.ExposureTime}s`
          : undefined;
        metadata.iso = exif.ISO;
        metadata.flash = exif.Flash !== undefined ? (exif.Flash ? 'Fired' : 'No Flash') : undefined;
        metadata.whiteBalance = exif.WhiteBalance !== undefined
          ? (exif.WhiteBalance === 0 ? 'Auto' : 'Manual') : undefined;
        metadata.software = exif.Software;
        metadata.creator = exif.Artist || exif.Creator;
        metadata.copyright = exif.Copyright;
        metadata.description = exif.ImageDescription || exif.Description;
        metadata.dateOriginal = exif.DateTimeOriginal;
        metadata.dateCreated = exif.CreateDate || exif.DateTimeDigitized;
        metadata.dateModified = exif.ModifyDate;
        metadata.colorSpace = exif.ColorSpace === 1 ? 'sRGB' : exif.ColorSpace ? `ColorSpace(${exif.ColorSpace})` : undefined;
        metadata.exposureMode = exif.ExposureMode !== undefined
          ? (['Auto', 'Manual', 'Auto Bracket'][exif.ExposureMode] || `Mode(${exif.ExposureMode})`) : undefined;
        metadata.meteringMode = exif.MeteringMode !== undefined
          ? (['Unknown', 'Average', 'CenterWeighted', 'Spot', 'MultiSpot', 'Pattern', 'Partial'][exif.MeteringMode] || `Mode(${exif.MeteringMode})`) : undefined;

        metadata.latitude = exif.latitude;
        metadata.longitude = exif.longitude;
        metadata.altitude = exif.GPSAltitude;
      }
    } catch {}

    // Flags
    if (metadata.cameraMake && metadata.cameraModel) {
      flags.push({ type: 'success', message: 'Camera identified', detail: `${metadata.cameraMake} ${metadata.cameraModel}` });
      authenticityScore += 10;
    } else {
      flags.push({ type: 'warning', message: 'No camera info found', detail: 'Image may have been processed or generated' });
      authenticityScore -= 10;
    }

    if (metadata.dateOriginal) {
      flags.push({ type: 'success', message: 'Original capture date found', detail: metadata.dateOriginal.toLocaleString() });
      authenticityScore += 5;
    } else {
      flags.push({ type: 'warning', message: 'No original capture date', detail: 'Timestamp may have been stripped' });
      authenticityScore -= 5;
    }

    if (metadata.latitude && metadata.longitude) {
      flags.push({ type: 'info', message: 'GPS location embedded', detail: `${metadata.latitude.toFixed(6)}, ${metadata.longitude.toFixed(6)}` });
      authenticityScore += 5;
    } else {
      flags.push({ type: 'info', message: 'No GPS data', detail: 'Location was not recorded or was stripped' });
    }

    if (metadata.software) {
      const editors = ['photoshop', 'gimp', 'lightroom', 'snapseed', 'canva', 'figma'];
      const isEdited = editors.some(e => metadata.software!.toLowerCase().includes(e));
      if (isEdited) {
        flags.push({ type: 'danger', message: 'Editing software detected', detail: metadata.software });
        authenticityScore -= 20;
      } else {
        flags.push({ type: 'info', message: 'Software tag', detail: metadata.software });
      }
    }
  }

  if (isVideo || isAudio) {
    flags.push({ type: 'info', message: `${isVideo ? 'Video' : 'Audio'} file detected`, detail: `Format: ${metadata.mimeType}` });
    flags.push({ type: 'warning', message: 'Limited metadata extraction', detail: 'Deep media analysis requires server-side processing' });
  }

  if (!isImage && !isVideo && !isAudio) {
    flags.push({ type: 'info', message: 'Document/data file', detail: `Type: ${metadata.fileType}` });
    authenticityScore = 50;
  }

  metadata.authenticityScore = Math.max(0, Math.min(100, authenticityScore));
  metadata.flags = flags;

  return metadata;
}
