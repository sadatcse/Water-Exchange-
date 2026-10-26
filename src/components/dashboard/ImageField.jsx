'use client';
import { useRef, useState } from 'react';
import { FaImage, FaUpload, FaImages, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import useImageUpload from '@/hooks/useImageUpload';
import MediaLibraryModal from '@/components/modals/MediaLibraryModal';
import { Input } from '@/components/forms/FormField';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Image picker used by every editor: upload (button or drag & drop), choose from the media library,
 * or paste a /images/… path or https:// link. Uploads are compressed in the browser and stored on the server.
 * A plain <img> is used for the preview so any pasted URL can be shown.
 */
export default function ImageField({
  label = 'Image',
  name,
  value,
  onChange,
  required,
  hint = 'Upload an image, pick one from the library, or paste a link.',
  aspect = 'aspect-[4/3]',
}) {
  const inputRef = useRef(null);
  const [broken, setBroken] = useState('');
  const [dragging, setDragging] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const { upload, uploading, progress, error } = useImageUpload();
  const showPreview = value && broken !== value;

  const handleFile = async (file) => {
    const media = await upload(file);
    if (media) onChange(media.url);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = [...(e.dataTransfer?.files || [])].find((f) => f.type.startsWith('image/'));
    if (file) handleFile(file);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
      <div className="min-w-0">
        <Input label={label} name={name} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder="Upload, choose from library, or paste https://…" inputMode="url" />
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            <FaUpload aria-hidden /> {uploading ? `Uploading… ${progress}%` : 'Upload'}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setLibraryOpen(true)} disabled={uploading}>
            <FaImages aria-hidden /> Choose from library
          </Button>
          {value && (
            <Button size="sm" variant="ghost" onClick={() => onChange('')} disabled={uploading}>
              <FaTimes aria-hidden /> Remove
            </Button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-subtle">{hint} JPG, PNG, WebP or GIF — large photos are resized automatically.</p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {value && broken === value && !error && <p className="mt-1 text-xs text-red-600">This image could not be loaded — check the link.</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = ''; // the same file can be chosen again
          }}
        />
      </div>

      {/* Preview + drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-label={`${label}: drop an image here or press to upload`}
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed bg-canvas transition-colors',
          aspect,
          dragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : showPreview ? 'border-transparent' : 'border-line/20 hover:border-primary-400'
        )}
      >
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" onError={() => setBroken(value)} onLoad={() => setBroken('')} />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center text-faint">
            {dragging ? <FaCloudUploadAlt className="text-3xl text-primary-500" aria-hidden /> : <FaImage className="text-2xl" aria-hidden />}
            <span className="text-[11px] font-medium">{dragging ? 'Drop to upload' : 'Drop an image here'}</span>
          </span>
        )}
        {uploading && (
          <span className="absolute inset-x-0 bottom-0 h-1.5 bg-black/10">
            <span className="block h-full bg-primary-500 transition-[width]" style={{ width: `${progress}%` }} />
          </span>
        )}
        {dragging && showPreview && (
          <span className="absolute inset-0 flex items-center justify-center bg-primary-600/70 text-sm font-bold text-white">Drop to replace</span>
        )}
      </div>

      <MediaLibraryModal open={libraryOpen} onClose={() => setLibraryOpen(false)} selectedUrl={value} onSelect={(media) => onChange(media.url)} />
    </div>
  );
}
