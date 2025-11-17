"use state"

import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AreaParameters, ParameterOutlineCategory, ParameterOutlines, Program } from "@/types"
import { useForm } from "@inertiajs/react";
import { EditIcon } from "lucide-react";
import { toast } from "sonner";


interface BenchmarkProps {
    parameter: AreaParameters;
    program: Program;
    area_id: number;
    parameter_outline_categories?: ParameterOutlineCategory[];
    onClose: () => void;
}

interface AddBenchmarkForm {
    area_parameter_id: number;
    benchmark_number: string;
    benchmark_description: string;
    benchmark_category: number;
    is_container: boolean;
}

export function AddBenchmark({parameter, program, area_id, parameter_outline_categories, onClose }: BenchmarkProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<AddBenchmarkForm>({
        area_parameter_id: parameter.area_parameter_id,
        benchmark_number: "",
        benchmark_description: "",
        benchmark_category: null,
        is_container: false,
    });

    const addBenchmark = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("manage.area.add.benchmark", {
            program_name: program.program_link,
            level_id: program.levels[0]?.accreditation_level_id,
            area_id: area_id
        }), {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: () => {
                toast.error("Failed to add benchmark", {
                    description: "Please try again.",
                    id: "add-benchmark-error",
                });
            }
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <EditIcon className="h-5 w-5 text-[#7f1414]" />
                        Add Benchmark
                    </DialogTitle>
                    <DialogDescription>
                        Create A New Benchmark for {parameter.parameter_description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <form className="flex flex-col gap-3" onSubmit={addBenchmark}>
                        <div>
                            <label className="text-muted-foreground mb-1 text-sm block font-medium">
                                Benchmark Number
                            </label>
                            <input
                                id="benchmark_number"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                value={data.benchmark_number}
                                onChange={(e) => setData("benchmark_number", e.target.value)}
                                disabled={processing}
                                placeholder="e.g., 1.1, 2.3, etc."
                                className="w-full rounded-md border
                                    border-input bg-background px-3
                                    py-2 placeholder:text-muted-foreground
                                    focus:outline-none focus:ring-2
                                    focus:ring-ring focus:ring-offset-2
                                    disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <InputError message={errors.benchmark_number} className="mt-2" />
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1 text-sm block font-medium">
                                Benchmark Description
                            </label>
                            <textarea
                                id="benchmark_description"
                                rows={4}
                                tabIndex={2}
                                value={data.benchmark_description}
                                onChange={(e) => setData("benchmark_description", e.target.value)}
                                disabled={processing}
                                placeholder="Enter benchmark description"
                                className="w-full rounded-md border
                                    border-input bg-background px-3
                                    py-2 placeholder:text-muted-foreground
                                    focus:outline-none focus:ring-2
                                    focus:ring-ring focus:ring-offset-2
                                    disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <InputError message={errors.benchmark_description} className="mt-2" />
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1 text-sm block font-medium">
                                Benchmark Category
                            </label>
                            <select
                                id="benchmark_category"
                                tabIndex={3}
                                autoFocus
                                value={data.benchmark_category}
                                onChange={(e) => setData("benchmark_category", e.target.value)}
                                disabled={processing}
                                className="bg-background focus:border-ring focus:ring-ring w-full
                                    rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                            >
                                <option value="" disabled selected>Select a category</option>
                                {parameter_outline_categories?.map((category) => (
                                    <option key={category.parameter_outline_category_id} value={category.parameter_outline_category_id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.benchmark_category} className="mt-2" />
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1 text-sm block font-medium">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={data.is_container}
                                    onChange={(e) => setData("is_container", e.target.checked)}
                                />
                                Benchmark Container
                            </label>
                        </div>
                        <DialogFooter className="mt-4">
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
