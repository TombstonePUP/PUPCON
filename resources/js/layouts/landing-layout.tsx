import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
    children: ReactNode;
    footerText?: string;
}

const LEFT_NAV = [
    {
        label: 'ABOUT',
        href: '/about',
        dropdown: [
            { label: 'Vision, Mission, and Goals', href: '/about/vision-mission-goals' },
            { label: 'History', href: '/about/history' },
            { label: 'Administration', href: '/about/administration' },
            { label: 'Facilities', href: '/about/facilities' },
            { label: 'Faculty and Staff', href: '/about/faculty-staff' },
            { label: 'Local Task Force', href: '/about/local-task-force' },
        ],
    },
    {
        label: 'CERTIFICATE OF AUTHENTICITY',
        href: '/certificate',
        dropdown: [],
    },
];

const RIGHT_NAV = [
    {
        label: 'PROGRAMS',
        href: '/programs',
        dropdown: [], // fill if needed
    },
    {
        label: 'EXHIBITS',
        href: '/exhibits',
        dropdown: [],
    },
    {
        label: 'OTHERS',
        href: '/others',
        dropdown: [],
    },
];

function isActive(path: string) {
    return window.location.pathname.startsWith(path);
}

export default function Layout({ children }: LayoutProps) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-transparent shadow-sm">
                {/* Badge */}
                <div className="flex min-w-full h-[3vw] bg-[#630101] items-center justify-center relative opacity-85">
                </div>
                <Link href="/" className="absolute top-[-0.5vw] w-screen grid place-items-center">
                    <img
                        className="w-[18vw] object-contain"
                        src="/images/badge.png"
                        alt="badge"
                        draggable={false}
                    />
                </Link>
                {/* Navigation */}
                <div className="flex justify-between px-[15vw] py-[0.8vw] text-[#7f1414] bg-white">
                    {/* Left */}
                    <ul className="flex gap-[6vw]">
                        {LEFT_NAV.map((item) => (
                            <li key={item.label} className="relative group">
                                <Link
                                    href={item.href}
                                    className={cn('text-[#7f1414]', isActive(item.href) && 'active')}
                                >
                                    {item.label}
                                </Link>

                                {item.dropdown.length > 0 && (
                                    <div className="dropdown-content absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md mt-2 p-2 text-sm">
                                        {item.dropdown.map((drop) => (
                                            <Link key={drop.label} className="text-[#7f1414] whitespace-nowrap" href={drop.href}>
                                                {drop.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Right */}
                    <ul className="flex gap-[6vw]">
                        {RIGHT_NAV.map((item) => (
                            <li key={item.label} className="relative group">
                                <Link
                                    href={item.href}
                                    className={cn('text-[#7f1414] whitespace-nowrap', isActive(item.href) && 'active')}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>


            {/* Main */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="w-full bg-gray-800 text-gray-300 text-center py-6 mt-10">
                <div className="footer1">
                    <img src="images/pupcon-logo-white.png" alt="Logo" />
                    <h2>Maharlika Technologies</h2>
                </div>
                <div className="footer2">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="https://pupsinta.freshservice.com/support/home" target="_blank">PUP SINTA</a></li>
                        <li><a href="https://outlook.office.com/" target="_blank">PUP WebMail</a></li>
                        <li><a href="https://www.pup.edu.ph/iapply/" target="_blank">PUP iApply</a></li>
                    </ul>
                </div>
                <div className="footer3">
                    <h3>Portals</h3>
                    <ul>
                        <li><a href="https://sis1.pup.edu.ph/student/" target="_blank">SIS for Students</a></li>
                        <li><a href="https://sis2.pup.edu.ph/faculty/" target="_blank">SIS for Faculty</a></li>
                        <li><a href="https://sis8.pup.edu.ph/" target="_blank">PUPSIS</a></li>
                    </ul>
                </div>
                <div className="footer4">
                    <h3>Socials</h3>
                    <ul>
                        <li><a href="https://www.facebook.com/profile.php?id=100064299686924" target="_blank">PUPSJ Facebook</a></li>
                        <li><a href="https://www.facebook.com/ThePUPOfficial" target="_blank">PUP Sta. Mesa Facebook</a></li>
                        <li><a href="/">Go to Home Page</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}
