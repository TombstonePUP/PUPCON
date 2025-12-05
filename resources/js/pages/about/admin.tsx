'use client';
import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import FacultyCard from '@/components/ui/facultyCard';
import { Head, Link, usePoll } from '@inertiajs/react';
import { Administration, ContentPages } from '@/types/content';
import { Construction } from 'lucide-react';
import { motion } from 'framer-motion';


interface AdministrationPageProps {
    officials: Administration[];
    page: ContentPages;
}

export default function AdministrationPage({ officials, page }: AdministrationPageProps) {
    const quickLinks = [
        { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals' },
        { label: 'History', href: '/about/history' },
        { label: 'Administration', href: '/about/administration' },
        { label: 'Facilities', href: '/about/facilities' },
        { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
        { label: 'Local Task Force', href: '/about/local-task-force' },
    ];

    const pageSections = [
        { label: 'University Officials', href: 'university' },
        { label: 'Campus Officials', href: 'campus' },
    ];

    // Fallback Empty State Component
    const EmptyState = ({ title, description }: { title: string; description: string }) => (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <Construction className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );


    const renderOfficials = (officials: Administration[]) => {
        if (!officials || officials.length === 0) {
            return (
                <EmptyState
                    title="No Officials Found"
                    description="There are currently no officials available for this section."
                />
            );
        }

        return (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {officials.map((a) => (
                    <div
                        key={a.administration_id}
                        className="transform scale-95 transition-all duration-300 hover:scale-100 h-full flex"
                    >
                        <FacultyCard
                            className="h-full flex-1"
                            faculty={{
                                id: a.administration_id,
                                name: `${a.first_name} ${a.middle_name ?? ''} ${a.last_name} ${a.suffix ?? ''}`.trim(),
                                photo: a.profile_picture_path || '/images/placeholder.png',
                                position: a.position,
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    };


    const campus_officials = officials.filter((o) => o.type === 'Campus');
    const university_officials = officials.filter((o) => o.type === 'University');
    // usePoll(5000);
    return (
        <>
            <Head title="Administration - PUP San Juan" />
            <Layout>
                <div className="bg-white text-gray-800">
                    <PageHeader
                        title="University Administration"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Administration', href: '/admin' },
                        ]}
                    />

                    <div className="mx-auto w-[75%] px-6 py-12 lg:flex lg:gap-8">
                        {/* Sidebar */}
                        <aside className="mb-6 flex flex-col gap-4 lg:sticky lg:top-24 lg:mb-0 lg:w-1/4 lg:flex-shrink-0">
                            <div className="hidden lg:block rounded-xl border border-gray-200 bg-white p-6">
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
                        <main className="lg:w-3/4 flex-1 space-y-12 overflow-auto max-h-[80vh] scroll-smooth hide-scrollbar">


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
                                    {page?.subtitle}
                                </motion.p>

                            </section>
                            <section id="university" className="space-y-6">
                                <div className="card-fx rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                                    <h2 className="mb-3 text-3xl font-bold text-[#7f1414]">University Officials</h2>
                                    <p className="leading-relaxed text-gray-700">
                                        Meet the top officials managing PUP and driving university-wide initiatives.
                                    </p>
                                </div>
                                {renderOfficials(university_officials)}
                            </section>

                            <section id="campus" className="space-y-6">
                                <div className="card-fx rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                                    <h2 className="mb-3 text-3xl font-bold text-[#7f1414]">Campus Officials</h2>
                                    <p className="leading-relaxed text-gray-700">
                                        Meet the dedicated campus officials who ensure smooth operations at PUP San Juan.
                                    </p>
                                </div>
                                {renderOfficials(campus_officials)}
                            </section>
                        </main>
                    </div>
                </div>
            </Layout>
        </>
    );
}
