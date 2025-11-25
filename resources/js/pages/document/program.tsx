import type React from 'react';
import { useRef, useState } from 'react';

import ProgramSection from '@/components/content/program/program-section';
import AreaDialog from '@/components/dialogs/content/programs/areas/area-dialog';
import DeleteAreaDialog from '@/components/dialogs/content/programs/areas/delete-area-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PerProgram, ProgramAreas } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Download, EditIcon, MoreVertical, Plus, Trash2 } from 'lucide-react';

export interface ProgramProps {
    program: PerProgram;
}

// --- Main Component ---
export default function Programs({ program }: ProgramProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;
    const assignedAreas = auth.user.areas;

    const selected_level = program.levels?.find((level) => level.areas) || program.levels?.[0];
    console.log('Selected Level:', selected_level);

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

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [selectedArea, setSelectedArea] = useState<ProgramAreas | null>(null);

    const addArea = () => {
        setDialogAction('add');
        setSelectedArea(null);
        setDialogOpen(true);
    };

    const editArea = (area: ProgramAreas) => {
        setDialogAction('edit');
        setSelectedArea(area);
        setDialogOpen(true);
    };

    const deleteArea = (area: ProgramAreas) => {
        setDialogAction('delete');
        setSelectedArea(area);
        setDialogOpen(true);
    };

    // ---  Level Selector ---
    const levelSelectorControls = (
        <div className="flex flex-row gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Badge variant="outline" className="w-full cursor-pointer justify-center border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                        {selected_level?.level === 0 ? 'Preliminary Survey Visit' : 'Accreditation Level ' + selected_level?.level}
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
                                {level.level === 0 ? 'Preliminary Survey Visit' : 'Level ' + level.level}{' '}
                                {level.survey_date && `- (${new Date(level.survey_date).getFullYear()})`}
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
                                <ProgramSection program={program} overviewRef={overviewRef} objectivesRef={objectivesRef} galleryRef={galleryRef} />
                            )}

                            {/* --- Program Areas Section --- */}
                            <div ref={areasRef} className="scroll-mt-20 rounded-lg border border-gray-200 bg-white p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Program Areas</h3>
                                        <p className="text-sm text-gray-600">
                                            Configure assessment areas for{' '}
                                            <span className="font-medium text-gray-800">
                                                {selected_level?.level === 0 ? 'Preliminary Survey Visit' : 'Level ' + selected_level?.level}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <Button className="border-none" size="sm" asChild>
                                            <a
                                                href={route('manage.program.download', {
                                                    program_name: program.program_link,
                                                    level_id: selected_level?.accreditation_level_id,
                                                })}
                                                className="flex items-center"
                                            >
                                                Download
                                                <Download className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
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
                                                    className="flex flex-col group relative rounded-xl border border-gray-200 bg-white transition-all duration-150 hover:border-gray-400"
                                                >
                                                    {isAssigned ? (
                                                        <Link
                                                            href={route('manage.area', {
                                                                program_name: program.program_link,
                                                                level_id: selected_level.accreditation_level_id,
                                                                area_id: item.area_id,
                                                            })}
                                                            className="block p-6"
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
                                                        <div className="block cursor-not-allowed p-6">
                                                            <div className="flex items-start justify-between">
                                                                <h4 className="text-base font-semibold text-gray-600">Area {item.area_numeral}</h4>
                                                                <Badge variant="outline" className="border-0 bg-gray-100 text-gray-700">
                                                                    Not Assigned
                                                                </Badge>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">{item.area_name}</p>
                                                        </div>
                                                    )}

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 hover:bg-gray-200"
                                                            >
                                                                <MoreVertical className="h-4 w-4 text-gray-600" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {(role === 'Admin' || role === 'Coordinator') &&
                                                                selected_level.is_active &&
                                                                selected_level.remarks !== 'Ongoing Survey' && (
                                                                    <DropdownMenuItem onClick={() => editArea(item)}>
                                                                        <EditIcon className="mr-2 h-4 w-4 text-gray-600" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                )}
                                                            <DropdownMenuItem asChild>
                                                                <a
                                                                    href={route('manage.area.download', {
                                                                        program_name: program.program_link,
                                                                        level_id: selected_level.accreditation_level_id,
                                                                        area_id: item.area_id,
                                                                    })}
                                                                    className="flex w-full"
                                                                >
                                                                    <Download className="mr-2 h-4 w-4 text-gray-600" />
                                                                    Download
                                                                </a>
                                                            </DropdownMenuItem>
                                                            {(role === 'Admin' || role === 'Coordinator') &&
                                                                selected_level.is_active &&
                                                                selected_level.remarks !== 'Ongoing Survey' && (
                                                                    <>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            className="text-red-600 hover:bg-red-50 hover:text-red-600"
                                                                            onClick={() => deleteArea(item)}
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
                                    {(role === 'Admin' || role === 'Coordinator') &&
                                        selected_level?.is_active &&
                                        selected_level?.remarks === 'Ongoing Survey' && (
                                            console.log(selected_level),
                                            <button
                                                type="button"
                                                onClick={addArea}
                                                className="group flex min-h-[100px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-5 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600"
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
            {dialogOpen && dialogAction !== 'delete' && (
                <AreaDialog type={dialogAction} area={selectedArea} program={program} level={selected_level} onClose={() => setDialogOpen(false)} />
            )}
            {dialogOpen && dialogAction === 'delete' && (
                <DeleteAreaDialog type="delete" area={selectedArea} program={program} level={selected_level} onClose={() => setDialogOpen(false)} />
            )}
        </AppLayout>
    );
}
