import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import useFacebookFeed from '@/hooks/useFacebookFeed';
import Layout from '@/layouts/landing-layout';
import { CampusGallery, ContentPages } from '@/types/content';
import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Image, ImageIcon, MapPin, Play, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// const Head = ({ children }: { children: React.ReactNode }) => <>{/* Mock Head, does nothing */}</>;
const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode;[key: string]: any }) => (
    <a href={href} {...props}>
        {children}
    </a>
);

const router = {
    visit: (url: string, options: any) => {
        console.log(`Mock Router: visit "${url}" with options:`, options);
    },
};

const usePage = () => ({
    props: {
        auth: {
            user: {
                first_name: 'Esteemed',
                last_name: 'Accreditor',
                roles: {
                    role_name: 'Accreditor',
                },
            },
        },
    },
});

const HomeCard = ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
    <div className={`rounded-lg border ${className}`} {...props}>
        {children}
    </div>
);
const CardHeader = ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
    <div className={`p-4 ${className}`} {...props}>
        {children}
    </div>
);
const HomeCardTitle = ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
    <h3 className={`font-semibold ${className}`} {...props}>
        {children}
    </h3>
);
const HomeCardDescription = ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>
        {children}
    </p>
);

interface LandingProps {
    page: ContentPages;
    carousel_images: CampusGallery[];
}

interface Auth {
    user: {
        first_name?: string;
        last_name?: string;
        roles?: {
            role_name: string;
        };
    };
}

interface NewsCard {
    title: string;
    img: string;
    desc: string;
    source: string;
}

const useInView = (options: IntersectionObserverInit = { threshold: 0.1 }, triggerOnce: boolean = true) => {
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

const SafeImage = React.memo(
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
                            <ImageIcon className="h-15 w-15 text-gray-300" />
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

const SimpleCarousel = React.memo(({ images }: { images: string[] }) => {
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
        }, 4000);

        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Image className="h-50 w-50 text-gray-400" />
                        </EmptyMedia>
                        <EmptyTitle>
                            Content Not Available
                        </EmptyTitle>
                        <EmptyDescription>No Available Images At The Moment.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        );
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

const ActionButton = React.memo(
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
        [key: string]: any;
    }) => {
        const Component = external ? 'a' : Link;
        const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

        return (
            <Component
                href={href}
                className="inline-flex transform-none items-center justify-center gap-2 rounded-full border-2 border-[#7f1414] bg-[#7f1414] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-[#6b1111] active:scale-95 sm:gap-3 sm:px-6 sm:py-4 sm:text-base md:px-8"
                {...externalProps}
                {...props}
            >
                {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                <span className="whitespace-nowrap">{children}</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Component>
        );
    },
);

export default function Welcome({ page, carousel_images }: LandingProps) {
    const [showModal, setShowModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPageReady, setIsPageReady] = useState(false);

    const [selectedNewsItem, setSelectedNewsItem] = useState<NewsCard | null>(null);
    const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
    const [isNewsDialogVisible, setIsNewsDialogVisible] = useState(false);

    const [newsPage, setNewsPage] = useState(0);

    const images = carousel_images;
    const {
        props: { auth },
    } = usePage() as { props: { auth: Auth } };
    const user = auth?.user;

    const [heroRef, isHeroInView] = useInView({ threshold: 0.1 }, true);
    const [heroContentRef, isHeroContentInView] = useInView({ threshold: 0.1 }, true);
    const [newsSectionRef, isNewsSectionInView] = useInView({ threshold: 0.1 }, true);
    const [newsCardsRef, isNewsCardsInView] = useInView({ threshold: 0.1 }, true);
    const [newsPaginationRef, isNewsPaginationInView] = useInView({ threshold: 0.1 }, true);
    const [avpSectionRef, isAvpSectionInView] = useInView({ threshold: 0.1 }, true);
    const [avpVideoRef, isAvpVideoInView] = useInView({ threshold: 0.1 }, true);
    const [avpContentRef, isAvpContentInView] = useInView({ threshold: 0.1 }, true);
    const [directorSectionRef, isDirectorSectionInView] = useInView({ threshold: 0.1 }, true);
    const [directorImageRef, isDirectorImageInView] = useInView({ threshold: 0.1 }, true);
    const [directorMsgRef, isDirectorMsgInView] = useInView({ threshold: 0.1 }, true);
    const [accreditorSectionRef, isAccreditorSectionInView] = useInView({ threshold: 0.1 }, true);
    const [accreditorContentRef, isAccreditorContentInView] = useInView({ threshold: 0.1 }, true);
    const [accreditorCardsRef, isAccreditorCardsInView] = useInView({ threshold: 0.1 }, true);
    const [mapSectionRef, isMapSectionInView] = useInView({ threshold: 0.1 }, true);
    const [mapContentRef, isMapContentInView] = useInView({ threshold: 0.1 }, true);
    const [mapEmbedRef, isMapEmbedInView] = useInView({ threshold: 0.1 }, true);

    const animationStyles = `
        @keyframes pulse-bg-1 {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes pulse-bg-2 {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.03); }
        }
        .animate-pulse-bg-1 {
            animation: pulse-bg-1 3s ease-in-out infinite;
        }
        .animate-pulse-bg-2 {
            animation: pulse-bg-2 2.5s ease-in-out 0.5s infinite;
        }
        /* Simple scrollbar for director's message */
        .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        .scrollbar-thumb-white\\/20::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar {
            width: 5px;
        }
        /* Inherit border radius for SafeImage placeholder */
        .rounded-inherit {
            border-radius: inherit;
        }
    `;

    const { posts: fbPosts, loading: fbLoading, error: fbError } = useFacebookFeed(8);

    const newsCards = useMemo(() => {
        if (fbLoading || fbError || !fbPosts.length) {
            // Fallback to hardcoded posts if API fails
            return [
                {
                    title: 'PUPSJ PUPCET',
                    img: '/images/pupcet.jpg',
                    desc: 'The PUPSJ PUPCET Online Application for Academic Year 2025-2026 starts on December 15, 2024 - April 15, 2025.',
                    source: 'https://www.facebook.com/PUPSJStudentAssembly/posts/pfbid02BBc79Sp51g6ntw5cnNxabMqRiBYnTY6hgJbcuMtN5yN7fLg31fMNy7bpkkUk8Rqyl',
                },
                {
                    title: 'CPALE 2024 Passers',
                    img: '/images/cpale.jpg',
                    desc: 'Pagpupugay sa bagong CPA ng ating Sintang Paaralan.',
                    source: 'https://www.facebook.com/photo.php?fbid=1002993848520595&set=pb.100064299686924.-2207520000&type=3',
                },
                {
                    title: 'Mental Health Matters',
                    img: '/images/mental.jpg',
                    desc: 'The OCPS A School Adjustment Program (ASAP) is here to help you thrive!',
                    source: 'https://www.facebook.com/PUPSJStudentAssembly/posts/pfbid0mehRRGVgQvoEgKf9LuTamcF8QcjrU2RjiS5dCCNjAiHmxuf3q6djRMrEJhBYVmoTl',
                },
                {
                    title: 'Ceremonial Signing',
                    img: '/images/ceremony.jpg',
                    desc: 'A groundbreaking partnership between PUP San Juan City and the Research Synergy Foundation!',
                    source: 'https://www.facebook.com/photo.php?fbid=911510457668935&set=pb.100064299686924.-2207520000&type=3',
                },
                {
                    title: 'Student Orientation 2025',
                    img: '/images/pupcet.jpg',
                    desc: 'Welcome to the new academic year! Join us for student orientation sessions.',
                    source: 'https://www.facebook.com/PUPSJStudentAssembly',
                },
                {
                    title: 'Research Symposium',
                    img: '/images/cpale.jpg',
                    desc: 'Annual research symposium showcasing student and faculty research projects.',
                    source: 'https://www.facebook.com/PUPSJStudentAssembly',
                },
                {
                    title: 'Sports Fest 2025',
                    img: '/images/mental.jpg',
                    desc: 'Get ready for an exciting sports festival with inter-department competitions!',
                    source: 'https://www.facebook.com/PUPSJStudentAssembly',
                },
                {
                    title: 'Alumni Homecoming',
                    img: '/images/ceremony.jpg',
                    desc: 'Reconnect with fellow alumni and celebrate the legacy of PUP San Juan.',
                    source: 'https://www.facebook.com/PUPSJStudentAssembly',
                },
            ];
        }

        // Map Facebook posts to your card format
        return fbPosts.map((post) => ({
            title: post.message?.split('\n')[0]?.substring(0, 50) + '...' || 'PUP San Juan Update',
            // Use placeholder if no image is available
            img: post.image || '/images/pupsj-placeholder.png', // Add your placeholder image
            desc: post.message?.substring(0, 150) + '...' || 'Check out our latest update!',
            source: post.permalink || 'https://www.facebook.com/PUPSJStudentAssembly',
        }));
    }, [fbPosts, fbLoading, fbError]);

    const POSTS_PER_PAGE = window.innerWidth <= 768 ? 2 : 4;
    const totalPages = Math.ceil(newsCards.length / POSTS_PER_PAGE);
    const currentPosts = newsCards.slice(newsPage * POSTS_PER_PAGE, (newsPage + 1) * POSTS_PER_PAGE);

    const handleNextPage = () => {
        if (newsPage < totalPages - 1) {
            setNewsPage(newsPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (newsPage > 0) {
            setNewsPage(newsPage - 1);
        }
    };

    useEffect(() => {
        setIsPageReady(true);
    }, []);

    useEffect(() => {
        if (isPageReady) {
            try {
                const visited = sessionStorage.getItem('welcomeModalShown');
                if (!visited) {
                    setTimeout(() => {
                        setShowModal(true);
                        setTimeout(() => setIsModalVisible(true), 20);
                        sessionStorage.setItem('welcomeModalShown', 'true');
                    }, 1000);
                }
            } catch (error) {
                console.warn('Could not access sessionStorage:', error);
            }
        }
    }, [isPageReady]);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => setShowModal(false), 200);
    }, []);

    const handleSelectType = useCallback((type: string) => {
        setIsModalVisible(false);
        setTimeout(() => setShowModal(false), 200);

        if (type === 'faculty' || type === 'accreditor') {
            router.visit('/login', {
                method: 'get',
                data: { role: type },
            });
        }
    }, []);

    const handleOpenNewsDialog = (card: NewsCard) => {
        setSelectedNewsItem(card);
        setIsNewsDialogOpen(true);
        setTimeout(() => setIsNewsDialogVisible(true), 20);
    };

    const handleCloseNewsDialog = useCallback(() => {
        setIsNewsDialogVisible(false);
        setTimeout(() => {
            setIsNewsDialogOpen(false);
            setSelectedNewsItem(null);
        }, 200);
    }, []);

    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <link rel="preload" href={carousel_images[0] || '/images/landing/1.png'} as="image" />
            </Head>

            <style>{animationStyles}</style>

            <Layout>
                <div
                    ref={heroRef}
                    className={`relative h-[70vw] w-full overflow-hidden transition-opacity duration-500 lg:h-[60vh] ${isHeroInView ? 'opacity-100' : 'opacity-0'}`}
                >
                    <SimpleCarousel images={images} />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#800000]/100 to-transparent"></div>

                    {/* Content Overlay with Animations */}
                    <div ref={heroContentRef} className="absolute inset-0 z-20 grid w-full grid-cols-1 px-[8vw] pr-10 text-white lg:pl-70">
                        <div
                            className={`flex w-full flex-col justify-center space-y-[1.25vw] transition-all duration-500 ease-out ${isHeroContentInView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                                }`}
                        >
                            <SafeImage src="/images/pupsj_motto.png" alt="Logo" className="w-[70vw] object-cover lg:w-[29vw]" priority />
                            <h2 className="mb-3 text-[2.8vw] italic lg:mb-0 lg:text-[1.76vw]">Years of academic excellence and service</h2>
                            {/* <div className="mt-[2.08vw] flex w-full flex-wrap justify-center gap-2 lg:justify-start">
                                {[
                                    { icon: BookOpen, text: 'Programs', primary: true },
                                    { icon: Calendar, text: 'Events' },
                                    { icon: GraduationCap, text: 'Academe' },
                                ].map((btn) => (
                                    <button
                                        key={btn.text}
                                        className={
                                            btn.primary
                                                ? 'flex items-center space-x-[0.8vw] rounded-md bg-white px-3 py-2 font-semibold text-black transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95'
                                                : 'flex items-center space-x-[0.8vw] rounded-md border border-gray-300/70 bg-white/10 px-3 py-2 font-semibold text-white backdrop-blur-lg transition-all duration-200 hover:scale-105 hover:border-gray-200 hover:bg-white/20 active:scale-95'
                                        }
                                    >
                                        <btn.icon className="size-[3vw] lg:size-[1vw]" />
                                        <span className="text-[2.5vw] lg:text-[1vw]">{btn.text}</span>
                                    </button>
                                ))}
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* News Section */}
                <section ref={newsSectionRef} className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-20 bg-gray-50 px-6 py-16">
                    <div
                        className={`flex flex-col items-center px-4 text-center transition-all duration-500 ease-out ${isNewsSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What's New on Campus</h2>
                        <p className="mt-2 text-base text-gray-600 sm:text-lg">Catch up on events, announcements, and campus highlights.</p>
                    </div>

                    {/* News Cards - Responsive Grid */}
                    <div ref={newsCardsRef} className="w-full max-w-7xl px-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-4">
                            {currentPosts.map((card, i) => (
                                <div
                                    key={`${newsPage}-${i}`}
                                    className={`transition-all duration-500 ease-out ${isNewsCardsInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    <div
                                        className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:!scale-102"
                                        onClick={() => handleOpenNewsDialog(card)}
                                    >
                                        <HomeCard className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-[#7f1414] hover:shadow-lg">
                                            <div className="h-40 w-full overflow-hidden sm:h-48">
                                                <SafeImage
                                                    src={card.img}
                                                    alt={card.title}
                                                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                                                    placeholderType="logo" // Shows "PUP" text if image fails
                                                />
                                            </div>
                                            <CardHeader className="flex flex-1 flex-col p-3 sm:p-4">
                                                <HomeCardTitle className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900 transition-colors group-hover:text-[#7f1414] sm:text-base">
                                                    {card.title}
                                                </HomeCardTitle>
                                                <div className="my-2 h-[1px] w-full overflow-hidden bg-gray-200">
                                                    <div className="h-full w-full origin-left scale-x-0 bg-[#7f1414] transition-transform duration-300 group-hover:scale-x-100"></div>
                                                </div>
                                                <HomeCardDescription className="mb-2 line-clamp-3 min-h-[3.75rem] flex-1 text-xs text-gray-600 sm:text-sm">
                                                    {card.desc}
                                                </HomeCardDescription>

                                                {/* Learn More Text */}
                                                <div className="flex items-center gap-1 text-xs font-medium text-[#7f1414] transition-all duration-200 group-hover:gap-2">
                                                    <span>Learn more</span>
                                                    <svg
                                                        className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </CardHeader>
                                        </HomeCard>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div
                                ref={newsPaginationRef}
                                className={`mt-8 flex items-center justify-center gap-4 transition-all delay-300 duration-500 ease-out ${isNewsPaginationInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                            >
                                {/* Previous Button */}
                                <button
                                    onClick={handlePrevPage}
                                    disabled={newsPage === 0}
                                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${newsPage === 0
                                        ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                                        : 'border-gray-300 bg-white text-gray-700 hover:scale-102 hover:border-[#7f1414] hover:bg-gray-50 hover:text-[#7f1414]'
                                        }`}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span>Previous</span>
                                </button>

                                {/* Page Indicators */}
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setNewsPage(index)}
                                            className={`h-2 rounded-full transition-all duration-200 hover:scale-125 active:scale-90 ${index === newsPage ? 'w-8 bg-[#7f1414]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                                }`}
                                            aria-label={`Go to page ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={handleNextPage}
                                    disabled={newsPage === totalPages - 1}
                                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${newsPage === totalPages - 1
                                        ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                                        : 'border-gray-300 bg-white text-gray-700 hover:scale-102 hover:border-[#7f1414] hover:bg-gray-50 hover:text-[#7f1414]'
                                        }`}
                                >
                                    <span>Next</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* Page Counter */}
                        {totalPages > 1 && (
                            <p
                                className={`mt-4 text-center text-sm text-gray-500 transition-opacity delay-500 duration-500 ${isNewsPaginationInView ? 'opacity-100' : 'opacity-0'}`}
                            >
                                Showing {newsPage * POSTS_PER_PAGE + 1} - {Math.min((newsPage + 1) * POSTS_PER_PAGE, newsCards.length)} of{' '}
                                {newsCards.length} posts
                            </p>
                        )}
                    </div>
                </section>

                {/* News Item Dialog (CSS Transitions) */}
                {isNewsDialogOpen && selectedNewsItem && (
                    <div
                        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${isNewsDialogVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                        onClick={handleCloseNewsDialog}
                    >
                        <div
                            className={`relative mx-4 w-full max-w-2xl overflow-hidden rounded-3xl bg-white transition-all duration-200 ease-out ${isNewsDialogVisible ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-5 scale-95 opacity-0'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleCloseNewsDialog}
                                className="absolute top-6 right-6 z-10 rounded-full bg-white/80 p-2 transition-all duration-150 hover:scale-105 hover:bg-white active:scale-90"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5 text-gray-400 hover:text-[#7f1414]" />
                            </button>

                            {/* Image */}
                            <div className="relative h-64 w-full overflow-hidden sm:h-80">
                                <SafeImage
                                    src={selectedNewsItem.img}
                                    alt={selectedNewsItem.title}
                                    className="h-full w-full" // Converted
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-8">
                                <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{selectedNewsItem.title}</h2>

                                <p className="mb-6 leading-relaxed text-gray-700 sm:text-lg">{selectedNewsItem.desc}</p>

                                {/* Source Link */}
                                <a
                                    href={selectedNewsItem.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-[#7f1414] hover:bg-gray-50 hover:text-[#7f1414] active:scale-95"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span>View on Facebook</span>
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Audio-Video Section */}
                <section
                    ref={avpSectionRef}
                    className={`relative flex min-h-[80vh] w-full items-center justify-center py-16 transition-all duration-500 ease-out ${isAvpSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
                        style={{ backgroundImage: "url('/images/homepage-slides/1.jpg')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent"></div>
                    <div className="relative z-10 flex w-[85%] max-w-[1400px] flex-col items-center justify-center gap-16 lg:flex-row">
                        <div
                            ref={avpVideoRef}
                            className={`flex w-full justify-center transition-all duration-500 ease-out lg:w-[50%] ${isAvpVideoInView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
                        >
                            <div className="relative h-[250px] w-full overflow-hidden rounded-xl transition-transform duration-300 hover:scale-102 sm:h-[350px] sm:rounded-2xl md:h-[400px]">
                                <iframe
                                    className="h-full w-full"
                                    src={page?.video_link || 'https://www.youtube.com/embed/9ypv1kOj7CU?autoplay=0'}
                                    title={page?.video_title || 'Campus Audio-Visual Presentation'}
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
                            <h2 className="mb-3 text-xl font-bold text-[#7f1414] sm:mb-4 sm:text-2xl lg:text-[2rem]">
                                Campus Audio-Visual Presentation
                            </h2>
                            <p className="mb-3 text-base leading-relaxed text-gray-700 sm:mb-4 sm:text-lg lg:text-[1.15rem]">{page?.video_title}</p>
                            <p className="mb-6 text-sm text-gray-600 italic sm:mb-8 sm:text-base lg:text-[0.95rem]">{page?.video_description}</p>

                            <div className="flex justify-center lg:justify-start">
                                <ActionButton href={page?.video_link || '/'} icon={Play} external>
                                    Watch on YouTube
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Director's Message Section with Animations */}
                <section
                    ref={directorSectionRef}
                    className={`my-10 bg-white transition-all duration-500 ease-out ${isDirectorSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                >
                    <div className="mx-auto mb-12 max-w-4xl text-center">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">Message from the Campus Director</h2>
                        <p className="text-gray-600">A word of inspiration from our campus leadership.</p>
                    </div>

                    <div className="mx-auto flex w-[80%] max-w-[1000px] flex-col gap-2 lg:flex-row lg:items-stretch">
                        {/* Director's Image */}
                        <div
                            ref={directorImageRef}
                            className={`relative mx-auto h-[350px] w-[280px] shrink-0 overflow-hidden rounded-xl transition-all duration-500 ease-out lg:mx-0 ${isDirectorImageInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        >
                            <SafeImage
                                src={page?.director_image_path}
                                alt={page?.director_name || 'Campus Director'}
                                className="h-full w-full rounded-xl" // Converted
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#7f1414]/20 to-transparent" />
                        </div>

                        {/* Director's Message */}
                        <div
                            ref={directorMsgRef}
                            className={`flex flex-1 flex-col gap-4 rounded-xl border-2 border-[#7f1414] bg-[#7f1414] p-12 text-white transition-all delay-100 duration-500 ease-out hover:scale-101 hover:border-[#a71d1d] ${isDirectorMsgInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#a83232]/80">
                                <SafeImage
                                    src="/images/quote.png"
                                    alt="Quote Icon"
                                    className="h-4 w-4 object-contain" // Converted
                                />
                            </div>

                            <div className="scrollbar-thin scrollbar-thumb-white/20 max-h-[120px] overflow-y-auto pr-2">
                                <p className="text-left leading-relaxed">
                                    {page?.director_message}
                                </p>
                            </div>

                            <div className="mt-auto text-left">
                                <p className="font-semibold">{page?.director_name}</p>
                                <p className="text-sm opacity-90">Campus Director</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Accreditors Section with Card Animations */}
                <section
                    ref={accreditorSectionRef}
                    className={`my-10 flex w-full items-center justify-center transition-all duration-500 ease-out ${isAccreditorSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                >
                    <div className="flex w-[80%] max-w-[1200px] flex-col gap-12 rounded-xl border border-[#201e1e31] bg-white p-15 lg:flex-row">
                        {/* Left Column (Text) */}
                        <div
                            ref={accreditorContentRef}
                            className={`flex flex-1 flex-col justify-center gap-6 transition-all duration-500 ease-out ${isAccreditorContentInView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
                        >
                            <h2 className="text-3xl font-bold text-gray-900">
                                Welcome{' '}
                                {user?.roles?.role_name === 'Accreditor' && user.first_name && user.last_name
                                    ? user.first_name + ' ' + user.last_name
                                    : 'Accreditors'}
                                !
                            </h2>
                            <p className="leading-relaxed text-gray-700">
                                It is our honor to host you, esteemed accreditors, and we deeply appreciate your role in our continued success.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {['March 2025', 'Level II AACCUP Survey Visit'].map((tag, index) => (
                                    <span
                                        key={tag}
                                        className={`rounded-sm border border-[#201e1e31] px-8 py-2 text-sm font-medium text-[#7f1414] transition-all duration-300 hover:scale-105 ${isAccreditorContentInView ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
                                        style={{ transitionDelay: `${200 + index * 100}ms` }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right Column (Cards) */}
                        <div
                            ref={accreditorCardsRef}
                            className={`flex flex-1 flex-col gap-4 transition-all duration-500 ease-out md:flex-row ${isAccreditorCardsInView ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}
                        >
                            {[
                                {
                                    title: 'Academic Programs',
                                    desc: 'Learn more about the process, documents, and evaluation steps.',
                                    icon: (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 20l9-5-9-5-9 5 9 5zm0 0V10m0 10v-4"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    title: 'More Info',
                                    desc: 'Important details and updates for the accreditation visit.',
                                    icon: (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                                            />
                                        </svg>
                                    ),
                                },
                            ].map((card, index) => (
                                <a
                                    key={card.title}
                                    href="#"
                                    className={`flex flex-1 flex-col items-start gap-10 rounded-xl bg-[#7f1414] p-6 text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-102 hover:bg-[#a83232] active:scale-98 ${isAccreditorCardsInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 transition-all duration-200 group-hover:scale-110 group-hover:rotate-6">
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold">{card.title}</h3>
                                        <p className="text-sm opacity-90">{card.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Campus Map Section with Animations */}
                <section
                    ref={mapSectionRef}
                    className={`relative flex min-h-[80vh] w-full items-center justify-center py-16 transition-all duration-500 ease-out ${isMapSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
                        style={{ backgroundImage: "url('/images/homepage-slides/street-sj.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
                    <div className="relative z-10 flex w-[85%] max-w-[1400px] flex-col items-center justify-center gap-16 lg:flex-row">
                        <div
                            ref={mapContentRef}
                            className={`order-2 flex w-full flex-col justify-center text-center transition-all duration-500 ease-out lg:order-1 lg:w-[50%] lg:text-left ${isMapContentInView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
                        >
                            <h2 className="mb-4 text-[2.5vw] font-bold text-[#7f1414] lg:text-[2rem]">Explore Our Campus</h2>
                            <p className="mb-4 text-[1.15rem] leading-relaxed text-gray-700">
                                Our strategically located campus is designed to inspire learning and innovation. Tap the map to explore buildings,
                                facilities, and more.
                            </p>
                            <p className="mb-8 text-[0.95rem] text-gray-600 italic sm:mb-8 sm:text-base lg:text-[0.95rem]">
                                PUP San Juan, Pinaglabanan St., San Juan City
                            </p>

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

                {/* Show loading state */}
                {fbLoading && (
                    <div className="py-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7f1414] border-r-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading latest updates...</p>
                    </div>
                )}

                {/* Show error if API fails */}
                {fbError && <div className="py-4 text-center text-sm text-red-600">Using cached content. {fbError}</div>}
            </Layout>
        </>
    );
}
