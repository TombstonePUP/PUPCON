import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import FacultyCard from '@/components/ui/facultyCard';
import type { Faculty } from '@/types';

interface FacultyPageProps {
  faculties: Faculty[];
}

export default function Faculty({ faculties }: FacultyPageProps) {
  return (
    <Layout>
      <Head title="Faculty and Staffs" />

      <PageHeader
        title="Faculty and Staffs"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Faculty', href: '/faculty' },
        ]}
      />

      <div className="mx-auto w-[75%] px-6 py-12">
        

         <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                        <h2 className="mb-2 text-3xl font-bold text-[#7f1414]">Other Services & Portals</h2>
                        <p className="leading-relaxed text-gray-700">
                            Quick access to official university portals, campus-built systems, and trusted external resources for students and
                            faculty.
                        </p>
                    </section>
        <div className="grid gap-8 md:grid-cols-5">
          {faculties.map((f) => (
            <FacultyCard
              key={f.faculty_id}
              faculty={{
                id: f.faculty_id,
                name: `${f.first_name} ${f.middle_name ?? ''} ${f.last_name} ${f.suffix ?? ''}`,
                photo: f.faculty_image_path || '/images/placeholder.png',
                position: f.faculty_status,
              }}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
