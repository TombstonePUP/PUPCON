'use client';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// node_modules/pdfjs-dist/build/pdf.worker.min.mjs

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Loader2, Maximize2, Minimize2, Minus, Plus, X } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

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

    const toggleFullscreen = () => {
        setIsFullscreen((prev) => !prev);
    };

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

    const handleRetry = () => {
        setHasError(false);
    };

    const dialogSize = isFullscreen ? '!w-screen !h-screen' : '!w-[90vw] !h-[95vh]';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`!max-w-none ${dialogSize} flex flex-col gap-0 bg-slate-50 p-0 [&>button]:hidden border-none`}>
                <DialogHeader className="rounded-t-lg text-lg font-medium text-foreground bg-gradient-to-r from-[#7f1414] to-[#d9133a] text-white">
                    <div className="flex items-center justify-between gap-0 p-4 pl-6">
                        <div>
                            <DialogTitle className="flex-1 truncate text-lg font-semibold">{title || 'Document Viewer'}</DialogTitle>
                            {/* <DialogDescription className="text-sm text-white">{subtitle || 'Document Viewer'}</DialogDescription> */}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button className='bg-[#d9405b] hover:scale-105 hover:bg-[#de5870]' size="sm" onClick={zoomOut} title="Zoom Out" disabled={scale <= 0.5 || hasError}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[3rem] text-center text-sm">{Math.round(scale * 100)}%</span>
                            <Button className='bg-[#d9405b] hover:scale-105 hover:bg-[#de5870]' size="sm" onClick={zoomIn} title="Zoom In" disabled={scale >= 3.0 || hasError}>
                                <Plus className="h-4 w-4" />
                            </Button>

                            <Button className='bg-[#d9405b] hover:scale-105 hover:bg-[#de5870]' size="sm" onClick={toggleFullscreen} title="Toggle Fullscreen">
                                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                            <Button
                                className='bg-[#d9405b] hover:scale-105 hover:bg-[#de5870]'
                                size="sm"
                                onClick={() => onOpenChange(false)} // Call the handler to close the dialog
                                title="Close Document Viewer"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="relative flex-1 overflow-hidden">
                    <div className="relative flex h-full w-full items-center justify-center overflow-auto rounded-b-lg bg-[#1e1e1e] shadow-sm">
                        {hasError && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                                <div className="flex flex-col items-center gap-3">
                                    <AlertCircle className="h-8 w-8 text-red-500" />
                                    <p className="text-sm text-slate-600">Failed to load document</p>
                                    <Button variant="outline" size="sm" onClick={handleRetry}>
                                        Try Again
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!hasError && (
                            <div className="flex h-full w-full flex-col items-center overflow-y-auto p-4">
                                <Document
                                    file={fileUrl}
                                    loading={
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                                                <p className="text-sm text-slate-600">Loading document...</p>
                                            </div>
                                        </div>
                                    }
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <div key={`page_${index + 1}`} className="mb-4 border border-slate-100 shadow-md">
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
