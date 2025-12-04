import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import type { ProgramsUnderSurvey } from '@/types';
import { Head, Link, usePage, usePoll } from '@inertiajs/react';
import { Construction } from 'lucide-react';

interface ProgramsProps {
    programs: ProgramsUnderSurvey[];
}

export default function Programs({ programs }: ProgramsProps) {
    const { auth } = usePage<Auth>().props;
    const user = auth.user;

    usePoll(5000);

    const EmptyState = ({ title, description }: { title: string; description: string }) => (
        <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-16 text-center">
            <Construction className="mb-6 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
            <p className="max-w-md text-sm text-gray-500">{description}</p>
        </div>
    );

    return (
        <>
            <Head title="Programs Under Survey">
                <link rel="preconnect" href="https://fonts.bunny.net" />
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
                                    <div key={program.program_id} className="group">
                                        <Link href={`/programs/${program.program_id}`} className="block">
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
                                                    <div className="relative flex flex-col justify-center overflow-hidden p-12 md:w-2/3">
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

                                                        {user?.roles?.role_name === 'Accreditor' && (
                                                            <div className="absolute top-[-8px] right-[-8px] flex size-25 items-center justify-center rounded-xl bg-[#7f1414] px-3 py-1 text-2xl font-semibold text-white shadow-md">
                                                                N/A
                                                            </div>
                                                        )}

                                                        <div className="flex items-end justify-end">
                                                            <p className="w-fit rounded-full border border-[#7f1414]/40 bg-[#7f1414]/20 px-4 py-1 text-right text-sm font-semibold text-[#7f1414]">
                                                                {program.active_levels.level === 0
                                                                    ? 'Preliminary Survey Visit'
                                                                    : `Accreditation Level ${program.active_levels.level}`}
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
                            <div className="mx-auto my-16 w-full">
                                <EmptyState
                                    title="No Programs Available"
                                    description="There are currently no programs under survey. Please check back later."
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}
