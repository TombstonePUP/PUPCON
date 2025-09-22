import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/components/guest-page-header';

export default function VMGO() {
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

    const universityGoals = [
        {
            pillar: "Teaching and Learning",
            color: "bg-red-900",
            goals: [
                { id: 1, title: "Innovative Curricula and Instruction" },
                { id: 2, title: "Empowered, Expert, and Productive Faculty Members" },
                { id: 3, title: "Holistic Student Development" }
            ]
        },
        {
            pillar: "Research and Extension", 
            color: "bg-red-900",
            goals: [
                { id: 4, title: "Intensified Research Innovation, Dissemination and Utilization" },
                { id: 5, title: "Strengthened Sustainable and Impactful Extension Program" },
                { id: 6, title: "Expanded Research and Extension Networks with Local, National, and International Partners" }
            ]
        },
        {
            pillar: "Internal Governance",
            color: "bg-red-900",
            goals: [
                { id: 7, title: "Transformational University Leadership" },
                { id: 8, title: "Judicious and Ethical Stewardship of Physical and Financial Resources" },
                { id: 9, title: "Effective and Efficient Human Resource Management" },
                { id: 10, title: "Excellent Citizen/Client Satisfaction" },
                { id: 11, title: "Smart Campuses" }
            ]
        }
    ];

    const campusGoals = [
        {
            id: 1,
            title: "Academic Excellence",
            description: "To promote and strengthen academic excellence to be able to produce globally competitive, socioeconomically responsible, and culturally and gender-inclusive graduates.",
            filipino: "Adhikain 1: Kahusayang Pang-Akademiko – Upang itaguyod at palakasin ang kahusayang pang-akademiko upang magluwal ng mga propesyunal na mayroong pandaigdigang kakayahan, may kapanagutang sosyo-ekonomikal, pangkultural at pangkasariang pagbuo."
        },
        {
            id: 2,
            title: "Empowered Faculty Members and Employees",
            description: "To uplift the knowledge, skills, values and wellness of faculty members and employees through relevant capacity building by intensifying partnership with government agencies, private institutions, and individuals.",
            filipino: "Adhikain 2: Pinahusay na Dalubguro at Kawani – Upang magpapaunlad ng karunungan, kasanayan, kahalagahan at kalusugan ng mga dalubguro at mga kawani sa pamamagitan ng mga makabuluhang gawaing magpapatibay ng ugnayan sa mga sangay ng pamahalaan, pribadong institusyon at mga indibidwal."
        },
        {
            id: 3,
            title: "Commitment in Research Engagement",
            description: "To produce interdisciplinary and multidisciplinary researches through collaboration and linkages for generating new knowledge and addressing societal needs.",
            filipino: "Adhikain 3: Masikhay na Pakikibahagi sa Pananaliksik – Upang makalikha ng mga pananaliksik na interdisiplinaryo at multidisiplinaryo sa pamamagitan ng pakikipagtulungan at ugnayan para sa pagbuo ng bagong kaalaman at pagtugon sa mga pangangailangan sa lipunan."
        },
        {
            id: 4,
            title: "Evidence-based Outreach and Extension Programs",
            description: "To contribute to the improvement of communities through implementing evidence-based outreach and extension programs.",
            filipino: "Adhikain 4: Mga Programang Pantulong at Pakikipag-ugnayang Panlabas na batay sa mga Katibayan – Upang makapag-ambag sa pagpapabuti ng pamayanan sa pamamagitan ng pagpapatupad ng mga programang pantulong at pang-ugnayang panlabas na batay sa mga katibayan."
        },
        {
            id: 5,
            title: "State-of-the-art Knowledge Management",
            description: "To upgrade facilities, equipment, and other educational resources conducive for dynamic and holistic learning.",
            filipino: "Adhikain 5: Makabagong Pamamaraan ng Pangangasiwa ng Karunungan – Upang magpapaunlad ng mga pasilidad at iba pang mapagkukuhanan ng mga kagamitang pampagtuturo upang maging kaaya-aya ang dinamiko at holistikong pagkakatuto."
        },
        {
            id: 6,
            title: "Enduring Academic Community",
            description: "To build a strong, safe, and resilient academic community anchored on Filipino values to support growth and opportunities through fellowship and active engagement.",
            filipino: "Adhikain 6: Matatag na Akademikong Pamayanan – Upang bumuo ng isang matatag, ligtas at matibay na akademikong komunidad na nakasandig sa mga pagpapahalagang Pilipino upang masuportahan ang mga pag-unlad at oportunidad sa pamamagitan ng pakikipagkapwa at aktibong pakikipag-ugnayan."
        }
    ];

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
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
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
                                                    block: 'center' 
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
                        <main className="lg:w-3/4 flex-1 space-y-20 overflow-auto max-h-[80vh] scroll-smooth hide-scrollbar">
                            {/* Introduction */}
                            <section>
                                <h1 className="mb-4 text-3xl font-bold text-[#7f1414]">From an Epistemic Community Towards a National Polytechnic University</h1>
                                <p className="mb-6 leading-relaxed text-gray-700">
                                    The stellar accomplishments of PUP San Juan Branch are founded on the University's vision as an epistemic community towards a National Polytechnic University of the Philippines. Our commitment aligns with the 10 Pillar Reform Agenda of President Dr. Manuel Muhi.
                                </p>
                            </section>

                            {/* Vision & Mission */}
                            <section id="vision-mission">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">Vision & Mission</h2>
                                
                                <div className="grid gap-6 lg:grid-cols-2 mb-8">
                                    {/* Vision */}
                                    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm">
                                     
                                        <h3 className="mb-4 text-xl font-semibold text-gray-900">Vision</h3>
                                        <p className="text-gray-700">
                                            A Leading Comprehensive Polytechnic University in Asia
                                        </p>
                                    </div>

                                    {/* Mission */}
                                    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm">
                                      
                                        <h3 className="mb-4 text-xl font-semibold text-gray-900">Mission</h3>
                                        <p className="text-gray-700">
                                            Advance an inclusive, equitable, and globally relevant polytechnic education towards national development.
                                        </p>
                                    </div>
                                </div>

                                {/* Video Section */}
                                <div className="rounded-xl border border-gray-200 bg-white p-10">
                                    <div className="grid gap-15 lg:grid-cols-5 lg:items-center">
                                        <div className="lg:col-span-3">
                                            <div className="aspect-video overflow-hidden rounded-xl">
                                                <iframe
                                                    className="h-full w-full"
                                                    src="https://www.youtube.com/embed/Lp_x4dWvLs4?rel=0&showinfo=0&modestbranding=1"
                                                    title="University Development Plan"
                                                    frameBorder="0"
                                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        </div>
                                        <div className="lg:col-span-2">
                                            <h3 className="mb-4 text-xl font-semibold text-gray-900">University Development Plan</h3>
                                            <p className="mb-4 text-gray-700">
                                                Discover the roadmap that shapes our future — goals, strategies, and developments leading PUP into a new era of excellence.
                                            </p>
                                            <a
                                                href="https://www.youtube.com/watch?v=Lp_x4dWvLs4"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center rounded-lg bg-[#7f1414] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#a01818]"
                                            >
                                                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                                Watch on YouTube
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* University Strategic Goals */}
                            <section id="university-goals">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">University Strategic Goals</h2>
                                <p className="mb-6 text-gray-600">Three fundamental pillars supporting our academic mission</p>

                                <div className="grid gap-6 lg:grid-cols-3">
                                    {universityGoals.map((pillar, pillarIndex) => (
                                        <div key={pillarIndex} className="space-y-4">
                                            {/* Pillar Header */}
                                            <div className={`rounded-xl p-6 text-center text-white ${pillar.color}`}>
                                                <h3 className="text-lg font-semibold">Pillar {pillarIndex + 1}</h3>
                                                <p className="text-sm">{pillar.pillar}</p>
                                            </div>

                                            {/* Goals */}
                                            <div className="space-y-3">
                                                {pillar.goals.map((goal) => (
                                                    <div key={goal.id} className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm">
                                                        <div className="flex items-start space-x-3">
                                                            <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${pillar.color}`}>
                                                                {goal.id}
                                                            </div>
                                                            <p className="text-sm text-gray-800 leading-relaxed">{goal.title}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* PUP San Juan Goals */}
                            <section id="campus-goals">
                                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">PUP San Juan Campus Goals</h2>
                                <p className="mb-6 text-gray-600">Six strategic goals driving our campus excellence</p>

                                <div className="grid gap-6 lg:grid-cols-2">
                                    {campusGoals.map((goal, index) => (
                                        <div 
                                            key={goal.id}
                                            className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                        >
                                            <div className="mb-4 flex items-start space-x-4">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#7f1414] text-lg font-bold text-white">
                                                    {goal.id}
                                                </div>
                                                <div>
                                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">{goal.title}</h3>
                                                    <p className="mb-4 leading-relaxed text-gray-700">{goal.description}</p>
                                                    <details className="group">
                                                        <summary className="cursor-pointer text-sm font-medium text-[#7f1414] hover:text-[#a01818] transition-colors">
                                                            View in Filipino
                                                        </summary>
                                                        <div className="mt-3 rounded-lg bg-gray-50 p-4">
                                                            <p className="text-sm italic text-gray-600">{goal.filipino}</p>
                                                        </div>
                                                    </details>
                                                </div>
                                            </div>
                                        </div>
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