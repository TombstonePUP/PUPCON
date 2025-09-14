import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function History() {
    // Generate array of image names (1.jpg to 30.jpg)
    const galleryImages = Array.from({ length: 30 }, (_, i) => `${i + 1}.jpg`);

    const milestones = [
        { year: '2008', event: 'Establishment of PUP San Juan Campus' },
        { year: '2012', event: 'First Accreditation Visit by AACCUP' },
        { year: '2016', event: 'Launch of the IT Research Laboratory' },
        { year: '2020', event: 'Shift to Hybrid Learning Model' },
        { year: '2024', event: 'PUPSJ Ranked Top 10 in NCR for Education Programs' },
        { year: '2025', event: 'Current AACCUP Survey Visit' },
    ];

    return (
        <>
            <Head title="History - PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center">
                    <PageHeader
                        title="History"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'History', href: '/history' },
                        ]}
                    />

                    {/* History Page Content */}
                    <article className="history-page mt-8 flex w-[75%] flex-col items-center">
                        {/* Welcome Banner Section */}
                        <section className="welcome-banner mb-12 w-full">
                            <div className="welcome-container flex flex-col gap-8 lg:flex-row lg:items-center">
                                <div className="welcome-left lg:w-1/2">
                                    <div className="image-wrapper relative overflow-hidden rounded-xl">
                                        <img
                                            src="/images/homepage-slides/4.jpg"
                                            alt="Campus Welcome Image"
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        <div className="glow-orb absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-gradient-to-r from-[#7f1414]/30 to-transparent blur-xl"></div>
                                    </div>
                                </div>
                                <div className="welcome-right lg:w-1/2">
                                    <motion.h1
                                        className="fade-in mb-6 text-4xl font-bold text-[#7f1414] lg:text-5xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Our History
                                    </motion.h1>
                                    <motion.p
                                        className="fade-in mb-6 text-lg leading-relaxed text-gray-700 delay-1"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Despite its proximity to the Main Campus in Sta. Mesa, the Polytechnic University of the Philippines San Juan
                                        Campus lives up to the institution's commitment to democratize access to educational opportunities for
                                        economically challenged but deserving youths in the very heart of the National Capital Region, the historic
                                        city which served as the site of the first battle of the Philippine Revolution against Spain.
                                    </motion.p>
                                    <motion.p
                                        className="fade-in tag mb-6 text-lg font-semibold text-[#7f1414] italic delay-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        PUP San Juan · Dambana ng Kagitingan
                                    </motion.p>
                                    <motion.a
                                        href="https://www.pup.edu.ph/sanjuan/history"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="fade-in cta-btn hover: inline-block rounded-lg bg-[#7f1414] px-6 py-3 font-semibold text-white transition-all delay-3 duration-300 hover:bg-[#a01818]"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        More About Us
                                    </motion.a>
                                </div>
                            </div>
                        </section>

                        {/* Campus Gallery Section */}
                        <section className="campus-gallery relative mb-12 w-full overflow-hidden rounded-xl bg-white p-8 text-center">
                            {/* Background Image */}
                            <img
                                className="absolute inset-0 h-full w-full object-cover opacity-[0.07]"
                                src="/images/campus/ground.jpg"
                                alt="Gallery Background"
                            />

                            <div className="gallery-container relative z-10 mx-auto max-w-6xl">
                                <motion.h2
                                    className="mb-4 text-5xl font-extrabold text-[#b11116]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    Campus Gallery
                                </motion.h2>
                                <motion.p
                                    className="tag mb-8 text-xl text-gray-600 italic"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    A glimpse into student life, campus events, and vibrant culture at PUP San Juan
                                </motion.p>

                                <div className="gallery-grid grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {galleryImages.map((image, index) => (
                                        <motion.div
                                            key={image}
                                            className="gallery-item overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <img
                                                src={`/images/events/${image}`}
                                                alt="Campus Photo"
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                loading="lazy"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Campus Timeline Section */}
                        <section className="campus-timeline w-full bg-gray-50 p-16 text-center">
                            <div className="timeline-container mx-auto max-w-4xl">
                                <motion.h2
                                    className="mb-4 text-5xl font-extrabold text-[#b11116]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    Campus History & Milestones
                                </motion.h2>
                                <motion.p
                                    className="tag mb-8 text-xl text-gray-600 italic"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Key moments that shaped PUP San Juan
                                </motion.p>

                                <div className="timeline relative border-l-3 border-[#8c1d40] pl-8">
                                    {milestones.map((milestone, index) => (
                                        <motion.div
                                            key={milestone.year}
                                            className="timeline-item relative mb-8 pl-4 text-left"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.2 }}
                                        >
                                            <div className="timeline-marker absolute top-1 -left-[1.15rem] h-5 w-5 rounded-full border-3 border-white bg-[#8c1d40]"></div>
                                            <div className="timeline-content">
                                                <span className="timeline-year text-xl font-bold text-gray-800">{milestone.year}</span>
                                                <p className="timeline-event mt-1 text-base text-gray-600">{milestone.event}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    );
}
