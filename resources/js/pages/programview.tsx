import PageHeader from '@/components/guest-page-header';
import ImageRow from '@/components/imagerow';
import { AreaCard } from '@/components/ui/area-card';
import Layout from '@/layouts/landing-layout';
import type { PerProgramUnderSurvey } from '@/types';
import { Head } from '@inertiajs/react';
import { Building2, FlaskConical, GraduationCap, Handshake, School, Users } from 'lucide-react';

interface PerProgramProps {
    program: PerProgramUnderSurvey;
}

export default function Programs({ program }: PerProgramProps) {
    console.log(program);
    // Placeholder objectives
    const programObjectives = [
        {
            id: 1,
            title: 'Academic Excellence',
            description:
                'To provide high-quality education that meets international standards and prepares students for successful careers in their chosen field.',
            icon: GraduationCap,
        },
        {
            id: 2,
            title: 'Innovation & Research',
            description: 'To foster a culture of innovation and research that contributes to technological advancement and societal development.',
            icon: FlaskConical,
        },
        {
            id: 3,
            title: 'Industry Partnership',
            description:
                'To establish strong partnerships with industry leaders to ensure curriculum relevance and provide practical learning opportunities.',
            icon: Handshake,
        },
    ];

    const campusFacts = [
        { icon: <School className="h-6 w-6 text-[#7f1414]" />, label: ' Students', value: '170+' },
        { icon: <Users className="h-6 w-6 text-[#7f1414]" />, label: 'Faculty', value: '12+' },
        { icon: <GraduationCap className="h-6 w-6 text-[#7f1414]" />, label: 'Years', value: '4' },
    ];

    return (
        <>
            <Head title={`${program.degree_type} in ${program.program_name}`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center gap-20">
                    <PageHeader
                        title={``}
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Programs', href: '/programs' },
                            { label: program.program_name, href: '#' },
                        ]}
                    />
                    {/* Intro */}
                    <section className="mb-8 w-[75%]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            {/* Left: Program Title and Accreditation */}
                            <div>
                                <h1 className="text-4xl font-bold text-[#7f1414]">BS {program.program_name}</h1>
                                <h2 className="text-xl font-normal text-[#7f1414]">Accreditation Level {program.accreditation_level}</h2>
                            </div>

                            {/* Right: Campus Facts Inline with Icons */}
                            <div className="flex flex-wrap items-start gap-4 text-sm font-medium text-gray-700">
                                {campusFacts.map((fact, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {/* Icon */}
                                        <span className="flex h-5 w-5 items-center justify-center text-[#7f1414]">{fact.icon}</span>
                                        {/* Text */}
                                        <span>
                                            <span className="font-bold text-gray-900">{fact.value}</span> {fact.label}
                                        </span>
                                        {/* Separator, except after last item */}
                                        {i < campusFacts.length - 1 && <span className="px-2 text-gray-400">|</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* <div
                        className="group flex w-[75%] justify-center gap-4 rounded-xl rounded-tr-none border border-[#7f1414]/25 bg-white p-4 duration-300 hover:border-[#7f1414]"
                    >
                        <h1 className="border-r border-[#7f1414]/25 px-4 text-4xl font-bold transition duration-300 hover:text-[#7f1414]">
                            <p className="mb-[-0.1vw] text-sm font-normal">Student Population</p>
                            1000
                        </h1>
                        <h1 className="border-r border-[#7f1414]/25 px-4 text-4xl font-bold transition duration-300 hover:text-[#7f1414]">
                            <p className="mb-[-0.1vw] text-sm font-normal">Years to take</p>4
                        </h1>
                        <h1 className="border-r border-[#7f1414]/25 px-4 text-4xl font-bold transition duration-300 hover:text-[#7f1414]">
                            <p className="mb-[-0.1vw] text-sm font-normal">Required credits</p>
                            33
                        </h1>
                        <h1 className="border-r border-[#7f1414]/25 px-4 text-4xl font-bold transition duration-300 hover:text-[#7f1414]">
                            <p className="mb-[-0.1vw] text-sm font-normal">Faculty population</p>9
                        </h1>
                        <h1 className="px-4 text-4xl font-bold transition duration-300 hover:text-[#7f1414]">
                            <p className="mb-[-0.1vw] text-sm font-normal">Latest graduates</p>
                            100
                        </h1>
                    </div> */}

                    <div className="group flex w-[75%] flex-row justify-between gap-4 rounded-xl" id="overview">
                        <div className="flex-1 rounded-xl border border-[#7f1414]/25 bg-white p-8 px-13 duration-300 hover:border-[#7f1414]">
                            <h1 className="mb-4 text-3xl font-semibold text-[#7f1414] transition duration-300">
                                Program Overview
                            </h1>
                            <p className="text-gray-600">{program.overview_description || 'No program overview available.'}</p>
                        </div>
                        <div className="w-[25vw] overflow-hidden rounded-xl">
                            <img
                                className="h-full object-cover transition duration-300 hover:scale-110"
                                src="/images/campus/comlab.jpg"
                                alt="computer lab"
                            />
                        </div>
                    </div>

                    {/* Program Objectives Section */}
                    <div className="w-[75%]" id="goals">
                        <div className="mb-6 grid place-items-center rounded-xl bg-[#7f1414] py-8 text-white">
                            <h1 className="text-4xl font-bold">Program Objectives</h1>
                            <p>Our commitment to excellence through strategic goals and outcomes</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {programObjectives.map((objective, index) => (
                                <div
                                    key={objective.id}
                                    className="group relative overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-101 hover:border-[#7f1414] hover:shadow-xl"
                                >
                                    {/* Objective Number */}
                                    <div className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#7f1414]/10 font-bold text-[#7f1414] transition-colors group-hover:bg-[#7f1414] group-hover:text-white">
                                        {index + 1}
                                    </div>

                                    {/* Icon */}
                                    <div className="mt-8 mb-6 flex justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7f1414] to-[#a01818] text-3xl text-white shadow-lg transition-transform group-hover:scale-110">
                                            <objective.icon className="h-10 w-10" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center">
                                        <h3 className="mb-4 text-xl font-bold text-[#7f1414] transition-colors group-hover:text-[#a01818]">
                                            {objective.title}
                                        </h3>
                                        <p className="leading-relaxed text-gray-600">{objective.description}</p>
                                    </div>

                                    {/* Hover Effect Border */}
                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#7f1414] to-[#a01818] transition-all duration-300 group-hover:w-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-[75%]">
                        <div className="grid place-items-center rounded-xl bg-[#7f1414] py-8 text-white">
                            <h1 className="text-4xl font-bold">Gallery of Excellence</h1>
                            <p>Showcasing the moments that define our passion and commitment.</p>
                        </div>

                        <div>
                            <ImageRow
                                height="h-112"
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

                    <div className="flex w-[75%] items-center justify-center overflow-x-hidden">
                        <svg height="55" viewBox="0 0 1156 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M558.066 44.1741L559.801 36.6052L553.983 31.5144L561.669 30.841L564.657 23.7031L567.646 30.841L575.332 31.5144L569.514 36.6052L571.249 44.1741L564.657 40.1607L558.066 44.1741Z"
                                fill="#daa520"
                                fillOpacity="0.44"
                            ></path>
                            <path
                                d="M573.01 23.7031L574.744 16.1343L568.927 11.0435L576.612 10.3701L579.601 3.23218L582.59 10.3701L590.275 11.0435L584.458 16.1343L586.192 23.7031L579.601 19.6898L573.01 23.7031Z"
                                fill="#daa520"
                                fillOpacity="0.44"
                            ></path>
                            <path
                                d="M585.819 44.1741L587.553 36.6052L581.736 31.5144L589.421 30.841L592.41 23.7031L595.399 30.841L603.084 31.5144L597.267 36.6052L599.001 44.1741L592.41 40.1607L585.819 44.1741Z"
                                fill="#daa520"
                                fillOpacity="0.44"
                            ></path>
                            <line x1="636" y1="27.5" x2="1156" y2="27.5" stroke="#7F1414" strokeOpacity="0.26"></line>
                            <line y1="27.5" x2="520" y2="27.5" stroke="#7F1414" strokeOpacity="0.26"></line>
                        </svg>
                    </div>

                    <div className="w-[75%]" id="areas">
                        <div className="grid place-items-center rounded-xl bg-[#7f1414] py-8 text-white">
                            <h1 className="text-4xl font-bold">Areas Under Survey</h1>
                            <p>ACCREDITING AGENCY OF CHARTERED COLLEGES AND UNIVERSITIES IN THE PHILIPPINES</p>
                        </div>

                        <div className="flex h-fit w-full flex-row flex-wrap justify-center gap-[1.5vw] py-3">
                            {program?.areas?.length > 0 ? (
                                program.areas.map((area, index) => (
                                    <AreaCard
                                        key={index}
                                        imageSrc={area.image_path || '/images/placeholder.png'}
                                        heading={area.area_name}
                                        circleLetter={area.area_numeral}
                                        href={route('programs.areas.show', [program.program_link, area.area_id])}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No areas under survey.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
