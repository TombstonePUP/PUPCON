import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import PageHeader from '@/components/guest-page-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Layout from '@/layouts/landing-layout';
import { Exhibits } from '@/types/exhibits';
import { Head } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useState } from 'react';

interface ExhibitsProps {
    exhibits: Exhibits[];
}
export default function ExhibitsPage({ exhibits }: ExhibitsProps) {
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<{ fileUrl: string; title: string }>({
        fileUrl: '',
        title: '',
    });
    const [selectedContainer, setSelectedContainer] = useState(null);
    const [containerDialogOpen, setContainerDialogOpen] = useState(false);

    return (
        <>
            <Head title="Exhibits">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center gap-8">
                    <PageHeader
                        title="Exhibits"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Exhibits', href: '/exhibits' },
                        ]}
                    />

                    <div className="grid w-[75%] grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 py-12">
                        {exhibits.length > 0 ? (
                            exhibits.map((exhibit) => (
                                <div
                                    key={exhibit.exhibit_id}
                                    onClick={() => {
                                        if (exhibit.container) {
                                            setSelectedContainer(exhibit);
                                            setContainerDialogOpen(true);
                                        } else {
                                            if (exhibit.exhibit_outlines.length > 0) {
                                                setSelectedDoc({
                                                    fileUrl: exhibit.exhibit_outlines[0].exhibit_files?.file_path,
                                                    title: exhibit.exhibit_outlines[0].exhibit_files?.file_name,
                                                });
                                                setViewDialogOpen(true);
                                            }
                                        }
                                    }
                                    }
                                    className={`group flex flex-col p-2 gap-4 overflow-hidden rounded-xl border bg-white duration-300  hover:border-[#7f1414] hover:text-[#7f1414]  ${!exhibit.container ? `${exhibit.exhibit_outlines.length > 0 ? 'cursor-pointer' : 'grayscale'}` : 'cursor-pointer'}`}
                                >
                                    <div className='overflow-hidden rounded h-50'>
                                        <img
                                            className="h-full transition duration-300 group-hover:scale-105 object-cover"
                                            // src="/images/exhibits/student-handbook.png"
                                            src={exhibit.image_path || '/images/placeholder.png'}
                                            alt={exhibit.exhibit_name}
                                        />
                                    </div>

                                    <p className="font-bold text-center mb-4">
                                        {exhibit.exhibit_name}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-4 text-center text-gray-500">No exhibits available.</p>
                        )}
                    </div>

                </div>

                <DocumentViewer open={viewDialogOpen} onOpenChange={setViewDialogOpen} fileUrl={selectedDoc.fileUrl} title={selectedDoc.title} />
                <Dialog open={containerDialogOpen} onOpenChange={setContainerDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedContainer?.exhibit_name}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className='space-y-4'>
                            {selectedContainer?.exhibit_outlines?.length > 0 ? (
                                [...selectedContainer.exhibit_outlines]
                                    .sort((a, b) => a.category.localeCompare(b.category))
                                    .map((exhibit) => (
                                        <div
                                            key={exhibit.exhibit_outline_id}
                                            className="p-4 bg-gray-100"
                                        >
                                            <p className="font-semibold mb-1">
                                                {exhibit.category}
                                            </p>
                                            <h3
                                                onClick={() => {
                                                    if (exhibit.outline_description !== undefined) {
                                                        setSelectedDoc({
                                                            fileUrl: exhibit.exhibit_files?.file_path,
                                                            title: selectedContainer?.outline_description,
                                                        });
                                                        setViewDialogOpen(true);
                                                    }
                                                }} className={`ml-2 text-sm ${exhibit.outline_description !== undefined ? 'underline cursor-pointer text-[#7f1414]' : ''}`}>{exhibit.outline_description} </h3>
                                        </div>
                                    ))
                            ) : (
                                <p className="col-span-4 w-full text-gray-500 flex items-center justify-center">No outlines available.</p>
                            )}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>

            </Layout >
        </>
    );
}
