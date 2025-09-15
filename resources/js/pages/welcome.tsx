import { CardHeader, CardImage, HomeCard, HomeCardDescription, HomeCardTitle } from '@/components/ui/card';
import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, GraduationCap } from 'lucide-react';
import React from 'react';

export default function Welcome() {
    const images = ['/images/homepage-slides/1.png', '/images/homepage-slides/4.jpg', '/images/homepage-slides/6.jpg'];

    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000); // change image every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="relative grid h-[70vh] w-full place-items-center overflow-hidden">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Slide ${index + 1}`}
                            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ${
                                index === current ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    ))}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#800000]/100 to-transparent"></div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col items-start justify-center space-y-6 px-12 pr-10 pl-70 text-white">
                        <img src="/images/pupsj_motto.png" alt="Logo" className="h-auto w-120" />
                        <h2 className="text-2xl italic">Years of academic excellence and service</h2>

                        <div className="mt-10 flex space-x-4">
                            <button className="flex items-center space-x-2 rounded-md bg-white px-6 py-2 font-semibold text-black shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <BookOpen className="h-5 w-5" />
                                <span>Programs</span>
                            </button>
                            <button className="flex items-center space-x-2 rounded-md border border-gray-300/70 bg-white/10 px-6 py-2 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-gray-200 hover:bg-white/20">
                                <Calendar className="h-5 w-5" />
                                <span>Events</span>
                            </button>
                            <button className="flex items-center space-x-2 rounded-md border border-gray-300/70 bg-white/10 px-6 py-2 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-gray-200 hover:bg-white/20">
                                <GraduationCap className="h-5 w-5" />
                                <span>Academe</span>
                            </button>
                        </div>
                    </div>
                </div>

                <motion.section
                    className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-20 bg-gray-50 px-6 py-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.5, // one card every 0.2s
                            },
                        },
                    }}
                >
                    {/* Section Header */}
                    <div className="flex flex-col items-center text-center">
                        <p className="text-3xl font-bold text-gray-900">What’s New on Campus</p>
                        <p className="mt-0.5 text-lg text-gray-600">Catch up on events, announcements, and campus highlights.</p>
                    </div>

                    {/* News Cards */}
                    <div className="flex flex-row flex-wrap justify-center gap-8">
                        {[
                            {
                                title: 'PUPSJ PUPCET',
                                img: '/images/pupcet.jpg',
                                desc: 'The PUPSJ PUPCET Online Application for Academic Year 2025-2026 starts on December 15, 2024 - April 15, 2025.',
                            },
                            {
                                title: 'CPALE 2024 Passers',
                                img: '/images/cpale.jpg',
                                desc: 'Pagpupugay sa bagong CPA ng ating Sintang Paaralan.',
                            },
                            {
                                title: 'Mental Health Matters',
                                img: '/images/mental.jpg',
                                desc: 'The OCPS A School Adjustment Program (ASAP) is here to help you thrive! This infographic offers easy-to-follow tips for boosting your well-being.',
                            },
                            {
                                title: 'Ceremonial Signing',
                                img: '/images/ceremony.jpg',
                                desc: 'A groundbreaking partnership between PUP San Juan City and the Research Synergy Foundation!',
                            },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                className="w-[18vw]"
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                                }}
                            >
                                <Link href="/">
                                    <HomeCard className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[#7f1414] hover:shadow-lg">
                                        <CardImage src={card.img} alt={card.title} />
                                        <CardHeader className="p-4">
                                            <HomeCardTitle className="font-semibold text-gray-900 transition-colors group-hover:text-[#7f1414]">
                                                {card.title}
                                            </HomeCardTitle>
                                            <div className="my-2 h-[1px] w-full overflow-hidden bg-gray-200">
                                                <div className="h-full w-full origin-left scale-x-0 bg-[#7f1414] transition-transform duration-500 group-hover:scale-x-100"></div>
                                            </div>
                                            <HomeCardDescription className="text-sm text-gray-600">{card.desc}</HomeCardDescription>
                                        </CardHeader>
                                    </HomeCard>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    className="relative flex min-h-[80vh] w-full items-center justify-center py-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
                        style={{ backgroundImage: "url('/images/homepage-slides/1.jpg')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent"></div>
                    <div className="relative z-10 flex w-[85%] max-w-[1400px] flex-col items-center justify-center gap-16 lg:flex-row">
                        <div className="flex w-full justify-center lg:w-[50%]">
                            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl">
                                <iframe
                                    className="h-full w-full"
                                    src="https://www.youtube.com/embed/9ypv1kOj7CU?autoplay=0"
                                    title="PUPSJ AVP 2024"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                                <div className="bg-gradient-radial pointer-events-none absolute -bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 transform rounded-full from-[#b11116]/40 to-transparent blur-xl"></div>
                            </div>
                        </div>
                        <div className="flex w-full flex-col justify-center text-center lg:w-[50%] lg:text-left">
                            <motion.h2
                                className="mb-4 text-[2.5vw] font-bold text-[#b11116] lg:text-[2rem]"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Campus Audio-Visual Presentation
                            </motion.h2>
                            <motion.p
                                className="mb-4 text-[1.15rem] leading-relaxed text-gray-700"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                A Leading Comprehensive Polytechnic University in Asia
                            </motion.p>
                            <motion.p
                                className="mb-8 text-[0.95rem] text-gray-600 italic"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                Discover the roadmap that shapes our future — goals, strategies, and developments leading PUP into a new era of
                                excellence.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    href="https://www.youtube.com/watch?v=0n1dd1XZ9F8"
                                    target="_blank"
                                    className="inline-block rounded-full bg-[#b11116] px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#910f13]"
                                >
                                    Watch on YouTube
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* --- Director’s Message Section --- */}
                <motion.section
                    className="bg-white py-20"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="mx-auto mb-12 max-w-4xl text-center">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">Message from the Campus Director</h2>
                        <p className="text-gray-600">A word of inspiration from our campus leadership.</p>
                    </div>

                    <div className="mx-auto flex w-[80%] max-w-[1000px] flex-col gap-2 lg:flex-row lg:items-stretch">
                        {/* Left: Director’s Image */}
                        <div className="relative mx-auto h-[350px] w-[280px] shrink-0 overflow-hidden rounded-xl shadow-lg lg:mx-0">
                            <img src="/images/adfa-new/Cecilia-R.-Alagon.jpg" alt="Director" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#7f1414]/20 to-transparent" />
                        </div>

                        {/* Right: Director’s Message */}
                        <div className="flex flex-1 flex-col gap-4 rounded-xl bg-[#7f1414] p-12 text-white shadow-md">
                            {/* Quote Icon Placeholder */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#a83232]/80">
                                <img src="/images/quote.png" alt="Quote Icon" className="h-4 w-4 object-contain" />
                            </div>

                            {/* Scrollable Message */}
                            <div className="max-h-[120px] overflow-y-auto pr-2">
                                <p className="text-left leading-relaxed">
                                    Welcome to PUP San Juan! As the Campus Director, I am proud to see our institution thrive through innovation,
                                    collaboration, and excellence. We continue to build a community that uplifts each learner and shapes the future of
                                    education. Maraming salamat sa inyong suporta!
                                </p>
                            </div>
                            {/* Name & Title */}
                            <div className="mt-auto text-left">
                                <p className="font-semibold">Dr. Cecilia R. Alagon</p>
                                <p className="text-sm opacity-90">Campus Director</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    className="w-full items-center justify-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* --- Welcome Accreditors Section --- */}
                    <section className="flex h-[50vh] items-center justify-center">
                        <div className="flex w-[80%] max-w-[1200px] flex-col gap-12 rounded-xl border border-[#201e1e31] bg-white p-15 lg:flex-row">
                            {/* Left Column (Text) */}
                            <div className="flex flex-1 flex-col justify-center gap-6">
                                {/* Header */}
                                <h2 className="text-3xl font-bold text-gray-900">Welcome Accreditors!</h2>
                                <p className="leading-relaxed text-gray-700">
                                    It is our honor to host you, esteemed accreditors, and we deeply appreciate your role in our continued success.
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-3">
                                    <span className="rounded-sm border border-[#201e1e31] px-8 py-2 text-sm font-medium text-[#7f1414]">
                                        March 2025
                                    </span>
                                    <span className="rounded-sm border border-[#201e1e31] px-8 py-2 text-sm font-medium text-[#7f1414]">
                                        Level II AACCUP Survey Visit
                                    </span>
                                </div>
                            </div>

                            {/* Right Column (Cards) */}
                            <div className="flex flex-1 flex-col gap-4 md:flex-row">
                                {/* Card 1 */}
                                <a
                                    href="#"
                                    className="flex flex-1 flex-col items-start gap-10 rounded-xl bg-[#7f1414] p-6 text-white shadow-md transition-all hover:-translate-y-1 hover:bg-[#a83232] hover:shadow-lg"
                                >
                                    {/* Icon */}
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 20l9-5-9-5-9 5 9 5zm0 0V10m0 10v-4"
                                            />
                                        </svg>
                                    </div>
                                    {/* Title & Desc */}
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold">Academic Programs</h3>
                                        <p className="text-sm opacity-90">Learn more about the process, documents, and evaluation steps.</p>
                                    </div>
                                </a>

                                {/* Card 2 */}
                                <a
                                    href="#"
                                    className="flex flex-1 flex-col items-start gap-10 rounded-xl bg-[#7f1414] p-6 text-white shadow-md transition-all hover:-translate-y-1 hover:bg-[#a83232] hover:shadow-lg"
                                >
                                    {/* Icon */}
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    {/* Title & Desc */}
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold">More Info</h3>
                                        <p className="text-sm opacity-90">Important details and updates for the accreditation visit.</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </section>
                </motion.section>

                <motion.section
                    className="relative flex min-h-[80vh] w-full items-center justify-center py-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
                        style={{ backgroundImage: "url('/images/homepage-slides/street-sj.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
                    <div className="relative z-10 flex w-[85%] max-w-[1400px] flex-col items-center justify-center gap-16 lg:flex-row">
                        <div className="order-2 flex w-full flex-col justify-center text-center lg:order-1 lg:w-[50%] lg:text-left">
                            <motion.h2
                                className="mb-4 text-[2.5vw] font-bold text-[#b11116] lg:text-[2rem]"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Explore Our Campus
                            </motion.h2>
                            <motion.p
                                className="mb-4 text-[1.15rem] leading-relaxed text-gray-700"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                Our strategically located campus is designed to inspire learning and innovation. Tap the map to explore buildings,
                                facilities, and more.
                            </motion.p>
                            <motion.p
                                className="mb-8 text-[0.95rem] text-gray-600 italic"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                PUP San Juan, Pinaglabanan St., San Juan City
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    href="https://maps.app.goo.gl/KLfy768XRV4DXY9t7"
                                    target="_blank"
                                    className="inline-block rounded-full bg-[#b11116] px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#910f13]"
                                >
                                    View Full Map
                                </Link>
                            </motion.div>
                        </div>
                        <div className="order-1 flex w-full justify-center lg:order-2 lg:w-[50%]">
                            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl">
                                <iframe
                                    className="h-full w-full border-0"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.6352821614245!2d121.03989456028415!3d14.594374852740119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c82e63228c75%3A0xf48b60882ff9710a!2sPolytechnic%20University%20of%20the%20Philippines%20-%20San%20Juan!5e0!3m2!1sen!2sph!4v1749228865968!5m2!1sen!2sph"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                                <div className="bg-gradient-radial pointer-events-none absolute -bottom-5 left-1/2 h-64 w-64 -translate-x-1/2 transform rounded-full from-[#b11116]/40 to-transparent blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </Layout>
        </>
    );
}
