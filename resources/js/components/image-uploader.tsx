import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Crop, RotateCcw, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageUploaderProps {
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  accept?: string;
  maxSizeMB?: number;
  aspectRatio?: number; // e.g. 16/9, 1, 4/3 — undefined = free crop
  uploadText?: string;
  previewHeight?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  accept = 'image/png, image/jpeg',
  maxSizeMB = 5,
  aspectRatio,
  uploadText = 'Upload Image',
  previewHeight = 'h-48',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState<'move' | 'none'>('none');
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawFileRef = useRef<File | null>(null);

  const CANVAS_W = 600;
  const CANVAS_H = 400;

  const initCrop = useCallback((imgW: number, imgH: number) => {
    const size = Math.min(imgW, imgH, CANVAS_W, CANVAS_H) * 0.7;
    const cropW = aspectRatio ? Math.min(size * aspectRatio, CANVAS_W * 0.85) : size;
    const cropH = aspectRatio ? cropW / aspectRatio : size;
    setCropArea({
      x: (CANVAS_W - cropW) / 2,
      y: (CANVAS_H - cropH) / 2,
      width: cropW,
      height: cropH,
    });
  }, [aspectRatio]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaledW = img.naturalWidth * zoom;
    const scaledH = img.naturalHeight * zoom;
    const baseX = (CANVAS_W - scaledW) / 2 + imageOffset.x;
    const baseY = (CANVAS_H - scaledH) / 2 + imageOffset.y;

    // 1. Clear everything
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Draw full image (dimmed background)
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(img, baseX, baseY, scaledW, scaledH);
    ctx.restore();

    // 3. Draw full-resolution image clipped to crop area only
    ctx.save();
    ctx.beginPath();
    ctx.rect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.clip();
    ctx.drawImage(img, baseX, baseY, scaledW, scaledH);
    ctx.restore();

    // 4. Crop border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // 5. Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cropArea.x + (cropArea.width / 3) * i, cropArea.y);
      ctx.lineTo(cropArea.x + (cropArea.width / 3) * i, cropArea.y + cropArea.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cropArea.x, cropArea.y + (cropArea.height / 3) * i);
      ctx.lineTo(cropArea.x + cropArea.width, cropArea.y + (cropArea.height / 3) * i);
      ctx.stroke();
    }

    // 6. Corner handles
    const handleSize = 10;
    ctx.fillStyle = 'white';
    const corners = [
      { x: cropArea.x, y: cropArea.y },
      { x: cropArea.x + cropArea.width, y: cropArea.y },
      { x: cropArea.x, y: cropArea.y + cropArea.height },
      { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height },
    ];
    corners.forEach(({ x, y }) => {
      ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    });
  }, [cropArea, zoom, imageOffset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB`);
      return;
    }
    rawFileRef.current = file;
    const url = URL.createObjectURL(file);
    setRawImageUrl(url);
    setZoom(1);
    setImageOffset({ x: 0, y: 0 });

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      initCrop(img.naturalWidth, img.naturalHeight);
      setCropDialogOpen(true);
    };
    img.src = url;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = '';
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const isInsideCrop = (x: number, y: number) =>
    x >= cropArea.x && x <= cropArea.x + cropArea.width &&
    y >= cropArea.y && y <= cropArea.y + cropArea.height;

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e);
    if (isInsideCrop(pos.x, pos.y)) {
      setDragMode('move');
      setDragStart({ x: pos.x - cropArea.x, y: pos.y - cropArea.y });
    } else {
      setDragMode('none');
    }
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || dragMode === 'none') return;
    const pos = getCanvasPos(e);

    if (dragMode === 'move') {
      const newX = Math.max(0, Math.min(CANVAS_W - cropArea.width, pos.x - dragStart.x));
      const newY = Math.max(0, Math.min(CANVAS_H - cropArea.height, pos.y - dragStart.y));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode('none');
  };

  const applyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputCanvas = document.createElement('canvas');
    const scaledW = img.naturalWidth * zoom;
    const scaledH = img.naturalHeight * zoom;
    const baseX = (CANVAS_W - scaledW) / 2 + imageOffset.x;
    const baseY = (CANVAS_H - scaledH) / 2 + imageOffset.y;

    const scaleX = img.naturalWidth / scaledW;
    const scaleY = img.naturalHeight / scaledH;

    const srcX = (cropArea.x - baseX) * scaleX;
    const srcY = (cropArea.y - baseY) * scaleY;
    const srcW = cropArea.width * scaleX;
    const srcH = cropArea.height * scaleY;

    outputCanvas.width = srcW;
    outputCanvas.height = srcH;
    const ctx = outputCanvas.getContext('2d')!;
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

    outputCanvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], rawFileRef.current?.name ?? 'cropped.jpg', { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      onImageChange(croppedFile, url);
      setCropDialogOpen(false);
    }, 'image/jpeg', 0.95);
  };

  const resetCrop = () => {
    if (imageRef.current) {
      setZoom(1);
      setImageOffset({ x: 0, y: 0 });
      initCrop(imageRef.current.naturalWidth, imageRef.current.naturalHeight);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input ref={fileInputRef} type="file" className="hidden" accept={accept} onChange={handleInputChange} />

      {!previewUrl ? (
        <label
          className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-muted/30 p-12 text-center transition-all duration-300 hover:border-primary/50 hover:bg-muted/50"
          onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-border transition-transform duration-300 group-hover:scale-105">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="mb-1 text-base font-semibold text-foreground">{uploadText}</p>
              <p className="text-sm text-muted-foreground">PNG, JPG up to {maxSizeMB}MB</p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">PNG</span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">JPG</span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Max {maxSizeMB}MB</span>
            </div>
          </div>
        </label>
      ) : (
        <div className="group relative">
          <img
            src={previewUrl}
            alt="Preview"
            className={`w-full rounded-lg border border-border object-cover ${previewHeight}`}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-foreground/40 opacity-0 transition group-hover:opacity-100">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 rounded-full bg-background p-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Crop className="h-4 w-4 text-foreground" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 rounded-full bg-background p-0"
              onClick={() => { setPreviewUrl(null); onImageChange(null, null); }}
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      )}

      {/* Crop Dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-4 w-4" />
              Crop Image
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Canvas */}
            <div ref={containerRef} className="overflow-hidden rounded-lg border border-border bg-black">
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="w-full cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-3">
              <ZoomOut className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1"
              />
              <ZoomIn className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="w-12 text-right text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
            </div>

            <p className="text-xs text-muted-foreground">
              Drag the crop area to reposition. Use the slider to zoom in/out.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" size="sm" onClick={resetCrop}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button type="button" variant="outline" onClick={() => setCropDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={applyCrop}>
              <Check className="mr-1.5 h-4 w-4" />
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;