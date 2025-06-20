import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Layout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';

export default function Programs() {
    return (
        <>
            <Head title="Exhibits">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className="flex flex-col items-center gap-8">
                    <div className="relative z-10 mt-7 flex h-[10vw] w-[75%] items-center justify-center overflow-hidden rounded-xl">
                        <img src="/images/campus/ground.jpg" alt="Programs Banner" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#7f1414] via-[#7f1414]/70 to-transparent"></div>
                        <div className="relative z-10 px-8 text-center text-white">
                            <h1 className="text-6xl font-bold">Exhibits</h1>
                            <h2 className="mt-2">
                                Polytechnic University of the Philippines <b>San Juan Campus</b>
                            </h2>
                        </div>
                    </div>{' '}
                    <div className="grid w-[75%] grid-cols-4 gap-2">
                        <div className="group overflow-hidden rounded-xl border border-[#7f1414]/25 bg-white duration-300 hover:border-[#7f1414]">
                            <div className="grid place-items-center bg-[linear-gradient(120deg,#7f1414_0%,#c12c2c_100%)]">
                                <img
                                    className="my-5 h-40 transition duration-300 group-hover:scale-110"
                                    src="/images/exhibits/student-handbook.png"
                                    alt="Student Handbook"
                                />
                            </div>
                            <div className="rounded-b-xl p-6">
                                <h1 className="mb-2 text-xl font-bold text-[#7f1414] group-hover:text-[#a01818]">Student Handbook</h1>
                                <p> Click to explore this interactive exhibit and discover its contents. </p>
                                <div className="flex justify-end">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="mt-10 w-30 cursor-pointer rounded-full border-none bg-[linear-gradient(130deg,#7f1414_0%,#c12c2c_50%,#7f1414_100%)] bg-[length:200%_200%] font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-left hover:text-white">
                                                View
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    ></path>
                                                </svg>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Student Handbook</DialogTitle>
                                                <DialogDescription>none</DialogDescription>
                                            </DialogHeader>
                                            {/* content */}
                                            <div></div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
