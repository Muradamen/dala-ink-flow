import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBlog } from '../store';
import { formatDate } from '../lib/utils';
import { ArrowRight, Clock } from 'lucide-react';
import { SEO } from '../components/SEO';
import { NewsletterSignupForm } from '../components/NewsletterSignupForm';

export function Home() {
  const { posts, categories, loading } = useBlog();
  const featuredPost = posts.find(p => p.status === 'published');
  const latestPosts = posts.filter(p => p.status === 'published').slice(1, 4);

  return (
    <div className="flex flex-col gap-20 pb-20">
      <SEO 
        title="Meyra Blog - Navigating the Ethiopian Tech Frontier"
        description="Meyra Blog provides independent insights on AI, tech business trends, and startup announcements shaping the future of Ethiopia's digital economy."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f2cc6f-5f7c-49f8-bb43-379eb530d0ac/meyra-blog-hero-background-cb8ef288-1773626657532.webp"
            alt="Meyra Blog Hero"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight"
          >
            Navigating the <br />
            <span className="text-orange-600">Ethiopian Tech Frontier.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            Meyra Blog provides independent insights on AI, tech business trends, and startup announcements shaping the future of Ethiopia's digital economy.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/blog"
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all transform hover:scale-105"
            >
              Latest Insights
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full backdrop-blur-sm transition-all"
            >
              Our Mission
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      {!loading && featuredPost && (
        <section className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-orange-600 font-bold uppercase tracking-widest text-sm">Featured Insight</span>
              <h2 className="mt-4 text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white leading-tight">
                {featuredPost.title}
              </h2>
              <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
                {featuredPost.excerpt}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  5 min read
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-300" />
                <span className="text-zinc-500 text-sm font-medium">{formatDate(featuredPost.published_at)}</span>
              </div>
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="mt-8 inline-flex items-center gap-2 text-zinc-900 dark:text-white font-bold hover:text-orange-600 dark:hover:text-orange-400 group"
              >
                Read Full Story <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-800"
            >
              <img
                src={featuredPost.featured_image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories Bar */}
      <section className="bg-zinc-100 dark:bg-zinc-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-orange-500 dark:hover:border-orange-500 transition-all text-center group min-w-[160px]"
              >
                <span className="block text-sm font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">{cat.name}</span>
                {cat.description && <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{cat.description}</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Latest Reports</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Fresh updates from the heart of the tech ecosystem.</p>
          </div>
          <Link to="/blog" className="text-orange-600 font-bold hover:underline">View All Articles</Link>
        </div>
        
        {loading ? (
           <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={post.featured_image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest">
                      {categories.find(c => c.id === post.category_id)?.name || 'General'}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 pt-2 uppercase tracking-widest">
                      <span>{formatDate(post.published_at)}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300" />
                      <span>5 min read</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <NewsletterSignupForm variant="boxed" />
      </section>
    </div>
  );
}