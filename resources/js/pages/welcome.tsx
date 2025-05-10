import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';
import { Button } from "@/components/ui/button";
import {
    CardHeader,
    CardDescription,
    CardImage,
    HomeCard,
    HomeCardTitle,
} from "@/components/ui/card"

export default function Welcome() {
    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className='overflow-y-hidden w-full h-[70vh] grid place-items-center'>
                    <iframe
                        className='pointer-events-none h-[240%] w-[100%]'
                        src="https://www.youtube.com/embed/QtioU1IZS_Y?autoplay=1&controls=0&modestbranding=1&rel=0&mute=1&loop=1&playlist=QtioU1IZS_Y"
                        allow="autoplay; encrypted-media" >
                    </iframe>
                </div>
                <div className="bg-[#7f1414] h-[7vw] flex items-center justify-center gap-7">
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">OVERVIEW</Button>
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">CONTACT US</Button>
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">VISIT CAMPUS</Button>
                </div>
                <div className="bg-[url('/images/bg.png')] bg-cover bg-center h-[70vh] w-full flex flex-col items-center justify-center gap-7">
                    <p className="text-[1.7vw] font-bold">LATEST UPDATES</p>
                    <div className='bg-[#7f1414] w-[10%] h-[0.3%]'></div>
                    <div className='flex flex-row gap-5'>
                        <Link href='/'>
                            <HomeCard className='hover:border-[#7f1414] pb-6 w-[18vw]'>
                                <CardImage src="/images/pupcet.jpg" alt="pupcet" />
                                <CardHeader>
                                    <HomeCardTitle>PUPSJ PUPCET</HomeCardTitle>
                                    <CardDescription>The PUPSJ PUPCET Online Application for Academic Year 2025-2026 starts on December 15, 2024 - April 15, 2025.</CardDescription>
                                </CardHeader>
                            </HomeCard>
                        </Link>
                        <Link href='/'>
                            <HomeCard className='hover:border-[#7f1414] pb-6 w-[18vw]'>
                                <CardImage src="/images/cpale.jpg" alt="cpale" />
                                <CardHeader>
                                    <HomeCardTitle>CPALE 2024 Passers</HomeCardTitle>
                                    <CardDescription>Pagpupugay sa bagong CPA ng ating Sintang Paaralan.</CardDescription>
                                </CardHeader>
                            </HomeCard>
                        </Link>
                        <Link href='/'>
                            <HomeCard className='hover:border-[#7f1414] pb-6 w-[18vw]'>
                                <CardImage src="/images/mental.jpg" alt="mental health" />
                                <CardHeader>
                                    <HomeCardTitle>Mental Health Matters</HomeCardTitle>
                                    <CardDescription>The OCPS A School Adjustment Program (ASAP) is here to help you thrive! This infographic offers easy-to-follow tips for boosting your</CardDescription>
                                </CardHeader>
                            </HomeCard>
                        </Link>
                        <Link href='/'>
                            <HomeCard className='hover:border-[#7f1414] pb-6 w-[18vw]'>
                                <CardImage src="/images/ceremony.jpg" alt="ceremony" />
                                <CardHeader>
                                    <HomeCardTitle>Ceremonial Signing</HomeCardTitle>
                                    <CardDescription>A groundbreaking partnership between PUP San Juan City and the Research Synergy Foundation!</CardDescription>
                                </CardHeader>
                            </HomeCard>
                        </Link>
                    </div>
                </div>
                <div className='grid place-items-center py-10'>
                    <HomeCard className='flex flex-row w-[70%] h-[20vw] bg-[#f4f4f4]'>
                        <CardImage className='pb-0 w-[80%] h-full' src="/images/pup-slogan.jpg" alt="pup slogan" />
                        <CardHeader className='grid place-items-center w-[80%] p-[6vw] '>
                            <HomeCardTitle className='text-[1.5vw]'>WELCOME ACCREDITORS!</HomeCardTitle>
                            <CardDescription className='grid place-items-center text-center'>
                                <h1 className='text-[0.9vw] text-black mb-[0.5vw]'>
                                    "It is our honor to host you, esteemed accreditors, and we appreciate your role in our continued success."
                                </h1>
                                <br />
                                <p>
                                    Level II AACCUP Survey Visit
                                </p>
                            </CardDescription>
                        </CardHeader>
                    </HomeCard>
                </div>

                {/* <img src="/images/bg.png" alt="background" /> */}
            </Layout>

        </>
    );
}
