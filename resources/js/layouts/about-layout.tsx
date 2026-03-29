import PageHeader from '@/components/guest-page-header';
import PageAside from '@/components/page-aside';
import { ScrollIndicator } from '@/components/scroll-indicator';
import Layout from '@/layouts/landing-layout';
import { Head, usePoll } from '@inertiajs/react';
import { useRef } from 'react';

interface ContentPageLayoutProps {
    headTitle: string;
    title: string;
    breadcrumbs: { label: string; href: string }[];
    pageSections: { label: string; href: string }[];
    children: React.ReactNode;
}

const QUICK_LINKS = [
    { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals' },
    { label: 'History', href: '/about/history' },
    { label: 'Administration', href: '/about/administration' },
    { label: 'Facilities', href: '/about/facilities' },
    { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
    { label: 'Local Task Force', href: '/about/local-task-force' },
];

export default function ContentPageLayout({
    headTitle,
    title,
    breadcrumbs,
    pageSections,
    children,
}: ContentPageLayoutProps) {
    usePoll(5000);
    const scrollRef = useRef<HTMLElement>(null);

    return (
        <>
            <Head title={headTitle} />
            <Layout>
                <div className="bg-white text-gray-800">
                    <PageHeader title={title} breadcrumbs={breadcrumbs} />

                    <div className="mx-auto w-[75%] px-6 py-12 lg:flex lg:gap-8">
                        <PageAside quickLinks={QUICK_LINKS} pageSections={pageSections} />

                        <div className="relative flex-1 lg:w-3/4">
                            <main
                                ref={scrollRef}
                                className="hide-scrollbar max-h-[80vh] space-y-20 overflow-auto scroll-smooth"
                            >
                                {children}
                            </main>

                            <ScrollIndicator containerRef={scrollRef} />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}