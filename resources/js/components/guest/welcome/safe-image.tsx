import { Image as ImageIconComponent } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export const SafeImage = React.memo(
    ({
        src,
        alt,
        className,
        priority = false,
        placeholderType = 'image',
    }: {
        src: string;
        alt: string;
        className: string;
        priority?: boolean;
        placeholderType?: 'image' | 'logo';
    }) => {
        const [isLoaded, setIsLoaded] = useState(false);
        const [hasError, setHasError] = useState(false);
        const [shouldLoad, setShouldLoad] = useState(priority);
        const imgRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (!shouldLoad) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            setShouldLoad(true);
                            observer.disconnect();
                        }
                    },
                    { rootMargin: '100px' },
                );
                if (imgRef.current) observer.observe(imgRef.current);
                return () => observer.disconnect();
            }
        }, [shouldLoad]);

        const handleInternalError = () => {
            setHasError(true);
        };

        const placeholderBaseClass = 'h-full w-full flex items-center justify-center bg-gray-100 rounded-inherit';
        const outerClassName = `relative overflow-hidden ${className || ''}`;

        return (
            <div ref={imgRef} className={outerClassName}>
                {hasError ? (
                    <div className={placeholderBaseClass}>
                        {placeholderType === 'logo' ? (
                            <span className="text-lg font-semibold text-[#7f1414]">PUP</span>
                        ) : (
                            <ImageIconComponent className="h-15 w-15 text-gray-300" />
                        )}
                    </div>
                ) : shouldLoad ? (
                    <>
                        {!isLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
                        <img
                            src={src}
                            alt={alt}
                            className={`h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setIsLoaded(true)}
                            onError={handleInternalError}
                            loading={priority ? 'eager' : 'lazy'}
                        />
                    </>
                ) : (
                    <div className="h-full w-full animate-pulse bg-gray-200" />
                )}
            </div>
        );
    },
);

SafeImage.displayName = 'SafeImage';
