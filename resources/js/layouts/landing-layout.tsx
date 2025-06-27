import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import type { GuestNavigation } from '@/types';

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
            href: `/programs/${program.program_name}`,
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

        const results: any[] = (guest as any)?.outlines
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
                    className="absolute right-[3vw] top-[0.5vw] flex items-center gap-2 rounded px-3 py-1 cursor-pointer"
                    onClick={() => setSearchOpen(true)}
                    title="Search Outlines"
                >
                    <svg className="w-8 h-8 text-[#7f1414] hover:scale-110" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </header>

            {/* Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-[#7f1414]"
                            onClick={() => {
                                setSearchOpen(false);
                                setSearchTerm('');
                                setSearchResults([]);
                            }}
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-[#7f1414]">Search Outlines</h2>
                        <div className="mb-4">
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full rounded border border-gray-300 p-2 text-sm focus:border-[#7f1414] focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                placeholder="Search outlines..."
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
                                    <p className="text-gray-500 text-center">No results found for "{searchTerm}"</p>
                                ) : (
                                    <ul className="space-y-4">
                                        {searchResults.map((result, idx) => {
                                            const regex = new RegExp(`(${searchTerm})`, 'gi');

                                            // Highlight matches in all fields
                                            const highlightedProgram = result.program?.replace(regex, '<mark class="bg-yellow-200">$1</mark>') || result.program;
                                            const highlightedArea = result.area?.replace(regex, '<mark class="bg-yellow-200">$1</mark>') || result.area;
                                            const highlightedParameter = result.parameter?.replace(regex, '<mark class="bg-yellow-200">$1</mark>') || result.parameter;
                                            const highlightedOutline = result.outline?.replace(regex, '<mark class="bg-yellow-200">$1</mark>') || result.outline;

                                            return (
                                                <li key={idx} className="border-b pb-2">
                                                    <div
                                                        className="text-xs text-gray-500 mb-1"
                                                        dangerouslySetInnerHTML={{
                                                            __html: `${highlightedProgram} &rarr; ${highlightedArea} &rarr; ${highlightedParameter}`
                                                        }}
                                                    />
                                                    <div
                                                        className="text-sm"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightedOutline
                                                        }}
                                                    />
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )
                            ) : (
                                <p className="text-gray-500 text-center">Start typing to search outlines</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="flex-1 pb-15">{children}</main>

            {/* Footer */}
            <footer className="text-center">
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
                        <li>
                            <Link href="/login" target="_blank">
                                PUPCON Login
                            </Link>
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
