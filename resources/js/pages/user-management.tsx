import { UsersDataTable } from '@/components/charts/data-table';
import { getUserColumns, getUserFilterOptions } from '@/components/charts/data-table-columns/users';
import { RenderUserDialog } from '@/components/dialogs/users/user-dialog-renderer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AssignablePrograms, AssignableRoles, type UserRecords } from '@/types/user-management';
import { Head } from '@inertiajs/react';
import { SquareUserIcon, User2, User2Icon } from 'lucide-react';
import { useState } from 'react';
import GuideTour from "@/pages/test/GuideTour";
import { ActionCard, PageTitle } from '@/components/page-header';


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

  const columns = getUserColumns({ programRoles, roles, resolveDialog });
  const { roleOptions, programOptions } = getUserFilterOptions(roles, programRoles);


  const openDialog = (type: 'add' | 'assign' | 'disable' | 'enable', user?: UserRecords) => {
    setDialog({ type, user });
  };

  const closeDialog = () => {
    setDialog({ type: null });
  };


  return (
    <>
      <GuideTour />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="User Management" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
          {/* Header Section */}
          <div className="flex gap-6">
            <PageTitle
              icon={<SquareUserIcon className="size-5" />}
              title="User Management"
              description="Manage all user related information and access rights."
              actions={
                <Button
                  onClick={() => openDialog('add')}
                  className="w-full flex items-center gap-2 bg-[#7f1414] text-white hover:bg-[#7f1414]/90"
                >
                  <User2 className="h-4 w-4" />
                  Add User
                </Button>
              }
            />
          </div>

          <div id='user-table'>
            <UsersDataTable
              columns={columns}
              data={userRecords}
              roleOptions={roleOptions}
              programOptions={programOptions}
            />
          </div>
        </div>
        <RenderUserDialog type={dialog.type} user={dialog.user} program={programRoles} roles={roles} onClose={closeDialog} />
      </AppLayout>
    </>
  );
}
