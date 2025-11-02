import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { Archive, Calendar, Database, Download, FileText, Globe, User, Users } from 'lucide-react';

export default function Others() {
    const services = [
        {
            title: 'PUP Student Information System (PUPSIS)',
            desc: 'Access your student account, grades, and course info online.',
            href: 'https://sis1.pup.edu.ph/',
            icon: <User className="h-6 w-6" />,
        },
        {
            title: 'RDBMS Research Management',
            desc: 'Manage your research projects and documentation in a structured way.',
            href: 'https://researchdb.example.com',
            icon: <Database className="h-6 w-6" />,
        },
        {
            title: 'Inventory Management System',
            desc: 'Track inventory and supplies for campus departments efficiently.',
            href: 'https://inventory.example.com',
            icon: <Archive className="h-6 w-6" />,
        },
        {
            title: 'SISJuan - Faculty Management',
            desc: 'Manage faculty records, assignments, and teaching schedules.',
            href: 'https://sisjuan.example.com',
            icon: <Users className="h-6 w-6" />,
        },
        {
            title: 'FALCOM - Schedule Management',
            desc: 'Organize and view class schedules for all programs and classrooms.',
            href: 'https://falcom.example.com',
            icon: <Calendar className="h-6 w-6" />,
        },
        {
            title: 'San Juan LGU Official Website',
            desc: 'Visit the official website of the San Juan local government.',
            href: 'https.://sanjuan.gov.ph',
            icon: <Globe className="h-6 w-6" />,
        },
    ];

    const documentForms = [
        {
            title: 'Admission Form (Form 137)',
            desc: 'Required for all incoming freshmen and transferees.',
            href: '/downloads/admission_form_137.pdf',
            icon: <FileText className="h-6 w-6" />,
        },
        {
            title: 'Scholarship Application Form',
            desc: 'Application form for university-sponsored scholarships.',
            href: '/downloads/scholarship_app_form.pdf',
            icon: <FileText className="h-6 w-6" />,
        },
        {
            title: 'Request for Transcript of Records',
            desc: 'Official form to request a copy of your academic records.',
            href: '/downloads/transcript_request_form.pdf',
            icon: <FileText className="h-6 w-6" />,
        },
        {
            title: 'Leave of Absence (LOA) Form',
            desc: 'Form for filing an official leave of absence for the semester.',
            href: '/downloads/loa_form.pdf',
            icon: <FileText className="h-6 w-6" />,
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

                <div className="mx-auto w-[75%] px-6 py-12">
                    <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                        <h2 className="mb-2 text-3xl font-bold text-[#7f1414]">Other Services & Portals</h2>
                        <p className="leading-relaxed text-gray-700">
                            Quick access to official university portals, campus-built systems, downloadable forms, and trusted external resources for
                            students and faculty.
                        </p>
                    </section>

                    <section className="mb-12 rounded-xl border border-gray-200 bg-white p-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {documentForms.map((form, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-all duration-300 hover:border-gray-200 hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#7f1414]/5 text-[#7f1414]">
                                            {form.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{form.title}</h3>
                                            <p className="text-sm text-gray-600">{form.desc}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={form.href}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
                                        aria-label={`Download ${form.title}`}
                                    >
                                        <Download className="h-5 w-5" />
                                    </a>
                                </div>
                            ))}
                        </div>
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
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">{service.icon}</div>

                                <h3 className="text-lg font-semibold">{service.title}</h3>

                                <p className="text-sm opacity-90">{service.desc}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
}
