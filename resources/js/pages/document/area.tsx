import AreaCards from '@/components/dashboard/areas/area-card-form';
import ParameterAccordion from '@/components/dashboard/areas/parameter-accordion';
import { RenderAreaFormDialog } from '@/components/dialogs/area-forms/area-forms-dialog-renderer';
import { RenderBenchmarkDialog } from '@/components/dialogs/benchmarks/benchmark-dialog-renderer';
import { RenderDocumentDialog } from '@/components/dialogs/documents/document-dialog-renderer';
import { RenderParameterDialog } from '@/components/dialogs/parameters/parameter-dialog-renderer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Area, AreaFormCategory, AreaForms, AreaParameters, BreadcrumbItem, ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { Head } from '@inertiajs/react';
import { LucideImport, PlusIcon } from 'lucide-react';
import { useState } from 'react';

// charts components
interface AreaFilesProps {
    program: Program;
    area: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
    areaFormsCategories?: AreaFormCategory[];
}


export default function Areas({ program, area, parameterOutlineCategories, areaFormsCategories }: AreaFilesProps) {
    const [dialog, setDialog] = useState<{
        kind: 'document' | 'benchmark' | 'parameter' | 'area-form' | null;
        action: 'view' | 'upload' | 'delete' | 'add' | 'edit' | 'import' | 'rejected';
        form?: AreaForms;
        benchmark?: ParameterOutlines;
        benchmark_categories?: ParameterOutlineCategory[];
        parameter?: AreaParameters;
    }>({ kind: null });

    const openDialog = (
        kind: 'document' | 'benchmark' | 'parameter' | 'area-form',
        action: 'view' | 'upload' | 'delete' | 'add' | 'edit' | 'import' | 'rejected',
        form?: AreaForms,
        benchmark?: ParameterOutlines,
        benchmark_categories?: ParameterOutlineCategory,
        parameter?: AreaParameters
    ) => {
        setDialog({ kind, action, form,  benchmark, benchmark_categories, parameter });
    };

    const closeDialog = () => {
        setDialog({ kind: null });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-programs/${program.program_link}/${program.levels[0]?.accreditation_level_id}`,
        },
        {
            title: area?.area_name,
            href: `/manage-programs/${program.program_link}/${area?.area_id}`,
        },
    ];

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${area.area_name} - ${program.program_name}`} />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="rounded border-2">
                        <h1 className="mt-3 mb-3 text-center text-[1.8vw] font-bold">{area.area_name.toUpperCase()}</h1>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <AreaCards
                                program={program}
                                forms={area?.area_forms}
                                // areaId={area?.area_id}
                                resolveFormDialog={(d) => openDialog('area-form', d.type, d.form, undefined, undefined, undefined)}
                            />
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 relative space-y-5 overflow-y-auto rounded-xl border p-4">
                        <div className="flex flex-row gap-2">
                            <Button className="border-none" onClick={() => openDialog('parameter', 'add')}>
                                Add
                                <PlusIcon className="ml-1 h-4 w-4" />
                            </Button>
                            <Button className="border-none" onClick={() => openDialog('parameter', 'import')}>
                                Import
                                <LucideImport className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <ParameterAccordion
                                area_id={area?.area_id}
                                program={program.program_name}
                                areaParameters={[...(area?.area_parameters ?? [])].sort((a, b) => a.parameter_name.localeCompare(b.parameter_name))}
                                parameterOutlineCategories={parameterOutlineCategories}
                                resolveDocDialog={(d) => openDialog('document', d.type, undefined, d.benchmark, undefined, undefined)}
                                resolveBenchDialog={(d) => openDialog('benchmark', d.type, undefined, d.benchmark, parameterOutlineCategories, d.parameter)}
                                resolveParamDialog={(d) => openDialog('parameter', d.type, undefined, undefined, undefined, d.parameter)}
                            />
                        </div>
                    </div>
                </div>
            </AppLayout>
            {dialog.kind === 'area-form' && (
                <RenderAreaFormDialog
                    type={dialog.action}
                    forms={area?.area_forms}
                    form={dialog.form}
                    categories={areaFormsCategories}
                    program={program}
                    area={area}
                    onClose={closeDialog}
                />
            )}
            {dialog.kind === 'document' && (
                <RenderDocumentDialog
                    type={dialog.action}
                    benchmark={dialog.benchmark}
                    program={program}
                    area={area}
                    onClose={closeDialog}
                />
            )}
            {dialog.kind === 'benchmark' && (
                <RenderBenchmarkDialog
                    type={dialog.action}
                    benchmark={dialog.benchmark}
                    parameter={dialog.parameter}
                    benchmark_categories={dialog.benchmark_categories}
                    program={program}
                    area={area}
                    onClose={closeDialog}
                />
            )}
            {dialog.kind === 'parameter' && (
                <RenderParameterDialog
                    type={dialog.action}
                    parameter={dialog.parameter}
                    program={program}
                    area={area}
                    onClose={closeDialog}
                />
            )}
        </>
    );
}

