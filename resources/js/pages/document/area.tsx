import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import {
    type Program,
    type Area,
    type ParameterOutlineCategory,
} from "@/types"

import AreaForm from '@/components/dashboard/areas/area-form';
import AddParameter from '@/components/dashboard/areas/parameter';

// charts components
interface AreaFilesProps {
    program: Program;
    area?: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
}

export default function Areas({ program, area, parameterOutlineCategories }: AreaFilesProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-program/${program.program_name}`,
        },
        {
            title: area.area_name,
            href: `/manage-program/${program.program_name}/${area.area_id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${area.area_name} - ${program.program_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border-2">
                    <h1 className='text-center font-black text-[1.8vw] mb-3 mt-3'>
                        {area.area_name.toUpperCase()}
                    </h1>
                </div>
                <div className='flex flex-row'>
                    <div className='bg-[url]'>
                    </div>
                    <AreaForm>
                    </AreaForm>
                </div>
                <div className="border-sidebar-border/70 relative space-y-5 overflow-y-auto rounded-xl border p-4">
                    <AddParameter
                        areaId={area.area_id}
                        program={program.program_name}
                        areaParameters={area.area_parameters}
                        parameterOutlineCategories={parameterOutlineCategories}/>
                </div>
            </div>
        </AppLayout>
    );
}
