import AppLayout from '@/layouts/app-layout';
import { SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/charts/data-table';
import { type ActivityLogs, type DocumentStatistics, type FrequencyUploads, type OverallUploads } from '@/types/dashboard';
import { columns } from '@/components/charts/data-table-columns/logs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentsAnalytics } from '@/components/charts/document-analyst';
import { activityDummyLogs, documentDummyStatistics, frequencyDummyUploads, overallDummyUploads } from '@/data/dummy-data';
import { ChartArea, FileCheck2, FileClock, FileX2, Users } from 'lucide-react';
import { PageTitle } from '@/components/page-header';
import { useEffect, useState } from 'react';

function useLiveDateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
}

const USE_DUMMY = true; // ← toggle this

interface DashboardProps {
  activityLogs: ActivityLogs[];
  frequencyUploads: FrequencyUploads[];
  documentStatistics: DocumentStatistics[];
  overallUploads: OverallUploads[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Analytics', href: '/dashboard' },
];

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

  const approved = activeStatistics.find(d => d.file_status === 'Approved')?.documents ?? 0;
  const pending = activeStatistics.find(d => d.file_status === 'Pending')?.documents ?? 0;
  const rejected = activeStatistics.find(d => d.file_status === 'Rejected')?.documents ?? 0;
  const totalUsers = activityLogs.filter(l => l.type === 'Users').length;

  const statConfig = [
    {
      label: 'Approved Documents',
      value: approved,
      desc: 'Total documents approved',
      icon: FileCheck2,
      iconClass: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Pending Documents',
      value: pending,
      desc: 'Awaiting review or approval',
      icon: FileClock,
      iconClass: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Rejected Documents',
      value: rejected,
      desc: 'Documents that were rejected',
      icon: FileX2,
      iconClass: 'text-destructive',
    },
    {
      label: 'User Activities',
      value: totalUsers,
      desc: 'User-related activity logs',
      icon: Users,
      iconClass: 'text-muted-foreground',
    },
  ];

  const now = useLiveDateTime();

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
  });

  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Analytics" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-6">
        <PageTitle
          title={`${getGreeting()}, ${auth.user.first_name}!`}
          description='Welcome back to the accreditation portal.'
          actions={
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium text-foreground">{formattedTime}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formattedDate}</p>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {statConfig.map(({ label, icon: Icon, value, desc, iconClass }) => (
            <Card key={label}>
              <CardHeader className="relative flex flex-row items-center justify-between py-4 pb-3 space-y-0 bg-muted/50 border-b rounded-t-lg">
                <CardTitle className="text-sm text-foreground">{label}</CardTitle>
                <Icon className={`size-12 absolute -bottom-6 right-6 bg-muted/50 rounded-full p-3 border backdrop-blur-lg ${iconClass}`} />
              </CardHeader>
              <CardContent className="pt-3">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <DocumentsAnalytics
          frequencyUploads={activeFrequency}
          overallUploads={activeUploads}
          documentStatistics={activeStatistics}
        />

        <div id="stat-table">
          <DataTable columns={columns} data={activityLogs} />
        </div>
      </div>
    </AppLayout>
  );
}