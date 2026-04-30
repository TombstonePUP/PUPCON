'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTour } from './tour-context';

interface TooltipProps {
    elementSelector: string;
    title: string;
    text: string;
    isLast: boolean;
    isFirst: boolean;
    isOpen: boolean;
}

export const TourTooltip = ({ elementSelector, title, text, isLast, isFirst }: TooltipProps) => {
    const { nextStep, prevStep, stopTour, isOpen } = useTour();
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const el = document.querySelector(elementSelector);
            if (el && elementSelector !== 'body') {
                const rect = el.getBoundingClientRect();
                // Default to below the element
                let top = rect.bottom + 20;
                let left = rect.left + rect.width / 2 - 175; // 350px width / 2

                // Flip to top if bottom is off screen
                if (top + 200 > window.innerHeight) {
                    top = rect.top - 220;
                }

                // Horizontal boundary checks
                left = Math.max(20, Math.min(left, window.innerWidth - 370));

                setPosition({ top, left });
            } else {
                // Center of viewport fallback
                setPosition({
                    top: window.innerHeight / 2 - 120,
                    left: window.innerWidth / 2 - 175,
                });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [elementSelector, isOpen]);

    if (!isOpen) return null;

    const content = (
        <motion.div
            className="fixed z-[999] w-[350px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-0"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                top: position.top,
                left: position.left,
            }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
            {/* Visual Accent Line */}
            <div className="h-1 w-full bg-[#7f1414]" />

            <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold tracking-tight text-[#7f1414]">{title}</h3>
                    <button onClick={stopTour} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#7f1414]">
                        <X size={18} />
                    </button>
                </div>

                <p className="text-sm leading-relaxed font-medium text-gray-600">{text}</p>

                <div className="mt-8 flex items-center justify-end gap-3">
                    {!isFirst && (
                        <Button variant="ghost" size="sm" onClick={prevStep} className="text-gray-500 hover:text-gray-900">
                            Back
                        </Button>
                    )}
                    <Button
                        size="sm"
                        onClick={isLast ? stopTour : nextStep}
                        className="rounded-xl border-none bg-[#7f1414] px-6 font-bold text-white shadow-none hover:bg-[#9b1c1c]"
                    >
                        {isLast ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );

    return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};
