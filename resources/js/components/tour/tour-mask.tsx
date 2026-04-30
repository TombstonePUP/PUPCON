'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TourMaskProps {
    elementSelector?: string;
    isOpen: boolean;
}

export const TourMask = ({ elementSelector, isOpen }: TourMaskProps) => {
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!isOpen || !elementSelector || elementSelector === 'body') {
            setRect(null);
            return;
        }

        const updateRect = () => {
            const el = document.querySelector(elementSelector);
            if (el) {
                setRect(el.getBoundingClientRect());
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect);
        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
        };
    }, [elementSelector, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.svg
                    className="pointer-events-none fixed inset-0 z-[998] h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <defs>
                        <mask id="tour-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            {rect && (
                                <motion.rect
                                    initial={false}
                                    animate={{
                                        x: rect.x - 8,
                                        y: rect.y - 8,
                                        width: rect.width + 16,
                                        height: rect.height + 16,
                                        rx: 12,
                                    }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    fill="black"
                                />
                            )}
                        </mask>
                    </defs>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.4)"
                        mask="url(#tour-mask)"
                        style={{ backdropFilter: 'blur(2px)' }}
                    />
                </motion.svg>
            )}
        </AnimatePresence>
    );
};
