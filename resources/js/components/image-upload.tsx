import { cn } from '@/lib/utils';
import { ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ImageUploadProps {
  /** Current image URL (for edit mode — shows existing image) */
  value?: string | null;
  /** Called with the selected File, or null when cleared */
  onChange: (file: File | null) => void;
  /** Accepted MIME types, e.g. "image/jpeg,image/png" */
  accept?: string;
  /** Max file size in MB */
  maxSizeMB?: number;
  /** Aspect ratio hint shown to user, e.g. "16:9" */
  aspectRatio?: string;
  /** Additional format hint shown below the label, e.g. "JPG, PNG, WEBP" */
  formatHint?: string;
  /** Whether an upload is in progress (shows spinner) */
  isUploading?: boolean;
  /** Error message to display */
  error?: string;
  /** Disable the input */
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  aspectRatio = '16:9',
  formatHint = 'JPG, PNG, WEBP',
  isUploading = false,
  error,
  disabled = false,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  // Sync external value (e.g. when form resets or edit mode loads)
  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const isDisabled = disabled || isUploading;

  const processFile = (file: File) => {
    setSizeError(null);

    if (!file.type.startsWith('image/')) {
      setSizeError('Please select an image file.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`File exceeds ${maxSizeMB} MB limit.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so re-selecting the same file still fires onChange
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!isDisabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    setSizeError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayError = error ?? sizeError;

  return (
    <div className={cn('w-full', className)}>
      <label
        className={cn(
          'relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          // Base states
          !preview && 'h-32',
          // Interactive states
          !isDisabled && !preview && 'cursor-pointer hover:bg-muted/80',
          // Drag state
          isDragging
            ? 'border-primary bg-primary/5'
            : displayError
              ? 'border-destructive bg-destructive/5'
              : 'border-border bg-muted',
          // Disabled / uploading
          isDisabled && 'pointer-events-none opacity-70',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* ── Preview state ── */}
        {preview ? (
          <div className="group relative w-full overflow-hidden rounded-lg">
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full object-cover"
              onError={() => setPreview(null)}
            />

            {/* Overlay on hover */}
            {!isDisabled && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {/* Re-upload */}
                <span className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow">
                  Click to change
                </span>
              </div>
            )}

            {/* Clear button */}
            {!isDisabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Uploading overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          /* ── Empty / drop state ── */
          <div className="flex flex-col items-center justify-center gap-1.5 py-5 text-center">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : isDragging ? (
              <UploadCloud className="h-8 w-8 text-primary" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}

            <p className="text-sm text-muted-foreground">
              {isUploading ? (
                'Uploading…'
              ) : isDragging ? (
                <span className="font-semibold text-primary">Drop image here</span>
              ) : (
                <>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </>
              )}
            </p>

            {!isUploading && (
              <p className="text-xs text-muted-foreground">
                {formatHint}
                {aspectRatio && ` · ${aspectRatio} recommended`}
                {` · max ${maxSizeMB} MB`}
              </p>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          disabled={isDisabled}
          onChange={handleFileChange}
        />
      </label>

      {/* Error message */}
      {displayError && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
          <span>{displayError}</span>
        </p>
      )}
    </div>
  );
}