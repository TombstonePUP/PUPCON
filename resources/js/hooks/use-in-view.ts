import { useEffect, useRef, useState } from 'react';

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
