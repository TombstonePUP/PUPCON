'use client';
import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { ContentPages, Facilities } from '@/types/content';
import { Head, usePoll } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Building2, Construction } from 'lucide-react';
import { useState } from 'react';

interface FacilitiesPageProps {
    page: ContentPages;
    facilities: Facilities[];
}

// Fallback Empty State Component
const EmptyState = ({ title, description, icon: Icon = Construction }: { title: string; description: string; icon?: any }) => (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Icon className="mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

// Alert Component for missing critical data
const DataAlert = ({ message }: { message: string }) => (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
            <p className="text-sm font-medium text-amber-900">Content Unavailable</p>
            <p className="mt-1 text-sm text-amber-700">{message}</p>
        </div>
    </div>
);

export default function FacilitiesPage({ page, facilities }: FacilitiesPageProps) {
    // Add usePoll to auto-refresh data every 2 seconds
    usePoll(
        2000,
        {},
        {
            keepAlive: true,
        },
    );

    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Check if data exists
    const hasPageData = page && (page.title || page.description);
    const hasFacilities = facilities && facilities.length > 0;

    return (
        <>
            <Head title="Facilities - PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="bg-white text-gray-800">
                    <PageHeader
                        title="Facilities"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'About', href: '/about' },
                            { label: 'Facilities', href: '/about/facilities' },
                        ]}
                    />

                    <div className="mx-auto w-[75%] px-6 py-12">
                        {/* Facilities Introduction */}
                        <section className="mb-12">
                            {!hasPageData ? (
                                <DataAlert message="Facilities page content is currently being updated. Please check back later." />
                            ) : (
                                <div className="rounded-xl border border-[#7f1414]/25 bg-white p-8 transition-all duration-300 hover:border-[#7f1414] hover:shadow-sm">
                                    <h1 className="mb-4 text-3xl font-bold text-[#7f1414]">{page?.title || 'Campus Facilities'}</h1>
                                    <p className="leading-relaxed text-gray-700">
                                        {page?.description || 'Explore our state-of-the-art facilities designed to support your academic journey.'}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Facilities Grid */}
                        <section>
                            {!hasFacilities ? (
                                <EmptyState
                                    title="Facilities Information Coming Soon"
                                    description="Details about our campus facilities are being compiled and will be available here shortly."
                                    icon={Building2}
                                />
                            ) : (
                                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {facilities.map((facility, index) => (
                                        <motion.div
                                            key={facility.facility_id}
                                            className="facility-card group relative overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white transition-all duration-500 hover:border-[#7f1414] hover:shadow-lg"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onMouseEnter={() => setHoveredCard(facility.facility_id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {/* Card Front */}
                                            <div
                                                className={`card-front transition-all duration-500 ${
                                                    hoveredCard === facility.facility_id ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                                                }`}
                                            >
                                                <div className="aspect-[4/3] overflow-hidden">
                                                    {facility?.image_path ? (
                                                        <img
                                                            src={facility.image_path}
                                                            alt={facility?.image_name || 'Facility Image'}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                            <Building2 className="h-16 w-16 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="mb-3 text-2xl font-bold text-[#7f1414] transition-colors group-hover:text-[#a01818]">
                                                        {facility.facility_name}
                                                    </h3>
                                                    <p className="line-clamp-3 text-gray-600">{facility.description}</p>
                                                </div>
                                            </div>

                                            {/* Card Back */}
                                            <div
                                                className={`card-back absolute inset-0 bg-gradient-to-br from-[#7f1414] to-[#a01818] p-6 text-white transition-all duration-500 ${
                                                    hoveredCard === facility.facility_id ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                                }`}
                                            >
                                                <div className="flex h-full flex-col">
                                                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg">
                                                        {facility.image_path ? (
                                                            <img
                                                                src={facility.image_path}
                                                                alt={facility.image_name || 'Facility Image'}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-white/10">
                                                                <Building2 className="h-16 w-16 text-white/50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="mb-3 text-xl font-bold">{facility.facility_name}</h3>
                                                    <p className="mb-4 flex-1 text-sm leading-relaxed opacity-90">{facility.description}</p>
                                                </div>
                                            </div>

                                            {/* Hover Indicator */}
                                            <div className="absolute right-4 bottom-4 rounded-full bg-white/20 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </Layout>
        </>
    );
}
