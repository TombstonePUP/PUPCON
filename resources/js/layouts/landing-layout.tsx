import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import type { Auth, GuestNavigation } from '@/types';
import { Button } from '@headlessui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Building,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Facebook,
  FileText,
  GraduationCap,
  History,
  Home,
  Info,
  LogOut,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  footerText?: string;
}

function isActive(path: string) {
  return window.location.pathname.startsWith(path);
}

export default function Layout({ children, footerText }: LayoutProps) {
  const { guest } = usePage<GuestNavigation>().props;
  const { auth } = usePage<Auth>().props;
  const user = auth.user;
  const cleanup = useMobileNavigation();

  const underSurveyPrograms = (guest as any)?.programs?.length
    ? (guest as any).programs.map((program: any) => ({
      label: program.program_name,
      href: `/programs/${program.program_id}`,
    }))
    : [];

  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ---- Header show/hide: reveal only when scrolled up AND near top (~90% up) ----
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        if (currentScrollY < lastScrollY) {
          // ✔ show when scrolling up anywhere
          setScrollDir('up');
        } else {
          // ✔ hide when scrolling down
          setScrollDir('down');
        }

        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('scroll', updateScrollDir);
    return () => window.removeEventListener('scroll', updateScrollDir);
  }, []);

  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);



  const leftNav = [
    {
      label: 'About',
      href: '/about',
      dropdown: [
        { label: 'Vision, Mission, and Goals', href: '/about/vision-mission-goals', icon: <Info size={18} /> },
        { label: 'History', href: '/about/history', icon: <History size={18} /> },
        { label: 'Administration', href: '/about/administration', icon: <Users size={18} /> },
        { label: 'Facilities', href: '/about/facilities', icon: <Building size={18} /> },
        { label: 'Faculty and Staff', href: '/about/faculty-and-staff', icon: <GraduationCap size={18} /> },
        { label: 'Local Task Force', href: '/about/local-task-force', icon: <ShieldCheck size={18} /> },
      ],
    },
    {
      label: 'Authenticity',
      href: '/certificate',
      dropdown: [],
    },
  ];

  const rightNav = [
    {
      label: 'Programs',
      href: '/programs',
      dropdown: underSurveyPrograms.map((p) => ({
        ...p,
        icon: <BookOpen size={18} />,
      })),
    },
    { label: 'Exhibits', href: '/exhibits', dropdown: [] },
    { label: 'Others', href: '/others', dropdown: [] },
  ];

  // ---- Enhanced Search handling with debouncing ----
  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const t = term.toLowerCase();
    const results: any[] =
      (guest as any)?.outlines
        ?.filter(
          (o: any) =>
            o.outline_description?.toLowerCase().includes(t) ||
            o.area_parameter?.parameter_name?.toLowerCase().includes(t) ||
            o.area_parameter?.areas?.area_name?.toLowerCase().includes(t) ||
            o.area_parameter?.areas?.levels?.programs?.program_name?.toLowerCase().includes(t),
        )
        ?.map((o: any) => ({
          outline: o.outline_description,
          outlineId: o.parameter_outline_id,
          parameterId: o.area_parameter_id,
          program: o.area_parameter?.areas?.levels?.programs?.program_name,
          area: o.area_parameter?.areas?.area_name,
          parameter: o.area_parameter?.parameter_name,
          level: o.area_parameter?.areas?.levels?.level,
          program_id: o.area_parameter?.areas?.levels?.programs?.program_id,
          area_id: o.area_parameter?.areas?.area_id,
        })) || [];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Focus input when modal opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Enhanced click outside and escape key handling
  useEffect(() => {
    if (!searchOpen) return;

    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [searchOpen]);

  // Enhanced click outside and escape key handling
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  // Framer Motion variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const searchResultsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.2,
      },
    },
  };

  const resultItemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const redirectLink = (outline: any) => {
    const program_id = outline.program_id;
    const areaId = outline.area_id;
    const outlineId = outline.outlineId;
    const parameterId = outline.parameterId;

    router.visit(
      `/programs/${program_id}/${areaId}?parameter=${parameterId}#outline-${outlineId}`,
      {
        preserveScroll: true,
        only: [],
        data: {
          outline: outlineId,
        },
      },
    );

    setSearchOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col font-poppins">
      {/* Header */}
      <motion.header
        className={cn(
          'sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#7f1414] to-[#a71d1d] shadow-md backdrop-blur-sm',
        )}
        animate={{
          y: scrollDir === 'down' ? '-100%' : '0%',
        }}
        transition={{
          duration: 0.1,
          ease: 'easeInOut',
        }}
      >
        <Link href="/" className="flex items-center" preserveScroll>
          {/* <img src="/images/pupsjlogo-text-exotic.png" alt="Logo" className="h-full w-full object-cover" draggable={false} /> */}
          <div className="h-[14vw] w-[85vw] rounded-br-full bg-[#d2b539] lg:h-[4vw] lg:w-[38vw]">
            <div className="mr-3 ml-3 flex h-full items-center gap-4 rounded-br-full bg-white pb-2 pl-5 lg:justify-end lg:pr-20">
              <img className="mt-1 size-[10vw] lg:size-[2.9vw]" src="/images/pupsj-logo.png" alt="pupsj logo" />
              <div>
                <h1 className="text-[4vw] font-bold text-[#7f1414] lg:text-[1.4vw]">San Juan Campus</h1>
                <p className="mt-[-6px] text-[2.5vw] lg:text-[0.75vw]">Polytechnic University of the Philippines</p>
              </div>
            </div>
          </div>
        </Link>

        <div className="relative mr-[10vw] max-w-7xl">
          {/* Navigation + Search */}
          <div className="hidden items-center justify-end gap-8 lg:flex">
            <nav>
              <ul className="flex gap-8 text-sm font-medium tracking-wide text-white/90">
                {[...leftNav, ...rightNav].map((item) => (
                  <li key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        'relative px-3 py-2 transition-colors duration-300',
                        isActive(item.href) && 'text-white',
                        'hover:text-white',
                      )}
                      preserveScroll
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                    </Link>

                    {item.dropdown?.length > 0 && (
                      <div className="absolute left-0 mt-[1vw] max-h-0 w- max-w-xs overflow-hidden rounded-md bg-white/85 backdrop-blur-lg text-sm opacity-0 transition-all duration-300 ease-out group-hover:max-h-96 group-hover:opacity-100 p-1">
                        <ul className="flex flex-col">
                          {item.dropdown.map((drop) => (
                            <li key={drop.label} className="border-b border-gray-100 last:border-none">
                              <div className="group/item rounded hover:bg-[#7f1414]/90">
                                <Link
                                  href={drop.href}
                                  className="flex items-center gap-2 px-2 py-3 text-[#7f1414] transition-colors group-hover/item:text-white text-xs pr-8"
                                  preserveScroll
                                >
                                  <span className="text-[0.85vw] transition-transform duration-300 group-hover/item:translate-x-1">
                                    {drop.label}
                                  </span>
                                </Link>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Enhanced Search Button */}
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="relative flex items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 hover:ring-white/40 focus:ring-2 focus:ring-white/60 focus:outline-none transition-all duration-200"
              title="Search"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="size-[1.25vw] m-[0.5vw]" />
            </motion.button>

            {user?.roles?.role_name === 'Accreditor' && (
              <Link
                className="absolute right-[-8vw] flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-white ring-1 ring-white/20 transition-all duration-200 hover:bg-white/20 hover:ring-white/40"
                method="post"
                href={route('logout')}
                as="button"
                onClick={cleanup}
              >
                <LogOut size={16} className="text-white" />
                <span className="text-xs text-white/80">Logout</span>
              </Link>
            )}
          </div>

          <motion.button
            onClick={() => setMenuOpen(true)}
            className="relative ml-[3vw] flex items-center justify-center rounded-full bg-white/10 p-2 text-white hover:bg-white/20 hover:ring-white/40 focus:ring-2 focus:ring-white/60 focus:outline-none lg:hidden"
            title="Menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className="size-[5vw]" />
          </motion.button>
        </div>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSearchOpen(false)}
            />

            {/* Simplified Slide-in Search Panel */}
            <motion.aside
              ref={searchRef}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-lg border-l border-white/20 bg-white"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Enhanced Header */}
              <div className="flex items-center justify-between border-b border-gray-200/50 bg-white/80 px-6 py-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-lg bg-primary p-2 "
                  >
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="ml-3 bg-primary bg-clip-text text-xl font-bold text-transparent">
                    Mabuhay!
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setMenuOpen(true);
                      setSearchOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#7f1414] to-[#a71d1d] p-2 px-3 text-white  lg:hidden"
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

              {/* Enhanced Search Input */}
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
                    className="w-full rounded-xl border border-gray-300/50 bg-white/80 px-4 py-4 text-sm placeholder-gray-500  backdrop-blur-sm transition-all duration-300 focus:border-[#7f1414] focus:bg-white focus:ring-4 focus:ring-[#7f1414]/20 focus:outline-none"
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

              {/* Enhanced Results Section */}
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
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
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
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
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
                            whileHover={{
                              transition: { duration: 0.2 },
                            }}
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

      {/* Menu Modal */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Simplified Slide-in Search Panel */}
            <motion.aside
              ref={menuRef}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-lg border-l border-white/20 bg-white"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Enhanced Header */}
              <div className="flex items-center justify-between border-b border-gray-200/50 bg-white/80 px-6 py-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="rounded-lg bg-gradient-to-br from-[#7f1414] to-[#a71d1d] p-2"
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5 text-white" />
                  </motion.div>
                  <h2 className="ml-3 bg-gradient-to-r from-[#7f1414] to-[#a71d1d] bg-clip-text text-xl font-bold text-transparent">
                    Menu
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setSearchOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#7f1414] to-[#a71d1d] p-2 px-3 text-white lg:hidden"
                    title="Search"
                  >
                    <Search className="h-5 w-5" />
                    Search
                  </Button>
                  <motion.button
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100/80 hover:text-[#7f1414]"
                    aria-label="Close"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              <nav className="w-full overflow-hidden rounded-lg">
                <ul className="flex flex-col divide-y divide-white/10">
                  {[...leftNav, ...rightNav].map((item) => {
                    const isOpen = openDropdown === item.label;

                    return (
                      <li key={item.label} className="relative">
                        {/* Main Link + Toggle Button */}
                        <div className="flex items-center justify-between px-5 py-3">
                          <Link
                            href={item.href}
                            className={cn('flex-1 text-[#7f1414] transition-all duration-200')}
                            preserveScroll
                          >
                            {item.label}
                          </Link>

                          {/* {item.dropdown?.length > 0 && (
                            <button onClick={() => toggleDropdown(item.label)} className="p-2">
                              <ChevronDown
                                className={cn(
                                  'ml-2 text-[#7f1414] transition-transform duration-300',
                                  isOpen && 'rotate-180',
                                )}
                              />
                            </button>
                          )} */}
                        </div>

                        {/* Dropdown */}
                        {item.dropdown?.length > 0 && (
                          <div
                            className={cn(
                              'overflow-hidden bg-white text-[#7f1414] transition-all duration-300max-h-96',
                            )}
                          >
                            <ul className="flex flex-col">
                              {item.dropdown.map((drop) => (
                                <li key={drop.label} className="border-t border-gray-100 last:border-none">
                                  <Link
                                    href={drop.href}
                                    className="flex items-center gap-2 px-6 py-3 text-sm transition-colors hover:bg-[#7f1414] hover:text-white"
                                    preserveScroll
                                  >
                                    {/* {drop.icon && <span className="flex-shrink-0 text-lg">{drop.icon}</span>} */}
                                    <span className='pl-10'>{drop.label}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="relative min-h-[500px] bg-[#7f1414] py-10 pt-20 text-white lg:pt-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/images/homepage-slides/3.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#7f1414]/90 via-[#7f1414]/70 to-[#7f1414]/80"></div>

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center space-y-4">
          <div className="grid w-full grid-cols-1 gap-12 text-center md:grid-cols-2 lg:grid-cols-4 lg:text-left">
            <div className="space-y-4">
              <img src="/images/pupcon-logo-white.png" alt="PUP Logo" className="mx-auto w-28 lg:mx-0" />
              <h2 className="text-lg leading-snug font-bold">Polytechnic University of the Philippines - San Juan</h2>
              <p className="text-sm italic opacity-90">The Country's 1st Polytechnic University</p>
            </div>

            <div>
              <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Quick Links</h3>
              <ul className="flex flex-col items-center space-y-3 lg:items-start">
                <li>
                  <a
                    href="https://pupsinta.freshservice.com/support/home"
                    className="flex items-center gap-2 transition hover:text-yellow-300"
                  >
                    <Mail className="h-4 w-4" /> PUP SINTA
                  </a>
                </li>
                <li>
                  <a href="https://outlook.office.com/" className="flex items-center gap-2 transition hover:text-yellow-300">
                    <ExternalLink className="h-4 w-4" /> PUP WebMail
                  </a>
                </li>
                <li>
                  <a href="https://www.pup.edu.ph/iapply/" className="flex items-center gap-2 transition hover:text-yellow-300">
                    <BookOpen className="h-4 w-4" /> PUP iApply
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Portals</h3>
              <ul className="flex flex-col items-center space-y-3 lg:items-start">
                <li>
                  <a href="https://sis1.pup.edu.ph/student/" className="flex items-center gap-2 transition hover:text-yellow-300">
                    <GraduationCap className="h-4 w-4" /> SIS for Students
                  </a>
                </li>
                <li>
                  <a href="https://sis2.pup.edu.ph/faculty/" className="flex items-center gap-2 transition hover:text-yellow-300">
                    <BookOpen className="h-4 w-4" /> SIS for Faculty
                  </a>
                </li>
                <li>
                  <a href="https://sis8.pup.edu.ph/" className="flex items-center gap-2 transition hover:text-yellow-300">
                    <ExternalLink className="h-4 w-4" /> PUPSIS
                  </a>
                </li>
                <li>
                  {user?.roles?.role_name === 'Accreditor' ? (
                    <Link
                      href={route('logout')}
                      className="hover:cursor flex items-center gap-2 transition hover:cursor-pointer hover:text-yellow-300"
                      method="post"
                      onClick={cleanup}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="hidden items-center gap-2 transition hover:text-yellow-300 lg:flex"
                      preserveScroll
                    >
                      <Home className="h-4 w-4" /> PUPCON Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 border-b border-white/20 pb-2 text-lg font-semibold">Socials</h3>
              <ul className="flex flex-col items-center space-y-3 lg:items-start">
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=100064299686924"
                    className="flex items-center gap-2 transition hover:text-yellow-300"
                  >
                    <Facebook className="h-4 w-4" /> PUPSJ Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/ThePUPOfficial"
                    className="flex items-center gap-2 transition hover:text-yellow-300"
                  >
                    <Facebook className="h-4 w-4" /> PUP Sta. Mesa Facebook
                  </a>
                </li>
                <li>
                  <a href="/" className="flex items-center gap-2 transition hover:text-yellow-300" preserveScroll>
                    <Home className="h-4 w-4" /> Go to Home Page
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 w-full pt-2 text-center text-sm opacity-80">
            © {new Date().getFullYear()} Maharlika Technologies. All Rights Reserved.
          </div>
        </div>
      </footer>
      {showTopButton && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#7f1414] text-white shadow-lg hover:bg-[#a71d1d] transition-all"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp className="h-6 w-6" />
        </motion.button>
      )}

    </div>
  );
}
