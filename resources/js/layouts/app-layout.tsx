import React, { useEffect, useState } from "react";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { usePage } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";
import GuideTour from "@/components/tour/guide-tour";
import { TourProvider } from "@/components/tour/tour-context";

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    return (
        <TourProvider>
            <GuideTour />
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props} >
                {children}
            </AppLayoutTemplate>
        </TourProvider>
    );
};
