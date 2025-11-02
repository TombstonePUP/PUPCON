import { DocumentRequestDataTable } from '@/components/charts/data-table';
import AppLayout from '@/layouts/app-layout';
import { FilesOverview, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { columns } from '@/components/charts/data-table-columns/requests';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: `/requests`,
    },
];

interface DocumentRequests {
    files: FilesOverview[];
}

export default function Requests({ files }: DocumentRequests) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Requests" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Document Requests</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage document requests and approvals</p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <DocumentRequestDataTable columns={columns} data={files} />
                </div>
            </div>
        </AppLayout>
    );
}
