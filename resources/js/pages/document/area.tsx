import AreaCards from '@/components/dashboard/areas/area-card-form';
import ParameterAccordion from '@/components/dashboard/areas/parameter-accordion';
import { DeleteBenchmark } from '@/components/dialogs/benchmarks/delete-benchmark';
import { EditBenchmark } from '@/components/dialogs/benchmarks/edit-benchmark';
import { DeleteDocument } from '@/components/dialogs/documents/delete-document';
import { UploadDocument } from '@/components/dialogs/documents/upload-document';
import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Area, AreaFormCategory, BreadcrumbItem, ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

// charts components
interface AreaFilesProps {
    program: Program;
    area?: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
    areaFormsCategories?: AreaFormCategory[];
}

interface DialogParams {
    type: 'view-document' | 'upload-document' | 'delete-document' | 'edit-benchmark' | 'delete-benchmark';
    benchmark: ParameterOutlines;
}

export default function Areas({ program, area, parameterOutlineCategories, areaFormsCategories }: AreaFilesProps) {
    const [dialogType, setDialogType] = useState<
        'view-document' | 'upload-document' | 'delete-document' | 'edit-benchmark' | 'delete-benchmark' | null
    >(null);
    const [selectedOutline, setSelectedOutline] = useState<ParameterOutlines | null>(null);

    const dialogHandlers = ({type, benchmark, program, area_id}: DialogParams) => openDialog(type, benchmark);
    const openDialog = (type: 'view-document' | 'upload-document' | 'delete-document' | 'edit-benchmark' | 'delete-benchmark', benchmark: ParameterOutlines) => {
        setDialogType(type);
        setSelectedOutline(benchmark);
    };

    const closeDialog = () => {
        setDialogType(null);
        setSelectedOutline(null);
    }

    const renderDialog=() => {
        if(!selectedOutline) return null;

        switch(dialogType) {
            case 'view-document':
                return (
                    selectedOutline.area_files?.file_path ? (
                        <DocumentViewer
                            open={true}
                            onOpenChange={closeDialog}
                            fileUrl={selectedOutline.area_files.file_path}
                            title={selectedOutline.area_files.file_name}
                        />
                    ) : (
                        <Dialog open={true} onOpenChange={closeDialog}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">No Document Available</DialogTitle>
                                    <DialogDescription>
                                        {`${selectedOutline.initial}.${selectedOutline.outline_number}. ${selectedOutline.outline_description}`}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-10 text-center">
                                    <p className="text-muted-foreground">This benchmark has no document uploaded.</p>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="noborder" onClick={closeDialog}>
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )
                );
            case 'upload-document':
                return (
                    <UploadDocument
                        outline={selectedOutline}
                        program={program?.program_link}
                        area_id={area?.area_id}
                        onClose={closeDialog}
                    />
                );
            case 'delete-document':
                return (
                    <DeleteDocument
                        outline={selectedOutline}
                        onClose={closeDialog}
                    />
                );
            case 'edit-benchmark':
                return (
                    <EditBenchmark
                        outline={selectedOutline}
                        onClose={closeDialog}
                    />
                );
            case 'delete-benchmark':
                return (
                    <DeleteBenchmark
                        outline={selectedOutline}
                        onClose={closeDialog}
                    />
                );
            case null:
                break;
            default:
                return null;
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-programs/${program.program_link}`,
        },
        {
            title: area?.area_name,
            href: `/manage-programs/${program.program_link}/${area?.area_id}`,
        },
    ];

    const {
        data: dataParams,
        setData: setParamsData,
        post: postParams,
        processing: processingParams,
        errors: errorsParams,
        reset: resetParams,
    } = useForm<ParameterForm>({
        area_id: area?.area_id || 0,
        area_parameter_id: undefined,
        parameter_name: '',
        parameter_description: '',
    });

    const [dialogOpen, setDialogOpen] = useState(false);

    const addParameter = (e: React.FormEvent) => {
        e.preventDefault();
        postParams(route('manage.area.addParameter', [program.program_name, area?.area_id]), {
            onFinish: () => {
                resetParams('parameter_name', 'parameter_description');
                setDialogOpen(false); // Close the dialog after submit
            },
        });
    };

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
                                program={{ program_name: `${program.program_name}`, degree_type: program.degree_type }}
                                forms={area?.area_forms}
                                areaId={area?.area_id}
                                categories={areaFormsCategories}
                            />
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 relative space-y-5 overflow-y-auto rounded-xl border p-4">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="border-none" onClick={() => setDialogOpen(true)}>
                                    Add Parameter
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Parameter</DialogTitle>
                                    <DialogDescription>Parameter A</DialogDescription>
                                </DialogHeader>
                                <form className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-1/4">
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Parameter</label>
                                            <input
                                                id="parameter_name"
                                                type="text"
                                                autoFocus
                                                maxLength={1}
                                                tabIndex={1}
                                                value={dataParams.parameter_name}
                                                onChange={(e) => setParamsData('parameter_name', e.target.value)}
                                                disabled={processingParams}
                                                placeholder="A"
                                                className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Description</label>
                                            <input
                                                id="parameter_description"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={2}
                                                value={dataParams.parameter_description}
                                                onChange={(e) => setParamsData('parameter_description', e.target.value)}
                                                disabled={processingParams}
                                                placeholder="Enter description"
                                                className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <InputError message={errorsParams.parameter_name} className="mt-2" />
                                    <InputError message={errorsParams.parameter_description} className="mt-2" />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button tabIndex={3} variant="outline" onClick={() => setDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button variant="noborder" type="submit" onClick={addParameter} tabIndex={4}>
                                            Submit
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <div>
                            <ParameterAccordion
                                area_id={area?.area_id}
                                program={program.program_name}
                                areaParameters={[...(area?.area_parameters ?? [])].sort((a, b) => a.parameter_name.localeCompare(b.parameter_name))}
                                parameterOutlineCategories={parameterOutlineCategories}
                                resolveDialog={dialogHandlers}
                            />
                        </div>
                    </div>
                </div>
            </AppLayout>
            {renderDialog()}
        </>
    );
}
