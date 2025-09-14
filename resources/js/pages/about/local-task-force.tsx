import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function LocalTaskForce() {
    return (
        <>
            <Head title="Local Task Force - PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center">
                    <PageHeader
                        title="Local Task Force"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Local Task Force', href: '/local-task-force' },
                        ]}
                    />

                    {/* Local Task Force Page Content */}
                    <article className="local-task-force-page mt-8 w-[75%]">
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
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>

                                {/* Main Message */}
                                <h2 className="mb-6 text-4xl font-bold text-[#7f1414]">Local Task Force</h2>
                                <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                                    <p className="text-xl font-semibold text-gray-800">Currently, there is no Local Task Force established yet.</p>
                                    <p>
                                        The Local Task Force will be organized and appointed during the next accreditation cycle as part of our
                                        continuous commitment to academic excellence and quality assurance.
                                    </p>
                                    <p>
                                        This specialized committee will play a crucial role in supporting the accreditation process, ensuring
                                        compliance with academic standards, and facilitating institutional improvement initiatives.
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
                                        Pending Next Accreditation Cycle
                                    </span>
                                </div>
                            </motion.div>
                        </section>

                        {/* Information Cards */}
                        <section className="info-cards mb-12">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* What is a Local Task Force */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-xl"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]/10">
                                        <svg className="h-6 w-6 text-[#7f1414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-[#7f1414]">What is a Local Task Force?</h3>
                                    <p className="text-gray-600">
                                        A specialized committee composed of faculty and staff members who support the accreditation process and ensure
                                        institutional compliance with academic standards.
                                    </p>
                                </motion.div>

                                {/* Purpose */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-xl"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]/10">
                                        <svg className="h-6 w-6 text-[#7f1414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-[#7f1414]">Purpose & Role</h3>
                                    <p className="text-gray-600">
                                        To facilitate quality assurance processes, coordinate accreditation activities, and drive institutional
                                        improvements aligned with educational excellence standards.
                                    </p>
                                </motion.div>

                                {/* Future Plans */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                    className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-xl"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]/10">
                                        <svg className="h-6 w-6 text-[#7f1414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-[#7f1414]">Future Implementation</h3>
                                    <p className="text-gray-600">
                                        The Local Task Force will be established during our upcoming accreditation preparations, ensuring our campus
                                        maintains the highest standards of academic quality.
                                    </p>
                                </motion.div>
                            </div>
                        </section>

                        {/* Timeline Section */}
                        <section className="timeline-section mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8">
                            <h2 className="mb-8 text-center text-3xl font-bold text-[#7f1414]">Accreditation Timeline</h2>
                            <div className="mx-auto max-w-2xl">
                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute top-0 left-4 h-full w-0.5 bg-[#7f1414]/20"></div>

                                    {/* Current Status */}
                                    <div className="relative mb-8 flex items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7f1414] text-white">
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-6">
                                            <h3 className="font-semibold text-gray-900">Current Status</h3>
                                            <p className="text-sm text-gray-600">Ongoing academic operations and quality improvements</p>
                                        </div>
                                    </div>

                                    {/* Upcoming */}
                                    <div className="relative mb-8 flex items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white">
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-6">
                                            <h3 className="font-semibold text-gray-900">Next Accreditation Cycle</h3>
                                            <p className="text-sm text-gray-600">Local Task Force formation and accreditation preparations</p>
                                        </div>
                                    </div>

                                    {/* Future */}
                                    <div className="relative flex items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white">
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-6">
                                            <h3 className="font-semibold text-gray-900">Accreditation Achievement</h3>
                                            <p className="text-sm text-gray-600">Successful accreditation with Local Task Force support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contact Section */}
                        <section className="contact-section text-center">
                            <div className="rounded-xl border border-[#7f1414]/25 bg-white p-8">
                                <h2 className="mb-4 text-3xl font-bold text-[#7f1414]">Stay Updated</h2>
                                <p className="mb-6 text-lg text-gray-700">
                                    For more information about our accreditation process and future Local Task Force developments, please contact our
                                    administration office.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button className="hover: rounded-lg bg-[#7f1414] px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#a01818]">
                                        Contact Administration
                                    </button>
                                    <button className="rounded-lg border-2 border-[#7f1414] px-8 py-3 font-semibold text-[#7f1414] transition-all duration-300 hover:bg-[#7f1414] hover:text-white">
                                        Learn About Accreditation
                                    </button>
                                </div>
                            </div>
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    );
}
