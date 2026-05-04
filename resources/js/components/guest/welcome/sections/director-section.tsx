import React from 'react';
import { useInView } from '@/hooks/use-in-view';
import { SafeImage } from '../safe-image';

interface DirectorSectionProps {
    directorName?: string;
    directorMessage?: string;
    directorImagePath?: string;
}

export const DirectorSection = ({ directorName, directorMessage, directorImagePath }: DirectorSectionProps) => {
    const [directorSectionRef, isDirectorSectionInView] = useInView({ threshold: 0.1 }, true);
    const [directorImageRef, isDirectorImageInView] = useInView({ threshold: 0.1 }, true);
    const [directorMsgRef, isDirectorMsgInView] = useInView({ threshold: 0.1 }, true);

    return (
        <section
            ref={directorSectionRef}
            className={`my-12 space-y-7 bg-white transition-all duration-500 ease-out ${isDirectorSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
        >
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="font-montserrat mb-1 text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Message from the Campus Director
                </h2>
                <p className="text-sm text-gray-600 sm:text-base">A word of inspiration from our campus leadership.</p>
            </div>

            <div className="mx-auto flex w-[80%] max-w-5xl flex-col gap-2 lg:flex-row lg:items-stretch">
                {/* Director's Image */}
                <div
                    ref={directorImageRef}
                    className={`relative mx-auto h-[350px] w-[280px] shrink-0 overflow-hidden rounded-xl transition-all duration-500 ease-out lg:mx-0 ${isDirectorImageInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                >
                    <SafeImage
                        src={directorImagePath || '/images/adfa-new/faculty/Cecilia-Reyes-Alagon.jpg'}
                        alt={directorName || 'Campus Director'}
                        className="h-full w-full rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#7f1414]/20 to-transparent" />
                </div>

                {/* Director's Message */}
                <div
                    ref={directorMsgRef}
                    className={`flex flex-1 flex-col gap-4 rounded-xl border-2 border-[#7f1414] bg-[#7f1414] p-8 text-white transition-all delay-100 duration-500 ease-out hover:border-[#a71d1d] ${isDirectorMsgInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#a83232]/80">
                        <SafeImage src="/images/quote.png" alt="Quote Icon" className="h-4 w-4 object-contain" />
                    </div>

                    <div className="scrollbar-thin scrollbar-thumb-white/20 min-h-[140px] overflow-y-auto pr-2">
                        <p className="text-left leading-relaxed">
                            {directorMessage ||
                                'Welcome to PUP San Juan City! As the Campus Director, I am proud to lead a community that values academic excellence, innovation, and service.'}
                        </p>
                    </div>

                    <div className="mt-auto text-left">
                        <p className="font-semibold">{directorName || 'Cecilia Reyes-Alagon'}</p>
                        <p className="text-sm opacity-90">Campus Director</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
