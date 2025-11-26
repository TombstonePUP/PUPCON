'use client';
import { buildOutlineTree, RecursiveOutlineForm } from '@/components/recursive-outline';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Area, AreaFormCategory, type AreaParameters, type ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { usePage } from '@inertiajs/react';
import { FolderPlus, PlusCircle } from 'lucide-react';
interface DocDialogParams {
    type: 'view' | 'upload' | 'delete' | 'rejected';
    benchmark: ParameterOutlines;
}

interface BenchDialogParams {
    type: 'add' | 'edit' | 'delete';
    benchmark?: ParameterOutlines;
    parameter?: AreaParameters;
}

interface ParamDialogParams {
    type: 'add' | 'import' | 'edit' | 'delete';
    parameter: AreaParameters;
}

interface ParameterAccordionProps {
    area_id?: number;
    program: Program;
    areaParameters?: AreaParameters[];
    parameterOutlineCategories?: ParameterOutlineCategory[];
    resolveDocDialog: (params: DocDialogParams) => void;
    resolveBenchDialog: (params: BenchDialogParams) => void;
    resolveParamDialog: (params: ParamDialogParams) => void;
}

interface AreaFilesProps {
    program: Program;
    area: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
    areaFormsCategories?: AreaFormCategory[];
}

export default function ParameterAccordion({
    area_id,
    program,
    areaParameters,
    parameterOutlineCategories,
    resolveDocDialog,
    resolveBenchDialog,
    resolveParamDialog,
}: ParameterAccordionProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;
    console.log(role);
    console.log(program);
    const canShowActions =
        (role === 'Admin' || role === 'Coordinator') && program.levels[0]?.is_active && program.levels[0]?.remarks === 'Ongoing Survey';
    return (
        <>
            <Accordion type="single" collapsible className="flex w-full flex-col gap-[1vw]">
                {areaParameters?.length > 0 ? (
                    areaParameters?.map((parameter) => (
                        <AccordionItem value={`item-${parameter.area_parameter_id}`} className="group" key={parameter.area_parameter_id}>
                            <AccordionTrigger className="flex flex-row items-center justify-between group-hover:cursor-pointer">
                                <div className="flex h-full w-full flex-row items-center">
                                    <h1 className="font-bold text-[#7f1414] group-hover:text-[#a01818]">
                                        {/*parameter.parameter_name != ' '
                                            ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}`
                                            : parameter.parameter_name*/}
                                        {parameter.parameter_name ? `Parameter ${parameter.parameter_name}` : ''}
                                    </h1>
                                    <p className="flex-1 text-center">{parameter.parameter_description}</p>
                                </div>
                                <div className="flex justify-center gap-3">
                                    <Button className="border-none" onClick={() => resolveParamDialog({ type: 'edit', parameter: parameter })}>
                                        Edit
                                    </Button>
                                    <Button variant="outline" onClick={() => resolveParamDialog({ type: 'delete', parameter: parameter })}>
                                        Remove
                                    </Button>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {parameter.parameter_outlines?.length > 0 ? (
                                    parameterOutlineCategories.map((category) => {
                                        const outlines =
                                            parameter.parameter_outlines?.filter(
                                                (outline) => outline.parameter_outline_category_id === category.parameter_outline_category_id,
                                            ) || [];
                                        if (outlines.length === 0) return null;
                                        {
                                            outlines.map(
                                                (outline) =>
                                                (outline.initial =
                                                    category.category_name == 'No Category'
                                                        ? parameter.parameter_name == ''
                                                            ? ''
                                                            : parameter.parameter_name.toUpperCase().match(/^[A-Za-z]/)
                                                        : category.category_name.match(/^[A-Za-z]/)),
                                            );
                                        }

                                        const sortedOutlines = buildOutlineTree({ outlines });

                                        return (
                                            <>
                                                <div className="rounded bg-[#f4f4f4] p-[2vw]">
                                                    <h1 className="mb-2.5 text-[1vw] font-bold">
                                                        {category.category_name == 'No Category' ? '' : category.category_name}
                                                    </h1>
                                                    <RecursiveOutlineForm
                                                        outlines={sortedOutlines}
                                                        program={program}
                                                        area_id={area_id}
                                                        outlineCategory={parameterOutlineCategories}
                                                        resolveDocDialog={resolveDocDialog}
                                                        resolveBenchDialog={resolveBenchDialog}
                                                    />
                                                </div>
                                            </>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-gray-500">No outlines available for this parameter.</p>
                                )}

                                {/* Add Benchmark Dialog */}
                                {role === 'Admin' ||
                                    (role === 'Coordinator' && (
                                        <Button
                                            className="w-fit cursor-pointer"
                                            variant={'outline'}
                                            onClick={() => {
                                                setTimeout(() => resolveBenchDialog({ type: 'add', parameter: parameter }), 50);
                                            }}
                                        >
                                            {' '}
                                            <PlusCircle />
                                            Add Benchmark
                                        </Button>
                                    ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderPlus />
                            </EmptyMedia>
                            <EmptyTitle>Content Not Available</EmptyTitle>
                            <EmptyDescription>No available parameters in this area.</EmptyDescription>
                        </EmptyHeader>
                        {canShowActions && (
                            <EmptyContent>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => resolveParamDialog({ type: 'import' })}>
                                        Import
                                    </Button>
                                    <Button onClick={() => resolveParamDialog({ type: 'add' })}>Add Parameter</Button>
                                </div>
                            </EmptyContent>
                        )}
                    </Empty>
                )}
            </Accordion>
        </>
    );
}
