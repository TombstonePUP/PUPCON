import { DataTable } from '@/components/charts/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { columns } from '@/components/charts/data-table-columns/requests';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: `/requests`,
    },
];

export default function Requests() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Requests" />
            <div className="rounded-lg border bg-white p-3 m-3">
                <DataTable columns={columns} data={[]} />
            </div>
        </AppLayout>
    );
}
