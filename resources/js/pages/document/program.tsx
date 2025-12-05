import { useEffect, useMemo, useRef, useState } from 'react';

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
import { Archive, BookOpen, Download, EditIcon, MoreVertical, Plus, Trash2 } from 'lucide-react';

export interface ProgramProps {
    program: PerProgram;
}

// --- Main Component ---
export default function Programs({ program }: ProgramProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;
    const assignedAreas = auth.user.areas;

    const selected_level = program.levels?.find((level) => level.areas) || program.levels?.[0];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/manage-programs' },
        { title: program.program_name, href: `/manage-program/${program.program_id}` },
    ];

    const [activeSection, setActiveSection] = useState(role === 'Admin' || role === 'Coordinator' ? 'overview' : 'areas');
    const overviewRef = useRef<HTMLDivElement>(null);
    const objectivesRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const areasRef = useRef<HTMLDivElement>(null);

    const allSections = useMemo(
        () => [
            { id: 'overview', label: 'Program Overview', ref: overviewRef, roles: ['Admin', 'Coordinator'] },
            { id: 'objectives', label: 'Program Objectives', ref: objectivesRef, roles: ['Admin', 'Coordinator'] },
            { id: 'gallery', label: 'Gallery', ref: galleryRef, roles: ['Admin', 'Coordinator'] },
            { id: 'areas', label: 'Program Areas', ref: areasRef, roles: ['Admin', 'Coordinator', 'Chairman'] },
        ],
        [],
    );
    const sections = allSections.filter((section) => section.roles.includes(role));

    const [scrollLock, setScrollLock] = useState(false);
    const scrollToSection = (ref, sectionId) => {
        setScrollLock(true);
        setActiveSection(sectionId);

        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Unlock when scroll really stops
        let timeout;
        const handleScrollEnd = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setScrollLock(false);
                window.removeEventListener('scroll', handleScrollEnd);
            }, 150); // only unlock after scrolling stops for 150ms
        };

        window.addEventListener('scroll', handleScrollEnd);
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // activates when section is near middle of screen
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            if (scrollLock) return; // do nothing if user clicked a link

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.filter((section) => section.ref?.current !== null).forEach((section) => observer.observe(section.ref.current));

        return () => {
            sections.filter((section) => section.ref?.current !== null).forEach((section) => observer.unobserve(section.ref.current));
        };
    }, [sections, scrollLock]);

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

    const getBadgeColor = (remarks?: string) => {
        switch (remarks?.toLowerCase()) {
            case 'passed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'ongoing':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
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
                                            program_id: program.program_id,
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
            <Head title={`${program.program_name?.trim().replace(/\b\w/g, (c) => c.toUpperCase())} - Program Management`} />
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
                            <div id="areas" ref={areasRef} className="scroll-mt-20 rounded-lg border border-gray-200 bg-white p-8">
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
                                        <Button
                                            className="border-none"
                                            size="sm"
                                            onClick={() => {
                                                router.get(
                                                    route('manage.program.download', {
                                                        program_id: program.program_id,
                                                        level_id: selected_level?.accreditation_level_id,
                                                    }),
                                                    {},
                                                    { preserveScroll: true, preserveState: true },
                                                );
                                            }}
                                        >
                                            <div className="flex items-center">
                                                Export
                                                <Download className="ml-2 h-4 w-4" />
                                            </div>
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
                                                    className="group relative flex flex-col rounded-xl border border-gray-200 bg-white transition-all duration-150 hover:border-gray-400"
                                                >
                                                    {isAssigned ? (
                                                        <Link
                                                            href={route('manage.area', {
                                                                program_id: program.program_id,
                                                                level_id: selected_level.accreditation_level_id,
                                                                area_id: item.area_id,
                                                            })}
                                                            className="block p-6"
                                                        >
                                                            <h4 className="text-base font-semibold text-gray-900">Area {item.area_numeral}</h4>
                                                            <div className="flex items-start justify-between">
                                                                <p className="mt-1 text-sm text-gray-600">{item.area_name}</p>
                                                                {/* Badge (top-right) */}
                                                                {role !== 'Admin' && role !== 'Coordinator' && (
                                                                    <Badge variant="outline" className="border-0 bg-green-100 text-green-800">
                                                                        Assigned
                                                                    </Badge>
                                                                )}
                                                                {item.archive && (
                                                                    <Badge className="bg-[#7f1414] text-white">Archive</Badge>
                                                                )}
                                                            </div>
                                                            {/* <div className="flex justify-start mt-2 gap-4 text-xs text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                    <CircleSlash className="h-3 w-3" />
                                                                    <span>{item.levels.}</span>
                                                                </div>
                                                            </div> */}
                                                        </Link>
                                                    ) : (
                                                        <div className="block cursor-not-allowed p-6">
                                                            <h4 className="text-base font-semibold text-gray-600">Area {item.area_numeral}</h4>

                                                            <div className="flex items-start justify-between">
                                                                <p className="mt-1 text-sm text-gray-500">{item.area_name}</p>
                                                                <Badge variant="outline" className="border-0 bg-gray-100 text-gray-700">
                                                                    Not Assigned
                                                                </Badge>
                                                            </div>
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
                                                                item.archive === false &&
                                                                selected_level.remarks === 'Ongoing Survey' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setTimeout(() => editArea(item), 50);
                                                                        }}
                                                                    >
                                                                        <EditIcon className="mr-2 h-4 w-4 text-gray-600" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                )}
                                                            <DropdownMenuItem asChild>
                                                                <a
                                                                    href={route('manage.area.download', {
                                                                        program_id: program.program_id,
                                                                        level_id: selected_level.accreditation_level_id,
                                                                        area_id: item.area_id,
                                                                    })}
                                                                    className="flex w-full"
                                                                >
                                                                    <Download className="mr-2 h-4 w-4 text-gray-600" />
                                                                    Export
                                                                </a>
                                                            </DropdownMenuItem>
                                                            {(role === 'Admin' || role === 'Coordinator') &&
                                                                selected_level.is_active &&
                                                                item.archive === false &&
                                                                selected_level.remarks === 'Ongoing Survey' && (
                                                                    <>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            // className="text-red-600 hover:bg-red-50 hover:text-red-600"
                                                                            onClick={() => {
                                                                                setTimeout(() => deleteArea(item), 50);
                                                                            }}
                                                                        >
                                                                            <Archive className="mr-2 h-4 w-4" />
                                                                            Archive
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
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <div className="mb-3 text-sm font-semibold text-gray-900">Status</div>
                                <div
                                    className={`rounded-lg p-2 ${selected_level?.remarks?.toLowerCase().includes('passed')
                                        ? 'bg-green-100'
                                        : selected_level?.remarks?.toLowerCase().includes('failed')
                                            ? 'bg-red-100'
                                            : 'bg-yellow-100'
                                        }`}
                                >
                                    <div
                                        className={`text-center text-xs font-medium ${selected_level?.remarks?.toLowerCase().includes('passed')
                                            ? 'text-green-800'
                                            : selected_level?.remarks?.toLowerCase().includes('failed')
                                                ? 'text-red-800'
                                                : 'text-yellow-800'
                                            }`}
                                    >
                                        {selected_level?.remarks}
                                    </div>
                                </div>
                            </div>

                            {/* --- Level Selector --- */}
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Accreditation Level</h3>
                                {levelSelectorControls}
                            </div>

                            {/* Quick Links */}
                            {(role === 'Admin' || role === 'Coordinator') && (
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
                            )}
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
