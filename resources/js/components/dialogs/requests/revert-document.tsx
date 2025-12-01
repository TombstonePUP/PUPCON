import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilesOverview } from "@/types";
import { useForm } from "@inertiajs/react";

interface DocumentRequestForm {
    file_id: number;
    file_type: string;
}

interface RevertRequestProps {
    file: FilesOverview;
    onClose: () => void;
}

export default function RevertRequest({ file, onClose }: RevertRequestProps) {
    const {
        data,
        post,
        reset,
    } = useForm<DocumentRequestForm>({
        file_id: file.file_id,
        file_type: file.file_type,
    });

    const revertDocument = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
        post(route('revertDocument', [data.file_id]), {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">Reset Status</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">Reset document status to pending</DialogDescription>
                </DialogHeader>
                <div className="my-0 rounded-md border border-yellow-100 bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                        <span className="mb-1 block font-semibold text-yellow-900">Note: Important Action!</span>
                        This action will reset the status of this Document back to pending status.
                    </p>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button tabIndex={3} variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button tabIndex={4} onClick={revertDocument}>
                        Revert
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
