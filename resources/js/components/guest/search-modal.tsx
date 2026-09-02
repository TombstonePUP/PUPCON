"use client";

import type { GuestNavigation } from "@/types";
import { router } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ChevronRight, FileText } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import type { OutlineSearchSource, SearchResult } from "./mobile-menu";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  guestProps: GuestNavigation;
}

export default function SearchModal({ open, onClose, guestProps }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ---- Enhanced Search handling with debouncing ----
  const handleSearch = useCallback((term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const t = term.toLowerCase();
    
    // Safety check for guestProps.outlines
    const outlines = (guestProps?.outlines || []) as unknown as OutlineSearchSource[];

    const results = outlines
      .filter((o) =>
        o.outline_description?.toLowerCase().includes(t) ||
        o.area_parameter?.parameter_name?.toLowerCase().includes(t) ||
        o.area_parameter?.areas?.area_name?.toLowerCase().includes(t) ||
        o.area_parameter?.areas?.levels?.programs?.program_name?.toLowerCase().includes(t)
      )
      .map((o): SearchResult => ({
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
  }, [guestProps]);

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
  }, [searchTerm, handleSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

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
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-start justify-center p-4 pt-[15vh]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            >
              {/* Search Header */}
              <div className="relative border-b border-gray-100 p-6">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search programs, areas, or benchmarks..."
                  className="w-full pl-12 pr-12 py-3 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={onClose}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Results Area */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {!searchTerm ? (
                  <div className="py-12 text-center">
                    <Search className="mx-auto size-12 text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium">Type something to search...</p>
                  </div>
                ) : isSearching ? (
                  <div className="py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f1414] mx-auto mb-4" />
                    <p className="text-gray-500">Searching benchmarks...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => redirectLink(result)}
                        className="w-full text-left p-4 rounded-xl hover:bg-gray-50 group transition-all"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-bold text-[#7f1414] px-2 py-0.5 bg-[#7f1414]/5 rounded">
                            {result.program}
                          </span>
                          <ChevronRight className="size-3 text-gray-300" />
                          <span className="text-xs text-gray-500 font-medium">{result.area}</span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed group-hover:text-black">
                          {result.outline}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <FileText className="mx-auto size-12 text-gray-200 mb-4" />
                    <p className="text-gray-500">No results found for "{searchTerm}"</p>
                  </div>
                )}
              </div>

              {/* Footer / Shortcut hints */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] text-gray-500 font-sans shadow-sm font-bold">ESC</kbd>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">to close</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PUPCON Search</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
