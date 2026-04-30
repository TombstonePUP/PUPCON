/**
 * useImageCompressor
 * 
 * Compresses an image File client-side using an offscreen canvas.
 * Reduces file size before upload to save bandwidth and server storage.
 */

import { useCallback, useState } from 'react';

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 0.8;
const MIN_SIZE_TO_COMPRESS = 200 * 1024; // 200KB

export interface ImageCompressionResult {
    file: File;
    originalSize: number;
    compressedSize: number;
    savedPercent: number;
    skipped: boolean;
}

export function useImageCompressor() {
    const [isCompressing, setIsCompressing] = useState(false);

    const compress = useCallback(async (file: File): Promise<ImageCompressionResult> => {
        // Skip small files
        if (file.size < MIN_SIZE_TO_COMPRESS || !file.type.startsWith('image/')) {
            return {
                file,
                originalSize: file.size,
                compressedSize: file.size,
                savedPercent: 0,
                skipped: true
            };
        }

        setIsCompressing(true);

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height);
                        height = MAX_HEIGHT;
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) {
                        setIsCompressing(false);
                        resolve({ file, originalSize: file.size, compressedSize: file.size, savedPercent: 0, skipped: true });
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    // Export as JPEG for best compression ratio on typical photos
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                setIsCompressing(false);
                                resolve({ file, originalSize: file.size, compressedSize: file.size, savedPercent: 0, skipped: true });
                                return;
                            }

                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });

                            const savedPercent = Math.round(((file.size - compressedFile.size) / file.size) * 100);

                            setIsCompressing(false);
                            resolve({
                                file: compressedFile,
                                originalSize: file.size,
                                compressedSize: compressedFile.size,
                                savedPercent: Math.max(0, savedPercent),
                                skipped: false
                            });
                        },
                        'image/jpeg',
                        QUALITY
                    );
                };
                img.onerror = () => {
                    setIsCompressing(false);
                    resolve({ file: file, originalSize: file.size, compressedSize: file.size, savedPercent: 0, skipped: true });
                };
            };
            reader.onerror = () => {
                setIsCompressing(false);
                resolve({ file: file, originalSize: file.size, compressedSize: file.size, savedPercent: 0, skipped: true });
            };
        });
    }, []);

    return { compress, isCompressing };
}
