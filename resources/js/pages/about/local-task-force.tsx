import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface FacultyPageProps {
    faculties: {
        name: string;
        position: string;
        photo: string | null;
    };
}

export default function LocalTaskForce({ faculties }: FacultyPageProps) {
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

                    {/* Local Task Force Page Content */}
                    <article className="local-task-force-page mt-8 w-[75%]">
                        <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                            <h2 className="mb-4 text-3xl font-bold text-[#7f1414]">Local Task Force</h2>
                            <p className="leading-relaxed text-gray-700">
                                The Local Task Force at PUP San Juan Campus is dedicated to ensuring the safety and well-being of all students,
                                faculty, and staff. Our team works collaboratively with local authorities and community organizations to address
                                any issues that may arise on campus. We are committed to fostering a secure and supportive environment for everyone.
                            </p>
                        </section>
                        <div className="grid gap-8 md:grid-cols-5">
                            {faculties.map((f) => (
                                <div key={f.id} className="faculty-card">
                                    <img src={f.photo || '/images/placeholder.png'} alt={f.name} />
                                    <h3 className="text-xl font-semibold">{f.name}</h3>
                                    <p className="text-gray-600">{f.position}</p>
                                </div>
                            ))}
                        </div>
                        <section>

                        </section>
                    </article>
                </div>
            </Layout>
        </>
    );
}
