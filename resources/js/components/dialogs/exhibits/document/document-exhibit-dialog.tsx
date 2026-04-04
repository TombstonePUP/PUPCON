import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Exhibits } from '@/types/exhibits';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState } from 'react';
import React from 'react';
import InputError from '@/components/input-error';

interface DocumentExhibitDialogProps {
    type: 'edit' | 'add';
    exhibit: Exhibits;
    onClose: () => void;
}

interface DocumentExhibitForm {
    exhibit_id: number | null;
    file: File | null;
}

export default function DocumentExhibitDialog({ type, exhibit, onClose }: DocumentExhibitDialogProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { data, setData, post , processing, errors, reset } = useForm<DocumentExhibitForm>({
        exhibit_id: exhibit.exhibit_id || null,
        file: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsUploading(true);
            post(route('exhibit.file.upload'),
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
                        setIsUploading(false);
                        onClose();
                    },
                    onError: (errors) => {
                        toast.dismiss('uploading');
                        toast.error('Failed to upload document', {
                            description: errors.document ?? 'There was an error uploading the document.',
                        });
                        setIsUploading(false);
                    },
                }
            );
        } catch (error) {
            toast.dismiss('uploading');
            toast.error('Unexpected error occurred', {
                description: error instanceof Error ? error.message : 'An unexpected error occurred during upload.',
            });
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-foreground">{type === 'edit' ? 'Update Document' : 'Upload Document'}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {`Upload a PDF document for the exhibit "${exhibit.exhibit_name}".`}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    {!data.file ? (
                        <label
                            className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80 ${isUploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'
                                }`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    className="mb-4 h-8 w-8 text-muted-foreground"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PDF</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf"
                                disabled={isUploading || processing}
                                onChange={(e) => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    setData('file', file);
                                }}
                            />
                        </label>
                    ) : (
                        <div
                            className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80 ${isUploading ? 'pointer-events-none opacity-70' : ''
                                }`}
                        >
                            <span className="text-sm font-semibold text-foreground">{data.file.name}</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                disabled={isUploading}
                                onClick={() => setData('file', null)}
                            >
                                Remove File
                            </Button>
                        </div>
                    )}
                    <InputError message={errors.file} className="mt-2" />
                </div>
                <DialogFooter className="mt-2">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            id="add-card-dialog-close"
                            disabled={isUploading || processing}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        className="border-none"
                        disabled={isUploading || processing}
                        onClick={handleSubmit}
                    >
                        {type === 'edit' ? 'Update Document' : 'Upload Document'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
