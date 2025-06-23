import { DataTable } from '@/components/charts/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { columns } from '@/components/charts/data-table-columns/requests';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exhibits',
        href: `/manage-exhibits`,
    },
];

export default function Requests() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exhibits" />
            <div className="grid grid-cols-5 rounded-lg bg-white p-3 m-3">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="group overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white duration-300 hover:border-[#7f1414]">
                            {/* <Button className="grid place-items-center bg-[linear-gradient(120deg,#7f1414_0%,#c12c2c_100%)]"> */}
                                <img
                                    className="my-5 h-40 transition duration-300 group-hover:scale-110"
                                    src="/images/exhibits/student-handbook.png"
                                    alt="Student Handbook"
                                />
                                <h1 className="mb-2 text-xl font-bold text-[#7f1414] group-hover:text-[#a01818]">Student Handbook</h1>
                                <p> Click to explore this interactive exhibit and discover its contents. </p>
                            {/* </Button> */}
                            <div className="rounded-b-xl p-6">

                                <div className="flex justify-end">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="mt-10 w-30 cursor-pointer rounded-full border-none bg-[linear-gradient(130deg,#7f1414_0%,#c12c2c_50%,#7f1414_100%)] bg-[length:200%_200%] font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-left hover:text-white">
                                                View
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    ></path>
                                                </svg>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Student Handbook</DialogTitle>
                                                <DialogDescription>none</DialogDescription>
                                            </DialogHeader>
                                            {/* content */}
                                            <div></div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </Button >
                    </DialogTrigger>
                </Dialog>
            </div>
        </AppLayout>
    );
}
