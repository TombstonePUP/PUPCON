import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import ImageUploader from '@/components/imageuploader';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, GalleryImage, PerProgram, ProgramObjective } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';

const MOCK_OBJECTIVES: ProgramObjective[] = [
    {
        id: 1,
        title: 'Core Competency',
        description:
            'Develop and apply core competencies in information technology, including programming, database management, and network systems.',
    },
    {
        id: 2,
        title: 'Critical Thinking',
        description: 'Foster critical thinking and problem-solving skills to analyze complex technical challenges and propose innovative solutions.',
    },
    {
        id: 3,
        title: 'Ethical Practice',
        description: 'Instill a strong sense of professional ethics and responsibility in the development and use of technology.',
    },
];

const MOCK_GALLERY: GalleryImage[] = [
    { id: 1, caption: 'State-of-the-art Computer Lab', image_url: '/images/placeholder-image.png' },
    { id: 2, caption: 'Collaborative Study Area', image_url: '/images/placeholder-image.png' },
    { id: 3, caption: 'Networking Hub', image_url: '/images/placeholder-image.png' },
];

const MOCK_AREAS = [
    { id: 101, area_id: 101, area_numeral: 'I', area_name: 'Vision, Mission, Goals, and Objectives' },
    { id: 102, area_id: 102, area_numeral: 'II', area_name: 'Faculty' },
    { id: 103, area_id: 103, area_numeral: 'III', area_name: 'Curriculum and Instruction' },
];

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
interface GalleryForm {
    gallery_id?: number;
    gallery_caption: string;
    gallery_image?: File | null;
    previewUrl?: string | null; //alisin
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-gray-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

const ImageDisplay: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
    const [hasError, setHasError] = useState(false);
    useEffect(() => setHasError(false), [url]);

    if (!url || hasError) {
        return (
            <div className="animate-in fade-in-0 flex h-64 w-full flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-500">
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }
    return (
        <img
            src={url}
            alt={alt}
            className="animate-in fade-in-0 h-64 w-full rounded-md border border-gray-200 bg-gray-100 object-cover"
            onError={() => setHasError(true)}
        />
    );
};

// --- Main Component ---
export default function Programs({ program }: ProgramProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;

    const selected_level = program.levels?.find((level) => level.areas) || program.levels?.[0];

    const mockProgramData = {
        program_description:
            'This is the populated program description. It shows how the text area will look when filled with content from the database, demonstrating line wrapping and spacing.',
        program_banner_url: '/images/placeholder-banner.png',
        objectives: MOCK_OBJECTIVES,
        gallery_images: MOCK_GALLERY,
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/manage-programs' },
        { title: program.program_name, href: `/manage-program/${program.program_link}` },
    ];

    const [activeSection, setActiveSection] = useState(role === 'Admin' || role === 'Coordinator' ? 'overview' : 'areas');
    const overviewRef = useRef<HTMLDivElement>(null);
    const objectivesRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const areasRef = useRef<HTMLDivElement>(null);

    const allSections = [
        { id: 'overview', label: 'Program Overview', ref: overviewRef, roles: ['Admin', 'Coordinator'] },
        { id: 'objectives', label: 'Program Objectives', ref: objectivesRef, roles: ['Admin', 'Coordinator'] },
        { id: 'gallery', label: 'Gallery', ref: galleryRef, roles: ['Admin', 'Coordinator'] },
        { id: 'areas', label: 'Program Areas', ref: areasRef, roles: ['Admin', 'Coordinator', 'Accreditor'] },
    ];
    const sections = allSections.filter((section) => section.roles.includes(role));

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>, sectionId: string) => {
        setActiveSection(sectionId);
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // --- Form for Program Areas ---
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

    const [objectiveDialogOpen, setObjectiveDialogOpen] = useState(false);
    const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
    const [areaDialogOpen, setAreaDialogOpen] = useState(false);
    const [areaDeleteOpen, setAreaDeleteOpen] = useState(false);
    const [objectiveDeleteOpen, setObjectiveDeleteOpen] = useState(false);
    const [galleryDeleteOpen, setGalleryDeleteOpen] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [areaToDelete, setAreaToDelete] = useState<number | null>(null);

    const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | undefined>(mockProgramData.objectives[0]?.id);
    const [selectedGalleryId, setSelectedGalleryId] = useState<number | undefined>(mockProgramData.gallery_images[0]?.id);

    const selectedObjective = mockProgramData.objectives.find((o) => o.id === selectedObjectiveId);
    const selectedGalleryItem = mockProgramData.gallery_images.find((g) => g.id === selectedGalleryId);

    const addArea = (e: React.FormEvent) => {
        e.preventDefault();
        postArea(route('manage.program.areas.store', program.program_id), {
            preserveState: true,
            onSuccess: () => {
                resetArea();
                setAreaDialogOpen(false);
            },
        });
    };
    const updateArea = (e: React.FormEvent) => {
        e.preventDefault();
        putArea(route('manage.program.areas.update', { program_id: program.program_id, area_id: areaData.area_id }), {
            preserveState: true,
            onSuccess: () => {
                resetArea();
                setAreaDialogOpen(false);
            },
        });
    };
    const openEditAreaDialog = (area: any) => {
        setAreaData({ area_id: area.area_id || area.id, area_number: area.area_numeral || area.area_number, area_name: area.area_name });
        setAreaDialogOpen(true);
    };
    const openAddAreaDialog = () => {
        resetArea();
        setAreaDialogOpen(true);
    };
    const openDeleteAreaDialog = (id: number) => {
        setAreaToDelete(id);
        setAreaDeleteOpen(true);
    };
    const handleDeleteArea = () => {
        if (areaToDelete) {
            deleteArea(route('manage.program.areas.destroy', { program_id: program.program_id, area_id: areaToDelete }), {
                preserveState: true,
                onSuccess: () => {
                    setAreaDeleteOpen(false);
                    setAreaToDelete(null);
                },
            });
        }
    };

    const openObjectiveDialog = (isEdit: boolean) => {
        setIsEditMode(isEdit);
        setObjectiveDialogOpen(true);
    };
    const openDeleteObjectiveDialog = () => {
        setObjectiveDeleteOpen(true);
    };

    const openGalleryDialog = (isEdit: boolean) => {
        setIsEditMode(isEdit);
        setGalleryDialogOpen(true);
    };
    const openDeleteGalleryDialog = () => {
        setGalleryDeleteOpen(true);
    };

    // ---  Level Selector ---
    const levelSelectorControls = (
        <div className="flex flex-row gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Badge variant="outline" className="w-full cursor-pointer justify-center border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                        {selected_level?.level === 1 ? 'Preliminary Survey Visit' : 'Accreditation Level ' + selected_level?.level}
                    </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Level</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={selected_level?.accreditation_level_id?.toString()}>
                        {program.levels?.map((level) => (
                            <DropdownMenuRadioItem
                                key={level.accreditation_level_id}
                                value={level.accreditation_level_id.toString()}
                                onClick={() =>
                                    router.visit(
                                        route('manage.program', {
                                            program_name: program.program_link,
                                            level_id: level.accreditation_level_id,
                                        }),
                                    )
                                }
                            >
                                {level.level === 1 ? 'Preliminary Survey Visit' : 'Level ' + level.level}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${program.program_name} - Program Management`} />
            <div className="flex flex-col gap-6 p-6">
                {/* Header Section (unchanged) */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    {/* ... (Header content) ... */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 ml-2">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    {program.degree_type} in {program.program_name}
                                </h1>
                                <p className="text-sm text-gray-500">Manage program information, objectives, and assessment areas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="space-y-6">
                            {/* --- Program Info, Objectives, and Gallery Section--- */}
                            {(role === 'Admin' || role === 'Coordinator') && (
                                <div ref={overviewRef} className="scroll-mt-20 rounded-lg border border-gray-200 bg-white">
                                    <div className="p-8">
                                        {/* --- Program Overview --- */}
                                        <div className="">
                                            <div className="mb-6">
                                                <h2 className="text-lg font-semibold text-gray-900">Program Overview</h2>
                                                <p className="text-sm text-gray-600">Manage program banner and description</p>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Program Banner</Label>
                                                    <ImageUploader
                                                        initialImage={mockProgramData.program_banner_url}
                                                        placeholderImage="/images/placeholder-banner.png"
                                                        onImageChange={() => {}}
                                                        uploadText="Upload course banner"
                                                        changeText="Change banner"
                                                        maxSizeMB={10}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="program_description" className="mb-2 block text-sm font-medium text-gray-700">
                                                        Program Description
                                                    </Label>
                                                    <Textarea
                                                        id="program_description"
                                                        required
                                                        defaultValue={mockProgramData.program_description}
                                                        onChange={() => {}}
                                                        placeholder="Provide a detailed description of the program..."
                                                        autoResize
                                                        minHeight={120}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-10 bg-gray-200" />

                                        {/* --- Program Objectives --- */}
                                        <div ref={objectivesRef} className="scroll-mt-20">
                                            <div className="mb-6">
                                                <h2 className="text-lg font-semibold text-gray-900">Program Objectives</h2>
                                                <p className="text-sm text-gray-600">Define learning outcomes and goals</p>
                                            </div>
                                            <div className="flex min-h-[300px] rounded-lg border border-gray-200">
                                                <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-4">
                                                    <h4 className="mb-3 text-xs text-gray-500">Select an Objective</h4>
                                                    <div className="max-h-[250px] space-y-1 overflow-y-auto">
                                                        {mockProgramData.objectives.length === 0 ? (
                                                            <div className="flex h-[100px] items-center justify-center">
                                                                <p className="text-center text-sm text-gray-500">No objectives added.</p>
                                                            </div>
                                                        ) : (
                                                            mockProgramData.objectives.map((objective) => (
                                                                <div
                                                                    key={objective.id}
                                                                    onClick={() => setSelectedObjectiveId(objective.id)}
                                                                    className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                                                        objective.id === selectedObjectiveId
                                                                            ? 'bg-[#7f1414]/4 text-[#7f1414]'
                                                                            : 'text-gray-700 hover:bg-[#7f1414]/4'
                                                                    }`}
                                                                >
                                                                    <span className="truncate text-sm">{objective.title}</span>
                                                                    <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                                                                        <ActionButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openObjectiveDialog(true);
                                                                            }}
                                                                        >
                                                                            <EditIcon className="h-4 w-4" />
                                                                        </ActionButton>
                                                                        <ActionButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openDeleteObjectiveDialog();
                                                                            }}
                                                                            className="hover:bg-[#7f1414]/4"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </ActionButton>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                                        <Button onClick={() => openObjectiveDialog(false)} variant="default" className="w-full">
                                                            <Plus className="mr-2 h-4 w-4" /> Add Objective
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="w-2/3 p-6">
                                                    {selectedObjective ? (
                                                        <div className="space-y-4">
                                                            <h4 className="text-lg font-semibold break-words text-gray-900">
                                                                {selectedObjective.title}
                                                            </h4>
                                                            <Separator />
                                                            <h5 className="mb-2 text-sm font-semibold text-gray-700">Description</h5>
                                                            <p className="text-sm whitespace-pre-wrap text-gray-700">
                                                                {selectedObjective.description}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                                            <X className="mb-2 h-8 w-8" />
                                                            <p className="font-medium">No Objective Selected</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-10 bg-gray-200" />

                                        {/* --- Gallery --- */}
                                        <div ref={galleryRef} className="scroll-mt-20">
                                            <div className="mb-6">
                                                <h2 className="text-lg font-semibold text-gray-900">Gallery of Excellence</h2>
                                                <p className="text-sm text-gray-600">Showcase program facilities and activities</p>
                                            </div>
                                            <div className="flex min-h-[300px] rounded-lg border border-gray-200">
                                                <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-4">
                                                    <h4 className="mb-3 text-xs text-gray-500">Select an Image</h4>
                                                    <div className="max-h-[250px] space-y-1 overflow-y-auto">
                                                        {mockProgramData.gallery_images.length === 0 ? (
                                                            <div className="flex h-[100px] items-center justify-center">
                                                                <p className="text-center text-sm text-gray-500">No images added.</p>
                                                            </div>
                                                        ) : (
                                                            mockProgramData.gallery_images.map((item) => (
                                                                <div
                                                                    key={item.id}
                                                                    onClick={() => setSelectedGalleryId(item.id)}
                                                                    className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                                                        item.id === selectedGalleryId
                                                                            ? 'bg-[#7f1414]/4 text-[#7f1414]'
                                                                            : 'text-gray-700 hover:bg-[#7f1414]/4'
                                                                    }`}
                                                                >
                                                                    <span className="truncate text-sm">{item.caption}</span>
                                                                    <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                                                                        <ActionButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openGalleryDialog(true);
                                                                            }}
                                                                        >
                                                                            <EditIcon className="h-4 w-4" />
                                                                        </ActionButton>
                                                                        <ActionButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openDeleteGalleryDialog();
                                                                            }}
                                                                            className="hover:text-red-600"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </ActionButton>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                                        <Button onClick={() => openGalleryDialog(false)} variant="default" className="w-full">
                                                            <Plus className="mr-2 h-4 w-4" /> Add Image
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="w-2/3 p-6">
                                                    {selectedGalleryItem ? (
                                                        <div className="space-y-4">
                                                            <ImageDisplay url={selectedGalleryItem.image_url} alt={selectedGalleryItem.caption} />
                                                            <h5 className="text-gray-70fs-auto0 mb-1 text-sm font-semibold">Caption</h5>
                                                            <p className="text-sm text-gray-900">{selectedGalleryItem.caption}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                                            <X className="mb-2 h-8 w-8" />
                                                            <p className="font-medium">No Image Selected</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <SectionFooter onSave={() => alert('Simulating Save...')} />
                                </div>
                            )}

                            {/* --- Program Areas Section --- */}
                            <div ref={areasRef} className="scroll-mt-20 rounded-lg border border-gray-200 bg-white p-8">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Program Areas</h3>
                                    <p className="text-sm text-gray-600">
                                        Configure assessment areas for{' '}
                                        <span className="font-medium text-gray-800">
                                            {selected_level?.level === 1 ? 'Preliminary Survey Visit' : 'Level ' + selected_level?.level}
                                        </span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {selected_level?.areas && selected_level?.areas.length > 0 ? (
                                        selected_level?.areas.map((item: any) => (
                                            <div
                                                key={item.id}
                                                className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all duration-150 hover:border-gray-300 hover:shadow-sm"
                                            >
                                                <a
                                                    href={route('manage.area', {
                                                        program_name: program.program_link,
                                                        level_id: selected_level.accreditation_level_id,
                                                        area_id: item.area_id || item.id,
                                                    })}
                                                    className="block"
                                                >
                                                    <h4 className="text-base font-semibold text-gray-900">Area {item.area_numeral}</h4>
                                                    <p className="mt-1 flex w-full justify-between gap-1 text-sm text-gray-600">{item.area_name}</p>
                                                    {role !== 'Admin' && role !== 'Coordinator' && (
                                                        <Badge variant="outline" className="mt-3 border-0 bg-green-100 text-green-800">
                                                            Assigned
                                                        </Badge>
                                                    )}
                                                </a>

                                                {(role === 'Admin' || role === 'Coordinator') && (
                                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-full p-0 hover:bg-gray-200"
                                                            onClick={() => openEditAreaDialog(item)}
                                                        >
                                                            <EditIcon className="h-4 w-4 text-gray-600" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-full p-0 text-red-600 hover:bg-red-50 hover:text-red-600"
                                                            onClick={() => openDeleteAreaDialog(item.area_id || item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 md:col-span-2">
                                            <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
                                                <p className="text-center text-sm text-gray-500">No areas added yet for this level.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Add New Area Card */}
                                    {(role === 'Admin' || role === 'Coordinator') && (
                                        <button
                                            type="button"
                                            onClick={openAddAreaDialog}
                                            className="group flex min-h-[120px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-5 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                        >
                                            <Plus className="h-6 w-6" />
                                            <span className="mt-2 text-sm font-medium">Add New Area</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Sidebar  --- */}
                    <div className="w-64 shrink-0">
                        <div className="sticky top-6 space-y-4">
                            {/* --- Level Selector --- */}
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Accreditation Level</h3>
                                {levelSelectorControls}
                            </div>

                            {/* Quick Links */}
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick Links</h3>
                                <nav className="space-y-1">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.ref, section.id)}
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                                                activeSection === section.id ? 'bg-[#7f1414] text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {section.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DIALOGS --- */}

            {/*  Objective Dialog */}
            <ObjectiveDialog
                isOpen={objectiveDialogOpen}
                onClose={() => setObjectiveDialogOpen(false)}
                onSave={() => setObjectiveDialogOpen(false)}
                isEdit={isEditMode}
                objective={isEditMode ? selectedObjective : undefined}
            />

            {/* Gallery Dialog */}
            <GalleryDialog
                isOpen={galleryDialogOpen}
                onClose={() => setGalleryDialogOpen(false)}
                onSave={() => setGalleryDialogOpen(false)}
                isEdit={isEditMode}
                galleryItem={isEditMode ? selectedGalleryItem : undefined}
            />

            {/* Area Dialogs */}
            <Dialog open={areaDialogOpen} onOpenChange={setAreaDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{areaData.area_id ? 'Edit Area' : 'Add New Area'}</DialogTitle>
                        <DialogDescription>
                            Adding to:{' '}
                            <span className="font-medium text-[#7f1414]">
                                {selected_level?.level === 1 ? 'Preliminary Survey Visit' : 'Level ' + selected_level?.level}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={areaData.area_id ? updateArea : addArea} className="space-y-4">
                        <div>
                            <Label>Area Number (e.g., "I", "V")</Label>
                            <Input
                                type="text"
                                required
                                value={areaData.area_number}
                                onChange={(e) => setAreaData('area_number', e.target.value)}
                                placeholder="e.g., V"
                            />
                            <InputError message={errorsArea.area_number} className="mt-1" />
                        </div>
                        <div>
                            <Label>Area Name</Label>
                            <Input
                                type="text"
                                required
                                value={areaData.area_name}
                                onChange={(e) => setAreaData('area_name', e.target.value)}
                                placeholder="Enter area name"
                            />
                            <InputError message={errorsArea.area_name} className="mt-1" />
                        </div>
                        <DialogFooter className="mt-2 gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="noborder" disabled={processingArea}>
                                {areaData.area_id ? 'Save Changes' : 'Add Area'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={areaDeleteOpen} onOpenChange={setAreaDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Area?</DialogTitle>
                        <DialogDescription>This will permanently remove this area. This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteArea} disabled={processingArea}>
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ---  Delete Confirmation Dialogs --- */}
            <Dialog open={objectiveDeleteOpen} onOpenChange={setObjectiveDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Objective?</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this objective? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="default" onClick={() => setObjectiveDeleteOpen(false)}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={galleryDeleteOpen} onOpenChange={setGalleryDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Gallery Image?</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this image? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="default" onClick={() => setGalleryDeleteOpen(false)}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

// --- Re-usable  ---

interface ObjectiveDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void; // No data passed
    isEdit: boolean;
    objective: ProgramObjective | null | undefined;
}

function ObjectiveDialog({ isOpen, onClose, onSave, isEdit, objective }: ObjectiveDialogProps) {
    const data = objective || { title: '', description: '' };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Objective' : 'Add Program Objective'}</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                    className="space-y-4"
                >
                    <div>
                        <Label>Objective Title</Label>
                        <Input className='mt-2' type="text" required defaultValue={data.title} placeholder="e.g., Academic Excellence" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea className='mt-2' required defaultValue={data.description} placeholder="Describe the learning objective..." minHeight={80} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="noborder">
                            {isEdit ? 'Update' : 'Add'} Objective
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface GalleryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    isEdit: boolean;
    galleryItem: GalleryImage | null | undefined;
}

function GalleryDialog({ isOpen, onClose, onSave, isEdit, galleryItem }: GalleryDialogProps) {
    const data = galleryItem || { caption: '', image_url: '' };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Gallery Image' : 'Add Gallery Image'}</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                    className="space-y-4"
                >
                    <div>
                        <ImageUploader initialImage={data.image_url} placeholderImage="/images/placeholder-image.png" onImageChange={() => {}} />
                    </div>
                    <div>
                        <Label>Caption</Label>
                        <Input className='mt-2' type="text" required defaultValue={data.caption} placeholder="Image caption" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="noborder">
                            {isEdit ? 'Update Image' : 'Add Image'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
