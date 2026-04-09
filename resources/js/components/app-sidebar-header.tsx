import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SharedData, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ThemeToggle } from './theme-toggle';
import DeadlineCountdown from './deadline-countdown';
import { ActivityFeed } from './activity-feed';
import { ActivityLogs } from '@/types/dashboard';
import { usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  const { activityLogs } = usePage<SharedData & { activityLogs: ActivityLogs[] }>().props;
  
  return (
    <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div className="flex items-center gap-2 mr-auto">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      {/* <ActivityFeed logs={activityLogs} /> */}
      <ThemeToggle />
    </header>
  );
}
