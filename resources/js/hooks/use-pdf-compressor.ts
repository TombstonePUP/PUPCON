/**
 * usePdfCompressor
 *
 * Compresses a PDF File client-side using a Web Worker (zero UI blocking).
 *
 * Performance notes:
 *  - Worker is instantiated once and reused (no per-call startup cost)
 *  - ArrayBuffer is transferred (not copied) to the worker
 *  - Files < SKIP_THRESHOLD_BYTES bypass compression entirely
 *  - On any worker error, the original file is returned as a safe fallback
 */

import PdfCompressorWorker from '@/workers/pdf-compressor.worker.ts?worker';
import { useCallback, useEffect, useRef, useState } from 'react';

import PdfCompressorWorker from '../workers/pdf-compressor.worker?worker&inline';

// ── Tune these for the quality / size tradeoff ────────────────────────────────
const SKIP_THRESHOLD_BYTES = 500 * 1024; // Files < 500 KB skip compression
const JPEG_QUALITY = 0.82; // 82% — good balance for documents
const RENDER_SCALE = 1.5; // 1.5× keeps text readable at screen res

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CompressionResult {
    file: File;
    originalSize: number;
    compressedSize: number;
    skipped: boolean; // true if file was below threshold
    savedBytes: number;
    savedPercent: number;
}

interface CompressionState {
    isCompressing: boolean;
    progress: number; // 0–100
}

interface UsePdfCompressorReturn extends CompressionState {
    compress: (file: File) => Promise<CompressionResult>;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function usePdfCompressor(): UsePdfCompressorReturn {
    const workerRef = useRef<Worker | null>(null);
    const [state, setState] = useState<CompressionState>({
        isCompressing: false,
        progress: 0,
    });

    // Lazily instantiate the Worker the first time compress() is called.
    // Vite's `?worker&inline` bundles the worker (with its pdf-lib/pdfjs
    // imports) into this module and creates it from a same-origin Blob URL.
    // Because the Blob URL shares the page's origin, this avoids the
    // cross-origin module-worker error when the app is browsed on :8000 while
    // Vite serves assets from :5173.
    const getWorker = useCallback((): Worker => {
        if (!workerRef.current) {
            workerRef.current = new PdfCompressorWorker();
        }
        return workerRef.current;
    }, []);

    // Terminate the worker when the component unmounts
    useEffect(() => {
        return () => {
            workerRef.current?.terminate();
            workerRef.current = null;
        };
    }, []);

    const compress = useCallback(
        async (file: File): Promise<CompressionResult> => {
            setState({ isCompressing: true, progress: 0 });

            // Read the file as ArrayBuffer
            let buffer: ArrayBuffer;
            try {
                buffer = await file.arrayBuffer();
            } catch {
                // Can't read the file — hand it back untouched
                setState({ isCompressing: false, progress: 0 });
                return {
                    file,
                    originalSize: file.size,
                    compressedSize: file.size,
                    skipped: true,
                    savedBytes: 0,
                    savedPercent: 0,
                };
            }

            return new Promise((resolve) => {
                const worker = getWorker();

                worker.onmessage = (event: MessageEvent) => {
                    const msg = event.data;

                    if (msg.type === 'progress') {
                        const progress = Math.round((msg.page / msg.total) * 100);
                        setState({ isCompressing: true, progress });
                    } else if (msg.type === 'complete') {
                        const { buffer: outBuffer, originalSize, compressedSize, skipped } = msg;

                        const compressedBlob = new Blob([outBuffer], { type: 'application/pdf' });
                        const compressedFile = new File([compressedBlob], file.name, {
                            type: 'application/pdf',
                        });

                        const savedBytes = Math.max(0, originalSize - compressedSize);
                        const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

                        setState({ isCompressing: false, progress: 100 });

                        resolve({
                            file: compressedFile,
                            originalSize,
                            compressedSize,
                            skipped,
                            savedBytes,
                            savedPercent,
                        });
                    } else if (msg.type === 'error') {
                        console.warn('[usePdfCompressor] Worker error — using original file:', msg.message);
                        setState({ isCompressing: false, progress: 0 });
                        // Graceful fallback: never block the upload
                        resolve({
                            file,
                            originalSize: file.size,
                            compressedSize: file.size,
                            skipped: true,
                            savedBytes: 0,
                            savedPercent: 0,
                        });
                    }
                };

                worker.onerror = (err) => {
                    console.warn('[usePdfCompressor] Worker crashed — using original file:', err.message);
                    setState({ isCompressing: false, progress: 0 });
                    resolve({
                        file,
                        originalSize: file.size,
                        compressedSize: file.size,
                        skipped: true,
                        savedBytes: 0,
                        savedPercent: 0,
                    });
                };

                // Transfer the buffer (zero-copy) to the worker
                worker.postMessage(
                    {
                        type: 'compress',
                        buffer,
                        quality: JPEG_QUALITY,
                        scale: RENDER_SCALE,
                        skipThresholdBytes: SKIP_THRESHOLD_BYTES,
                    },
                    [buffer],
                );
            });
        },
        [getWorker],
    );

    return { ...state, compress };
}

// ── Utility ───────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
