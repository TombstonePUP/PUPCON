import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// charts components
import { DataTable } from '@/components/charts/data-table';
import GuideTour from "@/pages/test/GuideTour";
import { type ActivityLogs, type DocumentStatistics, type FrequencyUploads, type OverallUploads } from '@/types/dashboard';
import { columns } from '@/components/charts/data-table-columns/logs';
import { ChartArea, File, FileIcon, User2, User2Icon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DocumentsAnalytics } from '@/components/charts/document-analyst';
import { documentDummyStatistics, frequencyDummyUploads, overallDummyUploads } from '@/data/dummy-data';

// interface DashboardProps {
//   activityLogs: ActivityLogs[];
//   frequencyUploads: FrequencyUploads[];
//   documentStatistics: DocumentStatistics[];
//   overallUploads: OverallUploads[];
// }

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Analytics',
    href: '/dashboard',
  },
];

export default function Dashboard({ frequencyUploads, documentStatistics, overallUploads, activityLogs }: DashboardProps) {
  console.log('activityLogs:', activityLogs);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-6">
        <DocumentsAnalytics
          frequencyUploads={frequencyDummyUploads}
          overallUploads={overallDummyUploads}
          documentStatistics={documentDummyStatistics}
        />
        <GuideTour />
        <div id='stat-table' >
          <DataTable columns={columns} data={activityLogs} />
        </div>
      </div>
    </AppLayout>
  );
}
