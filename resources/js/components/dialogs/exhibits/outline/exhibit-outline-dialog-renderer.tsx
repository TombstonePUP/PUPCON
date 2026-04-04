import { ExhibitOutlines, Exhibits } from "@/types/exhibits";
import DeleteExhibitOutlineDialog from "./delete-exhibit-outline-dialog";
import ExhibitOutlineDialog from "./exhibit-outline-dialog";
import { DocumentViewer } from "../../documents/view-document";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExhibitOutlineDialogRendererProps {
  type: 'add' | 'edit' | 'delete' | 'view' | null;
  outline?: ExhibitOutlines | null;
  exhibit?: Exhibits | null;
  onClose: () => void;
  onAdd?: (newOutline: ExhibitOutlines) => void;
  onEdit?: (updatedOutline: ExhibitOutlines) => void;
  onDelete?: (deletedOutlineId: number) => void;
}

export default function ExhibitOutlineDialogRenderer({ type, outline, exhibit, onClose, onAdd, onEdit, onDelete }: ExhibitOutlineDialogRendererProps) {
  switch (type) {
    case 'view':
      return outline.exhibit_files?.file_path ? (
        <DocumentViewer
          open={true}
          onOpenChange={onClose}
          fileUrl={outline?.exhibit_files?.file_path}
          title={outline?.outline_description}
        />
      ) : (
        <Dialog open={true} onOpenChange={onClose}>
          <DialogContent className="">
            <DialogHeader className="flex flex-row items-start text-left">
              <div className="">
                <DialogTitle className="text-lg font-medium text-foreground">No Document Available</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {outline?.outline_description}
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="my-0 rounded-md border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="mb-1 block font-semibold text-foreground">
                  Outline has no associated document
                </span>
                Please upload a document to this exhibit outline and try viewing again.
              </p>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    case 'add':
      return (
        <ExhibitOutlineDialog
          outline={outline || null}
          exhibit={exhibit || null}
          type={type}
          onClose={onClose}
          onUpdate={onAdd}
        />
      );
    case 'edit':
      return (
        <ExhibitOutlineDialog
          outline={outline}
          exhibit={exhibit}
          type={type}
          onClose={onClose}
          onUpdate={onEdit}
        />
      );
    case 'delete':
      return (
        <DeleteExhibitOutlineDialog
          outline={outline}
          onClose={onClose}
          onDelete={onDelete}
        />
      );
    default:
      return null;
  }
}
