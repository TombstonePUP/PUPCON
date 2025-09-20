import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
import { DataTable, UsersDataTable } from "@/components/charts/data-table"
import { getUserColumns } from "@/components/charts/data-table-columns/users"
import { AssignablePrograms, AssignableRoles, AssignedAreas, AssignedPrograms, type UserRecords } from "@/types/user-management";
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { User2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import InputError from '@/components/input-error';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

interface UsersProps {
    userRecords: UserRecords[];
    programRoles: AssignablePrograms[];
    roles: AssignableRoles[];
}

interface NewUserForm {
    first_name: string;
    last_name: string;
    email: string;
    assigned_programs: number[];
    assigned_areas: number[];
    assigned_role: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/users',
    },
];

export default function Users({ userRecords, programRoles, roles }: UsersProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const columns = getUserColumns({programRoles, roles});
    const { flash } = usePage().props;

    useEffect(() => {
        console.log(flash);
        if (flash?.type === 'success') {
            toast.success(flash.title, {
                description: flash.message,
            });
        }else if (flash?.type === 'error') {
            toast.error(flash.title, {
                description: flash.message,
            });
        }

    }, [flash]);

    const {
        data: newUserData,
        setData: setNewUserData,
        post: postNewUser,
        processing: processingNewUser,
        errors: errorsNewUser,
        reset: resetNewUser,
    } = useForm<NewUserForm>({
        first_name: '',
        last_name: '',
        email: '',
        assigned_programs: [],
        assigned_areas: [],
        assigned_role: null,
    });

    const addNewUser = (e: React.FormEvent) => {
        e.preventDefault();
        postNewUser(route('users.store'), {
            onSuccess: () => {
                resetNewUser();
                setDialogOpen(false);
            }
        });
    };

    const onChangeProgram = (program: AssignedPrograms, e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            // Add program
            setNewUserData("assigned_programs", [...newUserData.assigned_programs, program.program_id]);
        } else {
            // Remove program
            setNewUserData(
                "assigned_programs",
                newUserData.assigned_programs.filter(id => id !== program.program_id)
            );
            // Remove areas under this program
            setNewUserData(
                "assigned_areas",
                newUserData.assigned_areas.filter(
                    areaId => !program.areas.some(a => a.area_id === areaId)
                )
            );
        }
    }

    const onChangeArea = (area: AssignedAreas, e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            // Add area
            setNewUserData("assigned_areas", [...newUserData.assigned_areas, area.area_id]);
        } else {
            // Remove area
            setNewUserData(
                "assigned_areas",
                newUserData.assigned_areas.filter(id => id !== area.area_id)
            );
        }
    }

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
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="noborder" className='w-50' onClick={() => setDialogOpen(true)}>
                                <User2 className="h-4 w-4 " />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <form>
                                <DialogHeader>
                                    <DialogTitle className='flex items-center gap-2'>
                                        <User2 className="h-5 w-5 text-[#7f1414]" />
                                        Add User
                                    </DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to create a new account
                                    </DialogDescription>
                                </DialogHeader>
                                <Tabs defaultValue="account" className="w-full mt-3 mb-3">
                                    <TabsList className='w-full mb-4'>
                                        <TabsTrigger value="account">Information</TabsTrigger>
                                        <TabsTrigger value="access">Access</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="account">
                                        <div className="flex flex-col gap-4">
                                            <div className='flex gap-2'>
                                                <div className='flex flex-col flex-1 gap-2'>
                                                    <Label >
                                                        First Name
                                                        <Label className='text-[#7f1414]' >*</Label>
                                                    </Label>
                                                    <input
                                                        id='first_name'
                                                        type="text"
                                                        tabIndex={1}
                                                        autoFocus
                                                        value={newUserData.first_name}
                                                        onChange={(e) => setNewUserData('first_name', e.target.value)}
                                                        disabled={processingNewUser}
                                                        className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                        placeholder="Enter first name"
                                                    />
                                                    <InputError message={errorsNewUser.first_name} className='mt-1'/>
                                                </div>
                                                <div className='flex flex-col flex-1 gap-2'>
                                                    <Label >
                                                        Last Name
                                                        <Label className='text-[#7f1414]' >*</Label>
                                                    </Label>
                                                    <input
                                                        id='last_name'
                                                        type="text"
                                                        tabIndex={2}
                                                        autoFocus
                                                        value={newUserData.last_name}
                                                        onChange={(e) => setNewUserData('last_name', e.target.value)}
                                                        disabled={processingNewUser}
                                                        className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                        placeholder="Enter last name"
                                                    />
                                                    <InputError message={errorsNewUser.last_name} className='mt-1'/>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                                    Email Address
                                                    <Label className='text-[#7f1414]' >*</Label>
                                                </Label>
                                                <input
                                                    id='email'
                                                    type="email"
                                                    tabIndex={3}
                                                    autoFocus
                                                    value={newUserData.email}
                                                    onChange={(e) => setNewUserData('email', e.target.value)}
                                                    disabled={processingNewUser}
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    placeholder="Enter email address"
                                                />
                                                <InputError message={errorsNewUser.email} className='mt-1'/>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="access" className="flex flex-col gap-5 overflow-x-auto">
                                        <div>
                                            <Label className="mb-1 block text-sm font-medium mb-2">Programs & Areas</Label>
                                            {/*renderProgramsAndAreas(programRoles, newUserData, setNewUserData)*/}
                                            <div className="flex flex-col gap-3">
                                                {programRoles.map(program => {
                                                    const isProgramChecked = newUserData.assigned_programs.includes(program.program_id);
                                                    return (
                                                        <div key={program.program_id}>
                                                            <label className="flex items-center gap-3 text-sm mb-0 font-normal text-foreground">
                                                                <input
                                                                    type="checkbox"
                                                                    className="accent-ring"
                                                                    value={program.program_id}
                                                                    checked={isProgramChecked}
                                                                    onChange={(e) => onChangeProgram(program, e)}
                                                                />
                                                                {program.program_name}
                                                            </label>

                                                            {/* Show areas only if program is checked */}
                                                            {isProgramChecked && (
                                                                <div className="ml-6 mt-2">
                                                                    <div className="grid grid-cols-5 gap-2 flex-wrap">
                                                                        {program.areas?.length > 0 ? (
                                                                            program.areas.map(area => {
                                                                                const isAreaChecked = newUserData.assigned_areas.includes(area.area_id);
                                                                                return (
                                                                                    <label
                                                                                        key={area.area_id}
                                                                                        className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground"
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="accent-ring ml-2"
                                                                                            value={area.area_id}
                                                                                            checked={isAreaChecked}
                                                                                            onChange={(e) => onChangeArea(area, e)}
                                                                                        />
                                                                                        Area {area.area_number}
                                                                                    </label>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <div className="col-span-5 text-sm text-gray-500 italic">
                                                                                No areas available
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="mb-1 block text-sm font-medium">
                                                Assign Role
                                                <Label className='text-[#7f1414]' >*</Label>
                                            </Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {roles.map(role => (
                                                    <label
                                                        key={role.role_id}
                                                        className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground whitespace-nowrap">
                                                        <input
                                                            type="radio"
                                                            name="assigned_role"
                                                            value={role.role_id}
                                                            onChange={() => setNewUserData("assigned_role", role.role_id)}
                                                            className="accent-ring " />
                                                            {role.role_name}
                                                    </label>
                                                ))}
                                            </div>
                                            <InputError message={errorsNewUser.assigned_role} className='mt-1'/>
                                        </div>
                                    </TabsContent>
                                    <label className="text-sm text-gray-500 mt-2">A temporary password will be emailed to the user.</label>
                                </Tabs>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => setDialogOpen(false)}
                                        >Cancel</Button>
                                    </DialogClose>
                                    <Button variant="noborder" type='submit' onClick={addNewUser}>Submit</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>


                {/* Data Table */}
                <div className="rounded-lg border bg-white p-4">
                    <UsersDataTable
                        columns={columns}
                        data={userRecords}
                    />
                </div>
            </div>
            <Toaster
                position='top-right'
                expand={false}
            />
        </AppLayout>
    );
}
