'use client';
// Resizes and compresses an image in the browser before upload, so the server (cPanel) needs no image
// library and large phone photos become small WebP files.
//   const { file, width, height } = await compressImage(original);

const MAX_SIDE = 1920; // px, longest side
const QUALITY = 0.85;

const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

export async function compressImage(original, { maxSide = MAX_SIDE, quality = QUALITY } = {}) {
  // GIFs may be animated — upload them unchanged
  if (original.type === 'image/gif' || typeof createImageBitmap !== 'function') return { file: original, width: 0, height: 0 };

  let bitmap;
  try {
    bitmap = await createImageBitmap(original, { imageOrientation: 'from-image' }); // respects phone rotation
  } catch {
    throw new Error('This file could not be read as an image.');
  }
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  // WebP keeps transparency (logos); browsers that can't write WebP fall back to PNG / JPEG
  let blob = await toBlob(canvas, 'image/webp', quality);
  if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, original.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
  if (!blob) return { file: original, width, height };

  // Already small enough and not resized — keep the original
  if (scale === 1 && blob.size >= original.size && ['image/webp', 'image/jpeg', 'image/png'].includes(original.type)) return { file: original, width, height };

  const ext = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' }[blob.type];
  const name = `${(original.name || 'image').replace(/\.[^.]+$/, '')}.${ext}`;
  return { file: new File([blob], name, { type: blob.type }), width, height };
}
