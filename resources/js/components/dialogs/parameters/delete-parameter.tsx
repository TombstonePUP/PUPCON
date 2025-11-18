'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AreaParameters, Program } from '@/types';
import { router } from '@inertiajs/react';
import React from 'react';

interface DeleteParameterProps {
    parameter: AreaParameters;
    program: Program;
    area_id: number;
    onClose?: () => void;
}

export function DeleteParameter({ parameter, program, area_id, onClose }: DeleteParameterProps) {
    const deleteParameter = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(route('manage.area.delete.parameter', {
            program_name: program.program_link,
            level_id: program.levels[0]?.accreditation_level_id,
            area_id: area_id,
            parameter_id: parameter.area_parameter_id,
        }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900 mb-5">Are you sure?</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">This action cannot be undone. This will permanently delete the Parameter</DialogDescription>
                </DialogHeader>

                <div className="my-0 rounded-md border border-red-100 bg-red-50 p-4">
                    <p className="text-sm text-red-800">
                        <span className="mb-1 block font-semibold text-red-900">Warning: Irreversible Action!</span>
                        This action will permanently delete the benchmark and associated document (if any). This action cannot be undone.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        variant="noborder"
                        onClick={deleteParameter}
                    >
                        Delete Parameter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
