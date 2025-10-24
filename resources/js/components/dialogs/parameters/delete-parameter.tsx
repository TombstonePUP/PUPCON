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
            program_name: program,
            level_id: program.levels[0]?.accreditation_level_id,
            area_id: area_id,
            area_parameter_id: parameter.area_parameter_id,
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
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>This action cannot be undone. This will permanently delete the Parameter A</DialogDescription>
                </DialogHeader>
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
