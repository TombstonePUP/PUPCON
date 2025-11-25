import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Exhibits } from "@/types/exhibits";


interface DeleteExhibitProps {
    exhibit: Exhibits | null | undefined;
    onClose: () => void;
}

export default function DeleteExhibit({ exhibit, onClose }: DeleteExhibitProps) {

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">
                        Delete Exhibit
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Are you sure you want to delete the exhibit "{exhibit?.exhibit_name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="noborder" onClick={onClose}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

