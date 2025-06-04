import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';

// charts components
import { DataTable } from "@/components/charts/data-table"
import data from "../../../../app/Dashboard/data.json"
import { Car } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Program',
        href: '/document/program',
    },
];

export default function Users() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min pt-4 pb-4">
                    <Card>
                        asd
                    </Card>
                    {/* <DataTable data={data} /> */}
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                </div>
            </div>
        </AppLayout>
    );
}
