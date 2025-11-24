'use client';
import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Certificate() {
    return (
        <>
            <Head title="Certificate of Authenticity - PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center">
                    <PageHeader
                        title="Certificate of Authenticity"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Authenticity', href: '/certificate' },
                        ]}
                    />

                    {/* Certificate Page Content */}
                    <article className="certificate-page py-12 w-[75%]">
                        {/* Main Content Section */}
                        <section className="main-content mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-12 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mx-auto max-w-3xl"
                            >
                                {/* Icon */}
                                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#7f1414]/10">
                                    <svg
                                        className="h-12 w-12 text-[#7f1414]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>

                                {/* Main Message */}
                                <h2 className="mb-6 text-4xl font-bold text-[#7f1414]">Certificate of Authenticity</h2>
                                <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                                    <p className="text-xl font-semibold text-gray-800">
                                        Currently, there is no Certificate of Authenticity available as PUP San Juan Campus has not yet received
                                        formal accreditation.
                                    </p>
                                    <p>
                                        The Certificate of Authenticity will be issued upon successful completion of the accreditation process by the
                                        Accrediting Agency of Chartered Colleges and Universities in the Philippines (AACCUP) or other recognized
                                        accrediting bodies.
                                    </p>
                                    <p>
                                        This certificate serves as official documentation that validates the institution's compliance with established
                                        educational standards and quality assurance measures, ensuring the authenticity and credibility of our
                                        academic programs.
                                    </p>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-8">
                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
                                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Pending Accreditation Completion
                                    </span>
                                </div>
                            </motion.div>
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    );
}
