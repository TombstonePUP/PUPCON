import { Head, usePage } from "@inertiajs/react"
import Layout from "@/layouts/landing-layout"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import type { Area, PerProgram, ParameterOutlineCategory } from "@/types"
import { buildOutlineTree, RecursiveOutline } from "@/components/recursive-outline"
import { useEffect } from 'react';

interface AreaProps {
  program: PerProgram
  area: Area
  categories: ParameterOutlineCategory[]
}

export default function AreaPage({ program, area, categories }: AreaProps) {
  // Get search keyword from query string
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const searchKeyword = searchParams?.get('search') || '';

  // Helper to highlight keyword in outline
  function highlight(text: string) {
    if (!searchKeyword) return text;
    const regex = new RegExp(`(${searchKeyword})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  }

  return (
    <>
      <Head
        title={
          area.area_numeral != " "
            ? `Area ${area.area_numeral} - ${program.program_name}`
            : `${area.area_name} - ${program.program_name}`
        }
      >
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <Layout>
        <div className="flex flex-row w-full justify-center gap-[1vw] h-[18vw] p-[2vw]">
          <div className="bg-[#7f1414] w-[25%] rounded-tl-[1vw] rounded-bl-[1vw] rounded-tr-[1vw] flex flex-col justify-center px-[4vw]">
            <p className="text-white text-[1vw]">
              {area.area_numeral != " " ? `Area ${area.area_numeral}` : `Area ${area.area_number}`}
            </p>
            <h1 className="text-white font-bold text-[1.7vw] leading-[1.7vw]">Mission, Goals, and Objectives</h1>
          </div>
          <img
            className="object-cover w-[45%] rounded-tl-[1vw] rounded-br-[1vw] rounded-tr-[1vw]"
            src="/images/placeholder.png"
            alt="placeholder"
          />
        </div>
        <div className="flex justify-center ">
          <p className="indent-[2vw] text-justify w-[68%] py-[1.5vw] px-[3vw] border rounded-[1vw] border-[#7f1414]/25 hover:border-[#7f1414] transition duration-300 bg-white">
            {area.area_description || "No area description available."}
          </p>
        </div>

        {/* Document Cards Section */}
        <div className="flex justify-center py-[2vw]">
          <div className="w-[68%] grid grid-cols-1 md:grid-cols-3 gap-[2vw]">
            {/* Self Survey Card */}
            <div className="group relative bg-white border border-[#7f1414]/25 rounded-[1vw] p-[2vw] hover:border-[#7f1414] hover:shadow-lg transition-all duration-300 ">
              <div className="flex flex-col items-center text-center">
                <div className="w-[8vw] h-[8vw] bg-gray-100 rounded-[0.5vw] mb-[1vw] flex items-center justify-center group-hover:bg-[#7f1414]/10 transition-colors duration-300">
                  <svg
                    className="w-[4vw] h-[4vw] text-gray-400 group-hover:text-[#7f1414] transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-[1.2vw] font-bold text-[#7f1414] mb-[0.5vw]">Self Survey</h3>
                <p className="text-[0.9vw] text-gray-600 leading-relaxed">
                  {` ${program.program_name}`}
                </p>
                <div className="mt-[1vw] px-[1.5vw] py-[0.5vw] bg-[#7f1414]/10 rounded-full">
                  <span className="text-[0.8vw] text-[#7f1414] font-medium cursor-pointer">View Document</span>
                </div>
              </div>
            </div>

            {/* Compliance Report Card */}
            <div className="group relative bg-white border border-[#7f1414]/25 rounded-[1vw] p-[2vw] hover:border-[#7f1414] hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-[8vw] h-[8vw] bg-gray-100 rounded-[0.5vw] mb-[1vw] flex items-center justify-center group-hover:bg-[#7f1414]/10 transition-colors duration-300">
                  <svg
                    className="w-[4vw] h-[4vw] text-gray-400 group-hover:text-[#7f1414] transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-[1.2vw] font-bold text-[#7f1414] mb-[0.5vw]">Compliance Report</h3>
                <p className="text-[0.9vw] text-gray-600 leading-relaxed">
                  {` ${program.program_name}`}
                </p>
                <div className="mt-[1vw] px-[1.5vw] py-[0.5vw] bg-[#7f1414]/10 rounded-full">
                  <span className="text-[0.8vw] text-[#7f1414] font-medium">View Document</span>
                </div>
              </div>
            </div>

            {/* PPP Card */}
            <div className="group relative bg-white border border-[#7f1414]/25 rounded-[1vw] p-[2vw] hover:border-[#7f1414] hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-[8vw] h-[8vw] bg-gray-100 rounded-[0.5vw] mb-[1vw] flex items-center justify-center group-hover:bg-[#7f1414]/10 transition-colors duration-300">
                  <svg
                    className="w-[4vw] h-[4vw] text-gray-400 group-hover:text-[#7f1414] transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <h3 className="text-[1.2vw] font-bold text-[#7f1414] mb-[0.5vw]">Program Performance Profile</h3>
                <p className="text-[0.9vw] text-gray-600 leading-relaxed">
                  {` ${program.program_name}`}
                </p>
                <div className="mt-[1vw] px-[1.5vw] py-[0.5vw] bg-[#7f1414]/10 rounded-full">
                  <span className="text-[0.8vw] text-[#7f1414] font-medium">View Document</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center py-[2vw]">
          <Accordion type="single" collapsible className="w-[68%] flex flex-col gap-[1vw]">
            {area.area_parameters?.length > 0 ? (
              [...area.area_parameters]
                .sort((a, b) => {
                  if (a.parameter_name?.trim().toUpperCase() === "A") return -1;
                  if (b.parameter_name?.trim().toUpperCase() === "A") return 1;
                  return a.parameter_name?.localeCompare(b.parameter_name || "") || 0;
                })
                .map((parameter, index) => (
                  <AccordionItem className="group transition duration-300 bg-white" value={`parameter-${index}`} key={index}>
                    <AccordionTrigger className="flex flex-row justify-between group-hover:cursor-pointer  my-1 ">
                      <div className="flex flex-row justify-between w-full">
                        <h1 className="text-[#7f1414] group-hover:text-[#a01818] font-bold">
                          {parameter.parameter_name != " "
                            ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}`
                            : parameter.parameter_name}
                        </h1>
                        <p>{parameter.parameter_description}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {categories.some((category) => {
                        const outlines =
                          parameter.parameter_outlines?.filter(
                            (outline) => outline.parameter_outline_category_id === category.parameter_outline_category_id,
                          ) || []
                        return outlines.length > 0
                      }) ? (
                        categories.map((category) => {
                          const outlines =
                            parameter.parameter_outlines?.filter(
                              (outline) =>
                                outline.parameter_outline_category_id === category.parameter_outline_category_id,
                            ) || []
                          if (outlines.length === 0) return null
                          outlines.map(
                            (outline) =>
                            (outline.initial =
                              category.category_name == "No Category"
                                ? parameter.parameter_name == " "
                                  ? ""
                                  : parameter.parameter_name.toUpperCase().match(/^[A-Za-z]/)
                                : category.category_name.match(/^[A-Za-z]/)),
                          )

                          const sortedOutlines = buildOutlineTree({ outlines })

                          return (
                            <div key={category.parameter_outline_category_id} className="bg-[#D9D9D9]/25 p-[2vw] rounded">
                              <h1 className="font-bold">
                                {category.category_name == "No Category" ? "" : category.category_name}
                              </h1>
                              {/* Highlight keyword in all outline text */}
                              <RecursiveOutline
                                outlines={sortedOutlines}
                                highlightKeyword={searchKeyword}
                                highlightFn={highlight}
                              />
                            </div>
                          )
                        })
                      ) : (
                        <div className="bg-[#D9D9D9]/25 p-[2vw] rounded text-center">
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-gray-500 font-medium">No outline available for this parameter</p>
                            <p className="text-gray-400 text-sm">
                              Content will be added during the accreditation process
                            </p>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))
            ) : (
              <p className="text-center text-gray-500">No parameters available for this area.</p>
            )}
          </Accordion>
        </div>
      </Layout>
    </>
  )
}
