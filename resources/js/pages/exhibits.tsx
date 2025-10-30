import PageHeader from '@/components/guest-page-header';
import { Button } from '@/components/ui/button';
import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Programs() {
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<{ fileUrl: string; title: string }>({
        fileUrl: '',
        title: '',
    });

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

                    <div className="grid w-[75%] grid-cols-4 gap-2 py-12">
                        <div className="group overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white duration-300 hover:border-[#7f1414]">
                            <div className="grid place-items-center bg-[linear-gradient(120deg,#7f1414_0%,#c12c2c_100%)]">
                                <img
                                    className="my-5 h-40 transition duration-300 group-hover:scale-110"
                                    src="/images/exhibits/student-handbook.png"
                                    alt="Student Handbook"
                                />
                            </div>
                            <div className="rounded-b-xl p-6">
                                <h1 className="mb-2 text-xl font-bold text-[#7f1414] group-hover:text-[#a01818]">Student Handbook</h1>
                                <p> Click to explore this interactive exhibit and discover its contents. </p>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => {
                                            setSelectedDoc({
                                                fileUrl: '/sample-files/student-handbook.pdf', // your PDF path
                                                title: 'Student Handbook',
                                            });
                                            setViewDialogOpen(true);
                                        }}
                                        className="mt-10 w-30 cursor-pointer rounded-full border-none bg-[linear-gradient(130deg,#7f1414_0%,#c12c2c_50%,#7f1414_100%)] bg-[length:200%_200%] font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-left hover:text-white"
                                    >
                                        View
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DocumentViewer open={viewDialogOpen} onOpenChange={setViewDialogOpen} fileUrl={selectedDoc.fileUrl} title={selectedDoc.title} />
            </Layout>
        </>
    );
}
