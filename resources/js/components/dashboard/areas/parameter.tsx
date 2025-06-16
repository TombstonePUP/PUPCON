'use client';

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
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { type AreaParameters, type ParameterOutlineCategory } from '@/types';

interface ParameterProps {
    areaId: number;
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

interface AreaFileForm {
    area_file_id: number;
    parameter_outline_id?: number;
    file_status_id?: number;
    file_name: string;
    file_path: string;
}

export default function Parameter({ areaId, program, areaParameters, parameterOutlineCategories }: ParameterProps) {
    const {
        data: dataParams,
        setData: setParamsData,
        post: postParams,
        patch: patchParams,
        delete: destroyParams,
        processing: processingParams,
        errors: errorsParams,
        reset: resetParams,
    } = useForm<ParameterForm>({
        area_id: areaId,
        area_parameter_id: undefined,
        parameter_name: '',
        parameter_description: '',
    });

    const {
        data: dataOutline,
        setData: setOutlineData,
        post: postOutline,
        patch: patchOutline,
        delete: destroyOutline,
        processing: processingOutline,
        errors: errorsOutline,
        reset: resetOutline,
    } = useForm<ParameterOutlineForm>({
        parameter_outline_id: undefined,
        area_parameter_id: 0,
        parameter_outline_category_id: 0,
        outline_number: 0,
        outline_description: '',
        container: false,
    });

    const addParameter = (e: React.FormEvent) => {
        e.preventDefault();
        postParams(route('manage.area.addParameter', [program, areaId]), {
            onFinish: () => {
                resetParams('parameter_name', 'parameter_description');
            },
        });
    };
    const editParameter = (e: React.FormEvent) => {
        e.preventDefault();
        patchParams(route('manage.area.updateParameter', [program, areaId, dataParams.area_parameter_id]), {
            onSuccess: () => {
                resetParams('parameter_name', 'parameter_description', 'area_parameter_id');
            },
        });
    };

    const deleteParameter = (id: number) => {
        destroyParams(route('manage.area.deleteParameter', [program, areaId, id]), {
            onSuccess: () => {
                console.log('Parameter deleted successfully');
            },
        });
    };

    const addOutline = (e: React.FormEvent) => {
        e.preventDefault();
        postOutline(route('manage.area.addOutline', [program, areaId]), {
            onFinish: () => {
                resetOutline('area_parameter_id', 'parameter_outline_category_id', 'outline_number', 'outline_description', 'container');
            },
        });
    };

    const deleteOutline = (id: number) => {
        console.log(id);
        destroyOutline(route('manage.area.deleteOutline', [program, areaId, id]), {
            onSuccess: () => {
                console.log('Outline deleted successfully');
            },
        });
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="black">Add Parameter</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Parameter</DialogTitle>
                        <DialogDescription>Parameter A</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={addParameter} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="w-1/4">
                                <label className="text-muted-foreground mb-1 block text-sm font-medium">Parameter</label>
                                <input
                                    id="parameter_name"
                                    type="text"
                                    // required
                                    autoFocus
                                    maxLength={1}
                                    tabIndex={1}
                                    value={dataParams.parameter_name}
                                    onChange={(e) => setParamsData('parameter_name', e.target.value)}
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
                                    required
                                    autoFocus
                                    tabIndex={2}
                                    value={dataParams.parameter_description}
                                    onChange={(e) => setParamsData('parameter_description', e.target.value)}
                                    disabled={processingParams}
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
            {areaParameters?.length ? (
                areaParameters.map((parameter) => (
                    <Accordion type="single" collapsible className="flex w-[100%] flex-col gap-[1vw]">
                        <AccordionItem value="item-1" className="before:bg-[#171717]">
                            <AccordionTrigger className="flex flex-row items-center justify-between">
                                <div className="flex w-full flex-row justify-evenly">
                                    <h1 className="text-lgf font-black text-[#171717]">
                                        {parameter.parameter_name ? `Parameter ${parameter.parameter_name}` : null}
                                    </h1>
                                    <p className="flex-1 text-center">{parameter.parameter_description}</p>
                                </div>
                                <div className="flex justify-center gap-3">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="black">Edit</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Parameter</DialogTitle>
                                                <DialogDescription>Parameter {parameter.parameter_name}</DialogDescription>
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
                                                                setParamsData('area_parameter_id', parameter.area_parameter_id);
                                                                setParamsData('parameter_name', e.target.value);
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
                                                            required
                                                            autoFocus
                                                            // value={parameter.parameter_description}
                                                            value={dataParams.parameter_description}
                                                            tabIndex={2}
                                                            onChange={(e) => {
                                                                setParamsData('area_parameter_id', parameter.area_parameter_id);
                                                                setParamsData('parameter_description', e.target.value);
                                                            }}
                                                            disabled={processingParams}
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
                                                    This action cannot be undone. This will permanently delete the{' '}
                                                    <b>Parameter {parameter.parameter_name}</b>.
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
                                {parameterOutlineCategories?.some((category) =>
                                    category.parameter_outlines?.some((outline) => outline.area_parameter_id === parameter.area_parameter_id),
                                ) ? (
                                    parameterOutlineCategories.map((category) => {
                                        const outlinesForParameter =
                                            category.parameter_outlines?.filter(
                                                (outline) => outline.area_parameter_id === parameter.area_parameter_id,
                                            ) ?? [];
                                        if (!outlinesForParameter.length) return null;
                                        return (
                                            <div key={category.id} className="rounded bg-[#F7F7F7] p-[2vw]">
                                                <h1 className="text-[1vw] font-black">
                                                    {category.category_name === 'No Category' ? null : category.category_name}
                                                </h1>
                                                <ul className="pl-[1vw]">
                                                    {outlinesForParameter.map((outline) => (
                                                        <li key={outline.parameter_outline_id}>
                                                            <ContextMenu>
                                                                <ContextMenuTrigger>
                                                                    <a className="cursor-pointer text-[#7f1414] underline">
                                                                        {outline.outline_description}
                                                                    </a>
                                                                </ContextMenuTrigger>
                                                                <ContextMenuContent>
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="none"
                                                                                className="shadowColor: none, , w-full justify-start border-none"
                                                                            >
                                                                                Edit Outline
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>
                                                                                    Edit Outline {outline.outline_number} -{' '}
                                                                                    {outline.outline_description}
                                                                                </DialogTitle>
                                                                                <DialogDescription>
                                                                                    Make changes to the outline {outline.outline_description}
                                                                                    This action cannot be undone. This will permanently delete the{' '}
                                                                                    <b>Parameter {outline.outline_description}</b>.
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="reverse"
                                                                                className="shadowColor: none, , w-full justify-start border-none !text-black hover:bg-red-400"
                                                                            >
                                                                                Attach Document
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Are you sure?</DialogTitle>
                                                                                <DialogDescription>
                                                                                    This action cannot be undone. This will permanently delete the{' '}
                                                                                    <b>Parameter {outline.outline_description}</b>.
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                            <DialogFooter>
                                                                                <DialogClose asChild>
                                                                                    <Button variant="outline">Cancel</Button>
                                                                                </DialogClose>
                                                                                <Button variant="black">Submit</Button>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                    <ContextMenuItem>Download</ContextMenuItem>
                                                                    <ContextMenuSeparator />
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="reverse"
                                                                                className="shadowColor: none, , w-full justify-start border-none !text-black hover:bg-red-400"
                                                                            >
                                                                                Remove Outline
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Are you sure?</DialogTitle>
                                                                                <DialogDescription>
                                                                                    This action cannot be undone. This will permanently delete the{' '}
                                                                                    <b>
                                                                                        {outline.outline_description} and its corresponding document
                                                                                    </b>
                                                                                    .
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                            <DialogFooter>
                                                                                <DialogClose asChild>
                                                                                    <Button variant="outline">Cancel</Button>
                                                                                </DialogClose>
                                                                                <Button
                                                                                    disabled={processingOutline}
                                                                                    onClick={() => deleteOutline(outline.parameter_outline_id)}
                                                                                    type="submit"
                                                                                >
                                                                                    Remove
                                                                                </Button>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </ContextMenuContent>
                                                            </ContextMenu>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center">
                                        <h1 className="text-[1.5vw] font-bold">Content Not Available</h1>
                                        <p className="text-[1.2vw] text-[#858585]">No Available Outline/Files in This Parameter.</p>
                                    </div>
                                )}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <a className="cursor-pointer underline">Add Outline</a>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Outline</DialogTitle>
                                            <DialogDescription>Make a new outline for {parameter.parameter_name}</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={(e) => addOutline(e)} className="flex flex-col gap-4">
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
                                                        className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                    />
                                                    <InputError message={errorsOutline.outline_number} className="mt-2" />
                                                </div>
                                                <div>
                                                    <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Name</label>
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
                                                </div>
                                                <div>
                                                    <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Category</label>
                                                    <select
                                                        className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                        id="parameter_outline_category_id"
                                                        tabIndex={3}
                                                        autoFocus
                                                        value={dataOutline.parameter_outline_category_id}
                                                        onChange={(e) => setOutlineData('parameter_outline_category_id', e.target.value)}
                                                        disabled={processingOutline}
                                                    >
                                                        <option value="" disabled>
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
                                                    <label className='flex gap-2 text-sm'>
                                                        <input type="checkbox" className="accent-ring" />
                                                        Outline Container
                                                    </label>
                                                </div>
                                                {/* <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">Upload Document</label>
                                                <input
                                                    type="file"
                                                    className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-accent"
                                                />
                                            </div> */}
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button tabIndex={5} disabled={processingOutline} variant="outline">
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
                    </Accordion>
                ))
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <h1 className="text-[1.5vw] font-bold">Content Not Available</h1>
                    <p className="text-[1.2vw] text-[#858585]">No Available Parameters in This Area.</p>
                </div>
            )}
        </>
    );
}
