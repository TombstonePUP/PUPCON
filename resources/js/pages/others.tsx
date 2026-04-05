import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { ContentPages, OtherServices } from '@/types/content';
import { Head } from '@inertiajs/react';
import { useSmartPoll } from '@/hooks/use-smart-poll';
import { Construction, Link } from 'lucide-react';

interface OtherServicesProps {
    page: ContentPages;
    others: OtherServices[];
}

export default function Others({ page, others }: OtherServicesProps) {
    useSmartPoll(5000);

    const EmptyState = ({
        title,
        description,
    }: {
        title: string;
        description: string;
    }) => (
        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <Construction className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );

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
                        <h2 className="mb-2 text-3xl font-bold text-[#7f1414]">{page?.title}</h2>
                        <p className="leading-relaxed text-gray-700">
                            {page?.subtitle}
                        </p>
                    </section>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {others.length > 0 ? (
                            others.map((other, i) => (
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
                            ))
                        ) : (
                            <EmptyState
                                title="No Services Available"
                                description="There are currently no services or portals available. Please check back again later."
                            />
                        )}
                    </div>

                </div>
            </Layout>
        </>
    );
}
