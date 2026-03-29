import { Link } from '@inertiajs/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
    label: string;
    href: string;
}

interface PageAsideProps {
    quickLinks?: NavItem[];
    pageSections?: NavItem[];
    className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PageAside({ quickLinks = [], pageSections = [], className }: PageAsideProps) {
    const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        document.getElementById(href)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <aside className={`mb-6 flex flex-col gap-4 lg:sticky lg:top-24 lg:mb-0 lg:w-1/4 lg:flex-shrink-0 ${className ?? ''}`}>
            {quickLinks.length > 0 && (
                <div className="hidden rounded-xl border border-gray-200 bg-white p-6 lg:block">
                    <h2 className="mb-4 font-semibold text-[#7f1414ab]">QUICK LINKS</h2>
                    <nav className="space-y-2">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block text-sm px-1 py-1 font-normal text-gray-700 transition-all duration-100 hover:font-semibold hover:text-[#7f1414]"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {pageSections.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-4 font-semibold text-[#7f1414ab]">ON THIS PAGE</h2>
                    <nav className="space-y-2">
                        {pageSections.map((item) => (
                            <a
                                key={item.href}
                                href={`#${item.href}`}
                                onClick={(e) => handleSectionClick(e, item.href)}
                                className="block text-sm px-1 py-1 font-normal text-gray-700 transition-all duration-150 hover:font-semibold hover:text-[#7f1414]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </aside>
    );
}