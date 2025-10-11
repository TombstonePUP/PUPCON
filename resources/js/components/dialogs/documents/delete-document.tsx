"use client"
import { TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useForm } from "@inertiajs/react"
import { ParameterOutlines } from "@/types"
import { toast } from "sonner"

interface DeleteDocumentProps {
    outline: ParameterOutlines
    program: string;
    area_id: number;
    onClose: () => void;
}

export function DeleteDocument({ outline, program, area_id, onClose }: DeleteDocumentProps) {
    const {
        data,
        delete: destroy,
        reset,
    } = useForm<{ outline_id: number }>({
        outline_id: outline.parameter_outline_id,
    });

    const deleteDocument = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route("manage.area.delete.file", {program_name: program, area_id: area_id, outline_id: outline.parameter_outline_id}), {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: () => {
                toast.error("Failed to delete document", {
                    description: "Please try again.",
                    id: "delete-document-error",
                });
            }
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <TrashIcon className="h-5 w-5 text-[#7f1414]" />
                        Delete Document
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this document?
                    </DialogDescription>
                </DialogHeader>
                <Label className="text-sm text-muted-foreground">
                    This action will permanently delete the document. This action cannot be undone.
                </Label>
                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            tabIndex={1}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="noborder"
                        tabIndex={2}
                        onClick={deleteDocument}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
