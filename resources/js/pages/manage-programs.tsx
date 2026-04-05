import { useEffect, useState } from 'react';

import DeleteProgram from '@/components/dialogs/content/programs/delete-program';
import EndSurveyDialog from '@/components/dialogs/content/programs/end-survey-dialog';
import ProgramDialog from '@/components/dialogs/content/programs/program-dialog';
import ProgramLevelDialog from '@/components/dialogs/content/programs/program-level-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PerProgramUnderSurvey } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useSmartPoll } from '@/hooks/use-smart-poll';
import { Archive, BookCheck, Edit, FilePlus, Folders, GraduationCap, NotebookIcon, PlusCircleIcon, ScrollText } from 'lucide-react';
import { PageTitle } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Programs',
    href: '/manage-programs',
  },
];

interface ProgramsProps {
  programs: PerProgramUnderSurvey[];
}

export default function ManagePrograms({ programs }: ProgramsProps) {
  const { auth } = usePage().props;
  const user = auth.user;
  const role = user.roles.role_name;
  const assignedPrograms = auth.programs;

  useSmartPoll(5000);

  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDegree, setFilterDegree] = useState<string>('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'program' | 'level' | null>(null);
  const [dialogAction, setDialogAction] = useState<'add' | 'edit' | 'delete' | 'end' | null>(null);

  const [startLevelConfirmOpen, setStartLevelConfirmOpen] = useState(false);

  const [programToStart, setProgramToStart] = useState<PerProgramUnderSurvey | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const selectedProgram = programs.find((p) => p.program_id === selectedProgramId);

  useEffect(() => {
    if (programToStart) {
      setSelectedProgramId(programToStart.program_id);
    }
  }, [programToStart]);

  // Split programs into active and archived
  const activePrograms = programs?.filter((p) => p.is_active) || [];
  const archivedPrograms = programs?.filter((p) => !p.is_active) || [];

  // For non-admin/coordinator users, only show active programs
  const filteredPrograms = role === 'Admin' || role === 'Coordinator' ? programs : activePrograms;

  const handleProgramClick = (program: PerProgramUnderSurvey) => {
    if (program.latest_level) {
      router.visit(
        route('manage.program', {
          program_id: program.program_id,
          level_id: program.latest_level?.accreditation_level_id || 0,
        }),
      );
    } else {
      setProgramToStart(program);
      setStartLevelConfirmOpen(true);
    }
  };

  const underSurvey = filteredPrograms.filter((p) => p.under_survey === true && (p.latest_level?.level ?? -1) <= 4);

  const handleAddProgram = () => {
    setSelectedProgramId(null);
    setDialogType('program');
    setDialogAction('add');
    setDialogOpen(true);
  };

  const handleEditProgram = (program: PerProgramUnderSurvey) => {
    setSelectedProgramId(program.program_id);
    setDialogType('program');
    setDialogAction('edit');
    setDialogOpen(true);
  };

  const handleDeleteProgram = (program: PerProgramUnderSurvey) => {
    setSelectedProgramId(program.program_id);
    setDialogType('program');
    setDialogAction('delete');
    setDialogOpen(true);
  };

  const handleAddLevel = () => {
    setDialogType('level');
    setDialogAction('add');
    setDialogOpen(true);
  };

  const handleEndLevel = () => {
    setDialogType('level');
    setDialogAction('end');
    setDialogOpen(true);
  };

  const programStatsConfig = [
    {
      label: 'Total Programs',
      value: activePrograms.length || 0,
      desc: 'All active programs',
      icon: NotebookIcon,
      iconClass: 'text-[#7f1414]',
    },
    {
      label: 'Bachelor Programs',
      value:
        activePrograms.filter((p) =>
          p.degree_type.toLowerCase().includes('bachelor')
        ).length || 0,
      desc: 'Undergraduate programs',
      icon: GraduationCap,
      iconClass: 'text-green-600',
    },
    {
      label: 'Diploma Programs',
      value:
        activePrograms.filter((p) =>
          p.degree_type.toLowerCase().includes('diploma')
        ).length || 0,
      desc: 'Short-term programs',
      icon: ScrollText,
      iconClass: 'text-orange-600',
    },
  ];

  // Reusable function to render program grid
  const renderProgramGrid = (programsList: PerProgramUnderSurvey[], isArchived: boolean = false) => {
    if (programsList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            {isArchived ? <Archive className="h-8 w-8 text-muted-foreground" /> : <NotebookIcon className="h-8 w-8 text-muted-foreground" />}
          </div>
          <h3 className="mb-1 text-lg font-semibold text-foreground">{isArchived ? 'No Archived Programs' : 'No Active Programs'}</h3>
          <p className="text-sm text-muted-foreground">
            {isArchived ? 'All programs are currently active.' : 'Get started by adding a new program.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programsList.map((program) => {
          const isAssigned = assignedPrograms.find((ap: PerProgramUnderSurvey) => ap.program_id === program.program_id);
          const canClick = role === 'Admin' || role === 'Coordinator' ? true : !isArchived && isAssigned;
          return (
            <div
              key={program.program_id}
              tabIndex={0}
              role={canClick ? 'button' : undefined}
              onClick={canClick ? () => handleProgramClick(program) : undefined}
              onKeyDown={
                canClick && isAssigned ? (e) => (e.key === 'Enter' || e.key === ' ') && handleProgramClick(program) : undefined
              }
              className={`${canClick ? 'cursor-pointer' : 'cursor-not-allowed'} group`}
            >
              <div className="relative rounded-xl border border-border bg-card p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-border/80">
                {(role === 'Admin' || role === 'Coordinator') && program.is_active && (
                  <div className="absolute top-4 right-4 flex h-18 w-18 gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProgram(program);
                      }}
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProgram(program);
                      }}
                    >
                      <Archive className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                )}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="destructive">
                      {program.latest_level
                        ? program.latest_level.level === 0
                          ? 'Preliminary Survey Visit'
                          : `Accreditation Level ${program.latest_level?.level}`
                        : 'No Current Level'}
                    </Badge>
                    {program.under_survey && <Badge variant="warning">Under Survey</Badge>}
                  </div>

                  <div className="flex gap-1">
                    {!program.is_active && <Badge variant="secondary">Archived</Badge>}
                    {role !== 'Admin' && role !== 'Coordinator' && (
                      isAssigned
                        ? <Badge variant="success">Assigned</Badge>
                        : <Badge variant="secondary">Not Assigned</Badge>
                    )}
                  </div>
                </div>

                <h3 className="mb-2 font-semibold text-foreground transition-colors group-hover:text-primary capitalize">
                  {program.program_name}
                </h3>
                <div className="mb-3 flex text-sm text-muted-foreground w-full truncate">
                  <span>{program.degree_type}</span>
                  <span className="mx-1">in</span>
                  <span className="capitalize">{program.program_name}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Folders className="h-3 w-3" />
                    <span>{program.latest_level?.areas ? program.latest_level?.areas?.length : 0} areas</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Programs" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <PageTitle
          title='Programs'
          description='Manage academic programs for PUP San Juan.'
          actions={
            (role === 'Admin' || role === 'Coordinator') && (
              <div className="flex gap-2">
                <Button variant="noborder" className="flex-1" onClick={handleAddProgram}>
                  <FilePlus className="h-6 w-6 text-white" />
                  <span className="hidden xl:inline">Add Program</span>
                </Button>
                <Button variant="noborder" className="flex-1" onClick={handleAddLevel}>
                  <PlusCircleIcon className="h-6 w-6 text-white" />
                  <span className="hidden xl:inline">Start a Survey</span>
                </Button>
                <Button variant="noborder" className="flex-1" onClick={handleEndLevel}>
                  <BookCheck className="h-6 w-6 text-white" />
                  <span className="hidden xl:inline">End a Survey</span>
                </Button>
              </div>
            )
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {programStatsConfig.map(({ label, icon: Icon, value, desc, iconClass }) => (
            <Card key={label}>
              <CardHeader className="relative flex flex-row items-center justify-between py-4 pb-3 space-y-0 bg-muted/50 border-b rounded-t-lg">
                <CardTitle className="text-sm text-foreground">{label}</CardTitle>
                <Icon
                  className={`size-12 absolute -bottom-6 right-6 bg-muted/50 rounded-full p-3 border backdrop-blur-lg ${iconClass}`}
                />
              </CardHeader>
              <CardContent className="pt-3">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Programs Grid with Tabs for Admin/Coordinator */}
        <div className="mt-5">
          {role === 'Admin' || role === 'Coordinator' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="active" className="flex items-center gap-2 text-xs">
                  <NotebookIcon className="h-4 w-4" />
                  Active ({activePrograms.length})
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex items-center gap-2 text-xs">
                  <Archive className="h-4 w-4" />
                  Archived ({archivedPrograms.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active">{renderProgramGrid(activePrograms, false)}</TabsContent>
              <TabsContent value="archived">{renderProgramGrid(archivedPrograms, true)}</TabsContent>
            </Tabs>
          ) : (
            renderProgramGrid(activePrograms, false)
          )}
        </div>

        {/* Dialogs */}
        <Dialog open={startLevelConfirmOpen} onOpenChange={setStartLevelConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="mb-4 text-lg font-medium text-foreground">No Levels Found</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {programToStart?.is_active
                  ? `The program "${programToStart?.degree_type} in ${programToStart?.program_name}" has no accreditation levels yet. Do you
                                want to start one now?`
                  : `The program "${programToStart?.degree_type} in ${programToStart?.program_name}" is currently archived, there is no accreditation level to access the program.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              {programToStart?.is_active && (
                <Button
                  variant="noborder"
                  onClick={() => {
                    setStartLevelConfirmOpen(false);
                    handleAddLevel();
                  }}
                >
                  Start First Level
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {dialogOpen && dialogType === 'program' && dialogAction !== 'delete' && (
          <ProgramDialog
            type={dialogAction}
            program={dialogAction === 'edit' ? selectedProgram : null}
            programs={programs}
            onClose={() => setDialogOpen(false)}
          />
        )}
        {dialogOpen && dialogType === 'program' && dialogAction === 'delete' && selectedProgram && (
          <DeleteProgram program={selectedProgram} onClose={() => setDialogOpen(false)} />
        )}
        {dialogOpen && dialogType === 'level' && dialogAction === 'add' && (
          <ProgramLevelDialog
            programs={programs}
            onClose={() => setDialogOpen(false)}
            selected_program_id={selectedProgramId || undefined}
          />
        )}
        {dialogOpen && dialogType === 'level' && dialogAction === 'end' && (
          <EndSurveyDialog programs={underSurvey} onClose={() => setDialogOpen(false)} />
        )}
      </div>
    </AppLayout>
  );
}
