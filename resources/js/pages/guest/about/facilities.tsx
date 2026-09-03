'use client';
import PageHeader from '@/components/guest/page-header';
import { useSmartPoll } from '@/hooks/use-smart-poll';
import Layout from '@/layouts/guest/landing-layout';
import { ContentPages, Facilities } from '@/types/content';
import { Head } from '@inertiajs/react';
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
        <p className="text-muted-foreground text-sm">{description}</p>
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
    useSmartPoll(5000);

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
                <PageHeader
                    title="Campus Facilities"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Facilities', href: '/facilities' },
                    ]}
                />

                <div className="mx-auto w-[85%] max-w-7xl px-6 py-12 lg:w-[75%]">
                    {/* Page Header Section */}
                    <div className="mb-12">
                        {hasPageData ? (
                            <div className="card-fx rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#7f1414]/30 hover:shadow-md">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-lg bg-[#7f1414]/10 p-2 text-[#7f1414]">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{page.title}</h2>
                                </div>
                                <p className="text-lg leading-relaxed text-gray-600">{page.description}</p>
                            </div>
                        ) : (
                            <DataAlert message="Page introductory content is not available at the moment." />
                        )}
                    </div>

                    {/* Facilities Grid */}
                    {!hasFacilities ? (
                        <EmptyState
                            title="No Facilities Listed"
                            description="Campus facilities are currently being updated. Please check back later for the complete list."
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {facilities.map((facility, index) => (
                                <motion.div
                                    key={facility.facility_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-[#7f1414]/40 hover:shadow-xl"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={facility.image_path || '/images/placeholders/facility.jpg'}
                                            alt={facility.facility_name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/800x600/f3f4f6/7f1414?text=Facility+Image';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <div className="absolute right-4 bottom-4 left-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wider text-[#7f1414] uppercase">
                                                {facility.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Container */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#7f1414]">
                                            {facility.facility_name}
                                        </h3>
                                        <p className="mb-6 line-clamp-3 text-gray-600 transition-colors group-hover:text-gray-700">
                                            {facility.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                                <Building2 className="h-4 w-4" />
                                                <span>PUP SJ Campus</span>
                                            </div>
                                            <div
                                                className={`h-2 w-2 rounded-full ${facility.status === 'Under Maintenance' ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Hover Decorative Element */}
                                    <div className="absolute top-0 right-0 h-16 w-16 translate-x-full -translate-y-full bg-[#7f1414]/10 blur-2xl transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </Layout>
        </>
    );
}
