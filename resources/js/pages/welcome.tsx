import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';
import { Button } from "@/components/ui/button";

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="bg-[#7f1414] w-screen h-[7vw] flex items-center justify-center gap-7">
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">OVERVIEW</Button>
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">CONTACT US</Button>
                    <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">VISIT CAMPUS</Button>
                </div>
            </Layout>

        </>
    );
}
