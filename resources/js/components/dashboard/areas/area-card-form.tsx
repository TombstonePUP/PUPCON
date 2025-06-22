"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import {  Link, useForm } from '@inertiajs/react';
import { useState } from "react";
import { AreaFormCategory, AreaForms } from "@/types";
import InputError from "@/components/input-error";
import { Input } from "@headlessui/react";

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
    area_form_file?: File | null;
}

export default function AreaCards({ program, forms, areaId, categories }: AreaCardsProps) {
    const {
        data: dataForms,
        setData: setFormsData,
        delete: destroyForms,
        post: addForms,
        patch: updateForms,
        processing: processingForms,
        errors: errorsForms,
        reset: resetForms,
    } = useForm<AreaFormsForm>({
        area_form_id: null,
        area_id: areaId,
        area_form_category_id: null,
        area_form_file: null,
    });

    const addAreaForm = (e: React.FormEvent) => {
        e.preventDefault();
        addForms(route('manage.area.addAreaForm', [program.program_name, areaId]), {
            onSuccess: () => {
                resetForms();
            },
        });
    }

    const updateAreaForm = (e: React.FormEvent) => {
        e.preventDefault();
        updateForms(route('manage.area.updateAreaForm', [program.program_name, areaId, dataForms.area_form_id]), {
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
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-center w-full">
                {/* Render existing forms */}
                {forms.map((card) => (
                    <div key={card.area_form_id} className="group relative grid w-fit place-items-center gap-1 rounded border p-2">
                        <img className="rounded w-full h-40 object-cover" src="/images/placeholder.png" alt="" />
                        <p className="mt-3 mb-[-0.3vw] text-center text-sm text-[#858585]">AACCUP | Level II</p>
                        <h1 className="w-80 text-center text-2xl leading-none font-black">
                            {card.area_form_category?.category_name}
                        </h1>
                        <p className="my-5 text-center text-sm">{`${program.degree_type} in ${program.program_name}`}</p>

                        {/* Edit/Remove buttons (appear on hover) */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Dialog className="w-full">
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">View</DialogTitle>
                                        <DialogDescription>
                                            <iframe
                                                src={card.file_path}
                                                width="100%"
                                                height="500"
                                                className="rounded border border-gray-300"
                                            >
                                            </iframe>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Edit Card</DialogTitle>
                                        <DialogDescription>
                                            Update the  details
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form>
                                        <div className="flex flex-col gap-4 py-4">
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">Card Type</label>
                                                <select
                                                    name="cardType"
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    defaultValue={card.area_form_category?.category_name}
                                                    required
                                                >
                                                    <option value="ppp">Program Performance Profile</option>
                                                    <option value="self-survey">Self-Survey</option>
                                                    <option value="compliance">Compliance Report</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                    {card.file_path ? 'Replace Document' : 'Upload Document'}
                                                </label>
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            {card.file_name && (
                                                                <p className="text-xs text-gray-700 mt-1">
                                                                    Current: {card.file_name}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                                                        </div>
                                                        <input
                                                            name="document"
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline" id="edit-card-dialog-close">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button type="submit" variant="black">Save Changes</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Are you sure?</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to remove this ?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            // onClick={() => handleRemoveCard(card.id)}
                                        >
                                            Remove
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}
                {/* Add Card Form */}
                <div className={`border p-2 rounded grid place-items-center gap-1 ${forms.length > 0 ? 'w-fit' : 'w-full'}`}>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex flex-col items-center gap-1 h-full w-full p-4 hover:bg-gray-50"
                            >
                                <div className="rounded-full border-2 border-dashed border-[#B4B4B4] p-3">
                                    <Plus className="h-6 w-6 text-[#B4B4B4]" />
                                </div>
                                <p className='text-[#B4B4B4] text-sm'>Add Form</p>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Add Card</DialogTitle>
                                <DialogDescription>
                                    Make a new card for Program Performance Profile, Self-Survey, or Compliance Report
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(e) => addAreaForm(e)}>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Card Type</label>
                                        <select
                                            name="cardType"
                                            className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                            id="area_form_category_id"
                                            value={dataForms.area_form_category_id}
                                            onChange={(e) => setFormsData('area_form_category_id', e.target.value)}
                                            disabled={processingForms}
                                            defaultValue=""
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.area_form_category_id} value={category.area_form_category_id}>
                                                    {category.category_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errorsForms.area_form_category_id} className="mt-2"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Upload Document</label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-gray-500">PDF</p>
                                                </div>
                                                <input
                                                    name="document"
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf"
                                                    onChange={(e) => setFormsData('area_form_file', e.target.files ? e.target.files[0] : null)}
                                                />
                                            </label>
                                            <InputError message={errorsForms.area_form_file} className="mt-2"/>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="mt-2">
                                    <DialogClose asChild >
                                        <Button type="button" variant="outline" id="add-card-dialog-close" disabled={processingForms}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button  type="submit" variant="black" disabled={processingForms}>Submit</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
