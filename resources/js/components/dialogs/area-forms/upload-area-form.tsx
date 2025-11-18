'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AreaForms, Program } from '@/types';
import { useForm } from '@inertiajs/react';
import React from 'react';
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

    console.log(form);

    const [isUploading, setIsUploading] = React.useState(false);

    const uploadAreaForm = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        setIsUploading(true);
        post(
            route('manage.area.upload.area.form.file', {
                program_name: program.program_name,
                level_id: program.levels[0]?.accreditation_level_id,
                area_id: area_id,
                form_id: form.area_form_id,
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
            },
        );
    };

    return (
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                      <DialogTitle className="text-lg font-medium text-gray-900">{form.file_name ? 'Update' : 'Upload'} Document</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">Upload a Document for this card</DialogDescription>
                </DialogHeader>
                <form  className="flex flex-col gap-4" onSubmit={uploadAreaForm}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex flex-col w-full items-center justify-center">
                                {!data.document ? (
                                    <Label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="mb-4 h-8 w-8 text-gray-500"
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
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PDF</p>
                                        </div>
                                        <input
                                            name="document"
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={(e) => {
                                                const file = e.target.files ? e.target.files[0] : null;
                                                setData('document', file);
                                            }}
                                        />
                                    </Label>
                                ) : (
                                    <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50 p-5 text-center">
                                        <span className="text-sm font-semibold text-gray-700">{data.document.name}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => {
                                                setData('document', null);
                                            }}
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
                            <Button type="button" variant="outline" id="add-card-dialog-close" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="border-none" disabled={processing}>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
