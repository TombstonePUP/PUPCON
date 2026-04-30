import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ✅ Video Section
const VideoSection: React.FC<{ loading: boolean }> = ({ loading }) => {
    return (
        <div className="flex-1">
            {loading ? (
                <Skeleton height={300} borderRadius={16} />
            ) : (
                <iframe
                    className="h-[300px] w-full rounded-xl"
                    src="https://www.youtube.com/embed/9ypv1kOj7CU"
                    title="Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            )}
        </div>
    );
};

// ✅ Text Section
const TextSection: React.FC<{ loading: boolean }> = ({ loading }) => {
    return (
        <div className="flex-1">
            {loading ? (
                <div className="space-y-4">
                    <Skeleton height={40} width="80%" />
                    <Skeleton count={3} />
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-[#7f1414]">Campus Audio-Visual Presentation</h1>
                    <p className="mt-4 text-gray-700">A Leading Comprehensive Polytechnic University in Asia</p>
                    <p className="mt-2 text-sm text-gray-600 italic">
                        Discover the roadmap that shapes our future — goals, strategies, and developments.
                    </p>
                </>
            )}
        </div>
    );
};

// ✅ Main Page
const UiTesting: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isDesktop, setIsDesktop] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    // check screen size
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024); // tailwind lg breakpoint
        };
        handleResize(); // run on load
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <motion.section
            className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <SkeletonTheme baseColor="#d1d5db" highlightColor="#e5e7eb">
                {/* First block */}
                <div className="mb-12 flex w-full max-w-4xl flex-col gap-10 lg:flex-row">
                    {isDesktop && <VideoSection loading={loading} />}
                    <TextSection loading={loading} />
                </div>

                {/* Second block (goes below first) */}
                <div className="flex w-full max-w-4xl flex-col gap-10 lg:flex-row">
                    {isDesktop && <VideoSection loading={loading} />}
                    <TextSection loading={loading} />
                </div>
            </SkeletonTheme>
        </motion.section>
    );
};

export default UiTesting;
