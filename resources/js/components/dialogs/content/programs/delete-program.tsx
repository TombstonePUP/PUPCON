import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PerProgramUnderSurvey } from '@/types';
import { useForm } from '@inertiajs/react';
import { Archive } from 'lucide-react';

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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <Archive className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-gray-900">Archive Program</DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-sm leading-relaxed text-gray-600">
                        Are you sure you want to archive <span className="font-semibold text-gray-900">"{program.program_name}"</span>?
                        <div className="mt-3 rounded-lg bg-red-50 p-3 text-red-800">
                            <p className="text-xs font-medium">⚠️ What happens when you archive:</p>
                            <ul className="mt-2 space-y-1 text-xs">
                                <li>• The program will be hidden from active listings</li>
                                <li>• All data will be preserved and can be restored</li>
                                <li>• Accreditation history remains intact</li>
                            </ul>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                        {processing ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Archiving...
                            </>
                        ) : (
                            <>
                                <Archive className="mr-2 h-4 w-4" />
                                Archive Program
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
