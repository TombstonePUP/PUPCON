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
                className={`!max-w-none ${dialogSize} bg-background border-border flex flex-col gap-0 overflow-hidden rounded-xl border p-0 shadow-2xl [&>button]:hidden`}
            >
                {/* ── Toolbar / Header ── */}
                <DialogHeader className="bg-primary border-primary/80 flex-shrink-0 border-b">
                    <div className="flex items-center justify-between gap-3 px-5 py-3">
                        {/* Title + meta */}
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="bg-primary-foreground/15 border-primary-foreground/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border">
                                <FileText className="text-primary-foreground h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-primary-foreground truncate text-sm leading-tight font-semibold">
                                    {title || 'Document Viewer'}
                                </DialogTitle>
                                {numPages > 0 && (
                                    <p className="text-primary-foreground/65 mt-0.5 text-xs font-medium tabular-nums">
                                        {numPages} {numPages === 1 ? 'page' : 'pages'}
                                    </p>
                                )}
                                {subtitle && (
                                    <DialogDescription className="text-primary-foreground/65 mt-0.5 truncate text-xs">{subtitle}</DialogDescription>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-shrink-0 items-center gap-2">
                            {/* Zoom pill */}
                            <div className="border-primary-foreground/25 bg-primary-foreground/10 flex items-center gap-0.5 rounded-lg border px-1.5 py-1">
                                <button
                                    onClick={zoomOut}
                                    disabled={scale <= 0.5 || hasError}
                                    title="Zoom Out"
                                    className="text-primary-foreground/90 hover:bg-primary-foreground/15 flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="text-primary-foreground/90 min-w-[3.25rem] text-center text-xs font-semibold tabular-nums select-none">
                                    {Math.round(scale * 100)}%
                                </span>
                                <button
                                    onClick={zoomIn}
                                    disabled={scale >= 3.0 || hasError}
                                    title="Zoom In"
                                    className="text-primary-foreground/90 hover:bg-primary-foreground/15 flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            {/* Separator */}
                            <div className="bg-primary-foreground/20 h-6 w-px" />

                            {/* Fullscreen */}
                            <button
                                onClick={toggleFullscreen}
                                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                                className="text-primary-foreground/90 hover:bg-primary-foreground/15 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                            >
                                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </button>

                            {/* Close */}
                            <button
                                onClick={() => onOpenChange(false)}
                                title="Close"
                                className="text-primary-foreground/90 hover:bg-primary-foreground/15 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </DialogHeader>

                {/* ── PDF Canvas Area ── */}
                <div className="bg-muted/30 relative flex-1 overflow-hidden">
                    <div className="relative flex h-full w-full items-start justify-center overflow-auto">
                        {/* Error state */}
                        {hasError && (
                            <div className="bg-background absolute inset-0 z-10 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4 p-8 text-center">
                                    <div className="bg-destructive/10 border-destructive/20 flex h-14 w-14 items-center justify-center rounded-full border">
                                        <AlertCircle className="text-destructive h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-foreground text-sm font-semibold">Failed to load document</p>
                                        <p className="text-muted-foreground mt-1 text-xs">The file could not be displayed. Please try again.</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleRetry}>
                                        Try Again
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* PDF pages */}
                        {!hasError && (
                            <div className="flex w-full flex-col items-center gap-4 px-4 py-6">
                                <Document
                                    file={fileUrl}
                                    loading={
                                        <div className="bg-background absolute inset-0 z-10 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                                                <p className="text-muted-foreground text-sm font-medium">Loading document…</p>
                                            </div>
                                        </div>
                                    }
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                >
                                    {Array.from(new Array(numPages), (_, index) => (
                                        <div
                                            key={`page_${index + 1}`}
                                            className="border-border/60 bg-card mb-4 overflow-hidden rounded-lg border shadow-md last:mb-0"
                                        >
                                            <Page pageNumber={index + 1} scale={scale} renderAnnotationLayer={true} renderTextLayer={true} />
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
