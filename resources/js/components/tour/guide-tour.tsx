'use client';

import { usePage } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import { useTour } from './tour-context';
import { TourMask } from './tour-mask';
import { TourTooltip } from './tour-tooltip';
import { FALLBACK_TOUR, TOUR_DEFINITIONS } from './tour-config';

const GuideTour = () => {
    const { url } = usePage();
    const { isOpen, activeStep, startTour, stopTour } = useTour();

    const currentTourSteps = useMemo(() => {
        // Sanitize URL by removing query strings
        const path = url.split('?')[0];

        // Specific match first
        if (TOUR_DEFINITIONS[path]) return TOUR_DEFINITIONS[path];

        // Prefix match
        if (path.startsWith('/settings/')) return TOUR_DEFINITIONS[path] || FALLBACK_TOUR;
        if (path.startsWith('/area/')) return TOUR_DEFINITIONS['/area'];
        if (path.startsWith('/manage-programs/')) return TOUR_DEFINITIONS['/manage-programs'];

        return FALLBACK_TOUR;
    }, [url]);

    const step = currentTourSteps[activeStep] || currentTourSteps[0];

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'F1') {
                e.preventDefault();
                startTour();
            } else if (e.key === 'Escape') {
                stopTour();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [startTour, stopTour]);

    return (
        <>
            <TourMask 
                isOpen={isOpen} 
                elementSelector={step.element} 
            />
            <TourTooltip 
                elementSelector={step.element}
                title={step.title}
                text={step.text}
                isFirst={activeStep === 0}
                isLast={activeStep === currentTourSteps.length - 1}
                isOpen={isOpen}
            />
        </>
    );
};

export default GuideTour;
