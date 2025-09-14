'use client';
import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Facilities() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const facilities = [
        {
            id: 1,
            name: 'Library',
            cardImage: '/images/Facilities/lib-card.png',
            mainImage: '/images/Facilities/lib.png',
            description:
                'PUP San Juan now uses a computerized library system to improve service efficiency. It allows users to locate resources, borrow books and materials, and manage the acquisition of new books.',
            features: ['Computerized System', 'Digital Catalog', 'Study Areas', 'Research Resources'],
        },
        {
            id: 2,
            name: 'Conference Room',
            cardImage: '/images/Facilities/conf-card.png',
            mainImage: '/images/Facilities/conf.png',
            description:
                'The Conference Room is a space accessible to faculty members and students-- designed for meetings, presentations, and collaborative discussions. This room provides a productive atmosphere for focused work and effective communication.',
            features: ['Meeting Space', 'Presentation Equipment', 'Collaborative Environment', 'Professional Setting'],
        },
        {
            id: 3,
            name: 'Computer Laboratories',
            cardImage: '/images/Facilities/com-card.png',
            mainImage: '/images/Facilities/com.png',
            description:
                "The Computer Laboratory provides students with access to computers for quizzes, defenses, and other activities requiring multiple workstations. It enhances and practices students' computer skills. PUP San Juan has three computer laboratories.",
            features: ['3 Computer Labs', 'Multiple Workstations', 'Modern Equipment', 'Skill Development'],
        },
        {
            id: 4,
            name: 'Audio-Visual Rooms',
            cardImage: '/images/Facilities/avr-card.png',
            mainImage: '/images/Facilities/avr.png',
            description:
                'The Audio-Visual Room hosts academic presentations, thesis defenses, and similar events. PUP San Juan has two audio-visual rooms available for these activities.',
            features: ['2 AV Rooms', 'Presentation Equipment', 'Thesis Defenses', 'Academic Events'],
        },
        {
            id: 5,
            name: 'Mini Hall',
            cardImage: '/images/Facilities/mini-card.png',
            mainImage: '/images/Facilities/mini-hall.png',
            description:
                'The Mini Hall is an indoor facility utilized for holding meetings, conferences, convocations and similar activities, both administration or student-led. It can cater up to 150 heads. The hall is appropriately decorated and equipped to fit the requirements of the event held.',
            features: ['150 Capacity', 'Indoor Facility', 'Event Ready', 'Flexible Setup'],
        },
        {
            id: 6,
            name: 'Multipurpose Hall',
            cardImage: '/images/Facilities/mph-card.png',
            mainImage: '/images/Facilities/mph.png',
            description:
                'The Multi-Purpose Hall is a versatile space designed to accommodate various events such as assemblies, seminars, and recreational activities. It can be adapted for large gatherings or smaller functions, providing flexibility for different needs of administration and student organizations.',
            features: ['Versatile Space', 'Large Gatherings', 'Adaptable Layout', 'Multi-functional'],
        },
        {
            id: 7,
            name: 'Gymnasium',
            cardImage: '/images/Facilities/gym-card.png',
            mainImage: '/images/Facilities/gym.png',
            description:
                'The Gymnasium is where games and physical training are held. Most of the physical and sport activities in PUP San Juan like Intramural Meet are held in the PUP San Juan gymnasium.',
            features: ['Sports Activities', 'Physical Training', 'Intramural Events', 'Athletic Programs'],
        },
        {
            id: 8,
            name: 'Open Court',
            cardImage: '/images/Facilities/court-card.png',
            mainImage: '/images/Facilities/court.png',
            description:
                'The Quadrangle/Open Court is an outdoor facility that has an occupancy capacity of 150. The weekly flag raising ceremony, and different programs and events are conducted here.',
            features: ['150 Capacity', 'Outdoor Facility', 'Flag Ceremonies', 'Campus Events'],
        },
        {
            id: 9,
            name: 'Student Assembly Office',
            cardImage: '/images/Facilities/sa.png',
            mainImage: '/images/Facilities/sa.png',
            description:
                'The Student Assembly Office serves as the quarters of various student-led campus organizations, where they can plan and coordinate campus initiatives that aims to make a positive impact on campus life. This is a hub for collaboration and student engagement.',
            features: ['Student Organizations', 'Campus Initiatives', 'Collaboration Hub', 'Student Engagement'],
        },
    ];

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
                            { label: 'Facilities', href: '/facilities' },
                        ]}
                    />

                    {/* Facilities Introduction */}
                    <article className="facilities-page mt-8 w-[75%]">
                        <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                            <h2 className="mb-4 text-3xl font-bold text-[#7f1414]">Campus Facilities</h2>
                            <p className="leading-relaxed text-gray-700">
                                PUP San Juan Campus is equipped with modern facilities designed to support academic excellence and student
                                development. Our state-of-the-art infrastructure provides an optimal learning environment for all students, faculty,
                                and staff. Explore our comprehensive range of facilities that make learning engaging, collaborative, and effective.
                            </p>
                        </section>

                        {/* Facilities Grid */}
                        <section className="facilities-grid">
                            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {facilities.map((facility, index) => (
                                    <motion.div
                                        key={facility.id}
                                        className="facility-card group relative overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white transition-all duration-300 duration-500 hover:border-[#7f1414]"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {/* Card Front */}
                                        <div
                                            className={`card-front transition-all duration-500 ${hoveredCard === facility.id ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
                                        >
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={facility.cardImage || '/placeholder.svg'}
                                                    alt={`${facility.name} Card`}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="mb-3 text-2xl font-bold text-[#7f1414] group-hover:text-[#a01818]">{facility.name}</h3>
                                                <p className="line-clamp-3 text-gray-600">{facility.description}</p>
                                            </div>
                                        </div>

                                        {/* Card Back */}
                                        <div
                                            className={`card-back absolute inset-0 bg-gradient-to-br from-[#7f1414] to-[#a01818] p-6 text-white transition-all duration-500 ${hoveredCard === facility.id ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                                        >
                                            <div className="flex h-full flex-col">
                                                <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg">
                                                    <img
                                                        src={facility.mainImage || '/placeholder.svg'}
                                                        alt={facility.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <h3 className="mb-3 text-xl font-bold">{facility.name}</h3>
                                                <p className="mb-4 flex-1 text-sm leading-relaxed opacity-90">{facility.description}</p>
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold">Key Features:</h4>
                                                    <div className="grid grid-cols-2 gap-1 text-xs">
                                                        {facility.features.map((feature, idx) => (
                                                            <div key={idx} className="flex items-center">
                                                                <div className="mr-2 h-1 w-1 rounded-full bg-white"></div>
                                                                {feature}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
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
                        <section className="facilities-stats mt-12 rounded-xl bg-gradient-to-r from-[#7f1414] to-[#a01818] p-8 text-white">
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
                        </section>

                        {/* Call to Action */}
                        <section className="cta-section mt-12 text-center">
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
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    );
}
