"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox';

import { useEffect } from "react";

import {
    type AreaParameters,
    type ParameterOutlineCategory
} from "@/types";

interface ParameterAccordionProps {
    areaParameters?: AreaParameters[];
    parameterOutlineCategories?: ParameterOutlineCategory[];
}

export default function ParameterAccordion() {

    return (
        <>
            {areaParameters?.length ? (
                areaParameters.map((parameter) => (
                <Accordion type="single" collapsible className='w-[100%] flex flex-col gap-[1vw]'>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className='flex flex-row justify-between items-center'>
                            <div className="flex flex-row justify-between w-full ">
                                <h1 className='text-[#7f1414] font-black text-lg'>
                                    {parameter.parameter_name ? `Parameter ${parameter.parameter_name}` : null }
                                </h1>
                                <p className='text-lg'>{parameter.parameter_description}</p>
                            </div>
                            <div className='flex justify-center gap-3'>
                                <Dialog>
                                    <DialogTrigger asChild >
                                        <Button>Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Parameter</DialogTitle>
                                            <DialogDescription>Parameter {parameter.parameter_name}</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={editParameter}
                                        className="flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <div className="w-1/4">
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Parameter</label>
                                                    <input
                                                        id="parameter_name"
                                                        type="text"
                                                        autoFocus
                                                        maxLength={1}
                                                        tabIndex={1}
                                                        value={dataParams.parameter_name}
                                                        onChange={(e) => {
                                                            setParamsData('area_parameter_id', parameter.area_parameter_id);
                                                            setParamsData('parameter_name', e.target.value)
                                                        }}
                                                        disabled={processingParams}
                                                        placeholder='A'
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
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
                                                            setParamsData('parameter_description', e.target.value)
                                                        }}
                                                        disabled={processingParams}
                                                        placeholder='Enter description'
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    />
                                                </div>
                                            </div>
                                            <InputError message={errorsParams.parameter_name} className="mt-2" />
                                            <InputError message={errorsParams.parameter_description} className="mt-2" />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button tabIndex={3} variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit" tabIndex={4}>Submit</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="reverse">Remove</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete the <b>Parameter {parameter.parameter_name}</b>.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button disabled={processingParams} onClick={() => deleteParameter(parameter.area_parameter_id)} type="submit">
                                                Remove
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            {parameterOutlineCategories?.some(category =>
                                category.parameter_outlines?.some(outline =>
                                    outline.area_parameter_id === parameter.area_parameter_id
                                )
                            ) ? (
                                parameterOutlineCategories.map((category) => {
                                    const outlinesForParameter = category.parameter_outlines?.filter(
                                        (outline) => outline.area_parameter_id === parameter.area_parameter_id
                                    ) ?? [];
                                    if (!outlinesForParameter.length) return null;
                                    return (
                                        <div key={category.id} className='bg-[#D9D9D9] p-[2vw] rounded'>
                                            <h1 className='font-black text-[1vw]'>{category.category_name === 'No Category' ? null :  category.category_name}</h1>
                                            <ul className='pl-[1vw]'>
                                                {outlinesForParameter.map((outline) => (
                                                    <li key={outline.id}>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Attach Document</DialogTitle>
                                                                    <DialogDescription>
                                                                        Attach a document to the outline: <b>{outline.outline_description}</b>
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="flex flex-col gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                                            Upload Document
                                                                        </label>
                                                                        <input
                                                                            type="file"
                                                                            className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-accent"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Cancel</Button>
                                                                    </DialogClose>
                                                                    <Button>Submit</Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <ContextMenu>
                                                            <ContextMenuTrigger>
                                                                <a className='cursor-pointer underline text-[#7f1414]'>
                                                                    {outline.outline_description}
                                                                </a>
                                                            </ContextMenuTrigger>
                                                            <ContextMenuContent>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                    <Button variant="none" className='shadowColor: none, , w-full justify-start border-none'>
                                                                            Edit Outline
                                                                    </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Edit Outline {outline.outline_number} - {outline.outline_description}</DialogTitle>
                                                                            <DialogDescription>
                                                                                This action cannot be undone. This will permanently delete the <b>Parameter {outline.outline_description}</b>.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                    </DialogContent>
                                                                </Dialog>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                    <Button variant="reverse" className='shadowColor: none, , w-full justify-start !text-black border-none hover:bg-red-400'>
                                                                            Attach Document
                                                                    </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Are you sure?</DialogTitle>
                                                                            <DialogDescription>
                                                                                This action cannot be undone. This will permanently delete the <b>Parameter {outline.outline_description}</b>.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter>
                                                                            <DialogClose asChild>
                                                                                <Button variant="outline">Cancel</Button>
                                                                            </DialogClose>
                                                                            <Button type="submit">
                                                                                Submit
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                                <ContextMenuItem>Download</ContextMenuItem>
                                                                <ContextMenuSeparator />
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                    <Button variant="reverse" className='shadowColor: none, , w-full justify-start !text-black border-none hover:bg-red-400'>
                                                                        Delete
                                                                    </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Are you sure?</DialogTitle>
                                                                            <DialogDescription>
                                                                                This action cannot be undone. This will permanently delete the <b>Parameter {outline.outline_description}</b>.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter>
                                                                            <DialogClose asChild>
                                                                                <Button variant="outline">Cancel</Button>
                                                                            </DialogClose>
                                                                            <Button type="submit">
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
                                <div className='flex flex-col items-center justify-center w-full h-full'>
                                    <h1 className='text-[1.5vw] font-bold'>Content Not Available</h1>
                                    <p className='text-[1.2vw] text-[#858585]'>No Available Outline/Files in This Parameter.</p>
                                </div>
                            )}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <a className='cursor-pointer underline'>Add Outline</a>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Outline</DialogTitle>
                                        <DialogDescription>
                                            Make a new outline for {parameter.parameter_name}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={(e) => addOutline(e)} className="flex flex-col gap-4">
                                        <div className=" flex flex-col gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">Outline Number</label>
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
                                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                                <InputError message={errorsOutline.outline_number} className="mt-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">Outline Name</label>
                                                <textarea
                                                    id="outline_description"
                                                    required
                                                    autoFocus
                                                    tabIndex={2}
                                                    value={dataOutline.outline_description}
                                                    onChange={(e) => setOutlineData('outline_description', e.target.value)}
                                                    disabled={processingOutline}
                                                    placeholder="Enter outline description"
                                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[100px]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">Outline Category</label>
                                                <select
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    id="parameter_outline_category_id"
                                                    tabIndex={3}
                                                    autoFocus
                                                    value= {dataOutline.parameter_outline_category_id}
                                                    onChange={(e) => setOutlineData('parameter_outline_category_id', e.target.value)}
                                                    disabled={processingOutline}
                                                >
                                                    <option value='' disabled>Select Category</option>
                                                    {
                                                        parameterOutlineCategories?.map((category) => {
                                                            return (
                                                                <option key={category.parameter_outline_category_id} value={category.parameter_outline_category_id}>
                                                                    {category.category_name}
                                                                </option>
                                                            );
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="flex items-center cursor-pointer">
                                                <Checkbox
                                                    id="container"
                                                    className="accent-ring"
                                                    tabIndex={4}
                                                    autoFocus
                                                    checked={dataOutline.container}
                                                    onCheckedChange={(checked) => setOutlineData('container', checked === true)}
                                                />
                                                <span className="ml-2">Outline Container</span>
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
                                                <Button tabIndex={5} disabled={processingOutline} variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button
                                                type='submit'
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
                <div className='flex flex-col items-center justify-center w-full h-full'>
                    <h1 className='text-[1.5vw] font-bold'>Content Not Available</h1>
                    <p className='text-[1.2vw] text-[#858585]'>No Available Parameters in This Area.</p>
                </div>
            )}
        </>
    );
}
