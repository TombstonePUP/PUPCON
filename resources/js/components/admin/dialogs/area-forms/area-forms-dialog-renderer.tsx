'use client';

import { DocumentViewer } from '@/components/admin/dialogs/documents/view-document';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Area, AreaFormCategory, AreaForms, Program } from '@/types';
import { AddAreaForm } from './add-area-form';
import { DeleteAreaForm } from './delete-area-form';
import { DeleteAreaFormFile } from './delete-area-form-file';
import { RejectedAreaForm } from './rejected-area-form';
import { UploadAreaForm } from './upload-area-form';

interface AreaFormDialogProps {
    type: 'view' | 'upload' | 'add' | 'delete' | 'delete-form' | 'rejected';
    forms?: AreaForms[];
    form?: AreaForms;
    categories?: AreaFormCategory[];
    program: Program;
    area: Area;
    onClose: () => void;
}

export function RenderAreaFormDialog({ type, forms, form, categories, program, area, onClose }: AreaFormDialogProps) {
    if (!area) return null;

    switch (type) {
        case 'view':
            return form?.file_path ? (
                <DocumentViewer open={true} onOpenChange={onClose} fileUrl={form?.file_path} title={form?.file_name} />
            ) : (
                <Dialog open={true} onOpenChange={onClose}>
                    <DialogContent>
                        <DialogHeader className="flex flex-row items-start text-left">
                            <div>
                                <DialogTitle className="text-foreground text-lg font-medium">No Document Available</DialogTitle>
                                <DialogDescription className="text-muted-foreground text-sm">
                                    {form?.area_form_category?.category_name}
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <div className="my-0 rounded-md border border-red-100 bg-gray-50 p-4">
                            <p className="text-muted-foreground text-sm">
                                <span className="text-muted-foreground mb-1 block font-semibold">Benchmark has no associated document</span>
                                Please upload a document to this benchmark and try viewing again.
                            </p>
                        </div>

                        <DialogFooter className="sm:justify-end">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={onClose}>
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        case 'add':
            return <AddAreaForm forms={forms} program={program} area_id={area?.area_id} categories={categories} onClose={onClose} />;
        case 'upload':
            return <UploadAreaForm program={program} form={form} area_id={area?.area_id} onClose={onClose} />;
        case 'delete-form':
            return <DeleteAreaForm form={form} program={program} area_id={area?.area_id} onClose={onClose} />;
        case 'delete':
            return <DeleteAreaFormFile form={form} program={program} area_id={area?.area_id} onClose={onClose} />;
        case 'rejected':
            return <RejectedAreaForm form={form} onClose={onClose} />;
        case null:
            break;
        default:
            return null;
    }
}
