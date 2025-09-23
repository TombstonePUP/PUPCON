import { useId, useState } from 'react';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';

interface AreaCardProps {
  imageSrc: string;
  heading: string;
  circleLetter?: string; // Roman numeral or room code
  href: string;
  className?: string;
}

export function AreaCard({
  imageSrc,
  heading,
  circleLetter,
  href,
  className = '',
}: AreaCardProps) {
  const headingId = useId();
  const [loading, setLoading] = useState(false);

  return (
    <Link
      href={href}
      prefetch
      onStart={() => setLoading(true)}
      onFinish={() => setLoading(false)}
      className="block"
    >
      {loading ? (
        <SkeletonCard />
      ) : (
        <div
          className={clsx(
            'group relative w-57 h-80 rounded-xl border border-[#7f1414]/30 bg-white',
            'overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.02] hover:border-[#7f1414]',
            className
          )}
        >
          {/* ---- Notch badge ---- */}
          {circleLetter && (
            <div
              className="
                absolute -top-1 -left-1 z-10 flex h-12 w-12
                items-center justify-center
                rounded-tl-xl rounded-br-xl
                bg-[#7f1414] text-lg font-extrabold text-white
                transition-transform duration-500 ease-out
                group-hover:scale-105
              "
            >
              {circleLetter}
            </div>
          )}

          {/* ---- Image header ---- */}
          <div className="h-36 w-full overflow-hidden rounded-t-xl">
            <img
              src={imageSrc}
              alt={heading}
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* ---- Body ---- */}
          <div className="relative flex h-[calc(100%-9rem)] flex-col px-4 pb-4">
            <div className="flex flex-1 items-center justify-center text-center">
              <h2
                id={headingId}
                className="text-base font-semibold text-[#7f1414] leading-snug"
              >
                {heading}
              </h2>
            </div>

            <div
              className="
                w-full rounded-md bg-[#7f1414]
                px-5 py-2 text-sm font-medium text-white
                transition-colors duration-300 ease-out text-center
                hover:bg-[#a01818] focus:outline-none focus:ring-2 focus:ring-[#7f1414]/50
              "
            >
              View
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}

/* ---------------- Skeleton Placeholder ---------------- */
function SkeletonCard() {
  return (
    <div className="w-57 h-80 rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse">
      <div className="h-36 w-full bg-gray-200 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
