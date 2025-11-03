'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AreaForms, Program } from '@/types';
import { router } from '@inertiajs/react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteAreaFormProps {
    form: AreaForms
    program: Program;
    area_id: number;
    onClose: () => void;
}

export function DeleteAreaForm({ form, program, area_id, onClose }: DeleteAreaFormProps) {
    const deleteAreaForm = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(route('manage.area.delete.area.form', {
            program_name: program.program_link,
            level_id: program.levels[0]?.accreditation_level_id,
            area_id: area_id,
            form_id: form.area_form_id }), {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                toast.error('Failed to delete document', {
                    description: 'Please try again.',
                    id: 'delete-document-error',
                });
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TrashIcon className="h-5 w-5 text-[#7f1414]" />
                        Delete Document
                    </DialogTitle>
                    <DialogDescription>Are you sure you want to delete this document?</DialogDescription>
                </DialogHeader>
                <Label className="text-muted-foreground text-sm">
                    This action will permanently delete the document. This action cannot be undone.
                </Label>
                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline" tabIndex={1}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="noborder" tabIndex={2} onClick={deleteAreaForm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
