'use client';

import { Area, AreaParameters, ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { AddBenchmark } from './add-benchmark';
import { DeleteBenchmark } from './delete-benchmark';
import { EditBenchmark } from './edit-benchmark';

interface BenchmarkDialogProps {
    type: 'add' | 'edit' | 'delete';
    benchmark?: ParameterOutlines;
    benchmark_categories?: ParameterOutlineCategory[];
    program: Program;
    area: Area;
    parameter?: AreaParameters;
    onClose: () => void;
}

export function RenderBenchmarkDialog({ type, benchmark, program, area, parameter, benchmark_categories, onClose }: BenchmarkDialogProps) {
    switch (type) {
        case 'add':
            return (
                <AddBenchmark
                    parameter={parameter}
                    program={program}
                    area_id={area?.area_id}
                    parameter_outline_categories={benchmark_categories}
                    onClose={onClose}
                />
            );
        case 'edit':
            return (
                <EditBenchmark
                    outline={benchmark}
                    program={program}
                    area_id={area?.area_id}
                    parameter_outline_categories={benchmark_categories}
                    onClose={onClose}
                />
            );
        case 'delete':
            return <DeleteBenchmark outline={benchmark} program={program} area_id={area?.area_id} onClose={onClose} />;
        case null:
            break;
        default:
            return null;
    }
}
