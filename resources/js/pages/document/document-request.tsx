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
            <div className="rounded-lg border bg-white p-3 m-3">
                <DocumentRequestDataTable columns={columns} data={files} />
            </div>
        </AppLayout>
    );
}
