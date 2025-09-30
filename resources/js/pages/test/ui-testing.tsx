import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UiTesting: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center bg-gray-100 p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-10 lg:flex-row">
        {/* Left side: video */}
        <div className="flex-1">
          {loading ? (
            <Skeleton height={300} borderRadius={16} />
          ) : (
            <iframe
              className="w-full h-[300px] rounded-xl"
              src="https://www.youtube.com/embed/9ypv1kOj7CU"
              title="Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* Right side: text */}
        <div className="flex-1">
          {loading ? (
            <div className="space-y-4">
              <Skeleton height={40} width="80%" />
              <Skeleton count={3} />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#7f1414]">
                Campus Audio-Visual Presentation
              </h1>
              <p className="mt-4 text-gray-700">
                A Leading Comprehensive Polytechnic University in Asia
              </p>
              <p className="mt-2 text-sm text-gray-600 italic">
                Discover the roadmap that shapes our future — goals, strategies, and developments.
              </p>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default UiTesting;
