'use client';
import FacultyCard from '@/components/ui/facultyCard';
import ContentPageLayout from '@/layouts/guest/about-layout';
import { Administration, ContentPages } from '@/types/content';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface AdministrationPageProps {
    officials: Administration[];
    page: ContentPages;
}

export default function AdministrationPage({ officials, page }: AdministrationPageProps) {
    const pageSections = [
        { label: 'University Officials', href: 'university' },
        { label: 'Campus Officials', href: 'campus' },
    ];

    // Fallback Empty State Component
    const EmptyState = ({ title, description }: { title: string; description: string }) => (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <Construction className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    );

    const renderOfficials = (officials: Administration[]) => {
        if (!officials || officials.length === 0) {
            return <EmptyState title="No Officials Found" description="There are currently no officials available for this section." />;
        }

        return (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {officials.map((a) => (
                    <div key={a.administration_id} className="flex h-full scale-95 transform transition-all duration-300 hover:scale-100">
                        <FacultyCard
                            className="h-full flex-1"
                            faculty={{
                                id: a.administration_id,
                                name: `${a.first_name} ${a.middle_name ?? ''} ${a.last_name} ${a.suffix ?? ''}`.trim(),
                                photo: a.profile_picture_path || '/images/placeholder.png',
                                position: a.position,
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    const campus_officials = officials.filter((o) => o.type === 'Campus');
    const university_officials = officials.filter((o) => o.type === 'University');

    return (
        <ContentPageLayout
            headTitle="Administration - PUP San Juan"
            title="University Administration"
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Administration', href: '/admin' },
            ]}
            pageSections={pageSections}
        >
            {/* Hero Section */}
            <section>
                <motion.h1
                    className="mb-4 text-3xl font-bold text-[#7f1414]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {page?.title}
                </motion.h1>
                <motion.p
                    className="mb-6 leading-relaxed text-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {page?.subtitle}
                </motion.p>
            </section>

            <section id="university" className="space-y-6">
                <div className="card-fx rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                    <h2 className="mb-3 text-3xl font-bold text-[#7f1414]">University Officials</h2>
                    <p className="leading-relaxed text-gray-700">Meet the top officials managing PUP and driving university-wide initiatives.</p>
                </div>
                {renderOfficials(university_officials)}
            </section>

            <section id="campus" className="space-y-6">
                <div className="card-fx rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                    <h2 className="mb-3 text-3xl font-bold text-[#7f1414]">Campus Officials</h2>
                    <p className="leading-relaxed text-gray-700">Meet the dedicated campus officials who ensure smooth operations at PUP San Juan.</p>
                </div>
                {renderOfficials(campus_officials)}
            </section>
        </ContentPageLayout>
    );
}
