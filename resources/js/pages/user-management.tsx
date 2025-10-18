import { UsersDataTable } from '@/components/charts/data-table';
import { getUserColumns } from '@/components/charts/data-table-columns/users';
import { AssignRoleDialog } from '@/components/dialogs/users/assign-role';
import { DisableUserDialog } from '@/components/dialogs/users/disable-user';
import { EnableUserDialog } from '@/components/dialogs/users/enable-user';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AssignableAreas, AssignablePrograms, AssignableRoles, type UserRecords } from '@/types/user-management';
import { Head, useForm, usePage } from '@inertiajs/react';
import { User2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface DialogProps {
    type: 'add' | 'assign' | 'disable' | 'enable' | null;
    user: UserRecords;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/users',
    },
];

export default function Users({ userRecords, programRoles, roles }: UsersProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const columns = getUserColumns({
        programRoles,
        roles,
        resolveDialog: ({ type, user }: DialogProps) => openDialog(type, user),
    });
    const [selectedUser, setSelectedUser] = useState<UserRecords | null>(null);
    const [dialogType, setDialogType] = useState<'add' | 'assign' | 'disable' | 'enable' | null>(null);

    const openDialog = (type: 'add' | 'assign' | 'disable' | 'enable', user: UserRecords) => {
        setSelectedUser(user);
        setDialogType(type);
    }

    const closeDialog = () => {
        setSelectedUser(null);
        setDialogType(null);
    }

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
            },
        });
    };

    const onChangeProgram = (program: AssignablePrograms, e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            // Add program
            setNewUserData('assigned_programs', [...newUserData.assigned_programs, program.program_id]);
        } else {
            // Remove program
            setNewUserData(
                'assigned_programs',
                newUserData.assigned_programs.filter((id) => id !== program.program_id),
            );
            // Remove areas under this program
            setNewUserData(
                'assigned_areas',
                newUserData.assigned_areas.filter(
                    areaId => !program.areas.some((a) => a.area_id === areaId)),
            );
        }
    };

    const onChangeArea = (area: AssignableAreas, e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            // Add area
            setNewUserData('assigned_areas', [...newUserData.assigned_areas, area.area_id]);
        } else {
            // Remove area
            setNewUserData(
                'assigned_areas',
                newUserData.assigned_areas.filter((id) => id !== area.area_id),
            );
        }
    };

    const renderDialog = () => {
        if (!selectedUser) return null;

        switch (dialogType) {
            case 'assign':
                return (
                    <AssignRoleDialog
                        user={selectedUser}
                        programRoles={programRoles}
                        roles={roles}
                        onClose={closeDialog} />
                );
            case 'disable':
                return (
                    <DisableUserDialog
                        user={selectedUser}
                        onClose={closeDialog} />
                );
            case 'enable':
                return (
                    <EnableUserDialog
                        user={selectedUser}
                        onClose={closeDialog} />
                );
            default:
                return null;
        }
    };

    // Handle Export Actions for all program means
    const handleAllProgramsExport = (type) => {
        const summary = programs.map((program) => {
            const areaIds = program.assigned_areas.map((a) => a.id);
            const areaMeans = areaIds
                .map((id) => parseFloat(means[id]))
                .filter((v) => !isNaN(v));

            const programMean =
                areaMeans.length > 0
                    ? (areaMeans.reduce((a, b) => a + b, 0) / areaMeans.length).toFixed(2)
                    : "—";

            return {
                program_name: program.program_name,
                degree_type: program.degree_type,
                campus: program.campus,
                mean: programMean,
            };
        });

        console.table(summary);
        alert(`Exporting all program means as ${type.toUpperCase()}`);
    };


    return (
        <>
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
                                <Button variant="noborder" className="w-50" onClick={() => setDialogOpen(true)}>
                                    <User2 className="h-4 w-4" />
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                                <form>
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <User2 className="h-5 w-5 text-[#7f1414]" />
                                            Add User
                                        </DialogTitle>
                                        <DialogDescription>Fill in the details to create a new account</DialogDescription>
                                    </DialogHeader>
                                    <Tabs defaultValue="account" className="mt-3 mb-3 w-full">
                                        <TabsList className="mb-4 w-full">
                                            <TabsTrigger value="account">Information</TabsTrigger>
                                            <TabsTrigger value="access">Access</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="account">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex gap-2">
                                                    <div className="flex flex-1 flex-col gap-2">
                                                        <Label>
                                                            First Name
                                                            <Label className="text-[#7f1414]">*</Label>
                                                        </Label>
                                                        <input
                                                            id="first_name"
                                                            type="text"
                                                            tabIndex={1}
                                                            autoFocus
                                                            value={newUserData.first_name}
                                                            onChange={(e) => setNewUserData('first_name', e.target.value)}
                                                            disabled={processingNewUser}
                                                            className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                            placeholder="Enter first name"
                                                        />
                                                        <InputError message={errorsNewUser.first_name} className="mt-1" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col gap-2">
                                                        <Label>
                                                            Last Name
                                                            <Label className="text-[#7f1414]">*</Label>
                                                        </Label>
                                                        <input
                                                            id="last_name"
                                                            type="text"
                                                            tabIndex={2}
                                                            autoFocus
                                                            value={newUserData.last_name}
                                                            onChange={(e) => setNewUserData('last_name', e.target.value)}
                                                            disabled={processingNewUser}
                                                            className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                            placeholder="Enter last name"
                                                        />
                                                        <InputError message={errorsNewUser.last_name} className="mt-1" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                                                        Email Address
                                                        <Label className="text-[#7f1414]">*</Label>
                                                    </Label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        tabIndex={3}
                                                        autoFocus
                                                        value={newUserData.email}
                                                        onChange={(e) => setNewUserData('email', e.target.value)}
                                                        disabled={processingNewUser}
                                                        className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                        placeholder="Enter email address"
                                                    />
                                                    <InputError message={errorsNewUser.email} className="mt-1" />
                                                </div>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="access" className="flex flex-col gap-5 overflow-x-auto">
                                            <div>
                                                <Label className="mb-1 block text-sm font-medium">
                                                    Assign Role
                                                    <Label className="text-[#7f1414]">*</Label>
                                                </Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {roles.map((role) => (
                                                        <label
                                                            key={role.role_id}
                                                            className="text-foreground mb-0 flex items-center gap-2 text-sm font-normal whitespace-nowrap"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="assigned_role"
                                                                value={role.role_id}
                                                                onChange={() => setNewUserData('assigned_role', role.role_id)}
                                                                className="accent-ring"
                                                            />
                                                            {role.role_name}
                                                        </label>
                                                    ))}
                                                </div>
                                                <InputError message={errorsNewUser.assigned_role} className="mt-1" />
                                            </div>
                                            {(newUserData.assigned_role === 3 || newUserData.assigned_role === 4) && (
                                                <div>
                                                    <Label className="mb-1 mb-2 block text-sm font-medium">
                                                        Programs & Areas
                                                        <Label className="text-[#7f1414]">*</Label>
                                                    </Label>
                                                    <div className="flex flex-col gap-3">
                                                        {programRoles.map((program) => {
                                                            const isProgramChecked = newUserData.assigned_programs.includes(program.program_id);
                                                            return (
                                                                <div key={program.program_id}>
                                                                    <label className="text-foreground mb-0 flex items-center gap-3 text-sm font-normal">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="accent-ring"
                                                                            value={program.program_id}
                                                                            checked={isProgramChecked}
                                                                            disabled={processingNewUser}
                                                                            onChange={(e) => onChangeProgram(program, e)}
                                                                        />
                                                                        {program.program_name}
                                                                    </label>

                                                                    {/* Show areas only if program is checked */}
                                                                    {isProgramChecked && (
                                                                        <div className="mt-2 ml-6">
                                                                            <div className="grid grid-cols-5 flex-wrap gap-2">
                                                                                {program.areas?.length > 0 ? (
                                                                                    program.areas.map((area) => {
                                                                                        const isAreaChecked = newUserData.assigned_areas.includes(
                                                                                            area.area_id,
                                                                                        );
                                                                                        return (
                                                                                            <label
                                                                                                key={area.area_id}
                                                                                                className="text-foreground mb-0 flex items-center gap-2 text-sm font-normal"
                                                                                            >
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="accent-ring ml-2"
                                                                                                    value={area.area_id}
                                                                                                    checked={isAreaChecked}
                                                                                                    disabled={processingNewUser}
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
                                                    <InputError message={errorsNewUser.assigned_areas} className="mt-1" />
                                                    <InputError message={errorsNewUser.assigned_programs} className="mt-1" />
                                                </div>
                                            )}
                                        </TabsContent>
                                        <label className="mt-2 text-sm text-gray-500">A temporary password will be emailed to the user.</label>
                                    </Tabs>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button variant="noborder" type="submit" onClick={addNewUser}>
                                            Submit
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-lg border bg-white p-4">
                        <UsersDataTable columns={columns} data={userRecords} />
                    </div>
                </div>
            </AppLayout>
            {renderDialog()}
        </>
    );
}

