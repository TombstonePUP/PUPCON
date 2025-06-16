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
import AppLayout from '@/layouts/app-layout';
import { type Area, type BreadcrumbItem, type ParameterOutlineCategory, type Program } from '@/types';
import { Head, Link } from '@inertiajs/react';

import AreaCardForm from '@/components/dashboard/areas/area-card-form';
import AddParameter from '@/components/dashboard/areas/parameter';

// charts components
interface AreaFilesProps {
    program: Program;
    area?: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
}

export default function Areas({ program, area, parameterOutlineCategories }: AreaFilesProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-program/${program.program_name}`,
        },
        {
            title: area.area_name,
            href: `/manage-program/${program.program_name}/${area.area_id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${area.area_name} - ${program.program_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border-2">
                    <h1 className="mt-3 mb-3 text-center text-[1.8vw] font-black">{area.area_name.toUpperCase()}</h1>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="grid place-items-center">
                        <div className="grid w-fit place-items-center gap-1 rounded border p-2">
                            <img className="rounded" src="/images/placeholder.png" alt="" />
                            <p className="mt-3 mb-[-0.3vw] text-center text-sm text-[#858585]">AACCUP | Level II</p>
                            <h1 className="w-80 text-center text-2xl leading-none font-black">Program Performance Profile</h1>
                            <p className="my-5 text-center text-sm">{`${program.program_name}`}</p>
                            <Link href="#" className="w-full text-right text-sm underline">
                                View PDF
                            </Link>
                        </div>
                    </div>
                    <AreaCardForm></AreaCardForm>
                </div>
                <div className="border-sidebar-border/70 relative space-y-5 overflow-y-auto rounded-xl border p-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="black">Add Parameter</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Parameter</DialogTitle>
                                <DialogDescription>Parameter A</DialogDescription>
                            </DialogHeader>

                            <form
                                //  onSubmit={addParameter}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex gap-4">
                                    <div className="w-1/4">
                                        <label className="text-muted-foreground mb-1 block text-sm font-medium">Parameter</label>
                                        <input
                                            id="parameter_name"
                                            type="text"
                                            // required
                                            autoFocus
                                            maxLength={1}
                                            // tabIndex={1}
                                            // value={dataParams.parameter_name}
                                            // onChange={(e) => setParamsData('parameter_name', e.target.value)}
                                            // disabled={processingParams}
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
                                            // value={dataParams.parameter_description}
                                            // onChange={(e) => setParamsData('parameter_description', e.target.value)}
                                            // disabled={processingParams}
                                            placeholder="Enter description"
                                            className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                {/* <InputError message={errorsParams.parameter_name} className="mt-2" />
                                <InputError message={errorsParams.parameter_description} className="mt-2" /> */}
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
                    <div>
                        <Accordion type="single" collapsible className="flex w-full flex-col gap-[1vw]">
                            <AccordionItem value="item-1" className="before:bg-[#171717]">
                                <AccordionTrigger className="flex flex-row items-center justify-between">
                                    <div className="flex h-full w-full flex-row items-center">
                                        <h1 className="font-black text-[#171717]">Parameter A</h1>
                                        <p className="flex-1 text-center">Statement of Vision, Mission, Goals, and Objectives</p>
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="black">Edit</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Parameter</DialogTitle>
                                                    <DialogDescription>Parameter A</DialogDescription>
                                                </DialogHeader>
                                                <form
                                                    // onSubmit={editParameter}
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
                                                                placeholder="A"
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
                                                                required
                                                                autoFocus
                                                                placeholder="Enter description"
                                                                className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
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
                                                    <Button type="submit">Remove</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="rounded bg-[#D9D9D9] p-[2vw]">
                                        <h1 className="text-[1vw] font-black">Systems - Inputs and Processes</h1>
                                        <ul className="pl-[1vw]">
                                            <li>S.1. The institution has a system of determining the Vision and Mission.</li>
                                            <li>S.2. The Vision clearly reflects what the Institution hopes to become in the future.</li>
                                            <li>S.3. The Mission clearly reflects the Institution’s legal and other statutory mandates.</li>
                                        </ul>
                                    </div>
                                    <div className="rounded bg-[#D9D9D9] p-[2vw]">
                                        <h1 className="text-[1vw] font-black">Implementation</h1>
                                        <ul className="pl-[1vw]">
                                            <li>
                                                I.1. The Institution/College conducts review on the statement of the Vision and Mission as well as its
                                                goals and program objectives for the approval of authorities concerned.
                                            </li>
                                            <li>
                                                I.2. The College/Academic Unit follows a system of formulating its goals and the objectives of the
                                                program.
                                            </li>
                                            <li>
                                                I.3. The College/Academic Unit’s faculty, personnel, students and other stakeholders (cooperating
                                                agencies, linkages, alumni, industry sector and other concerned groups) participate in the
                                                formulation, review and/or revision of the VMGO.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rounded bg-[#D9D9D9] p-[2vw]">
                                        <h1 className="text-[1vw] font-black">Outcome/s</h1>
                                        <ul className="pl-[1vw]">
                                            <li>O.1. The VMGO are crafted and duly approved by BOR/BOT.</li>
                                        </ul>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <a className="cursor-pointer underline">Add Outline</a>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Outline</DialogTitle>
                                                <DialogDescription>Make a new outline for Parameter A</DialogDescription>
                                            </DialogHeader>
                                            <form className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-4">
                                                    <div>
                                                        <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Number</label>
                                                        <input
                                                            id="outline_number"
                                                            type="text"
                                                            required
                                                            autoFocus
                                                            tabIndex={1}
                                                            placeholder="1.1.3"
                                                            className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                        />
                                                        <InputError
                                                            // message={errorsOutline.outline_number}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Name</label>
                                                        <textarea
                                                            id="outline_description"
                                                            required
                                                            autoFocus
                                                            tabIndex={2}
                                                            placeholder="Enter outline description"
                                                            className="focus:border-ring focus:ring-ring min-h-[100px] w-full resize-y rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
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
                                                        <label className="flex gap-2 text-sm">
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
                                                        <Button
                                                            tabIndex={5}
                                                            // disabled={processingOutline}
                                                            variant="outline"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button variant="black" type="submit" tabIndex={6}>
                                                        Submit
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="before:bg-[#171717]">
                                <AccordionTrigger className="flex flex-row justify-between">
                                    <div className="flex h-full w-full flex-row items-center">
                                        <h1 className="font-black text-[#171717]">Parameter B</h1>
                                        <p className="flex-1 text-center">Faculty</p>
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="black">Edit</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Parameter</DialogTitle>
                                                    <DialogDescription>Parameter B</DialogDescription>
                                                </DialogHeader>
                                                <form
                                                    // onSubmit={editParameter}
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
                                                                placeholder="A"
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
                                                                required
                                                                autoFocus
                                                                placeholder="Enter description"
                                                                className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
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
                                                        This action cannot be undone. This will permanently delete the Parameter B
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button type="submit">Remove</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="rounded bg-[#D9D9D9] p-[2vw]">
                                        <h1 className="text-[1vw] font-black">Systems - Inputs and Processes</h1>
                                        <ul className="pl-[1vw]">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <a className="cursor-pointer underline">Add Outline</a>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Add Outline</DialogTitle>
                                                        <DialogDescription>Make a new outline for Parameter B</DialogDescription>
                                                    </DialogHeader>
                                                    <form className="flex flex-col gap-4">
                                                        <div className="flex flex-col gap-4">
                                                            <div>
                                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                                                                    Outline Number
                                                                </label>
                                                                <input
                                                                    id="outline_number"
                                                                    type="text"
                                                                    required
                                                                    autoFocus
                                                                    tabIndex={1}
                                                                    placeholder="1.1.3"
                                                                    className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                                />
                                                                <InputError
                                                                    // message={errorsOutline.outline_number}
                                                                    className="mt-2"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                                                                    Outline Name
                                                                </label>
                                                                <textarea
                                                                    id="outline_description"
                                                                    required
                                                                    autoFocus
                                                                    tabIndex={2}
                                                                    placeholder="Enter outline description"
                                                                    className="focus:border-ring focus:ring-ring min-h-[100px] w-full resize-y rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
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
                                                                <label className="flex gap-2 text-sm">
                                                                    <input type="checkbox" className="accent-ring" />
                                                                    Outline Container
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button
                                                                    tabIndex={5}
                                                                    // disabled={processingOutline}
                                                                    variant="outline"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </DialogClose>
                                                            <Button variant="black" type="submit" tabIndex={6}>
                                                                Submit
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                            <li>S.1. The institution has a system of determining the Vision and Mission.</li>
                                            <li>S.2. The Vision clearly reflects what the Institution hopes to become in the future.</li>
                                            <li>S.3. The Mission clearly reflects the Institution’s legal and other statutory mandates.</li>
                                        </ul>
                                    </div>
                                    <div className="rounded bg-[#D9D9D9] p-[2vw]">
                                        <h1 className="text-[1vw] font-black">Implementation</h1>
                                        <ul className="pl-[1vw]">
                                            <li>
                                                I.1. The Institution/College conducts review on the statement of the Vision and Mission as well as its
                                                goals and program objectives for the approval of authorities concerned.
                                            </li>
                                            <li>
                                                I.2. The College/Academic Unit follows a system of formulating its goals and the objectives of the
                                                program.
                                            </li>
                                            <li>
                                                I.3. The College/Academic Unit’s faculty, personnel, students and other stakeholders (cooperating
                                                agencies, linkages, alumni, industry sector and other concerned groups) participate in the
                                                formulation, review and/or revision of the VMGO.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rounded bg-[#D9D9D9] p-[2vw]">
                                        <h1 className="text-[1vw] font-black">Outcome/s</h1>
                                        <ul className="pl-[1vw]">
                                            <li>O.1. The VMGO are crafted and duly approved by BOR/BOT.</li>
                                        </ul>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <a className="cursor-pointer underline">Add Outline</a>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Outline</DialogTitle>
                                                <DialogDescription>Make a new outline for Parameter </DialogDescription>
                                            </DialogHeader>
                                            <form className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-4">
                                                    <div>
                                                        <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Number</label>
                                                        <input
                                                            id="outline_number"
                                                            type="text"
                                                            required
                                                            autoFocus
                                                            tabIndex={1}
                                                            placeholder="1.1.3"
                                                            className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                        />
                                                        <InputError
                                                            // message={errorsOutline.outline_number}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Name</label>
                                                        <textarea
                                                            id="outline_description"
                                                            required
                                                            autoFocus
                                                            tabIndex={2}
                                                            placeholder="Enter outline description"
                                                            className="focus:border-ring focus:ring-ring min-h-[100px] w-full resize-y rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
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
                                                        <label className="flex gap-2 text-sm">
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
                                                        <Button
                                                            tabIndex={5}
                                                            // disabled={processingOutline}
                                                            variant="outline"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button variant="black" type="submit" tabIndex={6}>
                                                        Submit
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <AddParameter
                        areaId={area.area_id}
                        program={program.program_name}
                        areaParameters={area.area_parameters}
                        parameterOutlineCategories={parameterOutlineCategories}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
