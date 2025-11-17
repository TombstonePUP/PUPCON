'use client';

import { Button } from '@/components/ui/button';
import { AreaFormCategory, AreaForms, Program } from '@/types';
import { DownloadIcon, Edit, Eye, FileUp, FileX, Info, Plus, Trash2 } from 'lucide-react';

interface AreaFormDialogParams {
    type: 'view' | 'upload' | 'add' | 'delete-form' | 'delete' | 'rejected';
    form?: AreaForms;
    forms?: AreaForms[];
}

type AreaCardsProps = {
    program: Program;
    area_id: number;
    forms: AreaForms[];
    resolveFormDialog: (params: AreaFormDialogParams) => void;
};

export default function AreaCards({program, area_id, forms, resolveFormDialog }: AreaCardsProps) {
    const download = (form: AreaForms) => {
        const url = route('manage.area.download.area.form.file', {
            program_name: program.program_link,
            level_id: program.levels[0]?.accreditation_level_id,
            area_id: area_id,
            form_id: form.area_form_id,
        });
        const link = document.createElement('a');
        link.href = url
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
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
                            {card.file_name && (
                                <>
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
                                        onClick={() => {download(card);}}
                                    >
                                        <DownloadIcon className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                onClick={() => {resolveFormDialog({ type: 'upload', form: card});}}
                            >
                                {card.file_name ? (
                                    <Edit className="h-4 w-4" />
                                ) : (
                                    <FileUp className="h-4 w-4" />
                                )}
                            </Button>
                            {card.file_name && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                    onClick={() => {resolveFormDialog({ type: 'delete', form: card });}}
                                >
                                    <FileX className="h-4 w-4 text-red-500" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                onClick={() => {resolveFormDialog({ type: 'delete-form', form: card });}}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            {card.file_status?.status_name === 'Rejected' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                    onClick={() => {resolveFormDialog({ type: 'rejected', form: card });}}
                                >
                                    <Info className="h-4 w-4 text-red-500" />
                                </Button>
                            )}
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
