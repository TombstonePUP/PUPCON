import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { CampusGoals, ContentPages, Pillars, Vmgo } from '@/types/content';
import { Head, Link, usePoll } from '@inertiajs/react';
import { AlertCircle, Construction } from 'lucide-react';

interface VMGOProps {
    page: ContentPages;
    campus_goals: CampusGoals[];
    pillars: Pillars[];
    vmgo: Vmgo;
}

// Fallback Empty State Component
const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Construction className="mb-4 h-16 w-16 text-gray-400" />
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

export default function VMGO({ page, campus_goals, pillars, vmgo }: VMGOProps) {
    // Add usePoll to auto-refresh data every 2 seconds
    usePoll(2000, {}, {
        keepAlive: true,
    });

    const quickLinks = [
        { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals', active: true },
        { label: 'History', href: '/about/history' },
        { label: 'Administration', href: '/about/administration' },
        { label: 'Facilities', href: '/about/facilities' },
        { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
        { label: 'Local Task Force', href: '/about/local-task-force' },
    ];

    const pageSections = [
        { label: 'Vision & Mission', href: 'vision-mission' },
        { label: 'University Goals', href: 'university-goals' },
        { label: 'Campus Goals', href: 'campus-goals' },
    ];

    // Check if data exists
    const hasVmgoData = vmgo && (vmgo.vision || vmgo.mission);
    const hasPillars = pillars && pillars.length > 0;
    const hasCampusGoals = campus_goals && campus_goals.length > 0;
    const hasAvpData = vmgo && vmgo.avp_link && vmgo.avp_description;

    return (
        <>
            <Head title="Vision, Mission and Goals - PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="bg-white text-gray-800">
                    <PageHeader
                        title="Mission, Vision, and Goals"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'About', href: '/about' },
                            { label: 'VMGO', href: '/about/vision-mission-goals' },
                        ]}
                    />

                    <div className="mx-auto w-[75%] px-6 py-12 lg:flex lg:gap-8">
                        {/* Sidebar */}
                        <aside className="mb-6 flex flex-col gap-4 lg:sticky lg:top-24 lg:mb-0 lg:w-1/4 lg:flex-shrink-0">
                            {/* Quick Links */}
                            <div className="hidden rounded-xl border border-gray-200 bg-white p-6 lg:block">
                                <h2 className="mb-8 text-sm font-semibold text-[#7f1414ab]">QUICK LINKS</h2>
                                <nav className="space-y-2">
                                    {quickLinks.map((item, i) => (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            className={`block px-1 py-1 transition-all duration-100 ${
                                                item.active
                                                    ? 'font-semibold text-[#7f1414]'
                                                    : 'font-normal text-gray-700 hover:font-semibold hover:text-[#7f1414]'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* Page Navigation */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-8 text-sm font-semibold text-[#7f1414ab]">ON THIS PAGE</h2>
                                <nav className="space-y-2">
                                    {pageSections.map((item, i) => (
                                        <a
                                            key={i}
                                            href={`#${item.href}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(item.href)?.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'center',
                                                });
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
                            {/* Introduction */}
                            <section>
                                <h1 className="mb-4 text-3xl font-bold text-[#7f1414]">{page?.title || 'Vision, Mission & Goals'}</h1>
                                <p className="mb-6 leading-relaxed text-gray-700">
                                    {page?.description || 'Explore our vision, mission, and strategic goals that guide our institution.'}
                                </p>
                            </section>

                            {/* Vision & Mission */}
                            <section id="vision-mission">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">Vision & Mission</h2>

                                {!hasVmgoData ? (
                                    <DataAlert message="Vision and Mission content is currently being updated. Please check back later." />
                                ) : (
                                    <div className="mb-8 grid gap-6 lg:grid-cols-2">
                                        {/* Vision */}
                                        <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm">
                                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Vision</h3>
                                            <p className="text-gray-700">{vmgo?.vision || 'Vision statement is not available.'}</p>
                                        </div>

                                        {/* Mission */}
                                        <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm">
                                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Mission</h3>
                                            <p className="text-gray-700">{vmgo?.mission || 'Mission statement is not available.'}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Video Section */}
                                {hasAvpData ? (
                                    <div className="rounded-xl border border-gray-200 bg-white p-10">
                                        <div className="grid gap-15 lg:grid-cols-5 lg:items-center">
                                            <div className="lg:col-span-3">
                                                <div className="aspect-video overflow-hidden rounded-xl">
                                                    <iframe
                                                        className="h-full w-full"
                                                        src={`${vmgo?.avp_link}?rel=0&showinfo=0&modestbranding=1`}
                                                        title="University Development Plan"
                                                        frameBorder="0"
                                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-2">
                                                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                                    {vmgo?.avp_title || 'University Development Plan'}
                                                </h3>
                                                <p className="mb-4 text-gray-700">{vmgo?.avp_description}</p>
                                                <a
                                                    href={vmgo?.avp_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center rounded-lg bg-[#7f1414] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#a01818]"
                                                >
                                                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                    Watch on YouTube
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="Video Content Coming Soon"
                                        description="Our institutional video presentation will be available here shortly."
                                    />
                                )}
                            </section>

                            {/* University Strategic Goals */}
                            <section id="university-goals">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">University Strategic Goals</h2>
                                <p className="mb-6 text-gray-600">Three fundamental pillars supporting our academic mission</p>

                                {!hasPillars ? (
                                    <EmptyState
                                        title="Strategic Goals Being Finalized"
                                        description="Our university strategic goals are currently under review and will be published soon."
                                    />
                                ) : (
                                    <div className="grid gap-6 lg:grid-cols-3">
                                        {pillars.map((pillar, pillarIndex) => (
                                            <div key={pillarIndex} className="space-y-4">
                                                {/* Pillar Header */}
                                                <div className="rounded-xl bg-[#7f1414] p-6 text-center text-white">
                                                    <h3 className="text-lg font-semibold">Pillar {pillarIndex + 1}</h3>
                                                    <p className="text-sm">{pillar.pillar_title}</p>
                                                </div>

                                                {/* Goals */}
                                                <div className="space-y-3">
                                                    {pillar.pillar_items && pillar.pillar_items.length > 0 ? (
                                                        pillar.pillar_items.map((goal) => (
                                                            <div
                                                                key={goal.item_id}
                                                                className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                                            >
                                                                <div className="flex items-start space-x-3">
                                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#7f1414] text-xs font-bold text-white">
                                                                        {goal.item_id}
                                                                    </div>
                                                                    <p className="text-sm leading-relaxed text-gray-800">{goal.item_description}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                                                            <p className="text-sm text-gray-500">No goals defined for this pillar yet.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* PUP San Juan Goals */}
                            <section id="campus-goals">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">PUP San Juan Campus Goals</h2>
                                <p className="mb-6 text-gray-600">Six strategic goals driving our campus excellence</p>

                                {!hasCampusGoals ? (
                                    <EmptyState
                                        title="Campus Goals In Development"
                                        description="Our campus-specific strategic goals are being developed and will be shared here once finalized."
                                    />
                                ) : (
                                    <div className="grid gap-6 lg:grid-cols-2">
                                        {campus_goals.map((goal) => (
                                            <div
                                                key={goal.goal_id}
                                                className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                            >
                                                <div className="mb-4 flex items-start space-x-4">
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#7f1414] text-lg font-bold text-white">
                                                        {goal.goal_id}
                                                    </div>
                                                    <div>
                                                        <h3 className="mb-3 text-lg font-semibold text-gray-900">{goal.goal_title_eng}</h3>
                                                        <p className="mb-4 leading-relaxed text-gray-700">{goal.goal_desc_eng}</p>
                                                        <details className="group">
                                                            <summary className="cursor-pointer text-sm font-medium text-[#7f1414] transition-colors hover:text-[#a01818]">
                                                                View in Filipino
                                                            </summary>
                                                            <div className="mt-3 rounded-lg bg-gray-50 p-4">
                                                                <p className="text-sm italic text-gray-600">{goal.goal_desc_fil}</p>
                                                            </div>
                                                        </details>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
