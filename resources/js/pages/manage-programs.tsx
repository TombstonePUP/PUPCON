import { useEffect, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PerProgramUnderSurvey } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, NotebookIcon, PlusCircleIcon } from 'lucide-react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDegree, setFilterDegree] = useState<string>('all');

    const [addLevelDialogOpen, setAddLevelDialogOpen] = useState(false);
    const [startLevelConfirmOpen, setStartLevelConfirmOpen] = useState(false);
    const [editProgramDialogOpen, setEditProgramDialogOpen] = useState(false);

    const [programToStart, setProgramToStart] = useState<PerProgramUnderSurvey | null>(null);
    const [programToEdit, setProgramToEdit] = useState<PerProgramUnderSurvey | null>(null);
    const [selectedProgramId, setSelectedProgramId] = useState<string>('');

    useEffect(() => {
        if (programToStart) {
            setSelectedProgramId(String(programToStart.program_id));
        }
    }, [programToStart]);

    const filteredPrograms =
        programs?.filter((program) => {
            const matchesSearch = program.program_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDegree = filterDegree === 'all' || program.degree_type === filterDegree;
            return matchesSearch && matchesDegree;
        }) || [];

    const handleProgramClick = (program: PerProgramUnderSurvey) => {
        if (program.levels.length > 0) {
            router.visit(
                route('manage.program', {
                    program_name: program.program_link,
                    level_id: program.levels[0]?.accreditation_level_id || 0,
                }),
            );
        } else {
            setProgramToStart(program);
            setStartLevelConfirmOpen(true);
        }
    };

    const selectedProgram = programs.find((p) => String(p.program_id) === selectedProgramId);
    const hasLevels = selectedProgram && selectedProgram.levels.length > 0;
    const currentLevelName = hasLevels ? 'Level II' : 'Not Accredited';
    const currentProgramStatus = selectedProgram ? currentLevelName : 'Select a program';

    const currentProgramStatusClass = selectedProgram ? (hasLevels ? 'text-gray-700 font-medium' : 'text-gray-500') : 'text-gray-500';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Programs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="mb-2 rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                            <NotebookIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-2">
                            <h1 className="text-xl font-semibold text-gray-900">Program Management</h1>
                            <p className="text-sm text-gray-500">Manage academic programs for PUP San Juan.</p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
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
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
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
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
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

                    {/* Program Actions Card */}
                    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-6">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Program Actions</p>
                        </div>
                        <div className="flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="noborder" className="flex-1">
                                        <NotebookIcon className="h-6 w-6 text-white" />
                                        Add Program
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-medium text-gray-900">Add Program</DialogTitle>
                                        <DialogDescription className="text-sm text-gray-500">
                                            Create a new academic program for PUP San Juan
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <Label className="mb-2 block text-sm font-medium text-gray-700">Degree Type</Label>
                                            <Select defaultValue="">
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select degree type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Bachelor Science">Bachelor of Science</SelectItem>
                                                    <SelectItem value="Bachelor Arts">Bachelor of Arts</SelectItem>
                                                    <SelectItem value="Diploma">Diploma</SelectItem>
                                                    <SelectItem value="Certificate">Certificate</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="mb-2 block text-sm font-medium text-gray-700">Program Name</Label>
                                            <Input
                                                type="text"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                placeholder="e.g., Computer Science, Business Administration"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="noborder">Submit</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                open={addLevelDialogOpen}
                                onOpenChange={(open) => {
                                    setAddLevelDialogOpen(open);
                                    if (!open) {
                                        setProgramToStart(null);
                                        setSelectedProgramId('');
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="noborder" className="flex-1">
                                        <PlusCircleIcon className="h-6 w-6 text-white" />
                                        Add Level
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-medium text-gray-900">Add Program Level</DialogTitle>
                                        <DialogDescription className="text-sm text-gray-500">
                                            Start a new accreditation level for an existing program.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <Label className="mb-2 block text-sm font-medium text-gray-700">Program</Label>
                                            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a program" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {programs.map((program) => (
                                                        <SelectItem key={program.program_id} value={String(program.program_id)}>
                                                            {program.program_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">Current Status</Label>
                                                <div className="flex h-10 w-full items-center rounded-md border border-gray-200 bg-gray-50 px-3">
                                                    <span className={`text-sm ${currentProgramStatusClass}`}>{currentProgramStatus}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">New Level</Label>
                                                <Select defaultValue="">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Candidate">Candidate</SelectItem>
                                                        <SelectItem value="Level I">Level I</SelectItem>
                                                        <SelectItem value="Level II">Level II</SelectItem>
                                                        <SelectItem value="Level III">Level III</SelectItem>
                                                        <SelectItem value="Level IV">Level IV</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="noborder">Submit</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Programs Grid */}
                <div className="mt-10">
                    {filteredPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPrograms.map((program) => (
                                <div
                                    key={program.program_id}
                                    onClick={() => handleProgramClick(program)}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleProgramClick(program)}
                                    role="button"
                                    tabIndex={0}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-4 right-4 h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setProgramToEdit(program);
                                                setEditProgramDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="h-4 w-4 text-gray-500" />
                                        </Button>

                                        <div className="mb-3 flex items-center justify-between">
                                            <div
                                                className={`inline-flex items-center gap-1 rounded bg-red-100/50 px-2 py-1 text-xs font-medium text-[#7f1414]`}
                                            >
                                                Accreditation Level 2
                                            </div>
                                        </div>

                                        <h3 className="mb-2 font-semibold text-gray-900 transition-colors group-hover:text-[#7f1414]">
                                            {program.program_name}
                                        </h3>
                                        <p className="mb-3 text-sm text-gray-600">{`${program.degree_type} in ${program.program_name} `}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                    />
                                                </svg>
                                                <span>{program.levels[0]?.areas ? program.levels[0]?.areas?.length : 0} areas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center"></div>
                    )}
                </div>

                <Dialog open={startLevelConfirmOpen} onOpenChange={setStartLevelConfirmOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="mb-4 text-lg font-medium text-gray-900">No Levels Found</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                                The program "{programToStart?.program_name}" has no accreditation levels yet. Do you want to start one now?
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
                                    setAddLevelDialogOpen(true);
                                }}
                            >
                                Start First Level
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={editProgramDialogOpen}
                    onOpenChange={(open) => {
                        setEditProgramDialogOpen(open);
                        if (!open) {
                            setProgramToEdit(null);
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-medium text-gray-900">Edit Program</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">Update the details for this academic program.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Degree Type</Label>
                                <Select defaultValue={programToEdit?.degree_type || ''}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select degree type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bachelor Science">Bachelor of Science</SelectItem>
                                        <SelectItem value="Bachelor Arts">Bachelor of Arts</SelectItem>
                                        <SelectItem value="Diploma">Diploma</SelectItem>
                                        <SelectItem value_program="Certificate">Certificate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Program Name</Label>
                                <Input
                                    type="text"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    placeholder="e.g., Computer Science"
                                    defaultValue={programToEdit?.program_name || ''}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="noborder">Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
