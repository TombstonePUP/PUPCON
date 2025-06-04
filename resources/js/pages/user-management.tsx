import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// charts components
import { DataTable } from "@/components/charts/users/user-table"

import { columns } from "@/components/charts/users/columns"
import { type UserRecords } from "@/types"

interface UsersProps {
    userRecords: UserRecords[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Users({ userRecords }: UsersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min pt-4 pb-4">
                    <DataTable columns={columns} data={userRecords} />
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                </div>
            </div>
        </AppLayout>
    );
}
