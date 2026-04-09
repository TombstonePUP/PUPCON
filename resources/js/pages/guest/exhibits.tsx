import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import PageHeader from '@/components/guest-page-header';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Layout from '@/layouts/guest/landing-layout';
import { Exhibits } from '@/types/exhibits';
import { Head, router } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Construction, Eye, FileX } from 'lucide-react';
import { useEffect, useState } from 'react';

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

    // Poll for updates every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['exhibits'], preserveScroll: true });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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

    const EmptyState = ({ title, description }: { title: string; description: string }) => (
        <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-16 text-center">
            <Construction className="mb-6 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
            <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
    );

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
                            {exhibits.map((exhibit, index) => {

                                const hasFiles = exhibit.exhibit_outlines?.some((outline) => outline.exhibit_files?.file_path) ?? false;

                            

                                return (
                                    <div
                                        key={exhibit.exhibit_id}
                                        onClick={() => {
                                            if (hasFiles) {
                                                if (exhibit.container) {
                                                    setSelectedContainer(exhibit);
                                                    setContainerDialogOpen(true);
                                                } else {
                                                    setSelectedDoc({
                                                        fileUrl: exhibit.exhibit_outlines[0].exhibit_files?.file_path,
                                                        title: exhibit.exhibit_outlines[0].exhibit_files?.file_name,
                                                    });
                                                    setViewDialogOpen(true);
                                                }
                                            }
                                        }}
                                        className={`group relative overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                                            hasFiles
                                                ? 'cursor-pointer border-gray-200 hover:-translate-y-1 hover:border-[#7f1414]'
                                                : 'border-gray-300 grayscale'
                                        }`}
                                        style={{
                                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                        }}
                                    >
                                        {/* Gradient Overlay on Hover */}
                                        {hasFiles && (
                                            <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-br from-[#7f1414]/5 to-[#dc143c]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        )}

                                        {/* Image Section */}
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#7f1414] to-[#dc143c]">
                                            {/* Decorative Circle */}
                                            {hasFiles && (
                                                <div className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full bg-white/10 transition-all duration-300 group-hover:scale-100 group-hover:opacity-60"></div>
                                            )}

                                            <div className="relative z-20 flex h-full items-center justify-center p-6">
                                                <img
                                                    src={exhibit.image_path || '/images/placeholder.png'}
                                                    alt={exhibit.exhibit_name}
                                                    className={`max-h-28 max-w-28 rounded-lg object-contain transition-all duration-300 ${
                                                        hasFiles ? 'group-hover:scale-105' : 'grayscale'
                                                    }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="relative z-20 p-4">
                                            <h3
                                                className={`mb-2 line-clamp-2 text-center text-base font-bold transition-colors duration-300 ${
                                                    hasFiles ? 'text-gray-900 group-hover:text-[#7f1414]' : 'text-gray-600'
                                                }`}
                                            >
                                                {exhibit.exhibit_name}
                                            </h3>

                                            {hasFiles && (
                                                <div className="mt-3 flex items-center justify-center">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7f1414] to-[#dc143c] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 group-hover:scale-105">
                                                        <Eye className="h-3 w-3" />
                                                        View
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mx-auto my-16 w-[75%]">
                            <EmptyState
                                title="No Exhibits Available"
                                description="There are currently no exhibits to display. Please check back later."
                            />
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
                                    <p className="text-sm text-muted-foreground">No outlines available for this exhibit.</p>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </Layout>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
