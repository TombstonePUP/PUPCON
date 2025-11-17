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
import { Program } from '@/types';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface ParameterForm {
    area_id: number;
    area_parameter_id?: number;
    parameter_name: string;
    parameter_description: string;
}

interface AddParameterProps {
    program: Program;
    area_id: number;
    onClose?: () => void;
}


export function AddParameter({ program, area_id, onClose }: AddParameterProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<ParameterForm>({
        area_id: area_id || 0,
        area_parameter_id: undefined,
        parameter_name: '',
        parameter_description: '',
    });


    const addParameter = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manage.area.add.parameter', {
                program_name: program.program_link,
                level_id: program.levels[0]?.accreditation_level_id,
                area_id: area_id,
            }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Parameter</DialogTitle>
                    <DialogDescription>Create a New Parameter</DialogDescription>
                </DialogHeader>
                <form onSubmit={addParameter} className="flex flex-col gap-4">
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
                                onChange={(e) => setData('parameter_name', e.target.value)}
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
                                required
                                autoFocus
                                tabIndex={2}
                                value={data.parameter_description}
                                onChange={(e) => setData('parameter_description', e.target.value)}
                                disabled={processing}
                                placeholder="Enter description"
                                className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                            />
                        </div>
                    </div>
                    <InputError message={errors.parameter_name} className="mt-2" />
                    <InputError message={errors.parameter_description} className="mt-2" />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button tabIndex={3} variant="outline" onClick={() => onClose}>
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
