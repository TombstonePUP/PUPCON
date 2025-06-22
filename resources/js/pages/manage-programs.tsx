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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { PerProgramUnderSurvey } from '@/types';
import { type BreadcrumbItem, type UserRecords } from '@/types';
import { Head, Link } from '@inertiajs/react';

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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 relative flex min-h-[100vh] flex-1 flex-col gap-2 rounded-xl border p-4 md:min-h-min">
                    {/* Ensure DataTable is properly imported and data matches column expectations */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full border-none">Add Program</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Program</DialogTitle>
                                <DialogDescription>Add new program for PUP San Juan</DialogDescription>
                            </DialogHeader>{' '}
                            <Tabs defaultValue="name" className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="name">Name</TabsTrigger>
                                    <TabsTrigger value="desc">Description</TabsTrigger>
                                </TabsList>
                                <TabsContent value="name">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Degree</label>
                                            <select
                                                className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                defaultValue="ppp"
                                            >
                                                <option value="ppp">Bachelor Science</option>
                                                <option value="self-survey">Diploma</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Program Name</label>
                                            <input
                                                type="text"
                                                className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                placeholder="Enter program name"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="desc" className="flex flex-col gap-4">
                                    <textarea
                                        placeholder="Enter program overview"
                                        className="focus:border-ring focus:ring-ring min-h-[100px] w-full resize-y rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                </TabsContent>
                            </Tabs>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button className="border-none">Submit</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <div className="mt-4 grid w-full grid-cols-2 gap-4">
                        {programs?.length > 0 ? (
                            programs.map((program) => (
                                <Link
                                    key={program.program_id}
                                    href={route('manage.program', {program_name: program.program_name})}
                                    className="rounded border p-7 text-center duration-300 hover:border-[#7f1414]/20 hover:text-[#7f1414]"
                                >
                                    {`${program.degree_type} in ${program.program_name}`}
                                </Link>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No programs available.</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
