import { DataTable } from '@/components/admin/charts/data-table';
import { columns } from '@/components/admin/charts/data-table-columns/logs';
import { DocumentsAnalytics } from '@/components/admin/charts/document-analyst';
import DeadlineCountdown from '@/components/deadline-countdown';
import { PageTitle } from '@/components/admin/page-header';
import GuideTour from '@/components/admin/tour/guide-tour';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { activityDummyLogs, documentDummyStatistics, frequencyDummyUploads, overallDummyUploads } from '@/data/dummy-data';
import AppLayout from '@/layouts/admin/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { type ActivityLogs, type DocumentStatistics, type FrequencyUploads, type OverallUploads } from '@/types/dashboard';
import { Head, usePage } from '@inertiajs/react';
import { subDays } from 'date-fns';
import { Calendar, Clock, FileCheck2, FileClock, FileX2, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

function useLiveDateTime() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return now;
}

function TrendBadge({ trend, label }: { trend: number; label: string }) {
    const isPositive = label !== 'Rejected' ? trend > 0 : trend < 0;
    const isUp = trend > 0;

    return (
        <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
        >
            {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {isUp ? '+' : ''}
            {trend}
        </span>
    );
}

const USE_DUMMY = false;

interface DashboardProps {
    activityLogs: ActivityLogs[];
    frequencyUploads: FrequencyUploads[];
    documentStatistics: DocumentStatistics[];
    overallUploads: OverallUploads[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Analytics', href: '/dashboard' }];

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function Dashboard({ frequencyUploads, documentStatistics, overallUploads, activityLogs }: DashboardProps) {
    const activeFrequency = USE_DUMMY ? frequencyDummyUploads : frequencyUploads;
    const activeStatistics = USE_DUMMY ? documentDummyStatistics : documentStatistics;
    const activeUploads = USE_DUMMY ? overallDummyUploads : overallUploads;
    const activeLogs = USE_DUMMY ? activityDummyLogs : activityLogs;

    const approved = activeStatistics.find((d) => d.file_status === 'Approved')?.documents ?? 0;
    const pending = activeStatistics.find((d) => d.file_status === 'Pending')?.documents ?? 0;
    const rejected = activeStatistics.find((d) => d.file_status === 'Rejected')?.documents ?? 0;
    const totalUsers = activeLogs.filter((l) => l.type === 'User Management').length;

    const last7Days = activeLogs.filter((l) => new Date(l.activity_date) >= subDays(new Date(), 7));
    const last7Approved = last7Days.filter((l) => l.activity === 'Approve').length;
    const last7Pending = last7Days.filter((l) => l.activity === 'Upload').length;
    const last7Rejected = last7Days.filter((l) => l.activity === 'Reject').length;
    const last7Users = last7Days.filter((l) => l.type === 'User Management').length;

    const statConfig = [
        {
            label: 'Approved',
            value: approved,
            desc: 'Total documents approved',
            icon: FileCheck2,
            iconClass: 'text-green-600 dark:text-green-400',
            trend: last7Approved,
        },
        {
            label: 'Pending',
            value: pending,
            desc: 'Awaiting review or approval',
            icon: FileClock,
            iconClass: 'text-yellow-600 dark:text-yellow-400',
            trend: last7Pending,
        },
        {
            label: 'Rejected',
            value: rejected,
            desc: 'Documents that were rejected',
            icon: FileX2,
            iconClass: 'text-destructive',
            trend: last7Rejected,
        },
        {
            label: 'Logs',
            value: totalUsers,
            desc: 'User-related activity logs',
            icon: Users,
            iconClass: 'text-muted-foreground',
            trend: last7Users,
        },
    ];

    const now = useLiveDateTime();

    const formattedTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <PageTitle
                title={`${getGreeting()}, ${auth.user.first_name}!`}
                description="Here's an overview of your document activities and statistics."
                actions={
                    <div className="flex items-center gap-5">
                        <div className="hidden flex-col items-end gap-0 lg:flex">
                            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span>{formattedDate}</span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                <Clock className="h-3 w-3 shrink-0" />
                                <span className="tabular-nums">{formattedTime}</span>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="hidden h-10 lg:block" />
                        <DeadlineCountdown />
                    </div>
                }
            />

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {statConfig.map(({ label, icon: Icon, value, desc, iconClass, trend }) => (
                    <Card key={label}>
                        <CardHeader className="bg-muted/50 relative flex flex-row items-center justify-between space-y-0 border-b py-4 pb-3">
                            <CardTitle className="text-foreground text-sm">{label}</CardTitle>
                            <Icon
                                className={`bg-muted/50 absolute right-6 -bottom-6 size-12 rounded-full border p-3 backdrop-blur-lg ${iconClass}`}
                            />
                        </CardHeader>
                        <CardContent className="space-y-1 pt-3">
                            <div className="flex items-baseline gap-2">
                                <div className="text-2xl font-bold">{value}</div>
                                {trend !== 0 && <TrendBadge trend={trend} label={label} />}
                            </div>
                            <p className="text-muted-foreground text-xs">{desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DocumentsAnalytics frequencyUploads={activeFrequency} overallUploads={activeUploads} documentStatistics={activeStatistics} />

            <GuideTour />
            <div id="stat-table">
                <DataTable columns={columns} data={activeLogs} />
            </div>
        </AppLayout>
    );
}
