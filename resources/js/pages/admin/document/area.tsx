import AreaCards from '@/components/admin/dashboard/areas/area-card-form';
import ParameterAccordion from '@/components/admin/dashboard/areas/parameter-accordion';
import { RenderAreaFormDialog } from '@/components/admin/dialogs/area-forms/area-forms-dialog-renderer';
import { RenderBenchmarkDialog } from '@/components/admin/dialogs/benchmarks/benchmark-dialog-renderer';
import { RenderDocumentDialog } from '@/components/admin/dialogs/documents/document-dialog-renderer';
import { RenderParameterDialog } from '@/components/admin/dialogs/parameters/parameter-dialog-renderer';
import { PageTitle } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/admin/app-layout';
import { Area, AreaFormCategory, AreaForms, AreaParameters, BreadcrumbItem, ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { Head, usePage, usePoll } from '@inertiajs/react';
import { LucideImport, PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';

interface AreaFilesProps {
    program: Program;
    program_id: number;
    level_id: number;
    area: Area;
    area_id: number;
    parameterOutlineCategories?: ParameterOutlineCategory[];
    areaFormsCategories?: AreaFormCategory[];
}

export default function Areas({ program, program_id, level_id, area, area_id, parameterOutlineCategories, areaFormsCategories }: AreaFilesProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;

    // Add polling
    usePoll(5000);

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

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${area.area_name} - ${program.program_name?.trim().replace(/\b\w/g, (c) => c.toUpperCase())}`} />
                {/* Header Section */}
                <PageTitle
                    icon={<span className="text-2xl font-bold">{area.area_number}</span>}
                    title={area.area_name}
                    description={program.program_name}
                    indicator={area.archive ? { color: 'bg-warning', tooltip: 'Archive' } : undefined}
                    actions={
                        area.area_parameters.length > 0 &&
                        (role === 'Admin' || role === 'Coordinator') &&
                        program.levels[0]?.remarks === 'Ongoing Survey' &&
                        program.levels[0]?.is_active &&
                        !area.archive ? (
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" onClick={() => openDialog('parameter', 'import')}>
                                    <LucideImport className="h-4 w-4" />
                                    <span className="hidden xl:inline">Import Template</span>
                                </Button>
                                <Button className="border-none" onClick={() => openDialog('parameter', 'add')}>
                                    <PlusCircleIcon className="h-4 w-4" />
                                    <span className="hidden xl:inline">Add Parameter</span>
                                </Button>
                            </div>
                        ) : undefined
                    }
                />

                <div className="flex gap-6">
                    <div className="flex w-full flex-col gap-6">
                        <div>
                            <AreaCards
                                program={program}
                                area={area}
                                forms={area?.area_forms}
                                resolveFormDialog={(d) => openDialog('area-form', d.type, d.form, undefined, undefined, undefined)}
                            />
                        </div>

                        <div className="flex w-full gap-6">
                            <ParameterAccordion
                                area={area}
                                program={program}
                                areaParameters={[...(area?.area_parameters ?? [])].sort((a, b) => a.parameter_name.localeCompare(b.parameter_name))}
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
                    {/* {area.area_parameters.length > 0 &&
              (role === 'Admin' || role === 'Coordinator') &&
              program.levels[0]?.remarks === 'Ongoing Survey' &&
              program.levels[0]?.is_active && !area.archive === true && (
                <div className="w-64 shrink-0">
                  <div className="sticky top-6 space-y-4">
                    <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">Area Actions</h3>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" onClick={() => openDialog('parameter', 'import')}>
                          <LucideImport className="ml-1 h-4 w-4" />
                          Import Template
                        </Button>
                        <Button className="border-none" onClick={() => openDialog('parameter', 'add')}>
                          <PlusCircleIcon className="ml-1 h-4 w-4" />
                          Add Parameter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
                </div>
            </AppLayout>
            {dialog.kind === 'area-form' && (
                <RenderAreaFormDialog
                    type={dialog.action}
                    forms={area?.area_forms}
                    form={dialog.form}
                    categories={areaFormsCategories}
                    program={program}
                    program_id={program_id}
                    level_id={level_id}
                    area={area}
                    area_id={area_id}
                    onClose={closeDialog}
                />
            )}
            {dialog.kind === 'document' && (
                <RenderDocumentDialog
                    type={dialog.action}
                    benchmark={dialog.benchmark}
                    program_id={program_id}
                    level_id={level_id}
                    area_id={area_id}
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
                <RenderParameterDialog type={dialog.action} parameter={dialog.parameter} program={program} area={area} onClose={closeDialog} />
            )}
        </>
    );
}
