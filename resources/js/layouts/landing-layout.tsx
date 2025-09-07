import { cn } from '@/lib/utils';
import type { GuestNavigation } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ExternalLink, Facebook, GraduationCap, Home, Mail } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface LayoutProps {
    children: ReactNode;
    footerText?: string;
}

const leftNav = [
    {
        label: 'ABOUT',
        href: '/about',
        dropdown: [
            { label: 'Vision, Mission, and Goals', href: '/about/vision-mission-goals' },
            { label: 'History', href: '/about/history' },
            { label: 'Administration', href: '/about/administration' },
            { label: 'Facilities', href: '/about/facilities' },
            { label: 'Faculty and Staff', href: '/about/faculty-and-staff' },
            { label: 'Local Task Force', href: '/about/local-task-force' },
        ],
    },
    {
        label: 'CERTIFICATE OF AUTHENTICITY',
        href: '/certificate', //'/certificate',
        dropdown: [],
    },
];

function isActive(path: string) {
    return window.location.pathname.startsWith(path);
}

export default function Layout({ children, footerText }: LayoutProps) {
    const { guest } = usePage<GuestNavigation>().props;

    const underSurveyPrograms = (guest as any)?.programs?.length
        ? (guest as any).programs.map((program: any) => ({
              label: program.program_name,
              href: `/programs/${program.program_link}`,
          }))
        : [];

    const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Search handler
    const handleSearch = (term: string) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        const searchTerm = term.toLowerCase();

        const results: any[] =
            (guest as any)?.outlines
                ?.filter((outline: any) => {
                    // Search in multiple fields
                    return (
                        outline.outline_description?.toLowerCase().includes(searchTerm) ||
                        outline.area_parameters?.parameter_name?.toLowerCase().includes(searchTerm) ||
                        outline.area_parameters?.area?.area_name?.toLowerCase().includes(searchTerm) ||
                        outline.area_parameters?.area?.program?.program_name?.toLowerCase().includes(searchTerm)
                    );
                })
                ?.map((outline: any) => ({
                    outline: outline.outline_description,
                    outlineId: outline.parameter_outline_id,
                    program: outline.area_parameters?.area?.program?.program_name,
                    area: outline.area_parameters?.area?.area_name,
                    parameter: outline.area_parameters?.parameter_name,
                })) || [];

        setSearchResults(results);
    };

    // Add debouncing to prevent excessive searches
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                handleSearch(searchTerm);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header
                className={cn(
                    'sticky top-0 z-50 bg-transparent shadow-sm transition-transform duration-400',
                    scrollDir === 'down' ? '-translate-y-full' : 'translate-y-0',
                )}
            >
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
                                        {item.dropdown.map((drop: any) => (
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

                {/* Search Button */}
                <button
                    className="absolute top-[0.5vw] right-[3vw] flex cursor-pointer items-center gap-2 rounded px-3 py-1"
                    onClick={() => setSearchOpen(true)}
                    title="Search Outlines"
                >
                    <svg className="h-8 w-8 text-[#7f1414] hover:scale-110" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </header>

            {/* Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
                    <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-[#7f1414]"
                            onClick={() => {
                                setSearchOpen(false);
                                setSearchTerm('');
                                setSearchResults([]);
                            }}
                            aria-label="Close"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <h2 className="mb-4 text-xl font-bold text-[#7f1414]">Search</h2>
                        <div className="mb-4">
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full rounded border border-gray-300 p-2 text-sm focus:border-[#7f1414] focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                placeholder="Search outlines, parameters, and programs..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto">
                            {searchTerm ? (
                                searchResults.length === 0 ? (
                                    <p className="text-center text-gray-500">No results found for "{searchTerm}"</p>
                                ) : (
                                    <ul className="space-y-4">
                                        {searchResults.map((result, idx) => {
                                            const regex = new RegExp(`(${searchTerm})`, 'gi');

                                            // Highlight matches in all fields
                                            const highlightedProgram =
                                                result.program?.replace(regex, '<mark class="bg-yellow-200">$1</mark>') || result.program;
                                            const highlightedArea =
                                                result.area?.replace(regex, '<mark class="bg-yellow-200">$1</mark>') || result.area;
                                            const highlightedParameter =
                                                result.parameter?.replace(regex, '<mark class="bg-yellow-200">$1</mark>') || result.parameter;
                                            const highlightedOutline =
                                                result.outline?.replace(regex, '<mark class="bg-yellow-200">$1</mark>') || result.outline;

                                            return (
                                                <li key={idx} className="border-b pb-2">
                                                    <div
                                                        className="mb-1 text-xs text-gray-500"
                                                        dangerouslySetInnerHTML={{
                                                            __html: `${highlightedProgram} &rarr; ${highlightedArea} &rarr; ${highlightedParameter}`,
                                                        }}
                                                    />
                                                    <div
                                                        className="text-sm"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightedOutline,
                                                        }}
                                                    />
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )
                            ) : (
                                <p className="text-center text-gray-500">Start typing to search</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="flex-1 pb-15">{children}</main>

            <footer className="relative min-h-[500px] bg-[#7f1414] text-white">
                {/* Background image with gradient overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{ backgroundImage: "url('/images/homepage-slides/3.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#7f1414]/90 via-[#7f1414]/70 to-[#7f1414]/80"></div>

                {/* Container that fills the footer height */}
                <div className="relative z-10 mx-auto flex h-full w-[90%] max-w-7xl flex-col items-center justify-center space-y-4">
                    {/* Main content */}
                    <div className="grid w-full grid-cols-1 gap-12 text-center md:grid-cols-2 lg:grid-cols-4 lg:text-left">
                        {/* Logo & Tagline */}
                        <div className="space-y-4">
                            <img src="/images/pupcon-logo-white.png" alt="PUP Logo" className="mx-auto w-28 lg:mx-0" />
                            <h2 className="text-lg leading-snug font-bold">Polytechnic University of the Philippines - San Juan</h2>
                            <p className="text-sm italic opacity-90">The Country’s 1st Polytechnic University</p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="https://pupsinta.freshservice.com/support/home"
                                        className="flex items-center gap-2 transition hover:text-yellow-300"
                                    >
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

                        {/* Portals */}
                        <div>
                            <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Portals</h3>
                            <ul className="space-y-3">
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
                                    <a href="/login" className="flex items-center gap-2 transition hover:text-yellow-300">
                                        <Home className="h-4 w-4" /> PUPCON Login
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Socials */}
                        <div>
                            <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Socials</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="https://www.facebook.com/profile.php?id=100064299686924"
                                        className="flex items-center gap-2 transition hover:text-yellow-300"
                                    >
                                        <Facebook className="h-4 w-4" /> PUPSJ Facebook
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.facebook.com/ThePUPOfficial"
                                        className="flex items-center gap-2 transition hover:text-yellow-300"
                                    >
                                        <Facebook className="h-4 w-4" /> PUP Sta. Mesa Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="/" className="flex items-center gap-2 transition hover:text-yellow-300">
                                        <Home className="h-4 w-4" /> Go to Home Page
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="w-full pt-2 text-center text-sm opacity-80 mt-5">
                        © {new Date().getFullYear()} Maharlika Technologies. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
