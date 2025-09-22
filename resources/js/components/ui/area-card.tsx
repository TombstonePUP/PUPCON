import { useId } from 'react';
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

  return (
    <div
      className={clsx(
        'group relative w-64 h-80 rounded-xl border border-[#7f1414]/30 bg-white',
        'overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.02] hover:border-[#7f1414]',
        className
      )}
    >
      {/* ---- Notch badge (fixed opacity) ---- */}
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
      <div className="h-36 w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={heading}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* ---- Body ---- */}
      <div className="flex h-[calc(100%-9rem)] flex-col items-center justify-between px-4 py-6 text-center">
        <h2
          id={headingId}
          className="text-base font-semibold text-[#7f1414] leading-snug"
        >
          {heading}
        </h2>

        <Link
          href={href}
          className="
            mt-4 w-full rounded-md bg-[#7f1414]
            px-5 py-2 text-sm font-medium text-white
            transition-colors duration-300 ease-out
            hover:bg-[#a01818] focus:outline-none focus:ring-2 focus:ring-[#7f1414]/50
          "
        >
          View
        </Link>
      </div>
    </div>
  );
}
