import React from 'react';
import { X } from 'lucide-react';
import { SafeImage } from '../safe-image';
import { NewsCard } from './news-section';

interface NewsDialogProps {
    isOpen: boolean;
    isVisible: boolean;
    selectedNewsItem: NewsCard | null;
    handleClose: () => void;
}

export const NewsDialog = ({ isOpen, isVisible, selectedNewsItem, handleClose }: NewsDialogProps) => {
    if (!isOpen || !selectedNewsItem) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            onClick={handleClose}
        >
            <div
                className={`relative mx-4 w-full max-w-2xl overflow-hidden rounded-3xl bg-white transition-all duration-200 ease-out ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-5 scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-10 rounded-full bg-white/80 p-2 transition-all duration-150 hover:scale-105 hover:bg-white active:scale-90"
                    aria-label="Close"
                >
                    <X className="h-5 w-5 text-gray-400 hover:text-[#7f1414]" />
                </button>

                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden sm:h-80">
                    <SafeImage src={selectedNewsItem.img} alt={selectedNewsItem.title} className="h-full w-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900">{selectedNewsItem.title}</h2>
                    <p className="mb-6 leading-relaxed text-gray-700 sm:text-lg">{selectedNewsItem.desc}</p>

                    {/* Source Link */}
                    <a
                        href={selectedNewsItem.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[#7f1414] hover:bg-gray-50 hover:text-[#7f1414] active:scale-95"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>View on Facebook</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};
