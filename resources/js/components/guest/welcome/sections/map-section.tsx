import React from 'react';
import { MapPin } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { ActionButton } from '../action-button';

export const MapSection = () => {
    const [mapSectionRef, isMapSectionInView] = useInView({ threshold: 0.1 }, true);
    const [mapContentRef, isMapContentInView] = useInView({ threshold: 0.1 }, true);
    const [mapEmbedRef, isMapEmbedInView] = useInView({ threshold: 0.1 }, true);

    return (
        <section
            ref={mapSectionRef}
            className={`relative flex w-full items-center justify-center py-16 transition-all duration-500 ease-out ${isMapSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
        >
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
                style={{ backgroundImage: "url('/images/homepage-slides/street-sj.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
            <div className="relative z-10 flex w-[80%] max-w-6xl flex-col items-center justify-center gap-16 lg:flex-row">
                <div
                    ref={mapContentRef}
                    className={`order-2 flex w-full flex-col justify-center text-center transition-all duration-500 ease-out lg:order-1 lg:w-[50%] lg:text-left ${isMapContentInView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
                >
                    <h2 className="font-montserrat mb-4 text-xl font-bold tracking-tight text-[#7f1414] sm:text-2xl">Explore Our Campus</h2>
                    <p className="mb-4 text-sm leading-relaxed text-gray-700">
                        Our strategically located campus is designed to inspire learning and innovation. Tap the map to explore buildings,
                        facilities, and more.
                    </p>
                    <p className="mb-8 text-sm text-gray-600 italic sm:mb-8">PUP San Juan, Pinaglabanan St., San Juan City</p>

                    <div>
                        <ActionButton href="https://maps.app.goo.gl/KLfy768XRV4DXY9t7" icon={MapPin} external>
                            View Full Map
                        </ActionButton>
                    </div>
                </div>

                <div
                    ref={mapEmbedRef}
                    className={`order-1 flex w-full justify-center transition-all delay-100 duration-500 ease-out lg:order-2 lg:w-[50%] ${isMapEmbedInView ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}
                >
                    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-102">
                        <iframe
                            className="h-full w-full border-0"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.6352821614245!2d121.03989456028415!3d14.594374852740119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c82e63228c75%3A0xf48b60882ff9710a!2sPolytechnic%20University%20of%20the%20Philippines%20-%20San%20Juan!5e0!3m2!1sen!2sph!4v1749228865968!5m2!1sen!2sph"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
