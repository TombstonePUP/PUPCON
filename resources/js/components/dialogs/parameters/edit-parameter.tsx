"use client"

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
} from '@/components/ui/dialog';
import { AreaParameters, Program } from '@/types';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface EditParameterProps {
    parameter: AreaParameters;
    program: Program;
    area_id: number;
    onClose?: () => void;
}

interface ParameterForm {
    area_id?: number;
    area_parameter_id?: number; // Optional for adding new parameters
    parameter_name: string;
    parameter_description: string;
}

export function EditParameter({ parameter, program, area_id, onClose }: EditParameterProps) {
    const {
        data,
        setData,
        patch,
        processing,
        errors,
        reset,
    } = useForm<ParameterForm>({
        area_id: area_id,
        area_parameter_id: undefined,
        parameter_name: '',
        parameter_description: '',
    });

    const editParameter = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('manage.area.update.parameter', {
            program_name: program.program_link,
            level_id: program.levels[0]?.accreditation_level_id,
            area_id: area_id,
            parameter_id: parameter.area_parameter_id,
        }), {
            onSuccess: () => {
                reset('parameter_name', 'parameter_description', 'area_parameter_id');
            },
        });
    };
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Parameter</DialogTitle>
                    <DialogDescription>
                        {parameter.parameter_name != ' '
                            ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}`
                            : parameter.parameter_name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={editParameter} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="w-1/4">
                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Parameter</label>
                            <input
                                id="parameter_name"
                                type="text"
                                autoFocus
                                maxLength={1}
                                tabIndex={1}
                                value={data.parameter_name}
                                onChange={(e) => {
                                    setData('parameter_name', e.target.value);
                                    setData('area_parameter_id', parameter.area_parameter_id);
                                }}
                                disabled={processing}
                                placeholder="A"
                                className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-muted-foreground mb-1 block text-sm font-medium">Description</label>
                            <input
                                id="parameter_description"
                                type="text"
                                autoFocus
                                tabIndex={2}
                                value={data.parameter_description}
                                onChange={(e) => {
                                    setData('parameter_description', e.target.value);
                                    setData('area_parameter_id', parameter.area_parameter_id);
                                }}
                                placeholder="Enter description"
                                className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                            />
                        </div>
                    </div>
                    <InputError message={errors.parameter_name} className="mt-2" />
                    <InputError message={errors.parameter_description} className="mt-2" />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button tabIndex={3} variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit" tabIndex={4}>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
