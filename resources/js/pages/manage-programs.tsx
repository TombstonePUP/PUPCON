import { useEffect, useState } from 'react';

import DeleteProgram from '@/components/dialogs/content/programs/delete-program';
import EndSurveyDialog from '@/components/dialogs/content/programs/end-survey-dialog';
import ProgramDialog from '@/components/dialogs/content/programs/program-dialog';
import ProgramLevelDialog from '@/components/dialogs/content/programs/program-level-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PerProgramUnderSurvey } from '@/types';
import { Head, router, usePage, usePoll } from '@inertiajs/react';
import { BookCheck, CircleSlash, Edit, Folders, NotebookIcon, PlusCircleIcon, Trash2 } from 'lucide-react';

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

    const filteredPrograms =
        programs?.filter((program) => {
            const matchesSearch = program.program_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDegree = filterDegree === 'all' || program.degree_type === filterDegree;
            return matchesSearch && matchesDegree;
        }) || [];

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

    const underSurvey = filteredPrograms.filter((p) => p.under_survey === true);

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
                                        {' '}
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
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">{programs?.length || 0}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                                    <svg className="h-5 w-5 text-[#7f1414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Bachelor Programs</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                                        {programs?.filter((p) => p.degree_type.toLowerCase().includes('bachelor')).length || 0}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Diploma Programs</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                                        {programs?.filter((p) => p.degree_type.toLowerCase().includes('diploma')).length || 0}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                                    <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Programs Grid */}
                <div className="mt-5">
                    {filteredPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPrograms.map((program) => {
                                const isAssigned = assignedPrograms.find((ap: PerProgramUnderSurvey) => ap.program_id === program.program_id);
                                const canClick = role === 'Admin' || role === 'Coordinator' || isAssigned;
                                return (
                                    <div
                                        key={program.program_id}
                                        tabIndex={0}
                                        role={canClick ? 'button' : undefined}
                                        onClick={canClick ? () => handleProgramClick(program) : undefined}
                                        onKeyDown={
                                            isAssigned ? (e) => (e.key === 'Enter' || e.key === ' ') && handleProgramClick(program) : undefined
                                        }
                                        className="group cursor-pointer"
                                    >
                                        <div className="relative rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400">
                                            {(role === 'Admin' || role === 'Coordinator') && (
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
                                                        <Trash2 className="h-4 w-4 text-gray-500" />
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex flex-wrap gap-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-0 bg-red-100/50 px-2 py-1 text-xs font-medium text-[#7f1414]"
                                                    >
                                                        {program.latest_level
                                                            ? `Accreditation Level ${program.latest_level?.level}`
                                                            : `No Current Level`}
                                                    </Badge>
                                                    {program.under_survey && (
                                                        <Badge variant="outline" className="border-0 bg-yellow-100 text-yellow-800">
                                                            Under Survey
                                                        </Badge>
                                                    )}
                                                </div>
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
                                                <div className="flex items-center gap-1">
                                                    <CircleSlash className="h-3 w-3" />
                                                    <span>20 missing</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center"></div>
                    )}
                </div>

                {/* Dialogs */}
                <Dialog open={startLevelConfirmOpen} onOpenChange={setStartLevelConfirmOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="mb-4 text-lg font-medium text-gray-900">No Levels Found</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                                The program "{programToStart?.degree_type} in {programToStart?.program_name}" has no accreditation levels yet. Do you
                                want to start one now?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                variant="noborder"
                                onClick={() => {
                                    setStartLevelConfirmOpen(false);
                                    handleAddLevel();
                                }}
                            >
                                Start First Level
                            </Button>
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
                    <ProgramLevelDialog programs={programs} onClose={() => setDialogOpen(false)} />
                )}
                {dialogOpen && dialogType === 'level' && dialogAction === 'end' && (
                    <EndSurveyDialog programs={underSurvey} onClose={() => setDialogOpen(false)} />
                )}
            </div>
        </AppLayout>
    );
}
