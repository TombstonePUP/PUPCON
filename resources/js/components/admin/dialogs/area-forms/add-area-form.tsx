'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaFormCategory, AreaForms, Program } from '@/types';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';

interface AddAreaFormProps {
    program: Program;
    program_id: number;
    level_id: number;
    area_id: number;
    categories?: AreaFormCategory[];
    forms?: AreaForms[];
    onClose: () => void;
}

interface AddAreaFormForm {
    area_id: number;
    program_id: number;
    level_id: number;
    area_form_category_id: number | null;
    document: File | null;
}

export function AddAreaForm({ program, program_id, level_id, area_id, categories, forms, onClose }: AddAreaFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<AddAreaFormForm>({
        area_form_category_id: null,
        area_id: area_id,
        program_id: program_id,
        level_id: level_id,
        area_id: area_id,
        document: null,
    });

    const [isUploading, setIsUploading] = React.useState(false);

    const addAreaForm = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        post(
            route('manage.area.add.area.form', {
                program_id: data.program_id,
                level_id: data.level_id,
                area_id: data.area_id,
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
                    console.log(errors);
                    toast.dismiss('uploading');
                    toast.error('Failed to upload document', {
                        description: errors.document ?? 'There was an error uploading the document.',
                    });
                    setIsUploading(false);
                },
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <Dialog open={true} onOpenChange={() => !isUploading && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">Add Form</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Make a new form for Program Performance Profile, Self-Survey, or Compliance Report
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={addAreaForm}>
                    <div className="flex flex-col gap-6">
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">
                                Form Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.area_form_category_id?.toString() || ''}
                                onValueChange={(value) => setData('area_form_category_id', Number(value))}
                                disabled={processing}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Form Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories
                                        ?.filter((category) => !forms?.some((form) => form.area_form_category_id === category.area_form_category_id))
                                        .map((category) => (
                                            <SelectItem key={category.area_form_category_id} value={category.area_form_category_id.toString()}>
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.area_form_category_id} className="mt-2" />
                        </div>
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">Upload Document</Label>
                            <div className="flex w-full items-center justify-center">
                                {!data.document ? (
                                    <label className="border-border bg-muted hover:bg-muted/80 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="text-muted-foreground mb-4 h-8 w-8"
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
                                            <p className="text-muted-foreground text-sm">
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
                                    </label>
                                ) : (
                                    <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50 p-5 text-center">
                                        <span className="text-foreground text-sm font-semibold">{data.document.name}</span>
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
