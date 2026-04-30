import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import type { Auth, GuestNavigation } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronUp } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import GuestHeader from '@/components/guest/guest-header';
import GuestFooter from '@/components/guest/guest-footer';
import MobileMenu from '@/components/guest/mobile-menu';
import SearchModal from '@/components/guest/search-modal';

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

function isActive(path: string) {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith(path);
}

export default function Layout({ children, className }: LayoutProps) {
    const { guest } = usePage<GuestNavigation>().props;
    const { auth } = usePage<Auth>().props;
    const user = auth.user;
    const cleanup = useMobileNavigation();

    const programsList = guest.programs ?? [];
    const underSurveyPrograms = programsList.map((p) => ({
        label: p.program_name,
        href: `/programs/${p.program_id}`,
    }));

    const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
    const [searchOpen, setSearchOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTopButton, setShowTopButton] = useState(false);

    // ---- Header show/hide: reveal only when scrolled up ----
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDir = () => {
            const currentScrollY = window.scrollY;

            if (Math.abs(currentScrollY - lastScrollY) > 5) {
                if (currentScrollY < lastScrollY) {
                    setScrollDir('up');
                } else {
                    setScrollDir('down');
                }
                lastScrollY = currentScrollY;
            }
        };

        window.addEventListener('scroll', updateScrollDir);
        return () => window.removeEventListener('scroll', updateScrollDir);
    }, []);

    useEffect(() => {
        const checkScroll = () => {
            if (window.scrollY > 300) {
                setShowTopButton(true);
            } else {
                setShowTopButton(false);
            }
        };

        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    const leftNav = [
        {
            label: 'About',
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
            label: 'Authenticity',
            href: '/certificate',
            dropdown: [],
        },
    ];

    const rightNav = [
        {
            label: 'Programs',
            href: '/programs',
            dropdown: underSurveyPrograms,
        },
        { label: 'Exhibits', href: '/exhibits', dropdown: [] },
        { label: 'Others', href: '/others', dropdown: [] },
    ];

    return (
        <div className="font-poppins flex min-h-screen flex-col bg-white">
            <GuestHeader
                scrollDir={scrollDir}
                setSearchOpen={setSearchOpen}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                leftNav={leftNav}
                rightNav={rightNav}
                isActive={isActive}
                user={user}
                cleanup={cleanup}
                route={route}
            />

            <SearchModal
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                guestProps={guest}
            />

            <MobileMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                leftNav={leftNav}
                rightNav={rightNav}
                isActive={isActive}
                guestProps={guest}
            />

            <main className={cn('flex-1', className)}>{children}</main>

            <GuestFooter
                user={user}
                cleanup={cleanup}
                route={route}
            />

            <AnimatePresence>
                {showTopButton && (
                    <motion.button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#7f1414] text-white shadow-lg transition-all hover:bg-[#a71d1d]"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronUp className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
