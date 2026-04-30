import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { ContentPages, LocalTaskForce } from '@/types/content';
import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';

interface AdfaPageProps {
    local_task_force: LocalTaskForce[];
    page: ContentPages;
}

// You can pass real data from Laravel via Inertia later
export default function LocalTaskForceGuest({ local_task_force, page }: AdfaPageProps) {
    const chairmen = local_task_force.filter((l) => !l.official);
    const officials = local_task_force.filter((l) => l.official);

    const EmptyState = ({ title, description }: { title: string; description: string }) => (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <Construction className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    );

    return (
        <>
            <Head title="Local Task Force - PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <Layout>
                <div className="flex flex-col items-center">
                    <PageHeader
                        title="Local Task Force"
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'About', href: '/about' },
                            { label: 'Local Task Force', href: '/local-task-force' },
                        ]}
                    />

                    <article className="local-task-force-page my-8 w-[75%]">
                        <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                            <h2 className="mb-4 text-3xl font-bold text-[#7f1414]">{page?.title}</h2>
                            <p className="leading-relaxed text-gray-700">{page?.description}</p>
                        </section>
                        <section className="flex flex-col gap-5">
                            {/* Officials Section */}
                            {officials && officials.length > 0 ? (
                                <div className="grid w-full gap-5 md:grid-cols-2">
                                    {officials.map((official, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center justify-center rounded-xl border border-[#7f1414]/25 bg-white p-5 text-center transition-all hover:border-[#7f1414]"
                                        >
                                            <img
                                                src={official.profile_image_path || '/images/placeholder.png'}
                                                alt={official.profile_image_name || 'Profile Image'}
                                                className="mx-auto mb-3 h-48 w-48 rounded-full object-cover shadow-md"
                                                onError={(e) => (e.currentTarget.src = '/images/placeholder.png')}
                                            />
                                            <h3 className="text-lg font-semibold text-[#7f1414]">
                                                {official.first_name} {official.last_name}
                                            </h3>
                                            <p className="text-sm font-bold">{official.official ? official.official_position : 'Chairman'}</p>
                                            <p className="text-sm text-gray-600">{official.area_name}</p>

                                            {official.members?.length > 0 &&
                                                (() => {
                                                    const coChairs = official.members.filter((m) => m.role?.includes('Co-Chairman'));
                                                    const members = official.members.filter((m) => m.role?.includes('Member'));

                                                    return (
                                                        <div className="mt-2 text-left">
                                                            {coChairs.length > 0 && (
                                                                <>
                                                                    <h4 className="text-center text-sm font-semibold text-gray-800">Co-chair</h4>
                                                                    <ul className="text-center text-sm">
                                                                        {coChairs.map((m, i) => (
                                                                            <li key={i} className="text-sm text-gray-600">
                                                                                {m.full_name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </>
                                                            )}

                                                            {members.length > 0 && (
                                                                <>
                                                                    <h4 className="mt-2 text-center text-sm font-semibold text-gray-800">Members</h4>
                                                                    <ul className="text-center text-sm">
                                                                        {members.map((m, i) => (
                                                                            <li key={i} className="text-sm text-gray-600">
                                                                                {m.full_name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No Officials Found" description="The list of officials is not available at the moment." />
                            )}

                            {/* Chairmen Section */}
                            {chairmen && chairmen.length > 0 ? (
                                <div className="grid gap-5 md:grid-cols-3">
                                    {chairmen.map((chair, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center justify-center rounded-xl border border-[#7f1414]/25 bg-white p-4 text-center transition-all hover:border-[#7f1414]"
                                        >
                                            <img
                                                src={chair.profile_image_path || '/images/placeholder.png'}
                                                alt={chair.profile_image_name || 'Profile Image'}
                                                className="mx-auto mb-3 h-48 w-48 rounded-full object-cover shadow-md"
                                                onError={(e) => (e.currentTarget.src = '/images/placeholder.png')}
                                            />
                                            <h3 className="text-lg font-semibold text-[#7f1414]">
                                                {chair.first_name} {chair.last_name}
                                            </h3>
                                            <p className="text-sm font-bold">{chair.official ? chair.official_position : 'Chairman'}</p>
                                            <p className="text-sm text-gray-600">{chair.area_name}</p>

                                            {chair.members?.length > 0 &&
                                                (() => {
                                                    const coChairs = chair.members.filter((m) => m.role?.includes('Co-Chairman'));
                                                    const members = chair.members.filter((m) => m.role?.includes('Member'));

                                                    return (
                                                        <div className="mt-2 text-left">
                                                            {coChairs.length > 0 && (
                                                                <>
                                                                    <h4 className="text-center text-sm font-semibold text-gray-800">Co-chair</h4>
                                                                    <ul className="text-center text-sm">
                                                                        {coChairs.map((m, i) => (
                                                                            <li key={i} className="text-sm text-gray-600">
                                                                                {m.full_name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </>
                                                            )}

                                                            {members.length > 0 && (
                                                                <>
                                                                    <h4 className="mt-2 text-center text-sm font-semibold text-gray-800">Members</h4>
                                                                    <ul className="text-center text-sm">
                                                                        {members.map((m, i) => (
                                                                            <li key={i} className="text-sm text-gray-600">
                                                                                {m.full_name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No Chairmen Found" description="The list of chairmen is not available at the moment." />
                            )}
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    );
}
