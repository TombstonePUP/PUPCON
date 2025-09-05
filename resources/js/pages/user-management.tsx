import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/charts/data-table"
import { columns } from "@/components/charts/data-table-columns/users"
import { type UserRecords } from "@/types"
import { useState } from 'react';
import { UserPlus, Mail, User, Shield, Settings, BookOpen, CheckCircle, User2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface UsersProps {
    userRecords: UserRecords[];
}

const programList = [
    'Information Technology',
    'Accounting',
    'Psychology'
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/users',
    },
];

export default function Users({ userRecords }: UsersProps) {
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<Record<string, number[]>>({});

    const toggleProgram = (program: string) => {
        setSelectedPrograms((prev) => {
            const isSelected = prev.includes(program);
            const updated = isSelected
                ? prev.filter((p) => p !== program)
                : [...prev, program];

            // If program is being unchecked, also clear its areas
            if (isSelected) {
                setSelectedAreas((prevAreas) => {
                    const updatedAreas = { ...prevAreas };
                    delete updatedAreas[program];
                    return updatedAreas;
                });
            }
            return updated;
        });
    };

    const toggleArea = (program: string, area: number) => {
        setSelectedAreas((prev) => {
            const current = prev[program] || [];
            return {
                ...prev,
                [program]: current.includes(area)
                    ? current.filter((a) => a !== area)
                    : [...current, area]
            };
        });
    };

    const isProgramSelected = (program: string) => selectedPrograms.includes(program);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage user accounts and permissions</p>
                    </div>

                    {/* Add New User Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="noborder" className='w-50'>
                                <User2 className="h-4 w-4 " />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className='flex items-center gap-2'>
                                    <User2 className="h-5 w-5 text-[#7f1414]" />
                                    Add User
                                </DialogTitle>
                                <DialogDescription>
                                    Fill in the details to create a new account
                                </DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="account" className="w-full">
                                <TabsList className='w-full mb-4'>
                                    <TabsTrigger value="account">Information</TabsTrigger>
                                    <TabsTrigger value="access">Access</TabsTrigger>
                                </TabsList>
                                <TabsContent value="account">
                                    <div className="flex flex-col gap-4">
                                        <div className='flex gap-2'>
                                            <div className='flex flex-col flex-1 gap-2'>
                                                <Label >First Name</Label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    placeholder="Enter first name"
                                                />
                                            </div>
                                            <div className='flex flex-col flex-1 gap-2'>
                                                <Label >Last Name</Label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    placeholder="Enter last name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                                Email Address
                                            </Label>
                                            <input
                                                type="email"
                                                className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="access" className="flex flex-col gap-5 overflow-x-auto">
                                    <div>
                                        <Label className="mb-1 block text-sm font-medium mb-2">Programs & Areas</Label>
                                        <div className="flex flex-col gap-3">
                                            {programList.map(program => (
                                                <div key={program}>
                                                    <label className="flex items-center gap-3 text-sm mb-0 font-normal text-foreground">
                                                        <input
                                                            type="checkbox"
                                                            className="accent-ring"
                                                            checked={isProgramSelected(program)}
                                                            onChange={() => toggleProgram(program)}
                                                        />
                                                        {program}
                                                    </label>
                                                    {isProgramSelected(program) && (
                                                        <div className="ml-6 mt-2">
                                                            <div className="grid grid-cols-5 gap-2 flex-wrap">
                                                                {Array.from({ length: 10 }).map((_, i) => (
                                                                    <label key={i} className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="accent-ring"
                                                                            checked={(selectedAreas[program] || []).includes(i + 1)}
                                                                            onChange={() => toggleArea(program, i + 1)}
                                                                        />
                                                                        Area {i + 1}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-sm font-medium">Additional Access</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* <label className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground">
                                            <input type="checkbox" className="accent-ring" /> Exhibits
                                        </label> */}
                                            <label className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground whitespace-nowrap">
                                                <input type="checkbox" className="accent-ring " /> Coordinator
                                            </label>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button variant="noborder">Submit</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>


                {/* Data Table */}
                <div className="rounded-lg border bg-white p-4">
                    <DataTable
                        columns={columns}
                        data={userRecords.filter(user => user.role?.toLowerCase() !== "admin")}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
