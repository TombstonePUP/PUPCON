"use client";

import { cn } from "@/lib/utils";
import { Link, router } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, ChevronRight, FileText } from "lucide-react";
import { useState, useEffect } from "react";

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    leftNav: any[];
    rightNav: any[];
    isActive: (path: string) => boolean;
    guestProps: any;
}

export default function MobileMenu({ open, onClose, leftNav, rightNav, isActive, guestProps }: MobileMenuProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const allLinks = [...leftNav, ...rightNav];

    // ---- Search logic (copied from SearchModal logic) ----
    const handleSearch = (term: string) => {
        if (!term.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const t = term.toLowerCase();
        const outlines = guestProps?.outlines || [];
        
        const results = outlines
            .filter((o: any) =>
                o.outline_description?.toLowerCase().includes(t) ||
                o.area_parameter?.parameter_name?.toLowerCase().includes(t) ||
                o.area_parameter?.areas?.area_name?.toLowerCase().includes(t) ||
                o.area_parameter?.areas?.levels?.programs?.program_name?.toLowerCase().includes(t)
            )
            .map((o: any) => ({
                outline: o.outline_description,
                outlineId: o.parameter_outline_id,
                parameterId: o.area_parameter_id,
                program: o.area_parameter?.areas?.levels?.programs?.program_name,
                area: o.area_parameter?.areas?.area_name,
                parameter: o.area_parameter?.parameter_name,
                level: o.area_parameter?.areas?.levels?.level,
                program_id: o.area_parameter?.areas?.levels?.programs?.program_id,
                area_id: o.area_parameter?.areas?.area_id,
            }));

        setTimeout(() => {
            setSearchResults(results);
            setIsSearching(false);
        }, 300);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                handleSearch(searchTerm);
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const redirectLink = (outline: any) => {
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
                    className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden overflow-hidden"
                >
                    {/* Grid Texture Background */}
                    <div 
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Menu Header (Mobile) */}
                    <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md relative z-10">
                        <div className="flex flex-col">
                            <span className="font-poppins text-[16px] font-black text-[#7f1414] uppercase tracking-tight">Navigation</span>
                            <span className="font-sans text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Directory Menu</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="size-10 flex items-center justify-center rounded-full bg-gray-50 text-[#7f1414] transition-transform active:scale-90"
                        >
                            <X className="size-6" strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Search Section (New) */}
                    <div className="px-7 py-6 border-b border-gray-100 bg-gray-50/30 relative z-10">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-[#7f1414] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search benchmarks..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#7f1414]/10 focus:border-[#7f1414] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Content Area: Either Links or Search Results */}
                    <div className="flex-1 overflow-y-auto relative z-10">
                        {searchTerm ? (
                            <div className="p-4">
                                {isSearching ? (
                                    <div className="py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f1414] mx-auto mb-4" />
                                        <p className="text-sm text-gray-500 font-sans">Searching benchmarks...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="space-y-1">
                                        {searchResults.map((result, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => redirectLink(result)}
                                                className="w-full text-left p-4 rounded-xl hover:bg-gray-50 group transition-all"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-[#7f1414] px-2 py-0.5 bg-[#7f1414]/5 rounded font-poppins">
                                                        {result.program}
                                                    </span>
                                                    <ChevronRight className="size-3 text-gray-300" />
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase font-sans tracking-wider">{result.area}</span>
                                                </div>
                                                <p className="text-sm text-gray-700 font-medium leading-relaxed font-sans group-hover:text-black">
                                                    {result.outline}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <FileText className="mx-auto size-12 text-gray-200 mb-4" />
                                        <p className="text-sm text-gray-500 font-sans">No results found for "{searchTerm}"</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <nav className="px-8 py-12 flex flex-col gap-6">
                                {allLinks.map((link, idx) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + idx * 0.05, duration: 0.4, ease: "easeOut" }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className="group flex items-end gap-3"
                                        >
                                            <span className="font-sans text-[10px] text-gray-300 font-bold mb-2">0{idx + 1}</span>
                                            <span className={cn(
                                                "font-poppins text-[42px] font-black uppercase leading-none tracking-tighter transition-all group-hover:pl-4",
                                                isActive(link.href) ? "text-[#7f1414]" : "text-gray-900"
                                            )}>
                                                {link.label}
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                        )}
                    </div>
                    
                    {/* Mobile Footer Area */}
                    <div className="p-8 border-t border-gray-100 bg-gray-50 relative z-10">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Campus</h4>
                                <p className="font-poppins text-[13px] font-bold text-gray-600 uppercase">San Juan, Manila</p>
                            </div>
                            <div>
                                <h4 className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">System</h4>
                                <p className="font-poppins text-[13px] font-bold text-gray-600 uppercase">PUPCON v2.0</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
