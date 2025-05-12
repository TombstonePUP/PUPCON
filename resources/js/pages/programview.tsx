import { Head } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';
import { AreaCard } from '@/components/ui/area-card';

export default function Programs() {
    return (
        <>
            <Head title="Information Technology">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#7f1414] before:to-transparent overflow-hidden h-[25vw] flex items-center">
                    <img className='w-full' src="/images/campus/comlab.jpg" alt="banner" />
                    <h2 className='absolute text-white px-[15vw] top-[9.5vw]'>Accreditation Level 1</h2>
                    <h1 className='absolute text-white px-[14.9vw] w-full font-black text-[3vw]'>BS Information Technology</h1>
                    <h2 className='absolute text-white px-[15vw] top-[14vw]'>Polytechnic University of the Philippines
                    </h2>
                    <b className='absolute text-white px-[30.6vw] top-[14vw]'>San Juan Campus</b>
                    <div className='absolute bg-white w-fit py-[1vw] px-[2vw] h-fit gap-[0.8vw] rounded-[0.8vw] right-[15vw] flex flex-col'>
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
                <div className='flex flex-row gap-[5vw] px-[15vw] py-[3vw]' id='overview'>
                    <div>
                        <h1 className='font-black text-[1.8vw] mb-[1vw]'>
                            Program Overview
                        </h1>
                        <p className='text-justify'>
                            The Bachelor of Science in Information Technology (BSIT) program is a four-year degree program which focuses on the study of computer utilization and computer software to plan, install, customize, operate, manage, administer and maintain information technology infrastructure. It likewise deals with the design and development of computer-based information systems for real-world business solutions.The program prepares students to become IT professionals with primary competencies in the areas of systems analysis and design, applications development, database administration, network administration, and systems implementation and maintenance.
                        </p>
                    </div>
                    <img className='rounded-[1vw] w-[25vw]' src="/images/campus/comlab.jpg" alt="computer lab" />
                </div>
                <div className="bg-[url('/images/objectives-bg.png')] w-full h-[23vw] bg-cover flex justify-center items-center" id='goals'>
                    <h1>No Program Objective</h1>
                </div>
                <div className='h-fit w-full px-[13vw] py-[3vw] flex flex-wrap flex-row gap-[1.5vw] justify-center' id='areas'>
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Mission, Goals, and Objectives"
                        circleLetter="I"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Faculty"
                        circleLetter="II"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Curriculum and Instruction"
                        circleLetter="III"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Support to students"
                        circleLetter="IV"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Research"
                        circleLetter="V"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Extension and Community Involvement"
                        circleLetter="VI"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Library"
                        circleLetter="VII"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Physical Plant and Facilities"
                        circleLetter="VIII"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Laboratories"
                        circleLetter="IX"
                        href="/programs/programview/area" />
                    <AreaCard imageSrc="/images/placeholder.png"
                        heading="Administration"
                        circleLetter="X"
                        href="/programs/programview/area" />
                </div>
            </Layout>
        </>
    )
}