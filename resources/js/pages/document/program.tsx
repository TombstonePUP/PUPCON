import EditableGrid from '@/components/editablegrid';
import ImageUploader from '@/components/imageuploader';
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
                    <ImageUploader
                        onImageChange={(file) => console.log('Selected file:', file)}
                        uploadText="Upload course thumbnail"
                        changeText="Change thumbnail"
                        maxSizeMB={10}
                    />
                    <div>
                        <textarea
                            id="outline_description"
                            required
                            autoFocus
                            placeholder="Enter program overview"
                            className="focus:ring-ring min-h-[100px] w-full resize-y rounded border p-5 focus:ring-2 focus:outline-none"
                        />
                    </div>
                    <h1 className="mt-10 rounded border p-1 text-center text-[1vw] font-black text-white">
                        <div className="rounded bg-[#3b3a3a] p-2">OBJECTIVES</div>
                    </h1>

                    {/* objectives */}
                    <EditableGrid
                        mode="objectives"
                        initialItems={[
                            { id: '1', content: 'First objective...', type: 'text' },
                            { id: '2', content: 'Second objective...', type: 'text' },
                        ]}
                        onAdd={(content) => console.log('Adding:', content)}
                        onEdit={(id, content) => console.log('Editing:', id, content)}
                        onRemove={(id) => console.log('Removing:', id)}
                    />

                    {/* gallery  */}
                    <EditableGrid
                        mode="gallery"
                        initialItems={[
                            { id: '1', content: '/images/image1.jpg', type: 'image' },
                            { id: '2', content: '/images/image2.jpg', type: 'image' },
                        ]}
                        onUpload={(file) => console.log('Uploading:', file)}
                        onRemove={(id) => console.log('Removing image:', id)}
                    />

                    {/* FACULTIES */}
                    <div>
                        <h1 className="mt-10 rounded border p-1 text-center text-[1vw] font-black text-white">
                            <div className="rounded bg-[#3b3a3a] p-2">FACULTIES</div>
                        </h1>
                        <div></div>
                    </div>

                    <div className="flex justify-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mt-10 flex w-[80%] items-center justify-center rounded border-none p-3 text-[1vw] font-black shadow-md">
                                    SUBMIT
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>This action will submit your uploads and progress to the admin.</DialogDescription>
                                <form className="space-y-6">
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary">Cancel</Button>
                                        </DialogClose>

                                        <Button>Submit</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* AREAS */}
                    <div className="flex flex-col gap-3">
                        <h1 className="mt-10 rounded border p-1 text-center text-[1vw] font-black text-white">
                            <div className="rounded bg-[#3b3a3a] p-2">AREAS</div>
                        </h1>
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
            </div>
        </AppLayout>
    );
}
