import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Briefcase, Building, GraduationCap, Landmark, Users } from 'lucide-react';

export default function About() {
    const navItems = [
        {
            title: 'Vision, Mission & Goals',
            href: '/about/vision-mission-goals',
            icon: <GraduationCap className="h-8 w-8 text-[#7f1414]" />,
        },
        {
            title: 'History',
            href: '/about/history',
            icon: <Landmark className="h-8 w-8 text-[#7f1414]" />,
        },
        {
            title: 'Administration',
            href: '/about/administration',
            icon: <Users className="h-8 w-8 text-[#7f1414]" />,
        },
        {
            title: 'Facilities',
            href: '/about/facilities',
            icon: <Building className="h-8 w-8 text-[#7f1414]" />,
        },
        {
            title: 'Faculty & Staff',
            href: '/about/faculty-and-staff',
            icon: <BookOpen className="h-8 w-8 text-[#7f1414]" />,
        },
        {
            title: 'Local Task Force',
            href: '/about/local-task-force',
            icon: <Briefcase className="h-8 w-8 text-[#7f1414]" />,
        },
    ];

    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center">
                    {/* Header Banner Section */}
                    <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-[#7f1414] to-[#a01818] py-4 shadow-sm">
                        <div className="mx-auto flex w-[75%] items-center justify-between text-white">
                            <h1 className="text-xl font-bold tracking-tight">About our campus</h1>
                            <nav className="flex items-center space-x-1 text-sm text-gray-200">
                                <Link href="/" className="hover:text-white hover:underline">
                                    Home
                                </Link>
                                <span>/</span>
                                <span className="text-white">About</span>
                            </nav>
                        </div>
                    </div>

                    {/* Navigation Cards */}
                    <section className="mt-12 grid w-[75%] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {navItems.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7f1414] hover:shadow-md"
                            >
                                <div className="rounded-full bg-[#7f1414]/10 p-4">{item.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#7f1414]">{item.title}</h3>
                            </Link>
                        ))}
                    </section>
                     <section className="mt-12 grid w-[75%] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {navItems.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7f1414] hover:shadow-md"
                            >
                                <div className="rounded-full bg-[#7f1414]/10 p-4">{item.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#7f1414]">{item.title}</h3>
                            </Link>
                        ))}
                    </section>
                     <section className="mt-12 grid w-[75%] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {navItems.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7f1414] hover:shadow-md"
                            >
                                <div className="rounded-full bg-[#7f1414]/10 p-4">{item.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#7f1414]">{item.title}</h3>
                            </Link>
                        ))}
                    </section>
                </div>
            </Layout>
        </>
    );
}
