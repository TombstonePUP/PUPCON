import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FilesOverview } from '@/types';
import { useForm } from '@inertiajs/react';

interface FileForm {
    file_id: number;
    file_type: string;
}

interface DocumentRequestForm {
    file: FileForm[];
}

interface ApproveRequestProps {
    file: FilesOverview[];
    onClose: () => void;
}

export default function ApproveRequest({ file, onClose }: ApproveRequestProps) {
    const { post, reset } = useForm<DocumentRequestForm>({
        file: file.map((f) => ({
            file_id: f.file_id,
            file_type: f.file_type,
        })),
    });

    const approveDocument = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
        post(route('approveDocument'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">Approve Document</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Confirm approval of {file.length === 1 ? 'this document' : `${file.length} documents`}
                    </DialogDescription>
                </DialogHeader>
                <div className="my-0 rounded-md border border-green-100 bg-green-50 p-4">
                    <p className="text-sm text-green-800">
                        <span className="mb-1 block font-semibold text-green-900">Confirm Approval</span>
                        This action will mark {file.length === 1 ? 'this document' : 'these documents'} as approved.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button tabIndex={3} variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button tabIndex={4} onClick={approveDocument}>
                        Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
