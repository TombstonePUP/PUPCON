'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { formatBytes, usePdfCompressor } from '@/hooks/use-pdf-compressor';
import { AreaForms, Program } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, FileText, Loader2, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface UploadAreaFormProps {
    program: Program;
    area_id: number;
    form: AreaForms;
    onClose: () => void;
}

interface UploadAreaFormForm {
    document: File | null;
}

export function UploadAreaForm({ program, form, area_id, onClose }: UploadAreaFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<UploadAreaFormForm>({
        document: null,
    });

    const { compress, isCompressing, progress } = usePdfCompressor();
    const [compressionInfo, setCompressionInfo] = useState<{ savedPercent: number; compressedSize: number } | null>(null);

    const handleFileChange = async (file: File | null) => {
        if (!file) {
            setData('document', null);
            setCompressionInfo(null);
            return;
        }

        const result = await compress(file);
        setData('document', result.file);

        if (!result.skipped && result.savedPercent > 0) {
            setCompressionInfo({ savedPercent: result.savedPercent, compressedSize: result.compressedSize });
        }
    };

    const uploadAreaForm = (e: React.FormEvent) => {
        e.preventDefault();
        post(
            route('manage.area.upload.area.form.file', {
                program_id: program.program_id,
                level_id: Array.isArray(program.levels) ? (program.levels as any)[0]?.accreditation_level_id : (program.levels as any)?.accreditation_level_id,
                area_id: area_id,
                form_id: form.area_form_id,
            }),
            {
                onProgress: (p) => {
                    if (p?.percentage) {
                        toast.info('Uploading...', {
                            description: (
                                <div className="flex w-full items-center gap-1">
                                    <Progress value={p.percentage} className="h-2 w-68" />
                                    <p className="text-right text-xs text-gray-500">{p.percentage}%</p>
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
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-foreground">
                        {form.file_name ? 'Update' : 'Upload'} Document
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Upload a document for this card
                    </DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-4" onSubmit={uploadAreaForm}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex flex-col w-full items-center justify-center">

                                {/* ── Drop zone ── */}
                                {!data.document && !isCompressing && (
                                    <Label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-0.5">PDF only</p>
                                        </div>
                                        <input
                                            name="document"
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={(e) => {
                                                const file = e.target.files ? e.target.files[0] : null;
                                                handleFileChange(file);
                                            }}
                                        />
                                    </Label>
                                )}

                                {/* ── Compressing ── */}
                                {isCompressing && (
                                    <div className="flex h-32 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            Optimising PDF…
                                        </div>
                                        <div className="w-40">
                                            <Progress value={progress} className="h-1.5" />
                                        </div>
                                        <p className="text-xs text-muted-foreground tabular-nums">{progress}%</p>
                                    </div>
                                )}

                                {/* ── File ready ── */}
                                {data.document && !isCompressing && (
                                    <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span className="max-w-[200px] truncate text-sm font-medium text-foreground">
                                                {data.document.name}
                                            </span>
                                        </div>

                                        {compressionInfo && compressionInfo.savedPercent > 0 && (
                                            <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Optimised • {compressionInfo.savedPercent}% smaller
                                                <span className="text-green-600/60 dark:text-green-400/60">
                                                    ({formatBytes(compressionInfo.compressedSize)})
                                                </span>
                                            </div>
                                        )}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={processing}
                                            onClick={() => { setData('document', null); setCompressionInfo(null); }}
                                        >
                                            Remove File
                                        </Button>
                                    </div>
                                )}

                                <InputError message={errors.document} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" id="add-card-dialog-close" disabled={isBusy}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="border-none" disabled={isBusy || !data.document}>
                            {processing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
