import { cn } from '@/lib/utils';
import type { GuestNavigation } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building, ExternalLink, Facebook, GraduationCap, History, Home, Info, Mail, ShieldCheck, Users } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface LayoutProps {
    children: ReactNode;
    footerText?: string;
}

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

    const leftNav = [
        {
            label: 'About',
            href: '/about',
            dropdown: [
                { label: 'Vision, Mission, and Goals', href: '/about/vision-mission-goals', icon: <Info size={18} /> },
                { label: 'History', href: '/about/history', icon: <History size={18} /> },
                { label: 'Administration', href: '/about/administration', icon: <Users size={18} /> },
                { label: 'Facilities', href: '/about/facilities', icon: <Building size={18} /> },
                { label: 'Faculty and Staff', href: '/about/faculty-and-staff', icon: <GraduationCap size={18} /> },
                { label: 'Local Task Force', href: '/about/local-task-force', icon: <ShieldCheck size={18} /> },
            ],
        },
        {
            label: 'Authenticity',
            href: '/certificate',
            dropdown: [], // no dropdown, so no icon needed
        },
    ];

    const rightNav = [
        {
            label: 'Programs',
            href: '/programs',
            // if underSurveyPrograms is an array of {label,href}, you can map & attach icons like:
            dropdown: underSurveyPrograms.map((p) => ({
                ...p,
                icon: <BookOpen size={18} />,
            })),
        },
        {
            label: 'Exhibits',
            href: '/exhibits',
            dropdown: [], // no dropdown here either
        },
        {
            label: 'Others',
            href: '/others',
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

    const searchRef = useRef<HTMLDivElement>(null);

    // close when clicking outside or pressing Esc
    useEffect(() => {
        if (!searchOpen) return;

        function handleClick(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        }
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') setSearchOpen(false);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [searchOpen]);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header
                className={cn(
                    'sticky top-0 z-50 bg-gradient-to-r from-[#7f1414] to-[#a71d1d] shadow-md backdrop-blur-sm transition-transform duration-400',
                    scrollDir === 'down' ? '-translate-y-full' : 'translate-y-0',
                )}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center">
                        <div className="h-10 w-auto overflow-hidden">
                            <img src="/images/pupsjlogo-text.png" alt="Logo" className="h-full w-full object-cover" draggable={false} />
                        </div>
                    </Link>

                    {/* Center: Navigation */}
                    <nav>
                        <ul className="flex gap-8 text-sm font-medium tracking-wide text-white/90">
                            {[...leftNav, ...rightNav].map((item) => (
                                <li key={item.label} className="group relative">
                                    {/* Main Link with animated underline */}
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'relative px-3 py-2 transition-colors duration-1000',
                                            isActive(item.href) && 'text-white',
                                            'hover:text-white',
                                        )}
                                    >
                                        {item.label}
                                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                                    </Link>

                                    {/* Dropdown Drawer */}
                                    {item.dropdown?.length > 0 && (
                                        <div className="absolute left-0 mt-7 max-h-0 w-auto overflow-hidden rounded-md bg-white text-sm opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:max-h-96 group-hover:opacity-100">
                                            <ul className="flex flex-col">
                                                {item.dropdown.map((drop) => (
                                                    <li key={drop.label} className="border-b border-gray-100 last:border-none">
                                                        <Link
                                                            href={drop.href}
                                                            className="flex items-center gap-2 px-4 py-3 text-[#7f1414] transition-colors hover:bg-[#7f1414] hover:text-white"
                                                        >
                                                            {drop.icon && <span className="flex-shrink-0 text-lg">{drop.icon}</span>}
                                                            <span>{drop.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Right: Search Button */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="relative flex items-center justify-center rounded-full bg-white/10 p-2 text-white ring-1 ring-white/20 transition-all duration-200 hover:bg-white/20 hover:ring-white/40 focus:ring-2 focus:ring-white/60 focus:outline-none"
                        title="Search"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                </div>

                {/* Slide-down Search Panel */}
                <div
                    className={cn(
                        'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
                        searchOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                    )}
                    onClick={() => setSearchOpen(false)}
                />
            </header>

            {/* Backdrop with blur */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300',
                    searchOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                onClick={() => setSearchOpen(false)}
            />

            {/* Sidebar panel */}
            <aside
                className={cn(
                    'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl',
                    'transform transition-transform duration-300 ease-in-out',
                    searchOpen ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-[#7f1414]">Looking for something?</h2>
                    <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-[#7f1414]" aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* Input */}
                <div className="p-6">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search outlines, parameters, programs..."
                        className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-[#7f1414] focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Results */}
                <div className="max-h-[calc(100%-140px)] overflow-y-auto px-6 pb-6">
                    {searchTerm ? (
                        searchResults.length === 0 ? (
                            <p className="text-center text-gray-500">No results for “{searchTerm}”</p>
                        ) : (
                            <ul className="space-y-4">
                                {searchResults.map((r, i) => (
                                    <li key={i} className="border-b pb-2 text-sm">
                                        <span className="block text-gray-600">
                                            {r.program} → {r.area} → {r.parameter}
                                        </span>
                                        <span className="block">{r.outline}</span>
                                    </li>
                                ))}
                            </ul>
                        )
                    ) : (
                        <p className="text-center text-gray-400">Start typing to search</p>
                    )}
                </div>
            </aside>

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
                    <div className="mt-5 w-full pt-2 text-center text-sm opacity-80">
                        © {new Date().getFullYear()} Maharlika Technologies. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
