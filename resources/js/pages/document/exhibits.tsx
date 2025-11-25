import { DocumentViewer } from '@/components/dialogs/documents/view-document';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type React from 'react';
// import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit, EditIcon, Folder, GalleryHorizontalEnd, Plus, PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const staticBreadcrumbs = [
    {
        title: 'Exhibits',
        href: `/manage-exhibits`,
    },
];

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

export default function StaticExhibitAdmin() {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={staticBreadcrumbs}>
            <Head title="Exhibits" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* --- Header Section */}
                <div className="flex gap-6">
                    {/* Header Section */}
                    <div id="header" className="mb-2 w-full rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                                <GalleryHorizontalEnd className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-2">
                                <h1 className="text-xl font-semibold text-gray-900">Exhibits</h1>
                                <p className="text-sm text-gray-500">Manage all content related to the Exhibit page and its documents.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Exhibits Grid --- */}
                <div className="flex">
                    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {/* Static Card 1 */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#7f1414]">
                            <div className="flex flex-col gap-3 border-gray-100 p-6">
                                <div className="flex gap-3 border-gray-100">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-lg font-semibold text-[#7f1414]">
                                        1
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="truncate text-base font-semibold text-gray-900">Student Handbooks</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Folder className="h-4 w-4" />
                                            <span className="ml-2 text-xs text-gray-400">3 total files</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-gray-100 pt-2">
                                        <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="w-full">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Manage Exhibit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Static Card 2 */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#7f1414]">
                            <div className="flex flex-col gap-3 border-gray-100 p-6">
                                <div className="flex gap-3 border-gray-100">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-lg font-semibold text-[#7f1414]">
                                        2
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="truncate text-base font-semibold text-gray-900">Academic Catalog</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Folder className="h-4 w-4" />
                                            <span className="ml-2 text-xs text-gray-400">2 total files</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-gray-100 pt-2">
                                        <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="w-full">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Manage Exhibit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Quick Links */}
                    <div className="w-64 shrink-0">
                        <div className="sticky top-6 space-y-4">
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Exhibit Actions</h3>

                                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="noborder" className="w-full">
                                            <Plus className="h-6 w-6 text-white" />
                                            Add New Exhibit
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-medium text-gray-900">Add Exhibit</DialogTitle>
                                            <DialogDescription className="text-sm text-gray-500">
                                                Please provide the exhibit title. Categories and files can be added afterwards.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">Exhibit Title *</Label>
                                                <Input
                                                    type="text"
                                                    required
                                                    placeholder="e.g., Student Handbooks"
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-colors focus:border-[#7f1414] focus:ring-1 focus:ring-[#7f1414]"
                                                />
                                            </div>
                                            <DialogFooter className="pt-4">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button type="submit" variant={'noborder'}>
                                                    Create Exhibit
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>{' '}
                    </div>
                </div>

                <DocumentViewer open={viewDialogOpen} onOpenChange={setViewDialogOpen} fileUrl={''} title={'View Document Placeholder'} />

                {/* --- Edit Exhibit Dialog --- */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="sm:max-w-5xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-medium text-gray-900">Static Exhibit Title</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                                Modify exhibit title, and manage categories and files.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                            {/* Left Pane */}
                            <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                                <h4 className="mb-3 text-xs text-gray-500">Select a category</h4>
                                <div className="space-y-1">
                                    {/* Sample Category 1 (Selected bersyon) */}
                                    <div className="group flex cursor-pointer items-center justify-between rounded-md bg-[#7f1414]/4 p-2 px-4 transition-colors">
                                        <span className="truncate text-sm font-normal text-red-900">Undergraduate</span>
                                        <div className="flex items-center space-x-0.5 opacity-100 transition-opacity">
                                            <ActionButton>
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton>
                                                <Trash2Icon className="h-4 w-4" />
                                            </ActionButton>
                                        </div>
                                    </div>

                                    {/*Sample Category 2 */}
                                    <div className="group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 text-gray-700 transition-colors hover:bg-gray-100">
                                        <span className="truncate text-sm text-gray-700">Graduate</span>
                                        <div className="flex items-center space-x-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                            <ActionButton>
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton>
                                                <Trash2Icon className="h-4 w-4" />
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 border-gray-200 pt-4">
                                    <Dialog>
                                        <DialogTrigger className="w-full">
                                            <Button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition">
                                                <Plus className="mr-2 h-4 w-4" /> New Category
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-lg font-medium text-gray-900">Create New Category</DialogTitle>
                                                <DialogDescription className="text-sm text-gray-500">
                                                   Create a new category within an exhibit
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">Category Name</Label>
                                                <Input type="text" autoFocus tabIndex={1} placeholder="ex. Syllabus for BSHM" />
                                            </div>
                                            <DialogFooter className="mt-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline" id="add-card-dialog-close">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button type="submit" className="border-none">
                                                    Create
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            {/* Right Pane */}
                            <div className="w-2/3 p-6">
                                <>
                                    <h4 className="mb-6 truncate text-lg font-medium text-gray-900">Undergraduate</h4>
                                    <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
                                        {/* Static  Item 1 */}
                                        <div className="group flex items-start justify-between rounded-md border border-gray-100 bg-white p-3 px-6 transition-all hover:border-red-200">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">UG Handbook 2024.pdf</span>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <ActionButton className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700">
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>

                                                <ActionButton className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>

                                        {/* Static Item 2 */}
                                        <div className="group flex items-start justify-between rounded-md border border-gray-100 bg-white p-3 px-6 transition-all hover:border-red-200">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">UG Handbook 2026.pdf</span>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <ActionButton className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700">
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>

                                                <ActionButton className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button className="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                    <PlusIcon className="mr-2 h-4 w-4" />
                                                    Add New File
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="text-lg font-medium text-gray-900">File Name</DialogTitle>
                                                    <DialogDescription className="text-sm text-gray-500">
                                                        Provide or edit the name and file contents for this exhibit
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-2">
                                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Upload Document</Label>
                                                    <Input type="text" autoFocus tabIndex={1} placeholder="ex. UG Manual 202X" />
                                                </div>
                                                <div>
                                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Upload Document</Label>
                                                    <div className="flex w-full items-center justify-center">
                                                        {/* {!data.document ? ( */}
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
                                                                <p className="text-sm text-gray-500">
                                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                                </p>
                                                                <p className="text-xs text-gray-500">PDF</p>
                                                            </div>
                                                            <input
                                                                name="document"
                                                                type="file"
                                                                className="hidden"
                                                                accept=".pdf"
                                                                onChange={(e) => {
                                                                    const file = e.target.files ? e.target.files[0] : null;
                                                                    // setData('document', file);
                                                                }}
                                                            />
                                                        </label>
                                                        {/* ) : ( */}
                                                        {/* <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50 p-5 text-center">
                                        <span className="text-sm font-semibold text-gray-700">{data.document.name}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => {
                                                setData('document', null);
                                            }}
                                        >
                                            Remove File
                                        </Button>
                                    </div> */}
                                                        {/* )} */}
                                                        {/* <InputError message={errors.document} className="mt-2" /> */}
                                                    </div>
                                                </div>
                                                <DialogFooter className="mt-2">
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="outline" id="add-card-dialog-close">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button type="submit" className="border-none">
                                                        Save
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
