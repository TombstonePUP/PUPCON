import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIconComponent } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { SquareArrowOutUpRight } from 'lucide-react';

export const useInView = (options: IntersectionObserverInit = { threshold: 0.1 }, triggerOnce: boolean = true) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      } else if (!triggerOnce) {
        setIsInView(false);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, triggerOnce]);

  return [ref, isInView] as const;
};

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

export const ActionButton = React.memo(
  ({
    href,
    children,
    icon: Icon,
    external = false,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    icon?: React.ElementType;
    external?: boolean;
    onClick?: () => void;
    target?: string;
    rel?: string;
    className?: string;
  }) => {
    const Component = external ? 'a' : Link;
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
      <Component
        href={href}
        className="inline-flex transform-none items-center justify-center gap-2 rounded-full border-2 border-[#7f1414] bg-[#7f1414] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#7f1414]/95 hover:scale-101 active:scale-95 sm:gap-3 sm:px-6 sm:py-4 sm:text-base md:px-8"
        {...externalProps}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
        <span className="whitespace-nowrap">{children}</span>
        <SquareArrowOutUpRight className="h-4 w-4 sm:h-5 transition duration-200 sm:w-5 " />
      </Component>
    );
  },
);

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

  if (!images || images.length === 0) {
    return <SafeImage src="/images/landing/1.png" alt="Default Slide" className="h-full w-full" priority={true} />;
  }

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
