import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { ContentPages, OtherServices } from '@/types/content';
import { Head, usePoll } from '@inertiajs/react';
import { Link } from 'lucide-react';

interface OtherServicesProps {
    page: ContentPages;
    others: OtherServices[];
}

export default function Others({ page, others }: OtherServicesProps) {
    usePoll(2000);

    return (
        <>
            <Head title="Other Services and Portals" />
            <Layout>
                <PageHeader
                    title="Other Services and Portals"
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Others', href: '/others' },
                    ]}
                />

                <div className="mx-auto w-[75%] px-6 py-12">
                    <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                        <h2 className="mb-2 text-3xl font-bold text-[#7f1414]">Other Services & Portals</h2>
                        <p className="leading-relaxed text-gray-700">
                            Quick access to official university portals, campus-built systems, downloadable forms, and trusted external resources for
                            students and faculty.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {others.map((other, i) => (
                            <a
                                key={i}
                                href={other.service_link || '/'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-start gap-4 rounded-xl bg-[#7f1414] p-7 text-white shadow-md transition-all hover:-translate-y-1 hover:bg-[#a83232] hover:shadow-lg"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">
                                    <Link />
                                </div>

                                <h3 className="text-lg font-semibold">{other.service_name}</h3>

                                <p className="text-sm opacity-90">{other.description}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
}
