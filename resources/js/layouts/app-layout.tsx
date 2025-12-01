import React, { useEffect, useState } from "react";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { usePage } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { BarChart, FileText, Users, ListFilter, Info } from "lucide-react";

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </>
    );
};
