import { Head } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';
import { AreaCard } from '@/components/ui/area-card';
import { PerProgramUnderSurvey } from '@/types';

interface PerProgramProps {
    program: PerProgramUnderSurvey;
}

export default function Programs({ program }: PerProgramProps) {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
    return (
        <>
            <Head title={`${program.degree_type} in ${program.program_name}`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className='flex flex-col items-center gap-3'>
                    <div className="relative before:content-[''] rounded-t-2xl mt-8 w-[75%] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#7f1414] before:to-transparent overflow-hidden h-[20vw] flex items-center">
                        <img className='w-full' src="/images/campus/comlab.jpg" alt="banner" />
                        <h2 className='absolute text-white left-20 top-[7.5vw]'>
                            {program.accreditation_level === 0 ? 'Preliminary Survey Visit' : 'Accreditation Level ' + program.accreditation_level}
                        </h2>
                        <h1 className='absolute text-white left-20 top-[9vw] w-full font-black text-[3vw]'>
                            {program.degree_type.match(/\b[A-Z]/g)} {program.program_name}
                        </h1>
                        <h2 className='absolute text-white left-20 top-[13vw]'>Polytechnic University of the Philippines <b>San Juan Campus</b>
                        </h2>
                        <div className='absolute bg-white w-fit py-[1vw] px-[2vw] h-fit gap-[0.8vw] rounded-xl right-[7vw] flex flex-col'>
                            <a className='text-[#a6a6a6] border-b border-[##0003] pb-[0.7vw] hover:text-[#7f1414]' href="#overview">
                                Program Overview
                            </a>
                            <a className='text-[#a6a6a6] border-b border-[##0003] pb-[0.7vw] hover:text-[#7f1414]' href="#goals">
                                Program Goals
                            </a>
                            <a className='text-[#a6a6a6] hover:text-[#7f1414]' href="#areas">
                                Areas Under Survey
                            </a>
                        </div>
                    </div>
                    <div className='flex justify-center border gap-3 border-[#7f1414]/25 w-[75%] p-4'>
                        <h1 className='border-r border-[#7f1414]/25 px-4 font-[950] text-2xl'>
                            <p className='font-normal text-sm mb-[-0.5vw]'>Student Population</p>
                            1000
                        </h1>
                        <h1 className='border-r border-[#7f1414]/25 px-4 font-[950] text-2xl'>
                            <p className='font-normal text-sm mb-[-0.5vw]'>Years to take</p>
                            4
                        </h1>
                        <h1 className='border-r border-[#7f1414]/25 px-4 font-[950] text-2xl'>
                            <p className='font-normal text-sm mb-[-0.5vw]'>Required credits</p>
                            33
                        </h1>
                        <h1 className='border-r border-[#7f1414]/25 px-4 font-[950] text-2xl'>
                            <p className='font-normal text-sm mb-[-0.5vw]'>Faculty population</p>
                            9
                        </h1>
                        <h1 className='px-4 font-[950] text-2xl'>
                            <p className='font-normal text-sm mb-[-0.5vw]'>Latest graduates</p>
                            100
                        </h1>
                    </div>
                    <div className='flex flex-row gap-[5vw] w-[75%] border border-[#7f1414]/25 justify-between rounded-b-xl p-5' id='overview'>
                        <div>
                            <h1 className='font-black text-[1.8vw] mb-[1vw]'>
                                Program Overview
                            </h1>
                            <p>
                                {program.overview_description || 'No program overview available.'}
                            </p>
                        </div>
                        <img className='rounded-[1vw] w-[25vw]' src="/images/campus/comlab.jpg" alt="computer lab" />
                    </div>
                    <div className="bg-[url('/images/objectives-bg.png')] w-full h-[23vw] bg-cover flex justify-center items-center" id='goals'>
                        <h1>No Program Objective</h1>
                    </div>
                    <div className='h-fit w-full px-[13vw] py-[3vw] flex flex-wrap flex-row gap-[1.5vw] justify-center' id='areas'>
                        {program?.areas?.length > 0 ? (
                            program.areas.map((area, index) => (
                                <AreaCard
                                    key={index}
                                    imageSrc={area.image_path || '/images/placeholder.png'}
                                    heading={area.area_name}
                                    circleLetter={area.area_numeral}
                                    href={route('programs.areas.show', [
                                        program.program_name,
                                        area.area_id,
                                    ])}
                                />
                            ))
                        ) : (
                            <p className='text-center text-gray-500'>No areas under survey.</p>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    )
}
