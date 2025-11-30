import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { ContentPages, OrganizationTypes } from '@/types/content';
import { Head, Link, usePoll } from '@inertiajs/react';
import { AlertCircle, Building2, Construction, GraduationCap, Mail, MapPin, Phone, School, Users } from 'lucide-react';

interface AboutPageProps {
    page: ContentPages;
    programs: number;
    facilities: number;
    org_types: OrganizationTypes[];
}

// Fallback Empty State Component
const EmptyState = ({ title, description, icon: Icon = Construction }: { title: string; description: string; icon?: any }) => (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Icon className="mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

// Alert Component for missing critical data
const DataAlert = ({ message }: { message: string }) => (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
            <p className="text-sm font-medium text-amber-900">Content Unavailable</p>
            <p className="mt-1 text-sm text-amber-700">{message}</p>
        </div>
    </div>
);

export default function About({ page, programs, facilities, org_types }: AboutPageProps) {
    usePoll(5000);

    const quickLinks = [
        { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals' },
        { label: 'History', href: '/about/history' },
        { label: 'Administration', href: '/about/administration' },
        { label: 'Facilities', href: '/about/facilities' },
        { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
        { label: 'Local Task Force', href: '/about/local-task-force' },
    ];

    const pageSections = [
        ...(org_types?.length
            ? org_types.map((type) => ({
                  label: type.type_name,
                  href: type.type_name.toLowerCase().replace(/\s+/g, '-'),
              }))
            : []),
        { label: 'Contact & Office Hours', href: 'contact' },
    ];

    const campusFacts = [
        { icon: <School className="h-6 w-6 text-[#7f1414]" />, label: 'Established', value: '2008' },
        { icon: <GraduationCap className="h-6 w-6 text-[#7f1414]" />, label: 'Programs Offered', value: programs || 0 },
        { icon: <Building2 className="h-6 w-6 text-[#7f1414]" />, label: 'Facilities', value: facilities || 0 },
    ];

    // Check if data exists
    const hasPageData = page && (page.title || page.subtitle || page.image_path);
    const hasOrgTypes = org_types && org_types.length > 0;
    const hasContactInfo = page && (page.address || page.phone_number);

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
                            {/* Intro Section */}
                            <section>
                                {!hasPageData ? (
                                    <DataAlert message="About page content is currently being updated. Please check back later." />
                                ) : (
                                    <>
                                        <h1 className="mb-4 text-3xl font-bold text-[#7f1414]">{page?.title || 'About PUP San Juan'}</h1>
                                        <p className="mb-6 leading-relaxed text-gray-700">
                                            {page?.subtitle || 'Learn more about our campus and what we offer to our students.'}
                                        </p>

                                        <div className="flex flex-col gap-6">
                                            {page?.image_path ? (
                                                <div className="relative h-64 w-full overflow-hidden rounded-xl">
                                                    <img
                                                        src={page.image_path}
                                                        alt={page.image_name || 'Campus Image'}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100">
                                                    <School className="h-16 w-16 text-gray-300" />
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-6">
                                                {campusFacts.map((fact, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex min-w-[200px] flex-1 flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                                    >
                                                        {fact.icon}
                                                        <p className="mt-2 text-xl font-bold text-gray-900">{fact.value}</p>
                                                        <p className="text-sm text-gray-600">{fact.label}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>

                            {/* Organizations Section */}
                            {!hasOrgTypes ? (
                                <EmptyState
                                    title="Organizations Information Coming Soon"
                                    description="Campus organizations and student groups are being compiled and will be displayed here shortly."
                                    icon={Users}
                                />
                            ) : (
                                org_types.map((type) => (
                                    <section id={`${type.type_name.toLowerCase().replace(/\s+/g, '-')}`} key={type.type_id}>
                                        <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">{type.type_name}</h2>
                                        {type.organizations && type.organizations.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                {type.organizations.map((org, i) => (
                                                    <Link
                                                        key={i}
                                                        href="#"
                                                        className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                                    >
                                                        <h3 className="mb-2 text-lg font-semibold text-gray-900">{org.organization_name}</h3>
                                                        <p className="text-sm text-gray-600">{org.affiliation || 'No affiliation specified'}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                                                <p className="text-sm text-gray-500">No organizations listed under this category yet.</p>
                                            </div>
                                        )}
                                    </section>
                                ))
                            )}

                            {/* Contact & Office Hours */}
                            <section id="contact">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">Contact & Office Hours</h2>
                                {!hasContactInfo ? (
                                    <DataAlert message="Contact information is being updated. Please check back later." />
                                ) : (
                                    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
                                        {page?.address && (
                                            <p className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-[#7f1414]" />
                                                {page.address}
                                            </p>
                                        )}
                                        {page?.phone_number && (
                                            <p className="flex items-center gap-2">
                                                <Phone className="h-5 w-5 text-[#7f1414]" />
                                                {page.phone_number}
                                            </p>
                                        )}
                                        <p className="flex items-center gap-2">
                                            <Mail className="h-5 w-5 text-[#7f1414]" />
                                            pupsj@pup.edu.ph
                                        </p>
                                        <p className="mt-2 text-sm">Office Hours: Mon–Fri, 8:00 AM – 5:00 PM</p>
                                    </div>
                                )}
                            </section>
                        </main>
                    </div>
                </div>
            </Layout>
        </>
    );
}
