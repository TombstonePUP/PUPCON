import { useState } from 'react';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PerProgramUnderSurvey } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Programs',
        href: '/manage-programs',
    },
];

interface ProgramsProps {
    programs: PerProgramUnderSurvey[];
}

export default function ManagePrograms({ programs }: ProgramsProps) {
    const { auth } = usePage().props;
    const userPrograms = auth.programs;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDegree, setFilterDegree] = useState<string>('all');

    console.log(auth.user);

    const filteredPrograms =
        programs?.filter((program) => {
            const matchesSearch = program.program_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDegree = filterDegree === 'all' || program.degree_type === filterDegree;
            return matchesSearch && matchesDegree;
        }) || [];



    // const getDegreeIcon = (degreeType: string) => {
    //     switch (degreeType.toLowerCase()) {
    //         case 'bachelor science':
    //         case 'bachelor':
    //             return (
    //                 <svg className="h-4 w-4 text-[#7f1414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
    //                     <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth="2"
    //                         d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    //                     />
    //                 </svg>
    //             );
    //         case 'diploma':
    //             return (
    //                 <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                     <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth="2"
    //                         d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    //                     />
    //                 </svg>
    //             );
    //         default:
    //             return (
    //                 <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                     <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth="2"
    //                         d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    //                     />
    //                 </svg>
    //             );
    //     }
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Programs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Program Management</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage academic programs for PUP San Juan</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="noborder">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Program
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">Add New Program</DialogTitle>
                                <DialogDescription>Create a new academic program for PUP San Juan</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Degree Type</label>
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
                                    <label className="text-sm font-medium text-gray-700">Program Name</label>
                                    <input
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
                                <Button className="bg-[#7f1414] hover:bg-[#8b1515]">Create Program</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
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

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
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

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
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

                {/* Programs Grid */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Academic Programs</h2>
                        <p className="text-sm text-gray-600">Manage your institution's programs</p>
                    </div>

                    {filteredPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPrograms.map((program) => (
                                <Link
                                    key={program.program_id}
                                    href={route('manage.program', { program_name: program.program_name })}
                                    className="group"
                                >
                                    <div className="rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-[#7f1414]/30 hover:bg-red-50/50">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div
                                                className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                                                    program.degree_type.toLowerCase().includes('bachelor')
                                                        ? 'bg-red-100 text-[#7f1414]'
                                                        : 'bg-green-100 text-green-700'
                                                }`}
                                            >
                                                {/* {getDegreeIcon(program.degree_type)} */}
                                                {program.degree_type}
                                            </div>
                                            {/* <svg
                                                className="h-4 w-4 text-gray-400 transition-colors group-hover:text-[#7f1414]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg> */}
                                        </div>

                                        <h3 className="mb-2 font-semibold text-gray-900 transition-colors group-hover:text-[#7f1414]">
                                            {program.program_name}
                                        </h3>
                                        <p className="mb-3 text-sm text-gray-600">{`${program.degree_type} in ${program.program_name}`}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            {/* <div className="flex items-center gap-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                                    />
                                                </svg>
                                                <span>124 students</span>
                                            </div> */}
                                            <div className="flex items-center gap-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                    />
                                                </svg>
                                                <span>{program.areas?.length} areas</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">No programs found</h3>
                            <p className="mb-6 text-gray-600">
                                {searchTerm || filterDegree !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Get started by creating your first academic program'}
                            </p>
                            {!searchTerm && filterDegree === 'all' && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-[#7f1414] hover:bg-[#8b1515]">
                                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Create Your First Program
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-semibold">Add New Program</DialogTitle>
                                            <DialogDescription>Create a new academic program for PUP San Juan</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Degree Type</label>
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
                                                <label className="text-sm font-medium text-gray-700">Program Name</label>
                                                <input
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
                                            <Button className="bg-[#7f1414] hover:bg-[#8b1515]">Create Program</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
