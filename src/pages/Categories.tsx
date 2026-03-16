import React from 'react';
import { useBlog } from '../store';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Categories() {
  const { categories } = useBlog();

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="mb-16">
        <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-white">Explore Categories</h1>
        <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">Discover stories by the topics that matter to you.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              to={`/categories/${category.slug}`}
              className="group block p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-orange-500 dark:hover:border-orange-500 transition-all h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-orange-600 font-black text-xl">{category.name[0]}</span>
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
                {category.name}
              </h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {category.description}
              </p>
              <div className="mt-8 text-sm font-bold text-orange-600 flex items-center gap-2">
                Browse Articles <span className="text-lg">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}