import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface DropdownItem {
    label: string;
    href: string;
}

interface DropdownNavItemProps {
    item: {
        label: string;
        href: string;
        dropdown: DropdownItem[];
    };
}

export function DropdownNavItem({ item }: DropdownNavItemProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    let timeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
        clearTimeout(timeout);
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        timeout = setTimeout(() => {
            setShowDropdown(false);
        }, 300); // 300ms hide delay
    };

    return (
        <li
            key={item.label}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href={item.href}
                className={cn(
                    'text-[#7f1414] px-[1vw] py-[0.55vw] rounded-[1vw] transition-all duration-200 whitespace-nowrap',
                    window.location.pathname.startsWith(item.href) && 'active'
                )}
            >
                {item.label}
            </Link>

            {item.dropdown.length > 0 && (
                <div
                    className={cn(
                        'absolute flex-col bg-white shadow-lg rounded-md mt-[0.5vw] text-sm transition-opacity duration-300 overflow-hidden',
                        showDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'
                    )}
                >
                    {item.dropdown.map((drop) => (
                        <Link
                            key={drop.label}
                            href={drop.href}
                            className="relative inline-block text-[#7f1414] text-[0.8vw] whitespace-nowrap p-[0.8vw] overflow-hidden
                                   before:absolute before:inset-0 before:bg-[#7f1414] before:scale-x-0 before:origin-left
                                   before:transition-transform before:duration-300 hover:before:scale-x-100
                                   hover:text-white z-10"
                        >
                            <span className="relative z-20">{drop.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </li>
    );
}
