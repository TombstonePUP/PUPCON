import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, FileText, Menu, Search, X } from 'lucide-react';
import { Button } from '@headlessui/react';
import { RefObject } from 'react';

export const SearchModal = ({
    searchOpen,
    setSearchOpen,
    setMenuOpen,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    inputRef,
    searchRef,
    redirectLink,
    backdropVariants,
    sidebarVariants,
    searchResultsVariants,
    resultItemVariants,
}: {
    searchOpen: boolean;
    setSearchOpen: (v: boolean) => void;
    setMenuOpen: (v: boolean) => void;
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    searchResults: any[];
    isSearching: boolean;
    inputRef: RefObject<HTMLInputElement>;
    searchRef: RefObject<HTMLDivElement>;
    redirectLink: (r: any) => void;
    backdropVariants: any;
    sidebarVariants: any;
    searchResultsVariants: any;
    resultItemVariants: any;
}) => {
    return (
        <AnimatePresence>
            {searchOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={() => setSearchOpen(false)}
                    />
                    <motion.aside
                        ref={searchRef}
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-lg border-l border-white/20 bg-white"
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <div className="flex items-center justify-between border-b border-gray-200/50 bg-white/80 px-6 py-5 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#7f1414] p-2">
                                    <Search className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="ml-3 bg-[#7f1414] bg-clip-text text-xl font-bold text-transparent">
                                    Mabuhay!
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        setMenuOpen(true);
                                        setSearchOpen(false);
                                    }}
                                    className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#7f1414] to-[#a71d1d] p-2 px-3 text-white lg:hidden"
                                    title="Menu"
                                >
                                    <Menu className="h-5 w-5" />
                                    Menu
                                </Button>
                                <motion.button
                                    onClick={() => setSearchOpen(false)}
                                    className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100/80 hover:text-[#7f1414]"
                                    aria-label="Close"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </div>

                        <motion.div
                            className="bg-gradient-to-r from-gray-50/50 to-white/50 p-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <div className="group relative">
                                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400 transition-colors duration-200 group-focus-within:text-[#7f1414]" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search benchmarks..."
                                    className="w-full rounded-xl border border-gray-300/50 bg-white/80 px-4 py-4 pl-12 text-sm placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-[#7f1414] focus:bg-white focus:ring-4 focus:ring-[#7f1414]/20 focus:outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <motion.button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400 transition-colors duration-200 hover:text-gray-600"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <X className="h-4 w-4" />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>

                        <div className="flex-1 h-200 overflow-scroll scroll-smooth hide-scrollbar">
                            <div className="overflow-hidden px-6 pb-6">
                                <AnimatePresence mode="wait">
                                    {!searchTerm ? (
                                        <motion.div
                                            key="empty"
                                            className="flex h-64 flex-col items-center justify-center text-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <motion.div
                                                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200"
                                                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <Search className="h-8 w-8 text-gray-400" />
                                            </motion.div>
                                            <p className="mb-2 text-lg font-medium text-gray-500">Start your search</p>
                                            <p className="text-sm text-gray-400">Type to find outlines, parameters, and programs</p>
                                        </motion.div>
                                    ) : isSearching ? (
                                        <motion.div
                                            key="loading"
                                            className="flex h-32 items-center justify-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <motion.div
                                                className="h-8 w-8 rounded-full border-2 border-[#7f1414] border-t-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                            <span className="ml-3 text-gray-500">Searching...</span>
                                        </motion.div>
                                    ) : searchResults.length === 0 ? (
                                        <motion.div
                                            key="no-results"
                                            className="flex h-64 flex-col items-center justify-center text-center"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                                                <FileText className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="mb-2 text-lg font-medium text-gray-600">No results found</p>
                                            <p className="text-sm text-gray-400">Try adjusting your search terms for "{searchTerm}"</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="results"
                                            className="space-y-3"
                                            variants={searchResultsVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                        >
                                            {searchResults.map((result, index) => (
                                                <motion.div
                                                    key={result.outlineId || index}
                                                    className="group cursor-pointer rounded-xl border border-gray-200/50 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#7f1414]/30 hover:bg-white/80"
                                                    variants={resultItemVariants}
                                                    whileHover={{ transition: { duration: 0.2 } }}
                                                    onClick={() => redirectLink(result)}
                                                >
                                                    <div className="mb-3 flex items-start justify-between">
                                                        <div className="flex flex-wrap items-center space-x-2 text-sm font-medium text-gray-600">
                                                            <span className="rounded-md bg-[#7f1414]/10 px-2 py-1 text-xs font-semibold text-[#7f1414]">
                                                                {result.program}
                                                            </span>
                                                            <ChevronRight className="h-3 w-3 text-gray-400" />
                                                            <span className="text-gray-500">{result.area}</span>
                                                            <ChevronRight className="h-3 w-3 text-gray-400" />
                                                            <span className="text-gray-500">{result.parameter}</span>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-[#7f1414]" />
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-gray-800 transition-colors duration-200 group-hover:text-gray-900">
                                                        {result.outline}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
