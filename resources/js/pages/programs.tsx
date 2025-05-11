import { Head, Link } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';

export default function Programs() {
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
                    <div>
                        <Link href='/programs/programview'>
                            <h1 className='text-[1vw] text-[#7f1414] font-bold'>
                                Bachelor of Science in
                            </h1>
                            <h1 className='text-[2.8vw] text-[#7f1414] font-black m-[-1vw] ml-[0.05vw] underline'>
                                Information Technology
                            </h1>
                        </Link>
                        <p className='mt-[2vw] text-justify'>
                            The Bachelor of Science in Information Technology (BSIT) program is a four-year degree program which focuses on the study of computer utilization and computer software to plan, install, customize, operate, manage, administer and maintain information technology infrastructure. It likewise deals with the design and development of computer-based information systems for real-world business solutions.The program prepares students to become IT professionals with primary competencies in the areas of systems analysis and design, applications development, database administration, network administration, and systems implementation and maintenance.
                        </p>

                    </div>
                    <div>
                        <Link href='/programs'>
                            <h1 className='text-[1vw] text-[#7f1414] font-bold'>
                                Bachelor of Science in
                            </h1>
                            <h1 className='text-[2.8vw] text-[#7f1414] font-black m-[-1vw] ml-[0.05vw] underline'>
                                Accountancy
                            </h1>
                        </Link>
                        <p className='mt-[2vw] text-justify'>
                            A Bachelor of Science in Accounting (BSA) is a 4-year degree that prepares students for entry-level professional positions in public, private, or government accounting. Some schools may also refer to a comparable degree as a Bachelor of Accountancy. Upon graduation, students can qualify for placement in graduate or professional schools to prepare for CPA licensure.
                        </p>
                    </div>
                </div>
            </Layout>
        </>
    )
}