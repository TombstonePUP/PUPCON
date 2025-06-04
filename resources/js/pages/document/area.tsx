import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// charts components

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Area 1 - Information Technology',
        href: '/document/program/area',
    },
];

export default function Users() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Area 1 - Information Technology" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="relative overflow-hidden rounded bg-[url('/images/campus/comlab.jpg')] bg-cover bg-center bg-no-repeat shadow">
                    <div className="absolute inset-0 z-0 bg-[#7f1414]/40"></div>
                    <h1 className="relative z-10 m-2 mb-[-2vw] text-center text-[3vw] font-black text-white">Area 1</h1>
                    <h1 className="relative z-10 m-3.5 text-center text-[1.5vw] font-black text-white">Bachelor of Science in Information Technology</h1>
                </div>
                <div className="border-sidebar-border/70 relative h-[74vh] space-y-5 overflow-y-auto rounded-xl border p-4"></div>
            </div>
        </AppLayout>
    );
}
