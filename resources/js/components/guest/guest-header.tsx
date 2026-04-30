"use client";

import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { LogOut, Menu, Search, X } from "lucide-react";

interface GuestHeaderProps {
  scrollDir: "up" | "down";
  setSearchOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  leftNav: any[];
  rightNav: any[];
  isActive: (path: string) => boolean;
  user: any;
  cleanup: () => void;
  route: any;
}

export default function GuestHeader({
  scrollDir,
  setSearchOpen,
  menuOpen,
  setMenuOpen,
  leftNav,
  rightNav,
  isActive,
  user,
  cleanup,
  route,
}: GuestHeaderProps) {
  return (
    <motion.header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#7f1414] to-[#a71d1d] shadow-md backdrop-blur-sm transition-all duration-300',
      )}
      animate={{ y: scrollDir === 'down' ? '-100%' : '0%' }}
    >
      <Link href="/" className="flex items-center" preserveScroll>
        <div className="h-[14vw] w-[85vw] rounded-br-full bg-[#d2b539] lg:h-[4vw] lg:w-[38vw]">
          <div className="mr-3 ml-3 flex h-full items-center gap-4 rounded-br-full bg-white pb-2 pl-5 lg:justify-end lg:pr-20">
            <img className="mt-1 size-[10vw] lg:size-[2.9vw]" src="/images/pupsj-logo.png" alt="pupsj logo" />
            <div>
              <h1 className="text-[4vw] font-bold text-[#7f1414] lg:text-[1.4vw]">San Juan Campus</h1>
              <p className="mt-[-6px] text-[2.5vw] text-black lg:text-[0.75vw]">Polytechnic University of the Philippines</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="relative mr-[10vw] flex items-center gap-8">
        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-8 text-sm font-medium tracking-wide text-white/90">
            {[...leftNav, ...rightNav].map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    'relative px-3 py-2 text-sm transition-colors duration-300 hover:text-white',
                    isActive(item.href) && 'text-white',
                  )}
                  preserveScroll
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden lg:block text-white/80 transition-colors hover:text-white"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 text-white/80 transition-colors hover:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" strokeWidth={2.5} /> : <Menu className="h-6 w-6" strokeWidth={2.5} />}
        </button>

        {user?.roles?.role_name === 'Accreditor' && (
          <Link
            method="post"
            href={route('logout')}
            as="button"
            className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
            onClick={cleanup}
          >
            <LogOut size={16} />
          </Link>
        )}
      </div>
    </motion.header>
  );
}
