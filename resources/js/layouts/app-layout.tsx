import { TourProvider } from '@/components/tour/tour-context';
import { TourMask } from '@/components/tour/tour-mask';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { Monitor, MonitorSmartphone } from 'lucide-react';
import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
}

export default ({ children, breadcrumbs, className, ...props }: AppLayoutProps) => {
    return (
        <TourProvider>
            {/* Mobile Block */}
            <div className="bg-secondary/30 flex h-screen flex-col items-center justify-center p-6 text-center lg:hidden">
                <div className="bg-card border-border max-w-sm rounded-2xl border p-8 shadow-sm">
                    <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                        <MonitorSmartphone className="text-primary h-7 w-7" />
                    </div>
                    <h2 className="text-foreground mb-2 text-xl font-bold">Desktop Recommended</h2>
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                        The management dashboard is optimized for larger screens. Please use a desktop or tablet for the best experience.
                    </p>
                    <div className="text-primary bg-primary/5 border-primary/10 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium">
                        <Monitor className="h-4 w-4" />
                        <span>Switch to a larger screen</span>
                    </div>
                </div>
            </div>

            {/* Desktop Layout Wrapper */}
            <div className="hidden lg:block">
                <AppLayoutTemplate breadcrumbs={breadcrumbs} className={className} {...props}>
                    {children}
                </AppLayoutTemplate>
            </div>

            {/* Context-Aware Global Tour Mask */}
            <TourMask />
        </TourProvider>
    );
};
