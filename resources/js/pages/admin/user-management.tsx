import { UsersDataTable } from '@/components/admin/charts/data-table';
import { getUserColumns, getUserFilterOptions } from '@/components/admin/charts/data-table-columns/users';
import { RenderUserDialog } from '@/components/admin/dialogs/users/user-dialog-renderer';
import { PageTitle } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/admin/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AssignablePrograms, AssignableRoles, type UserRecords } from '@/types/user-management';
import { Head } from '@inertiajs/react';
import { SquareUserIcon, UserPlus } from 'lucide-react';
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

    const resolveDialog = ({ type, user }: DialogProps) => {
        setDialog({ type, user });
    };

    const columns = getUserColumns({ resolveDialog });
    const { roleOptions, programOptions } = getUserFilterOptions(roles, programRoles);

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
                {/* Header Section */}
                <div className="flex gap-6">
                    <PageTitle
                        icon={<SquareUserIcon className="size-5" />}
                        title="User Management"
                        description="Manage all user related information and access rights."
                        actions={
                            <div>
                                <Button
                                    onClick={() => openDialog('add')}
                                    className="flex w-full items-center gap-2 bg-[#7f1414] text-white hover:bg-[#7f1414]/90"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span className="hidden xl:inline">Add User</span>
                                </Button>
                            </div>
                        }
                    />
                </div>

                <div id="user-table">
                    <UsersDataTable columns={columns} data={userRecords} roleOptions={roleOptions} programOptions={programOptions} />
                </div>
                <RenderUserDialog type={dialog.type} user={dialog.user} program={programRoles} roles={roles} onClose={closeDialog} />
            </AppLayout>
        </>
    );
}
