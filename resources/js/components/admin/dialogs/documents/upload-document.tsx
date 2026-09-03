'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { formatBytes, usePdfCompressor } from '@/hooks/use-pdf-compressor';
import { ParameterOutlines } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, FileText, Loader2, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface UploadDocumentProps {
    outline: ParameterOutlines;
    program_id: number;
    level_id: number;
    area_id: number;
    onClose: () => void;
}

interface UploadDocumentForm {
    outline_id: number;
    program_id: number;
    level_id: number;
    area_id: number;
    document?: File | null;
}

export function UploadDocument({ outline, program_id, level_id, area_id, onClose }: UploadDocumentProps) {
    const { data, setData, post, processing, errors, reset } = useForm<UploadDocumentForm>({
        outline_id: outline.parameter_outline_id,
        program_id: program_id,
        level_id: level_id,
        area_id: area_id,
        document: null,
    });

    const { compress, isCompressing, progress } = usePdfCompressor();
    const [compressionInfo, setCompressionInfo] = useState<{ originalSize: number; compressedSize: number; savedPercent: number } | null>(null);

    const handleFileChange = async (file: File | null) => {
        if (!file) {
            setData('document', null);
            setCompressionInfo(null);
            return;
        }

        const result = await compress(file);
        setData('document', result.file);

        if (!result.skipped) {
            setCompressionInfo({
                originalSize: result.originalSize,
                compressedSize: result.compressedSize,
                savedPercent: result.savedPercent,
            });
        }
    };

    const uploadDocument = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.document) {
            toast.error('No file selected', {
                description: 'Please select a PDF file before uploading.',
            });
            return;
        }

        const programLevelId = Array.isArray(program.levels) ? program.levels[0]?.accreditation_level_id : program.levels?.accreditation_level_id;

        post(
            route('manage.area.upload.file', {
                program_id: data.program_id,
                level_id: data.level_id,
                area_id: data.area_id,
                outline_id: data.outline_id,
            }),
            {
                onProgress: (progress) => {
                    if (progress?.percentage) {
                        toast.info('Uploading...', {
                            description: (
                                <div className="flex w-full items-center gap-1">
                                    <Progress value={progress.percentage} className="h-2 w-68" />
                                    <p className="text-right text-xs text-gray-500">{progress.percentage}%</p>
                                </div>
                            ),
                            id: 'uploading',
                        });
                    }
                },
                onSuccess: () => {
                    toast.dismiss('uploading');
                    reset();
                    setCompressionInfo(null);
                    onClose();
                },
                onError: (errors) => {
                    toast.dismiss('uploading');
                    toast.error('Failed to upload document', {
                        description: errors.document ?? 'There was an error uploading the document.',
                    });
                },
            },
        );
    };

    const isBusy = isCompressing || processing;

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent hideCloseButton className="border-border overflow-hidden rounded-xl border p-0 shadow-2xl sm:max-w-[480px]">
                {/* ── Header ── */}
                <DialogHeader className="bg-primary border-primary/80 flex min-w-0 border-b px-6 py-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="bg-primary-foreground/15 border-primary-foreground/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                            <Upload className="text-primary-foreground h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <DialogTitle className="text-primary-foreground text-base leading-tight font-bold">Upload Document</DialogTitle>
                            <DialogDescription className="text-primary-foreground/75 mt-0.5 line-clamp-3 text-xs font-medium text-pretty break-words">
                                {outline.initial && `${outline.initial}.`}
                                {outline.outline_number}. {outline.outline_description}
                            </DialogDescription>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-primary-foreground/90 hover:bg-primary-foreground/15 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </DialogHeader>

                <form onSubmit={uploadDocument} className="flex min-w-0 flex-col">
                    <div className="min-w-0 space-y-5 p-6">
                        <div className="min-w-0 space-y-3">
                            {/* ── Drop zone (no file selected) ── */}
                            {!data.document && !isCompressing && (
                                <label
                                    className={`group border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/40 relative flex min-h-[160px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${isBusy ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}
                                >
                                    <div className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="bg-background border-border group-hover:bg-primary/5 group-hover:border-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full border transition-colors">
                                            <FileText className="text-muted-foreground group-hover:text-primary h-6 w-6 transition-colors" />
                                        </div>
                                        <p className="text-foreground text-sm font-semibold">Click to select a document</p>
                                        <p className="text-muted-foreground mt-1 max-w-[240px] text-xs text-pretty">
                                            Only PDF documents are accepted. Files larger than 500KB will be automatically optimized.
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf"
                                        disabled={isBusy}
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            handleFileChange(file);
                                        }}
                                    />
                                </label>
                            )}

                            {/* ── Compressing state ── */}
                            {isCompressing && (
                                <div className="border-primary/30 bg-primary/5 flex min-h-[160px] w-full animate-pulse flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-6">
                                    <div className="bg-primary/10 border-primary/20 flex h-12 w-12 items-center justify-center rounded-full border">
                                        <Loader2 className="text-primary h-6 w-6 animate-spin" />
                                    </div>
                                    <div className="w-full max-w-[200px] space-y-2">
                                        <div className="text-primary flex items-center justify-between text-xs font-bold tabular-nums">
                                            <span>Optimising PDF…</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="bg-primary/20 h-1.5" />
                                    </div>
                                </div>
                            )}

                            {/* ── File ready ── */}
                            {data.document && !isCompressing && (
                                <div className="border-border bg-muted/20 flex min-h-[160px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border p-6">
                                    <div className="bg-background border-border flex w-full items-center gap-3 rounded-lg border p-3 shadow-sm">
                                        <div className="bg-primary/10 border-primary/15 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                                            <FileText className="text-primary h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1 overflow-hidden">
                                            <p className="text-foreground w-full truncate text-sm font-semibold">{data.document.name}</p>
                                            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                                                PDF Document • {formatBytes(data.document.size)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => {
                                                setData('document', null);
                                                setCompressionInfo(null);
                                            }}
                                            className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Compression savings badge */}
                                    {compressionInfo && compressionInfo.savedPercent > 0 && (
                                        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/15 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400">
                                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                                            <span>Optimised • {compressionInfo.savedPercent}% smaller</span>
                                            <span className="text-green-600/50 tabular-nums dark:text-green-400/50">
                                                ({formatBytes(compressionInfo.originalSize)} → {formatBytes(compressionInfo.compressedSize)})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <InputError message={errors.document} className="px-1" />
                        </div>
                    </div>

                    <DialogFooter className="bg-muted/30 border-border gap-3 border-t p-4 px-6">
                        <Button type="button" variant="outline" disabled={isBusy} onClick={onClose} className="bg-background">
                            Cancel
                        </Button>
                        <Button
                            variant="noborder"
                            type="submit"
                            disabled={isBusy || !data.document}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading…
                                </>
                            ) : (
                                'Upload File'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
