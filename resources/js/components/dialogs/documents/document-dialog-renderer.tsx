'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Area, ParameterOutlines, Program } from '@/types';
import { DeleteDocument } from './delete-document';
import { RejectedDocument } from './rejected-document';
import { UploadDocument } from './upload-document';
import { DocumentViewer } from './view-document';

interface DocumentDialogProps {
    type: 'view' | 'upload' | 'delete' | 'rejected';
    benchmark?: ParameterOutlines;
    program: Program;
    area: Area;
    onClose: () => void;
}

export function RenderDocumentDialog({ type, benchmark, program, area, onClose }: DocumentDialogProps) {
    if (!benchmark) return null;

    switch (type) {
        case 'view':
            return benchmark.area_files?.file_path ? (
                <DocumentViewer open={true} onOpenChange={onClose} fileUrl={benchmark.area_files.file_path} title={benchmark.area_files.file_name} />
            ) : (
                <Dialog open={true} onOpenChange={onClose}>
                    <DialogContent className="">
                        <DialogHeader className="flex flex-row items-start text-left">
                            <div className="">
                                <DialogTitle className="text-lg font-medium text-gray-900">No Document Available</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500">
                                    {`${benchmark.initial}.${benchmark.outline_number}. ${benchmark.outline_description}`}
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <div className="my-0 rounded-md border border-red-100 bg-gray-50 p-4">
                            <p className="text-muted-foreground text-sm">
                                <span className="text-muted-foreground mb-1 block font-semibold">Benchmark has no associated document</span>
                                Please upload a document to this benchmark and try viewing again.
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
        case 'upload':
            return <UploadDocument outline={benchmark} program={program} area_id={area?.area_id} onClose={onClose} />;
        case 'delete':
            return <DeleteDocument outline={benchmark} program={program} area_id={area?.area_id} onClose={onClose} />;
        case 'rejected':
            return <RejectedDocument outline={benchmark} onClose={onClose} />;
        case null:
            break;
        default:
            return null;
    }
}
