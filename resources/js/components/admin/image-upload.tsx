/**
 * ImageUpload — Reusable image upload component with built-in crop modal.
 *
 * Usage (Banner variant):
 *   <ImageUpload
 *     value={data.banner}
 *     previewUrl={data.previewUrl}
 *     onChange={(file, url) => setData((prev) => ({ ...prev, banner: file, previewUrl: url }))}
 *     onRemove={() => setData((prev) => ({ ...prev, banner: null, previewUrl: null }))}
 *     label="Upload Welcome Banner"
 *     aspectRatio={16 / 9}
 *     disabled={processing}
 *     error={errors.banner}
 *     inputId="welcome-banner"
 *   />
 *
 * Usage (Gallery / square variant):
 *   <ImageUpload
 *     value={data.image}
 *     previewUrl={data.previewUrl}
 *     onChange={(file, url) => setData((prev) => ({ ...prev, image: file, previewUrl: url }))}
 *     onRemove={() => setData((prev) => ({ ...prev, image: null, previewUrl: null }))}
 *     label="Upload Image"
 *     aspectRatio={1}
 *     inputId="gallery-img"
 *   />
 */

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, ImageUp, Trash2, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageUploadProps {
    /** Current File object (controlled) */
    value: File | null;
    /** Preview URL string (controlled) */
    previewUrl: string | null;
    /** Called with the cropped File and its object-URL after crop confirm */
    onChange: (file: File, previewUrl: string) => void;
    /** Called when the user removes the image */
    onRemove: () => void;
    /** Dropzone label. Defaults to "Upload Image" */
    label?: string;
    /**
     * Crop aspect ratio. e.g. 16/9 for banner, 1 for square.
     * Omit or pass undefined for free-crop.
     */
    aspectRatio?: number;
    /** Max file size in MB. Defaults to 5 */
    maxSizeMB?: number;
    /** Accepted MIME types. Defaults to image/png,image/jpeg */
    accept?: string;
    /** Disable the input */
    disabled?: boolean;
    /** Extra class on the root wrapper */
    className?: string;
    /** Input id — required when two uploaders are on the same page */
    inputId?: string;
    /** Error message (from Inertia errors) */
    error?: string;
}

interface CropState {
    x: number;
    y: number;
    width: number;
    height: number;
}

// ─── Crop Modal ───────────────────────────────────────────────────────────────

// ─── Crop Modal ───────────────────────────────────────────────────────────────

function CropModal({
    src,
    aspectRatio,
    accept,
    onConfirm,
    onCancel,
    onChangeImage,
}: {
    src: string;
    aspectRatio?: number;
    accept: string;
    onConfirm: (croppedBlob: Blob) => void;
    onCancel: () => void;
    onChangeImage: (file: File) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const changeInputRef = useRef<HTMLInputElement>(null);

    const [crop, setCrop] = useState<CropState>({ x: 0, y: 0, width: 0, height: 0 });
    const [dragging, setDragging] = useState<'move' | 'resize' | null>(null);
    const [dragStart, setDragStart] = useState<{ mx: number; my: number; crop: CropState } | null>(null);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
    const naturalSize = useRef({ w: 0, h: 0 });

    // ── NEW: zoom state — scale + image offset within the canvas ──────────────
    const [zoom, setZoomState] = useState(1);
    const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
    // base display size (at zoom=1), never changes after load
    const baseSize = useRef({ w: 0, h: 0 });

    // ── Draw overlay ──────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img || !imgLoaded) return;

        const ctx = canvas.getContext('2d')!;
        canvas.width = displaySize.w;
        canvas.height = displaySize.h;

        const iw = baseSize.current.w * zoom;
        const ih = baseSize.current.h * zoom;
        const ix = imgOffset.x;
        const iy = imgOffset.y;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image at current zoom+offset
        ctx.drawImage(img, ix, iy, iw, ih);

        // Darken outside crop
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clear crop area & redraw image inside it
        ctx.save();
        ctx.beginPath();
        ctx.rect(crop.x, crop.y, crop.width, crop.height);
        ctx.clip();
        ctx.drawImage(img, ix, iy, iw, ih);
        ctx.restore();

        // Crop border
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

        // Rule-of-thirds grid
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 0.8;
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(crop.x + (crop.width / 3) * i, crop.y);
            ctx.lineTo(crop.x + (crop.width / 3) * i, crop.y + crop.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(crop.x, crop.y + (crop.height / 3) * i);
            ctx.lineTo(crop.x + crop.width, crop.y + (crop.height / 3) * i);
            ctx.stroke();
        }

        // Corner handles
        const hs = 8;
        ctx.fillStyle = '#fff';
        [
            [crop.x, crop.y],
            [crop.x + crop.width - hs, crop.y],
            [crop.x, crop.y + crop.height - hs],
            [crop.x + crop.width - hs, crop.y + crop.height - hs],
        ].forEach(([hx, hy]) => ctx.fillRect(hx!, hy!, hs, hs));
    }, [crop, imgLoaded, displaySize, zoom, imgOffset]);

    // ── Init crop on load ─────────────────────────────────────────────────────
    const initCrop = useCallback(
        (w: number, h: number) => {
            if (aspectRatio) {
                let cw = w * 0.9;
                let ch = cw / aspectRatio;
                if (ch > h * 0.9) {
                    ch = h * 0.9;
                    cw = ch * aspectRatio;
                }
                setCrop({ x: (w - cw) / 2, y: (h - ch) / 2, width: cw, height: ch });
            } else {
                const pad = 20;
                setCrop({ x: pad, y: pad, width: w - pad * 2, height: h - pad * 2 });
            }
        },
        [aspectRatio],
    );

    const onImgLoad = useCallback(() => {
        const img = imgRef.current!;
        naturalSize.current = { w: img.naturalWidth, h: img.naturalHeight };
        const maxW = Math.min(680, window.innerWidth - 80);
        const maxH = 460;
        const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
        const dw = img.naturalWidth * ratio;
        const dh = img.naturalHeight * ratio;
        baseSize.current = { w: dw, h: dh };
        setDisplaySize({ w: dw, h: dh });
        setImgOffset({ x: 0, y: 0 });
        setZoomState(1);
        setImgLoaded(true);
        initCrop(dw, dh);
    }, [initCrop]);

    // ── Pointer helpers ───────────────────────────────────────────────────────
    const getHandle = (mx: number, my: number): string | null => {
        const hs = 12;
        const { x, y, width, height } = crop;
        if (mx >= x && mx <= x + hs && my >= y && my <= y + hs) return 'nw';
        if (mx >= x + width - hs && mx <= x + width && my >= y && my <= y + hs) return 'ne';
        if (mx >= x && mx <= x + hs && my >= y + height - hs && my <= y + height) return 'sw';
        if (mx >= x + width - hs && mx <= x + width && my >= y + height - hs && my <= y + height) return 'se';
        return null;
    };

    const getRelativePos = (e: React.MouseEvent | React.TouchEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        return { mx: clientX - rect.left, my: clientY - rect.top };
    };

    const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        const { mx, my } = getRelativePos(e);
        const handle = getHandle(mx, my);
        if (handle) {
            setDragging('resize');
            setResizeHandle(handle);
        } else if (mx >= crop.x && mx <= crop.x + crop.width && my >= crop.y && my <= crop.y + crop.height) {
            setDragging('move');
        }
        setDragStart({ mx, my, crop: { ...crop } });
    };

    const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!dragging || !dragStart) return;
        const { mx, my } = getRelativePos(e);
        const dx = mx - dragStart.mx;
        const dy = my - dragStart.my;
        const { w, h } = displaySize;

        if (dragging === 'move') {
            setCrop((prev) => ({
                ...prev,
                x: Math.max(0, Math.min(w - prev.width, dragStart.crop.x + dx)),
                y: Math.max(0, Math.min(h - prev.height, dragStart.crop.y + dy)),
            }));
        } else if (dragging === 'resize') {
            setCrop(() => {
                let { x, y, width, height } = dragStart.crop;
                const minSize = 40;

                if (resizeHandle === 'se') {
                    width = Math.max(minSize, Math.min(w - x, width + dx));
                    height = aspectRatio ? width / aspectRatio : Math.max(minSize, Math.min(h - y, height + dy));
                } else if (resizeHandle === 'sw') {
                    const newW = Math.max(minSize, width - dx);
                    x = Math.max(0, x + width - newW);
                    width = newW;
                    height = aspectRatio ? width / aspectRatio : Math.max(minSize, Math.min(h - y, height + dy));
                } else if (resizeHandle === 'ne') {
                    width = Math.max(minSize, Math.min(w - x, width + dx));
                    const newH = aspectRatio ? width / aspectRatio : Math.max(minSize, height - dy);
                    y = aspectRatio ? y + (height - newH) : Math.max(0, y + dy);
                    height = newH;
                } else if (resizeHandle === 'nw') {
                    const newW = Math.max(minSize, width - dx);
                    x = Math.max(0, x + width - newW);
                    width = newW;
                    const newH = aspectRatio ? width / aspectRatio : Math.max(minSize, height - dy);
                    y = aspectRatio ? y + (height - newH) : Math.max(0, y + dy);
                    height = newH;
                }

                return { x, y, width, height };
            });
        }
    };

    const onPointerUp = () => {
        setDragging(null);
        setDragStart(null);
        setResizeHandle(null);
    };

    // ── Zoom — scales image around crop center, keeps crop box fixed ──────────
    const handleZoom = (factor: number) => {
        setZoomState((prevZoom) => {
            const newZoom = Math.max(0.5, Math.min(5, prevZoom * factor));
            const zoomRatio = newZoom / prevZoom;

            // Zoom relative to crop center so the crop area stays "in place"
            const cropCx = crop.x + crop.width / 2;
            const cropCy = crop.y + crop.height / 2;

            setImgOffset((prev) => ({
                x: cropCx - (cropCx - prev.x) * zoomRatio,
                y: cropCy - (cropCy - prev.y) * zoomRatio,
            }));

            return newZoom;
        });
    };

    // ── Confirm — maps crop box back to natural image coordinates ─────────────
    const handleConfirm = () => {
        const img = imgRef.current!;
        const iw = baseSize.current.w * zoom;
        const ih = baseSize.current.h * zoom;

        // Scale from display-zoom coords back to natural image coords
        const scaleX = naturalSize.current.w / iw;
        const scaleY = naturalSize.current.h / ih;

        // Crop box position relative to the zoomed image origin
        const srcX = (crop.x - imgOffset.x) * scaleX;
        const srcY = (crop.y - imgOffset.y) * scaleY;
        const srcW = crop.width * scaleX;
        const srcH = crop.height * scaleY;

        const offscreen = document.createElement('canvas');
        offscreen.width = Math.round(srcW);
        offscreen.height = Math.round(srcH);
        const ctx = offscreen.getContext('2d')!;
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, offscreen.width, offscreen.height);
        offscreen.toBlob(
            (blob) => {
                if (blob) onConfirm(blob);
            },
            'image/jpeg',
            0.92,
        );
    };

    // ── Change image from within the modal ────────────────────────────────────
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onChangeImage(file);
        e.target.value = '';
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="border-border bg-card relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
                initial={{ scale: 0.95, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 12 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
                {/* Header */}
                <div className="border-border flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h3 className="text-foreground text-sm font-semibold">Crop Image</h3>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            {aspectRatio
                                ? `Aspect ratio locked ${aspectRatio === 1 ? '1:1' : `${Math.round(aspectRatio * 100) / 100}:1`}`
                                : 'Free crop — drag corners to resize'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-muted-foreground hover:bg-muted hover:text-foreground grid h-8 w-8 place-items-center rounded-lg transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Canvas area */}
                <div ref={containerRef} className="relative flex items-center justify-center overflow-hidden bg-black/80 p-4">
                    <img ref={imgRef} src={src} onLoad={onImgLoad} className="hidden" alt="" />

                    {imgLoaded ? (
                        <canvas
                            ref={canvasRef}
                            style={{
                                width: displaySize.w,
                                height: displaySize.h,
                                cursor: dragging === 'move' ? 'grabbing' : 'crosshair',
                                touchAction: 'none',
                            }}
                            className="rounded-sm select-none"
                            onMouseDown={onPointerDown}
                            onMouseMove={onPointerMove}
                            onMouseUp={onPointerUp}
                            onMouseLeave={onPointerUp}
                            onTouchStart={onPointerDown}
                            onTouchMove={onPointerMove}
                            onTouchEnd={onPointerUp}
                        />
                    ) : (
                        <div className="flex h-48 w-full items-center justify-center">
                            <span className="text-muted-foreground text-sm">Loading image…</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-border flex items-center justify-between gap-3 border-t px-5 py-3">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => handleZoom(0.85)}
                            className="text-muted-foreground hover:bg-muted hover:text-foreground grid h-8 w-8 place-items-center rounded-md transition"
                            title="Zoom out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleZoom(1.15)}
                            className="text-muted-foreground hover:bg-muted hover:text-foreground grid h-8 w-8 place-items-center rounded-md transition"
                            title="Zoom in"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>

                        <div className="bg-border mx-1.5 h-4 w-px" />

                        <input ref={changeInputRef} type="file" accept={accept} className="hidden" onChange={handleChangeInput} />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground h-8 gap-1.5 px-2 text-xs"
                            onClick={() => changeInputRef.current?.click()}
                        >
                            <ImageUp className="h-3.5 w-3.5" />
                            Change image
                        </Button>

                        {/* Show current zoom level */}
                        <span className="text-muted-foreground ml-2 text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="button" size="sm" onClick={handleConfirm}>
                            Apply Crop
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="border-border bg-card relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
                initial={{ scale: 0.95, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 12 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
                {/* ...all existing JSX inside unchanged... */}
            </motion.div>
        </motion.div>,
        document.body, // ← portal target, escapes the dialog stacking context
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ImageUpload({
    value,
    previewUrl,
    onChange,
    onRemove,
    label = 'Upload Image',
    aspectRatio,
    maxSizeMB = 5,
    accept = 'image/png,image/jpeg',
    disabled = false,
    className = '',
    inputId,
    error,
}: ImageUploadProps) {
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [sizeError, setSizeError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Stable uid — computed once, never regenerated on re-render
    const uid = useRef(inputId ?? `img-upload-${Math.random().toString(36).slice(2, 7)}`).current;

    // ── File validation & read ────────────────────────────────────────────────
    const handleFileSelect = (file: File) => {
        setSizeError(null);
        if (file.size > maxSizeMB * 1024 * 1024) {
            setSizeError(`File exceeds ${maxSizeMB}MB limit.`);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => setCropSrc(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
        e.target.value = ''; // allow re-selecting same file
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        if (disabled) return;
        const file = e.dataTransfer.files?.[0];
        if (file && accept.split(',').includes(file.type)) handleFileSelect(file);
    };

    // ── Crop callbacks ────────────────────────────────────────────────────────
    const handleCropConfirm = (blob: Blob) => {
        const ext = blob.type === 'image/png' ? 'png' : 'jpg';
        const file = new File([blob], `upload.${ext}`, { type: blob.type });
        const url = URL.createObjectURL(blob);
        onChange(file, url);
        setCropSrc(null);
    };

    const handleCropCancel = () => setCropSrc(null);

    /**
     * "Change image" pressed inside the crop modal.
     * Reads the new file and hot-swaps the crop source — modal stays open.
     */
    const handleChangeImageInModal = (file: File) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            setSizeError(`File exceeds ${maxSizeMB}MB limit.`);
            setCropSrc(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => setCropSrc(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const displayError = sizeError ?? error;

    return (
        <>
            <div className={`flex flex-col gap-2 ${className}`}>
                {!previewUrl ? (
                    /* ── Upload dropzone ── */
                    <label
                        htmlFor={uid}
                        className={[
                            'group border-border bg-muted/30 relative cursor-pointer overflow-hidden rounded-xl border p-12 text-center transition-all duration-300',
                            disabled ? 'pointer-events-none opacity-60' : 'hover:border-primary/70 hover:bg-muted/50',
                        ].join(' ')}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <input
                            id={uid}
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept={accept}
                            disabled={disabled}
                            onChange={handleInputChange}
                        />
                        <div className="flex flex-col items-center justify-center gap-4 pt-5 pb-6">
                            <div className="border-border relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed transition-transform duration-300 group-hover:scale-105">
                                <Upload className="text-muted-foreground h-6 w-6" />
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-foreground mb-2 text-base font-semibold">{label}</p>
                                <p className="text-muted-foreground text-sm">Drag & drop or click to browse</p>
                            </div>
                            <div className="mt-2 flex flex-wrap justify-center gap-2">
                                {accept.split(',').map((t) => (
                                    <span key={t} className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                                        {t.split('/')[1]?.toUpperCase()}
                                    </span>
                                ))}
                                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">Max {maxSizeMB}MB</span>
                            </div>
                        </div>
                    </label>
                ) : (
                    /* ── Preview with hover actions ── */
                    <div className="group relative">
                        <img src={previewUrl} alt="Preview" className="border-border h-80 w-full rounded-lg border object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {/*
                             * Edit → opens crop modal with the current previewUrl as source.
                             * Inside the modal, "Change image" lets the user swap to a new file.
                             */}
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-card h-11 w-11 rounded-full p-0"
                                title="Edit / crop"
                                disabled={disabled}
                                onClick={() => setCropSrc(previewUrl)}
                            >
                                <Edit2 className="text-foreground h-4 w-4" />
                            </Button>

                            {/* Remove → clears state, back to upload dropzone */}
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-card h-11 w-11 rounded-full p-0"
                                title="Remove image"
                                disabled={disabled}
                                onClick={onRemove}
                            >
                                <Trash2 className="text-destructive h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {displayError && <p className="text-destructive text-xs font-medium">{displayError}</p>}
            </div>

            {/* Crop modal */}
            <AnimatePresence>
                {cropSrc && (
                    <CropModal
                        src={cropSrc}
                        aspectRatio={aspectRatio}
                        accept={accept}
                        onConfirm={handleCropConfirm}
                        onCancel={handleCropCancel}
                        onChangeImage={handleChangeImageInModal}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default ImageUpload;
