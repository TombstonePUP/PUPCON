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

export default function PageAside({ quickLinks = [], className }: PageAsideProps) {
    return (
        <aside
            className={`sticky top-24 mb-6 flex flex-col gap-4 self-start lg:sticky lg:top-24 lg:mb-0 lg:w-1/4 lg:flex-shrink-0 ${className ?? ''}`}
        >
            {quickLinks.length > 0 && (
                <div className="hidden rounded-xl border border-gray-200 bg-white p-6 lg:block">
                    <h2 className="mb-4 font-semibold text-[#7f1414ab]">QUICK LINKS</h2>
                    <nav className="space-y-2">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block px-1 py-1 text-sm font-normal text-gray-700 transition-all duration-100 hover:font-semibold hover:text-[#7f1414]"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </aside>
    );
}
