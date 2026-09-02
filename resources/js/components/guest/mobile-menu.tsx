'use client';

import { buildSearchIndex, searchOutlines } from '@/lib/search';
import { cn } from '@/lib/utils';
import type { GuestNavigation } from '@/types';
import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, FileText, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface GuestNavItem {
    label: string;
    href: string;
    dropdown?: { label: string; href: string }[];
}

export interface SearchResult {
    outline?: string;
    outlineId: number;
    parameterId: number;
    program?: string;
    area?: string;
    parameter?: string;
    level?: number;
    program_id?: number;
    area_id?: number;
}

export interface OutlineSearchSource {
    outline_description?: string;
    outline_number?: string;
    outline_name?: string;
    parameter_outline_id: number;
    area_parameter_id: number;
    area_parameter?: {
        parameter_name?: string;
        parameter_description?: string;
        areas?: {
            area_name?: string;
            area_id?: number;
            area_description?: string;
            area_number?: string;
            area_numeral?: string;
            levels?: {
                level?: number;
                level_name?: string;
                programs?: {
                    program_name?: string;
                    program_id?: number;
                    degree_type?: string;
                };
            };
        };
    };
}

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    leftNav: GuestNavItem[];
    rightNav: GuestNavItem[];
    isActive: (path: string) => boolean;
    guestProps: GuestNavigation;
}

export default function MobileMenu({ open, onClose, leftNav, rightNav, isActive, guestProps }: MobileMenuProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const allLinks = [...leftNav, ...rightNav];

    // ---- Precompute a rich lowercase search index once ----
    const searchIndex = useMemo(() => buildSearchIndex((guestProps?.outlines || []) as unknown as OutlineSearchSource[]), [guestProps]);

    // ---- Derived, memoized results: only recomputed when the term changes ----
    const searchResults = useMemo(() => searchOutlines(searchIndex, searchTerm), [searchTerm, searchIndex]);

    const redirectLink = (outline: SearchResult) => {
        const { program_id, area_id, outlineId, parameterId } = outline;
        router.visit(`/programs/${program_id}/${area_id}?parameter=${parameterId}#outline-${outlineId}`, {
            preserveScroll: true,
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-white lg:hidden"
                >
                    {/* Grid Texture Background */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    {/* Menu Header (Mobile) */}
                    <div className="relative z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-7 py-6 backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="font-poppins text-[16px] font-black tracking-tight text-[#7f1414] uppercase">Navigation</span>
                            <span className="mt-0.5 font-sans text-[8px] font-bold tracking-widest text-gray-400 uppercase">Directory Menu</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex size-10 items-center justify-center rounded-full bg-gray-50 text-[#7f1414] transition-transform active:scale-90"
                        >
                            <X className="size-6" strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Search Section (New) */}
                    <div className="relative z-10 border-b border-gray-100 bg-gray-50/30 px-7 py-6">
                        <div className="group relative">
                            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#7f1414]" />
                            <input
                                type="text"
                                placeholder="Search benchmarks..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-10 pl-10 font-sans text-sm transition-all focus:border-[#7f1414] focus:ring-2 focus:ring-[#7f1414]/10 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content Area: Either Links or Search Results */}
                    <div className="relative z-10 flex-1 overflow-y-auto">
                        {searchTerm ? (
                            <div className="p-4">
                                {searchResults.length > 0 ? (
                                    <div className="space-y-1">
                                        {searchResults.map((result, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => redirectLink(result)}
                                                className="group w-full rounded-xl p-4 text-left transition-all hover:bg-gray-50"
                                            >
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="font-poppins rounded bg-[#7f1414]/5 px-2 py-0.5 text-[10px] font-bold text-[#7f1414]">
                                                        {result.program}
                                                    </span>
                                                    <ChevronRight className="size-3 text-gray-300" />
                                                    <span className="font-sans text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                                                        {result.area}
                                                    </span>
                                                </div>
                                                <p className="font-sans text-sm leading-relaxed font-medium text-gray-700 group-hover:text-black">
                                                    {result.outline}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <FileText className="mx-auto mb-4 size-12 text-gray-200" />
                                        <p className="font-sans text-sm text-gray-500">No results found for "{searchTerm}"</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <nav className="flex flex-col gap-6 px-8 py-12">
                                {allLinks.map((link, idx) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + idx * 0.05, duration: 0.4, ease: 'easeOut' }}
                                    >
                                        <Link href={link.href} onClick={onClose} className="group flex items-end gap-3">
                                            <span className="mb-2 font-sans text-[10px] font-bold text-gray-300">0{idx + 1}</span>
                                            <span
                                                className={cn(
                                                    'font-poppins text-[42px] leading-none font-black tracking-tighter uppercase transition-all group-hover:pl-4',
                                                    isActive(link.href) ? 'text-[#7f1414]' : 'text-gray-900',
                                                )}
                                            >
                                                {link.label}
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* Mobile Footer Area */}
                    <div className="relative z-10 border-t border-gray-100 bg-gray-50 p-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="mb-2 font-sans text-[9px] font-bold tracking-widest text-gray-400 uppercase">Campus</h4>
                                <p className="font-poppins text-[13px] font-bold text-gray-600 uppercase">San Juan, Manila</p>
                            </div>
                            <div>
                                <h4 className="mb-2 font-sans text-[9px] font-bold tracking-widest text-gray-400 uppercase">System</h4>
                                <p className="font-poppins text-[13px] font-bold text-gray-600 uppercase">PUPCON v2.0</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
