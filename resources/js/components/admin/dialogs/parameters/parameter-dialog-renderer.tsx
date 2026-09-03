'use client';

import { Area, AreaParameters, Program } from '@/types';
import { AddParameter } from './add-parameter';
import { DeleteParameter } from './delete-parameter';
import { EditParameter } from './edit-parameter';
import ImportParameter from './import-parameter';

interface ParameterDialogProps {
    type: 'add' | 'edit' | 'import' | 'delete' | null;
    parameter?: AreaParameters;
    program: Program;
    area: Area;
    onClose: () => void;
}
export function RenderParameterDialog({ type, parameter, program, area, onClose }: ParameterDialogProps) {
    switch (type) {
        case 'add':
            return <AddParameter program={program} area_id={area?.area_id} onClose={onClose} />;
        case 'edit':
            return <EditParameter parameter={parameter} program={program} area_id={area?.area_id} onClose={onClose} />;
        case 'delete':
            return <DeleteParameter parameter={parameter} program={program} area_id={area?.area_id} onClose={onClose} />;
        case 'import':
            return <ImportParameter program={program} area_id={area.area_id} onClose={onClose} />;
        case null:
            break;
        default:
            return null;
    }
}
