import { UsersDataTable } from '@/components/charts/data-table';
import { getUserColumns } from '@/components/charts/data-table-columns/users';
import { AssignRoleDialog } from '@/components/dialogs/users/assign-role';
import { DisableUserDialog } from '@/components/dialogs/users/disable-user';
import { EnableUserDialog } from '@/components/dialogs/users/enable-user';
import { RenderUserDialog } from '@/components/dialogs/users/user-dialog-renderer';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AssignablePrograms, AssignableRoles, type UserRecords } from '@/types/user-management';
import { Head } from '@inertiajs/react';
import { User2 } from 'lucide-react';
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
    }>({ kind: null });

    const columns = getUserColumns({
        programRoles,
        roles,
        resolveDialog: ({ type, user }: DialogProps) => openDialog(type, user),
    });

    const openDialog = (
        type: 'add' | 'assign' | 'disable' | 'enable',
        user?: UserRecords,
    ) => {
        setDialog({ type, user });
    }

    const closeDialog = () => {
        setDialog({ type: null });
    }

    /* const renderDialog = () => {
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
    }; */

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
                        <Button
                            variant="noborder"
                            className="w-50"
                            onClick={() => openDialog('add')}
                        >
                            <User2 className="h-4 w-4" />
                            Add User
                        </Button>
                    </div>
                    {/* Data Table */}
                    <div className="rounded-lg border bg-white p-4">
                        <UsersDataTable columns={columns} data={userRecords} />
                    </div>
                </div>
            </AppLayout>
            {<RenderUserDialog
                type={dialog.type}
                user={dialog.user}
                program={programRoles}
                roles={roles}
                onClose={closeDialog}
            />
            }
        </>
    );
}

