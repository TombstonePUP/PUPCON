import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { type PerProgram } from '@/types';

export interface ProgramProps {
    program: PerProgram;
}

export default function Users({ program }: ProgramProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-program/${program.program_id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Information Technology" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border-2 p-10 px-12">
                    <h1 className="left-[-10vw] z-10 mb-[-0.3vw] text-[1.45vw] font-black">{program.degree_type + ' in ' + program.program_name}</h1>
                    <h1 className="text-[#858585] italic">Preliminary Survey Visit</h1>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                    <div className="w-full rounded border p-7 text-center">
                        <label
                            htmlFor="programBanner"
                            className="file:bg-muted file:text-foreground hover:file:bg-accent text-foreground block grid w-full cursor-pointer place-items-center gap-2 rounded-md px-4 py-2 text-center text-[#858585] file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-upload-icon lucide-upload"
                            >
                                <path d="M12 3v12" />
                                <path d="m17 8-5-5-5 5" />
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            </svg>
                            <p className="text-[#858585]"> Upload program banner</p>
                        </label>
                        <input id="programBanner" type="file" className="hidden" />
                    </div>
                    <div>
                        <textarea
                            id="outline_description"
                            required
                            autoFocus
                            placeholder="Enter program overview"
                            className="focus:ring-ring min-h-[100px] w-full resize-y rounded border p-5 focus:ring-2 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex h-fit min-h-[13vw] min-w-[15vw] flex-1 items-center justify-center rounded border p-5 text-center">
                            To enable students to understand the different components of the information technology field, including hardware,
                            software, communication, networking, research, peopleware, and management skills.
                        </div>
                        <div className="flex h-fit min-h-[13vw] min-w-[15vw] flex-1 items-center justify-center rounded border p-5 text-center">
                            To enable students to understand the different components of the information technology field, including hardware,
                            software, communication, networking, research, peopleware, and management skills.
                        </div>
                        <div className="flex h-fit min-h-[13vw] min-w-[15vw] flex-1 items-center justify-center rounded border p-5 text-center">
                            To enable students to understand the different components of the information technology field, including hardware,
                            software, communication, networking, research, peopleware, and management skills.
                        </div>
                        <div className="flex h-fit min-h-[13vw] min-w-[15vw] flex-1 items-center justify-center rounded border p-5 text-center">
                            To enable students to understand the different components of the information technology field, including hardware,
                            software, communication, networking, research, peopleware, and management skills.
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="flex h-[8vw] min-h-[13vw] min-w-[17vw] flex-1 flex-col rounded border">
                                    <svg className="size-10" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M23.0691 15.4943V30.4837M15.5743 22.989H30.5638M41.8058 22.989C41.8058 33.337 33.4171 41.7257 23.0691 41.7257C12.721 41.7257 4.33228 33.337 4.33228 22.989C4.33228 12.6409 12.721 4.2522 23.0691 4.2522C33.4171 4.2522 41.8058 12.6409 41.8058 22.989Z"
                                            stroke="#171717"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <h1 className="text-[#858585]">Add objective</h1>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                                <DialogDescription>
                                    Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your
                                    password to confirm you would like to permanently delete your account.
                                </DialogDescription>
                                <form className="space-y-6">
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary">Cancel</Button>
                                        </DialogClose>

                                        <Button variant="destructive" asChild>
                                            <button type="submit">Delete account</button>
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="grid grid-cols-2 gap-3 overflow-x-hidden">
                        {program.areas?.length ? (
                            program.areas.map((area) => (
                                <Link
                                    key={area.area_id}
                                    href={route('manage.area', [program.program_name, area.area_id])}
                                    className="rounded border p-7 shadow"
                                >
                                    <h1 className="font-black">{area.area_number}</h1>
                                    <p className="text-[#858585]">{area.area_name}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-2 flex h-full w-full flex-col items-center justify-center">
                                <h1 className="mt-10 text-[1.5vw] font-bold">No Areas Available/Assigned</h1>
                                <p className="text-[1.2vw] text-[#858585]">Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
