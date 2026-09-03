import { SquareArrowOutUpRight } from 'lucide-react';
import React from 'react';

// Mocking Link since it usually comes from Inertia, but we'll use a standard a tag or props
export const ActionButton = React.memo(
    ({
        href,
        children,
        icon: Icon,
        external = false,
        className = '',
        ...props
    }: {
        href: string;
        children: React.ReactNode;
        icon?: React.ElementType;
        external?: boolean;
        className?: string;
        [key: string]: unknown;
    }) => {
        const isExternal = external || href.startsWith('http');
        const Component = isExternal ? 'a' : 'a'; // In the real app, this might be Link from @inertiajs/react
        const externalProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

        return (
            <Component
                href={href}
                className={`inline-flex transform-none items-center justify-center gap-2 rounded-full border-2 border-[#7f1414] bg-[#7f1414] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-101 hover:bg-[#7f1414]/95 active:scale-95 sm:gap-3 sm:px-6 sm:py-4 sm:text-base md:px-8 ${className}`}
                {...externalProps}
                {...props}
            >
                {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                <span className="whitespace-nowrap">{children}</span>
                <SquareArrowOutUpRight className="h-4 w-4 transition duration-200 sm:h-5 sm:w-5" />
            </Component>
        );
    },
);

ActionButton.displayName = 'ActionButton';
