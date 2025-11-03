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
import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaFormCategory, AreaForms, Program } from '@/types';
import { useForm } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AreaFormDialogParams {
    type: 'view' | 'upload' | 'add' | 'delete' | 'rejected';
    form?: AreaForms;
    forms?: AreaForms[];
}

type AreaCardsProps = {
    program: Program;
    forms: AreaForms[];
    // areaId: number;
    resolveFormDialog: (params: AreaFormDialogParams) => void;
};

interface AreaFormsForm {
    area_form_id?: number | null;
    area_id?: number | null;
    area_form_category_id?: number | null;
    form_file?: File | null;
}

export default function AreaCards({program, forms, resolveFormDialog }: AreaCardsProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex w-full justify-center gap-2">
                {forms.map((card) => (
                    <div key={card.area_form_id} className="group relative grid w-full place-items-center gap-1 rounded border p-2">
                        <img className="h-40 w-full rounded object-cover" src="/images/placeholder.png" alt="" />
                        <p className="mt-3 mb-[-0.3vw] text-center text-sm text-[#858585]">AACCUP | Level II</p>
                        <h1 className="w-80 text-center text-2xl leading-none font-bold">{(card.area_form_category as AreaFormCategory | undefined)?.category_name}</h1>
                        <p className="my-5 text-center text-sm">{`${program.degree_type} in ${program.program_name}`}</p>

                        {/* Edit/Remove buttons (appear on hover) */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded bg-[#f4f4f4]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {/* View Button - only sets state, no Dialog here */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                onClick={() => {resolveFormDialog({ type: 'view', form: card });}}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                onClick={() => {resolveFormDialog({ type: 'upload', form: card});}}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                onClick={() => {resolveFormDialog({ type: 'delete', form: card });}}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
                {/* Add Card Form */}
                {forms.length < 3 ? (
                    <div className={`grid w-full place-items-center gap-1 rounded border p-2`}>
                        <Button
                            variant="ghost"
                            className="flex h-full w-full flex-col items-center gap-1 p-4 hover:bg-[#f4f4f4]/40 transition duration-300"
                            onClick={() => resolveFormDialog({ type: 'add'})}
                        >
                            <div className="rounded-full border-2 border-dashed border-[#B4B4B4] p-3">
                                <Plus className="h-6 w-6 text-[#B4B4B4]" />
                            </div>
                            <p className="text-sm text-[#B4B4B4]">Add Form</p>
                        </Button>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}
