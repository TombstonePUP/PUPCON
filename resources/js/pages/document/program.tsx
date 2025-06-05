import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

// charts components

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Information Technology',
        href: '/document/program',
    },
];

export default function Users() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Information Technology" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border-2 before:italic before:font-normal before:text-[#767676] before:content-['PRELIMINARY_SURVEY_VISIT'] before:relative before:left-[6vw] before:top-[2vw] before:italic before:text-[#767676] before:text-[1.2vw] before:w-full before:text-center">
                    <h1 className="left-[-10vw] font-black z-10 m-[-1vw] text-center text-[1.45vw] ">BACHELOR OF SCIENCE IN </h1>
                    <h1 className='text-center font-black text-[1.8vw] mb-3 mt-[-1vw]'>
                        INFORMATION TECHNOLOGY
                    </h1>
                </div>
                <div className='flex flex-row flex-wrap mt-10 gap-3 justify-center'>
                    <Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link> <Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link><Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link> <Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link><Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link> <Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link><Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link> <Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link><Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link> <Link href='/document/program/area' className='border rounded shadow p-7 w-[49.5%]'>
                        <h1 className='font-black'>Area I</h1>
                        <p className='text-[#858585]'>Mission, Goals, and Objectives</p>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
