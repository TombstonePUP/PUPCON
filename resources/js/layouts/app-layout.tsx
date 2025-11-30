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

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { url } = usePage();
    const [openHelp, setOpenHelp] = useState(false);
    const [helpText, setHelpText] = useState("");

    /** 📌 Set help content depending on route */
    useEffect(() => {
        if (url.startsWith("/dashboard")) {
            setHelpText(
                `📌 DASHBOARD HELP\n
- View system metrics and performance insights.
- Check activity logs and recent updates.
- Use the filters on the top right for quick report navigation.`
            );
        } else if (url.startsWith("/user-management")) {
            setHelpText(
                `👥 USER MANAGEMENT HELP\n
- Manage system users (add, edit, delete).
- Assign roles and permissions based on access level.
- Use the search bar to quickly find a user.`
            );
        } else {
            setHelpText(
                `ℹ️ GENERAL HELP\n\nPress F1 anytime to view help for the current page.`
            );
        }
    }, [url]);

    /** 📌 F1 keyboard listener */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "F1") {
                e.preventDefault();
                setOpenHelp(true);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>

            {/* 📌 Help Dialog (shadcn/ui) */}
            <Dialog open={openHelp} onOpenChange={setOpenHelp}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Help Center</DialogTitle>
                        <DialogDescription>
                            Quick help based on your current page.
                        </DialogDescription>
                    </DialogHeader>

                    <pre className="whitespace-pre-wrap text-sm leading-relaxed mt-2">
                        {helpText}
                    </pre>
                </DialogContent>
            </Dialog>
        </>
    );
};
