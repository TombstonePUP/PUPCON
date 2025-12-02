'use state';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/text-area';
import { AreaParameters, ParameterOutlineCategory, Program } from '@/types';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

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

export function AddBenchmark({ parameter, program, area_id, parameter_outline_categories, onClose }: BenchmarkProps) {
    const { data, setData, post, processing, errors, reset } = useForm<AddBenchmarkForm>({
        area_parameter_id: parameter.area_parameter_id,
        benchmark_number: '',
        benchmark_description: '',
        benchmark_category: null,
        is_container: false,
    });

    const addBenchmark = (e: React.FormEvent) => {
        e.preventDefault();
        post(
            route('manage.area.add.benchmark', {
                program_id: program.program_id,
                level_id: program.levels[0]?.accreditation_level_id,
                area_id: area_id,
            }),
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                onError: () => {
                    toast.error('Failed to add benchmark', {
                        description: 'Please try again.',
                        id: 'add-benchmark-error',
                    });
                },
            },
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">Add Benchmark</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Create A New Benchmark for {parameter.parameter_description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <form className="flex flex-col gap-6" onSubmit={addBenchmark}>
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Benchmark Number</Label>
                            <Input
                                id="benchmark_number"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                value={data.benchmark_number}
                                onChange={(e) => setData('benchmark_number', e.target.value)}
                                disabled={processing}
                                placeholder="e.g., 1.1, 2.3, etc."
                            />
                            <InputError message={errors.benchmark_number} className="mt-2" />
                        </div>
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Benchmark Description</Label>
                            <Textarea
                                id="benchmark_description"
                                value={data.benchmark_description}
                                onChange={(e) => setData('benchmark_description', e.target.value)}
                                disabled={processing}
                                placeholder="Enter benchmark description"
                                autoResize
                                minHeight={100}
                            />
                            <InputError message={errors.benchmark_description} className="mt-2" />
                        </div>
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Benchmark Category</Label>
                            <Select
                                value={data.benchmark_category ? String(data.benchmark_category) : ''}
                                onValueChange={(value) => setData('benchmark_category', value)}
                                disabled={processing}
                            >
                                <SelectTrigger className="w-full" tabIndex={3}>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/* <SelectLabel>Categories</SelectLabel> */}
                                        {parameter_outline_categories?.map((category) => (
                                            <SelectItem
                                                key={category.parameter_outline_category_id}
                                                // Radix UI requires values to be strings
                                                value={String(category.parameter_outline_category_id)}
                                            >
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.benchmark_category} className="mt-2" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                id="is-container-mode"
                                checked={data.is_container}
                                onCheckedChange={(checked) => setData('is_container', checked)}
                            />
                            <Label
                                htmlFor="is-container-mode"
                                className="block text-sm leading-none font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Benchmark Container
                            </Label>
                        </div>

                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button tabIndex={1} variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button tabIndex={2} variant="noborder" type="submit">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
