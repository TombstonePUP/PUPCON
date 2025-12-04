import PageHeader from '@/components/guest-page-header';
import FacultyCard from '@/components/ui/facultyCard';
import Layout from '@/layouts/landing-layout';
import { ContentPages, FacultyStaff } from '@/types/content';
import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';

interface FacultyPageProps {
    faculties: FacultyStaff[];
    page: ContentPages;
}

export default function Faculty({ faculties, page }: FacultyPageProps) {

    const EmptyState = ({ title, description }: { title: string; description: string }) => (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center col-span-full">
            <Construction className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );

    console.log(faculties);
    return (
        <Layout>
            <Head title="Faculty and Staffs" />
            <PageHeader
                title="Faculty and Staffs"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Faculty', href: '/faculty' },
                ]}
            />
            <div className="mx-auto w-[75%] px-6 py-18">
                <section className="mb-16">
                    <div className="grid items-center gap-20 md:grid-cols-2">
                        <div>
                            <div className="mb-4 inline-block rounded-full bg-[#7f1414]/5 px-4 py-1.5 text-sm font-medium text-[#7f1414]">
                                {page?.title || 'Our Faculty & Staff'}
                            </div>
                            <h2 className="mb-4 text-4xl font-bold text-gray-900">
                                Meet the Minds Behind
                                <span className="text-[#7f1414]"> Our Success</span>
                            </h2>
                            <p className="text-lg leading-relaxed text-gray-600">
                                {page?.description || 'Our dedicated faculty and staff are the backbone of our institution, committed to fostering a nurturing and dynamic learning environment. With a wealth of knowledge and experience, they inspire and guide our students towards academic excellence and personal growth.'}
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7f1414] to-[#a01818] p-18 text-white">
                            <div className="absolute top-0 right-0 text-[200px] leading-none font-bold text-white/5">"</div>
                            <div className="relative z-10">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                                    </svg>
                                </div>
                                <p className="mb-6 text-xl leading-relaxed font-medium italic">
                                    {page?.quote || 'Education is not preparation for life; education is life itself.'}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1"></div>
                                    <div className="text-right">
                                        <div className="font-semibold">{page?.author || 'John Dewey'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                    {faculties.length > 0 ? (
                        faculties.map((f) => (
                            <FacultyCard
                                key={f.faculty_staff_id}
                                faculty={{
                                    id: f.faculty_staff_id,
                                    name: `${f.first_name} ${f.middle_name ?? ''} ${f.last_name}`,
                                    photo: f.image_path || '/images/placeholder.png',
                                    position: f.status
                                }}
                            />
                        ))
                    ) : (
                        <EmptyState
                            title="No Faculty or Staff Available"
                            description="There are currently no faculty or staff members to display. Please check again later."
                        />
                    )}
                </div>

            </div>
        </Layout>
    );
}
