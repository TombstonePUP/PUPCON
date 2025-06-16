import { Head, Link } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion"

export default function Programs() {
    return (
        <>
            <Head title="Area I - Information Technology">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className='flex flex-row w-full justify-center gap-[1vw] h-[18vw] p-[2vw]'>
                    <div className='bg-[#7f1414] w-[25%] rounded-tl-[1vw] rounded-bl-[1vw] rounded-tr-[1vw] flex flex-col justify-center px-[4vw]'>
                        <p className='text-white text-[1vw]'>Area I</p>
                        <h1 className='text-white font-black text-[1.7vw] leading-[1.7vw]'>Mission, Goals, and Objectives</h1>
                    </div>
                    <img className='object-cover w-[45%] rounded-tl-[1vw] rounded-br-[1vw] rounded-tr-[1vw]' src="/images/placeholder.png" alt="placeholder" />
                </div>
                <div className='flex justify-center'>
                    <p className='indent-[2vw] text-justify w-[68%] py-[1.5vw] px-[3vw] border rounded-[1vw] border-[#B4B4B4]'>
                        The area of Vision, Mission, Goals, and Objectives is the most fundamental of all the (10) areas to be surveyed. Everything in the Institution is justified only to the extent that it realizes its vision and mission. It is essential therefore, for the Institution to formulate the vision and mission which should be the bases of all its operations. The Institution is judged by the degree to which these are attained, not in comparison with others.
                    </p>
                </div>
                <div className='w-full flex justify-center py-[2vw]'>
                    <Accordion type="single" collapsible className='w-[68%] flex flex-col gap-[1vw]'>
                        <AccordionItem value="item-1" className='before:bg-[#171717]'>
                            <AccordionTrigger className='flex flex-row justify-between'>
                                <div className="flex flex-row justify-between w-full">
                                    <h1 className='text-[#7f1414] font-black'>Parameter A</h1>
                                    <p>Statement of Vision, Mission, Goals, and Objectives</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='bg-[#D9D9D9] p-[2vw] rounded'>
                                    <h1 className='font-black text-[1vw]'>Systems - Inputs and Processes</h1>
                                    <ul className='pl-[1vw]'>
                                        <li>S.1. The institution has a system of determining the Vision and Mission.</li>
                                        <li>S.2. The Vision clearly reflects what the Institution hopes to become in the future.</li>
                                        <li>S.3. The Mission clearly reflects the Institution’s legal and other statutory mandates.</li>

                                    </ul>
                                </div>
                                <div className='bg-[#D9D9D9] p-[2vw] rounded'>
                                    <h1 className='font-black text-[1vw]'>Implementation</h1>
                                    <ul className='pl-[1vw]'>
                                        <li>I.1. The Institution/College conducts review on the statement of the Vision and Mission as well as its goals and program objectives for the approval of authorities concerned.</li>
                                        <li>I.2. The College/Academic Unit follows a system of formulating its goals and the objectives of the program.</li>
                                        <li>I.3. The College/Academic Unit’s faculty, personnel, students and other stakeholders (cooperating agencies, linkages, alumni, industry sector and other concerned groups) participate in the formulation, review and/or revision of the VMGO.</li>

                                    </ul>
                                </div>
                                <div className='bg-[#D9D9D9] p-[2vw] rounded'>
                                    <h1 className='font-black text-[1vw]'>Outcome/s</h1>
                                    <ul className='pl-[1vw]'>
                                        <li >O.1. The VMGO are crafted and duly approved by BOR/BOT.</li>
                                    </ul>
                                </div>
                            </AccordionContent>
                        </AccordionItem>


                        <AccordionItem value="item-2">
                            <AccordionTrigger className='flex flex-row justify-between'>
                                <div className='flex flex-row justify-between w-full'>
                                    <h1 className='text-[#7f1414] font-black'>Parameter B</h1>
                                    <p>Statement of Vision, Mission, Goals, and Objectives</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='bg-[#D9D9D9] p-[2vw] rounded'>
                                    <h1 className='font-black text-[1vw]'>Systems - Inputs and Processes</h1>
                                    <ul className='pl-[1vw]'>
                                        <li>S.1. The institution has a system of determining the Vision and Mission.</li>
                                        <li>S.2. The Vision clearly reflects what the Institution hopes to become in the future.</li>
                                        <li>S.3. The Mission clearly reflects the Institution’s legal and other statutory mandates.</li>

                                    </ul>
                                </div>
                                <div className='bg-[#D9D9D9] p-[2vw] rounded'>
                                    <h1 className='font-black text-[1vw]'>Implementation</h1>
                                    <ul className='pl-[1vw]'>
                                        <li>I.1. The Institution/College conducts review on the statement of the Vision and Mission as well as its goals and program objectives for the approval of authorities concerned.</li>
                                        <li>I.2. The College/Academic Unit follows a system of formulating its goals and the objectives of the program.</li>
                                        <li>I.3. The College/Academic Unit’s faculty, personnel, students and other stakeholders (cooperating agencies, linkages, alumni, industry sector and other concerned groups) participate in the formulation, review and/or revision of the VMGO.</li>

                                    </ul>
                                </div>
                                <div className='bg-[#D9D9D9] p-[2vw] rounded'>
                                    <h1 className='font-black text-[1vw]'>Outcome/s</h1>
                                    <ul className='pl-[1vw]'>
                                        <li >O.1. The VMGO are crafted and duly approved by BOR/BOT.</li>
                                    </ul>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </Layout>
        </>
    )
}