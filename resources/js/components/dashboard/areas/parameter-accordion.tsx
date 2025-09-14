'use client';
import InputError from '@/components/input-error';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { useForm } from '@inertiajs/react';
import { useState } from 'react';

import { type AreaParameters, type ParameterOutlineCategory } from '@/types';

import { buildOutlineTree, RecursiveOutlineForm } from '@/components/recursive-outline';

interface ParameterAccordionProps {
    area_id?: number;
    program: string;
    areaParameters?: AreaParameters[];
    parameterOutlineCategories?: ParameterOutlineCategory[];
}

interface ParameterForm {
    area_id?: number;
    area_parameter_id?: number; // Optional for adding new parameters
    parameter_name: string;
    parameter_description: string;
}

interface ParameterOutlineForm {
    parameter_outline_id?: number; // Optional for adding new outlines
    area_parameter_id: number;
    parameter_outline_category_id: number;
    outline_number: string | number;
    outline_description: string;
    container: boolean;
}

export default function ParameterAccordion({ area_id, program, areaParameters, parameterOutlineCategories }: ParameterAccordionProps) {
    // Add state for benchmark container checkbox in ADD outline
    const [isOutlineContainer, setIsOutlineContainer] = useState(false);
    const [addOutlineDialogOpen, setAddOutlineDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        data: dataParams,
        setData: setParamsData,
        patch: patchParams,
        delete: destroyParams,
        processing: processingParams,
        errors: errorsParams,
        reset: resetParams,
    } = useForm<ParameterForm>({
        area_id: area_id,
        area_parameter_id: undefined,
        parameter_name: '',
        parameter_description: '',
    });

    // Update the useForm for outline to include file fields
    const {
        data: dataOutline,
        setData: setOutlineData,
        post: postOutline,
        processing: processingOutline,
        errors: errorsOutline,
        reset: resetOutline,
    } = useForm<ParameterOutlineForm & { file_name?: string; file_path?: File | null }>({
        parameter_outline_id: undefined,
        area_parameter_id: null,
        parameter_outline_category_id: null,
        outline_number: null,
        outline_description: '',
        container: false,
        file_name: '',
        file_path: null,
    });

    const editParameter = (e: React.FormEvent) => {
        e.preventDefault();
        patchParams(route('manage.area.updateParameter', [program, area_id, dataParams.area_parameter_id]), {
            onSuccess: () => {
                resetParams('parameter_name', 'parameter_description', 'area_parameter_id');
            },
        });
    };

    const deleteParameter = (id: number) => {
        destroyParams(route('manage.area.deleteParameter', [program, area_id, id]), {
            onSuccess: () => {
                console.log('Parameter deleted successfully');
            },
        });
    };

    const addOutline = (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('area_parameter_id', dataOutline.area_parameter_id?.toString() || '');
        formData.append('parameter_outline_category_id', dataOutline.parameter_outline_category_id?.toString() || '');
        formData.append('outline_number', dataOutline.outline_number?.toString() || '');
        formData.append('outline_description', dataOutline.outline_description || '');
        formData.append('container', dataOutline.container.toString());

        // Only add file data if not a container and file is selected
        if (!isOutlineContainer && selectedFile) {
            // Use the original file name
            formData.append('file_name', selectedFile.name);
            formData.append('file_path', selectedFile);
        }

        // Use post with FormData
        postOutline(route('manage.area.addOutline', [program, area_id]), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                resetOutline();
                setAddOutlineDialogOpen(false);
                setIsOutlineContainer(false);
                setSelectedFile(null);
                console.log('Benchmark added successfully');
            },
        });
    };

    // Handle file selection (simplified)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setOutlineData('file_path', file);
        }
    };

    return (
        <>
            <Accordion type="single" collapsible className="flex w-full flex-col gap-[1vw]">
                {areaParameters?.length > 0 ? (
                    areaParameters.map((parameter) => (
                        <AccordionItem value={`item-${parameter.area_parameter_id}`} className="group" key={parameter.area_parameter_id}>
                            <AccordionTrigger className="flex flex-row items-center justify-between group-hover:cursor-pointer">
                                <div className="flex h-full w-full flex-row items-center">
                                    <h1 className="font-bold text-[#7f1414] group-hover:text-[#a01818]">
                                        {parameter.parameter_name != ' '
                                            ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}`
                                            : parameter.parameter_name}
                                    </h1>
                                    <p className="flex-1 text-center">{parameter.parameter_description}</p>
                                </div>
                                <div className="flex justify-center gap-3">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="border-none">Edit</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Parameter</DialogTitle>
                                                <DialogDescription>
                                                    {parameter.parameter_name != ' '
                                                        ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}`
                                                        : parameter.parameter_name}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={editParameter} className="flex flex-col gap-4">
                                                <div className="flex gap-4">
                                                    <div className="w-1/4">
                                                        <label className="text-muted-foreground mb-1 block text-sm font-medium">Parameter</label>
                                                        <input
                                                            id="parameter_name"
                                                            type="text"
                                                            autoFocus
                                                            maxLength={1}
                                                            tabIndex={1}
                                                            value={dataParams.parameter_name}
                                                            onChange={(e) => {
                                                                setParamsData('parameter_name', e.target.value);
                                                                setParamsData('area_parameter_id', parameter.area_parameter_id);
                                                            }}
                                                            disabled={processingParams}
                                                            placeholder="A"
                                                            className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-muted-foreground mb-1 block text-sm font-medium">Description</label>
                                                        <input
                                                            id="parameter_description"
                                                            type="text"
                                                            autoFocus
                                                            tabIndex={2}
                                                            value={dataParams.parameter_description}
                                                            onChange={(e) => {
                                                                setParamsData('parameter_description', e.target.value);
                                                                setParamsData('area_parameter_id', parameter.area_parameter_id);
                                                            }}
                                                            placeholder="Enter description"
                                                            className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <InputError message={errorsParams.parameter_name} className="mt-2" />
                                                <InputError message={errorsParams.parameter_description} className="mt-2" />
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button tabIndex={3} variant="outline">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button variant="noborder" type="submit" tabIndex={4}>
                                                        Submit
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Remove</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete the Parameter A
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button
                                                    disabled={processingParams}
                                                    onClick={() => deleteParameter(parameter.area_parameter_id)}
                                                    type="submit"
                                                >
                                                    Remove
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {parameter.parameter_outlines?.length > 0 ? (
                                    parameterOutlineCategories.map((category) => {
                                        const outlines =
                                            parameter.parameter_outlines?.filter(
                                                (outline) => outline.parameter_outline_category_id === category.parameter_outline_category_id,
                                            ) || [];
                                        if (outlines.length === 0) return null;
                                        {
                                            outlines.map(
                                                (outline) =>
                                                    (outline.initial =
                                                        category.category_name == 'No Category'
                                                            ? parameter.parameter_name == ''
                                                                ? ''
                                                                : parameter.parameter_name.toUpperCase().match(/^[A-Za-z]/)
                                                            : category.category_name.match(/^[A-Za-z]/)),
                                            );
                                        }

                                        const sortedOutlines = buildOutlineTree({ outlines });

                                        return (
                                            <>
                                                <div className="rounded bg-[#D9D9D9] p-[2vw]">
                                                    <h1 className="text-[1vw] font-bold">
                                                        {category.category_name == 'No Category' ? '' : category.category_name}
                                                    </h1>
                                                    <RecursiveOutlineForm
                                                        outlines={sortedOutlines}
                                                        program={program}
                                                        area_id={area_id}
                                                        outlineCategory={parameterOutlineCategories}
                                                    />
                                                </div>
                                            </>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-gray-500">No outlines available for this parameter.</p>
                                )}

                                {/* Add Benchmark Dialog */}
                                <Dialog open={addOutlineDialogOpen} onOpenChange={setAddOutlineDialogOpen}>
                                    <DialogTrigger asChild>
                                        <a
                                            className="cursor-pointer underline"
                                            onClick={() => {
                                                setAddOutlineDialogOpen(true);
                                                setIsOutlineContainer(false);
                                                setSelectedFile(null);
                                            }}
                                        >
                                            Add Benchmark
                                        </a>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Add Benchmark</DialogTitle>
                                            <DialogDescription>
                                                Create a new benchmark for{' '}
                                                {parameter.parameter_name != ' '
                                                    ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}`
                                                    : parameter.parameter_name}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form onSubmit={(e) => addOutline(e)} className="flex flex-col gap-4">
                                            {/* Benchmark Number */}
                                            <div>
                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">Benchmark Number</label>
                                                <input
                                                    id="outline_number"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    value={dataOutline.outline_number || ''}
                                                    onChange={(e) => setOutlineData('outline_number', e.target.value)}
                                                    disabled={processingOutline}
                                                    placeholder="1.1"
                                                    className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                />
                                                <InputError message={errorsOutline.outline_number} className="mt-2" />
                                            </div>

                                            {/* Benchmark Description */}
                                            <div>
                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">Benchmark Description</label>
                                                <textarea
                                                    id="outline_description"
                                                    required
                                                    tabIndex={2}
                                                    value={dataOutline.outline_description || ''}
                                                    onChange={(e) => setOutlineData('outline_description', e.target.value)}
                                                    disabled={processingOutline}
                                                    className="min-h-[100px] w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter benchmark description..."
                                                />
                                                <InputError message={errorsOutline.outline_description} className="mt-2" />
                                            </div>

                                            {/* Benchmark Category */}
                                            <div>
                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">Benchmark Category</label>
                                                <select
                                                    className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                    id="parameter_outline_category_id"
                                                    tabIndex={3}
                                                    required
                                                    value={dataOutline.parameter_outline_category_id || ''}
                                                    onChange={(e) => setOutlineData('parameter_outline_category_id', parseInt(e.target.value))}
                                                    disabled={processingOutline}
                                                >
                                                    <option value="">Select Category</option>
                                                    {parameterOutlineCategories?.map((category) => (
                                                        <option
                                                            key={category.parameter_outline_category_id}
                                                            value={category.parameter_outline_category_id}
                                                        >
                                                            {category.category_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errorsOutline.parameter_outline_category_id} className="mt-2" />
                                            </div>

                                            {/* Container Checkbox */}
                                            <div className="flex cursor-pointer items-center">
                                                <label className="flex gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-ring"
                                                        checked={isOutlineContainer}
                                                        onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            setIsOutlineContainer(isChecked);
                                                            setOutlineData('container', isChecked);
                                                            // Clear file when becoming container
                                                            if (isChecked) {
                                                                setSelectedFile(null);
                                                            }
                                                        }}
                                                    />
                                                    Benchmark Container
                                                </label>
                                            </div>

                                            {/* Upload Document Section - Only show if NOT container */}
                                            {!isOutlineContainer && (
                                                <div className="space-y-4">
                                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">Upload Document</h3>

                                                    {/* File Upload */}
                                                    <div className="flex w-full items-center justify-center">
                                                        <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg
                                                                    className="mb-4 h-8 w-8 text-gray-500"
                                                                    aria-hidden="true"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 20 16"
                                                                >
                                                                    <path
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                                    />
                                                                </svg>
                                                                {selectedFile ? (
                                                                    <div className="text-center">
                                                                        <p className="text-sm font-semibold text-green-600">File Selected:</p>
                                                                        <p className="text-xs text-gray-500">{selectedFile.name}</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center">
                                                                        <p className="text-sm text-gray-500">
                                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept=".pdf,.doc,.docx"
                                                                onChange={handleFileChange}
                                                            />
                                                        </label>
                                                    </div>
                                                    <InputError message={errorsOutline.file_path} className="mt-2" />
                                                </div>
                                            )}

                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button
                                                        tabIndex={5}
                                                        disabled={processingOutline}
                                                        variant="outline"
                                                        onClick={() => {
                                                            setAddOutlineDialogOpen(false);
                                                            setIsOutlineContainer(false);
                                                            setSelectedFile(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    variant="black"
                                                    type="submit"
                                                    tabIndex={6}
                                                    onClick={() => setOutlineData('area_parameter_id', parameter.area_parameter_id)}
                                                    disabled={processingOutline}
                                                >
                                                    {processingOutline ? 'Adding...' : 'Add Outline'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </AccordionContent>
                        </AccordionItem>
                    ))
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <h1 className="text-[1.5vw] font-bold">Content Not Available</h1>
                        <p className="text-[1.2vw] text-[#858585]">No Available Parameters in This Area.</p>
                    </div>
                )}
            </Accordion>
        </>
    );
}
