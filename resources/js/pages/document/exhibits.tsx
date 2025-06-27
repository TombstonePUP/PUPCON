import type React from 'react';

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
import { DocumentViewer } from '@/components/ui/document-viewer';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exhibits',
        href: `/manage-exhibits`,
    },
];

// Mock data for exhibits
const mockExhibits = [
    {
        id: 1,
        title: 'Student Handbook',
        image: '/images/exhibits/student-handbook.png',
        file_path: '/sample-files/student-handbook.pdf',
    },
    {
        id: 2,
        title: 'Academic Catalog',
        image: '/images/exhibits/academic-catalog.png',
        file_path: '/sample-files/academic-catalog.pdf',
    },
    {
        id: 3,
        title: 'Faculty Manual',
        image: '/images/exhibits/faculty-manual.png',
        file_path: '/sample-files/faculty-manual.pdf',
    },
];

export default function ExhibitAdmin() {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedExhibit, setSelectedExhibit] = useState<any>(null);

    const handleAddExhibit = (e: React.FormEvent) => {
        e.preventDefault();
        setAddDialogOpen(false);
    };

    const handleEditExhibit = (e: React.FormEvent) => {
        e.preventDefault();
        setEditDialogOpen(false);
    };

    const handleDeleteExhibit = (id: number) => {
        // delete logic here
    };

    const handleViewExhibit = (exhibit: any) => {
        setSelectedExhibit(exhibit);
        setViewDialogOpen(true);
    };

    const handleEditClick = (exhibit: any) => {
        setSelectedExhibit(exhibit);
        setEditDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exhibits" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Exhibits Management</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage program exhibits and documentation</p>
                    </div>

                    {/* Add New Exhibit Dialog */}
                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant={'noborder'}>
                                <Plus className="h-4 w-4" />
                                Add New Exhibit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Exhibit</DialogTitle>
                                <DialogDescription>Please provide the exhibit title and upload an image and file.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddExhibit} className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Exhibit Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter exhibit title"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Exhibit Icon</label>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        required
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Exhibit File</label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        required
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" variant={'noborder'}>
                                        <Upload className="h-4 w-4" />
                                        Upload
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Exhibits Grid */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Available Exhibits</h2>
                        <p className="text-sm text-gray-600">Manage your program exhibits and documentation</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mockExhibits.map((exhibit) => (
                            <div
                                key={exhibit.id}
                                className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-lg"
                            >
                                <div className="flex aspect-video items-center justify-center ">
                                    <img
                                        src={exhibit.image || '/placeholder.svg?height=200&width=300'}
                                        alt={exhibit.title}
                                        className="h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="mb-2 font-semibold text-gray-900">{exhibit.title}</h3>
                                    <p className="mb-4 text-sm text-gray-600">Click to explore this interactive exhibit and discover its contents.</p>

                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleViewExhibit(exhibit)} className="flex-1">
                                            <Eye className="  h-4 w-4" />
                                            View
                                        </Button>
                                        <Button
                                            variant="noborder"
                                            size="sm"
                                            onClick={() => handleEditClick(exhibit)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteExhibit(exhibit.id)}
                                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View Exhibit Dialog using DocumentViewer */}
                <DocumentViewer
                    open={viewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    fileUrl={selectedExhibit?.file_path || ''}
                    title={selectedExhibit?.title || ''}
                />

                {/* Edit Exhibit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Exhibit</DialogTitle>
                            <DialogDescription>Modify exhibit details below.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditExhibit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Exhibit Title</label>
                                <input
                                    type="text"
                                    required
                                    defaultValue={selectedExhibit?.title}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Exhibit Icon</label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Exhibit File</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                />
                            </div>
                            <DialogFooter className="flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                    onClick={() => handleDeleteExhibit(selectedExhibit?.id)}
                                >
                                    Delete Exhibit
                                </Button>
                                <div className="flex gap-2">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" variant={'noborder'}>
                                        Save Changes
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
