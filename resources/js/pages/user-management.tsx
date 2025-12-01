import { UsersDataTable } from '@/components/charts/data-table';
import { getUserColumns } from '@/components/charts/data-table-columns/users';
import { RenderUserDialog } from '@/components/dialogs/users/user-dialog-renderer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AssignablePrograms, AssignableRoles, type UserRecords } from '@/types/user-management';
import { Head } from '@inertiajs/react';
import { User2, User2Icon } from 'lucide-react';
import { useState } from 'react';

interface UsersProps {
    userRecords: UserRecords[];
    programRoles: AssignablePrograms[];
    roles: AssignableRoles[];
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
    const [dialog, setDialog] = useState<{
        type: 'add' | 'assign' | 'disable' | 'enable' | null;
        user?: UserRecords;
    }>({ type: null });

    const columns = getUserColumns({
        programRoles,
        roles,
        resolveDialog: ({ type, user }: DialogProps) => openDialog(type, user),
    });

    const openDialog = (type: 'add' | 'assign' | 'disable' | 'enable', user?: UserRecords) => {
        setDialog({ type, user });
    };

    const closeDialog = () => {
        setDialog({ type: null });
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="User Management" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                    {/* Header Section */}
                    <div className="flex gap-6">
                        <div id="header" className="mb-2 w-full rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                                    <User2Icon className="h-6 w-6 stroke-[2.5] text-white" />
                                </div>
                                <div className="ml-2">
                                    <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
                                    <p className="text-sm text-gray-500">Manage all user related information and access rights.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Quick Links */}
                        <div className="w-fit min-w-3xs shrink-0">
                            <div className="sticky top-6 space-y-4">
                                <div className="rounded-lg border border-gray-200 bg-white p-4">
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Program Actions</h3>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => openDialog('add')}
                                            className="flex w-full cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-8 py-2 text-sm font-medium text-white transition hover:bg-[#7f1414]/90"
                                        >
                                            <User2 className="h-4 w-4" />
                                            Add User
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="animate-in fade-in-0 w-full rounded-lg border bg-white p-4 duration-500">
                            <UsersDataTable columns={columns} data={userRecords} />
                        </div>
                    </div>
                </div>
                <RenderUserDialog type={dialog.type} user={dialog.user} program={programRoles} roles={roles} onClose={closeDialog} />
            </AppLayout>
        </>
    );
}
