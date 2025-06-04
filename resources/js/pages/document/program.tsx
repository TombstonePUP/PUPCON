import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

// charts components

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Information Technology',
        href: '/document/program',
    },
];

export default function Users() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Information Technology" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="relative overflow-hidden rounded bg-[url('/images/campus/comlab.jpg')] bg-cover bg-center bg-no-repeat shadow">
                    <div className="absolute inset-0 z-0 bg-[#7f1414]/40"></div>
                    <h1 className="relative z-10 m-3 mb-[-2vw] text-center text-[1.5vw] font-black text-white">Bachelor of Science in</h1>
                    <h1 className="relative z-10 m-3 text-center text-[3vw] font-black text-white">Information Technology</h1>
                </div>
                <div className="border-sidebar-border/70 relative h-[74vh] space-y-5 overflow-y-auto rounded-xl border p-4">
                    <Link
                        href="/document/program/area"
                        className="bg-card text-card-foreground flex h-[15%] w-full flex-col flex-row items-center justify-between gap-6 rounded-xl border px-5 py-6 shadow-sm transition-transform duration-100 hover:scale-[1.005] hover:shadow-lg"
                        style={{ background: 'linear-gradient(to right, white 60%,rgba(127, 20, 20, 0.43))' }}
                    >
                        <h1 className="pl-5 text-[1.5vw] font-black text-[#7f1414]">Vision, Mission, Goals, and Objectives</h1>
                        <p className="w-15 rounded bg-white text-center text-[2vw] font-black text-[#7f1414]">1</p>
                    </Link> <Link
                        href="/document/program/area"
                        className="bg-card text-card-foreground flex h-[15%] w-full flex-col flex-row items-center justify-between gap-6 rounded-xl border px-5 py-6 shadow-sm transition-transform duration-100 hover:scale-[1.005] hover:shadow-lg"
                        style={{ background: 'linear-gradient(to right, white 60%,rgba(127, 20, 20, 0.43))' }}
                    >
                        <h1 className="pl-5 text-[1.5vw] font-black text-[#7f1414]">Vision, Mission, Goals, and Objectives</h1>
                        <p className="w-15 rounded bg-white text-center text-[2vw] font-black text-[#7f1414]">1</p>
                    </Link> <Link
                        href="/document/program/area"
                        className="bg-card text-card-foreground flex h-[15%] w-full flex-col flex-row items-center justify-between gap-6 rounded-xl border px-5 py-6 shadow-sm transition-transform duration-100 hover:scale-[1.005] hover:shadow-lg"
                        style={{ background: 'linear-gradient(to right, white 60%,rgba(127, 20, 20, 0.43))' }}
                    >
                        <h1 className="pl-5 text-[1.5vw] font-black text-[#7f1414]">Vision, Mission, Goals, and Objectives</h1>
                        <p className="w-15 rounded bg-white text-center text-[2vw] font-black text-[#7f1414]">1</p>
                    </Link> <Link
                        href="/document/program/area"
                        className="bg-card text-card-foreground flex h-[15%] w-full flex-col flex-row items-center justify-between gap-6 rounded-xl border px-5 py-6 shadow-sm transition-transform duration-100 hover:scale-[1.005] hover:shadow-lg"
                        style={{ background: 'linear-gradient(to right, white 60%,rgba(127, 20, 20, 0.43))' }}
                    >
                        <h1 className="pl-5 text-[1.5vw] font-black text-[#7f1414]">Vision, Mission, Goals, and Objectives</h1>
                        <p className="w-15 rounded bg-white text-center text-[2vw] font-black text-[#7f1414]">1</p>
                    </Link> <Link
                        href="/document/program/area"
                        className="bg-card text-card-foreground flex h-[15%] w-full flex-col flex-row items-center justify-between gap-6 rounded-xl border px-5 py-6 shadow-sm transition-transform duration-100 hover:scale-[1.005] hover:shadow-lg"
                        style={{ background: 'linear-gradient(to right, white 60%,rgba(127, 20, 20, 0.43))' }}
                    >
                        <h1 className="pl-5 text-[1.5vw] font-black text-[#7f1414]">Vision, Mission, Goals, and Objectives</h1>
                        <p className="w-15 rounded bg-white text-center text-[2vw] font-black text-[#7f1414]">1</p>
                    </Link> <Link
                        href="/document/program/area"
                        className="bg-card text-card-foreground flex h-[15%] w-full flex-col flex-row items-center justify-between gap-6 rounded-xl border px-5 py-6 shadow-sm transition-transform duration-100 hover:scale-[1.005] hover:shadow-lg"
                        style={{ background: 'linear-gradient(to right, white 60%,rgba(127, 20, 20, 0.43))' }}
                    >
                        <h1 className="pl-5 text-[1.5vw] font-black text-[#7f1414]">Vision, Mission, Goals, and Objectives</h1>
                        <p className="w-15 rounded bg-white text-center text-[2vw] font-black text-[#7f1414]">1</p>
                    </Link> <Link
                        href="/document/program/area"
                        className="bg-card text-card-foreground flex h-[15%] w-full flex-col flex-row items-center justify-between gap-6 rounded-xl border px-5 py-6 shadow-sm transition-transform duration-100 hover:scale-[1.005] hover:shadow-lg"
                        style={{ background: 'linear-gradient(to right, white 60%,rgba(127, 20, 20, 0.43))' }}
                    >
                        <h1 className="pl-5 text-[1.5vw] font-black text-[#7f1414]">Vision, Mission, Goals, and Objectives</h1>
                        <p className="w-15 rounded bg-white text-center text-[2vw] font-black text-[#7f1414]">1</p>
                    </Link>
                    {/* <DataTable data={data} /> */}
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                </div>
            </div>
        </AppLayout>
    );
}
