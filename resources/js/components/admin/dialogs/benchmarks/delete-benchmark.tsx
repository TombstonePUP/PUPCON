'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ParameterOutlines, Program } from '@/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteBenchmarkProps {
    outline: ParameterOutlines;
    program: Program;
    area_id: number;
    onClose: () => void;
}

export function DeleteBenchmark({ outline, program, area_id, onClose }: DeleteBenchmarkProps) {
    const deleteBenchmark = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(
            route('manage.area.delete.benchmark', {
                program_id: program.program_id,
                level_id: program.levels[0]?.accreditation_level_id,
                area_id: area_id,
                outline_id: outline.parameter_outline_id,
            }),
            {
                onSuccess: () => {
                    onClose();
                },
                onError: () => {
                    toast.error('Failed to delete benchmark', {
                        description: 'Please try again.',
                        id: 'delete-benchmark-error',
                    });
                },
            },
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="flex flex-row items-start text-left">
                    <div className="">
                        <DialogTitle className="text-foreground text-lg font-medium">Delete Benchmark</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this benchmark?</DialogDescription>
                    </div>
                </DialogHeader>

                <div className="border-destructive/20 bg-destructive/10 my-0 rounded-md border p-4">
                    <p className="text-destructive text-sm">
                        <span className="text-destructive mb-1 block font-semibold">Warning: Irreversible Action!</span>
                        This action will permanently delete the benchmark and associated document (if any). This action cannot be undone.
                    </p>
                </div>
                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline" tabIndex={1}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button className="w-[25%]" variant="noborder" tabIndex={2} onClick={deleteBenchmark}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
