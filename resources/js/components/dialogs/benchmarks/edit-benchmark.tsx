"use state"

import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ParameterOutlines } from "@/types"
import { EditIcon } from "lucide-react";


interface BenchmarkProps {
    outline: ParameterOutlines;
    program: string;
    area_id: number;
    onClose: () => void;
}

interface EditBenchmarkForm {
    benchmark_number: string;
    benchmark_description: string;
    benchmark_category: string;
    is_container: boolean;
}

export function EditBenchmark({ outline, program, area_id, onClose }: BenchmarkProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <EditIcon className="h-5 w-5 text-[#7f1414]" />
                        Edit Benchmark
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <form /* onSubmit={} */>
                        <div>
                            <label className="text-muted-foreground mb-1 text-sm block font-medium">
                                Benchmark Number
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border
                                    border-input bg-background px-3
                                    py-2 placeholder:text-muted-foreground
                                    focus:outline-none focus:ring-2
                                    focus:ring-ring focus:ring-offset-2
                                    disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <InputError message={""} className="mt-2" />
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1 text-sm block font-medium">
                                Benchmark Description
                            </label>
                            <textarea
                                className="w-full rounded-md border
                                    border-input bg-background px-3
                                    py-2 placeholder:text-muted-foreground
                                    focus:outline-none focus:ring-2
                                    focus:ring-ring focus:ring-offset-2
                                    disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <InputError message={""} className="mt-2" />
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1 text-sm block font-medium">
                                Benchmark Category
                            </label>
                            <select>
                                <option>Testing 1</option>
                                <option>Testing 2</option>
                                <option>Testing 3</option>
                            </select>
                            <InputError message={""} className="mt-2" />
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1 text-sm block font-medium">
                                <input type="checkbox" className="mr-2" />
                                Benchmark Container
                            </label>
                        </div>
                        <DialogFooter className="mt-4">"
                            <DialogClose asChild>
                                <Button
                                    tabIndex={1}
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                tabIndex={2}
                                variant="noborder"
                                type="submit"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
