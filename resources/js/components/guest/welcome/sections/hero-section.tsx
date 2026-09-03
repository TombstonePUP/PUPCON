import React from 'react';
import { useInView } from '@/hooks/use-in-view';
import { SimpleCarousel } from '../simple-carousel';
import { SafeImage } from '../safe-image';

interface HeroSectionProps {
    carousel_paths: string[];
}

export const HeroSection = ({ carousel_paths }: HeroSectionProps) => {
    const [heroRef, isHeroInView] = useInView({ threshold: 0.1 }, true);
    const [heroContentRef, isHeroContentInView] = useInView({ threshold: 0.1 }, true);

    return (
        <div
            ref={heroRef}
            className={`relative h-[70vw] w-full overflow-hidden transition-opacity duration-500 lg:h-[30vw] ${isHeroInView ? 'opacity-100' : 'opacity-0'}`}
        >
            <SimpleCarousel images={carousel_paths} />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#800000]/100 to-transparent"></div>

            {/* Content Overlay with Animations */}
            <div ref={heroContentRef} className="absolute inset-0 z-20 grid w-full grid-cols-1 px-[8vw] pr-10 text-white lg:pl-70">
                <div
                    className={`flex w-full flex-col justify-center space-y-[1.25vw] transition-all duration-500 ease-out ${
                        isHeroContentInView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                    }`}
                >
                    <SafeImage src="/images/pupsj_motto.png" alt="Logo" className="w-[70vw] object-cover lg:w-[29vw]" priority />
                    <h2 className="mb-3 text-base italic opacity-60 sm:text-xl lg:mb-0">Years of academic excellence and service</h2>
                </div>
            </div>
        </div>
    );
};
