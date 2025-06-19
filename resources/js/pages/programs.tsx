import { Head, Link } from "@inertiajs/react"
import Layout from "@/layouts/landing-layout"
import type { ProgramsUnderSurvey } from "@/types"

interface ProgramsProps {
  programs: ProgramsUnderSurvey[]
}

export default function Programs({ programs }: ProgramsProps) {
  return (
    <>
      <Head title="Programs Under Survey">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <Layout>
        <div className="flex flex-col items-center">
          {/* Hero Banner */}
          <div className="relative h-[10vw] mt-7 overflow-hidden flex items-center justify-center w-[75%] rounded-xl">
            <img
              src="/images/campus/ground.jpg"
              alt="Programs Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#7f1414] via-[#7f1414]/70 to-transparent"></div>
            <div className="relative z-10 text-center text-white px-8">
              <h1 className="text-6xl font-black">Programs Under Survey</h1>
            </div>
          </div>

          <div className="py-20 px-12 max-w-7xl mx-auto">
            {programs?.length > 0 ? (
              <div className="grid gap-12 md:gap-16">
                {programs.map((program) => (
                  <div key={program.program_id} className="group">
                    <Link href={`/programs/${program.program_name}`} className="block">
                      <div className="bg-white rounded-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#7f1414]/20">
                        <div className="md:flex">
                          {/* Program Image */}
                          <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                            <img
                              src="/images/campus/comlab.jpg"
                              alt={program.program_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>

                          {/* Program Content */}
                          <div className="md:w-2/3 p-12 flex flex-col justify-center">
                            <div className="mb-6">
                              <span className="inline-block bg-[#7f1414]/10 text-[#7f1414] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                {program.degree_type}
                              </span>
                              <h2 className="text-3xl md:text-4xl font-bold text-[#7f1414] group-hover:text-[#a01818] transition-colors duration-200 leading-tight">
                                {program.program_name}
                              </h2>
                            </div>

                            <p className="text-gray-600 leading-relaxed text-lg line-clamp-4 mb-8">
                              {program.program_description}
                            </p>

                            <div className="mt-auto">
                              <span className="inline-flex items-center text-[#7f1414] font-semibold group-hover:text-[#a01818] transition-colors duration-200">
                                Learn More
                                <svg
                                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
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
              <div className="text-center py-24 px-8">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Programs Available</h3>
                  <p className="text-gray-500 text-lg">
                    There are currently no programs under survey. Please check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </Layout>
    </>
  )
}
