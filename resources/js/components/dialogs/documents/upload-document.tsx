'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { formatBytes, usePdfCompressor } from '@/hooks/use-pdf-compressor';
import { ParameterOutlines, Program } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, FileText, Loader2, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface UploadDocumentProps {
    outline: ParameterOutlines;
    program: Program;
    area_id: number;
    onClose: () => void;
}

interface UploadDocumentForm {
    outline_id: number;
    document?: File | null;
}

export function UploadDocument({ outline, program, area_id, onClose }: UploadDocumentProps) {
    const { data, setData, post, processing, errors, reset } = useForm<UploadDocumentForm>({
        outline_id: outline.parameter_outline_id,
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

        const programLevelId = Array.isArray(program.levels) 
            ? (program.levels as any)[0]?.accreditation_level_id 
            : (program.levels as any)?.accreditation_level_id;

        post(route('manage.area.upload.file', {
            program_id: program.program_id,
            level_id: programLevelId,
            area_id: area_id,
            outline_id: outline.parameter_outline_id,
        }), {
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
        });
    };

    const isBusy = isCompressing || processing;

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="overflow-hidden p-0 sm:max-w-[480px] border border-border shadow-2xl rounded-xl">
                {/* ── Header ── */}
                <DialogHeader className="bg-primary px-6 py-4 border-b border-primary/80">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 border border-primary-foreground/20">
                            <Upload className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <DialogTitle className="text-base font-bold text-primary-foreground leading-tight">
                                Upload Document
                            </DialogTitle>
                            <DialogDescription className="mt-0.5 text-xs text-primary-foreground/75 font-medium truncate">
                                {outline.initial && `${outline.initial}.`}{outline.outline_number}. {outline.outline_description}
                            </DialogDescription>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground/90 hover:bg-primary-foreground/15 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </DialogHeader>

                <form onSubmit={uploadDocument} className="flex flex-col">
                    <div className="p-6 space-y-5">
                        <div className="space-y-3">
                            {/* ── Drop zone (no file selected) ── */}
                            {!data.document && !isCompressing && (
                                <label className={`group relative flex min-h-[160px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all hover:bg-muted/50 hover:border-primary/40 ${isBusy ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}>
                                    <div className="flex flex-col items-center justify-center text-center p-6">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                            <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Click to select a document
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground text-pretty max-w-[240px]">
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
                                <div className="flex min-h-[160px] w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 animate-pulse">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                    <div className="w-full max-w-[200px] space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-primary tabular-nums">
                                            <span>Optimising PDF…</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="h-1.5 bg-primary/20" />
                                    </div>
                                </div>
                            )}

                            {/* ── File ready ── */}
                            {data.document && !isCompressing && (
                                <div className="flex min-h-[160px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/20 p-6">
                                    <div className="flex items-center gap-3 bg-background border border-border p-3 rounded-lg shadow-sm w-full">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/15">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {data.document.name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                PDF Document • {formatBytes(data.document.size)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => { setData('document', null); setCompressionInfo(null); }}
                                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Compression savings badge */}
                                    {compressionInfo && compressionInfo.savedPercent > 0 && (
                                        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/15 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400 w-full justify-center">
                                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                                            <span>Optimised • {compressionInfo.savedPercent}% smaller</span>
                                            <span className="text-green-600/50 dark:text-green-400/50 tabular-nums">
                                                ({formatBytes(compressionInfo.originalSize)} → {formatBytes(compressionInfo.compressedSize)})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <InputError message={errors.document} className="px-1" />
                        </div>
                    </div>

                    <DialogFooter className="bg-muted/30 border-t border-border p-4 px-6 gap-3">
                        <Button 
                            type="button"
                            variant="outline" 
                            disabled={isBusy} 
                            onClick={onClose}
                            className="bg-background"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="noborder" 
                            type="submit" 
                            disabled={isBusy || !data.document}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
                        >
                            {processing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
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
