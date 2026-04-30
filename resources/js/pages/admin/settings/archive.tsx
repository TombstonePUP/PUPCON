'use client';
import HeadingSmall from '@/components/heading-small';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/admin/app-layout';
import SettingsLayout from '@/layouts/admin/settings/layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    BookOpen,
    Calendar,
    Download,
    Eye,
    FileText,
    ImageIcon,
    MoreHorizontal,
    RotateCcw,
    Search,
    Settings,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Archive',
        href: '/settings/archive',
    },
];

// Mock archived data
const archivedItems = {
    documents: [
        {
            id: 1,
            title: 'Student Handbook 2023',
            type: 'PDF',
            size: '2.4 MB',
            archivedDate: '2024-01-15',
            archivedBy: 'John Doe',
            originalLocation: 'Document Requests',
            category: 'Handbook',
        },
        {
            id: 2,
            title: 'Academic Catalog',
            type: 'PDF',
            size: '5.1 MB',
            archivedDate: '2024-01-10',
            archivedBy: 'Jane Smith',
            originalLocation: 'Document Requests',
            category: 'Catalog',
        },
        {
            id: 3,
            title: 'Faculty Manual 2023',
            type: 'PDF',
            size: '3.2 MB',
            archivedDate: '2024-01-08',
            archivedBy: 'Admin User',
            originalLocation: 'Document Requests',
            category: 'Manual',
        },
    ],
    programs: [
        {
            id: 1,
            name: 'Computer Science (Old Curriculum)',
            degreeType: 'Bachelor Science',
            archivedDate: '2023-12-20',
            archivedBy: 'Admin User',
            areas: 8,
            students: 45,
        },
        {
            id: 2,
            name: 'Business Administration (2022)',
            degreeType: 'Bachelor Science',
            archivedDate: '2023-11-15',
            archivedBy: 'Program Head',
            areas: 6,
            students: 32,
        },
    ],
    exhibits: [
        {
            id: 1,
            title: 'Virtual Campus Tour (Old Version)',
            type: 'Interactive',
            archivedDate: '2024-01-05',
            archivedBy: 'Media Team',
            views: 1250,
            size: '15.2 MB',
        },
        {
            id: 2,
            title: 'Student Life Gallery 2023',
            type: 'Image Gallery',
            archivedDate: '2023-12-28',
            archivedBy: 'Content Manager',
            views: 890,
            size: '8.7 MB',
        },
    ],
    users: [
        {
            id: 1,
            name: 'Dr. Robert Johnson',
            email: 'r.johnson@pup.edu.ph',
            role: 'Faculty',
            archivedDate: '2023-12-01',
            archivedBy: 'HR Admin',
            lastActive: '2023-11-28',
        },
        {
            id: 2,
            name: 'Maria Santos',
            email: 'm.santos@pup.edu.ph',
            role: 'Staff',
            archivedDate: '2023-11-20',
            archivedBy: 'HR Admin',
            lastActive: '2023-11-15',
        },
    ],
    areas: [
        {
            id: 1,
            name: 'Mission, Goals and Objectives (Old)',
            program: 'Information Technology',
            parameters: 5,
            archivedDate: '2023-10-15',
            archivedBy: 'Area Coordinator',
        },
    ],
};

export default function ArchiveComponent() {
    const [activeTab, setActiveTab] = useState('documents');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [filterBy, setFilterBy] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const getItemCount = (category: string) => {
        return archivedItems[category as keyof typeof archivedItems]?.length || 0;
    };

    const handleSelectItem = (id: number) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const handleSelectAll = (items: { id: number }[]) => {
        const allIds = items.map((item) => item.id);
        setSelectedItems((prev) =>
            allIds.every((id) => prev.includes(id))
                ? prev.filter((id) => !allIds.includes(id))
                : [...prev, ...allIds.filter((id) => !prev.includes(id))],
        );
    };

    const handleRestore = () => {
        setSelectedItems([]);
    };

    const handlePermanentDelete = () => {
        setSelectedItems([]);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archive" />
            <SettingsLayout>
                <div className="w-300 space-y-6">
                    <HeadingSmall title="Archive Management" description="Manage archived content from all system modules" />

                    {/* Stats Overview */}
                    <div className="grid grid-cols-5 gap-3">
                        <div className="rounded-lg border bg-white p-3 text-center">
                            <div className="mb-1 flex items-center justify-center">
                                <FileText className="mr-1 h-4 w-4 text-[#7f1414]" />
                                <span className="text-xs font-medium text-gray-600">Documents</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">{getItemCount('documents')}</div>
                        </div>
                        <div className="rounded-lg border bg-white p-3 text-center">
                            <div className="mb-1 flex items-center justify-center">
                                <BookOpen className="mr-1 h-4 w-4 text-[#7f1414]" />
                                <span className="text-xs font-medium text-gray-600">Programs</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">{getItemCount('programs')}</div>
                        </div>
                        <div className="rounded-lg border bg-white p-3 text-center">
                            <div className="mb-1 flex items-center justify-center">
                                <ImageIcon className="mr-1 h-4 w-4 text-[#7f1414]" />
                                <span className="text-xs font-medium text-gray-600">Exhibits</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">{getItemCount('exhibits')}</div>
                        </div>
                        <div className="rounded-lg border bg-white p-3 text-center">
                            <div className="mb-1 flex items-center justify-center">
                                <Users className="mr-1 h-4 w-4 text-[#7f1414]" />
                                <span className="text-xs font-medium text-gray-600">Users</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">{getItemCount('users')}</div>
                        </div>
                        <div className="rounded-lg border bg-white p-3 text-center">
                            <div className="mb-1 flex items-center justify-center">
                                <Archive className="mr-1 h-4 w-4 text-[#7f1414]" />
                                <span className="text-xs font-medium text-gray-600">Areas</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">{getItemCount('areas')}</div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="rounded-lg border bg-white p-3">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search archived items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                />
                            </div>
                            <Select value={filterBy} onValueChange={setFilterBy}>
                                <SelectTrigger className="h-9 w-28">
                                    <SelectValue placeholder="All Items" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Items</SelectItem>
                                    <SelectItem value="recent">Recent</SelectItem>
                                    <SelectItem value="old">Older</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-9 w-20">
                                    <SelectValue placeholder="Date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="type">Type</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedItems.length > 0 && (
                        <div className="rounded-lg border border-[#7f1414]/20 bg-[#7f1414]/5 p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-[#7f1414]">
                                    {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRestore}
                                        className="h-8 border-green-300 bg-transparent text-green-700 hover:bg-green-50"
                                    >
                                        <RotateCcw className="mr-1 h-3 w-3" />
                                        Restore
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 border-red-300 bg-transparent text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="mr-1 h-3 w-3" />
                                                Delete
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                                    Confirm Permanent Deletion
                                                </DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. The selected {selectedItems.length} item
                                                    {selectedItems.length > 1 ? 's' : ''} will be permanently deleted.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline" size="sm">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button variant="destructive" size="sm" onClick={handlePermanentDelete}>
                                                    Delete Permanently
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Category Tabs */}
                    <div className="rounded-lg border bg-white">
                        <div className="border-b px-3 py-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setActiveTab('documents')}
                                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                        activeTab === 'documents' ? 'bg-[#7f1414] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <FileText className="h-3 w-3" />
                                    Documents ({getItemCount('documents')})
                                </button>
                                <button
                                    onClick={() => setActiveTab('programs')}
                                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                        activeTab === 'programs' ? 'bg-[#7f1414] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <BookOpen className="h-3 w-3" />
                                    Programs ({getItemCount('programs')})
                                </button>
                                <button
                                    onClick={() => setActiveTab('exhibits')}
                                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                        activeTab === 'exhibits' ? 'bg-[#7f1414] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <ImageIcon className="h-3 w-3" />
                                    Exhibits ({getItemCount('exhibits')})
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                        activeTab === 'users' ? 'bg-[#7f1414] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <Users className="h-3 w-3" />
                                    Users ({getItemCount('users')})
                                </button>
                                <button
                                    onClick={() => setActiveTab('areas')}
                                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                        activeTab === 'areas' ? 'bg-[#7f1414] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <Archive className="h-3 w-3" />
                                    Areas ({getItemCount('areas')})
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-3">
                            {/* Documents Tab */}
                            {activeTab === 'documents' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-foreground text-sm font-medium">Archived Documents</h3>
                                            <p className="text-xs text-gray-500">Manage archived documents and files</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handleSelectAll(archivedItems.documents)}>
                                            Select All
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {archivedItems.documents.map((doc) => (
                                            <div key={doc.id} className="group flex items-center gap-3 rounded-lg border p-2 hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(doc.id)}
                                                    onChange={() => handleSelectItem(doc.id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-[#7f1414] focus:ring-[#7f1414]"
                                                />
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7f1414]/10">
                                                    <FileText className="h-4 w-4 text-[#7f1414]" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-foreground truncate text-sm font-medium">{doc.title}</h4>
                                                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <Button variant="outline" size="sm" className="h-6 w-6 bg-transparent p-0">
                                                                <Eye className="h-3 w-3" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="h-6 w-6 bg-transparent p-0">
                                                                <Download className="h-3 w-3" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="h-6 w-6 bg-transparent p-0">
                                                                <MoreHorizontal className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                                        <span>
                                                            {doc.type} • {doc.size}
                                                        </span>
                                                        <span>From: {doc.originalLocation}</span>
                                                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{doc.category}</span>
                                                        <span className="ml-auto flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {doc.archivedDate}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Programs Tab */}
                            {activeTab === 'programs' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-foreground text-sm font-medium">Archived Programs</h3>
                                            <p className="text-xs text-gray-500">Manage archived academic programs</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handleSelectAll(archivedItems.programs)}>
                                            Select All
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {archivedItems.programs.map((program) => (
                                            <div key={program.id} className="group flex items-center gap-3 rounded-lg border p-2 hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(program.id)}
                                                    onChange={() => handleSelectItem(program.id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-[#7f1414] focus:ring-[#7f1414]"
                                                />
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7f1414]/10">
                                                    <BookOpen className="h-4 w-4 text-[#7f1414]" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-foreground truncate text-sm font-medium">{program.name}</h4>
                                                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <Button variant="outline" size="sm" className="h-6 w-6 bg-transparent p-0">
                                                                <Eye className="h-3 w-3" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="h-6 w-6 bg-transparent p-0">
                                                                <MoreHorizontal className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                                        <span className="rounded bg-[#7f1414]/10 px-1.5 py-0.5 text-xs font-medium text-[#7f1414]">
                                                            {program.degreeType}
                                                        </span>
                                                        <span>{program.areas} areas</span>
                                                        <span>{program.students} students</span>
                                                        <span className="ml-auto flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {program.archivedDate}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other tabs placeholder */}
                            {activeTab === 'exhibits' && (
                                <div className="py-6 text-center">
                                    <ImageIcon className="mx-auto mb-2 h-10 w-10 text-gray-400" />
                                    <h3 className="text-foreground mb-1 text-sm font-medium">Archived Exhibits</h3>
                                    <p className="text-xs text-gray-500">{getItemCount('exhibits')} exhibits archived</p>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="py-6 text-center">
                                    <Users className="mx-auto mb-2 h-10 w-10 text-gray-400" />
                                    <h3 className="text-foreground mb-1 text-sm font-medium">Archived Users</h3>
                                    <p className="text-xs text-gray-500">{getItemCount('users')} users archived</p>
                                </div>
                            )}

                            {activeTab === 'areas' && (
                                <div className="py-6 text-center">
                                    <Archive className="mx-auto mb-2 h-10 w-10 text-gray-400" />
                                    <h3 className="text-foreground mb-1 text-sm font-medium">Archived Areas</h3>
                                    <p className="text-xs text-gray-500">{getItemCount('areas')} areas archived</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Archive Settings */}
                    <div className="rounded-lg border bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="text-foreground text-sm font-medium">Archive Settings</h3>
                                <p className="text-xs text-gray-500">Configure retention and notification settings</p>
                            </div>
                            <Button variant="default" size="sm">
                                Save Settings
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center justify-between rounded-lg border p-2">
                                <div>
                                    <h4 className="text-foreground text-xs font-medium">Auto-delete after</h4>
                                    <p className="text-xs text-gray-500">Auto delete archived items</p>
                                </div>
                                <Select defaultValue="never">
                                    <SelectTrigger className="h-7 w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="never">Never</SelectItem>
                                        <SelectItem value="30">30d</SelectItem>
                                        <SelectItem value="90">90d</SelectItem>
                                        <SelectItem value="365">1y</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-2">
                                <div>
                                    <h4 className="text-foreground text-xs font-medium">Email notifications</h4>
                                    <p className="text-xs text-gray-500">Notify on archive actions</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-[#7f1414] focus:ring-[#7f1414]"
                                    defaultChecked
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
