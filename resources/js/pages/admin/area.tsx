import { DocumentViewer } from '@/components/admin/dialogs/documents/view-document';
import PageHeader from '@/components/guest/page-header';
import { buildOutlineTree, RecursiveOutline } from '@/components/admin/recursive-outline';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSmartPoll } from '@/hooks/use-smart-poll';
import Layout from '@/layouts/guest/landing-layout';
import type { Area, ParameterOutlineCategory, Program } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Construction } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AreaProps {
    program: Program;
    area: Area;
    categories: ParameterOutlineCategory[];
}

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Construction className="mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
    </div>
);

const alphaRegex = new RegExp('^[A-Za-z]');

export default function AreaPage({ program, area, categories }: AreaProps) {
    useSmartPoll(5000);
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const searchKeyword = searchParams?.get('search') || '';

    const { auth } = usePage<any>().props;

    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerFile, setViewerFile] = useState({ url: '', title: '' });

    const openViewer = (fileUrl: string, title: string) => {
        setViewerFile({ url: fileUrl, title });
        setViewerOpen(true);
    };

    const [openItem, setOpenItem] = useState<string | undefined>(undefined);
    const parameterId = searchParams?.get('parameter');

    const parameterRef = useRef<Record<string | number, HTMLDivElement | null>>({});

    useEffect(() => {
        if (!parameterId) return;

        const accordValue = `parameter-${parameterId}`;
        setOpenItem(accordValue);

        setTimeout(() => {
            const target = parameterRef.current[parameterId];
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
    }, [parameterId]);

    const activeLevel = Array.isArray(program.levels) ? program.levels[0] : program.levels;

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
                            label: `${program.program_name} - Level ${activeLevel?.level || ''}`,
                            href: '/programs/' + program.program_id,
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
                    {area.area_image_path ? (
                        <img className="w-[45%] rounded-xl object-cover" src={area.area_image_path} />
                    ) : (
                        <img className="w-[45%] rounded-xl object-cover" src="/images/area/placeholder.png" />
                    )}
                </div>

                <div className="flex justify-center">
                    <div className="w-[68%] overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white transition duration-300 hover:border-[#7f1414]">
                        <div className="border-l-4 border-[#7f1414] p-6">
                            <p className="text-justify indent-8 leading-relaxed text-gray-700">
                                {area.area_description || 'No area description available.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Forms Section */}
                <div className="flex justify-center py-[2vw]">
                    <div className="w-[68%]">
                        {(area as any).area_forms?.length > 0 ? (
                            <div
                                className={`grid gap-[2vw] ${
                                    (area as any).area_forms.length === 1
                                        ? 'grid-cols-1 md:mx-auto md:max-w-md'
                                        : (area as any).area_forms.length === 2
                                          ? 'grid-cols-1 md:grid-cols-2'
                                          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                }`}
                            >
                                {(area as any).area_forms?.map((area_form: any) => (
                                    <div
                                        key={area_form.area_form_id}
                                        className="group relative flex flex-col overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white transition-all duration-300 hover:border-[#7f1414]"
                                    >
                                        <div className="relative flex items-center justify-center bg-gradient-to-br from-[#7f1414]/5 to-[#7f1414]/10 py-6 transition-colors duration-300 group-hover:from-[#7f1414]/10 group-hover:to-[#7f1414]/15">
                                            <div className="absolute top-0 right-0 h-16 w-16 translate-x-6 -translate-y-6 rounded-full bg-[#7f1414]/5"></div>
                                            <div className="absolute bottom-0 left-0 h-12 w-12 -translate-x-4 translate-y-4 rounded-full bg-[#7f1414]/5"></div>
                                            <svg
                                                className="relative z-10 h-12 w-12 text-[#7f1414] transition-transform duration-300 group-hover:scale-110"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex flex-1 flex-col items-center justify-between p-5 text-center">
                                            <div className="flex w-full flex-col items-center">
                                                <h3 className="mb-2 line-clamp-2 min-h-[3rem] text-base leading-snug font-bold text-[#7f1414] transition-colors duration-300 group-hover:text-[#a01818]">
                                                    {area_form.area_form_category.category_name}
                                                </h3>
                                                <p className="mb-4 line-clamp-1 text-sm leading-relaxed text-gray-600">
                                                    {area.area_numeral?.trim() ? `Area ${area.area_numeral}` : `Area ${area.area_number}`} •{' '}
                                                    {program.program_name}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => openViewer(`${area_form.file_path}`, `${area_form.area_form_category.category_name}`)}
                                                className="group/btn relative overflow-hidden rounded-full bg-[#7f1414] px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#a01818]"
                                            >
                                                <span className="relative z-10">View Document</span>
                                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                                            </button>
                                        </div>
                                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#7f1414] to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No Forms Available"
                                description="Forms for this area have not been uploaded yet. They will be added during the accreditation process."
                            />
                        )}
                    </div>
                </div>

                <div className="flex w-full flex-col items-center justify-center gap-4 py-2">
                    <div className="w-[68%]">
                        {(area as any).area_parameters?.length > 0 ? (
                            <Accordion type="single" collapsible className="flex flex-col gap-[1vw]" value={openItem} onValueChange={setOpenItem}>
                                {[...(area as any).area_parameters]
                                    .sort((a, b) => {
                                        if (a.parameter_name?.trim().toUpperCase() === 'A') return -1;
                                        if (b.parameter_name?.trim().toUpperCase() === 'A') return 1;
                                        return a.parameter_name?.localeCompare(b.parameter_name || '') || 0;
                                    })
                                    .map((parameter: any) => {
                                        const paramKey = parameter.parameter_id ?? parameter.area_parameter_id;

                                        const hasOutlines = categories.some((category) => {
                                            const outlines =
                                                parameter.parameter_outlines?.filter(
                                                    (outline: any) =>
                                                        outline.parameter_outline_category_id === category.parameter_outline_category_id,
                                                ) || [];
                                            return outlines.length > 0;
                                        });

                                        return (
                                            <div
                                                key={`parameter-wrapper-${paramKey}`}
                                                ref={(el) => {
                                                    parameterRef.current[paramKey] = el;
                                                }}
                                            >
                                                <AccordionItem className="group bg-white transition duration-300" value={`parameter-${paramKey}`}>
                                                    <AccordionTrigger className="my-1 group-hover:cursor-pointer">
                                                        <div className="flex w-full flex-row items-center justify-between pr-4">
                                                            <h1 className="font-bold text-[#7f1414] group-hover:text-[#a01818]">
                                                                {!parameter.parameter_name?.trim()
                                                                    ? `${parameter.parameter_description}`
                                                                    : `Parameter ${parameter.parameter_name.toUpperCase()[0]}`}
                                                            </h1>
                                                            <p className="text-sm font-medium text-gray-600">
                                                                {parameter.parameter_name?.trim() ? parameter.parameter_description : ''}
                                                            </p>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        {hasOutlines ? (
                                                            categories.map((category) => {
                                                                const filteredOutlines = (parameter.parameter_outlines || [])
                                                                    .filter(
                                                                        (o: any) =>
                                                                            o.parameter_outline_category_id ===
                                                                            category.parameter_outline_category_id,
                                                                    )
                                                                    .map((o: any) => ({
                                                                        ...o,
                                                                        initial:
                                                                            category.category_name === 'No Category'
                                                                                ? parameter.parameter_name?.trim()
                                                                                    ? parameter.parameter_name.toUpperCase().match(alphaRegex)?.[0] ||
                                                                                      ''
                                                                                    : ''
                                                                                : category.category_name.match(alphaRegex)?.[0] || '',
                                                                    }));

                                                                if (filteredOutlines.length === 0) return null;

                                                                const sortedOutlines = buildOutlineTree({ outlines: filteredOutlines });

                                                                return (
                                                                    <div
                                                                        key={`category-${category.parameter_outline_category_id}-${paramKey}`}
                                                                        className="mb-4 rounded bg-[#D9D9D9]/25 p-[2vw] last:mb-0"
                                                                    >
                                                                        <h1 className="mb-2 font-bold">
                                                                            {category.category_name === 'No Category' ? '' : category.category_name}
                                                                        </h1>
                                                                        <RecursiveOutline
                                                                            outlines={sortedOutlines}
                                                                            program={program as any}
                                                                            area={area}
                                                                            resolveDocDialog={(params) => {
                                                                                if (params.type === 'view') {
                                                                                    openViewer(
                                                                                        params.benchmark.area_files?.file_path || '',
                                                                                        params.benchmark.outline_description || '',
                                                                                    );
                                                                                }
                                                                            }}
                                                                            resolveBenchDialog={() => {}} // Non-form view is read-only
                                                                        />
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="rounded bg-[#D9D9D9]/25 p-[2vw] text-center">
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <svg
                                                                        className="h-8 w-8 text-gray-400"
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
                                                                    <p className="font-medium text-gray-500">
                                                                        No outline available for this parameter
                                                                    </p>
                                                                    <p className="text-sm text-gray-400">
                                                                        Content will be added during the accreditation process
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </div>
                                        );
                                    })}
                            </Accordion>
                        ) : (
                            <EmptyState
                                title="No Parameters Available"
                                description="Parameters for this area have not been defined yet. They will be configured during the accreditation process."
                            />
                        )}
                    </div>
                </div>
                <div className="h-10"></div>
                <DocumentViewer open={viewerOpen} onOpenChange={setViewerOpen} fileUrl={viewerFile.url} title={viewerFile.title} />
            </Layout>
        </>
    );
}
