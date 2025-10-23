"use client"

import { DeleteDocument } from "./delete-document"
import { UploadDocument } from "./upload-document"
import { DocumentViewer } from "./view-document"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Area, ParameterOutlines } from "@/types"

interface DocumentDialogProps {
    type: "view" | "upload" | "delete"
    benchmark?: ParameterOutlines;
    program: string
    area: Area;
    onClose: () => void;
}

export function RenderDocumentDialog({ type, benchmark, program, area, onClose }: DocumentDialogProps) {
    if(!benchmark) return null;

    switch(type) {
        case 'view':
            return (
                benchmark.area_files?.file_path ? (
                    <DocumentViewer
                        open={true}
                        onOpenChange={onClose}
                        fileUrl={benchmark.area_files.file_path}
                        title={benchmark.area_files.file_name}
                    />
                ) : (
                    <Dialog open={true} onOpenChange={onClose}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">No Document Available</DialogTitle>
                                <DialogDescription>
                                    {`${benchmark.initial}.${benchmark.outline_number}. ${benchmark.outline_description}`}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-10 text-center">
                                <p className="text-muted-foreground">This benchmark has no document uploaded.</p>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="noborder" onClick={onClose}>
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            );
        case 'upload':
            return (
                <UploadDocument
                    outline={benchmark}
                    program={program}
                    area_id={area?.area_id}
                    onClose={onClose}
                />
            );
        case 'delete':
            return (
                <DeleteDocument
                    outline={benchmark}
                    program={program}
                    area_id={area?.area_id}
                    onClose={onClose}
                />
            );
        case null:
            break;
        default:
            return null;
    }
};
