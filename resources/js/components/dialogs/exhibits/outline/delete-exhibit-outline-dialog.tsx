import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExhibitOutlines } from '@/types/exhibits';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface DeleteExhibitOutlineDialogProps {
  outline: ExhibitOutlines;
  onClose: () => void;
  onDelete?: (deletedOutlineId: number) => void;
}

export default function DeleteExhibitOutlineDialog({ outline, onClose, onDelete }: DeleteExhibitOutlineDialogProps) {
  const {
    data,
    delete: destroy,
    processing,
    errors,
    reset,
  } = useForm<{ outline_id: number }>({
    outline_id: outline.exhibit_outline_id,
  });

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    destroy(route('exhibit.outline.file.delete', { outline_id: data.outline_id }), {
      onSuccess: () => {
        // Notify parent so list/table updates immediately
        if (onDelete) {
          onDelete(data.outline_id);
        }
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Exhibit Content</DialogTitle>
          <DialogDescription className="mt-4 mb-6 text-sm text-muted-foreground">
            Are you sure you want to delete the content of "{outline.outline_description}"? This action will aslo remove the associated file
            from the system and cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={processing} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={processing} variant="noborder" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
