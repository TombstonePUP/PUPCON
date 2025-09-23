import { CardHeader, CardImage, HomeCard, HomeCardDescription, HomeCardTitle } from '@/components/ui/card';
import Layout from '@/layouts/landing-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Calendar, GraduationCap, Play, MapPin } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Simple Image Component with prefetching
const ImageWithPreload = React.memo(({ src, alt, className, priority = false, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(priority);
    const imgRef = useRef();

    useEffect(() => {
        if (!shouldLoad) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setShouldLoad(true);
                        observer.disconnect();
                    }
                },
                { rootMargin: '100px' }
            );
            if (imgRef.current) observer.observe(imgRef.current);
            return () => observer.disconnect();
        }
    }, [shouldLoad]);

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
            {shouldLoad ? (
                <>
                    {!isLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <img
                        src={src}
                        alt={alt}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setIsLoaded(true)}
                        loading={priority ? 'eager' : 'lazy'}
                        {...props}
                    />
                </>
            ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
        </div>
    );
});

// Simple Action Button
const ActionButton = ({ href, children, icon: Icon, external = false, ...props }) => {
    const Component = external ? 'a' : Link;
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    
    return (
        <Component
            href={href}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold bg-[#7f1414] border-2 border-[#7f1414] text-white hover:bg-[#6b1111] transition-colors duration-200"
            {...externalProps}
            {...props}
        >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{children}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </Component>
    );
};

// Simple Carousel Component
const SimpleCarousel = ({ images }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        // Preload all images
        images.forEach((src, index) => {
            if (index > 0) { // First image already preloaded in Head
                const img = new Image();
                img.src = src;
            }
        });

        // Auto-advance carousel
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [images]);

    return (
        <div className="absolute inset-0">
            {images.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={src}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />
                </div>
            ))}
        </div>
    );
};

export default function Welcome() {
    const [showModal, setShowModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPageReady, setIsPageReady] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const images = useMemo(() => [
        '/images/homepage-slides/1.png', 
        '/images/homepage-slides/4.jpg', 
        '/images/homepage-slides/6.jpg'
    ], []);

    const newsCards = useMemo(() => [
        {
            title: 'PUPSJ PUPCET',
            img: '/images/pupcet.jpg',
            desc: 'The PUPSJ PUPCET Online Application for Academic Year 2025-2026 starts on December 15, 2024 - April 15, 2025.',
        },
        {
            title: 'CPALE 2024 Passers',
            img: '/images/cpale.jpg',
            desc: 'Pagpupugay sa bagong CPA ng ating Sintang Paaralan.',
        },
        {
            title: 'Mental Health Matters',
            img: '/images/mental.jpg',
            desc: 'The OCPS A School Adjustment Program (ASAP) is here to help you thrive! This infographic offers easy-to-follow tips for boosting your well-being.',
        },
        {
            title: 'Ceremonial Signing',
            img: '/images/ceremony.jpg',
            desc: 'A groundbreaking partnership between PUP San Juan City and the Research Synergy Foundation!',
        },
    ], []);

    // Snappy animation variants
    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.1,
                delayChildren: 0.2,
            },
        },
    }), [shouldReduceMotion]);

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0.1 : 0.3,
                ease: "easeOut",
            },
        },
    }), [shouldReduceMotion]);

    // Initialize page
    useEffect(() => {
        setIsPageReady(true);
    }, []);

    // Show welcome modal once per session
    useEffect(() => {
        if (isPageReady) {
            const visited = sessionStorage.getItem('welcomeModalShown');
            if (!visited) {
                setTimeout(() => {
                    setShowModal(true);
                    setIsModalVisible(true);
                    sessionStorage.setItem('welcomeModalShown', 'true');
                }, 1000);
            }
        }
    }, [isPageReady]);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => setShowModal(false), 200);
    }, []);

    const handleSelectType = useCallback((type) => {
        setIsModalVisible(false);
        setTimeout(() => setShowModal(false), 200);
        
        if (type === 'faculty' || type === 'accreditor') {
            router.visit('/login', { 
                method: 'get',
                data: { role: type }
            });
        }
    }, []);

    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <link rel="preload" href="/images/homepage-slides/1.png" as="image" />
            </Head>

            <Layout>
                {/* Hero Section with Animated Carousel */}
                <motion.div 
                    className="relative h-[85vh] w-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPageReady ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <SimpleCarousel images={images} />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#800000]/100 to-transparent"></div>

                    {/* Content Overlay with Animations */}
                    <motion.div 
                        className="absolute inset-0 z-20 grid w-full grid-cols-1 px-12 pr-10 pl-70 text-white md:grid-cols-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isPageReady ? "visible" : "hidden"}
                    >
                        <div className="flex flex-col justify-center space-y-6">
                            <motion.img 
                                src="/images/pupsj_motto.png" 
                                alt="Logo" 
                                className="h-auto w-120"
                                variants={itemVariants}
                            />
                            <motion.h2 
                                className="text-2xl italic"
                                variants={itemVariants}
                            >
                                Years of academic excellence and service
                            </motion.h2>

                            <motion.div 
                                className="mt-10 flex flex-wrap gap-4"
                                variants={itemVariants}
                            >
                                {[
                                    { icon: BookOpen, text: "Programs", primary: true },
                                    { icon: Calendar, text: "Events" },
                                    { icon: GraduationCap, text: "Academe" }
                                ].map((btn) => (
                                    <motion.button
                                        key={btn.text}
                                        className={btn.primary 
                                            ? "flex items-center space-x-2 rounded-md bg-white px-6 py-2 font-semibold text-black transition-all duration-200 hover:bg-gray-100"
                                            : "flex items-center space-x-2 rounded-md border border-gray-300/70 bg-white/10 px-6 py-2 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-gray-200 hover:bg-white/20"
                                        }
                                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                                    >
                                        <btn.icon className="h-5 w-5" />
                                        <span>{btn.text}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Welcome Modal with Enhanced Animations */}
                {showModal && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isModalVisible ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleCloseModal}
                    >
                        <motion.div 
                            className="relative w-full max-w-4xl mx-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                                opacity: isModalVisible ? 1 : 0,
                                scale: isModalVisible ? 1 : 0.9
                            }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200/50">
                                {/* Animated background elements */}
                                {!shouldReduceMotion && (
                                    <>
                                        <motion.div 
                                            className="absolute -top-20 -right-20 w-40 h-40 bg-[#7f1414]/5 rounded-full blur-3xl"
                                            animate={{ 
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{ 
                                                duration: 4, 
                                                repeat: Infinity, 
                                                ease: "easeInOut" 
                                            }}
                                        />
                                        <motion.div 
                                            className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"
                                            animate={{ 
                                                scale: [1.2, 1, 1.2],
                                                opacity: [0.2, 0.5, 0.2]
                                            }}
                                            transition={{ 
                                                duration: 3, 
                                                repeat: Infinity, 
                                                ease: "easeInOut",
                                                delay: 1
                                            }}
                                        />
                                    </>
                                )}
                                
                                {/* Close Button */}
                                <motion.button
                                    onClick={handleCloseModal}
                                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
                                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
                                    aria-label="Close"
                                >
                                    <svg className="w-5 h-5 text-gray-400 hover:text-[#7f1414] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>

                                <div className="relative p-12">
                                    <div className="grid gap-12 md:grid-cols-2 items-center">
                                        {/* Left: Logo + Welcome */}
                                        <motion.div 
                                            className="flex flex-col items-center justify-center space-y-6 text-center"
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                                        >
                                            <motion.div 
                                                className="relative"
                                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <img src="/images/pupcon-logo.png" alt="PUP Logo" className="h-24 w-auto" />
                                                {!shouldReduceMotion && (
                                                    <motion.div 
                                                        className="absolute inset-0 w-24 h-24 bg-[#7f1414]/20 rounded-2xl blur-xl mx-auto"
                                                        animate={{ 
                                                            scale: [1, 1.1, 1],
                                                            opacity: [0.3, 0.6, 0.3]
                                                        }}
                                                        transition={{ 
                                                            duration: 2, 
                                                            repeat: Infinity, 
                                                            ease: "easeInOut" 
                                                        }}
                                                    />
                                                )}
                                            </motion.div>
                                            
                                            <motion.div 
                                                className="space-y-3"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4, duration: 0.3 }}
                                            >
                                                <h2 className="text-4xl font-bold bg-[#7f1414] bg-clip-text text-transparent">
                                                    Mabuhay!
                                                </h2>
                                                <p className="text-gray-600 text-lg">Welcome to PUP San Juan</p>
                                            </motion.div>
                                        </motion.div>

                                        {/* Right: Role Selection */}
                                        <motion.div 
                                            className="space-y-6"
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                                        >
                                            <div className="text-center mb-8">
                                                <h3 className="text-xl font-semibold text-black-900 mb-2">Select your role to continue</h3>
                                                <p className="text-gray-500">Choose the option that best describes you</p>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    {
                                                        key: 'faculty',
                                                        title: 'Faculty',
                                                        desc: 'Administrators & Department Chairs',
                                                        icon: (
                                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0118 12.08v.42a12.08 12.08 0 01-6 10.392A12.08 12.08 0 016 12.5v-.42a12.083 12.083 0 01-.16-.902L12 14z" />
                                                            </svg>
                                                        )
                                                    },
                                                    {
                                                        key: 'accreditor',
                                                        title: 'Accreditor',
                                                        desc: 'Evaluation Team Members',
                                                        icon: (
                                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )
                                                    }
                                                ].map((role, index) => (
                                                    <motion.button
                                                        key={role.key}
                                                        onClick={() => handleSelectType(role.key)}
                                                        className="group w-full flex items-center p-6 rounded-2xl border border-gray-200 bg-white/80 hover:bg-white hover:border-[#7f1414] transition-colors duration-200"
                                                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                                                    >
                                                        <motion.div 
                                                            className="flex-shrink-0 w-14 h-14 bg-[#7f1414] rounded-xl flex items-center justify-center"
                                                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {role.icon}
                                                        </motion.div>
                                                        <div className="ml-6 text-left">
                                                            <h4 className="text-lg font-semibold text-gray-800 group-hover:text-[#7f1414] transition-colors duration-200">{role.title}</h4>
                                                            <p className="text-gray-500 text-sm">{role.desc}</p>
                                                        </div>
                                                        <svg className="ml-auto w-5 h-5 text-gray-400 group-hover:text-[#7f1414] group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </motion.button>
                                                ))}

                                                {/* Guest/Student Role */}
                                                <motion.button
                                                    onClick={() => handleSelectType('guest')}
                                                    className="group w-full rounded-2xl bg-[#7f1414] p-6 text-white transition-colors duration-200 hover:bg-[#6b1111]"
                                                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.7, duration: 0.3 }}
                                                >
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <motion.svg 
                                                            className="w-6 h-6" 
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            viewBox="0 0 24 24"
                                                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </motion.svg>
                                                        <span className="text-lg font-semibold">Continue as Guest / Student</span>
                                                        <motion.svg 
                                                            className="w-5 h-5" 
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            viewBox="0 0 24 24"
                                                            whileHover={{ x: shouldReduceMotion ? 0 : 5 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </motion.svg>
                                                    </div>
                                                </motion.button>
                                            </div>

                                            <motion.div 
                                                className="text-center pt-4"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8, duration: 0.3 }}
                                            >
                                                <p className="text-xs text-gray-400">
                                                    By continuing, you agree to our terms and conditions
                                                </p>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* News Section with Staggered Animations */}
                <motion.section
                    className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-20 bg-gray-50 px-6 py-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    <motion.div 
                        className="flex flex-col items-center text-center"
                        variants={itemVariants}
                    >
                        <h2 className="text-3xl font-bold text-gray-900">What's New on Campus</h2>
                        <p className="mt-2 text-lg text-gray-600">Catch up on events, announcements, and campus highlights.</p>
                    </motion.div>

                    {/* News Cards with enhanced hover effects */}
                    <div className="flex flex-row flex-wrap justify-center gap-8">
                        {newsCards.map((card, i) => (
                            <motion.div
                                key={i}
                                className="w-[18vw]"
                                variants={itemVariants}
                            >
                                <Link href="/">
                                    <motion.div
                                        whileHover={{ 
                                            scale: shouldReduceMotion ? 1 : 1.02,
                                            y: shouldReduceMotion ? 0 : -5
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <HomeCard className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors duration-200 hover:border-[#7f1414]">
                                            <div className="h-48 w-full overflow-hidden">
                                                <ImageWithPreload 
                                                    src={card.img} 
                                                    alt={card.title}
                                                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <CardHeader className="p-4">
                                                <HomeCardTitle className="font-semibold text-gray-900 transition-colors group-hover:text-[#7f1414]">
                                                    {card.title}
                                                </HomeCardTitle>
                                                <div className="my-2 h-[1px] w-full overflow-hidden bg-gray-200">
                                                    <div className="h-full w-full origin-left scale-x-0 bg-[#7f1414] transition-transform duration-300 group-hover:scale-x-100"></div>
                                                </div>
                                                <HomeCardDescription className="text-sm text-gray-600">{card.desc}</HomeCardDescription>
                                            </CardHeader>
                                        </HomeCard>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Video Section with Animations */}
                <motion.section
                    className="relative flex min-h-[80vh] w-full items-center justify-center py-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true, margin: "100px" }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
                        style={{ backgroundImage: "url('/images/homepage-slides/1.jpg')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent"></div>
                    <div className="relative z-10 flex w-[85%] max-w-[1400px] flex-col items-center justify-center gap-16 lg:flex-row">
                        <motion.div 
                            className="flex w-full justify-center lg:w-[50%]"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <motion.div 
                                className="relative h-[400px] w-full overflow-hidden rounded-2xl"
                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <iframe
                                    className="h-full w-full"
                                    src="https://www.youtube.com/embed/9ypv1kOj7CU?autoplay=0"
                                    title="PUPSJ AVP 2024"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </motion.div>
                        </motion.div>
                        
                        <motion.div 
                            className="flex w-full flex-col justify-center text-center lg:w-[50%] lg:text-left"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="mb-4 text-[2.5vw] font-bold text-[#7f1414] lg:text-[2rem]">
                                Campus Audio-Visual Presentation
                            </h2>
                            <p className="mb-4 text-[1.15rem] leading-relaxed text-gray-700">
                                A Leading Comprehensive Polytechnic University in Asia
                            </p>
                            <p className="mb-8 text-[0.95rem] text-gray-600 italic">
                                Discover the roadmap that shapes our future — goals, strategies, and developments leading PUP into a new era of excellence.
                            </p>
                            
                            <motion.div
                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ActionButton
                                    href="https://www.youtube.com/watch?v=0n1dd1XZ9F8"
                                    icon={Play}
                                    external
                                >
                                    Watch on YouTube
                                </ActionButton>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Director's Message Section with Animations */}
                <motion.section
                    className="bg-white py-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true, margin: "100px" }}
                >
                    <motion.div 
                        className="mx-auto mb-12 max-w-4xl text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">Message from the Campus Director</h2>
                        <p className="text-gray-600">A word of inspiration from our campus leadership.</p>
                    </motion.div>

                    <motion.div 
                        className="mx-auto flex w-[80%] max-w-[1000px] flex-col gap-2 lg:flex-row lg:items-stretch"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        {/* Director's Image */}
                        <motion.div 
                            className="relative mx-auto h-[350px] w-[280px] shrink-0 overflow-hidden rounded-xl lg:mx-0"
                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ImageWithPreload 
                                src="/images/adfa-new/Cecilia-R.-Alagon.jpg" 
                                alt="Director" 
                                className="h-full w-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#7f1414]/20 to-transparent" />
                        </motion.div>

                        {/* Director's Message */}
                        <motion.div 
                            className="flex flex-1 flex-col gap-4 rounded-xl bg-[#7f1414] p-12 text-white border-2 border-[#7f1414] transition-colors duration-200 hover:border-[#a71d1d]"
                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#a83232]/80">
                                <ImageWithPreload 
                                    src="/images/quote.png" 
                                    alt="Quote Icon" 
                                    className="h-4 w-4 object-contain"
                                />
                            </div>

                            <div className="max-h-[120px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                                <p className="text-left leading-relaxed">
                                    Welcome to PUP San Juan! As the Campus Director, I am proud to see our institution thrive through innovation,
                                    collaboration, and excellence. We continue to build a community that uplifts each learner and shapes the future of
                                    education. Maraming salamat sa inyong suporta!
                                </p>
                            </div>
                            
                            <div className="mt-auto text-left">
                                <p className="font-semibold">Dr. Cecilia R. Alagon</p>
                                <p className="text-sm opacity-90">Campus Director</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Accreditors Section with Card Animations */}
                <motion.section
                    className="w-full items-center justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true, margin: "100px" }}
                >
                    <section className="flex h-[50vh] items-center justify-center">
                        <div className="flex w-[80%] max-w-[1200px] flex-col gap-12 rounded-xl border border-[#201e1e31] bg-white p-15 lg:flex-row">
                            {/* Left Column (Text) */}
                            <motion.div 
                                className="flex flex-1 flex-col justify-center gap-6"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-bold text-gray-900">Welcome Accreditors!</h2>
                                <p className="leading-relaxed text-gray-700">
                                    It is our honor to host you, esteemed accreditors, and we deeply appreciate your role in our continued success.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {['March 2025', 'Level II AACCUP Survey Visit'].map((tag, index) => (
                                        <motion.span
                                            key={tag}
                                            className="rounded-sm border border-[#201e1e31] px-8 py-2 text-sm font-medium text-[#7f1414]"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Right Column (Cards) */}
                            <motion.div 
                                className="flex flex-1 flex-col gap-4 md:flex-row"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                {[
                                    {
                                        title: "Academic Programs",
                                        desc: "Learn more about the process, documents, and evaluation steps.",
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5zm0 0V10m0 10v-4" />
                                            </svg>
                                        )
                                    },
                                    {
                                        title: "More Info",
                                        desc: "Important details and updates for the accreditation visit.",
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                                            </svg>
                                        )
                                    }
                                ].map((card, index) => (
                                    <motion.a
                                        key={card.title}
                                        href="#"
                                        className="flex flex-1 flex-col items-start gap-10 rounded-xl bg-[#7f1414] p-6 text-white transition-colors duration-200 hover:bg-[#a83232]"
                                        whileHover={{ 
                                            scale: shouldReduceMotion ? 1 : 1.02,
                                            y: shouldReduceMotion ? 0 : -3
                                        }}
                                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <motion.div 
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20"
                                            whileHover={{ 
                                                scale: shouldReduceMotion ? 1 : 1.1,
                                                rotate: shouldReduceMotion ? 0 : 5 
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {card.icon}
                                        </motion.div>
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold">{card.title}</h3>
                                            <p className="text-sm opacity-90">{card.desc}</p>
                                        </div>
                                    </motion.a>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                </motion.section>

                {/* Campus Map Section with Animations */}
                <motion.section
                    className="relative flex min-h-[80vh] w-full items-center justify-center py-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true, margin: "100px" }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
                        style={{ backgroundImage: "url('/images/homepage-slides/street-sj.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
                    <div className="relative z-10 flex w-[85%] max-w-[1400px] flex-col items-center justify-center gap-16 lg:flex-row">
                        <motion.div 
                            className="order-2 flex w-full flex-col justify-center text-center lg:order-1 lg:w-[50%] lg:text-left"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="mb-4 text-[2.5vw] font-bold text-[#7f1414] lg:text-[2rem]">
                                Explore Our Campus
                            </h2>
                            <p className="mb-4 text-[1.15rem] leading-relaxed text-gray-700">
                                Our strategically located campus is designed to inspire learning and innovation. Tap the map to explore buildings,
                                facilities, and more.
                            </p>
                            <p className="mb-8 text-[0.95rem] text-gray-600 italic">
                                PUP San Juan, Pinaglabanan St., San Juan City
                            </p>
                            
                            <motion.div
                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ActionButton
                                    href="https://maps.app.goo.gl/KLfy768XRV4DXY9t7"
                                    icon={MapPin}
                                    external
                                >
                                    View Full Map
                                </ActionButton>
                            </motion.div>
                        </motion.div>
                        
                        <motion.div 
                            className="order-1 flex w-full justify-center lg:order-2 lg:w-[50%]"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <motion.div 
                                className="relative h-[400px] w-full overflow-hidden rounded-2xl"
                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <iframe
                                    className="h-full w-full border-0"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.6352821614245!2d121.03989456028415!3d14.594374852740119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c82e63228c75%3A0xf48b60882ff9710a!2sPolytechnic%20University%20of%20the%20Philippines%20-%20San%20Juan!5e0!3m2!1sen!2sph!4v1749228865968!5m2!1sen!2sph"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>
            </Layout>
        </>
    );
}