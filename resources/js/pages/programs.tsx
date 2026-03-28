import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import type { ProgramsUnderSurvey } from '@/types';
import { Head, Link, usePage, usePoll } from '@inertiajs/react';
import { Construction, ImageOff } from 'lucide-react';

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

          <div className="mx-auto my-10 w-[65%]">
            {programs?.length > 0 ? (
              <div className="grid gap-6">
                {programs.map((program, index) => (
                  <div key={program.program_id} className="group">
                    <Link href={`/programs/${program.program_id}`} className="block">
                      <div className="relative overflow-hidden rounded-2xl border border-gray-100 hover:border-primary/50 bg-white transition-all duration-500">
                        <div className="md:flex">

                          {/* Program Image */}
                          <div className="relative h-56 overflow-hidden md:h-auto md:w-[280px] md:shrink-0">
                            {program.program_image_path ? (
                              <img
                                src={program.program_image_path}
                                alt={program.program_image_name ?? 'Program Image'}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#7f1414]/8 to-[#7f1414]/3">
                                <ImageOff className="h-10 w-10 text-[#7f1414]/25" />
                                <span className="text-xs font-medium tracking-widest text-[#7f1414]/30 uppercase">No Image</span>
                              </div>
                            )}
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 md:bg-gradient-to-l" />
                            {/* Index number watermark */}
                            <div className="absolute bottom-3 left-3 text-5xl font-black text-white/20 leading-none select-none">
                              {String(index + 1).padStart(2, '0')}
                            </div>
                          </div>

                          {/* Program Content */}
                          <div className="relative flex flex-1 flex-col justify-between p-8 md:p-10">

                            {/* Top row: badge + accreditor tag */}
                            <div className="mb-5 flex items-start justify-between gap-4">
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#7f1414]/8 px-3 py-1 text-xs font-semibold tracking-wide text-[#7f1414] uppercase">
                                {program.degree_type}
                              </span>

                              {user?.roles?.role_name === 'Accreditor' && (
                                <span className="inline-flex items-center rounded-md bg-[#7f1414] px-3 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-sm">
                                  N/A
                                </span>
                              )}
                            </div>

                            {/* Program name */}
                            <div className="mb-4">
                              <h2 className="text-2xl font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-[#7f1414] md:text-3xl">
                                {program.program_name}
                              </h2>
                            </div>

                            {/* Description */}
                            <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-500">
                              {program.program_description || 'No description available for this program.'}
                            </p>

                            {/* Bottom row: level pill + arrow */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {/* Colored dot indicator */}
                                <span className="h-2 w-2 rounded-full bg-[#7f1414]" />
                                <p className="text-sm font-semibold text-[#7f1414]">
                                  {program.active_levels?.level === 0
                                    ? 'Preliminary Survey Visit'
                                    : `Accreditation Level ${program.active_levels?.level}`}
                                </p>
                              </div>

                              {/* Arrow CTA */}
                              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#7f1414]/20 text-[#7f1414] transition-all duration-300 group-hover:bg-[#7f1414] group-hover:text-white group-hover:border-[#7f1414]">
                                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
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
