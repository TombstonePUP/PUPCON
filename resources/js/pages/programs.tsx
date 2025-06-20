import Layout from '@/layouts/landing-layout';
import type { ProgramsUnderSurvey } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface ProgramsProps {
    programs: ProgramsUnderSurvey[];
}

export default function Programs({ programs }: ProgramsProps) {
    return (
        <>
            <Head title="Programs Under Survey">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                {/* <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" /> */}
            </Head>
            <Layout>
                <div className="flex flex-col items-center">
                    {/* Hero Banner */}
                    <div className="relative mt-7 z-10 flex h-[10vw] w-[75%] items-center justify-center overflow-hidden rounded-xl">
                        <img src="/images/campus/ground.jpg" alt="Programs Banner" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#7f1414] via-[#7f1414]/70 to-transparent"></div>
                        <div className="relative z-10 px-8 text-center text-white">
                            <h1 className="text-6xl font-bold">Programs Under Survey</h1>
                            <h2 className='mt-2'>
                                Polytechnic University of the Philippines <b>San Juan Campus</b>
                            </h2>
                        </div>
                    </div>

                    <div className="mx-auto w-[75%] mt-10">
                        {programs?.length > 0 ? (
                            <div className="grid gap-12 md:gap-16">
                                {programs.map((program) => (
                                    <div key={program.program_id} className="group">
                                        <Link href={`/programs/${program.program_name}`} className="block">
                                            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-[#7f1414]/20">
                                                <div className="md:flex">
                                                    {/* Program Image */}
                                                    <div className="relative h-64 overflow-hidden md:h-auto md:w-1/3">
                                                        <img
                                                            src="/images/campus/comlab.jpg"
                                                            alt={program.program_name}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                    </div>

                                                    {/* Program Content */}
                                                    <div className="flex flex-col justify-center p-12 md:w-2/3">
                                                        <div className="mb-6">
                                                            <span className="mb-4 inline-block rounded-full bg-[#7f1414]/10 px-4 py-2 text-sm font-semibold text-[#7f1414]">
                                                                {program.degree_type}
                                                            </span>
                                                            <h2 className="text-3xl leading-tight font-bold text-[#7f1414] transition-colors duration-200 group-hover:text-[#a01818] md:text-4xl">
                                                                {program.program_name}
                                                            </h2>
                                                        </div>

                                                        <p className="mb-8 line-clamp-4 text-lg leading-relaxed text-gray-600">
                                                            {program.program_description}
                                                        </p>

                                                        <div className="mt-auto">
                                                            <span className="inline-flex items-center font-semibold text-[#7f1414] transition-colors duration-200 group-hover:text-[#a01818]">
                                                                Learn More
                                                                <svg
                                                                    className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-8 py-24 text-center">
                                <div className="mx-auto max-w-md">
                                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-gray-900">No Programs Available</h3>
                                    <p className="text-lg text-gray-500">There are currently no programs under survey. Please check back later.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}
