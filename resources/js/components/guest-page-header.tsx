import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Crumb {
    label: string;
    href?: string;
}

interface QuickLink {
    label: string;
    targetId: string;
}

interface PageHeaderProps {
    title?: string;
    breadcrumbs: Crumb[];
    quickLinks?: QuickLink[];
}

export default function PageHeader({ title, breadcrumbs, quickLinks }: PageHeaderProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // highlight quickLinks on scroll
    useEffect(() => {
        if (!quickLinks) return;

        const handleScroll = () => {
            let current: string | null = null;
            for (const link of quickLinks) {
                const section = document.getElementById(link.targetId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 120 && rect.bottom >= 120) {
                        current = link.targetId;
                        break;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [quickLinks]);

    const scrollToSection = (targetId: string) => {
        const section = document.getElementById(targetId);
        if (section) {
            const headerOffset = 100; // offset in pixels
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="sticky top-0 z-30 w-full bg-white py-4 shadow-md">
            <div className="mx-auto flex w-[75%] max-w-7xl items-center justify-between text-[#7f1414]">
                {/* Title */}
                {title && <h1 className="text-lg font-semibold tracking-tight">{title}</h1>}

                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm">
                    {breadcrumbs.map((crumb, idx) => {
                        const isLast = idx === breadcrumbs.length - 1;
                        return (
                            <span key={idx} className="flex items-center">
                                {isLast ? (
                                    <span className="font-semibold text-[#7f1414]">{crumb.label}</span>
                                ) : (
                                    <Link href={crumb.href ?? '#'} className="text-[#7f1414]/70 transition-colors hover:text-[#7f1414]">
                                        {crumb.label}
                                    </Link>
                                )}
                                {!isLast && <span className="mx-2 text-[#7f1414]/50">/</span>}
                            </span>
                        );
                    })}
                </nav>

                {/* Quick Links with animations */}
                {quickLinks && (
                    <nav className="hidden items-center gap-1 text-sm md:flex">
                        {quickLinks.map((link) => (
                            <button
                                key={link.targetId}
                                onClick={() => scrollToSection(link.targetId)}
                                className={`relative rounded-md px-3 py-1.5 transition-all duration-300 ease-out ${
                                    activeSection === link.targetId
                                        ? 'scale-105 font-semibold text-[#7f1414]'
                                        : 'text-[#7f1414]/60 hover:text-[#7f1414]'
                                } `}
                            >
                                {/* Background highlight animation */}
                                {/* <span
                  className={`
                    absolute inset-0 rounded-md bg-[#7f1414]/10
                    transition-all duration-300 ease-out
                    ${
                      activeSection === link.targetId
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90'
                    }
                  `}
                /> */}

                                {/* Animated underline */}
                                <span
                                    className={`absolute bottom-0 left-1/2 h-0.5 bg-[#7f1414] transition-all duration-300 ease-out ${
                                        activeSection === link.targetId ? 'w-3/4 -translate-x-1/2' : 'w-0 -translate-x-1/2'
                                    } `}
                                />

                                <span className="relative z-10">{link.label}</span>
                            </button>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    );
}
