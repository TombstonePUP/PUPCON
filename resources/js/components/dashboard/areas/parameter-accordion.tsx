"use client";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Eye, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
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
import { Checkbox } from '@/components/ui/checkbox';

import { useForm } from '@inertiajs/react';

import {
    type AreaParameters,
    type ParameterOutlineCategory
} from "@/types";

import { buildOutlineTree, RecursiveOutlineForm } from "@/components/recursive-outline";

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

    const {
        data: dataOutline,
        setData: setOutlineData,
        post: postOutline,
        processing: processingOutline,
        errors: errorsOutline,
        reset: resetOutline,
    } = useForm<ParameterOutlineForm>({
        parameter_outline_id: undefined,
        area_parameter_id: null,
        parameter_outline_category_id: null,
        outline_number: null,
        outline_description: '',
        container: false,
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
        postOutline(route('manage.area.addOutline', [program, area_id]), {
            onSuccess: () => {
                resetOutline('area_parameter_id', 'parameter_outline_category_id', 'outline_number', 'outline_description', 'container');
                console.log('Outline added successfully');
            },
        });
    };

    return (
        <>
            <Accordion type="single" collapsible className="flex w-full flex-col gap-[1vw]">
            {areaParameters?.length > 0 ? (
                areaParameters.map((parameter) => (
                <AccordionItem value={`item-${parameter.area_parameter_id}`} >
                    <AccordionTrigger className="flex flex-row items-center justify-between">
                        <div className="flex h-full w-full flex-row items-center">
                            <h1 className="font-bold text-[#171717]">
                                { parameter.parameter_name != ' ' ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}` : parameter.parameter_name }
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
                                        <DialogDescription>{ parameter.parameter_name != ' ' ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}` : parameter.parameter_name }</DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={editParameter}
                                        className="flex flex-col gap-4"
                                    >
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
                                                        setParamsData('parameter_name', e.target.value)
                                                        setParamsData('area_parameter_id', parameter.area_parameter_id);
                                                    }}
                                                    disabled={processingParams}
                                                    placeholder='A'
                                                    className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                                                    Description
                                                </label>
                                                <input
                                                    id="parameter_description"
                                                    type="text"
                                                    autoFocus
                                                    tabIndex={2}
                                                    value={dataParams.parameter_description}
                                                    onChange={(e) => {
                                                        setParamsData('parameter_description', e.target.value)
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
                                            <Button variant="black" type="submit" tabIndex={4}>
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
                                const outlines = parameter.parameter_outlines?.filter(
                                    outline => outline.parameter_outline_category_id === category.parameter_outline_category_id
                                ) || [];
                                if (outlines.length === 0) return null;
                                {outlines.map((outline) => (
                                    outline.initial = category.category_name == 'No Category' ?
                                        parameter.parameter_name == '' ? '' : parameter.parameter_name.toUpperCase().match(/^[A-Za-z]/)
                                        : category.category_name.match(/^[A-Za-z]/)
                                ))}

                                const sortedOutlines = buildOutlineTree({ outlines });

                                return (
                                    <>
                                        <div className="rounded bg-[#D9D9D9] p-[2vw]">
                                            <h1 className="text-[1vw] font-bold">{category.category_name == 'No Category' ? '' : category.category_name}</h1>
                                            <RecursiveOutlineForm outlines={sortedOutlines} program={program} area_id={area_id}  outlineCategory={parameterOutlineCategories}/>
                                        </div>
                                    </>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500">No outlines available for this parameter.</p>
                        )}
                        <Dialog>
                            <DialogTrigger asChild>
                                <a className="cursor-pointer underline">Add Outline</a>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Outline</DialogTitle>
                                    <DialogDescription>Make a new outline for { parameter.parameter_name != ' ' ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}` : parameter.parameter_name }</DialogDescription>
                                </DialogHeader>
                                <form  onSubmit={(e) => addOutline(e)} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Number</label>
                                            <input
                                                id="outline_number"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                value={dataOutline.outline_number}
                                                onChange={(e) => setOutlineData('outline_number', e.target.value)}
                                                disabled={processingOutline}
                                                placeholder="1.1.3"
                                                className="focus:border-ring focus:ring-ring w-100 rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                            />
                                            <InputError
                                                message={errorsOutline.outline_number}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Description</label>
                                            <textarea
                                                id="outline_description"
                                                required
                                                autoFocus
                                                tabIndex={2}
                                                value={dataOutline.outline_description}
                                                onChange={(e) => setOutlineData('outline_description', e.target.value)}
                                                disabled={processingOutline}
                                                placeholder="Enter outline description"
                                                className="focus:border-ring focus:ring-ring min-h-[100px] w-full resize-y rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                            />
                                            <InputError
                                                message={errorsOutline.outline_description}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">
                                                Outline Category
                                            </label>
                                            <select
                                                className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                id="parameter_outline_category_id"
                                                tabIndex={3}
                                                autoFocus
                                                value={dataOutline.parameter_outline_category_id}
                                                onChange={(e) => setOutlineData('parameter_outline_category_id', parseInt(e.target.value))}
                                                disabled={processingOutline}
                                            >
                                                <option value="">
                                                    Select Category
                                                </option>
                                                {parameterOutlineCategories?.map((category) => {
                                                    return (
                                                        <option
                                                            key={category.parameter_outline_category_id}
                                                            value={category.parameter_outline_category_id}
                                                        >
                                                            {category.category_name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className="flex cursor-pointer items-center">
                                            <label className="flex gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    className="accent-ring"
                                                    checked={dataOutline.container}
                                                    onChange={(e) => setOutlineData('container', e.target.checked)}
                                                />
                                                Outline Container
                                            </label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                tabIndex={5}
                                                disabled={processingOutline}
                                                variant="outline"
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
                                            Submit
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
