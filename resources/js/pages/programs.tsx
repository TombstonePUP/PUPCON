import { Head, Link } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';
import { ProgramsUnderSurvey } from '@/types';

interface ProgramsProps {
    programs: ProgramsUnderSurvey[];
}

export default function Programs({ programs }: ProgramsProps) {
    return (
        <>
            <Head title="Programs Under Survey">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#7f1414] before:to-transparent overflow-hidden h-[25vw] flex items-center">
                    <img src="/images/campus/ground.jpg" alt="banner" />
                    <h1 className='absolute text-white text-center w-full font-black text-[3.5vw]'>Programs Under Survey</h1>
                </div>
                <div className='flex flex-col py-[3vw] px-[30vw] gap-[3vw]'>
                    {programs?.length > 0 ? (
                        programs.map((program) => (
                            <div key={program.program_id} className='flex flex-col gap-[1vw]'>
                                <Link href={`/programs/${program.program_name}`}>
                                    <h1 className='text-[1vw] text-[#7f1414] font-bold'>
                                        {program.degree_type} in
                                    </h1>
                                    <h1 className='text-[2.8vw] text-[#7f1414] font-black m-[-1vw] ml-[0.05vw] underline'>
                                        {program.program_name}
                                    </h1>
                                </Link>
                                <p className='mt-[2vw] text-justify'>
                                    {program.program_description}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className='text-center text-gray-500'>No Programs Under Survey.</p>
                    )}
                </div>
            </Layout>
        </>
    )
}
