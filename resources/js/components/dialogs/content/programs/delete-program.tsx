import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PerProgramUnderSurvey } from '@/types';
import { useForm } from '@inertiajs/react';

interface DeleteProgramProps {
    program: PerProgramUnderSurvey;
    onClose: () => void;
}

export default function DeleteProgram({ program, onClose }: DeleteProgramProps) {
    const { processing, delete: destroy } = useForm();
    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('manage.program.delete', { program_id: program.program_id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Program</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the program "{program.program_name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="noborder" onClick={handleDelete} disabled={processing}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
