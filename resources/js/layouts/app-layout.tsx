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
    const { url } = usePage();
    const [openHelp, setOpenHelp] = useState(false);
    const [helpContent, setHelpContent] = useState<React.ReactNode>(null);

    // Build styled help sections
    const Section = ({
        icon: Icon,
        title,
        children,
    }: {
        icon: any;
        title: string;
        children: React.ReactNode;
    }) => (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">{title}</h3>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
        </div>
    );

    // Route-based help content
    useEffect(() => {
        if (url.startsWith("/dashboard")) {
            setHelpContent(
                <>
                    <Section icon={BarChart} title="Analytics Overview">
                        <ul className="list-disc ml-5">
                            <li>View all analytics and system-wide reports.</li>
                            <li>File Activity Frequency: Line chart showing the last 3 months of activity.</li>
                            <li>Document Uploads Pie Chart: Current distribution of uploads.</li>
                            <li>Document Upload Progress: Displays total, completed, and pending uploads.</li>
                            <li>Area and Exhibit Document Uploads: Tracks per-area progress.</li>
                            <li>Document Statistics Bar Chart: Shows uploads, approvals, pending, and rejections.</li>
                        </ul>
                    </Section>

                    <Section icon={ListFilter} title="Activity Logs">
                        <p className="mb-2">Activity logs track all user interactions and file actions.</p>
                        <p className="mb-2">Columns include:</p>
                        <ul className="list-disc ml-5">
                            <li>Name</li>
                            <li>Area</li>
                            <li>Program</li>
                            <li>File</li>
                            <li>Activity</li>
                            <li>Date</li>
                        </ul>
                        <p className="mt-2">Columns can be toggled on/off for visibility control.</p>
                    </Section>
                </>
            );
        }

        else if (url.startsWith("/user-management")) {
            setHelpContent(
                <>
                    <Section icon={Users} title="User Management">
                        <ul className="list-disc ml-5">
                            <li>Create new users and assign proper roles and access levels.</li>
                            <li>Edit user details and update account information.</li>
                            <li>Delete inactive or unauthorized accounts.</li>
                            <li>Use the search bar to quickly filter users.</li>
                            <li>Review permissions to ensure accurate role distribution.</li>
                        </ul>
                    </Section>
                </>
            );
        }

        else {
            setHelpContent(
                <>
                    <Section icon={Info} title="General Help">
                        <p>Press F1 anytime to view context-based help for the page you are currently viewing.</p>
                    </Section>
                </>
            );
        }
    }, [url]);

    // F1 listener
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

            {/* Styled Help Dialog */}
            <Dialog open={openHelp} onOpenChange={setOpenHelp}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Help Center</DialogTitle>
                        <DialogDescription>
                            Reference and instructions based on the current page.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">{helpContent}</div>
                </DialogContent>
            </Dialog>
        </>
    );
};
