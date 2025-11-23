import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PerProgram, ProgramAreas } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import ProgramSection from '@/components/content/program/program-section';

export interface ProgramProps {
    program: PerProgram;
}

interface AreaForm {
    area_id?: number;
    area_number: string;
    area_name: string;
}

// --- Main Component ---
export default function Programs({ program }: ProgramProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;
    const assignedAreas = auth.user.areas;

    const selected_level = program.levels?.find((level) => level.areas) || program.levels?.[0];

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
        { id: 'areas', label: 'Program Areas', ref: areasRef, roles: ['Admin', 'Coordinator', 'Chairman'] },
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

    const [areaDialogOpen, setAreaDialogOpen] = useState(false);
    const [areaDeleteOpen, setAreaDeleteOpen] = useState(false);
    const [areaToDelete, setAreaToDelete] = useState<number | null>(null);

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
                            <div className="ml-2 flex-1">
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
                                <ProgramSection
                                    program={program}
                                    overviewRef={overviewRef}
                                    objectivesRef={objectivesRef}
                                    galleryRef={galleryRef}
                                />
                            )}

                            {/* --- Program Areas Section --- */}
                            <div ref={areasRef} className="scroll-mt-20 rounded-lg border border-gray-200 bg-white p-8">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Program Areas</h3>
                                    <p className="text-sm text-gray-600">
                                        Configure assessment areas for{' '}
                                        <span className="font-medium text-gray-800">
                                            {selected_level?.level === 0 ? 'Preliminary Survey Visit' : 'Level ' + selected_level?.level}
                                        </span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {selected_level?.areas && selected_level?.areas.length > 0 ? (
                                        selected_level?.areas.map((item) => {
                                            const isAssigned =
                                                role !== 'Admin' && role !== 'Coordinator'
                                                    ? assignedAreas.find((area: ProgramAreas) => area.area_id === item.area_id)
                                                    : true;
                                            return (
                                                <div
                                                    key={item.area_id}
                                                    className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:border-gray-400"
                                                >
                                                    {isAssigned ? (
                                                        <Link
                                                            href={route('manage.area', {
                                                                program_name: program.program_link,
                                                                level_id: selected_level.accreditation_level_id,
                                                                area_id: item.area_id,
                                                            })}
                                                            className="block"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <h4 className="text-base font-semibold text-gray-900">Area {item.area_numeral}</h4>

                                                                {/* Badge (top-right) */}
                                                                {role !== 'Admin' && role !== 'Coordinator' && (
                                                                    <Badge variant="outline" className="border-0 bg-green-100 text-green-800">
                                                                        Assigned
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <p className="mt-1 text-sm text-gray-600">{item.area_name}</p>
                                                        </Link>
                                                    ) : (
                                                        <div className="block cursor-not-allowed opacity-50">
                                                            <div className="flex items-start justify-between">
                                                                <h4 className="text-base font-semibold text-gray-600">Area {item.area_numeral}</h4>
                                                                <Badge variant="outline" className="border-0 bg-red-100 text-red-700">
                                                                    Not Assigned
                                                                </Badge>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">{item.area_name}</p>
                                                        </div>
                                                    )}

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
                                                                onClick={() => openDeleteAreaDialog(item.area_id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
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
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${activeSection === section.id ? 'bg-[#7f1414] text-white' : 'text-gray-700 hover:bg-gray-100'
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
        </AppLayout>
    );
}
