import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// charts components
import { ProgressChart } from "@/components/charts/progress-chart";
import { AreaProgress } from "@/components/charts/area-progress-list";
import { OverallProgress } from "@/components/charts/overall-progress";
import { DataTable } from "@/components/charts/data-table"

import {
    type ActivityLogs,
    type FrequencyUploads,
    type DocumentStatistics,
    type OverallUploads
} from "@/types"

import { columns } from "@/components/charts/data-table-columns/logs"

interface DashboardProps {
    activityLogs: ActivityLogs[];
    frequencyUploads: FrequencyUploads[];
    documentStatistics: DocumentStatistics[];
    overallUploads: OverallUploads[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ frequencyUploads, documentStatistics, overallUploads, activityLogs } : DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <ProgressChart data = { frequencyUploads }/>
                    <OverallProgress data = { overallUploads }/>
                    <AreaProgress data = { documentStatistics }/>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4">
                    <DataTable columns={ columns } data={ activityLogs } />
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                </div>
            </div>
        </AppLayout>
    );
}
