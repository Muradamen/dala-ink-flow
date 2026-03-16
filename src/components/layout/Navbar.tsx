import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, Search, Command, Mail } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsletterSignupForm } from '../NewsletterSignupForm';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchVisible(false);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isNewsletterOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link to="/" className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
                MEYRA<span className="text-orange-600">.</span>BLOG
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "text-sm font-medium transition-colors hover:text-orange-600",
                      isActive ? "text-orange-600" : "text-zinc-600 dark:text-zinc-400"
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className={cn("relative flex items-center transition-all duration-300", isSearchVisible ? "w-64" : "w-10")}>
                <button 
                  onClick={toggleSearch}
                  className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                <form 
                  onSubmit={handleSearchSubmit}
                  className={cn("absolute left-10 right-0 overflow-hidden transition-all duration-300", isSearchVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 pointer-events-none")}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-medium focus:ring-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </form>
              </div>
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors"
                title="Subscribe to Newsletter"
              >
                <Mail className="w-5 h-5" />
              </button>
              <ThemeToggle />
              <Link
                to="/admin"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
              >
                Dashboard
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleSearch}
                className="p-2 text-zinc-600 dark:text-zinc-400"
              >
                <Search className="w-5 h-5" />
              </button>
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-zinc-600 dark:text-zinc-400"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          {isSearchVisible && (
            <div className="md:hidden py-4 border-t border-zinc-100 dark:border-zinc-800 animate-in slide-in-from-top duration-200">
               <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 transition-all"
                  />
               </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 py-4 px-4 space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-zinc-900 dark:text-white"
              >
                {link.name}
              </NavLink>
            ))}
            <button 
              onClick={() => {
                setIsOpen(false);
                setIsNewsletterOpen(true);
              }}
              className="flex items-center gap-2 text-lg font-medium text-zinc-900 dark:text-white"
            >
              <Mail className="w-5 h-5 text-orange-600" />
              Newsletter
            </button>
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-orange-600"
            >
              Dashboard
            </Link>
          </div>
        )}
      </nav>

      {/* Global Newsletter Modal */}
      <AnimatePresence>
        {isNewsletterOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewsletterOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={() => setIsNewsletterOpen(false)}
                  className="p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-900 dark:text-white" />
                </button>
              </div>
              <NewsletterSignupForm variant="boxed" className="shadow-2xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}