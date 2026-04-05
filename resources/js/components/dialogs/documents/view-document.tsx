'use client';
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, FileText, Loader2, Maximize2, Minimize2, Minus, Plus, X } from 'lucide-react';

// Use a versioned CDN worker to match the expected library version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl: string;
  title?: string;
  subtitle?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ open, onOpenChange, fileUrl, title, subtitle }) => {
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setHasError(false);
      setScale(1.0);
    }
  }, [open]);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setHasError(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Failed to load PDF document:', error);
    setHasError(true);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const handleRetry = () => setHasError(false);

  const dialogSize = isFullscreen ? '!w-screen !h-screen !rounded-none' : '!w-[90vw] !h-[95vh]';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`!max-w-none ${dialogSize} flex flex-col gap-0 bg-background p-0 [&>button]:hidden border border-border shadow-2xl overflow-hidden rounded-xl`}
      >
        {/* ── Toolbar / Header ── */}
        <DialogHeader className="flex-shrink-0 bg-primary border-b border-primary/80">
          <div className="flex items-center justify-between gap-3 px-5 py-3">

            {/* Title + meta */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 border border-primary-foreground/20">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="truncate text-sm font-semibold text-primary-foreground leading-tight">
                  {title || 'Document Viewer'}
                </DialogTitle>
                {numPages > 0 && (
                  <p className="mt-0.5 text-xs text-primary-foreground/65 font-medium tabular-nums">
                    {numPages} {numPages === 1 ? 'page' : 'pages'}
                  </p>
                )}
                {subtitle && (
                  <DialogDescription className="mt-0.5 text-xs text-primary-foreground/65 truncate">
                    {subtitle}
                  </DialogDescription>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Zoom pill */}
              <div className="flex items-center gap-0.5 rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 px-1.5 py-1">
                <button
                  onClick={zoomOut}
                  disabled={scale <= 0.5 || hasError}
                  title="Zoom Out"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-primary-foreground/90 hover:bg-primary-foreground/15 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[3.25rem] text-center text-xs font-semibold text-primary-foreground/90 tabular-nums select-none">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={scale >= 3.0 || hasError}
                  title="Zoom In"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-primary-foreground/90 hover:bg-primary-foreground/15 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-primary-foreground/20" />

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground/90 hover:bg-primary-foreground/15 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => onOpenChange(false)}
                title="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground/90 hover:bg-primary-foreground/15 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* ── PDF Canvas Area ── */}
        <div className="relative flex-1 overflow-hidden bg-muted/30">
          <div className="relative flex h-full w-full items-start justify-center overflow-auto">

            {/* Error state */}
            {hasError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 text-center p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="h-7 w-7 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Failed to load document</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      The file could not be displayed. Please try again.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* PDF pages */}
            {!hasError && (
              <div className="flex w-full flex-col items-center gap-4 py-6 px-4">
                <Document
                  file={fileUrl}
                  loading={
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Loading document…</p>
                      </div>
                    </div>
                  }
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <div
                      key={`page_${index + 1}`}
                      className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-md mb-4 last:mb-0"
                    >
                      <Page
                        pageNumber={index + 1}
                        scale={scale}
                        renderAnnotationLayer={true}
                        renderTextLayer={true}
                      />
                    </div>
                  ))}
                </Document>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
