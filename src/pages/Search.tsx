import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, ArrowRight, Clock, MessageCircle, Share2, Tag, Calendar, LayoutGrid, LayoutList } from 'lucide-react';
import { searchBlogPosts } from '../lib/supabase';
import { Post } from '../types';
import { formatDate, cn } from '../lib/utils';
import { SEO } from '../components/SEO';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const searchResults = await searchBlogPosts(query);
        // Cast because of Supabase relations join structure
        setResults(searchResults as unknown as Post[]);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen py-32">
      <SEO 
        title={`${query ? `Results for "${query}"` : 'Search'} | Meyra Blog`}
        description={`Search results for ${query} on Meyra Blog.`}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16 border-b border-zinc-100 dark:border-zinc-800 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                 <div className="px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-600 rounded-full flex items-center gap-2">
                    <SearchIcon className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Search Explorer</span>
                 </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white leading-tight tracking-tighter">
                Showing results for <span className="text-orange-600">"{query}"</span>
              </h1>
              <p className="mt-6 text-lg text-zinc-500 dark:text-zinc-400 font-medium">
                Found {results.length} article{results.length !== 1 ? 's' : ''} matching your search query.
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
             <div className="p-1 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex border border-zinc-100 dark:border-zinc-800">
                <button 
                 onClick={() => setViewMode('grid')}
                 className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" : "text-zinc-400")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                 onClick={() => setViewMode('list')}
                 className={cn("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" : "text-zinc-400")}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Results Content */}
        <main>
          {loading ? (
             <div className="py-24 flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-2 border-zinc-200 dark:border-zinc-800 border-t-orange-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Scanning database...</p>
             </div>
          ) : results.length > 0 ? (
             <div className={cn(
               "grid gap-8",
               viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
             )}>
                <AnimatePresence mode="popLayout">
                  {results.map((post, index) => (
                    <motion.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={cn(
                        "group bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:border-orange-500/20 hover:bg-white dark:hover:bg-zinc-900 transition-all hover:shadow-2xl",
                        viewMode === 'list' && "flex flex-col md:flex-row"
                      )}
                    >
                      <Link to={`/blog/${post.slug}`} className="flex flex-col h-full w-full">
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === 'grid' ? "aspect-[16/10]" : "md:w-96 aspect-[16/10] md:aspect-auto h-full"
                        )}>
                          <img 
                            src={post.featured_image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-zinc-700/50">
                              {post.categories?.name || 'General'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-8 flex flex-col flex-1">
                           <div className="flex items-center gap-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.created_at)}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
                           </div>

                           <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors leading-tight mb-4">
                              {post.title}
                           </h2>

                           <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed mb-8 flex-1">
                              {post.excerpt}
                           </p>

                           <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
                              <div className="flex flex-wrap gap-2">
                                 {post.post_tags?.slice(0, 2).map((pt, i) => (
                                    <span key={i} className="text-[8px] font-bold text-zinc-400 uppercase border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-md">
                                       #{pt.tags.name}
                                    </span>
                                 ))}
                              </div>
                              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                 <ArrowRight className="w-4 h-4" />
                              </div>
                           </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
             </div>
          ) : (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
             >
               <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <SearchIcon className="w-10 h-10 text-zinc-200" />
               </div>
               <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">The search returns empty</h2>
               <p className="text-zinc-500 max-w-sm mx-auto font-medium mb-8">
                  We couldn't find any articles matching "{query}". Try using different keywords or explore categories.
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    to="/blog"
                    className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-colors"
                  >
                    Back to Blog
                  </Link>
                  <Link 
                    to="/categories"
                    className="px-8 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-orange-500 transition-colors"
                  >
                    Browse Topics
                  </Link>
               </div>
             </motion.div>
          )}
        </main>

        {/* Quick Help */}
        {!loading && results.length > 0 && (
           <div className="mt-24 p-12 bg-orange-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Can't find what you're looking for?</h3>
                 <p className="text-orange-100 font-medium">Our AI might be able to help you find more specific topics.</p>
              </div>
              <Link 
                to="/contact"
                className="px-10 py-5 bg-white text-orange-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform active:scale-95"
              >
                Contact Support
              </Link>
           </div>
        )}
      </div>
    </div>
  );
}