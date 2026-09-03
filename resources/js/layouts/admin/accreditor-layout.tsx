import GuideTour from '@/components/admin/tour/guide-tour';
import { TourProvider } from '@/components/admin/tour/tour-context';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LogOut, Monitor } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

interface AccreditorLayoutProps {
    children: ReactNode;
}

function isActive(path: string) {
    return window.location.pathname.startsWith(path);
}

export default function AccreditorLayout({ children }: AccreditorLayoutProps) {
    const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDir = () => {
            const currentScrollY = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollRatio = scrollHeight > 0 ? currentScrollY / scrollHeight : 0;

            if (Math.abs(currentScrollY - lastScrollY) > 10) {
                if (currentScrollY < lastScrollY && scrollRatio <= 0.1) {
                    setScrollDir('up');
                } else if (currentScrollY > lastScrollY) {
                    setScrollDir('down');
                }
                lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
            }
        };

        window.addEventListener('scroll', updateScrollDir);
        return () => window.removeEventListener('scroll', updateScrollDir);
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    const navigation: { label: string; href: string }[] = [
        // { label: 'Profile', href: '/accreditor/profile' },
    ];

    return (
        <TourProvider>
            {/* Mobile Block */}
            <div className="flex h-screen flex-col items-center justify-center bg-[#f4f4f5] p-6 text-center lg:hidden">
                <div className="border-border max-w-sm rounded-2xl border bg-white p-8 shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#7f1414]/10">
                        <Monitor className="h-7 w-7 text-[#7f1414]" />
                    </div>
                    <h2 className="text-foreground mb-2 text-xl font-bold">Desktop Required</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        The Accreditor Dashboard is only available on desktop devices to preserve data component layouts.
                    </p>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden min-h-screen flex-col lg:flex">
                <GuideTour />
                {/* Header */}
                <motion.header
                    className={cn(
                        'sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#7f1414] to-[#a71d1d] shadow-md backdrop-blur-sm',
                    )}
                    animate={{
                        y: scrollDir === 'down' ? '-100%' : '0%',
                    }}
                    transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                    }}
                >
                    <Link href="/" className="flex items-center" preserveScroll={false}>
                        {/* <img src="/images/pupsjlogo-text-exotic.png" alt="Logo" className="h-full w-full object-cover" draggable={false} /> */}
                        <div className="h-18 w-164 rounded-br-full bg-[#d2b539]">
                            <div className="mr-3 ml-3 flex h-full items-center justify-end gap-4 rounded-br-full bg-white pr-20 pb-2">
                                <img className="mt-1 size-11" src="/images/pupsj-logo.png" alt="pupsj logo" />
                                <div>
                                    <h1 className="text-[25px] font-bold text-[#7f1414]">San Juan Campus</h1>
                                    <p className="mt-[-7px] text-xs">Polytechnic University of the Philippines</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="relative mr-50 max-w-7xl">
                        <div className="flex items-center justify-end gap-8 px-8 py-4">
                            <nav>
                                <ul className="flex gap-8 text-sm font-medium tracking-wide text-white/90">
                                    {navigation.map((item) => (
                                        <li key={item.label} className="group relative">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'relative px-3 py-2 transition-colors duration-300',
                                                    isActive(item.href) && 'text-white',
                                                    'hover:text-white',
                                                )}
                                                preserveScroll
                                            >
                                                {item.label}
                                                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                                            </Link>
                                        </li>
                                    ))}

                                    {/* User Info */}
                                    <li className="relative ml-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="text-right"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-white ring-1 ring-white/20 transition-all duration-200 hover:bg-white/20 hover:ring-white/40"
                                                title="Logout"
                                            >
                                                <LogOut size={16} className="text-white" />
                                                <span className="text-xs text-white/80">Logout</span>
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </motion.header>

                {/* Main */}
                <main className="flex-1 pb-15">{children}</main>

                {/* Footer */}
                <footer className="relative min-h-[300px] bg-[#7f1414] text-white">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-25"
                        style={{ backgroundImage: "url('/images/homepage-slides/3.jpg')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#7f1414]/90 via-[#7f1414]/70 to-[#7f1414]/80"></div>

                    <div className="relative z-10 mx-auto flex h-full w-[90%] max-w-7xl flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <img src="/images/pupcon-logo-white.png" alt="PUP Logo" className="mx-auto mb-4 w-24" />
                            <h2 className="mb-2 text-lg leading-snug font-bold">AACCUP Accreditation Portal</h2>
                            <p className="mb-4 text-sm opacity-90">Polytechnic University of the Philippines - San Juan</p>
                        </div>

                        <div className="mt-6 w-full border-t border-white/20 pt-6 text-center text-sm opacity-80">
                            © {new Date().getFullYear()} Maharlika Technologies. All Rights Reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </TourProvider>
    );
}
