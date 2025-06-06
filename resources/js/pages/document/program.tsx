import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import {
    type PerProgram,
} from '@/types';

export interface ProgramProps {
    program: PerProgram;
}

export default function Users({ program }: ProgramProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage_program/${program.program_id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Information Technology" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border-2 before:italic before:font-normal before:text-[#767676] before:content-['PRELIMINARY_SURVEY_VISIT'] before:relative before:left-[6vw] before:top-[2vw] before:italic before:text-[#767676] before:text-[1.2vw] before:w-full before:text-center">
                    <h1 className="left-[-10vw] font-black z-10 m-[-1vw] text-center text-[1.45vw] ">{program.degree_type.toUpperCase()}</h1>
                    <h1 className='text-center font-black text-[1.8vw] mb-3 mt-[-1vw]'>
                        {program.program_name.toUpperCase()}
                    </h1>
                </div>
                <div className='flex flex-row flex-wrap mt-10 gap-3 justify-center overflow-x-hidden'>
                    {program.areas?.length ? (
                        program.areas.map((area) => (
                        <Link key={area.area_id} href={`/manage_program/${program.program_name}/${area.area_name}`} className='border rounded shadow p-7 w-[49.5%]'>
                            <h1 className='font-black'>{area.area_number}</h1>
                            <p className='text-[#858585]'>{area.area_name}</p>
                        </Link>
                        ))
                    ) : (
                        <div className='flex flex-col items-center justify-center w-full h-full'>
                            <h1 className='text-[1.5vw] font-bold'>No Areas Available/Assigned</h1>
                            <p className='text-[1.2vw] text-[#858585]'>Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
