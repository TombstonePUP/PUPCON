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
import { Head, router, usePage, usePoll } from '@inertiajs/react';
import { Archive, BookCheck, Edit, Folders, GraduationCap, NotebookIcon, PlusCircleIcon, ScrollText } from 'lucide-react';

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

    usePoll(5000);

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

    // Reusable function to render program grid
    const renderProgramGrid = (programsList: PerProgramUnderSurvey[], isArchived: boolean = false) => {
        if (programsList.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        {isArchived ? <Archive className="h-8 w-8 text-gray-400" /> : <NotebookIcon className="h-8 w-8 text-gray-400" />}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">{isArchived ? 'No Archived Programs' : 'No Active Programs'}</h3>
                    <p className="text-sm text-gray-500">
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
                            <div className="relative rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400">
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
                                            <Edit className="h-4 w-4 text-gray-500" />
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
                                            <Archive className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </div>
                                )}
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex flex-wrap gap-1">
                                        <Badge variant="outline" className="border-0 bg-red-100/50 px-2 py-1 text-xs font-medium text-[#7f1414]">
                                            {program.latest_level
                                                ? program.latest_level.level === 0
                                                    ? 'Preliminary Survey Visit'
                                                    : `Accreditation Level ${program.latest_level?.level}`
                                                : `No Current Level`}
                                        </Badge>
                                        {program.under_survey && (
                                            <Badge variant="outline" className="border-0 bg-yellow-100 text-yellow-800">
                                                Under Survey
                                            </Badge>
                                        )}
                                    </div>
                                    {!program.is_active && (
                                        <Badge variant="outline" className="border-0 bg-gray-200 text-gray-600">
                                            Archived
                                        </Badge>
                                    )}
                                    {role === 'Admin' || role === 'Coordinator' ? null : isAssigned ? (
                                        <Badge variant="outline" className="border-0 bg-green-100 text-green-800">
                                            Assigned
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-0 bg-gray-100 text-gray-800">
                                            Not Assigned
                                        </Badge>
                                    )}
                                </div>

                                <h3 className="mb-2 font-semibold text-gray-900 transition-colors group-hover:text-[#7f1414]">
                                    {program.program_name}
                                </h3>
                                <p className="mb-3 line-clamp-1 text-sm text-gray-600">{`${program.degree_type} in ${program.program_name} `}</p>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
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
                {/* Header Section */}
                <div className="flex gap-6">
                    <div id="header" className="mb-2 w-full rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                                <NotebookIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-2">
                                <h1 className="text-xl font-semibold text-gray-900">Programs</h1>
                                <p className="line-clamp-1 text-sm text-gray-500">Manage academic programs for PUP San Juan.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Quick Links */}
                    {(role === 'Admin' || role === 'Coordinator') && (
                        <div className="w-fit shrink-0">
                            <div className="sticky top-6 space-y-4">
                                <div className="rounded-lg border border-gray-200 bg-white p-4">
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Program Actions</h3>
                                    <div className="flex gap-2">
                                        <Button variant="noborder" className="flex-1" onClick={handleAddProgram}>
                                            <NotebookIcon className="h-6 w-6 text-white" />
                                            Add Program
                                        </Button>
                                        <Button variant="noborder" className="flex-1" onClick={handleAddLevel}>
                                            <PlusCircleIcon className="h-6 w-6 text-white" />
                                            Start a Survey
                                        </Button>
                                        <Button variant="noborder" className="flex-1" onClick={handleEndLevel}>
                                            <BookCheck className="h-6 w-6 text-white" />
                                            End a Survey
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    {/* Stats Overview */}
                    <div className="flex w-full gap-4">
                        <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Programs</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">{activePrograms.length || 0}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                                    <NotebookIcon className="h-5 w-5 text-[#7f1414]" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Bachelor Programs</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                                        {activePrograms.filter((p) => p.degree_type.toLowerCase().includes('bachelor')).length || 0}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <GraduationCap className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Diploma Programs</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                                        {activePrograms.filter((p) => p.degree_type.toLowerCase().includes('diploma')).length || 0}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                                    <ScrollText className="h-5 w-5 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Programs Grid with Tabs for Admin/Coordinator */}
                <div className="mt-5">
                    {role === 'Admin' || role === 'Coordinator' ? (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="active" className="flex items-center gap-2">
                                    <NotebookIcon className="h-4 w-4" />
                                    Active ({activePrograms.length})
                                </TabsTrigger>
                                <TabsTrigger value="archived" className="flex items-center gap-2">
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
                            <DialogTitle className="mb-4 text-lg font-medium text-gray-900">No Levels Found</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
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
