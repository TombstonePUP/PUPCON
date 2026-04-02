import { DocumentRequestDataTable } from '@/components/charts/data-table';
import { getRequestsColumns } from '@/components/charts/data-table-columns/requests';
import AppLayout from '@/layouts/app-layout';
import { FilesOverview, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useCallback } from 'react';

import { Boxes } from 'lucide-react';
import { useMemo, useState } from 'react';
import RenderRequestDialog from '@/components/dialogs/requests/request-dialog-renderer';
import { PageTitle } from '@/components/page-header';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Requests',
    href: `/requests`,
  },
];

interface DialogProps {
  type: 'approve' | 'reject' | 'revert' | null;
  file: FilesOverview[];
}

interface DocumentRequests {
  files: FilesOverview[];
}

export default function Requests({ files }: DocumentRequests) {
  const { auth } = usePage().props;
  const role = auth.user.roles.role_name;

  const [dialog, setDialog] = useState<{
    type: 'approve' | 'reject' | 'revert' | null;
    file: FilesOverview[];
  }>({ type: null, file: [] as FilesOverview[] });

  const openDialog = useCallback((type: 'approve' | 'reject' | 'revert' | null, file: FilesOverview[]) => {
    setDialog({ type, file });
  }, []);

  const columns = useMemo(() => {
    const generatedColumns = getRequestsColumns({
      resolveDialog: ({ type, file }: DialogProps) => openDialog(type, file),
    });

    if (role === 'Admin' || role === 'Coordinator') return generatedColumns;

    return generatedColumns.filter((column) => column.id !== 'actions');
  }, [role, openDialog]);

  const closeDialog = () => {
    setDialog({ type: null, file: {} as FilesOverview });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Requests" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
        {/* Header Section */}

        <PageTitle
          title="Document Request"
          description="Manage all document request submissions."
        />

        <div>
          <DocumentRequestDataTable columns={columns} data={files} resolveDialog={({ type, file }: DialogProps) => openDialog(type, file)} />
        </div>
      </div>
      <RenderRequestDialog type={dialog.type} file={dialog.file} onClose={closeDialog} />
    </AppLayout>
  );
}
