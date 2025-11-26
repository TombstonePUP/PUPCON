'use client';
import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { ContentPages, Facilities } from '@/types/content';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface FacilitiesPageProps {
    page: ContentPages;
    facilities: Facilities[];
}

export default function FacilitiesPage({ page, facilities }: FacilitiesPageProps) {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    return (
        <>
            <Head title="Facilities - PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center">
                    <PageHeader
                        title="Facilities"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'About', href: '/about' },
                            { label: 'Facilities', href: '/facilities' },
                        ]}
                    />

                    {/* Facilities Introduction */}
                    <article className="facilities-page mt-8 w-[75%]">
                        <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                            <h2 className="mb-4 text-3xl font-bold text-[#7f1414]">{page?.title}</h2>
                            <p className="leading-relaxed text-gray-700">{page?.description}</p>
                        </section>

                        {/* Facilities Grid */}
                        <section className="facilities-grid mb-12">
                            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {facilities.map((facility, index) => (
                                    <motion.div
                                        key={facility.facility_id}
                                        className="facility-card group relative overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white transition-all duration-300 duration-500 hover:border-[#7f1414]"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {/* Card Front */}
                                        <div
                                            className={`card-front transition-all duration-500 ${hoveredCard === facility.facility_id ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
                                        >
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={facility?.image_path || '/placeholder.svg'}
                                                    alt={`${facility?.image_name || 'Facility Image'}`}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="mb-3 text-2xl font-bold text-[#7f1414] group-hover:text-[#a01818]">{facility.facility_name}</h3>
                                                <p className="line-clamp-3 text-gray-600">{facility.description}</p>
                                            </div>
                                        </div>

                                        {/* Card Back */}
                                        <div
                                            className={`card-back absolute inset-0 bg-gradient-to-br from-[#7f1414] to-[#a01818] p-6 text-white transition-all duration-500 ${hoveredCard === facility.facility_id ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                                        >
                                            <div className="flex h-full flex-col">
                                                <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg">
                                                    <img
                                                        src={facility.image_path || '/placeholder.svg'}
                                                        alt={facility.image_name || 'Facility Image'}
                                                        className="h-full w-full object-cover"
                                                    />
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
                        </section>

                        {/* Facilities Stats */}
                        {/* <section className="facilities-stats mt-12 rounded-xl bg-gradient-to-r from-[#7f1414] to-[#a01818] p-8 text-white">
                            <h2 className="mb-8 text-center text-3xl font-bold">Facilities at a Glance</h2>
                            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold">3</div>
                                    <div className="text-sm opacity-90">Computer Labs</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold">2</div>
                                    <div className="text-sm opacity-90">AV Rooms</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold">300+</div>
                                    <div className="text-sm opacity-90">Total Capacity</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold">9</div>
                                    <div className="text-sm opacity-90">Major Facilities</div>
                                </div>
                            </div>
                        </section> */}

                        {/* Call to Action */}
                        {/*<section className="cta-section mt-12 text-center">
                            <div className="rounded-xl border border-[#7f1414]/25 bg-white p-8">
                                <h2 className="mb-4 text-3xl font-bold text-[#7f1414]">Experience Our Campus</h2>
                                <p className="mb-6 text-lg text-gray-700">
                                    Ready to explore our world-class facilities? Schedule a campus tour and see firsthand what makes PUP San Juan the
                                    perfect place for your academic journey.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button className="hover: rounded-lg bg-[#7f1414] px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#a01818]">
                                        Schedule Campus Tour
                                    </button>
                                    <button className="rounded-lg border-2 border-[#7f1414] px-8 py-3 font-semibold text-[#7f1414] transition-all duration-300 hover:bg-[#7f1414] hover:text-white">
                                        Virtual Tour
                                    </button>
                                </div>
                            </div>
                        </section> */}
                    </article>
                </div>
            </Layout>
        </>
    );
}
