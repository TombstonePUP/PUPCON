import React from 'react';
import { Play } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { ActionButton } from '../action-button';

interface AvpSectionProps {
    videoLink?: string;
    videoTitle?: string;
    videoDescription?: string;
}

export const AvpSection = ({ videoLink, videoTitle, videoDescription }: AvpSectionProps) => {
    const [avpSectionRef, isAvpSectionInView] = useInView({ threshold: 0.1 }, true);
    const [avpVideoRef, isAvpVideoInView] = useInView({ threshold: 0.1 }, true);
    const [avpContentRef, isAvpContentInView] = useInView({ threshold: 0.1 }, true);

    return (
        <section
            ref={avpSectionRef}
            className={`relative flex w-full items-center justify-center py-16 transition-all duration-500 ease-out ${isAvpSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
        >
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
                style={{ backgroundImage: "url('/images/homepage-slides/1.jpg')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent"></div>
            <div className="relative z-10 flex w-[85%] max-w-6xl flex-col items-center justify-center gap-16 lg:flex-row">
                <div
                    ref={avpVideoRef}
                    className={`flex w-full justify-center transition-all duration-500 ease-out lg:w-[50%] ${isAvpVideoInView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
                >
                    <div className="relative h-[250px] w-full overflow-hidden rounded-xl transition-transform duration-300 sm:h-[350px] sm:rounded-2xl md:h-[400px]">
                        <iframe
                            className="h-full w-full"
                            src={videoLink || 'https://www.youtube.com/embed/9ypv1kOj7CU?autoplay=0'}
                            title={videoTitle || 'Campus Audio-Visual Presentation'}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                <div
                    ref={avpContentRef}
                    className={`flex w-full flex-col justify-center px-4 text-center transition-all delay-100 duration-500 ease-out sm:px-0 lg:w-[50%] lg:text-left ${isAvpContentInView ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}
                >
                    <h2 className="font-montserrat mb-3 text-xl font-bold tracking-tight text-[#7f1414] sm:mb-4 sm:text-3xl">
                        Campus Audio-Visual Presentation
                    </h2>
                    <p className="mb-3 text-base leading-relaxed text-gray-700 sm:mb-4 sm:text-lg lg:text-[1.15rem]">
                        {videoTitle || 'PUP San Juan Campus AVP 2025'}
                    </p>
                    <p className="mb-6 text-sm text-gray-600 italic sm:mb-8 sm:text-base lg:text-[0.95rem]">
                        {videoDescription || 'Discover the excellence of our campus through this audio-visual presentation.'}
                    </p>

                    <div className="flex justify-center lg:justify-start">
                        <ActionButton href={videoLink || '/'} icon={Play} external>
                            Watch on YouTube
                        </ActionButton>
                    </div>
                </div>
            </div>
        </section>
    );
};
