import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';

export default function About() {
    const quickLinks = [
        { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals' },
        { label: 'History', href: '/about/history' },
        { label: 'Administration', href: '/about/administration' },
        { label: 'Facilities', href: '/about/facilities' },
        { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
        { label: 'Local Task Force', href: '/about/local-task-force' },
    ];

    const socials = [
        { label: '@pupsj', href: '/about/vision-mission-goals' },
        { label: 'History', href: '/about/history' },
        { label: 'Administration', href: '/about/administration' },
      
    ];

    const academicOrgs = [
        { name: 'Governing League of Information Technology Challengers', program: 'BS Information Technology', href: '#' },
        { name: 'Psychology Society', program: 'BS Psychology', href: '#' },
    ];

    const nonAcademicOrgs = [
        { name: 'Student Council', program: 'Official Student Government', href: '#' },
        { name: 'ALAB Danse Club', program: 'Campus-wide', href: '#' },
         { name: 'PYLON Esport SJ', program: 'Campus-wide', href: '#' },
          { name: 'Helping Hands Community', program: 'Campus-wide', href: '#' },
    ];

    return (
        <>
            <Head title="About Our Campus" />
            <Layout>
                <div className="bg-white text-gray-800">
                    <PageHeader
                        title="About our campus"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'About', href: '/about' },
                        ]}
                    />

                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-4 lg:px-12">
                        {/* Quick Links Sidebar */}
                        <aside className="flex flex-col gap-4">
                            <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-1">
                                <h2 className="mb-8 text-sm font-semibold text-[#7f1414ab]">QUICK LINKS</h2>
                                <nav className="space-y-2">
                                    {quickLinks.map((item, i) => (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            className="block px-1 py-1 font-normal text-gray-700 transition-colors duration-200 hover:text-[#7f1414]"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                              <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-1">
                                <h2 className="mb-8 text-sm font-semibold text-[#7f1414ab]">SOCIALS</h2>
                                <nav className="space-y-2">
                                    {socials.map((item, i) => (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            className="block px-1 py-1 font-normal text-gray-700 transition-colors duration-200 hover:text-[#7f1414]"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="space-y-12 lg:col-span-3">
                            {/* Intro Section */}
                            <section>
                                <h1 className="mb-4 text-3xl font-bold text-[#7f1414]">About Our Campus</h1>
                                <p className="mb-6 leading-relaxed text-gray-700">
                                    PUP San Juan is a vibrant academic community committed to excellence in education, research, and service. Our
                                    campus fosters innovation and inclusivity, offering a rich array of programs and facilities designed to prepare
                                    students for the future.
                                </p>
                                <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                                    Image Placeholder
                                </div>
                            </section>

                            {/* Academic Organizations */}
                            <section id="academic-orgs">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">Academic Organizations</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {academicOrgs.map((org, i) => (
                                        <Link
                                            key={i}
                                            href={org.href}
                                            className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                        >
                                            <h3 className="mb-10 text-lg font-semibold text-gray-900">{org.name}</h3>
                                            <p className="text-sm text-gray-600">{org.program}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Non-Academic Organizations */}
                            <section id="non-academic-orgs">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">Non-Academic Organizations</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {nonAcademicOrgs.map((org, i) => (
                                        <Link
                                            key={i}
                                            href={org.href}
                                            className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                                            <p className="text-sm text-gray-600">{org.program}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </Layout>
        </>
    );
}
