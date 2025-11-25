import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { ContentPages, LocalTaskForce } from '@/types/content';
import { Head } from '@inertiajs/react';

interface AdfaPageProps {
    local_task_force: LocalTaskForce[];
    page: ContentPages;
}

// You can pass real data from Laravel via Inertia later
export default function LocalTaskForceGuest({ local_task_force, page }: AdfaPageProps) {
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

                        {local_task_force && local_task_force.length === 0 && (
                            <div className="grid gap-5 md:grid-cols-3">
                                {local_task_force?.map((l, index) => (
                                    <div
                                        key={index}
                                        // whileHover={{ scale: 1.05 }}
                                        className="flex flex-col items-center justify-center rounded-xl border border-[#7f1414]/25 bg-white p-4 text-center transition-all hover:border-[#7f1414]"
                                    >
                                        <img
                                            src={l.profile_image_path || '/images/placeholder.png'}
                                            alt={l.profile_image_name || 'Profile Image'}
                                            className="mx-auto mb-3 h-48 w-48 rounded-full object-cover shadow-md"
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder.png';
                                            }}
                                        />
                                        <h3 className="text-lg font-semibold text-[#7f1414]">
                                            {l.first_name} {l.last_name}
                                        </h3>
                                        <p className="text-sm font-bold">{l.official ? l.official_position : 'Chairman'}</p>
                                        <p className="text-sm text-gray-600">{l.area_name}</p>
                                        {l.members &&
                                            l.members?.length > 0 &&
                                            (() => {
                                                // Pre-filter roles
                                                const coChairs = l.members.filter((member) => member.role?.includes('Co-Chairman'));
                                                const members = l.members.filter((member) => member.role?.includes('Member'));

                                                return (
                                                    <div className="mt-2 text-left">
                                                        {coChairs.length > 0 && (
                                                            <>
                                                                <h4 className="text-center text-sm font-semibold text-gray-800">Co-chair</h4>
                                                                <ul className="text-center text-sm">
                                                                    {coChairs.map((member, memberIndex) => (
                                                                        <li key={memberIndex} className="text-sm text-gray-600">
                                                                            {member.full_name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </>
                                                        )}

                                                        {members.length > 0 && (
                                                            <>
                                                                <h4 className="mt-2 text-center text-sm font-semibold text-gray-800">Members</h4>
                                                                <ul className="text-center text-sm">
                                                                    {members.map((member, memberIndex) => (
                                                                        <li key={memberIndex} className="text-sm text-gray-600">
                                                                            {member.full_name}
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
                        )}
                    </article>
                </div>
            </Layout>
        </>
    );
}
