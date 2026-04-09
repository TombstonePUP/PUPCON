import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';


export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  className,
}: {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}) {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.type === 'success') {
      toast.success(flash.title, {
        description: flash.message,
      });
    } else if (flash?.type === 'error') {
      toast.error(flash.title, {
        description: flash.message,
      });
    } else if (flash?.type === 'info') {
      toast.info(flash.title, {
        description: flash.message,
      });
    }
  }, [flash]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar">
          <AppSidebarHeader breadcrumbs={breadcrumbs} />
          <main className={cn('flex flex-1 flex-col gap-4 px-20 py-10 gap-8', className)}>
            {children}
          </main>
          <Toaster position="top-right" expand={false} />
        </AppContent>
      </AppShell>
    </ThemeProvider>
  );
}
