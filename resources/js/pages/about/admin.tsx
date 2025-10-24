'use client';
import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import FacultyCard from '@/components/ui/facultyCard';
import { Head, Link } from '@inertiajs/react';
import type { Faculty } from '@/types';

export default function Administration() {
    const universityOfficials: Faculty[] = [
        {
            faculty_id: 1,
            first_name: 'Manuel M.',
            middle_name: '',
            last_name: 'Muhi',
            suffix: 'D.Tech., ASEAN Engr.',
            faculty_status: 'University President',
            faculty_image_path: '/images/univ-officials/pres.jpg',
        },
        {
            faculty_id: 2,
            first_name: 'Alberto C.',
            middle_name: '',
            last_name: 'Guillo',
            suffix: 'MS (Stat) MA (Econ)',
            faculty_status: 'Executive Vice President, Vice President for Planning and Finance (concurrent)',
            faculty_image_path: '/images/univ-officials/vpfinance.png',
        },
        {
            faculty_id: 3,
            first_name: 'Emanuel C.',
            middle_name: '',
            last_name: 'De Guzman',
            suffix: 'Ph.D',
            faculty_status: 'Vice President for Academic Affairs',
            faculty_image_path: '/images/univ-officials/vpacad.png',
        },
        {
            faculty_id: 4,
            first_name: 'Tomas O.',
            middle_name: '',
            last_name: 'Testor',
            suffix: 'MPA',
            faculty_status: 'Vice President for Student Affairs and Services',
            faculty_image_path: '/images/univ-officials/vpsa.png',
        },
        {
            faculty_id: 5,
            first_name: 'Anna Ruby P.',
            middle_name: '',
            last_name: 'Gapasin',
            suffix: 'DEM',
            faculty_status: 'Vice President for Research, Extension and Development',
            faculty_image_path: '/images/univ-officials/vpresearch.png',
        },
        {
            faculty_id: 6,
            first_name: 'Pascualito B.',
            middle_name: '',
            last_name: 'Gatan',
            suffix: 'MBA',
            faculty_status: 'Vice President for Campuses',
            faculty_image_path: '/images/univ-officials/vpbranches.png',
        },
        {
            faculty_id: 7,
            first_name: 'Adam V.',
            middle_name: '',
            last_name: 'Ramilo',
            suffix: 'MIR',
            faculty_status: 'Vice President for Administration',
            faculty_image_path: '/images/univ-officials/vpadmin.png',
        },
    ];

    const campusOfficials: Faculty[] = [
        {
            faculty_id: 101,
            first_name: 'Cecilia R.',
            middle_name: 'Reyes',
            last_name: 'Alagon',
            suffix: '',
            faculty_status: 'Associate Professor IV, Campus Director',
            faculty_image_path: '/images/adfa-new/faculty/Cecilia-R.-Alagon.jpg',
        },
        {
            faculty_id: 102,
            first_name: 'Alfred M.',
            middle_name: '',
            last_name: 'Pagalilawan',
            suffix: '',
            faculty_status: 'Associate Professor II, Head of Academic Programs',
            faculty_image_path: '/images/adfa-new/faculty/Alfred-Pagalilawan.jpg',
        },
        {
            faculty_id: 103,
            first_name: 'Peter Glenn J.',
            middle_name: '',
            last_name: 'Biason',
            suffix: '',
            faculty_status: 'Assistant Professor I, Head, Office of the Student Affairs and Services',
            faculty_image_path: '/images/adfa-new/faculty/Peter-Biason.jpg',
        },
        {
            faculty_id: 104,
            first_name: 'Giscelle Iveth J.',
            middle_name: '',
            last_name: 'Samonte',
            suffix: '',
            faculty_status: 'Instructor I, Campus Registrar',
            faculty_image_path: '/images/pupsj-logo.png',
        },
        {
            faculty_id: 105,
            first_name: 'Maria Carina P.',
            middle_name: '',
            last_name: 'Corpuz',
            suffix: '',
            faculty_status: 'Instructor III, Head, Quality Assurance and OJT Coordinator',
            faculty_image_path: '/images/adfa-new/faculty/Maria-Carina-Corpuz.jpg',
        },
        {
            faculty_id: 106,
            first_name: 'Rizza',
            middle_name: '',
            last_name: 'Valdez-De Vera',
            suffix: '',
            faculty_status: 'Assistant Professor II, Collecting and Disbursing Officer',
            faculty_image_path: '/images/adfa-new/faculty/Rizza-Valdez-Devera.jpg',
        },
        {
            faculty_id: 107,
            first_name: 'Mecmack A.',
            middle_name: '',
            last_name: 'Nartea',
            suffix: '',
            faculty_status: 'Associate Professor I, Head, Admissions Office and Scholarship and Financial Assistance',
            faculty_image_path: '/images/adfa-new/faculty/Meckmack-Nartea.jpg',
        },
        {
            faculty_id: 108,
            first_name: 'Anna Madonna M.',
            middle_name: '',
            last_name: 'Arellano',
            suffix: '',
            faculty_status: 'Assistant Professor II, Guidance Counselor and GAD Focal Person',
            faculty_image_path: '/images/adfa-new/faculty/Anna-Madonna-Arellano.jpg',
        },
        {
            faculty_id: 109,
            first_name: 'Jane L.',
            middle_name: '',
            last_name: 'Mendoza',
            suffix: '',
            faculty_status: 'Instructor I, Head, Cultural Affairs Office',
            faculty_image_path: '/images/adfa-new/faculty/Jane-Mendoza.jpg',
        },
        {
            faculty_id: 110,
            first_name: 'Ian J.',
            middle_name: '',
            last_name: 'Saguindan',
            suffix: '',
            faculty_status: 'Instructor I, Research Focal Person',
            faculty_image_path: '/images/adfa-new/faculty/Ian-Saguindan.jpg',
        },
        {
            faculty_id: 111,
            first_name: 'Ronette M.',
            middle_name: '',
            last_name: 'Espiritu',
            suffix: '',
            faculty_status: 'Instructor II, Extension Coordinator',
            faculty_image_path: '/images/adfa-new/faculty/Ronette-Espiritu.jpg',
        },
    ];

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

    const renderOfficials = (officials: Faculty[]) => (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {officials.map((f) => (
                <div key={f.faculty_id} className="transform scale-95 transition-all duration-300 hover:scale-100 h-full flex">
                    <FacultyCard
                        className="h-full flex-1"
                        faculty={{
                            id: f.faculty_id,
                            name: `${f.first_name} ${f.middle_name ?? ''} ${f.last_name} ${f.suffix ?? ''}`.trim(),
                            photo: f.faculty_image_path || '/images/placeholder.png',
                            position: f.faculty_status,
                        }}
                    />
                </div>
            ))}
        </div>
    );

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
                        <main className="lg:w-3/4 flex-1 space-y-12 overflow-auto max-h-[80vh] scroll-smooth hide-scrollbar">
                            <section id="university" className="space-y-6">
                                <div className="card-fx rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                                    <h2 className="mb-3 text-3xl font-bold text-[#7f1414]">University Officials</h2>
                                    <p className="leading-relaxed text-gray-700">
                                        Meet the top officials managing PUP and driving university-wide initiatives.
                                    </p>
                                </div>
                                {renderOfficials(universityOfficials)}
                            </section>

                            <section id="campus" className="space-y-6">
                                <div className="card-fx rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                                    <h2 className="mb-3 text-3xl font-bold text-[#7f1414]">Campus Officials</h2>
                                    <p className="leading-relaxed text-gray-700">
                                        Meet the dedicated campus officials who ensure smooth operations at PUP San Juan.
                                    </p>
                                </div>
                                {renderOfficials(campusOfficials)}
                            </section>
                        </main>
                    </div>
                </div>
            </Layout>
        </>
    );
}