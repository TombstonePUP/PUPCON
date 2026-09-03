import { useEffect, useMemo, useRef, useState } from 'react';

import ProgramSection from '@/components/guest/content/program/program-section';
import AreaDialog from '@/components/admin/dialogs/content/programs/areas/area-dialog';
import DeleteAreaDialog from '@/components/admin/dialogs/content/programs/areas/delete-area-dialog';
import { PageTitle } from '@/components/admin/page-header';
import TableOfContents from '@/components/guest/table-of-contents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
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
import AppLayout from '@/layouts/admin/app-layout';
import { Auth, type BreadcrumbItem, type PerProgram, type ProgramAreas } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive, BookOpen, ChevronDown, Download, EditIcon, MoreVertical, Plus } from 'lucide-react';

export interface ProgramProps {
    program: PerProgram;
}

// --- Main Component ---
export default function Programs({ program }: ProgramProps) {
    const { auth } = usePage<Auth>().props;
    const role = auth.user.roles.role_name;
    const assignedAreas = auth.user.areas;

    const selected_level = program.levels?.find((level) => level.areas) || program.levels?.[0];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/manage-programs' },
        { title: program.program_name, href: `/manage-program/${program.program_id}` },
    ];

    const [, setActiveSection] = useState(role === 'Admin' || role === 'Coordinator' ? 'overview' : 'areas');
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



    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // activates when section is near middle of screen
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
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
    }, [sections]);

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <span className="text-muted-foreground text-xs">Level</span>
                    <span className="text-foreground hidden text-xs font-medium xl:inline">
                        {selected_level?.level === 0 ? 'Preliminary' : `Accreditation ${selected_level?.level}`}
                    </span>
                    <ChevronDown className="text-muted-foreground size-3.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-xs">Select Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selected_level?.accreditation_level_id?.toString()}>
                    {program.levels?.map((level) => (
                        <DropdownMenuRadioItem
                            className="text-xs"
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
                            {level.level === 0 ? 'Preliminary Survey Visit' : 'Level ' + level.level}
                            {level.survey_date && ` - (${new Date(level.survey_date).getFullYear()})`}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const areas =
        role === 'Admin' || role === 'Coordinator'
            ? selected_level?.areas || []
            : selected_level?.areas?.filter((area) => area.archive === false) || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${program.program_name?.trim().replace(/\b\w/g, (c) => c.toUpperCase())} - Program Management`} />
            <PageTitle
                icon={<BookOpen className="size-5" />}
                title={
                    <span>
                        {program.degree_type} in {program.program_name}
                    </span>
                }
                description="Manage program information, objectives, and assessment areas."
                indicator={{
                    color: selected_level?.remarks?.toLowerCase().includes('passed')
                        ? 'bg-success'
                        : selected_level?.remarks?.toLowerCase().includes('failed')
                          ? 'bg-destructive'
                          : 'bg-warning',
                    tooltip: selected_level?.remarks,
                }}
                actions={levelSelectorControls}
            />

            {/* Main Content */}
            <div className="flex gap-6">
                <div className="flex w-full flex-col space-y-6">
                    {(role === 'Admin' || role === 'Coordinator') && (
                        <ProgramSection program={program} overviewRef={overviewRef} objectivesRef={objectivesRef} galleryRef={galleryRef} />
                    )}

                    <Card id="areas" ref={areasRef} className="scroll-mt-20 p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <CardTitle className="text-foreground text-lg font-semibold">Program Areas</CardTitle>
                                <p className="text-muted-foreground text-sm">
                                    Configure assessment areas for{' '}
                                    <span className="text-foreground font-medium">
                                        {selected_level?.level === 0 ? 'Preliminary Survey Visit' : 'Level ' + selected_level?.level}
                                    </span>
                                </p>
                            </div>
                            <Button
                                className="border-none"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        route('manage.program.download', {
                                            program_id: program.program_id,
                                            level_id: selected_level?.accreditation_level_id,
                                        }),
                                        {},
                                        { preserveScroll: true, preserveState: true },
                                    )
                                }
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {selected_level?.areas && selected_level?.areas.length > 0 ? (
                                areas?.map((item) => {
                                    const isAssigned =
                                        role !== 'Admin' && role !== 'Coordinator' && selected_level.is_active === true
                                            ? assignedAreas.find((area: ProgramAreas) => area.area_id === item.area_id)
                                            : true;
                                    return (
                                        <div
                                            key={item.area_id}
                                            className="group border-border bg-muted/30 hover:border-border/80 relative flex flex-col rounded-xl border transition-all duration-150 hover:-translate-y-0.5"
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
                                                    <h4 className="text-foreground group-hover:text-primary text-base font-semibold transition-colors">
                                                        Area {item.area_numeral}
                                                    </h4>
                                                    <div className="flex items-start justify-between">
                                                        <p className="text-muted-foreground mt-1 text-sm">{item.area_name}</p>
                                                        {role !== 'Admin' && role !== 'Coordinator' && selected_level.is_active && (
                                                            <Badge variant="success">Assigned</Badge>
                                                        )}
                                                        {item.archive && <Badge variant="destructive">Archived</Badge>}
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className="block cursor-not-allowed p-6">
                                                    <h4 className="text-muted-foreground text-base font-semibold">Area {item.area_numeral}</h4>
                                                    <div className="flex items-start justify-between">
                                                        <p className="text-muted-foreground mt-1 text-sm">{item.area_name}</p>
                                                        <Badge variant="secondary">Not Assigned</Badge>
                                                    </div>
                                                </div>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="hover:bg-muted absolute top-3 right-3 h-8 w-8 rounded-full p-0"
                                                    >
                                                        <MoreVertical className="text-muted-foreground h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {(role === 'Admin' || role === 'Coordinator') &&
                                                        selected_level.is_active &&
                                                        item.archive === false &&
                                                        selected_level.remarks === 'Ongoing Survey' && (
                                                            <DropdownMenuItem onClick={() => setTimeout(() => editArea(item), 50)}>
                                                                <EditIcon className="text-muted-foreground mr-2 h-4 w-4" />
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
                                                            <Download className="text-muted-foreground mr-2 h-4 w-4" />
                                                            Export
                                                        </a>
                                                    </DropdownMenuItem>
                                                    {(role === 'Admin' || role === 'Coordinator') &&
                                                        selected_level.is_active &&
                                                        item.archive === false &&
                                                        selected_level.remarks === 'Ongoing Survey' && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => setTimeout(() => deleteArea(item), 50)}>
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
                                    <div className="border-border bg-muted/30 flex min-h-[120px] items-center justify-center rounded-xl border border-dashed p-6">
                                        <p className="text-muted-foreground text-center text-sm">No areas added yet for this level.</p>
                                    </div>
                                </div>
                            )}

                            {(role === 'Admin' || role === 'Coordinator') &&
                                selected_level?.is_active &&
                                selected_level?.remarks === 'Ongoing Survey' && (
                                    <button
                                        type="button"
                                        onClick={addArea}
                                        className="group border-border text-muted-foreground hover:border-border/60 hover:bg-muted/30 hover:text-foreground flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 transition-colors"
                                    >
                                        <Plus className="h-6 w-6" />
                                        <span className="mt-2 text-sm font-medium">Add New Area</span>
                                    </button>
                                )}
                        </div>
                    </Card>
                </div>

                {(role === 'Admin' || role === 'Coordinator') && <TableOfContents sections={sections} />}
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
