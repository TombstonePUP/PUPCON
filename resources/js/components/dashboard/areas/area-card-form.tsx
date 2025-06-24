'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaFormCategory, AreaForms } from '@/types';
import { useForm } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type AreaCardsProps = {
    program: {
        program_name: string;
        degree_type: string;
    };
    forms: AreaForms[];
    areaId: number;
    categories: AreaFormCategory[];
};

interface AreaFormsForm {
    area_form_id?: number | null;
    area_id?: number | null;
    area_form_category_id?: number | null;
    form_file?: File | null;
}

export default function AreaCards({ program, forms, areaId, categories }: AreaCardsProps) {
    const {
        data: dataForms,
        setData: setFormsData,
        delete: destroyForms,
        post: postForms,
        processing: processingForms,
        errors: errorsForms,
        reset: resetForms,
    } = useForm<AreaFormsForm>({
        area_form_id: null,
        area_id: areaId,
        area_form_category_id: null,
        form_file: null,
    });

    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const addAreaForm = (e: React.FormEvent) => {
        e.preventDefault();
        postForms(route('manage.area.addAreaForm', [program.program_name, areaId]), {
            onSuccess: () => {
                resetForms();
                setSelectedFileName(null);
                setDialogOpen(false);
            },
        });
    };

    const updateAreaForm = (e: React.FormEvent) => {
        e.preventDefault();
        postForms(route('manage.area.updateAreaForm', [program.program_name, areaId, dataForms.area_form_id]), {
            onSuccess: () => {
                resetForms();
            },
        });
    };

    const deleteAreaForm = (areaFormId: number) => {
        destroyForms(route('manage.area.deleteAreaForm', [program.program_name, areaId, areaFormId]), {
            onSuccess: () => {
                resetForms();
            },
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex w-full justify-center gap-2">
                {/* Render existing forms */}
                {forms.map((card) => (
                    <div key={card.area_form_id} className="group relative grid w-full place-items-center gap-1 rounded border p-2">
                        <img className="h-40 w-full rounded object-cover" src="/images/placeholder.png" alt="" />
                        <p className="mt-3 mb-[-0.3vw] text-center text-sm text-[#858585]">AACCUP | Level II</p>
                        <h1 className="w-80 text-center text-2xl leading-none font-bold">{card.area_form_category?.category_name}</h1>
                        <p className="my-5 text-center text-sm">{`${program.degree_type} in ${program.program_name}`}</p>

                        {/* Edit/Remove buttons (appear on hover) */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Dialog className="w-full">
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">View</DialogTitle>
                                        <DialogDescription>
                                            <iframe
                                                src={card.file_path}
                                                width="100%"
                                                height="500"
                                                className="rounded border border-gray-300"
                                            ></iframe>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">Edit Card</DialogTitle>
                                        <DialogDescription>Update the details of {card.area_form_category?.category_name}</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={(e) => updateAreaForm(e)}>
                                        <div className="flex flex-col pb-4">
                                            <div>
                                                <InputError message={errorsForms.area_form_category_id} className="mt-2" />
                                            </div>
                                            <div>
                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                                                    {card.file_path ? 'Replace Document' : 'Upload Document'}
                                                </label>
                                                <div className="flex w-full items-center justify-center">
                                                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
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
                                                            onChange={(e) => setFormsData('form_file', e.target.files ? e.target.files[0] : null)}
                                                        />
                                                    </label>
                                                    <InputError message={errorsForms.form_file} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline" id="edit-card-dialog-close" disabled={processingForms}>
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                variant="noborder"
                                                disabled={processingForms}
                                                onClick={(e) => setFormsData('area_form_id', card.area_form_id)}
                                            >
                                                Save Changes
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">Are you sure?</DialogTitle>
                                        <DialogDescription>Are you sure you want to remove this ?</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="button" variant="noborder" onClick={() => deleteAreaForm(card.area_form_id)}>
                                            Remove
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}
                {/* Add Card Form */}
                {forms.length < 3 ? (
                    <div className={`grid w-full place-items-center gap-1 rounded border p-2`}>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex h-full w-full flex-col items-center gap-1 p-4 hover:bg-gray-50"
                                    onClick={() => setDialogOpen(true)}
                                >
                                    <div className="rounded-full border-2 border-dashed border-[#B4B4B4] p-3">
                                        <Plus className="h-6 w-6 text-[#B4B4B4]" />
                                    </div>
                                    <p className="text-sm text-[#B4B4B4]">Add Form</p>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Add Card</DialogTitle>
                                    <DialogDescription>
                                        Make a new card for Program Performance Profile, Self-Survey, or Compliance Report
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={(e) => {
                                        addAreaForm(e);
                                    }}
                                >
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Card Type</label>
                                            <Select
                                                value={dataForms.area_form_category_id?.toString() || ''}
                                                onValueChange={(value) => setFormsData('area_form_category_id', value)}
                                                disabled={processingForms}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories
                                                        .filter(
                                                            (category) =>
                                                                !forms.some((form) => form.area_form_category_id === category.area_form_category_id),
                                                        )
                                                        .map((category) => (
                                                            <SelectItem
                                                                key={category.area_form_category_id}
                                                                value={category.area_form_category_id.toString()}
                                                            >
                                                                {category.category_name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errorsForms.area_form_category_id} className="mt-2" />
                                        </div>
                                        <div>
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Upload Document</label>
                                            <div className="flex w-full items-center justify-center">
                                                {!selectedFileName ? (
                                                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
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
                                                                setFormsData('form_file', file);
                                                                setSelectedFileName(file ? file.name : null);
                                                            }}
                                                        />
                                                    </label>
                                                ) : (
                                                    <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50">
                                                        <span className="text-sm font-semibold text-gray-700">{selectedFileName}</span>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={() => {
                                                                setFormsData('form_file', null);
                                                                setSelectedFileName(null);
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                )}
                                                <InputError message={errorsForms.form_file} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-2">
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline" id="add-card-dialog-close" disabled={processingForms}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" className="border-none" disabled={processingForms}>
                                            Submit
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}
