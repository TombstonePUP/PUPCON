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
import { router } from "@inertiajs/react"
import { ParameterOutlines } from "@/types"
import { toast } from "sonner"

interface DeleteBenchmarkProps {
    outline: ParameterOutlines;
    program: string;
    area_id: number;
    onClose: () => void;
}

export function DeleteBenchmark({ outline, program, area_id, onClose }: DeleteBenchmarkProps) {
    const deleteBenchmark = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(route("manage.area.delete.benchmark", {program_name: program, area_id: area_id, outline_id: outline.parameter_outline_id}), {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                toast.error("Failed to delete benchmark", {
                    description: "Please try again.",
                    id: "delete-benchmark-error",
                });
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <TrashIcon className="h-5 w-5 text-[#7f1414]" />
                        Delete Benchmark
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this benchmark?
                    </DialogDescription>
                </DialogHeader>
                <Label className="text-sm text-muted-foreground">
                    This action will permanently delete the benchmark and associated document (if any). This action cannot be undone.
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
                        onClick={deleteBenchmark}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

