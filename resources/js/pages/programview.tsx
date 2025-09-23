import PageHeader from '@/components/guest-page-header';
import ImageRow from '@/components/imagerow';
import { AreaCard } from '@/components/ui/area-card';
import Layout from '@/layouts/landing-layout';
import type { PerProgramUnderSurvey } from '@/types';
import { Head, router, usePage, useRemember } from '@inertiajs/react';
import { ChevronRight, FlaskConical, GraduationCap, Handshake, Mail, School, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PerProgramProps {
    program: PerProgramUnderSurvey;
}

// CHarles na bahala sa db
const Faculty = {
    // --- Program Head ---
    programHead: {
        id: 1,
        name: 'Maria Carina Corpuz',
        photo: '/images/adfa-new/Maria-Carina-Corpuz.jpg',
        position: 'Program Head',
        email: 'mariacarina.corpuz@university.edu',
    },
    // --- Regular Faculty ---
    regular: [
        {
            id: 2,
            name: 'Alfred Pagalilawan',
            photo: '/images/adfa-new/Alfred-Pagalilawan.jpg',
            position: 'Associate Professor',
            email: 'alfred.pagalilawan@university.edu',
        },
        {
            id: 3,
            name: 'Dianne Marie Villas',
            photo: '/images/adfa-new/Dianne-Marie-Villas.jpg',
            position: 'Assistant Professor',
            email: 'diannemarie.villas@university.edu',
        },
        {
            id: 4,
            name: 'Martino Miguel Salcedo',
            photo: '/images/adfa-new/Martino-Miguel-Salcedo.jpg',
            position: 'Associate Professor',
            email: 'martino.salcedo@university.edu',
        },
        {
            id: 5,
            name: 'Reynaldo Suarez',
            photo: '/images/adfa-new/Reynaldo-Suarez.jpg',
            position: 'Professor',
            email: 'reynaldo.suarez@university.edu',
        },
    ],
    // --- Part-Time Faculty ---
    partTime: [
        {
            id: 6,
            name: 'Joebert Silao',
            photo: '/images/adfa-new/Joebert-Silao.jpg',
            position: 'Part-time Instructor',
            email: 'joebert.silao@university.edu',
        },
        {
            id: 7,
            name: 'Rizza Valdez Devera',
            photo: '/images/adfa-new/Rizza-Valdez-Devera.jpg',
            position: 'Part-time Lecturer',
            email: 'rizza.devera@university.edu',
        },
        {
            id: 8,
            name: 'Samantha Karen Morano',
            photo: '/images/adfa-new/Samantha-Karen-Morano.jpg',
            position: 'Part-time Instructor',
            email: 'samanthakaren.morano@university.edu',
        },
        {
            id: 9,
            name: 'Roehl Lumbao',
            photo: '/images/adfa-new/Roehl-Lumbao.jpg',
            position: 'Part-time Instructor',
            email: 'roehl.lumbao@university.edu',
        },
    ],
};

// Animation hook for scroll-triggered animations
const useInView = (threshold = 0.1) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView] as const;
};

export default function Programs({ program }: PerProgramProps) {
    const { props } = usePage<{ program: PerProgramUnderSurvey }>();
    const [level, setLevel] = useRemember(program.accreditation_level, 'level');
    const [loading, setLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [facultyLoading, setFacultyLoading] = useState(true);
    const [overviewImageLoading, setOverviewImageLoading] = useState(true);

    // Animation refs
    const [overviewRef, overviewInView] = useInView(0.2);
    const [facultyRef, facultyInView] = useInView(0.1);
    const [objectivesRef, objectivesInView] = useInView(0.1);
    const [galleryRef, galleryInView] = useInView(0.1);
    const [areasRef, areasInView] = useInView(0.1);

    // Simulate faculty loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setFacultyLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    /** Router progress indicator */
    useEffect(() => {
        const start = router.on('start', () => setLoading(true));
        const finish = router.on('finish', () => setLoading(false));
        return () => {
            start();
            finish();
        };
    }, []);

    const handleLevelChange = (newLevel: number) => {
        setLevel(newLevel);
        setTimeout(() => {
            router.visit(route('program.show', { id: program.id, level: newLevel }), {
                preserveScroll: true,
                only: ['program'],
            });
        }, 200);
    };

    const programObjectives = [
        {
            id: 1,
            title: 'Academic Excellence',
            description:
                'To provide high-quality education that meets international standards and prepares students for successful careers in their chosen field.',
            icon: GraduationCap,
            color: 'from-red-900 to-red-900',
        },
        {
            id: 2,
            title: 'Innovation & Research',
            description: 'To foster a culture of innovation and research that contributes to technological advancement and societal development.',
            icon: FlaskConical,
            color: 'from-red-900 to-red-900',
        },
        {
            id: 3,
            title: 'Industry Partnership',
            description:
                'To establish strong partnerships with industry leaders to ensure curriculum relevance and provide practical learning opportunities.',
            icon: Handshake,
            color: 'from-red-900 to-red-900',
        },
    ];

    const campusFacts = [
        { icon: <School className="h-6 w-6" />, label: 'Students', value: '170+' },
        { icon: <Users className="h-6 w-6" />, label: 'Faculty', value: '12+' },
        { icon: <GraduationCap className="h-6 w-6" />, label: 'Years', value: '4' },
    ];

    const FacultyCard = ({ faculty, isLoading, index }: { faculty: any; isLoading: boolean; index: number }) => {
        const [imgLoaded, setImgLoaded] = useState(false);

        if (isLoading) {
            return (
                <div className="group relative w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex flex-col space-y-3">
                        <div className="relative">
                            <div className="aspect-square w-full animate-pulse rounded-xl bg-gray-300" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#7f1414] border-t-transparent" />
                            </div>
                        </div>
                        <div className="w-full space-y-2 pt-1">
                            <div className="mx-auto h-5 w-3/4 animate-pulse rounded bg-gray-300" />
                            <div className="mx-auto h-3 w-1/2 animate-pulse rounded bg-gray-300" />
                            <div className="mx-auto h-3 w-2/3 animate-pulse rounded bg-gray-300" />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                className={`group relative w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-500 hover:scale-[1.02] hover:border-[#7f1414] ${
                    facultyInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{
                    transitionDelay: facultyInView ? `2ms` : '0ms',
                }}
            >
                <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-[#7f1414] via-[#9a1a1a] to-[#7f1414] opacity-60 transition-opacity duration-300 group-hover:opacity-0" />

                <div className="flex flex-col space-y-3">
                    <div className="relative overflow-hidden">
                        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 ring-2 ring-[#7f1414]/10 transition-all duration-300 group-hover:ring-[#7f1414]/30">
                            {!imgLoaded && (
                                <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200">
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#7f1414] border-t-transparent" />
                                        {/* <span className="text-xs text-gray-500">Loading...</span> */}
                                    </div>
                                </div>
                            )}
                            <img
                                src={faculty.photo}
                                alt={faculty.name}
                                className={`h-full w-full object-cover transition-all duration-200 group-hover:scale-110 ${
                                    imgLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                onLoad={() => setImgLoaded(true)}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=7f1414&color=fff&size=400&format=svg`;
                                    setImgLoaded(true);
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-1 text-center">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-[#7f1414]">{faculty.name}</h3>
                            <p className="mt-1 text-xs font-medium text-gray-600">{faculty.position}</p>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                            <a
                                href={`mailto:${faculty.email}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#7f1414]/5 px-2.5 py-1.5 text-xs text-gray-600 transition-all duration-200 group-hover:scale-105 hover:bg-[#7f1414] hover:text-white"
                            >
                                <Mail className="h-3 w-3" />
                                <span className="max-w-[140px] truncate">{faculty.email}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon?: any }) => (
        <div className="relative mb-12">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7f1414]/5 via-[#7f1414]/10 to-[#7f1414]/5" />
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7f1414] via-[#9a1a1a] to-[#7f1414] px-8 py-10 text-center text-white">
                <div className="relative z-10">
                    <h2 className="mb-3 text-4xl font-bold tracking-tight">{title}</h2>
                    <p className="mx-auto max-w-3xl text-lg leading-relaxed font-medium opacity-90">{subtitle}</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`${program.degree_type} in ${program.program_name}`} />
            <Layout>
                <PageHeader
                    title=""
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Programs', href: '/programs' },
                        { label: program.program_name, href: '#' },
                    ]}
                />

                {/* --- Enhanced Header Banner --- */}
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#7f1414] via-[#9a1a1a] to-[#b52020]">
                    <div className="absolute inset-0">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />
                    </div>

                    {/* Image Overlay */}
                    <div className="absolute top-0 right-0 h-full w-2/3 opacity-20">
                        <div className="relative h-full w-full">
                            <img
                                src="/images/homepage-slides/1.jpg"
                                alt="Program Background"
                                className="h-full w-full object-cover"
                                style={{
                                    maskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                                    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                                }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    const container = target.parentElement?.parentElement;
                                    if (container) container.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-8 py-16 md:flex-row">
                        <div className="animate-fade-in-up flex flex-col items-center text-white md:items-start">
                            <div className="mb-4">
                                <span className="inline-block rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                    Bachelor of Science
                                </span>
                            </div>
                            <h1 className="mb-6 text-5xl font-bold drop-shadow-lg">{program.program_name}</h1>

                            {/* Enhanced Dropdown */}
                            <div className="group/dropdown relative" onMouseLeave={() => setDropdownOpen(false)}>
                                <label className="mb-3 block text-sm font-medium opacity-90">Accreditation Level</label>
                                <div className="relative">
                                    <div
                                        onMouseEnter={() => setDropdownOpen(true)}
                                        className="flex w-48 cursor-pointer items-center justify-between rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white backdrop-blur-md transition-all duration-300 group-hover/dropdown:w-96 hover:bg-white/20"
                                    >
                                        <span className="font-medium">Level {level}</span>
                                        <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    <div
                                        className={`absolute top-0 left-48 h-full overflow-hidden rounded-r-xl border-t border-r border-b border-white/30 backdrop-blur-md transition-all duration-300 ${
                                            dropdownOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'
                                        }`}
                                    >
                                        <div className="flex h-full bg-white/10">
                                            {[1, 2, 3, 4, 5, 6].map((lvl) => (
                                                <button
                                                    key={lvl}
                                                    onClick={() => handleLevelChange(lvl)}
                                                    className={`flex-1 border-r border-white/20 px-3 py-3 text-sm text-white transition-all duration-200 last:border-r-0 hover:bg-[#7f1414]/30 ${
                                                        level === lvl ? 'bg-[#7f1414]/20 font-semibold' : ''
                                                    }`}
                                                >
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Campus Facts */}
                        <div className="animate-fade-in-left flex flex-col gap-4 text-white/90">
                            {campusFacts.map((fact, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/20"
                                    style={{ animationDelay: `${i * 200}ms` }}
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20">
                                        {fact.icon}
                                    </div>
                                    {loading ? (
                                        <div className="h-6 w-24 animate-pulse rounded bg-white/30" />
                                    ) : (
                                        <div>
                                            <div className="text-2xl font-bold">{fact.value}</div>
                                            <div className="text-sm opacity-80">{fact.label}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="flex flex-col items-center gap-20">
                    {/* --- Overview --- */}
                    <div
                        ref={overviewRef}
                        className={`mt-16 flex w-[85%] max-w-7xl justify-between gap-8 rounded-2xl transition-all duration-700 ${
                            overviewInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        }`}
                    >
                        <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-10 transition-all duration-300 hover:border-[#7f1414]">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="rounded-full bg-[#7f1414]/10 p-3">
                                    <GraduationCap className="h-8 w-8 text-[#7f1414]" />
                                </div>
                                <h2 className="text-3xl font-bold text-[#7f1414]">Program Overview</h2>
                            </div>
                            <p className="text-lg leading-relaxed text-gray-700">
                                {program.overview_description || 'No program overview available.'}
                            </p>
                        </div>

                        <div className="relative w-[30vw] max-w-md overflow-hidden rounded-2xl border border-gray-200 transition-all duration-300 hover:border-[#7f1414]">
                            {overviewImageLoading && (
                                <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#7f1414] border-t-transparent" />
                                        <span className="text-sm text-gray-500">Loading image...</span>
                                    </div>
                                </div>
                            )}
                            <img
                                src="/images/campus/comlab.jpg"
                                alt="Computer Lab"
                                className={`h-full w-full object-cover transition-all duration-500 hover:scale-110 ${
                                    !overviewImageLoading ? 'opacity-100' : 'opacity-0'
                                }`}
                                onLoad={() => setOverviewImageLoading(false)}
                            />
                        </div>
                    </div>

                    {/* --- Faculty Section --- */}
                    <div ref={facultyRef} className="w-[85%] max-w-7xl" id="faculty">
                        <div className={`transition-all duration-300 ${facultyInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                            <SectionHeader title="Our Faculty" subtitle="Meet our dedicated educators who shape the future of technology" />
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-wrap justify-center gap-6">
                                <FacultyCard faculty={Faculty.programHead} isLoading={facultyLoading} index={0} />
                                {Faculty.regular.map((faculty, index) => (
                                    <FacultyCard key={faculty.id} faculty={faculty} isLoading={facultyLoading} index={index + 1} />
                                ))}
                                {Faculty.partTime.map((faculty, index) => (
                                    <FacultyCard
                                        key={faculty.id}
                                        faculty={faculty}
                                        isLoading={facultyLoading}
                                        index={index + Faculty.regular.length + 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Objectives --- */}
                    <div ref={objectivesRef} className="w-[85%] max-w-7xl" id="goals">
                        <div className={`transition-all duration-200 ${objectivesInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                            <SectionHeader title="Program Objectives" subtitle="Our commitment to excellence through strategic goals and outcomes" />
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {programObjectives.map((objective, index) => (
                                <div
                                    key={objective.id}
                                    className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:scale-[1.02] hover:border-[#7f1414] ${
                                        objectivesInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                                    }`}
                                    style={{
                                        transitionDelay: objectivesInView ? `3ms` : '0ms',
                                    }}
                                >
                                    <div className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-400 transition-all duration-300 group-hover:bg-[#7f1414] group-hover:text-white">
                                        {index + 1}
                                    </div>

                                    <div className="mb-6 flex justify-center">
                                        <div
                                            className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${objective.color} text-white transition-all duration-300 group-hover:scale-110`}
                                        >
                                            <objective.icon className="h-10 w-10" />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="mb-4 text-xl font-bold text-gray-900">{objective.title}</h3>
                                        <p className="leading-relaxed text-gray-600">{objective.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Gallery --- */}
                    <div ref={galleryRef} className="w-[85%] max-w-7xl" id="gallery">
                        <div className={`transition-all duration-700 ${galleryInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                            <SectionHeader title="Gallery of Excellence" subtitle="Showcasing the moments that define our passion and commitment" />
                            <ImageRow
                                height="h-96"
                                images={[
                                    { id: 1, src: '/images/gallery/it/1.jpg', alt: '' },
                                    { id: 2, src: '/images/gallery/it/2.jpg', alt: '' },
                                    { id: 3, src: '/images/gallery/it/3.jpg', alt: '' },
                                    { id: 4, src: '/images/gallery/it/4.jpg', alt: '' },
                                    { id: 5, src: '/images/gallery/it/5.jpg', alt: '' },
                                    { id: 6, src: '/images/gallery/it/6.jpg', alt: '' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* --- Areas Under Survey --- */}
                    <div ref={areasRef} className="w-[85%] max-w-7xl" id="areas">
                        <div className={`transition-all duration-700 ${areasInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                            <SectionHeader
                                title="Areas Under Survey"
                                subtitle="ACCREDITING AGENCY OF CHARTERED COLLEGES AND UNIVERSITIES IN THE PHILIPPINES"
                            />

                            <div className="flex flex-wrap justify-center gap-8 py-6">
                                {program?.areas?.length ? (
                                    program.areas
                                        .slice()
                                        .sort((a, b) => {
                                            const aNum = Number(a.area_number) || 0;
                                            const bNum = Number(b.area_number) || 0;
                                            return aNum - bNum;
                                        })
                                        .map((area, index) => (
                                            <div
                                                key={area.area_id}
                                                className={`transition-all duration-500 ${
                                                    areasInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                                                }`}
                                                style={{
                                                    transitionDelay: areasInView ? `${index * 120}ms` : '0ms',
                                                }}
                                            >
                                                <AreaCard
                                                    imageSrc={area.image_path || '/images/placeholder.png'}
                                                    heading={area.area_name}
                                                    circleLetter={area.area_numeral}
                                                    href={route('programs.areas.show', [program.program_link, area.area_id])}
                                                />
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-center text-lg text-gray-500">No areas under survey.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
