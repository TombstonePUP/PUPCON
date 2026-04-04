import React, { useEffect, useState } from "react";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { usePage } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";
import GuideTour from "@/components/tour/guide-tour";
import { TourProvider } from "@/components/tour/tour-context";
import { Monitor } from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    return (
        <TourProvider>
            {/* Mobile Block */}
            <div className="flex flex-col items-center justify-center h-screen p-6 text-center bg-secondary/30 lg:hidden">
                <div className="rounded-2xl bg-white p-8 shadow-sm border border-border max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7f1414]/10 mb-4">
                        <Monitor className="h-7 w-7 text-[#7f1414]" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Desktop Required</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The Administrator Dashboard is only available on desktop devices to preserve data table integrity.
                    </p>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
                <GuideTour />
                <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props} >
                    {children}
                </AppLayoutTemplate>
            </div>
        </TourProvider>
    );
};
