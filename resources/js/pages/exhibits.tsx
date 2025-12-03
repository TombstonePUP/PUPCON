import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import PageHeader from '@/components/guest-page-header';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Layout from '@/layouts/landing-layout';
import { Exhibits } from '@/types/exhibits';
import { Head } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { FileX, FolderOpen } from 'lucide-react';
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

    // Group exhibits by category
    const groupedExhibits =
        selectedContainer?.exhibit_outlines?.reduce((acc, exhibit) => {
            const category = exhibit.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(exhibit);
            return acc;
        }, {}) || {};

    // Sort categories alphabetically
    const sortedCategories = Object.keys(groupedExhibits).sort();

    const handleClick = (exhibit) => {
        if (exhibit.outline_description !== undefined) {
            setSelectedDoc({
                fileUrl: exhibit.exhibit_files?.file_path,
                title: exhibit.outline_description,
            });
            setViewDialogOpen(true);
        }
    };

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

                    {exhibits.length > 0 ? (
                        <div className="grid w-[75%] grid-cols-2 gap-4 py-12 lg:grid-cols-3 xl:grid-cols-5">
                            {exhibits.map((exhibit) => (
                                <div
                                    key={exhibit.exhibit_id}
                                    onClick={() => {
                                        if (exhibit.container && exhibit.exhibit_outlines.length > 0) {
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
                                    }}
                                    className={`group flex flex-col gap-4 overflow-hidden rounded-xl border bg-white p-2 duration-300 hover:border-[#7f1414] hover:text-[#7f1414] ${exhibit.exhibit_outlines.length > 0 ? 'cursor-pointer' : 'grayscale'}`}
                                >
                                    <div className='overflow-hidden rounded h-50 w-full'>
                                        <img
                                            className="h-full object-cover transition duration-300 group-hover:scale-105"
                                            src={exhibit.image_path || '/images/placeholder.png'}
                                            alt={exhibit.exhibit_name}
                                        />
                                    </div>

                                    <p className="mb-4 text-center font-bold">{exhibit.exhibit_name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[500px] w-full items-center justify-center py-12">
                            <div className="flex max-w-md flex-col items-center gap-4 text-center">
                                <div className="rounded-full bg-gray-100 p-6">
                                    <FolderOpen className="h-16 w-16 text-gray-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900">No Exhibits Available</h3>
                                    <p className="text-sm text-gray-500">
                                        There are currently no exhibits to display. Exhibits will appear here once they are uploaded and made
                                        available.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DocumentViewer open={viewDialogOpen} onOpenChange={setViewDialogOpen} fileUrl={selectedDoc.fileUrl} title={selectedDoc.title} />
                <Dialog open={containerDialogOpen} onOpenChange={setContainerDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedContainer?.exhibit_name}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="space-y-4">
                            {selectedContainer?.exhibit_outlines?.length > 0 ? (
                                sortedCategories.map((category) => (
                                    <div key={category} className="space-y-2 rounded bg-gray-100 p-4">
                                        <h2 className="pb-1 text-lg font-bold text-gray-800">{category}</h2>
                                        {groupedExhibits[category].map((exhibit) => (
                                            <div key={exhibit.exhibit_outline_id} className="ml-4">
                                                <h3
                                                    onClick={() => handleClick(exhibit)}
                                                    className={`text-sm ${
                                                        exhibit.outline_description !== undefined
                                                            ? 'cursor-pointer text-[#7f1414] underline hover:text-[#a01c1c]'
                                                            : ''
                                                    }`}
                                                >
                                                    {exhibit.outline_description}
                                                </h3>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div className="flex w-full flex-col items-center justify-center gap-3 py-8">
                                    <div className="rounded-full bg-gray-100 p-4">
                                        <FileX className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500">No outlines available for this exhibit.</p>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </Layout>
        </>
    );
}
