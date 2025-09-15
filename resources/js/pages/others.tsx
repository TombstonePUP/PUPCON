import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function Others() {
    const services = [
        {
            title: 'University Student Portal',
            desc: 'Access your student account, grades, and course info online.',
            href: 'https://studentportal.example.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.84 6.122L12 14z" />
                </svg>
            ),
        },
        {
            title: 'Online Guidance Appointment',
            desc: 'Schedule guidance counseling sessions easily through this portal.',
            href: 'https://guidance.example.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            title: 'RDBMS Research Management',
            desc: 'Manage your research projects and documentation in a structured way.',
            href: 'https://researchdb.example.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v4h18V7M3 15v4h18v-4M3 7l9 6 9-6" />
                </svg>
            ),
        },
        {
            title: 'Inventory Management System',
            desc: 'Track inventory and supplies for campus departments efficiently.',
            href: 'https://inventory.example.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h18M9 21V9" />
                </svg>
            ),
        },
        {
            title: 'SISJuan - Faculty Management',
            desc: 'Manage faculty records, assignments, and teaching schedules.',
            href: 'https://sisjuan.example.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v18h14V3H5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8" />
                </svg>
            ),
        },
        {
            title: 'FALCOM - Schedule Management',
            desc: 'Organize and view class schedules for all programs and classrooms.',
            href: 'https://falcom.example.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            title: 'San Juan LGU Official Website',
            desc: 'Visit the official website of the San Juan local government.',
            href: 'https://sanjuan.gov.ph',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <Head title="Other Services and Portals" />
            <Layout>
                <PageHeader
                    title="Other Services and Portals"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Others', href: '/others' },
                    ]}
                />

                <div className="mx-auto max-w-7xl px-6 py-12">
                    <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                        <h2 className="mb-2 text-3xl font-bold text-[#7f1414]">Other Services & Portals</h2>
                        <p className="leading-relaxed text-gray-700">
                            Quick access to official university portals, campus-built systems, and trusted external resources for students and
                            faculty.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((service, i) => (
                            <a
                                key={i}
                                href={service.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-start gap-4 rounded-xl bg-[#7f1414] p-7 text-white shadow-md transition-all hover:-translate-y-1 hover:bg-[#a83232] hover:shadow-lg"
                            >
                                {/* Icon */}
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">{service.icon}</div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold">{service.title}</h3>

                                {/* Description */}
                                <p className="text-sm opacity-90">{service.desc}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
}
