import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
    const page = usePage();
    const underSurvey = page.props.underSurvey || [];
    const currentPath = page.url;

    const isActive = (path: string) => currentPath.startsWith(path);

    return (
        <header className="fin-header bg-white shadow-sm sticky top-0 z-50">
            <div className="flex min-w-full h-[4vw] bg-[#630101f2] items-center justify-center relative">
                <Link href={route('home')} className="absolute top-0">
                    <img
                        className="w-[15vw] object-contain"
                        src="/images/badge.png"
                        alt="badge"
                    />
                </Link>
            </div>
            <div className="flex justify-between px-70 py-3 color-[#7f1414]">
                {/* Left Nav */}
                <ul className="flex gap-30">
                    <li className="relative group">
                        <Link
                            href={route('home')}
                            className={cn('nav-link', isActive('/about') && 'active')}
                        >
                            ABOUT
                        </Link>
                        <div className="dropdown-content absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md mt-2 p-2 text-sm">
                            <Link href={route('home')}>Vision, Mission, and Goals</Link>
                            <Link href={route('home')}>History</Link>
                            <Link href={route('home')}>Administration</Link>
                            <Link href={route('home')}>Facilities</Link>
                            <Link href={route('home')}>Faculty and Staff</Link>
                            <Link href={route('home')}>Local Task Force</Link>
                        </div>
                    </li>
                    <li>
                        <Link
                            href={route('home')}
                            className={cn('nav-link no-wrap', isActive('/certificate') && 'active')}
                        >
                            CERTIFICATE OF AUTHENTICITY
                        </Link>
                    </li>
                </ul>

                {/* Right Nav */}
                <ul className="flex gap-30">
                    <li className="relative group">
                        <Link
                            href={route('home')}
                            className={cn('nav-link', isActive('/programs') && 'active')}
                        >
                            PROGRAMS
                        </Link>
                        <div className="dropdown-content absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md mt-2 p-2 text-sm">
                            {/* {underSurvey.map((program: any) => (
                <Link
                  key={program.program_name}
                  href={route('programs.show', { program_name: program.program_name })}
                >
                  {program.program_name}
                </Link>
              ))} */}
                        </div>
                    </li>
                    <li>
                        <Link
                            href={route('home')}
                            className={cn('nav-link', isActive('/exhibits') && 'active')}
                        >
                            EXHIBITS
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route('home')}
                            className={cn('nav-link', isActive('/others') && 'active')}
                        >
                            OTHERS
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
