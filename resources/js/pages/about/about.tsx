import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, GraduationCap, Mail, MapPin, Phone, School, Users } from 'lucide-react';

export default function About() {
    const quickLinks = [
        { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals' },
        { label: 'History', href: '/about/history' },
        { label: 'Administration', href: '/about/administration' },
        { label: 'Facilities', href: '/about/facilities' },
        { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
        { label: 'Local Task Force', href: '/about/local-task-force' },
    ];

    const pageSections = [
        { label: 'Campus Snapshot', href: 'snapshot' },
        { label: 'Academic Organizations', href: 'academic-orgs' },
        { label: 'Non-Academic Organizations', href: 'non-academic-orgs' },
        { label: 'Program Accreditations', href: 'accreditations' },
        { label: 'Contact & Office Hours', href: 'contact' },
    ];

    const campusFacts = [
        { icon: <School className="h-6 w-6 text-[#7f1414]" />, label: 'Established', value: '2008' },
        { icon: <Users className="h-6 w-6 text-[#7f1414]" />, label: 'Students & Faculty', value: '2,500+' },
        { icon: <GraduationCap className="h-6 w-6 text-[#7f1414]" />, label: 'Programs Offered', value: '7' },
        { icon: <Building2 className="h-6 w-6 text-[#7f1414]" />, label: 'Facilities', value: '12+' },
    ];

    const awards = [
        { name: 'CHED Center of Development', logo: '/images/awards/ched.png' },
        { name: 'ISO 9001 Certified', logo: '/images/awards/iso.png' },
    ];

    const academicOrgs = [
        { name: 'Governing League of Information Technology Challengers (GLITCH)', program: 'BS Information Technology', href: '#' },
        { name: 'Psychology Society (PSYSOC)', program: 'BS Psychology', href: '#' },
        { name: 'Junior Financial Executives (JFINEX)', program: 'BSBA Financial Management', href: '#' },
        { name: 'Junior Philippine Institute of Accountants (JPIA)', program: 'BS Accountancy', href: '#' },
        { name: 'Young Educators Society (YES)', program: 'BS Education Major in English', href: '#' },
        { name: 'Hospitality Management Society (HMSOC)', program: 'BS Hospitality Management', href: '#' },
        { name: 'Collegiate Entrepreneurs Organization (CEO)', program: 'BS Entrepreneurship', href: '#' },
    ];

    const nonAcademicOrgs = [
        { name: 'Student Council', program: 'Official Student Government', href: '#' },
        { name: 'Paraseist', program: 'Campus Publication and Journalism', href: '#' },
        { name: 'Rotaract Club', program: 'Campus-wide', href: '#' },
        { name: 'ALAB Danse Club', program: 'Dance Group', href: '#' },
        { name: 'PYLON Esport SJ', program: 'Esports Games', href: '#' },
        { name: 'Lente Felikulas', program: 'Film and Multimedia', href: '#' },
        { name: 'Helping Hands Community', program: 'Campus-wide', href: '#' },
    ];

    const programAccreditations = [
        { program: 'BS Information Technology', level: 2 },
        { program: 'BS Accountancy', level: 1 },
        { program: 'BS Psychology', level: 3 },
        { program: 'BS Hospitality Management', level: 4 },
        // add more…
    ];

    // Maximum accreditation level
    const MAX_LEVEL = 6;

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

                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-18 px-6 py-12 lg:grid-cols-4 lg:px-12">
                        {/* Sidebar */}
                        <aside className="flex flex-col gap-4">
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
                                                document.getElementById(item.href)?.scrollIntoView({ behavior: 'smooth', block: 'center'  });
                                            }}
                                            className="block px-1 py-1 font-normal text-gray-700 transition-all duration-150 hover:font-semibold hover:text-[#7f1414]"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main */}
                        <main className="space-y-20 lg:col-span-3">
                            {/* Intro */}
                            <section>
                                <h1 className="mb-4 text-3xl font-bold text-[#7f1414]">About Our Campus</h1>
                                <p className="mb-6 leading-relaxed text-gray-700">
                                    PUP San Juan is a vibrant academic community committed to excellence in education, research, and service. Our
                                    campus fosters innovation and inclusivity, offering a rich array of programs and facilities designed to prepare
                                    students for the future.
                                </p>
                                <div className="relative h-64 w-full overflow-hidden rounded-xl">
                                    <img src="/images/homepage-slides/street-sj.png" alt="" className="h-full w-full object-cover" />
                                </div>
                            </section>

                            {/* 1️⃣ Campus Snapshot */}
                            <section id="snapshot">
                                <h2 className="mb-6 text-2xl font-semibold text-[#7f1414]">Campus Snapshot</h2>
                                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                                    {campusFacts.map((fact, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center"
                                        >
                                            {fact.icon}
                                            <p className="mt-2 text-xl font-bold text-gray-900">{fact.value}</p>
                                            <p className="text-sm text-gray-600">{fact.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Academic Orgs */}
                            <section id="academic-orgs">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">Academic Organizations</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {academicOrgs.map((org, i) => (
                                        <Link
                                            key={i}
                                            href={org.href}
                                            className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                        >
                                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{org.name}</h3>
                                            <p className="text-sm text-gray-600">{org.program}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Non-Academic Orgs */}
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

                            {/* Accredication Level of Programs */}
                            <section className="space-y-8" id="accreditations">
                                <h2 className="text-2xl font-semibold text-[#7f1414]">Program Accreditation Levels</h2>

                                {/* Two-column grid */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {programAccreditations.map((p, i) => {
                                        const percentage = (p.level / MAX_LEVEL) * 100;
                                        return (
                                            <div key={i} className="space-y-2 rounded-xl border border-gray-200 bg-white p-6">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-l font-medium text-gray-900">{p.program}</h3>
                                                    <span className="text-sm font-semibold text-[#7f1414]">
                                                        Level {p.level} / {MAX_LEVEL}
                                                    </span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="h-3 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className="h-3 rounded-full bg-[#7f1414] transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* 7️⃣ Contact & Office Hours */}
                            <section id="contact">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">Contact & Office Hours</h2>
                                <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-[#7f1414]" />
                                        PUP San Juan Campus, San Juan City, Metro Manila
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-[#7f1414]" /> (02) 123-4567
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-[#7f1414]" /> pupsj@pup.edu.ph
                                    </p>
                                    <p className="mt-2 text-sm">Office Hours: Mon–Fri, 8:00 AM – 5:00 PM</p>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </Layout>
        </>
    );
}
