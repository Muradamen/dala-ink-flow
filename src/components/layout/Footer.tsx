import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
              MEYRA<span className="text-orange-600">.</span>BLOG
            </Link>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ethiopia's independent digital publisher focused on tech, AI, business insights, and startup announcements.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/blog" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600">Articles</Link></li>
              <li><Link to="/categories" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600">Categories</Link></li>
              <li><Link to="/about" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600">About</Link></li>
              <li><Link to="/newsletter" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600">Newsletter</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Topics</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/categories/tech" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600">Technology</Link></li>
              <li><Link to="/categories/ai" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600">Artificial Intelligence</Link></li>
              <li><Link to="/categories/business" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600">Tech Business</Link></li>
              <li><Link to="/categories/startups" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600">Startups</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Meyra Blog. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
             <span className="text-xs text-zinc-400">Independent Digital Publisher in Ethiopia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}