import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Exhibits } from "@/types/exhibits";
import { useForm } from "@inertiajs/react";


interface DeleteExhibitProps {
    exhibit: Exhibits | null | undefined;
    onClose: () => void;
}

export default function DeleteExhibit({ exhibit, onClose }: DeleteExhibitProps) {
    const {delete: destroy, processing } = useForm<{
        exhibit_id: number | null | undefined;
    }>({
        exhibit_id: exhibit?.exhibit_id
    });

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route("exhibits.delete", { exhibit_id: exhibit?.exhibit_id }), {
            onSuccess: () => {
                onClose();
            }
        });
    };
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">
                        Delete Exhibit
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Are you sure you want to delete the exhibit "{exhibit?.exhibit_name}"?
                        The Files associated with this exhibit will be deleted permanently.
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

