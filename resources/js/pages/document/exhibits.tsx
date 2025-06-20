import { DataTable } from '@/components/charts/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { columns } from '@/components/charts/data-table-columns/requests';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exhibits',
        href: `/manage-exhibits`,
    },
];

export default function Requests() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exhibits" />
            <div className="grid grid-cols-5 rounded-lg bg-white p-3 m-3">
                
            </div>
        </AppLayout>
    );
}
