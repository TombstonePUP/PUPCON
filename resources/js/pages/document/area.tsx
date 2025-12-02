import AreaCards from '@/components/dashboard/areas/area-card-form';
import ParameterAccordion from '@/components/dashboard/areas/parameter-accordion';
import { RenderAreaFormDialog } from '@/components/dialogs/area-forms/area-forms-dialog-renderer';
import { RenderBenchmarkDialog } from '@/components/dialogs/benchmarks/benchmark-dialog-renderer';
import { RenderDocumentDialog } from '@/components/dialogs/documents/document-dialog-renderer';
import { RenderParameterDialog } from '@/components/dialogs/parameters/parameter-dialog-renderer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Area, AreaFormCategory, AreaForms, AreaParameters, BreadcrumbItem, ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Edit, LucideImport, PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';

interface AreaFilesProps {
    program: Program;
    area: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
    areaFormsCategories?: AreaFormCategory[];
}

export default function Areas({ program, area, parameterOutlineCategories, areaFormsCategories }: AreaFilesProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;
    const [dialog, setDialog] = useState<{
        kind: 'document' | 'benchmark' | 'parameter' | 'area-form' | null;
        action: 'view' | 'upload' | 'delete' | 'delete-form' | 'add' | 'edit' | 'import' | 'rejected';
        form?: AreaForms;
        benchmark?: ParameterOutlines;
        benchmark_categories?: ParameterOutlineCategory[];
        parameter?: AreaParameters;
    }>({ kind: null });

    const openDialog = (
        kind: 'document' | 'benchmark' | 'parameter' | 'area-form',
        action: 'view' | 'upload' | 'delete' | 'delete-form' | 'add' | 'edit' | 'import' | 'rejected',
        form?: AreaForms,
        benchmark?: ParameterOutlines,
        benchmark_categories?: ParameterOutlineCategory,
        parameter?: AreaParameters,
    ) => {
        setDialog({ kind, action, form, benchmark, benchmark_categories, parameter });
    };

    const closeDialog = () => {
        setDialog({ kind: null });
    };

    const levelId = program.levels?.[0]?.accreditation_level_id ?? '';
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-programs/${program.program_id}/${levelId}`,
        },
        {
            title: area?.area_name,
            href: `/manage-programs/${program.program_id}/${levelId}/${area?.area_id}`,
        },
    ];

    console.log(program);

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${area.area_name} - ${program.program_name}`} />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                    {/* Header Section */}
                    <div id="top" className="mb-2 rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#7f1414] text-white shadow-sm">
                                    <span className="text-2xl font-bold">{area.area_number}</span>
                                </div>
                                <div className="ml-2">
                                    <h1 className="text-xl font-semibold text-gray-900">{area.area_name}</h1>
                                    <p className="text-sm text-gray-500">{program.program_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex w-full flex-col gap-6">
                            <div>
                                <AreaCards
                                    program={program}
                                    area_id={area?.area_id}
                                    forms={area?.area_forms}
                                    resolveFormDialog={(d) => openDialog('area-form', d.type, d.form, undefined, undefined, undefined)}
                                />
                            </div>

                            <div className="flex w-full gap-6">
                                <ParameterAccordion
                                    area_id={area?.area_id}
                                    program={program}
                                    areaParameters={[...(area?.area_parameters ?? [])].sort((a, b) =>
                                        a.parameter_name.localeCompare(b.parameter_name),
                                    )}
                                    parameterOutlineCategories={parameterOutlineCategories}
                                    resolveDocDialog={(d) => openDialog('document', d.type, undefined, d.benchmark, undefined, undefined)}
                                    resolveBenchDialog={(d) =>
                                        openDialog('benchmark', d.type, undefined, d.benchmark, parameterOutlineCategories, d.parameter)
                                    }
                                    resolveParamDialog={(d) => openDialog('parameter', d.type, undefined, undefined, undefined, d.parameter)}
                                />
                            </div>
                        </div>

                        {/* Right Sidebar - Actions */}
                        {(area.area_parameters.length > 0) && (role === 'Admin' || role === 'Coordinator') && (program.levels[0]?.remarks === "Ongoing Survey" && program.levels[0]?.is_active) && (
                            <div className="w-64 shrink-0">
                                <div className="sticky top-6 space-y-4">
                                    <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
                                        <h3 className="mb-4 text-sm font-semibold text-gray-900">Area Actions</h3>
                                        <div className="flex flex-col gap-2">
                                            <Button className="border-none" onClick={() => openDialog('parameter', 'add')}>
                                                <PlusCircleIcon className="ml-1 h-4 w-4" />
                                                Add Parameter
                                            </Button>
                                            <Button className="border-none" onClick={() => openDialog('parameter', 'import')}>
                                                <LucideImport className="ml-1 h-4 w-4" />
                                                Import template
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                <RenderDocumentDialog type={dialog.action} benchmark={dialog.benchmark} program={program} area={area} onClose={closeDialog} />
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
                <RenderParameterDialog type={dialog.action} parameter={dialog.parameter} program={program} area={area} onClose={closeDialog} />
            )}
        </>
    );
}
