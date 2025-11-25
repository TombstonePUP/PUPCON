import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { CampusDirectors, CampusGallery, ContentPages } from '@/types/content';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';

interface HistoryProps {
    page: ContentPages;
    directors: CampusDirectors[];
    gallery: CampusGallery[];
}

export default function History({ page, directors, gallery }: HistoryProps) {
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
                            <div className="hidden rounded-xl border border-gray-200 bg-white p-6 lg:block">
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
                                    {page?.title}
                                </motion.h1>
                                <motion.p
                                    className="mb-6 leading-relaxed text-gray-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {page?.description}
                                </motion.p>

                                <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl">
                                    <img src={`${page?.image_path}`} alt={`${page?.image_name}`} className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#800020]/70 to-transparent">
                                        <div className="p-6 text-white">
                                            <h3 className="text-xl font-bold">PUP San Juan Campus</h3>
                                            <p className="text-sm">Serving the community since 2008</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Past Presidents */}
                            {directors && directors.length > 0 && (
                                <section id="presidents">
                                    <h2 className="mb-8 text-2xl font-semibold text-[#800020]">Past Presidents</h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {directors?.map((d, i) => (
                                            <motion.div
                                                key={i}
                                                className="overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:border-[#800020]"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                            >
                                                <div className="h-48 overflow-hidden">
                                                    <img
                                                        src={d.profile_image_path}
                                                        alt={d.profile_image_name}
                                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="mb-1 text-xl font-bold text-gray-900">{d.name}</h3>
                                                    <p className="mb-3 font-semibold text-[#800020]">
                                                        {new Date(d.term_end_date).getFullYear() - new Date(d.term_start_date).getFullYear()} years
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Gallery */}
                            {gallery && gallery.length > 0 && (
                                <section id="gallery">
                                    <h2 className="mb-8 text-2xl font-semibold text-[#7f1414]">Campus Gallery</h2>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                        {gallery?.map((img, i) => (
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
                                                    src={img.image_path}
                                                    alt={img.image_name}
                                                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    <div className="absolute bottom-2 left-2 text-white">
                                                        <div className="text-sm font-semibold">{img.description}</div>
                                                        {/*<div className="text-xs opacity-80">{img.year}</div>*/}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

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
