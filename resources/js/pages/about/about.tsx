import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';

export default function About() {
    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center">
                    {/* Header Banner Section */}
                    <div className="relative z-10 mt-7 flex h-[10vw] w-[75%] items-center justify-center overflow-hidden rounded-xl">
                        <img
                            src="/images/campus/ground.jpg"
                            alt="About PUP San Juan Banner"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#7f1414] via-[#7f1414]/70 to-transparent"></div>
                        <div className="relative z-10 px-8 text-center text-white">
                            <h1 className="text-6xl font-bold">About</h1>
                            <h2 className="mt-2">
                                Polytechnic University of the Philippines <b>San Juan Campus</b>
                            </h2>
                        </div>
                    </div>

                    {/* Main Content Area with Sidebar */}
                    <div className="mt-8 flex w-[75%] gap-8">
                        {/* Navigation Buttons Section (Sidebar) */}
                        <aside className="w-1/4">
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/about/vision-mission-goals"
                                    className="rounded-lg bg-[#7f1414] px-6 py-3 text-center text-white transition-all duration-300 hover:bg-[#a01818]"
                                >
                                    Vision, Mission, and Goals
                                </Link>
                                <Link
                                    href="/about/history"
                                    className="rounded-lg bg-[#7f1414] px-6 py-3 text-center text-white transition-all duration-300 hover:bg-[#a01818]"
                                >
                                    History
                                </Link>
                                <Link
                                    href="/about/administration"
                                    className="rounded-lg bg-[#7f1414] px-6 py-3 text-center text-white transition-all duration-300 hover:bg-[#a01818]"
                                >
                                    Administration
                                </Link>
                                <Link
                                    href="/about/facilities"
                                    className="rounded-lg bg-[#7f1414] px-6 py-3 text-center text-white transition-all duration-300 hover:bg-[#a01818]"
                                >
                                    Facilities
                                </Link>
                                <Link
                                    href="/about/faculty-and-staff"
                                    className="rounded-lg bg-[#7f1414] px-6 py-3 text-center text-white transition-all duration-300 hover:bg-[#a01818]"
                                >
                                    Faculty and Staff
                                </Link>
                                <Link
                                    href="/about/local-task-force"
                                    className="rounded-lg bg-[#7f1414] px-6 py-3 text-center text-white transition-all duration-300 hover:bg-[#a01818]"
                                >
                                    Local Task Force
                                </Link>
                            </div>
                        </aside>

                        {/* Main Content Description */}
                        <article className="about-page w-full">
                            <section className="card-fx rounded-xl border duration-300 border-[#7f1414]/25 hover:border-[#7f1414] bg-white p-8" id="about-desc">
                                <p className="leading-relaxed text-gray-700">
                                    Despite its proximity to the Manila Main Campus, the Polytechnic University of the Philippines – San Juan City
                                    Campus which started as a locally funded campus by the City Government of San Juan established in 2008 by Mayor
                                    Joseph Victor "JV" G. Ejercito, is now a viable institution by virtue of Republic Act 11348. This is one of its
                                    many firsts as it officially becomes an integral part of the University system in terms of funding source and is
                                    continuously growing and developing as a higher learning institution.
                                    <br />
                                    <br />
                                    To wit, PUP San Juan City Branch offers various academic programs such as Bachelor of Science in Accountancy,
                                    Bachelor of Science in Business Administration major in Financial Management, Bachelor of Science in
                                    Entrepreneurship, Bachelor of Secondary Education major in English, Bachelor of Science in Hospitality Management,
                                    Bachelor of Science in Information Technology and Bachelor of Science in Psychology.
                                    <br />
                                    <br />
                                    To this day, it thrives to become the <strong>Tanglaw ng Bayan sa Dambana ng Kagitingan!</strong>
                                </p>
                            </section>
                        </article>
                    </div>
                </div>
            </Layout>
        </>
    );
}
