import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from "@/components/charts/data-table"
import { columns } from "@/components/charts/users/columns"
import { type UserRecords } from "@/types"
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Programs',
        href: '/manage-programs',
    },
];

interface UsersProps {
    userRecords: UserRecords[];
}

export default function ManagePrograms({ userRecords }: UsersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col border-sidebar-border/70 relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4 gap-2">
                    {/* Ensure DataTable is properly imported and data matches column expectations */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="black" className='w-full'>
                                Add Program
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Program</DialogTitle>
                                <DialogDescription>
                                    Add new program for PUP San Juan
                                </DialogDescription>
                            </DialogHeader>                            <Tabs defaultValue="name" className="w-full">
                                <TabsList className='w-full'>
                                    <TabsTrigger value="name">Name</TabsTrigger>
                                    <TabsTrigger value="desc">Description</TabsTrigger>
                                </TabsList>
                                <TabsContent value="name">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Degree</label>
                                            <select
                                                className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                defaultValue="ppp"
                                            >
                                                <option value="ppp">Bachelor Science</option>
                                                <option value="self-survey">Diploma</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Program Name</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                placeholder="Enter program name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <label className="flex items-center gap-2 text-sm mt-4">
                                                <input type="checkbox" className="accent-ring" /> Under Survey
                                            </label>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="desc" className='flex flex-col gap-4'>                                                            <textarea
                                    placeholder="Enter program overview"
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[100px]"
                                />

                                </TabsContent>
                            </Tabs>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button variant="black">Submit</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <div className='flex flex-row flex-wrap'>
                        <Link href="/manage-programs/program" className='border rounded shadow p-7 w-[49.5%] text-center'>
                            Bachelor of Science in Information Technology
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
