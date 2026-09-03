'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AreaForms, Program } from '@/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteAreaFormProps {
    form: AreaForms;
    program: Program;
    area_id: number;
    onClose: () => void;
}

export function DeleteAreaForm({ form, program, area_id, onClose }: DeleteAreaFormProps) {
    const deleteAreaForm = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(
            route('manage.area.delete.area.form', {
                program_id: program.program_id,
                level_id: program.levels[0]?.accreditation_level_id,
                area_id: area_id,
                form_id: form.area_form_id,
            }),
            {
                onSuccess: () => {
                    onClose();
                },
                onError: () => {
                    toast.error('Failed to delete document', {
                        description: 'Please try again.',
                        id: 'delete-document-error',
                    });
                },
            },
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="flex flex-row items-start text-left">
                    <div className="">
                        <DialogTitle className="text-foreground text-lg font-medium">Delete Card</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">Are you sure you want to delete this card?</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="border-destructive/20 bg-destructive/10 my-0 rounded-md border p-4">
                    <p className="text-destructive text-sm">
                        <span className="text-destructive mb-1 block font-semibold">Warning: Irreversible Action!</span>
                        This action will permanently delete the card with its coressponding document. This action cannot be undone.
                    </p>
                </div>

                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline" tabIndex={1}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button className="w-[25%]" variant="noborder" tabIndex={2} onClick={deleteAreaForm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
