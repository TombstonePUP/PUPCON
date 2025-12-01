import { DocumentRequestDataTable } from '@/components/charts/data-table';
import { getRequestsColumns } from '@/components/charts/data-table-columns/requests';
import AppLayout from '@/layouts/app-layout';
import { FilesOverview, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useCallback } from 'react';

import { Boxes } from 'lucide-react';
import { useMemo, useState } from 'react';
import RenderRequestDialog from '@/components/dialogs/requests/request-dialog-renderer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: `/requests`,
    },
];

interface DialogProps {
    type: 'approve' | 'reject' | 'revert' | null;
    file: FilesOverview;
}

interface DocumentRequests {
    files: FilesOverview[];
}

export default function Requests({ files }: DocumentRequests) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;

    const [dialog, setDialog] = useState<{
        type: 'approve' | 'reject' | 'revert' | null;
        file: FilesOverview;
    }>({ type: null, file: {} as FilesOverview });

    const openDialog = useCallback((type: 'approve' | 'reject' | 'revert', file: FilesOverview) => {
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
                <div id="header" className="mb-2 rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                            <Boxes className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-2">
                            <h1 className="text-xl font-semibold text-gray-900">Document Request</h1>
                            <p className="text-sm text-gray-500">Manage all document request submissions.</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <DocumentRequestDataTable columns={columns} data={files} />
                </div>
            </div>
            <RenderRequestDialog type={dialog.type} file={dialog.file} onClose={closeDialog} />
        </AppLayout>
    );
}
