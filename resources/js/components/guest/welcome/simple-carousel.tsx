import React, { useEffect, useState } from 'react';
import { SafeImage } from './safe-image';

export const SimpleCarousel = React.memo(({ images }: { images: string[] }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;

        images.forEach((src, index) => {
            if (index > 0) {
                const img = new Image();
                img.src = src;
            }
        });

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 9000);

        return () => clearInterval(interval);
    }, [images]);


    return (
        <div className="absolute inset-0">
            {images.map((src, index) => (
                <div
                    key={src || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <SafeImage src={src} alt={`Slide ${index + 1}`} className="h-full w-full" priority={index === 0} />
                </div>
            ))}
        </div>
    );
});

SimpleCarousel.displayName = 'SimpleCarousel';
