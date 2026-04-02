'use state';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/text-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { useForm } from '@inertiajs/react';
import { HelpCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

interface BenchmarkProps {
    outline: ParameterOutlines;
    program: Program;
    area_id: number;
    parameter_outline_categories?: ParameterOutlineCategory[];
    onClose: () => void;
}

interface EditBenchmarkForm {
    benchmark_number: string;
    benchmark_description: string;
    benchmark_category: number;
    is_container: boolean;
}

export function EditBenchmark({ outline, program, area_id, parameter_outline_categories, onClose }: BenchmarkProps) {
    const { data, setData, patch, processing, errors, reset } = useForm<EditBenchmarkForm>({
        benchmark_number: outline.outline_number || '',
        benchmark_description: outline.outline_description || '',
        benchmark_category: outline.parameter_outline_category_id || 0,
        is_container: outline.is_container || false,
    });

    const editBenchmark = (e: React.FormEvent) => {
        e.preventDefault();
        patch(
            route('manage.area.edit.benchmark', {
                program_id: program.program_id,
                level_id: program.levels[0]?.accreditation_level_id,
                area_id: area_id,
                outline_id: outline.parameter_outline_id,
            }),
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                onError: () => {
                    toast.error('Failed to edit benchmark', {
                        description: 'Please try again.',
                        id: 'edit-benchmark-error',
                    });
                },
            },
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-foreground">Edit Benchmark</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <form className="flex flex-col gap-6" onSubmit={editBenchmark}>
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Benchmark Number <span className="text-red-500">*</span></Label>
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
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Benchmark Description <span className="text-red-500">*</span></Label>
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
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Benchmark Category <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.benchmark_category ? String(data.benchmark_category) : ''}
                                onValueChange={(value) => setData('benchmark_category', Number(value))}
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
                        <div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="is-container-mode"
                                    checked={data.is_container}
                                    onCheckedChange={(checked) => setData('is_container', checked)}
                                />
                                <Label
                                    htmlFor="is-container-mode"
                                    className="flex gap-2 text-sm leading-none font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Benchmark Container
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="flex cursor-default items-center gap-1 italic">
                                                    <HelpCircleIcon className="h-auto w-4 text-red-800" />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className='text-center'>Enable this switch to make it just a container or parent benchmark. (This will disable the upload button)</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                            </div>
                            <InputError message={errors.is_container} className="mt-2" />
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
            </DialogContent >
        </Dialog >
    );
}
