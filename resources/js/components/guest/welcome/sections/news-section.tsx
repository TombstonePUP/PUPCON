import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { HomeCard, CardHeader, HomeCardTitle, HomeCardDescription } from '../home-card';
import { SafeImage } from '../safe-image';

export interface NewsCard {
    title: string;
    img: string;
    desc: string;
    source: string;
}

interface NewsSectionProps {
    newsCards: NewsCard[];
    newsPage: number;
    totalPages: number;
    currentPosts: NewsCard[];
    handlePrevPage: () => void;
    handleNextPage: () => void;
    setNewsPage: (page: number) => void;
    handleOpenNewsDialog: (card: NewsCard) => void;
    postsPerPage: number;
}

export const NewsSection = ({
    newsCards,
    newsPage,
    totalPages,
    currentPosts,
    handlePrevPage,
    handleNextPage,
    setNewsPage,
    handleOpenNewsDialog,
    postsPerPage,
}: NewsSectionProps) => {
    const [newsSectionRef, isNewsSectionInView] = useInView({ threshold: 0.1 }, true);
    const [newsCardsRef, isNewsCardsInView] = useInView({ threshold: 0.1 }, true);
    const [newsPaginationRef, isNewsPaginationInView] = useInView({ threshold: 0.1 }, true);

    return (
        <section ref={newsSectionRef} className="flex w-full flex-col items-center justify-center gap-7 bg-gray-50 px-6 py-12">
            <div
                className={`flex flex-col items-center px-4 text-center transition-all duration-500 ease-out ${isNewsSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
            >
                <h2 className="font-montserrat mb-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">What's New on Campus</h2>
                <p className="text-sm text-gray-600">Catch up on events, announcements, and campus highlights.</p>
            </div>

            <div ref={newsCardsRef} className="grid w-full max-w-6xl place-items-center">
                <div className="grid w-[70%] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-2 xl:w-full xl:grid-cols-4 xl:px-0">
                    {currentPosts.map((card, i) => (
                        <div
                            key={`${newsPage}-${i}`}
                            className={`transition-all duration-300 ease-out ${isNewsCardsInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <div className="h-full cursor-pointer transition-all duration-200" onClick={() => handleOpenNewsDialog(card)}>
                                <HomeCard className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200">
                                    <div className="h-40 w-full overflow-hidden sm:h-48">
                                        <SafeImage
                                            src={card.img}
                                            alt={card.title}
                                            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                                            placeholderType="logo"
                                        />
                                    </div>
                                    <CardHeader className="flex flex-1 flex-col p-3 sm:p-4">
                                        <HomeCardTitle className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-[#7f1414] sm:text-base">
                                            {card.title}
                                        </HomeCardTitle>
                                        <div className="my-2 h-px w-full origin-left scale-x-0 bg-[#7f1414] transition-transform duration-300 group-hover:scale-x-100"></div>
                                        <HomeCardDescription className="mb-2 line-clamp-3 min-h-[3.75rem] flex-1 text-xs text-gray-600 sm:text-sm">
                                            {card.desc}
                                        </HomeCardDescription>

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

                {totalPages > 1 && (
                    <div
                        ref={newsPaginationRef}
                        className={`mt-8 flex items-center justify-center gap-4 transition-all delay-300 duration-500 ease-out ${isNewsPaginationInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                    >
                        <button
                            onClick={handlePrevPage}
                            disabled={newsPage === 0}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
                                newsPage === 0
                                    ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                                    : 'border-gray-300 bg-white text-gray-700 hover:scale-102 hover:bg-gray-50 hover:text-[#7f1414]'
                            }`}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setNewsPage(index)}
                                    className={`h-2 rounded-full transition-all duration-200 hover:scale-125 active:scale-90 ${
                                        index === newsPage ? 'w-8 bg-[#7f1414]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={newsPage === totalPages - 1}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
                                newsPage === totalPages - 1
                                    ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                                    : 'border-gray-300 bg-white text-gray-700 hover:scale-102 hover:bg-gray-50 hover:text-[#7f1414]'
                            }`}
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {totalPages > 1 && (
                    <p
                        className={`text-muted-foreground mt-4 text-center text-sm transition-opacity delay-500 duration-500 ${isNewsPaginationInView ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Showing {newsPage * postsPerPage + 1} - {Math.min((newsPage + 1) * postsPerPage, newsCards.length)} of{' '}
                        {newsCards.length} posts
                    </p>
                )}
            </div>
        </section>
    );
};
