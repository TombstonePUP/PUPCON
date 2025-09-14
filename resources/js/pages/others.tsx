import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function Others() {
    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <PageHeader
                    title="Other Services and Portals"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Others', href: '/faculty' },
                    ]}
                />
            </Layout>
        </>
    );
}
