"use client"

import { DeleteAreaForm } from "./delete-area-form"
import { UploadAreaForm } from "./upload-area-form"
import { AddAreaForm } from "./add-area-form"
import { DocumentViewer } from "@/components/dialogs/documents/view-document"
import { RejectedAreaForm } from "./rejected-area-form"
import { Area, AreaFormCategory, AreaForms, Program } from "@/types"

interface AreaFormDialogProps {
    type: "view" | "upload" | "add" | "delete" | "rejected";
    forms?: AreaForms[];
    form?: AreaForms;
    categories?: AreaFormCategory[];
    program: Program;
    area: Area;
    onClose: () => void;
}

export function RenderAreaFormDialog({ type, forms, form, categories, program, area, onClose }: AreaFormDialogProps) {
    if(!area) return null;

    switch(type) {
        case 'view':
            return (
                <DocumentViewer
                    open={true}
                    onOpenChange={onClose}
                    fileUrl={form.file_path}
                    title={form.file_name}
                />
            );
        case 'add':
            console.log('Rendering AddAreaForm with props:');
            console.log({forms, program, area, categories});
            return (
                <AddAreaForm
                    forms={forms}
                    program={program}
                    area_id={area?.area_id}
                    categories={categories}
                    onClose={onClose}
                />
            );
        case 'upload':
            return (
                <UploadAreaForm
                    program={program}
                    form={form}
                    area_id={area?.area_id}
                    onClose={onClose}
                />
            );
        case 'delete':
            return (
                <DeleteAreaForm
                    form={form}
                    program={program}
                    area_id={area?.area_id}
                    onClose={onClose}
                />
            );
        case 'rejected':
            return (
                <RejectedAreaForm
                    form={form}
                    onClose={onClose}
                />
            );
        case null:
            break;
        default:
            return null;
    }
};

