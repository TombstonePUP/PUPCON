import type React from 'react';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ImageUploader from '@/components/imageuploader';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PerProgram } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from "@/components/ui/badge"

export interface ProgramProps {
    program: PerProgram;
}

interface AreaForm {
    area_id?: number;
    area_number: string;
    area_name: string;
}

interface ObjectiveForm {
    objective_id?: number;
    objective_title: string;
    objective_description: string;
}

interface FacultyForm {
    faculty_id?: number;
    faculty_name: string;
    faculty_position: string;
    faculty_image?: File | null;
}

interface ProgramInfoForm {
    program_banner?: File | null;
    program_description: string;
}

interface GalleryForm {
    gallery_id?: number;
    gallery_image?: File | null;
    gallery_caption: string;
}

// Mock data - empty arrays to show blank state
const mockObjectives: any[] = [];
const mockGallery: any[] = [];
const mockFaculty: any[] = [];

export default function Programs({ program }: ProgramProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-program/${program.program_link}`,
        },
    ];

    // Area Form
    const {
        data: areaData,
        setData: setAreaData,
        post: postArea,
        put: putArea,
        delete: deleteArea,
        processing: processingArea,
        errors: errorsArea,
        reset: resetArea,
    } = useForm<AreaForm>({
        area_id: undefined,
        area_number: '',
        area_name: '',
    });

    // Program Info Form
    const {
        data: programInfoData,
        setData: setProgramInfoData,
        post: postProgramInfo,
        processing: processingProgramInfo,
        errors: errorsProgramInfo,
    } = useForm<ProgramInfoForm>({
        program_banner: null,
        program_description: '',
    });

    // Objectives Form
    const {
        data: objectiveData,
        setData: setObjectiveData,
        post: postObjective,
        put: putObjective,
        delete: deleteObjective,
        processing: processingObjective,
        errors: errorsObjective,
        reset: resetObjective,
    } = useForm<ObjectiveForm>({
        objective_id: undefined,
        objective_title: '',
        objective_description: '',
    });

    // Gallery Form
    const {
        data: galleryData,
        setData: setGalleryData,
        post: postGallery,
        delete: deleteGallery,
        processing: processingGallery,
        errors: errorsGallery,
        reset: resetGallery,
    } = useForm<GalleryForm>({
        gallery_id: undefined,
        gallery_image: null,
        gallery_caption: '',
    });

    // Faculty Form
    const {
        data: facultyData,
        setData: setFacultyData,
        post: postFaculty,
        put: putFaculty,
        delete: deleteFaculty,
        processing: processingFaculty,
        errors: errorsFaculty,
        reset: resetFaculty,
    } = useForm<FacultyForm>({
        faculty_id: undefined,
        faculty_name: '',
        faculty_position: '',
        faculty_image: null,
    });

    const [objectiveDialogOpen, setObjectiveDialogOpen] = useState(false);
    const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
    const [facultyDialogOpen, setFacultyDialogOpen] = useState(false);
    const [editingObjective, setEditingObjective] = useState<any>(null);
    const [editingFaculty, setEditingFaculty] = useState<any>(null);
    const [areaDialogOpen, setAreaDialogOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<any>(null);

    // Area Handlers
    const addArea = (e: React.FormEvent) => {
        e.preventDefault();
        postArea(`/manage-program/${program.program_id}/areas`, {
            onSuccess: () => {
                resetArea();
                setAreaDialogOpen(false);
            },
        });
    };

    const updateArea = (e: React.FormEvent) => {
        e.preventDefault();
        putArea(`/manage-program/${program.program_id}/areas/${areaData.area_id}`, {
            onSuccess: () => {
                resetArea();
                setAreaDialogOpen(false);
                setEditingArea(null);
            },
        });
    };

    const handleEditArea = (area: any) => {
        setEditingArea(area);
        setAreaData({
            area_id: area.id,
            area_number: area.area_number,
            area_name: area.area_name,
        });
        setAreaDialogOpen(true);
    };

    const handleDeleteArea = (id: number) => {
        deleteArea(`/manage-program/${program.program_id}/areas/${id}`);
    };


    // Program Info Handlers
    const submitProgramInfo = (e: React.FormEvent) => {
        e.preventDefault();
        postProgramInfo(`/manage-program/${program.program_id}/info`);
    };

    // Objective Handlers
    const addObjective = (e: React.FormEvent) => {
        e.preventDefault();
        postObjective(`/manage-program/${program.program_id}/objectives`, {
            onSuccess: () => {
                resetObjective();
                setObjectiveDialogOpen(false);
            },
        });
    };

    const updateObjective = (e: React.FormEvent) => {
        e.preventDefault();
        putObjective(`/manage-program/${program.program_id}/objectives/${objectiveData.objective_id}`, {
            onSuccess: () => {
                resetObjective();
                setObjectiveDialogOpen(false);
                setEditingObjective(null);
            },
        });
    };

    const handleEditObjective = (objective: any) => {
        setEditingObjective(objective);
        setObjectiveData({
            objective_id: objective.id,
            objective_title: objective.title,
            objective_description: objective.description,
        });
        setObjectiveDialogOpen(true);
    };

    // Gallery Handlers
    const addGalleryImage = (e: React.FormEvent) => {
        e.preventDefault();
        postGallery(`/manage-program/${program.program_id}/gallery`, {
            onSuccess: () => {
                resetGallery();
                setGalleryDialogOpen(false);
            },
        });
    };

    // Faculty Handlers
    const addFaculty = (e: React.FormEvent) => {
        e.preventDefault();
        postFaculty(`/manage-program/${program.program_id}/faculty`, {
            onSuccess: () => {
                resetFaculty();
                setFacultyDialogOpen(false);
            },
        });
    };

    const updateFaculty = (e: React.FormEvent) => {
        e.preventDefault();
        putFaculty(`/manage-program/${program.program_id}/faculty/${facultyData.faculty_id}`, {
            onSuccess: () => {
                resetFaculty();
                setFacultyDialogOpen(false);
                setEditingFaculty(null);
            },
        });
    };

    const handleEditFaculty = (faculty: any) => {
        setEditingFaculty(faculty);
        setFacultyData({
            faculty_id: faculty.id,
            faculty_name: faculty.name,
            faculty_position: faculty.position,
            faculty_image: null,
        });
        setFacultyDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${program.program_name} - Program Management`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}

                <Tabs
                    defaultValue={(role === "Admin" || role === "Coordinator") ? "content" : "documents"}
                    className="w-full flex-col gap-6"
                >
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {program.degree_type} in {program.program_name}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">Preliminary Survey Visit</p>
                            </div>
                            {/* Tabs Section */}
                            {(role === 'Admin' || role === 'Coordinator') && (
                                <TabsList className="mb-4">
                                    <TabsTrigger value="content">Content</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                </TabsList>
                            )}
                        </div>
                    </div>


                    {/* -------------------- Content Tab -------------------- */}
                    <TabsContent value="content" className="space-y-6">
                        <>
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Program Overview</h2>
                                    <p className="text-sm text-gray-600">Manage program banner and description</p>
                                </div>

                                <form onSubmit={submitProgramInfo} className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Program Banner</label>
                                        <ImageUploader
                                            onImageChange={(file) => setProgramInfoData('program_banner', file)}
                                            uploadText="Upload course banner"
                                            changeText="Change banner"
                                            maxSizeMB={10}
                                        />
                                        <InputError message={errorsProgramInfo.program_banner} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="program_description" className="mb-2 block text-sm font-medium text-gray-700">
                                            Program Description
                                        </label>
                                        <textarea
                                            id="program_description"
                                            required
                                            value={programInfoData.program_description}
                                            onChange={(e) => setProgramInfoData('program_description', e.target.value)}
                                            placeholder="Provide a detailed description of the program, its goals, and key features."
                                            className="min-h-[120px] w-full resize-y rounded-md border border-gray-300 p-4 text-sm transition-colors focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                        />
                                        <InputError message={errorsProgramInfo.program_description} className="mt-2" />
                                    </div>

                                    <div className="flex justify-end border-t border-gray-100 pt-4">
                                        <Button type="submit" disabled={processingProgramInfo} variant="noborder">
                                            Save Program Overview
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* Program Objectives */}
                                <div className="rounded-lg border border-gray-200 bg-white p-6">
                                    <div className="mb-6 flex justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">Program Objectives</h2>
                                            <p className="text-sm text-gray-600">Define learning outcomes and goals</p>
                                        </div>
                                        <Dialog open={objectiveDialogOpen} onOpenChange={setObjectiveDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                                                    onClick={() => {
                                                        setEditingObjective(null);
                                                        resetObjective();
                                                        setObjectiveDialogOpen(true);
                                                    }}
                                                >
                                                    Add Objective
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{editingObjective ? 'Edit Objective' : 'Add Program Objective'}</DialogTitle>
                                                    <DialogDescription>
                                                        {editingObjective ? 'Update the objective details' : 'Create a new learning objective'}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={editingObjective ? updateObjective : addObjective} className="space-y-4">
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Objective Title</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={objectiveData.objective_title}
                                                            onChange={(e) => setObjectiveData('objective_title', e.target.value)}
                                                            placeholder="e.g., Academic Excellence"
                                                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                        />
                                                        <InputError message={errorsObjective.objective_title} className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                                        <textarea
                                                            required
                                                            value={objectiveData.objective_description}
                                                            onChange={(e) => setObjectiveData('objective_description', e.target.value)}
                                                            placeholder="Describe the learning objective in detail..."
                                                            className="min-h-[80px] w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                        />
                                                        <InputError message={errorsObjective.objective_description} className="mt-1" />
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline" type="button">
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>
                                                        <Button
                                                            type="submit"
                                                            disabled={processingObjective}
                                                            variant="noborder"
                                                        >
                                                            {editingObjective ? 'Update' : 'Add'} Objective
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {mockObjectives.length > 0 ? (
                                        <div className="max-h-[400px] min-h-[200px] overflow-y-auto rounded border border-gray-200 bg-gray-50 p-4">
                                            <div className="space-y-3">
                                                {mockObjectives.map((objective) => (
                                                    <div key={objective.id} className="rounded border border-gray-300 bg-white p-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h5 className="mb-1 font-medium text-gray-900">{objective.title}</h5>
                                                                <p className="text-sm text-gray-600">{objective.description}</p>
                                                            </div>
                                                            <div className="ml-2 flex gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditObjective(objective)}
                                                                    className="h-6 w-6 p-0 text-[#7f1414] hover:bg-red-50"
                                                                >
                                                                    <Edit className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        deleteObjective(`/manage-program/${program.program_id}/objectives/${objective.id}`)
                                                                    }
                                                                    className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[200px] items-center justify-center rounded border border-gray-200 bg-gray-50 p-4">
                                            <p className="text-center text-gray-500">No objectives added yet</p>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-white p-6">
                                    <div className="mb-6 flex justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">Gallery of Excellence</h2>
                                            <p className="text-sm text-gray-600">Showcase program facilities and activities</p>
                                        </div>      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                                                    onClick={() => {
                                                        resetGallery();
                                                        setGalleryDialogOpen(true);
                                                    }}
                                                >
                                                    Add Image
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Gallery Image</DialogTitle>
                                                    <DialogDescription>Upload an image to the program gallery</DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={addGalleryImage} className="space-y-4">
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            required
                                                            onChange={(e) => setGalleryData('gallery_image', e.target.files ? e.target.files[0] : null)}
                                                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                        />
                                                        <InputError message={errorsGallery.gallery_image} className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Caption</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={galleryData.gallery_caption}
                                                            onChange={(e) => setGalleryData('gallery_caption', e.target.value)}
                                                            placeholder="Image caption"
                                                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                        />
                                                        <InputError message={errorsGallery.gallery_caption} className="mt-1" />
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline" type="button">
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>
                                                        <Button type="submit" disabled={processingGallery} variant="noborder">
                                                            Add Image
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {mockGallery.length > 0 ? (
                                        <div className="grid min-h-[200px] grid-cols-3 gap-4">
                                            {mockGallery.map((item) => (
                                                <div key={item.id} className="group relative">
                                                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
                                                        <img
                                                            src={item.image || '/placeholder.svg?height=150&width=150'}
                                                            alt={item.caption}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded bg-black opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteGallery(`/manage-program/${program.program_id}/gallery/${item.id}`)}
                                                            className="rounded text-white hover:bg-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[200px] items-center justify-center rounded border border-gray-200 bg-gray-50">
                                            <p className="text-center text-gray-500">No images uploaded yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <div className="mb-6 flex justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Faculty Members</h2>
                                        <p className="text-sm text-gray-600">Manage program faculty and staff</p>
                                    </div>  <Dialog open={facultyDialogOpen} onOpenChange={setFacultyDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                                                onClick={() => {
                                                    setEditingFaculty(null);
                                                    resetFaculty();
                                                    setFacultyDialogOpen(true);
                                                }}
                                            >
                                                Add Faculty
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>{editingFaculty ? 'Edit Faculty Member' : 'Add Faculty Member'}</DialogTitle>
                                                <DialogDescription>
                                                    {editingFaculty ? 'Update faculty member details' : 'Add a new faculty member'}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={editingFaculty ? updateFaculty : addFaculty} className="space-y-4">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={facultyData.faculty_name}
                                                        onChange={(e) => setFacultyData('faculty_name', e.target.value)}
                                                        placeholder="e.g., Dr. John Smith"
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                    />
                                                    <InputError message={errorsFaculty.faculty_name} className="mt-1" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Position</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={facultyData.faculty_position}
                                                        onChange={(e) => setFacultyData('faculty_position', e.target.value)}
                                                        placeholder="e.g., Professor, Associate Professor"
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                    />
                                                    <InputError message={errorsFaculty.faculty_position} className="mt-1" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Faculty Picture</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setFacultyData('faculty_image', e.target.files ? e.target.files[0] : null)}
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                    />
                                                    <InputError message={errorsFaculty.faculty_image} className="mt-1" />
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline" type="button">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button type="submit" disabled={processingFaculty} variant="noborder">
                                                        {editingFaculty ? 'Update' : 'Add'} Faculty
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {mockFaculty.length > 0 ? (
                                    <div className="grid min-h-[300px] grid-cols-1 gap-4 md:grid-cols-4">
                                        {mockFaculty.map((faculty) => (
                                            <div key={faculty.id} className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                                    <img
                                                        src={faculty.image || '/placeholder.svg?height=120&width=120'}
                                                        alt={faculty.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <h5 className="mb-1 font-medium text-gray-900">{faculty.name}</h5>
                                                    <p className="text-sm text-gray-600">{faculty.position}</p>
                                                </div>
                                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditFaculty(faculty)}
                                                        className="h-6 w-6 rounded bg-white p-0 text-[#7f1414] shadow hover:bg-red-50"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteFaculty(`/manage-program/${program.program_id}/faculty/${faculty.id}`)}
                                                        className="h-6 w-6 rounded bg-white p-0 text-red-600 shadow hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[300px] items-center justify-center rounded border border-gray-200 bg-gray-50">
                                        <p className="text-center text-gray-500">No faculty members added yet</p>
                                    </div>
                                )}
                            </div>
                        </>
                    </TabsContent>
                    {/* -------------------- Documents Tab -------------------- */}
                    <TabsContent value="documents" className="space-y-6">
                        {/* Areas Section moved here */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Program Areas</h3>
                                <p className="text-sm text-gray-600">Configure assessment areas for this program</p>
                            </div>

                            {/* --- Inline Area Grid (formerly EditableGrid) --- */}
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {program.areas && program.areas.length > 0 ? (
                                        program.areas.map((item: any) => (
                                            <div
                                                key={item.id}
                                                className="group relative rounded border p-7 border-[#7f1414]/20 hover:border-[#7f1414] hover:text-[#7f1414] transition duration-200 cursor-pointer"
                                            >
                                                <a
                                                    href={route('manage.area', {
                                                        program_name: program.program_link,
                                                        area_id: item.area_id || item.id,
                                                    })}
                                                >
                                                    <h1 className="font-bold">{item.area_numeral}</h1>
                                                    <p className="text-[#858585] w-full justify-between flex mt-2 gap-1">{item.area_name}
                                                        {(role !== 'Admin' && role !== 'Coordinator') && (
                                                            // <Badge variant="outline">
                                                            //     Assigned
                                                            // </Badge> 
                                                            <Badge variant="outline" className='bg-green-100 text-green-800 border-0'>
                                                                Assigned
                                                            </Badge>
                                                        )}
                                                    </p>
                                                    <div className=''>

                                                    </div>
                                                </a>
                                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    {/* Edit button */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 rounded-full p-0 hover:bg-gray-200"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogTitle>Edit Area</DialogTitle>
                                                            <DialogDescription>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Area Number
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={item.area_number}
                                                                            className="mt-1 w-full rounded border p-2"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Area Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={item.area_name}
                                                                            className="mt-1 w-full rounded border p-2"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter className="mt-2 gap-2">
                                                                    <DialogClose asChild>
                                                                        <Button variant="secondary">Cancel</Button>
                                                                    </DialogClose>
                                                                    <Button variant="noborder">Save</Button>
                                                                </DialogFooter>
                                                            </DialogDescription>
                                                        </DialogContent>
                                                    </Dialog>

                                                    {/* Delete button */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                className="h-8 w-8 rounded-full p-0 border-none"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogTitle>Are you sure?</DialogTitle>
                                                            <DialogDescription>
                                                                This will permanently remove this area.
                                                            </DialogDescription>
                                                            <DialogFooter className="gap-2">
                                                                <DialogClose asChild>
                                                                    <Button variant="secondary">Cancel</Button>
                                                                </DialogClose>
                                                                <Button variant="destructive">Remove</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 flex min-h-[200px] items-center justify-center rounded border border-gray-200 bg-gray-50">
                                            <p className="text-center text-gray-500">No areas added yet</p>
                                        </div>
                                    )}

                                    {/* Add New Area */}
                                    {(role === 'Admin' || role === 'Coordinator') && (
                                        <div className="col-span-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="flex h-[8vw] w-full cursor-pointer flex-col rounded border border-dashed transition-colors duration-300 hover:bg-gray-50"
                                                    >
                                                        <Plus />
                                                        <h1 className="text-[#B4B4B4]">Add Area</h1>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>Add Area</DialogTitle>
                                                    <DialogDescription>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Area Number</label>
                                                                <input
                                                                    type="text"
                                                                    className="mt-1 w-full rounded border p-2"
                                                                    placeholder="Enter area number"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Area Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="mt-1 w-full rounded border p-2"
                                                                    placeholder="Enter area name"
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter className="mt-2 gap-2">
                                                            <DialogClose asChild>
                                                                <Button variant="secondary">Cancel</Button>
                                                            </DialogClose>
                                                            <Button variant="noborder">Add Area</Button>
                                                        </DialogFooter>
                                                    </DialogDescription>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout >
    );
}
