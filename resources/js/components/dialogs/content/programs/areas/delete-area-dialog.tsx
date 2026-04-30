'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AccreditationLevels, Program, ProgramAreas } from '@/types';
import { router } from '@inertiajs/react';

interface DeleteAreaDialogProps {
    area: ProgramAreas;
    program: Program;
    level: AccreditationLevels;
    onClose: () => void;
}

export default function DeleteAreaDialog({ area, program, level, onClose }: DeleteAreaDialogProps) {
    const deleteArea = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(
            route('manage.area.delete', {
                program_id: program.program_id,
                level_id: level.accreditation_level_id,
                area_id: area.area_id,
            }),
            {
                onSuccess: () => {
                    onClose();
                },
            },
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">Archive Area</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        This action will permanently archive the selected area. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="border-warning-border bg-warning my-4 rounded-md border p-4">
                    <p className="text-warning-foreground text-sm">
                        <span className="text-warning-foreground mb-1 block font-semibold">Note: Important Action!</span>
                        The area will be hidden from active listings, all data will be preserved, and accreditation history will remain intact.
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <form onSubmit={deleteArea}>
                        <Button variant="noborder" type="submit">
                            Archive
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
