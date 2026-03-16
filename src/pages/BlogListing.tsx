import React, { useState, useMemo } from 'react';
import { useBlog } from '../store';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ArrowRight, Filter, LayoutGrid, LayoutList, ChevronRight, Tag } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { SEO } from '../components/SEO';
import { NewsletterSignupForm } from '../components/NewsletterSignupForm';

export function BlogListing() {
  const { slug } = useParams(); // For category slug
  const { posts, categories, loading } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // If slug is present, filter by category
  React.useEffect(() => {
    if (slug) {
      const category = categories.find(c => c.slug === slug);
      if (category) setSelectedCategory(category.id);
    }
  }, [slug, categories]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory ? post.category_id === selectedCategory : true;
      const isPublished = post.status === 'published';
      return matchesSearch && matchesCategory && isPublished;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = useMemo(() => {
    return filteredPosts.find(p => p.featured_image_url) || filteredPosts[0];
  }, [filteredPosts]);

  const remainingPosts = useMemo(() => {
    return filteredPosts.filter(p => p.id !== featuredPost?.id);
  }, [filteredPosts, featuredPost]);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen selection:bg-orange-100 dark:selection:bg-orange-500/30">
      <SEO 
        title="The Insight Feed | Meyra Blog"
        description="Expert analysis on Ethiopia's growing tech and startup ecosystem."
      />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-px bg-orange-600" />
                 <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">Daily Insights</span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-zinc-900 dark:text-white leading-[0.9] tracking-tighter">
                THE<br />
                INSIGHT<br />
                FEED<span className="text-orange-600">.</span>
              </h1>
              <p className="mt-8 text-xl text-zinc-500 font-medium leading-relaxed max-w-lg">
                Analyzing the intersections of technology, culture, and innovation across the Horn of Africa.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full md:w-auto p-4 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
             <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
               <input 
                 type="text" 
                 placeholder="Search stories..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm font-bold"
               />
             </div>
             <div className="flex items-center gap-2">
                <select 
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="flex-1 sm:w-44 px-4 py-3 bg-white dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-xs font-black uppercase tracking-widest cursor-pointer"
                >
                  <option value="">All Topics</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="hidden sm:flex p-1 bg-white dark:bg-zinc-800 rounded-2xl">
                   <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-zinc-100 dark:bg-zinc-700 text-orange-600" : "text-zinc-400")}
                   >
                     <LayoutGrid className="w-4 h-4" />
                   </button>
                   <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-zinc-100 dark:bg-zinc-700 text-orange-600" : "text-zinc-400")}
                   >
                     <LayoutList className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
             <div className="w-16 h-16 border-4 border-zinc-100 dark:border-zinc-800 border-t-orange-600 rounded-full animate-spin"></div>
             <p className="text-xs font-black text-zinc-400 uppercase tracking-widest animate-pulse">Curating your feed...</p>
          </div>
        ) : (
          <>
            {/* Featured Post Card */}
            {featuredPost && !searchQuery && !selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-24"
              >
                <Link to={`/blog/${featuredPost.slug}`} className="group block">
                  <div className="relative aspect-[21/10] rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
                    <img 
                      src={featuredPost.featured_image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80'} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                      <div className="max-w-2xl">
                        <span className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">
                           Featured Story
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-none mb-6 group-hover:text-orange-400 transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-zinc-300 text-lg md:text-xl line-clamp-2 mb-8 font-medium">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-zinc-400 text-sm font-bold">
                           <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8 min read</span>
                           <span>{formatDate(featuredPost.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Posts Grid/List */}
            <div className={cn(
              "grid gap-12",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              <AnimatePresence mode="popLayout">
                {(searchQuery || selectedCategory ? filteredPosts : remainingPosts).map((post, index) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={cn(
                      "group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-2xl hover:border-orange-500/20",
                      viewMode === 'list' && "flex flex-col md:flex-row"
                    )}
                  >
                    <Link to={`/blog/${post.slug}`} className={cn("block", viewMode === 'list' && "flex flex-col md:flex-row h-full w-full")}>
                      <div className={cn(
                        "relative overflow-hidden bg-zinc-100 dark:bg-zinc-800",
                        viewMode === 'grid' ? "aspect-[16/10]" : "md:w-96 aspect-[16/10] md:aspect-auto"
                      )}>
                        <img 
                          src={post.featured_image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute top-6 left-6">
                           <span className="px-3 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest text-zinc-900 dark:text-white shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                             {categories.find(c => c.id === post.category_id)?.name || 'General'}
                           </span>
                        </div>
                      </div>
                      <div className={cn("p-10 flex flex-col flex-1", viewMode === 'list' && "justify-center")}>
                        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors leading-tight line-clamp-2 mb-4">
                          {post.title}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-base line-clamp-3 leading-relaxed mb-8 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 5 min</span>
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white group-hover:bg-orange-600 group-hover:text-white transition-all">
                             <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredPosts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
              >
                <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                   <Search className="w-10 h-10 text-zinc-300" />
                </div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">No articles match your hunt</h2>
                <p className="text-zinc-500 max-w-sm mx-auto font-medium">
                  Try adjusting your search terms or picking a different topic from the menu.
                </p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}
                  className="mt-8 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {/* Newsletter Inline */}
            <section className="mt-32">
               <NewsletterSignupForm variant="inline" />
            </section>
          </>
        )}
      </main>

      {/* Category Navigation Bar */}
      <section className="bg-orange-600 py-16 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-8">
               <Tag className="w-6 h-6 text-white/50" />
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">Explore Topics</h2>
            </div>
            <div className="flex flex-wrap gap-4">
               {categories.map(cat => (
                 <Link 
                  key={cat.id} 
                  to={`/categories/${cat.slug}`} 
                  className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-orange-600 border border-white/20 rounded-2xl font-black transition-all text-sm uppercase tracking-widest active:scale-95"
                >
                   {cat.name}
                 </Link>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}