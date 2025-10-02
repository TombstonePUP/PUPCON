import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Building, Calendar, School, Star, Trophy } from 'lucide-react';
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';

export default function History() {
    const milestones = [
        {
            year: '2008',
            event: 'Establishment of PUP San Juan Campus',
            description: 'Founded with the mission to democratize quality education in the National Capital Region',
            icon: <Building className="h-6 w-6" />,
            highlight: true,
        },
        {
            year: '2012',
            event: 'First Accreditation Visit by AACCUP',
            description: 'Achieved initial accreditation marking our commitment to educational excellence',
            icon: <Award className="h-6 w-6" />,
        },
        {
            year: '2016',
            event: 'Launch of the IT Research Laboratory',
            description: 'Established state-of-the-art facilities to support technological advancement',
            icon: <School className="h-6 w-6" />,
        },
        {
            year: '2020',
            event: 'Shift to Hybrid Learning Model',
            description: 'Successfully adapted to new educational paradigms during the global pandemic',
            icon: <BookOpen className="h-6 w-6" />,
        },
        {
            year: '2024',
            event: 'PUPSJ Ranked Top 10 in NCR for Education Programs',
            description: 'Recognition for outstanding academic programs and student achievements',
            icon: <Trophy className="h-6 w-6" />,
            highlight: true,
        },
        {
            year: '2025',
            event: 'Current AACCUP Survey Visit',
            description: 'Ongoing evaluation for continued accreditation and program enhancement',
            icon: <Calendar className="h-6 w-6" />,
        },
    ];

    const presidents = [
        {
            name: 'Dr. Cecilia R. Alagon',
            tenure: '2008–2012',
            image: 'https://placehold.co/600x400',
            achievements: 'Lorem Impum dolor ini shadul shalom',
        },
        {
            name: 'Dr. Kwak-kwak',
            tenure: '2012–2016',
            image: 'https://placehold.co/600x400',
            achievements: 'Led first accreditation process, expanded student services',
        },
        {
            name: 'Dr. Jose Manalo',
            tenure: '2016–2020',
            image: 'https://placehold.co/600x400',
            achievements: 'Modernized campus facilities, launched research initiatives',
        },
    ];

    const achievements = [
        { year: '2008', title: 'Campus Established', count: '1' },
        { year: '2012', title: 'First Graduates', count: '150+' },
        { year: '2016', title: 'Research Projects', count: '25+' },
        { year: '2020', title: 'Online Courses', count: '100%' },
        { year: '2024', title: 'Alumni Network', count: '5,000+' },
    ];

    const galleryImages = Array.from({ length: 12 }, (_, i) => ({
        src: `/images/events/${i + 1}.jpg`,
        caption: `Campus Event ${i + 1}`,
        year: 2020 + (i % 5),
    }));

    const quickLinks = [
        { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals' },
        { label: 'History', href: '/about/history' },
        { label: 'Administration', href: '/about/administration' },
        { label: 'Facilities', href: '/about/facilities' },
        { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
        { label: 'Local Task Force', href: '/about/local-task-force' },
    ];

    const pageSections = [
        { label: 'Campus Timeline', href: 'timeline' },
        { label: 'Past Presidents', href: 'presidents' },
        { label: 'Achievements', href: 'achievements' },
        { label: 'Campus Gallery', href: 'gallery' },
        { label: 'PUP Hymn', href: 'hymn' },
    ];

    return (
        <>
            <Head title="History - PUP San Juan" />
            <Layout>
                <div className="bg-white text-gray-800">
                    <PageHeader
                        title="History"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'History', href: '/history' },
                        ]}
                    />

                    <div className="mx-auto w-[75%] px-6 py-12 lg:flex lg:gap-8">
                        {/* Sidebar */}
                        <aside className="mb-6 flex flex-col gap-4 lg:sticky lg:top-24 lg:mb-0 lg:w-1/4 lg:flex-shrink-0">
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-8 text-sm font-semibold text-[#7f1414ab]">QUICK LINKS</h2>
                                <nav className="space-y-2">
                                    {quickLinks.map((item, i) => (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            className="block px-1 py-1 font-normal text-gray-700 transition-all duration-100 hover:font-semibold hover:text-[#7f1414]"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-8 text-sm font-semibold text-[#7f1414ab]">ON THIS PAGE</h2>
                                <nav className="space-y-2">
                                    {pageSections.map((item, i) => (
                                        <a
                                            key={i}
                                            href={`#${item.href}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(item.href)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }}
                                            className="block px-1 py-1 font-normal text-gray-700 transition-all duration-150 hover:font-semibold hover:text-[#7f1414]"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="hide-scrollbar max-h-[80vh] flex-1 space-y-20 overflow-auto scroll-smooth lg:w-3/4">
                            {/* Hero Section */}
                            <section>
                                <motion.h1
                                    className="mb-4 text-3xl font-bold text-[#7f1414]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Our History
                                </motion.h1>
                                <motion.p
                                    className="mb-6 leading-relaxed text-gray-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    The Polytechnic University of the Philippines San Juan Campus has been committed to democratizing education in the
                                    heart of NCR since 2008. From humble beginnings to becoming a recognized center of academic excellence, our
                                    journey reflects dedication to quality education and community service.
                                </motion.p>

                                <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl">
                                    <img
                                        src="/images/homepage-slides/street-sj.png"
                                        alt="PUP San Juan Campus"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#800020]/70 to-transparent">
                                        <div className="p-6 text-white">
                                            <h3 className="text-xl font-bold">PUP San Juan Campus</h3>
                                            <p className="text-sm">Serving the community since 2008</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div className="rounded-xl bg-gradient-to-br from-[#800020] to-[#9b0026] p-4 text-center text-white">
                                        <div className="text-2xl font-bold">17</div>
                                        <div className="text-sm opacity-90">Years of Excellence</div>
                                    </div>
                                    <div className="rounded-xl bg-gradient-to-br from-[#800020] to-[#9b0026] p-4 text-center text-white">
                                        <div className="text-2xl font-bold">5,000+</div>
                                        <div className="text-sm opacity-90">Alumni</div>
                                    </div>
                                    <div className="rounded-xl bg-gradient-to-br from-[#800020] to-[#9b0026] p-4 text-center text-white">
                                        <div className="text-2xl font-bold">7</div>
                                        <div className="text-sm opacity-90">Degree Programs</div>
                                    </div>
                                    <div className="rounded-xl bg-gradient-to-br from-[#800020] to-[#9b0026] p-4 text-center text-white">
                                        <div className="text-2xl font-bold">Top 10</div>
                                        <div className="text-sm opacity-90">NCR Ranking</div>
                                    </div>
                                </div>
                            </section>

                            {/* Timeline */}
                            <section id="timeline">
                                <h2 className="mb-8 text-2xl font-semibold text-[#7f1414]">Campus Timeline</h2>
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-[#800020] to-[#80002050]"></div>

                                    <div className="space-y-8">
                                        {milestones.map((m, i) => (
                                            <motion.div
                                                key={i}
                                                className={`relative pl-20 ${m.highlight ? '-ml-4 rounded-xl bg-gradient-to-r from-[#7f14141a] to-transparent p-6' : ''}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                {/* Timeline dot */}
                                                <div
                                                    className={`absolute top-3 left-6 h-4 w-4 rounded-full border-4 ${m.highlight ? 'border-white bg-[#7f1414] shadow-lg' : 'border-[#7f1414] bg-white'}`}
                                                ></div>

                                                {/* Content */}
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`rounded-xl p-3 ${m.highlight ? 'bg-[#7f1414] text-white' : 'bg-gray-100 text-[#7f1414]'}`}
                                                    >
                                                        {m.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <span className="text-2xl font-bold text-[#7f1414]">{m.year}</span>
                                                            {m.highlight && <Star className="h-5 w-5 text-yellow-500" />}
                                                        </div>
                                                        <h3 className="mb-2 text-lg font-semibold text-gray-900">{m.event}</h3>
                                                        <p className="text-gray-600">{m.description}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Past Presidents */}
                            <section id="presidents">
                                <h2 className="mb-8 text-2xl font-semibold text-[#800020]">Past Presidents</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {presidents.map((p, i) => (
                                        <motion.div
                                            key={i}
                                            className="overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:border-[#800020]"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                        >
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="mb-1 text-xl font-bold text-gray-900">{p.name}</h3>
                                                <p className="mb-3 font-semibold text-[#800020]">{p.tenure}</p>
                                                <p className="text-sm text-gray-600">{p.achievements}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* Key Achievements */}
                            <section id="achievements">
                                <h2 className="mb-8 text-2xl font-semibold text-[#7f1414]">Key Achievements</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
                                    {achievements.map((achievement, i) => (
                                        <motion.div
                                            key={i}
                                            className="rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:border-[#800020]"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                        >
                                            <div className="mb-2 text-3xl font-bold text-[#800020]">{achievement.count}</div>
                                            <div className="mb-1 text-sm font-medium text-gray-900">{achievement.title}</div>
                                            <div className="text-xs text-gray-500">{achievement.year}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* Gallery */}
                            <section id="gallery">
                                <h2 className="mb-8 text-2xl font-semibold text-[#7f1414]">Campus Gallery</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {galleryImages.map((img, i) => (
                                        <motion.div
                                            key={i}
                                            className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <img
                                                src={img.src}
                                                alt={img.caption}
                                                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                <div className="absolute bottom-2 left-2 text-white">
                                                    <div className="text-sm font-semibold">{img.caption}</div>
                                                    <div className="text-xs opacity-80">{img.year}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* PUP Hymn */}

                            <section id="hymn">
                               <h2 className="mb-8 text-2xl font-semibold text-[#7f1414]">PUP Hymn</h2>

                                <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-10 shadow-lg">
                                    <div className="hymn-text grid grid-cols-1 gap-12 text-left leading-relaxed text-gray-800 md:grid-cols-2">
                                        {/* Left Column */}
                                        <div>
                                            <h3 className="mb-6 text-2xl font-semibold text-[#800020]">Sintang Paaralan</h3>
                                            <p>Sintang Paaralan</p>
                                            <p>Tanglaw ka ng bayan</p>
                                            <p>Pandayan ng isip ng kabataan</p>
                                            <p>Kami ay dumating nang salat sa yaman</p>
                                            <p>Hanap na dunong ay iyong alay</p>
                                            <p>Ang layunin mong makatao</p>
                                            <p>Dinarangal ang Pilipino</p>
                                            <p>Ang iyong aral, diwa, adhikang taglay</p>
                                            <p className="font-bold">PUP, aming gabay</p>
                                            <p className="font-bold">Paaralang dakila</p>
                                            <p className="font-bold">PUP, pinagpala</p>
                                        </div>

                                        {/* Right Column */}
                                        <div>
                                            <h3 className="invisible mb-6 text-2xl font-semibold text-[#800020]">Sintang Paaralan</h3>
                                            <p>Gagamitin ang karunungan</p>
                                            <p>Mula sa iyo, para sa bayan</p>
                                            <p>Ang iyong aral, diwa, adhikang taglay</p>
                                            <p className="font-bold">PUP, aming gabay</p>
                                            <p className="font-bold">Paaralang dakila</p>
                                            <p className="font-bold">PUP, pinagpala</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </Layout>
        </>
    );
}
