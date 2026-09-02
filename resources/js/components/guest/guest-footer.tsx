"use client";

import type { User } from "@/types";
import { Link } from "@inertiajs/react";
import { 
    Facebook, 
    Mail, 
    ExternalLink, 
    BookOpen, 
    GraduationCap, 
    Home, 
    LogOut 
} from "lucide-react";

interface GuestFooterProps {
    user: User;
    cleanup: () => void;
    route: typeof route;
}

export default function GuestFooter({ user, cleanup, route }: GuestFooterProps) {
    return (
        <footer className="relative min-h-[500px] bg-[#7f1414] py-10 pt-20 text-white lg:pt-0">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-25"
                style={{ backgroundImage: "url('/images/homepage-slides/3.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#7f1414]/90 via-[#7f1414]/70 to-[#7f1414]/80" />

            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center space-y-4">
                <div className="grid w-full grid-cols-1 gap-12 text-center md:grid-cols-2 lg:grid-cols-4 lg:text-left">
                    <div className="space-y-4">
                        <img src="/images/pupcon-logo-white.png" alt="PUP Logo" className="mx-auto w-28 lg:mx-0" />
                        <h2 className="text-lg leading-snug font-bold">Polytechnic University of the Philippines - San Juan</h2>
                        <p className="text-sm italic opacity-90">The Country's 1st Polytechnic University</p>
                    </div>

                    <div>
                        <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Quick Links</h3>
                        <ul className="flex flex-col items-center space-y-3 lg:items-start">
                            <li>
                                <a href="https://pupsinta.freshservice.com/support/home" className="flex items-center gap-2 transition hover:text-yellow-300">
                                    <Mail className="h-4 w-4" /> PUP SINTA
                                </a>
                            </li>
                            <li>
                                <a href="https://outlook.office.com/" className="flex items-center gap-2 transition hover:text-yellow-300">
                                    <ExternalLink className="h-4 w-4" /> PUP WebMail
                                </a>
                            </li>
                            <li>
                                <a href="https://www.pup.edu.ph/iapply/" className="flex items-center gap-2 transition hover:text-yellow-300">
                                    <BookOpen className="h-4 w-4" /> PUP iApply
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Portals</h3>
                        <ul className="flex flex-col items-center space-y-3 lg:items-start">
                            <li>
                                <a href="https://sis1.pup.edu.ph/student/" className="flex items-center gap-2 transition hover:text-yellow-300">
                                    <GraduationCap className="h-4 w-4" /> SIS for Students
                                </a>
                            </li>
                            <li>
                                <a href="https://sis2.pup.edu.ph/faculty/" className="flex items-center gap-2 transition hover:text-yellow-300">
                                    <BookOpen className="h-4 w-4" /> SIS for Faculty
                                </a>
                            </li>
                            <li>
                                <a href="https://sis8.pup.edu.ph/" className="flex items-center gap-2 transition hover:text-yellow-300">
                                    <ExternalLink className="h-4 w-4" /> PUPSIS
                                </a>
                            </li>
                            <li>
                                {user?.roles?.role_name === 'Accreditor' ? (
                                    <Link href={route('logout')} className="flex items-center gap-2 transition hover:text-yellow-300" method="post" onClick={cleanup}>
                                        <LogOut className="h-4 w-4" /> Log out
                                    </Link>
                                ) : (
                                    <Link href="/login" className="hidden items-center gap-2 transition hover:text-yellow-300 lg:flex" preserveScroll>
                                        <Home className="h-4 w-4" /> PUPCON Login
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Socials</h3>
                        <ul className="flex flex-col items-center space-y-3 lg:items-start">
                            <li>
                                <a href="https://www.facebook.com/profile.php?id=100064299686924" className="flex items-center gap-2 transition hover:text-yellow-300">
                                    <Facebook className="h-4 w-4" /> PUPSJ Facebook
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/ThePUPOfficial" className="flex items-center gap-2 transition hover:text-yellow-300">
                                    <Facebook className="h-4 w-4" /> PUP Sta. Mesa Facebook
                                </a>
                            </li>
                            <li>
                                <a href="/" className="flex items-center gap-2 transition hover:text-yellow-300" preserveScroll>
                                    <Home className="h-4 w-4" /> Go to Home Page
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-5 w-full pt-2 text-center text-sm opacity-80">
                    © {new Date().getFullYear()} Maharlika Technologies. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}
