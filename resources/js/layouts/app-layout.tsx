import React, { useEffect, useState } from "react";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { usePage } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props} >
                {children}
            </AppLayoutTemplate>
        </>
    );
};
