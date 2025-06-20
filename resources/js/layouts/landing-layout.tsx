import { cn } from '@/lib/utils';
import { GuestNavigation } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';

interface LayoutProps {
    children: ReactNode;
    footerText?: string;
}

const leftNav = [
    {
        label: 'ABOUT',
        href: '/', //'/about',
        dropdown: [
            // { label: 'Vision, Mission, and Goals', href: '/about/vision-mission-goals' },
            // { label: 'History', href: '/about/history' },
            // { label: 'Administration', href: '/about/administration' },
            // { label: 'Facilities', href: '/about/facilities' },
            // { label: 'Faculty and Staff', href: '/about/faculty-staff' },
            // { label: 'Local Task Force', href: '/about/local-task-force' },
        ],
    },
    {
        label: 'CERTIFICATE OF AUTHENTICITY',
        href: '/', //'/certificate',
        dropdown: [],
    },
];

function isActive(path: string) {
    return window.location.pathname.startsWith(path);
}

export default function Layout({ children }: LayoutProps) {
    const { guest } = usePage<GuestNavigation>().props;

    const underSurveyPrograms = guest?.programs?.length
        ? guest.programs.map((program) => ({
              label: program.program_name,
              href: `/programs/${program.program_name}`,
          }))
        : [];

    const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDir = () => {
            const currentScrollY = window.scrollY;
            if (Math.abs(currentScrollY - lastScrollY) > 10) {
                setScrollDir(currentScrollY > lastScrollY ? 'down' : 'up');
                lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
            }
        };

        window.addEventListener('scroll', updateScrollDir);
        return () => window.removeEventListener('scroll', updateScrollDir);
    }, []);

    const rightNav = [
        {
            label: 'PROGRAMS',
            href: '/programs',
            dropdown: underSurveyPrograms,
        },
        {
            label: 'EXHIBITS',
            href: '/exhibits',
            dropdown: [],
        },
        {
            label: 'OTHERS',
            href: '/', //'/others',
            dropdown: [],
        },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header
                className={cn(
                    'sticky top-0 z-50 bg-transparent shadow-sm transition-transform duration-400',
                    scrollDir === 'down' ? '-translate-y-full' : 'translate-y-0',
                )}
            >
                {' '}
                {/* Badge */}
                <div className="relative flex h-[3vw] min-w-full items-center justify-center bg-[#630101] opacity-85"></div>
                <Link href="/" className="absolute top-[-0.5vw] grid w-screen place-items-center">
                    <img className="w-[17.8vw] object-contain" src="/images/badge.png" alt="badge" draggable={false} />
                </Link>
                {/* Navigation */}
                <div className="flex justify-between bg-white px-[13vw] py-[0.8vw] text-[#7f1414]">
                    {/* Left */}
                    <ul className="flex gap-[4vw]">
                        {leftNav.map((item) => (
                            <li key={item.label} className="group relative">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'rounded-[1vw] px-[1vw] py-[0.55vw] text-[#7f1414] transition-all duration-200',
                                        isActive(item.href) && 'active',
                                        'hover:bg-[#7f1414] hover:text-white',
                                    )}
                                >
                                    {item.label}
                                </Link>

                                {item.dropdown.length > 0 && (
                                    <div className="border-radius-[1vw] absolute mt-[0.5vw] hidden flex-col overflow-hidden rounded-md bg-white text-sm shadow-lg group-hover:flex">
                                        {item.dropdown.map((drop) => (
                                            <Link
                                                key={drop.label}
                                                href={drop.href}
                                                className="relative z-10 inline-block overflow-hidden p-[0.8vw] text-[0.8vw] whitespace-nowrap text-[#7f1414] before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#7f1414] before:transition-transform before:duration-300 hover:text-white hover:before:scale-x-100"
                                            >
                                                <span className="relative z-20">{drop.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Right */}
                    <ul className="flex gap-[4vw]">
                        {rightNav.map((item) => (
                            <li key={item.label} className="group relative">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'rounded-[1vw] px-[1vw] py-[0.55vw] whitespace-nowrap text-[#7f1414] transition-all duration-200',
                                        isActive(item.href) && 'active',
                                        'hover:bg-[#7f1414] hover:text-white',
                                    )}
                                >
                                    {item.label}
                                </Link>

                                {item.dropdown.length > 0 && (
                                    <div className="border-radius-[1vw] absolute mt-[0.5vw] hidden flex-col overflow-hidden rounded-md bg-white text-sm shadow-lg group-hover:flex">
                                        {item.dropdown.map((drop) => (
                                            <Link
                                                key={drop.label}
                                                href={drop.href}
                                                className="relative z-10 inline-block overflow-hidden p-[0.8vw] text-[0.8vw] whitespace-nowrap text-[#7f1414] before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#7f1414] before:transition-transform before:duration-300 hover:text-white hover:before:scale-x-100"
                                            >
                                                <span className="relative z-20">{drop.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="mt-10 w-full bg-gray-800 py-6 text-center text-gray-300">
                <div className="footer1">
                    <img src="/images/pupcon-logo-white.png" alt="Logo" />
                    <h2>Maharlika Technologies</h2>
                </div>
                <div className="footer2">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>
                            <a href="https://pupsinta.freshservice.com/support/home" target="_blank">
                                PUP SINTA
                            </a>
                        </li>
                        <li>
                            <a href="https://outlook.office.com/" target="_blank">
                                PUP WebMail
                            </a>
                        </li>
                        <li>
                            <a href="https://www.pup.edu.ph/iapply/" target="_blank">
                                PUP iApply
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer3">
                    <h3>Portals</h3>
                    <ul>
                        <li>
                            <a href="https://sis1.pup.edu.ph/student/" target="_blank">
                                SIS for Students
                            </a>
                        </li>
                        <li>
                            <a href="https://sis2.pup.edu.ph/faculty/" target="_blank">
                                SIS for Faculty
                            </a>
                        </li>
                        <li>
                            <a href="https://sis8.pup.edu.ph/" target="_blank">
                                PUPSIS
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer4">
                    <h3>Socials</h3>
                    <ul>
                        <li>
                            <a href="https://www.facebook.com/profile.php?id=100064299686924" target="_blank">
                                PUPSJ Facebook
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/ThePUPOfficial" target="_blank">
                                PUP Sta. Mesa Facebook
                            </a>
                        </li>
                        <li>
                            <a href="/">Go to Home Page</a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}
