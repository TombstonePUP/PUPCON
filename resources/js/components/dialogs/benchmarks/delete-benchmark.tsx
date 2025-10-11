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
import { useForm } from "@inertiajs/react"
import { ParameterOutlines } from "@/types"

interface DeleteBenchmarkProps {
    outline: ParameterOutlines
    onClose: () => void;
}

export function DeleteBenchmark({ outline, onClose }: DeleteBenchmarkProps) {
    const {
        data,
        patch,
        reset,
    } = useForm<{ outline_id: number }>({
        outline_id: outline.parameter_outline_id,
    });

    const deleteBenchmark = (e: React.FormEvent) => {
        e.preventDefault();
        /* patch(route("users.disable"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        }); */
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

