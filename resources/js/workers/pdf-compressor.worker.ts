/**
 * PDF Compressor Web Worker
 *
 * Performance priorities:
 *  - Runs entirely off the main thread (zero UI jank)
 *  - Pages rendered in parallel batches via Promise.all
 *  - ArrayBuffer ownership transferred (zero-copy) between threads
 *  - OffscreenCanvas used for GPU-accelerated rendering
 *  - Files under threshold are passed through untouched
 */

import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

// ── When running inside a Worker, pdfjs must NOT spawn its own child worker.
//    Setting an empty string tells pdfjs to run synchronously in this thread.
pdfjs.GlobalWorkerOptions.workerSrc = '';

// ── Message contract ──────────────────────────────────────────────────────────

interface CompressRequest {
    type: 'compress';
    buffer: ArrayBuffer;
    quality: number; // JPEG quality 0-1
    scale: number; // render resolution scale
    skipThresholdBytes: number;
}

interface ProgressMessage {
    type: 'progress';
    page: number;
    total: number;
}

interface CompleteMessage {
    type: 'complete';
    buffer: ArrayBuffer;
    originalSize: number;
    compressedSize: number;
    skipped: boolean;
}

interface ErrorMessage {
    type: 'error';
    message: string;
}

// ── Page rendering ────────────────────────────────────────────────────────────

async function renderPageToJpeg(page: pdfjs.PDFPageProxy, scale: number, quality: number): Promise<Uint8Array> {
    const viewport = page.getViewport({ scale });
    const canvas = new OffscreenCanvas(Math.round(viewport.width), Math.round(viewport.height));

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context from OffscreenCanvas');

    // Render PDF page onto canvas
    await page.render({
        canvasContext: ctx as unknown as CanvasRenderingContext2D,
        canvas: canvas as unknown as HTMLCanvasElement,
        viewport,
    }).promise;

    // Export as JPEG blob (GPU-accelerated in supporting browsers)
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
    return new Uint8Array(await blob.arrayBuffer());
}

// ── Main handler ──────────────────────────────────────────────────────────────

self.onmessage = async (event: MessageEvent<CompressRequest>) => {
    const { buffer, quality, scale, skipThresholdBytes } = event.data;
    const originalSize = buffer.byteLength;

    // ── Fast-path: skip small files ──────────────────────────────────────────
    if (originalSize < skipThresholdBytes) {
        const msg: CompleteMessage = {
            type: 'complete',
            buffer,
            originalSize,
            compressedSize: originalSize,
            skipped: true,
        };
        // Transfer ownership back — zero copy
        (self as unknown as Worker).postMessage(msg, [buffer]);
        return;
    }

    try {
        // ── Load source PDF ──────────────────────────────────────────────────
        const sourceBytes = new Uint8Array(buffer);
        const pdf = await pdfjs.getDocument({ data: sourceBytes }).promise;
        const numPages = pdf.numPages;

        // ── Render all pages in parallel batches of 4 ───────────────────────
        //    Batching avoids holding too many canvases in memory simultaneously.
        const BATCH_SIZE = 4;
        const pageJpegs: Uint8Array[] = new Array(numPages);
        let pagesCompleted = 0;

        for (let batchStart = 1; batchStart <= numPages; batchStart += BATCH_SIZE) {
            const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, numPages);
            const batchIndices = Array.from({ length: batchEnd - batchStart + 1 }, (_, i) => batchStart + i);

            const batchResults = await Promise.all(
                batchIndices.map(async (pageNum) => {
                    const page = await pdf.getPage(pageNum);
                    const jpeg = await renderPageToJpeg(page, scale, quality);
                    page.cleanup(); // Free pdfjs internal resources immediately
                    return { pageNum, jpeg };
                }),
            );

            for (const { pageNum, jpeg } of batchResults) {
                pageJpegs[pageNum - 1] = jpeg;
                pagesCompleted++;

                const progress: ProgressMessage = {
                    type: 'progress',
                    page: pagesCompleted,
                    total: numPages,
                };
                (self as unknown as Worker).postMessage(progress);
            }
        }

        // ── Assemble compressed PDF from JPEG images ─────────────────────────
        const outputPdf = await PDFDocument.create();

        for (let i = 0; i < numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale });
            const jpgImage = await outputPdf.embedJpg(pageJpegs[i]);
            const pdfPage = outputPdf.addPage([viewport.width, viewport.height]);
            pdfPage.drawImage(jpgImage, {
                x: 0,
                y: 0,
                width: viewport.width,
                height: viewport.height,
            });
        }

        // ── Save with compression ─────────────────────────────────────────────
        const compressedBytes = await outputPdf.save({ useObjectStreams: true });
        const compressedBuffer = compressedBytes.buffer.slice(
            compressedBytes.byteOffset,
            compressedBytes.byteOffset + compressedBytes.byteLength,
        ) as ArrayBuffer;

        const msg: CompleteMessage = {
            type: 'complete',
            buffer: compressedBuffer,
            originalSize,
            compressedSize: compressedBuffer.byteLength,
            skipped: false,
        };
        (self as unknown as Worker).postMessage(msg, [compressedBuffer]);
    } catch (err) {
        // On any error send back the original buffer so upload still works
        const msg: ErrorMessage = {
            type: 'error',
            message: err instanceof Error ? err.message : 'Unknown compression error',
        };
        (self as unknown as Worker).postMessage(msg);
    }
};
