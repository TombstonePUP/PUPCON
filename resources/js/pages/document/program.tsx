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
import { Archive, BookOpen, ChevronDown, Download, EditIcon, MoreVertical, Plus } from 'lucide-react';
import { PageTitle } from '@/components/page-header';
import { Card } from '@/components/ui/card';

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-muted-foreground text-xs">Level</span>
          <span className="font-medium text-foreground text-xs xl:inline hidden">
            {selected_level?.level === 0 ? 'Preliminary' : `Accreditation ${selected_level?.level}`}
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
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
      <div className="flex flex-col gap-6 p-6">
        <PageTitle
          title={
            <span className="capitalize">
              {program.degree_type} in {program.program_name}
            </span>
          }
          description="Manage program information, objectives, and assessment areas."
          actions={
            <div className="flex flex-col items-end gap-2">
              <div className="pointer-events-none  absolute top-0 right-0 w-20 h-24 overflow-hidden rounded-tr-lg">
                <div
                  className={`absolute top-6 -right-10 w-36 rotate-45 py-0.5 text-center text-xs font-semibold text-white ${selected_level?.remarks?.toLowerCase().includes('passed')
                      ? 'bg-success'
                      : selected_level?.remarks?.toLowerCase().includes('failed')
                        ? 'bg-destructive'
                        : 'bg-warning'
                    }`}
                >
                  {selected_level?.remarks}
                </div>
              </div>
              {levelSelectorControls}
            </div>
          }
        />

        {/* Main Content */}
        <div className="flex gap-6">
          <div className="flex flex-col space-y-6 w-full">
            {(role === 'Admin' || role === 'Coordinator') && (
              <ProgramSection program={program} overviewRef={overviewRef} objectivesRef={objectivesRef} galleryRef={galleryRef} />
            )}

            <Card id="areas" ref={areasRef} className="scroll-mt-20 p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Program Areas</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure assessment areas for{' '}
                    <span className="font-medium text-foreground">
                      {selected_level?.level === 0 ? 'Preliminary Survey Visit' : 'Level ' + selected_level?.level}
                    </span>
                  </p>
                </div>
                <Button
                  className="border-none"
                  size="sm"
                  onClick={() => router.get(
                    route('manage.program.download', {
                      program_id: program.program_id,
                      level_id: selected_level?.accreditation_level_id,
                    }),
                    {},
                    { preserveScroll: true, preserveState: true },
                  )}
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
                        className="group relative flex flex-col rounded-xl border border-border bg-muted/30 transition-all duration-150 hover:border-border/80 transition-all duration-150 hover:-translate-y-0.5"
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
                            <h4 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">Area {item.area_numeral}</h4>
                            <div className="flex items-start justify-between">
                              <p className="mt-1 text-sm text-muted-foreground">{item.area_name}</p>
                              {role !== 'Admin' && role !== 'Coordinator' && selected_level.is_active && (
                                <Badge variant="success">Assigned</Badge>
                              )}
                              {item.archive && <Badge variant="destructive">Archived</Badge>}
                            </div>
                          </Link>
                        ) : (
                          <div className="block cursor-not-allowed p-6">
                            <h4 className="text-base font-semibold text-muted-foreground">Area {item.area_numeral}</h4>
                            <div className="flex items-start justify-between">
                              <p className="mt-1 text-sm text-muted-foreground">{item.area_name}</p>
                              <Badge variant="secondary">Not Assigned</Badge>
                            </div>
                          </div>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 hover:bg-muted">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(role === 'Admin' || role === 'Coordinator') &&
                              selected_level.is_active &&
                              item.archive === false &&
                              selected_level.remarks === 'Ongoing Survey' && (
                                <DropdownMenuItem onClick={() => setTimeout(() => editArea(item), 50)}>
                                  <EditIcon className="mr-2 h-4 w-4 text-muted-foreground" />
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
                                className="flex w-full">
                                <Download className="mr-2 h-4 w-4 text-muted-foreground" />
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
                    <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6">
                      <p className="text-center text-sm text-muted-foreground">No areas added yet for this level.</p>
                    </div>
                  </div>
                )}

                {(role === 'Admin' || role === 'Coordinator') &&
                  selected_level?.is_active &&
                  selected_level?.remarks === 'Ongoing Survey' && (
                    <button
                      type="button"
                      onClick={addArea}
                      className="group flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-5 text-muted-foreground transition-colors hover:border-border/60 hover:bg-muted/30 hover:text-foreground"
                    >
                      <Plus className="h-6 w-6" />
                      <span className="mt-2 text-sm font-medium">Add New Area</span>
                    </button>
                  )}
              </div>
            </Card>
          </div>

          {(role === 'Admin' || role === 'Coordinator') && (
            <div className="shrink-0 sticky top-6 self-start rounded-lg p-6 hidden xl:inline">
              <h2 className="mb-4 text-muted-foreground">On this page</h2>
              <nav className="space-y-1 ml-2 border-l border-border">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.ref, section.id)}
                    className={`block w-full text-left text-sm px-4 my-4 border-l-3 transition-all duration-150 ${activeSection === section.id
                      ? 'border-primary'
                      : 'border-transparent text-muted-foreground font-normal hover:text-foreground hover:border-border'
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

      {
        dialogOpen && dialogAction !== 'delete' && (
          <AreaDialog type={dialogAction} area={selectedArea} program={program} level={selected_level} onClose={() => setDialogOpen(false)} />
        )
      }
      {
        dialogOpen && dialogAction === 'delete' && (
          <DeleteAreaDialog type="delete" area={selectedArea} program={program} level={selected_level} onClose={() => setDialogOpen(false)} />
        )
      }
    </AppLayout >
  );
}
