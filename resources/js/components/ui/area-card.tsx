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
            className={`border group border-[#7f1414]/25 hover:border-[#7f1414] transition duration-300 rounded-[0.5vw] flex flex-col w-fit h-fit p-[0.5vw] items-center bg-white ${className}`}
        >
            <div className='overflow-hidden rounded-xl'>
            <img
                className="duration-300 transition w-[12vw] h-[8vw] object-cover group-hover:scale-110"
                src={imageSrc}
                alt="placeholder"
                draggable={false}
            />
            </div>

            <h1
                className="font-bold text-[#7f1414] w-[12vw] h-[6vw] grid place-items-center text-center
                relative before:content-[attr(data-circle)] before:text-white before:text-xl before:pt-[0.65vw] 
                before:font-bold before:top-[-1.5vw] before:absolute before:w-[2.8vw] before:h-[2.8vw] before:pt-10
                before:rounded-full before:bg-[#7f1414]"
                data-circle={circleLetter}
                id={headingId}
            >
                <p className='leading-tight my-4 text-l px-2'>{heading}</p>
                
            </h1>

            <Link
                className="transition duration-300 text-white text-sm text-center rounded-[1vw] bg-[#7f1414] w-full py-[0.2vw] hover:bg-[#a01818]"
                href={href}
            >
                View
            </Link>
        </div>
    );
}
