import PageHeader from '@/components/guest-page-header';
import { buildOutlineTree, RecursiveOutline } from '@/components/recursive-outline';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import Layout from '@/layouts/landing-layout';
import type { Area, ParameterOutlineCategory, PerProgram } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Download, FileSpreadsheet, FileText, ImageOff, ImagePlay, ImagePlus } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface AreaProps {
    program: PerProgram;
    area: Area;
    categories: ParameterOutlineCategory[];
}

export default function AreaPage({ program, area, categories }: AreaProps) {
    // Get search keyword from query string
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const searchKeyword = searchParams?.get('search') || '';

    const { auth } = usePage<Auth>().props;
    const user = auth.user;

    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerFile, setViewerFile] = useState({ url: '', title: '' });

    const openViewer = (fileUrl: string, title: string) => {
        setViewerFile({ url: fileUrl, title });
        setViewerOpen(true);
    };

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
                    area.area_numeral != ' ' ? `Area ${area.area_numeral} - ${program.program_name}` : `${area.area_name} - ${program.program_name}`
                }
            >
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <PageHeader
                    title=""
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Programs', href: '/programs' },
                        {
                            label: `${program.program_name} - Level ${program.levels[0]?.level}`,
                            href: '/programs/' + program.program_link,
                        },
                        { label: area.area_name, href: '#' },
                    ]}
                />

                <div className="flex h-[18vw] w-full flex-row justify-center gap-[1vw] p-[2vw]">
                    <div className="flex w-[25%] flex-col justify-center rounded-tl-[1vw] rounded-tr-[1vw] rounded-bl-[1vw] bg-[#7f1414] px-[4vw]">
                        <p className="text-[1vw] text-white">
                            {area.area_numeral?.trim() ? `Area ${area.area_numeral}` : `Area ${area.area_number}`}
                        </p>

                        <h1 className="text-[1.7vw] leading-[1.7vw] font-bold text-white">{area.area_name}</h1>
                    </div>
                    {/* {area.area_image_path ? (
                        <img className="w-[45%] rounded-xl object-cover" src={area.area_image_path} />
                    ) : (
                        <img className="w-[45%] rounded-xl object-cover" src="/images/placeholder.png" />
                    )} */}

                    <img className="w-[45%] rounded-xl object-cover" src="/images/placeholder.png" />

                </div>
                <div className="flex justify-center">
                    <p className="w-[68%] rounded-[1vw] border border-[#7f1414]/25 bg-white px-[3vw] py-[1.5vw] text-justify indent-[2vw] transition duration-300 hover:border-[#7f1414]">
                        {area.area_description || 'No area description available.'}
                    </p>
                </div>

                {/* Forms Section */}
                <div className="flex justify-center py-[2vw]">
                    <div className="grid w-[68%] grid-cols-1 gap-[2vw] md:grid-cols-3">
                        {/* Self Survey Card */}
                        {area.area_forms?.length > 0 ? (
                            area.area_forms?.map((area_form) => (
                                <div className="group relative rounded-[1vw] border border-[#7f1414]/25 bg-white p-[2vw] transition-all duration-300 hover:border-[#7f1414] hover:shadow-lg">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-[1vw] flex h-[8vw] w-[8vw] items-center justify-center rounded-[0.5vw] bg-gray-100 transition-colors duration-300 group-hover:bg-[#7f1414]/10">
                                            <svg
                                                className="h-[4vw] w-[4vw] text-gray-400 transition-colors duration-300 group-hover:text-[#7f1414]"
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
                                        <h3 className="mb-[0.5vw] text-[1.2vw] font-bold text-[#7f1414]">
                                            {area_form.area_form_category.category_name}
                                        </h3>
                                        <p className="text-[0.9vw] leading-relaxed text-gray-600">{` ${program.program_name}`}</p>
                                        <div
                                            onClick={() => openViewer(`${area_form.file_path}`, `${area_form.area_form_category.category_name}`)}
                                            className="mt-[1vw] cursor-pointer rounded-full bg-[#7f1414]/10 px-[1.5vw] py-[0.5vw] transition duration-300 hover:bg-[#7f1414]/25"
                                        >
                                            <span className="text-[0.8vw] font-medium text-[#7f1414]">View Document</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 w-full">No forms available for this area.</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center w-full py-2 gap-4">
                    <Accordion type="single" collapsible className="flex w-[68%] flex-col gap-[1vw]">
                        {area.area_parameters?.length > 0 ? (
                            [...area.area_parameters]
                                .sort((a, b) => {
                                    if (a.parameter_name?.trim().toUpperCase() === 'A') return -1;
                                    if (b.parameter_name?.trim().toUpperCase() === 'A') return 1;
                                    return a.parameter_name?.localeCompare(b.parameter_name || '') || 0;
                                })
                                .map((parameter, index) => (
                                    <AccordionItem className="group bg-white transition duration-300" value={`parameter-${index}`} key={index}>
                                        <AccordionTrigger className="my-1 flex flex-row justify-between group-hover:cursor-pointer">
                                            <div className="flex w-full flex-row justify-between">
                                                <h1 className="font-bold text-[#7f1414] group-hover:text-[#a01818]">
                                                    {parameter.parameter_name != ' '
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
                                                    ) || [];
                                                return outlines.length > 0;
                                            }) ? (
                                                categories.map((category) => {
                                                    const outlines =
                                                        parameter.parameter_outlines?.filter(
                                                            (outline) =>
                                                                outline.parameter_outline_category_id === category.parameter_outline_category_id,
                                                        ) || [];
                                                    if (outlines.length === 0) return null;
                                                    outlines.map(
                                                        (outline) =>
                                                        (outline.initial =
                                                            category.category_name == 'No Category'
                                                                ? parameter.parameter_name == ' '
                                                                    ? ''
                                                                    : parameter.parameter_name.toUpperCase().match(/^[A-Za-z]/)
                                                                : category.category_name.match(/^[A-Za-z]/)),
                                                    );

                                                    const sortedOutlines = buildOutlineTree({ outlines });

                                                    return (
                                                        <div key={category.parameter_outline_category_id} className="rounded bg-[#D9D9D9]/25 p-[2vw]">
                                                            <h1 className="font-bold">
                                                                {category.category_name == 'No Category' ? '' : category.category_name}
                                                            </h1>
                                                            {/* Highlight keyword in all outline text */}
                                                            <RecursiveOutline
                                                                outlines={sortedOutlines}
                                                                highlightKeyword={searchKeyword}
                                                                highlightFn={highlight}
                                                            />
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="rounded bg-[#D9D9D9]/25 p-[2vw] text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                        <p className="font-medium text-gray-500">No outline available for this parameter</p>
                                                        <p className="text-sm text-gray-400">
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

                    {(user?.roles?.role_name === 'Accreditor') && (
                        <div className='w-[68%] text-end'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="noborder"
                                    >
                                        Area Mean: N/A <Download className="size-6 font-black" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Export All Parameter Means</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <FileSpreadsheet className="h-4 w-4 text-green-600 mr-2" />
                                        Excel
                                    </DropdownMenuItem>
                                    <DropdownMenuItem >
                                        <FileText className="h-4 w-4 text-red-600 mr-2" />
                                        PDF
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
                <DocumentViewer open={viewerOpen} onOpenChange={setViewerOpen} fileUrl={viewerFile.url} title={viewerFile.title} />
            </Layout>
        </>
    );
}
