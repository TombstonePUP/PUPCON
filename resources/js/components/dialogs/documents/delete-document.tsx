'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ParameterOutlines, Program } from '@/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteDocumentProps {
    outline: ParameterOutlines;
    program: Program;
    area_id: number;
    onClose: () => void;
}

export function DeleteDocument({ outline, program, area_id, onClose }: DeleteDocumentProps) {
    const deleteDocument = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(
            route('manage.area.delete.file', {
                program_id: program.program_id,
                level_id: program.levels[0]?.accreditation_level_id,
                area_id: area_id,
                outline_id: outline.parameter_outline_id,
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
                        {' '}
                        <DialogTitle className="text-lg font-medium text-foreground">Delete Document</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">Are you sure you want to delete this document?</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="my-0 rounded-md border border-red-100 bg-red-50 p-4">
                    <p className="text-sm text-red-800">
                        <span className="mb-1 block font-semibold text-red-900">Warning: Irreversible Action!</span>
                        This action will permanently delete the benchmark and associated document (if any). This action cannot be undone.
                    </p>
                </div>
                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline" tabIndex={1}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="noborder" tabIndex={2} onClick={deleteDocument}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
