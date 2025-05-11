import { useId } from 'react';
import { Link } from '@inertiajs/react';

interface AreaCard {
    imageSrc: string;
    heading: string;
    circleLetter?: string;
    href: string;
    className?: string;
}

export function AreaCard({
    imageSrc,
    heading,
    circleLetter,
    href,
    className = '',
}: AreaCard) {
    const headingId = useId();

    return (
        <div
            className={`border-[0.1vw] border-[#7f1414] rounded-[0.5vw] flex flex-col w-fit h-fit p-[0.5vw] items-center ${className}`}
        >
            <img
                className="rounded-[0.5vw] w-[12vw] h-[8vw] object-cover"
                src={imageSrc}
                alt="placeholder"
                draggable={false}
            />

            <h1
                className="font-black text-[#7f1414] w-[12vw] h-[6vw] grid place-items-center text-center text-[1vw] 
                relative before:content-[attr(data-circle)] before:text-white before:text-[1.3vw] before:pt-[0.3vw] 
                before:font-black before:top-[-1.5vw] before:absolute before:w-[2.8vw] before:h-[2.8vw] 
                before:rounded-full before:bg-[#7f1414] before:shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
                data-circle={circleLetter}
                id={headingId}
            >
                {heading}
            </h1>

            <Link
                className="text-white text-[0.8vw] text-center rounded-[1vw] bg-[#7f1414] w-full py-[0.2vw] hover:bg-[#7f1414cf]"
                href={href}
            >
                View
            </Link>
        </div>
    );
}
