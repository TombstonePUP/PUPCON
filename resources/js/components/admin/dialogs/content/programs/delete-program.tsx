import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PerProgramUnderSurvey } from '@/types';
import { useForm } from '@inertiajs/react';

interface DeleteProgramProps {
    program: PerProgramUnderSurvey;
    onClose: () => void;
}

interface DeleteProgramFormData {
    confirmation_text: string;
    program_id: number;
}

export default function DeleteProgram({ program, onClose }: DeleteProgramProps) {
    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm<DeleteProgramFormData>({
        confirmation_text: '',
        program_id: program.program_id,
    });

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('manage.program.delete', { program_id: program.program_id }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleDelete} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle className="text-foreground text-lg font-medium">Archive Program</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            This action will permanently archive the selected program. This action cannot be undone.
                        </DialogDescription>

                        <div className="border-warning-border bg-warning my-4 rounded-md border p-4">
                            <p className="text-warning-foreground text-sm">
                                <span className="text-warning-foreground mb-1 block font-semibold">Note: Important Action!</span>
                                The program will be hidden from active listings, all data will be preserved, and accreditation history will remain
                                intact.
                            </p>
                        </div>
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">
                                Type the program name to confirm <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                className="w-full rounded border px-2 py-1 text-sm"
                                value={data.confirmation_text}
                                onChange={(e) => setData('confirmation_text', e.target.value)}
                                placeholder={`Type "${program.program_name}"`}
                            />
                            <InputError message={errors.confirmation_text} className="mt-2" />
                        </div>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose} disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" disabled={processing}>
                            Archive
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
