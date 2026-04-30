import { AppContent } from '@/components/admin/app-content';
import { AppShell } from '@/components/admin/app-shell';
import { AppSidebar } from '@/components/admin/app-sidebar';
import { AppSidebarHeader } from '@/components/admin/app-sidebar-header';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { toast } from 'sonner';

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
                    <main className={cn('flex flex-1 flex-col gap-4 gap-6 px-20 py-10', className)}>{children}</main>
                    <Toaster position="top-right" expand={false} />
                </AppContent>
            </AppShell>
        </ThemeProvider>
    );
}
