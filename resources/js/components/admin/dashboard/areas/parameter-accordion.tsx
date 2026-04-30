'use client';
import { buildOutlineTree, RecursiveOutlineForm } from '@/components/admin/recursive-outline';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Area, type AreaParameters, type ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { usePage } from '@inertiajs/react';
import { FolderPlus, Pencil, PlusCircle, Trash2 } from 'lucide-react';

const alphaRegex = new RegExp('^[A-Za-z]');

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
    parameter?: AreaParameters;
}

interface ParameterAccordionProps {
    area: Area;
    program: Program;
    areaParameters?: AreaParameters[];
    parameterOutlineCategories?: ParameterOutlineCategory[];
    resolveDocDialog: (params: DocDialogParams) => void;
    resolveBenchDialog: (params: BenchDialogParams) => void;
    resolveParamDialog: (params: ParamDialogParams) => void;
}

export default function ParameterAccordion({
    area,
    program,
    areaParameters,
    parameterOutlineCategories,
    resolveDocDialog,
    resolveBenchDialog,
    resolveParamDialog,
}: ParameterAccordionProps) {
    const { auth } = usePage<any>().props;
    const role = auth?.user?.roles?.role_name;

    const activeLevel = Array.isArray(program.levels) ? program.levels[0] : program.levels;
    const canShowActions =
        (role === 'Admin' || role === 'Coordinator') && activeLevel?.is_active && activeLevel?.remarks === 'Ongoing Survey' && !area.archive === true;

    return (
        <>
            <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                {areaParameters && areaParameters.length > 0 ? (
                    areaParameters?.map((parameter) => (
                        <AccordionItem
                            value={`item-${parameter.area_parameter_id}`}
                            className="group bg-muted/50 border-border mb-2 overflow-hidden rounded-xl border"
                            key={`param-item-${parameter.area_parameter_id}`}
                        >
                            <div className="relative">
                                <AccordionTrigger className="flex flex-row items-center justify-between p-4 px-6 group-hover:cursor-pointer hover:no-underline">
                                    <div className="flex w-full flex-row items-center justify-between pr-24">
                                        <h1 className="text-primary group-hover:text-primary/80 font-bold">
                                            {parameter.parameter_name?.trim()
                                                ? `Parameter ${parameter.parameter_name}`
                                                : parameter.parameter_description}
                                        </h1>
                                        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                                            {parameter.parameter_name?.trim() ? parameter.parameter_description : ''}
                                        </p>
                                    </div>
                                </AccordionTrigger>

                                {canShowActions && (
                                    <div className="absolute top-1/2 right-14 z-10 flex -translate-y-1/2 justify-center gap-3">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="hover:bg-primary/10 hover:text-primary h-8 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                resolveParamDialog({ type: 'edit', parameter: parameter });
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="hidden xl:inline">Edit</span>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="hover:bg-destructive/10 hover:text-destructive h-8 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                resolveParamDialog({ type: 'delete', parameter: parameter });
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="hidden xl:inline">Remove</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <AccordionContent className="p-6 pt-0">
                                {parameter.parameter_outlines && parameter.parameter_outlines.length > 0 ? (
                                    parameterOutlineCategories?.map((category) => {
                                        // Optimized filtering without in-place mutation
                                        const filteredOutlines = (parameter.parameter_outlines || [])
                                            .filter((o) => o.parameter_outline_category_id === category.parameter_outline_category_id)
                                            .map((o) => ({
                                                ...o,
                                                initial:
                                                    category.category_name === 'No Category'
                                                        ? parameter.parameter_name?.trim()
                                                            ? parameter.parameter_name.toUpperCase().match(alphaRegex)?.[0] || ''
                                                            : ''
                                                        : category.category_name.match(alphaRegex)?.[0] || '',
                                            }));

                                        if (filteredOutlines.length === 0) return null;

                                        const sortedOutlines = buildOutlineTree({ outlines: filteredOutlines });

                                        return (
                                            <div
                                                key={`category-${category.parameter_outline_category_id}-${parameter.area_parameter_id}`}
                                                className="border-border bg-background/50 mb-4 rounded-xl border p-6 last:mb-0"
                                            >
                                                <h1 className="text-muted-foreground/80 mb-4 text-xs font-bold tracking-widest uppercase">
                                                    {category.category_name === 'No Category' ? 'General Benchmarks' : category.category_name}
                                                </h1>
                                                <RecursiveOutlineForm
                                                    outlines={sortedOutlines}
                                                    program={program}
                                                    area={area}
                                                    resolveDocDialog={resolveDocDialog}
                                                    resolveBenchDialog={resolveBenchDialog}
                                                />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-muted-foreground border-border bg-muted/20 rounded-xl border-2 border-dashed py-8 text-center text-sm">
                                        No benchmarks available for this parameter.
                                    </div>
                                )}

                                {canShowActions && (
                                    <div className="mt-6 flex justify-center">
                                        <Button
                                            className="cursor-pointer gap-2 rounded-lg"
                                            variant="outline"
                                            onClick={() => {
                                                setTimeout(() => resolveBenchDialog({ type: 'add', parameter: parameter }), 50);
                                            }}
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Add Benchmark
                                        </Button>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))
                ) : (
                    <Empty className="rounded-xl border-2 border-dashed">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderPlus className="text-muted-foreground/40 h-10 w-10" />
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
