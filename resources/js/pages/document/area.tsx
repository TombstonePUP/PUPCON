import AreaCards from '@/components/dashboard/areas/area-card-form';
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
import { Head } from '@inertiajs/react';
import { Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

// charts components
interface AreaFilesProps {
    program: Program;
    area?: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
}

export default function Areas({ program, area, parameterOutlineCategories }: AreaFilesProps) {
    const [cards, setCards] = useState<CardType[]>([]);
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
                    <div>
                        <AreaCards
                            program={{ program_name: `${program.program_name}` }}
                            cards={cards}
                            onAdd={(newCard) => setCards([...cards, newCard])}
                            onEdit={(id, updates) => {
                                setCards(cards.map((card) => (card.id === id ? { ...card, ...updates } : card)));
                            }}
                            onRemove={(id) => setCards(cards.filter((card) => card.id !== id))}
                        />
                    </div>
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
                            <form className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="w-1/4">
                                        <label className="text-muted-foreground mb-1 block text-sm font-medium">Parameter</label>
                                        <input
                                            id="parameter_name"
                                            type="text"
                                            required
                                            autoFocus
                                            maxLength={1}
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
                                            <li>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <a className="cursor-pointer underline">
                                                            S.1. The institution has a system of determining the Vision and Mission.
                                                        </a>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-black">Edit Outline</DialogTitle>
                                                            <DialogDescription>Parameter A - Systems - Inputs and Processes</DialogDescription>
                                                        </DialogHeader>

                                                        <div className="flex flex-col gap-3 ">
                                                            {/* Current Document Section */}
                                                            <div>
                                                                <h1 className='text-sm font-medium text-muted-foreground mb-1'>Current Document</h1>
                                                                <div className="flex items-center gap-4 rounded border bg-gray-50 p-4">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm text-gray-600">No document uploaded</p>
                                                                        {/* When document exists:
                                                                        <p className="font-medium">vision_mission_system.pdf</p>
                                                                        <p className="text-sm text-gray-500">Uploaded on Jan 15, 2023</p>
                                                                        */}
                                                                    </div>
                                                                    <Button variant="outline" size="sm" disabled={true}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View PDF
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {/* Edit Outline Section */}
                                                            <div>
                                                                <h3 className='text-sm font-medium text-muted-foreground mb-1'>Edit Outline Content</h3>
                                                                <textarea
                                                                    className="min-h-[120px] w-full rounded border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 max-h-[20vw]"
                                                                    defaultValue="The institution has a system of determining the Vision and Mission."
                                                                    placeholder="Enter outline description..."
                                                                />
                                                            </div>

                                                            {/* Upload File Section */}
                                                            <div className="space-y-2">
                                                                <h3 className='text-sm font-medium text-muted-foreground mb-1'>Upload Document</h3>
                                                                <div className="flex w-full items-center justify-center">
                                                                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
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
                                                                            <p className="mb-2 text-sm text-gray-500">
                                                                                <span className="font-semibold">Click to upload</span> or drag and
                                                                                drop
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                                                                        </div>
                                                                        <input type="file" className="hidden" accept=".pdf" />
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex justify-between pt-4">
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="destructive">
                                                                            <Trash2 className="h-4 w-4" />
                                                                            Remove Outline
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-md">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Confirm Removal</DialogTitle>
                                                                            <DialogDescription>
                                                                                Are you sure you want to permanently remove this outline and all
                                                                                associated documents?
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter>
                                                                            <DialogClose asChild>
                                                                                <Button variant="outline">Cancel</Button>
                                                                            </DialogClose>
                                                                            <Button variant="destructive">Delete Permanently</Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>

                                                                <div className="flex gap-2">
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Cancel</Button>
                                                                    </DialogClose>
                                                                    <Button variant="black" type="submit">
                                                                        Save Changes
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </li>
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
                </div>
            </div>
        </AppLayout>
    );
}
