import { DocumentRequestDataTable } from '@/components/charts/data-table';
import AppLayout from '@/layouts/app-layout';
import { FilesOverview, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { columns } from '@/components/charts/data-table-columns/requests';
import { Boxes } from 'lucide-react';

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
        </AppLayout>
    );
}
