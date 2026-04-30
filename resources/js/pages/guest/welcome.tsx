import useFacebookFeed from '@/hooks/useFacebookFeed';
import Layout from '@/layouts/guest/landing-layout';
import { CampusGallery, ContentPages } from '@/types/content';
import { Head, usePage } from '@inertiajs/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Modularized Components
import { HeroSection } from '@/components/guest/welcome/sections/hero-section';
import { NewsSection, NewsCard } from '@/components/guest/welcome/sections/news-section';
import { NewsDialog } from '@/components/guest/welcome/sections/news-dialog';
import { AvpSection } from '@/components/guest/welcome/sections/avp-section';
import { DirectorSection } from '@/components/guest/welcome/sections/director-section';
import { AccreditorSection } from '@/components/guest/welcome/sections/accreditor-section';
import { MapSection } from '@/components/guest/welcome/sections/map-section';

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

export default function Welcome({ page, carousel_images }: LandingProps) {
    const [isPageReady, setIsPageReady] = useState(false);
    const [selectedNewsItem, setSelectedNewsItem] = useState<NewsCard | null>(null);
    const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
    const [isNewsDialogVisible, setIsNewsDialogVisible] = useState(false);
    const [newsPage, setNewsPage] = useState(0);

    const { props: { auth } } = usePage() as { props: { auth: Auth } };
    const user = auth?.user;

    const { posts: fbPosts, loading: fbLoading, error: fbError } = useFacebookFeed(8);

    const animationStyles = `
        @keyframes pulse-bg-1 {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes pulse-bg-2 {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.03); }
        }
        .animate-pulse-bg-1 { animation: pulse-bg-1 3s ease-in-out infinite; }
        .animate-pulse-bg-2 { animation: pulse-bg-2 2.5s ease-in-out 0.5s infinite; }
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.2) transparent; }
        .scrollbar-thumb-white\\/20::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar { width: 5px; }
        .rounded-inherit { border-radius: inherit; }
    `;

    const newsCards = useMemo(() => {
        if (fbLoading || fbError || !fbPosts.length) {
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

        return fbPosts.map((post) => ({
            title: post.message?.split('\n')[0]?.substring(0, 50) + '...' || 'PUP San Juan Update',
            img: post.image || '/images/pupsj-placeholder.png',
            desc: post.message?.substring(0, 150) + '...' || 'Check out our latest update!',
            source: post.permalink || 'https://www.facebook.com/PUPSJStudentAssembly',
        }));
    }, [fbPosts, fbLoading, fbError]);

    const POSTS_PER_PAGE = window.innerWidth <= 768 ? 2 : 4;
    const totalPages = Math.ceil(newsCards.length / POSTS_PER_PAGE);
    const currentPosts = newsCards.slice(newsPage * POSTS_PER_PAGE, (newsPage + 1) * POSTS_PER_PAGE);

    const handleNextPage = () => { if (newsPage < totalPages - 1) setNewsPage(newsPage + 1); };
    const handlePrevPage = () => { if (newsPage > 0) setNewsPage(newsPage - 1); };

    useEffect(() => { setIsPageReady(true); }, []);

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

    const carousel_paths = carousel_images.map((img) => img.image_path);

    return (
        <>
            <Head title="PUP San Juan">
                <link rel="preload" href={carousel_images[0]?.image_path || '/images/landing/1.png'} as="image" />
            </Head>

            <style>{animationStyles}</style>

            <Layout>
                <HeroSection carousel_paths={carousel_paths} />

                <NewsSection 
                    newsCards={newsCards}
                    newsPage={newsPage}
                    totalPages={totalPages}
                    currentPosts={currentPosts}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                    setNewsPage={setNewsPage}
                    handleOpenNewsDialog={handleOpenNewsDialog}
                    postsPerPage={POSTS_PER_PAGE}
                />

                <NewsDialog 
                    isOpen={isNewsDialogOpen}
                    isVisible={isNewsDialogVisible}
                    selectedNewsItem={selectedNewsItem}
                    handleClose={handleCloseNewsDialog}
                />

                <AvpSection 
                    videoLink={page?.video_link}
                    videoTitle={page?.video_title}
                    videoDescription={page?.video_description}
                />

                <DirectorSection 
                    directorName={page?.director_name}
                    directorMessage={page?.director_message}
                    directorImagePath={page?.director_image_path}
                />

                <AccreditorSection user={user} />

                <MapSection />

                {fbLoading && (
                    <div className="py-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7f1414] border-r-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading latest updates...</p>
                    </div>
                )}

                {fbError && <div className="py-4 text-center text-sm text-red-600">Using cached content. {fbError}</div>}
            </Layout>
        </>
    );
}
