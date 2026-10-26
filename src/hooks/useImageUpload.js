'use client';
import { useCallback, useRef, useState } from 'react';
import { apiSecure, apiError } from '@/lib/api-client';
import { compressImage } from '@/lib/image-compress';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 5 * 1024 * 1024; // after compression — same limit as the server

/**
 * Compresses and uploads one image to /api/media.
 *   const { upload, uploading, progress, error } = useImageUpload();
 *   const media = await upload(file);   // → { url, … } or null
 */
export default function useImageUpload() {
  const busy = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const upload = useCallback(async (original) => {
    if (!original || busy.current) return null;
    setError('');
    if (!ACCEPTED.includes(original.type)) {
      setError('Choose a JPG, PNG, WebP or GIF image.');
      return null;
    }
    busy.current = true;
    setUploading(true);
    setProgress(0);
    try {
      const { file } = await compressImage(original);
      if (file.size > MAX_BYTES) throw new Error('The image is still larger than 5 MB after compressing — choose a smaller one.');
      const body = new FormData();
      body.append('file', file);
      const res = await apiSecure.post('/media', body, { onUploadProgress: (e) => e.total && setProgress(Math.round((e.loaded / e.total) * 100)) });
      return res.data.data;
    } catch (err) {
      setError(err.response ? apiError(err, 'Upload failed.') : err.message || 'Upload failed — check your connection.');
      return null;
    } finally {
      busy.current = false;
      setUploading(false);
    }
  }, []);

  return { upload, uploading, progress, error, setError };
}
