'use client';

import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { ContentPages } from '@/types/content';
import { Head } from '@inertiajs/react';

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Document, Page, pdfjs } from 'react-pdf';

import { AlertCircle, Construction } from 'lucide-react';
import React, { useState } from 'react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Construction className="mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
    </div>
);

const Certificate: React.FC<{ certificate: ContentPages }> = ({ certificate }) => {
    const [hasLoadError, setHasLoadError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const url = certificate.certificate_of_authenticity;
    const scale = 1.1;

    const ErrorState = () => (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-red-300 bg-red-50 p-12 shadow">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-base font-medium text-red-700">Failed to load document.</p>
        </div>
    );

    if (!url) {
        return (
            <Layout>
                <div className="flex flex-col items-center">
                    <PageHeader
                        title="Certificate of Authenticity"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Authenticity', href: '/certificate' },
                        ]}
                    />

                    <div className="mx-auto my-16 w-[75%]">
                        <EmptyState title="No Certificate Available" description="The certificate of authenticity has not been uploaded yet." />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <Head title="Certificate of Authenticity - PUP San Juan" />

            <Layout>
                <div
                    className="relative flex w-full flex-col items-center bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/images/campus/ground.jpg')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(128,0,0,0.64)] to-[rgb(255,255,255)]"></div>

                    <div className="relative z-10 flex w-full flex-col items-center">
                        <PageHeader
                            title="Certificate of Authenticity"
                            breadcrumbs={[
                                { label: 'Home', href: '/' },
                                { label: 'Authenticity', href: '/certificate' },
                            ]}
                        />

                        <article className="flex min-h-[80vh] w-full justify-center py-12">
                            <div className="flex w-[90%] max-w-[1100px] flex-col items-center">
                                {hasLoadError ? (
                                    <ErrorState />
                                ) : (
                                    <Document
                                        className={'rounded-xl'}
                                        file={url}
                                        onLoadError={() => setHasLoadError(true)}
                                        onLoadSuccess={() => setIsLoading(false)}
                                    >
                                        {!isLoading && <Page pageNumber={1} scale={scale} />}
                                    </Document>
                                )}

                                {!hasLoadError && !isLoading && (
                                    <p className="mt-8 text-sm text-red-800">Displaying the official one-page Certificate of Authenticity.</p>
                                )}
                            </div>
                        </article>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Certificate;
