import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// charts components
import { AreaProgress } from '@/components/charts/area-progress-list';
import { DataTable } from '@/components/charts/data-table';
import { OverallProgress } from '@/components/charts/overall-progress';
import { UploadFrequency } from '@/components/charts/upload-frequency';
import GuideTour from "@/pages/test/GuideTour";




import { type ActivityLogs, type DocumentStatistics, type FrequencyUploads, type OverallUploads } from '@/types/dashboard';

import { columns } from '@/components/charts/data-table-columns/logs';
import { ChartArea, File, FileIcon, User2, User2Icon } from 'lucide-react';

interface DashboardProps {
    activityLogs: ActivityLogs[];
    frequencyUploads: FrequencyUploads[];
    documentStatistics: DocumentStatistics[];
    overallUploads: OverallUploads[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/dashboard',
    },
];

export default function Dashboard({ frequencyUploads, documentStatistics, overallUploads, activityLogs }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-6">
                <div id="header" className="mb-2 rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                                <ChartArea className="h-6 w-6 stroke-[2.5] text-white" />
                            </div>
                            <div className="ml-2">
                                <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
                                <p className="text-sm text-gray-500">View all analytics and reports.</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="mb-2 rounded-lg border border-gray-200 bg-white p-6"></div>
                    <div className="mb-2 rounded-lg border border-gray-200 bg-white p-6"></div>

                    <div className="mb-2 rounded-lg border border-gray-200 bg-white p-6"></div>

                </div> */}
                <div id="stats-card" className="grid auto-rows-min gap-4 md:grid-cols-3">

                    <div id="stats-card-left">
                        <UploadFrequency data={frequencyUploads} /></div>
                    <div id="stats-card-center">
                        <OverallProgress data={overallUploads} /></div>
                    <div id="stats-card-right">  <AreaProgress data={documentStatistics} /></div>
                </div>
                <GuideTour />
                <div id='stat-table' className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border p-4 md:min-h-md">
                    <DataTable columns={columns} data={activityLogs} />
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                </div>


            </div>
        </AppLayout>
    );
}
