import EditableGrid from '@/components/editablegrid';
import ImageUploader from '@/components/imageuploader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
                    <h1 className="left-[-10vw] z-10 mb-[-0.3vw] text-[1.45vw] font-bold">{program.degree_type + ' in ' + program.program_name}</h1>
                    <h1 className="text-[#858585] italic">Preliminary Survey Visit</h1>
                </div>

                <div className="mt-1 flex flex-col gap-3">
                    <ImageUploader
                        onImageChange={(file) => console.log('Selected file:', file)}
                        uploadText="Upload course banner"
                        changeText="Change banner"
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
                    <EditableGrid
                        mode="faculty"
                        initialItems={[]}
                        onAdd={(facultyData) => console.log('Add faculty', facultyData)}
                        onEdit={(id, facultyData) => console.log('Edit faculty', id, facultyData)}
                        onRemove={(id) => console.log('Remove faculty', id)}
                        onUpload={(file) => console.log('Upload faculty image', file)}
                    />

                    {/* AREAS */}
                    <EditableGrid
                        mode="areas"
                        initialItems={program.areas || []}
                        onAdd={(area) => console.log('Add area', area)}
                        onEdit={(id, area) => console.log('Edit area', id, area)}
                        onRemove={(id) => console.log('Remove area', id)}
                        programName={program.program_name}
                    />

                    <div className="mb-10 flex justify-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mt-10 flex w-[80%] items-center justify-center rounded border-none p-3 text-[1vw] font-bold shadow-md">
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
                </div>
            </div>
        </AppLayout>
    );
}
