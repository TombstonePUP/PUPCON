import React from 'react';
import { useInView } from '@/hooks/use-in-view';

interface AccreditorSectionProps {
    user?: {
        first_name?: string;
        last_name?: string;
        roles?: {
            role_name: string;
        };
    };
}

export const AccreditorSection = ({ user }: AccreditorSectionProps) => {
    const [accreditorSectionRef, isAccreditorSectionInView] = useInView({ threshold: 0.1 }, true);
    const [accreditorContentRef, isAccreditorContentInView] = useInView({ threshold: 0.1 }, true);
    const [accreditorCardsRef, isAccreditorCardsInView] = useInView({ threshold: 0.1 }, true);

    return (
        <section
            ref={accreditorSectionRef}
            className={`my-10 flex w-full items-center justify-center transition-all duration-500 ease-out ${isAccreditorSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
        >
            <div className="flex w-[80%] max-w-5xl flex-col gap-12 rounded-xl border border-[#201e1e31] bg-white p-10 lg:flex-row">
                <div
                    ref={accreditorContentRef}
                    className={`flex flex-1 flex-col justify-center gap-6 transition-all duration-500 ease-out ${isAccreditorContentInView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
                >
                    <h2 className="font-montserrat text-3xl font-bold tracking-tight text-gray-900">
                        Welcome{' '}
                        {user?.roles?.role_name === 'Accreditor' && user.first_name && user.last_name
                            ? user.first_name + ' ' + user.last_name
                            : 'Accreditors'}
                        !
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-700">
                        It is our honor to host you, esteemed accreditors, and we deeply appreciate your role in our continued success.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {['March 2025', 'Level II AACCUP Survey Visit'].map((tag, index) => (
                            <span
                                key={tag}
                                className={`rounded-sm border border-[#201e1e31] px-8 py-2 text-sm font-medium text-[#7f1414] transition-all duration-300 hover:scale-102 ${isAccreditorContentInView ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
                                style={{ transitionDelay: `${200 + index * 100}ms` }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div
                    ref={accreditorCardsRef}
                    className={`flex flex-1 flex-col gap-4 transition-all duration-500 ease-out md:flex-row ${isAccreditorCardsInView ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}
                >
                    {[
                        {
                            title: 'Academic Programs',
                            desc: 'Learn more about the process, documents, and evaluation steps.',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5zm0 0V10m0 10v-4" />
                                </svg>
                            ),
                        },
                        {
                            title: 'More Info',
                            desc: 'Important details and updates for the accreditation visit.',
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                                </svg>
                            ),
                        },
                    ].map((card, index) => (
                        <a
                            key={card.title}
                            href="#"
                            className={`flex flex-1 flex-col items-start gap-10 rounded-xl bg-[#7f1414] p-6 text-white transition-all duration-300 hover:bg-[#7f1414]/95 active:scale-98 ${isAccreditorCardsInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                            style={{ transitionDelay: `${200 + index * 100}ms` }}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 transition-all duration-200 group-hover:scale-110 group-hover:rotate-6">
                                {card.icon}
                            </div>
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">{card.title}</h3>
                                <p className="text-sm opacity-90">{card.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
