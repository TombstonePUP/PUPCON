'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { buildSearchIndex, searchOutlines } from '@/lib/search';
import type { GuestNavigation } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronRight, FileText, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { OutlineSearchSource, SearchResult } from './mobile-menu';

interface SearchModalProps {
    open: boolean;
    onClose: () => void;
    guestProps: GuestNavigation;
}

export default function SearchModal({ open, onClose, guestProps }: SearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // ---- Precompute a rich lowercase search index once ----
    const searchIndex = useMemo(() => buildSearchIndex((guestProps?.outlines || []) as unknown as OutlineSearchSource[]), [guestProps]);

    // ---- Derived, memoized results: only recomputed when the term changes ----
    const searchResults = useMemo(() => searchOutlines(searchIndex, searchTerm), [searchTerm, searchIndex]);

    // Focus the input when the dialog opens (Radix focuses the close button by default)
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => inputRef.current?.select(), 0);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const redirectLink = (outline: SearchResult) => {
        const { program_id, area_id, outlineId, parameterId } = outline;
        router.visit(`/programs/${program_id}/${area_id}?parameter=${parameterId}#outline-${outlineId}`, {
            preserveScroll: true,
        });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle>Search benchmarks</DialogTitle>
                    <DialogDescription className="sr-only">Search for benchmarks across programs, areas, and outlines.</DialogDescription>
                </DialogHeader>

                {/* Search Input */}
                <div className="relative px-6">
                    <Search className="text-muted-foreground absolute top-1/2 left-9 size-4 -translate-y-1/2" />
                    <Input
                        ref={inputRef}
                        placeholder="Search programs, areas, or benchmarks..."
                        className="pr-10 pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-10 -translate-y-1/2 rounded-sm p-1 opacity-70 hover:opacity-100"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                {/* Results Area */}
                <div className="max-h-[55vh] overflow-y-auto px-4 py-2">
                    {!searchTerm ? (
                        <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 text-center">
                            <div className="rounded-full bg-gray-100 p-4">
                                <Search className="size-6 text-gray-400" />
                            </div>
                            <p className="text-muted-foreground text-sm">Type something to search...</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-1">
                            {searchResults.map((result) => (
                                <button
                                    key={`${result.program_id}-${result.area_id}-${result.outlineId}`}
                                    onClick={() => redirectLink(result)}
                                    className="group w-full cursor-pointer rounded-lg bg-gray-100/60 p-4 text-left transition-colors hover:bg-gray-100"
                                >
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="rounded bg-[#7f1414]/5 px-2 py-0.5 text-[10px] font-bold text-[#7f1414]">
                                            {result.program}
                                        </span>
                                        <ChevronRight className="size-3 text-gray-300" />
                                        <span className="text-xs font-medium text-gray-500">{result.area}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed font-medium text-gray-700 group-hover:text-black">{result.outline}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 text-center">
                            <div className="rounded-full bg-gray-100 p-4">
                                <FileText className="size-6 text-gray-400" />
                            </div>
                            <p className="text-muted-foreground text-sm">No results found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
