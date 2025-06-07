import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from "@/components/charts/data-table"
import { columns } from "@/components/charts/users/columns"
import { type UserRecords } from "@/types"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Information Technology',
        href: '/manage-programs/program',
    },
];

export default function Programs() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col border-sidebar-border/70 relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-4 gap-2">
                    {/* Ensure DataTable is properly imported and data matches column expectations */}
                </div>
            </div>
        </AppLayout>
    )
}
