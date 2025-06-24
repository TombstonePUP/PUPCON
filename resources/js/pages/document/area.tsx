import AreaCards from '@/components/dashboard/areas/area-card-form';
import ParameterAccordion from '@/components/dashboard/areas/parameter-accordion';
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
import { AreaFormCategory, type Area, type BreadcrumbItem, type ParameterOutlineCategory, type Program } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

// charts components
interface AreaFilesProps {
    program: Program;
    area?: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
    areaFormsCategories?: AreaFormCategory[];
}

export default function Areas({ program, area, parameterOutlineCategories, areaFormsCategories }: AreaFilesProps) {
    // const [cards, setCards] = useState<CardType[]>([]);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-programs/${program.program_name}`,
        },
        {
            title: area?.area_name,
            href: `/manage-programs/${program.program_name}/${area?.area_id}`,
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
                            // onAdd={(newCard) => setCards([...cards, newCard])}
                            // onEdit={(id, updates) => {
                            //     setCards(cards.map((card) => (card.id === id ? { ...card, ...updates } : card)));
                            // }}
                            // onRemove={(id) => setCards(cards.filter((card) => card.id !== id))}
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
                                    <Button variant="black" type="submit" onClick={addParameter} tabIndex={4}>
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
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
