import React from "react";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import type { BreadcrumbItem } from "@/types";
import { TourProvider } from "@/components/tour/tour-context";
import { TourMask } from "@/components/tour/tour-mask";
import { MonitorSmartphone, Monitor } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export default ({ children, breadcrumbs, className, ...props }: AppLayoutProps) => {
    return (
        <TourProvider>
            {/* Mobile Block */}
            <div className="flex flex-col items-center justify-center h-screen p-6 text-center bg-secondary/30 lg:hidden">
                <div className="rounded-2xl bg-card p-8 shadow-sm border border-border max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <MonitorSmartphone className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Desktop Recommended</h2>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        The management dashboard is optimized for larger screens. Please use a desktop or tablet for the best experience.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary bg-primary/5 py-2 px-3 rounded-lg border border-primary/10">
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
