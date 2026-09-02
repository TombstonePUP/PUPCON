'use client';

import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronDown, LogOut, Menu, Search, X } from 'lucide-react';

interface GuestNavItem {
    label: string;
    href: string;
    dropdown?: { label: string; href: string }[];
}

interface GuestHeaderProps {
    scrollDir: 'up' | 'down';
    setSearchOpen: (open: boolean) => void;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
    leftNav: GuestNavItem[];
    rightNav: GuestNavItem[];
    isActive: (path: string) => boolean;
    user: User;
    cleanup: () => void;
    route: typeof route;
}

export default function GuestHeader({
    scrollDir,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    leftNav,
    rightNav,
    isActive,
    user,
    cleanup,
    route,
}: GuestHeaderProps) {
    return (
        <motion.header
            className={cn(
                'sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#7f1414] to-[#a71d1d] shadow-md backdrop-blur-sm',
            )}
            animate={{ y: scrollDir === 'down' ? '-100%' : '0%' }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
        >
            <Link href="/" className="flex items-center" preserveScroll>
                <div className="h-[14vw] w-[85vw] rounded-br-full bg-[#d2b539] lg:h-[4vw] lg:w-[38vw]">
                    <div className="mr-3 ml-3 flex h-full items-center gap-4 rounded-br-full bg-white pb-2 pl-5 lg:justify-end lg:pr-20">
                        <img className="mt-1 size-[10vw] lg:size-[2.9vw]" src="/images/pupsj-logo.png" alt="pupsj logo" />
                        <div>
                            <h1 className="text-[4vw] font-bold text-[#7f1414] lg:text-[1.4vw]">San Juan Campus</h1>
                            <p className="mt-[-6px] text-[2.5vw] text-black lg:text-[0.75vw]">Polytechnic University of the Philippines</p>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="relative mr-[10vw] flex items-center gap-8">
                {/* Desktop Navigation */}
                <nav className="hidden lg:block">
                    <ul className="flex gap-8 text-sm font-medium tracking-wide text-white/90">
                        {[...leftNav, ...rightNav].map((item) => (
                            <li key={item.label} className="group relative">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'relative flex items-center gap-1 px-3 py-2 text-sm transition-colors duration-300 hover:text-white',
                                        isActive(item.href) && 'text-white',
                                    )}
                                    preserveScroll
                                >
                                    {item.label}
                                    {item.dropdown && item.dropdown.length > 0 && (
                                        <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
                                    )}
                                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                                </Link>

                                {item.dropdown && item.dropdown.length > 0 && (
                                    <div className="invisible absolute top-full left-0 z-50 mt-3 min-w-[220px] translate-y-2 rounded-lg border border-gray-100 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                        {item.dropdown.map((sub) => (
                                            <Link
                                                key={sub.href}
                                                href={sub.href}
                                                className="block rounded-md px-4 py-2 font-sans text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#7f1414]"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Search Button */}
                <button
                    onClick={() => setSearchOpen(true)}
                    className="hidden cursor-pointer text-white/80 transition-colors hover:text-white lg:block"
                    aria-label="Open search"
                >
                    <Search className="h-5 w-5" strokeWidth={2.5} />
                </button>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="relative z-50 cursor-pointer text-white/80 transition-colors hover:text-white lg:hidden"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X className="h-6 w-6" strokeWidth={2.5} /> : <Menu className="h-6 w-6" strokeWidth={2.5} />}
                </button>

                {user?.roles?.role_name === 'Accreditor' && (
                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
                        onClick={cleanup}
                    >
                        <LogOut size={16} />
                    </Link>
                )}
            </div>
        </motion.header>
    );
}
