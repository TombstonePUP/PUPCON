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
    console.log(files);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Requests" />
            <div className='p-6 space-y-6'>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Exhibits Management</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage program exhibits and documentation</p>
                </div>

                <div className="rounded-lg border bg-white p-5 pt-3">
                    <DocumentRequestDataTable columns={columns} data={files} />
                </div>
            </div>
        </AppLayout>
    );
}
