import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

// Define types
interface Chairman {
    name: string;
    role: string;
    position: string;
    photo: string | null;
    members: Members[] | null;
}

interface Members {
    name: string;
    position: string;
    photo: string | null;
}

interface AdfaPageProps {
    faculties: Chairman[];
    admins: Members[];
}

// Temporary local data (for testing)
const sampleFaculties: Chairman[] = [
    {
        name: "Dr. Cecilia Reyes-Alagon",
        role: "Campus Director",
        position: "Overall Chairman",
        photo: "Cecilia-Reyes-Alagon.jpg",
        members: null,
    },
    {
        name: "Asst. Prof. Maria Carina Paz-Corpuz",
        role: "Quality Assurance Coordinator",
        position: "Accreditation Coordinator",
        photo: "Maria-Carina-Corpuz.jpg",
        members: null,
    },
    {
        name: "Elias Austria",
        role: "Area 1 Vision, Mission, Goals and Objectives",
        position: "Chairman",
        photo: "Elias-Austria.jpg",
        members: [
            { name: "Assoc. Prof. Rizza Valdez De-Vera", position: "Member", photo: null },
            { name: "Inst. Raymond Ruiz", position: "Member", photo: null }
        ],
    },
    {
        name: "Assoc. Prof. Meckmack Nartea",
        role: "Area 2 Faculty - Financial Management",
        position: "Chairman",
        photo: "Meckmack-Nartea.jpg",
        members: [
            { name: "Asst. Prof. Giselle Iveth Samonte", position: "Member", photo: null }
        ],
    },
    {
        name: "Inst. Angeline Pabilona",
        role: "Area 2 Psychology",
        position: "Chairman",
        photo: "Angeline-Pabilona.jpg",
        members: [
            { name: "Asst. Prof. Anna Madonna Arellano", position: "Member", photo: null }
        ],
    },
    {
        name: "Alfred Pagalilawan",
        role: "Area 3 Curriculum and Instruction",
        position: "Chairman",
        photo: "Alfred-Pagalilawan.jpg",
        members: [
            { name: "Assoc. Prof. Mecmack Nartea", position: "Co-chair", photo: null },
            { name: "Asst. Prof. Giselle Iveth Samonte", position: "Member", photo: null }
        ],
    },
    {
        name: "Asst. Prof. Peter Glenn Biason",
        role: "Area 4 Support to Students",
        position: "Chairman",
        photo: "Peter-Glenn-Biason.jpg",
        members: [
            { name: "Asst. Prof. Anna Madonna Arellano", position: "Member", photo: null },
            { name: "Asst. Prof. Giselle Iveth Samonte", position: "Member", photo: null },
            { name: "Mr. Alvin H. Ingreso", position: "Member", photo: null }
        ],
    },
    {
        name: "Inst. Ian J. Saguindan",
        role: "Area 5 Research",
        position: "Chairman",
        photo: "Ian-Saguindan.jpg",
        members: [
            { name: "Dr. Ian I. Llenares", position: "Co-chair", photo: null },
        ],
    },
    {
        name: "Inst. Ronette M. Espiritu",
        role: "Area 6 Extension and Community Involvement",
        position: "Chairman",
        photo: "Ronette-Espiritu.jpg",
        members: [
            { name: "Assoc. Prof. Mecmack Nartea", position: "Member", photo: null },
            { name: "Dr. Ian I. Llenares", position: "Member", photo: null },
            { name: "Asst. Prof. Anna Madonna Arellano", position: "Member", photo: null },
        ],
    },
    {
        name: "Mr. Orlando L. Oliverio Jr.",
        role: "Area 7 Library",
        position: "Chairman",
        photo: "Orlando-Oliverio.jpg",
        members: [
            { name: "Mr. Rafael Malabonga Jr.", position: "Member", photo: null },
        ],
    },
    {
        name: "Inst. Lemuel N. Damole",
        role: "Area 8 Physical Plant and Facilities",
        position: "Chairman",
        photo: "Lemuel-Damole.jpg",
        members: [
            { name: "Asst. Prof. Rogie Delena", position: "Co-chair", photo: null },
            { name: "Asst. Prof. Lourdes R. Dela Cruz", position: "Member", photo: null },
            { name: "Inst. Jaime Delos Santos", position: "Member", photo: null },
            { name: "Mr. Joebert Silao", position: "Member", photo: null },
        ],
    },
    {
        name: "Asst. Prof. Martino Miguel M. Salcedo",
        role: "Area 9 Laboratories",
        position: "Chairman",
        photo: "Martino-Miguel-Salcedo.jpg",
        members: [
            { name: "Inst. Maricar P. Dela Cruz", position: "Co-chair", photo: null },
        ],
    },
    {
        name: "Dr. Cecilia Reyes-Alagon",
        role: "Area 10 Administration",
        position: "Chairman",
        photo: "Cecilia-Reyes-Alagon.jpg",
        members: [
            { name: "Asst. Prof. Rogie Delena", position: "Co-chair - Financial Management", photo: null },
            { name: "Dr. Ian I. Llenares", position: "Co-chair - Psychology", photo: null },
            { name: "Mr. Regie Mijares", position: "Member", photo: null },
            { name: "Ms. Diane Marie Villas", position: "Member", photo: null },
        ],
    },
];

// You can pass real data from Laravel via Inertia later
export default function LocalTaskForce({ faculties = sampleFaculties, admins = [] }: AdfaPageProps) {
    return (
        <>
            <Head title="Local Task Force - PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <Layout>
                <div className="flex flex-col items-center">
                    <PageHeader
                        title="Local Task Force"
                        breadcrumbs={[
                            { label: "Home", href: "/" },
                            { label: "About", href: "/about" },
                            { label: "Local Task Force", href: "/local-task-force" },
                        ]}
                    />

                    <article className="local-task-force-page my-8 w-[75%]">
                        <section className="card-fx mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 duration-300 hover:border-[#7f1414]">
                            <h2 className="mb-4 text-3xl font-bold text-[#7f1414]">
                                Local Task Force
                            </h2>
                            <p className="leading-relaxed text-gray-700">
                                The Local Task Force at PUP San Juan Campus is dedicated to
                                ensuring the safety and well-being of all students, faculty, and
                                staff. Our team works collaboratively with local authorities and
                                community organizations to address any issues that may arise on
                                campus. We are committed to fostering a secure and supportive
                                environment for everyone.
                            </p>
                        </section>

                        <div className="grid gap-5 md:grid-cols-3">
                            {faculties.map((f, index) => (
                                <div
                                    key={index}
                                    // whileHover={{ scale: 1.05 }}
                                    className="rounded-xl border border-[#7f1414]/25 bg-white p-4 text-center hover:border-[#7f1414] transition-all flex items-center flex-col justify-center"
                                >
                                    <img
                                        src={`/images/adfa-new/faculty/${f.photo}`}
                                        alt={f.name}
                                        className="mx-auto mb-3 h-48 w-48 rounded-full object-cover shadow-md"
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/placeholder.png';
                                    }}
                                    />
                                    <h3 className="text-lg font-semibold text-[#7f1414]">
                                        {f.name}
                                    </h3>
                                    <p className="font-bold text-sm">{f.position}</p>
                                    <p className="text-gray-600 text-sm">{f.role}</p>
                                    {f.members && f.members.length > 0 && (() => {
                                        // Pre-filter roles
                                        const coChairs = f.members.filter((member) =>
                                            member.position?.toLowerCase().includes('co-chair')
                                        );
                                        const members = f.members.filter((member) =>
                                            member.position?.toLowerCase().includes('member')
                                        );

                                        return (
                                            <div className="mt-2 text-left">
                                                {coChairs.length > 0 && (
                                                    <>
                                                        <h4 className="font-semibold text-center text-gray-800 text-sm">Co-chair</h4>
                                                        <ul className="text-center text-sm">
                                                            {coChairs.map((member, memberIndex) => (
                                                                <li key={memberIndex} className="text-gray-600 text-sm">
                                                                    {member.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}

                                                {members.length > 0 && (
                                                    <>
                                                        <h4 className="font-semibold text-center text-gray-800 text-sm mt-2">Members</h4>
                                                        <ul className="text-center text-sm">
                                                            {members.map((member, memberIndex) => (
                                                                <li key={memberIndex} className="text-gray-600 text-sm">
                                                                    {member.name}
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
                    </article>
                </div>
            </Layout>
        </>
    );
}
