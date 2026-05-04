'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ParameterOutlines } from '@/types';
import { InfoIcon } from 'lucide-react';

interface RejectedDocumentProps {
    outline: ParameterOutlines;
    onClose: () => void;
}

export function RejectedDocument({ outline, onClose }: RejectedDocumentProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <InfoIcon className="h-5 w-5 text-[#7f1414]" />
                        Document Rejected
                    </DialogTitle>
                    <DialogDescription>Comments for rejected document</DialogDescription>
                </DialogHeader>
                <Label className="text-muted-foreground text-sm">{outline.area_files?.file_rejection_reason}</Label>
                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline" tabIndex={1}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
