import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardImage, HomeCard, HomeCardTitle, HomeCardDescription } from '@/components/ui/card';
import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function LocalTaskForce() {
    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                Local Task Force
            </Layout>
        </>
    );
}
