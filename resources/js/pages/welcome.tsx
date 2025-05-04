import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardAction,
    CardImage
} from "@/components/ui/card"

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className='overflow-hidden w-[100vw] h-[70vh] grid place-items-center'>
                    <iframe
                        className='pointer-events-none h-[240%] w-[100%]'
                        src="https://www.youtube.com/embed/QtioU1IZS_Y?autoplay=1&controls=0&modestbranding=1&rel=0&mute=1&loop=1&playlist=QtioU1IZS_Y"
                        allow="autoplay; encrypted-media" >
                    </iframe>
                </div>
                <div className="bg-[#7f1414] w-screen h-[7vw] flex items-center justify-center gap-7">
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">OVERVIEW</Button>
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">CONTACT US</Button>
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">VISIT CAMPUS</Button>
                </div>
                <div className="bg-[url('/images/bg.png')] bg-cover bg-center h-[70vh] w-screen flex flex-col items-center justify-center gap-7">
                    <p className="text-[1.7vw] font-bold">LATEST UPDATES</p>
                    <div className='bg-[#7f1414] w-[10%] h-[0.3%]'></div>
                    <div className='flex flex-row gap-5'>
                        <Link href='/'>
                            <Card className='hover:border-[#7f1414] pb-6'>
                                <CardImage src="/images/pupcet.jpg" alt="pupcet" />
                                <CardHeader>
                                    <CardTitle>PUPSJ PUPCET</CardTitle>
                                    <CardDescription>The PUPSJ PUPCET Online Application for Academic Year 2025-2026 starts on December 15, 2024 - April 15, 2025.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href='/'>
                            <Card className='hover:border-[#7f1414] pb-6'>
                                <CardImage src="/images/cpale.jpg" alt="cpale" />
                                <CardHeader>
                                    <CardTitle>CPALE 2024 Passers</CardTitle>
                                    <CardDescription>Pagpupugay sa bagong CPA ng ating Sintang Paaralan.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href='/'>
                            <Card className='hover:border-[#7f1414] pb-6'>
                                <CardImage src="/images/mental.jpg" alt="mental health" />
                                <CardHeader>
                                    <CardTitle>Mental Health Matters</CardTitle>
                                    <CardDescription>The OCPS A School Adjustment Program (ASAP) is here to help you thrive! This infographic offers easy-to-follow tips for boosting your</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href='/'>
                            <Card className='hover:border-[#7f1414] pb-6'>
                                <CardImage src="/images/ceremony.jpg" alt="ceremony" />
                                <CardHeader>
                                    <CardTitle>Ceremonial Signing</CardTitle>
                                    <CardDescription>A groundbreaking partnership between PUP San Juan City and the Research Synergy Foundation!</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </div>
                <div className='grid place-items-center py-10'>
                    <Card  className='flex flex-row'>
                        <CardImage className='pb-0' src="/images/pup-slogan.jpg" alt="pup slogan" />
                        <CardHeader className='py-2'>
                            <CardTitle>Ceremonial Signing</CardTitle>
                            <CardDescription>This is your dashboard</CardDescription>
                        </CardHeader>
                    </Card>
                </div>



                {/* <img src="/images/bg.png" alt="background" /> */}
            </Layout>

        </>
    );
}
