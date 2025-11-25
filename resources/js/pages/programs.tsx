import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import type { ProgramsUnderSurvey } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Badge } from 'lucide-react';

interface ProgramsProps {
    programs: ProgramsUnderSurvey[];
}

export default function Programs({ programs }: ProgramsProps) {
    const { auth } = usePage<Auth>().props;
    const user = auth.user;

    return (
        <>
            <Head title="Programs Under Survey">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                {/* <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" /> */}
            </Head>
            <Layout>
                <div className="flex flex-col items-center">
                    <PageHeader
                        title="Programs Under Survey"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Programs', href: '/programs' },
                        ]}
                    />

                    <div className="mx-auto my-10 w-[75%]">
                        {programs?.length > 0 ? (
                            <div className="grid gap-10">
                                {programs.map((program) => (
                                    console.log(program),
                                    <div key={program.program_id} className="group">
                                        <Link href={`/programs/${program.program_link}`} className="block">
                                            <div className="overflow-hidden rounded-2xl border border-[#7f1414]/25 bg-white transition-all duration-300 hover:border-[#7f1414]">
                                                <div className="md:flex">
                                                    {/* Program Image */}
                                                    <div className="relative h-64 overflow-hidden md:h-auto md:w-1/3">
                                                        <img
                                                            src={program.program_image_path ?? '/images/default-program.jpg'}
                                                            alt={program.program_image_name ?? 'Default Program Image'}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                    </div>

                                                    {/* Program Content */}
                                                    <div className="relative flex flex-col justify-center p-12 md:w-2/3 overflow-hidden">
                                                        <div className="mb-6">
                                                            <span className="mb-4 inline-block rounded-full bg-[#7f1414]/10 px-4 py-2 text-sm font-semibold text-[#7f1414]">
                                                                {program.degree_type}
                                                            </span>
                                                            <h2 className="text-3xl leading-tight font-bold text-[#7f1414] transition-colors duration-200 group-hover:text-[#a01818] md:text-4xl">
                                                                {program.program_name}
                                                            </h2>
                                                        </div>

                                                        <p className="mb-8 line-clamp-4 leading-relaxed text-gray-600">
                                                            {program.program_description}
                                                        </p>

                                                        {(user?.roles?.role_name === 'Accreditor') && (
                                                            <div className='rounded-xl absolute top-[-8px] right-[-8px] size-25 flex items-center justify-center px-3 py-1 text-2xl text-white font-semibold bg-[#7f1414] shadow-md'>
                                                                N/A
                                                            </div>
                                                        )}

                                                        <div className="items-end flex justify-end">
                                                            <p className="w-fit rounded-full bg-[#7f1414]/20 text-[#7f1414] px-4 py-1 text-sm font-semibold border border-[#7f1414]/40 text-right w-3/4">
                                                            {/* Accreditation Level {program.active_levels?.level} */}
                                                                {program.active_levels.level === 0 ? 'Preliminiary Survey Visit' : `Accreditation Level ${program.active_levels.level}`}
                                                            </p>
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
