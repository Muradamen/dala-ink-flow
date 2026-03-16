import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../store';
import { formatDate } from '../lib/utils';
import { Clock, User, Share2, Bookmark, ArrowLeft, ChevronRight, Tag } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { SEO } from '../components/SEO';
import { CommentSection } from '../components/blog/CommentSection';
import { NewsletterSignupForm } from '../components/NewsletterSignupForm';
import { toast } from 'sonner';

export function SinglePost() {
  const { slug } = useParams();
  const { getPostBySlug, getAuthorById, getCategoryById, posts } = useBlog();
  const post = getPostBySlug(slug || '');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const readingTime = useMemo(() => {
    if (!post?.content) return 0;
    const words = post.content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [post?.content]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="text-center max-w-md">
          <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl inline-block">
             <h1 className="text-6xl font-black text-orange-600 mb-2">404</h1>
             <p className="text-zinc-500 font-bold uppercase tracking-widest">Story Not Found</p>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            The article you're looking for might have been moved, deleted, or never existed in the first place.
          </p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black hover:bg-orange-600 dark:hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-zinc-900/10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  const author = getAuthorById(post.author_id);
  const category = getCategoryById(post.category_id);
  const relatedPosts = posts.filter(p => p.category_id === post.category_id && p.id !== post.id).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt || '',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Structured Data for Google (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.meta_title || post.title,
    "image": [post.social_image_url || post.featured_image_url],
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": author ? {
      "@type": "Person",
      "name": author.name,
      "url": `https://meyra.blog/authors/${author.id}`
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": "Meyra Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://meyra.blog/logo.png"
      }
    },
    "description": post.meta_description || post.excerpt
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen selection:bg-orange-100 dark:selection:bg-orange-500/30">
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ''}
        image={post.social_image_url || post.featured_image_url || ''}
        type="article"
        author={author?.name}
        publishedTime={post.published_at || post.created_at}
        modifiedTime={post.updated_at || post.created_at}
      />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-orange-600 z-[100] origin-left"
        style={{ scaleX }}
      />
      
      {/* Post Header */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <Link 
              to="/blog"
              className="text-zinc-400 hover:text-orange-600 transition-colors text-xs font-black uppercase tracking-widest"
            >
              The Feed
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-300" />
            <Link 
              to={`/categories/${category?.slug}`}
              className="text-orange-600 font-black uppercase tracking-widest text-xs hover:underline"
            >
              {category?.name || 'Uncategorized'}
            </Link>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 dark:text-white leading-[1.1] mb-10 tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-center gap-6 py-8 border-y border-zinc-100 dark:border-zinc-800/50">
            {author && (
              <div className="flex items-center gap-4 group">
                <img 
                  src={author.avatar} 
                  alt={author.name} 
                  className="w-12 h-12 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 shadow-sm transition-transform group-hover:scale-110"
                />
                <div className="text-left">
                  <p className="text-sm font-black text-zinc-900 dark:text-white">{author.name}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{author.role}</p>
                </div>
              </div>
            )}
            <div className="hidden sm:block w-px h-10 bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center gap-6 text-zinc-500 text-sm font-bold">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                {readingTime} min read
              </div>
              <div className="flex items-center gap-2">
                <span className="p-1 bg-zinc-50 dark:bg-zinc-900 rounded text-[10px]">{formatDate(post.created_at)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Featured Image Section */}
      {post.featured_image_url && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative aspect-[21/10] rounded-[2.5rem] overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-900 group"
          >
            <img 
              src={post.featured_image_url} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-xl dark:prose-invert prose-orange max-w-none 
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-white
            prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-8
            prose-a:text-orange-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:font-medium
            prose-img:rounded-3xl prose-img:shadow-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share & Actions */}
        <div className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-sm hover:bg-orange-600 dark:hover:bg-orange-500 transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" /> Share Article
              </button>
              <button 
                className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-zinc-500 hover:text-orange-600 transition-colors"
                title="Save for later"
              >
                <Bookmark className="w-5 h-5" />
              </button>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest mr-2">Topic:</span>
              <Link 
                to={`/categories/${category?.slug}`} 
                className="px-4 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-orange-100 transition-colors"
              >
                {category?.name || 'General'}
              </Link>
           </div>
        </div>

        {/* Newsletter Section */}
        <section className="mt-24">
           <NewsletterSignupForm variant="boxed" />
        </section>

        {/* Author Details Card */}
        {author && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-24 p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left border border-zinc-100 dark:border-zinc-800/50"
          >
            <div className="relative">
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-32 h-32 rounded-[2rem] border-4 border-white dark:border-zinc-800 shadow-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-2 rounded-xl shadow-lg">
                 <User className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-2">Author Spotlight</p>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">{author.name}</h3>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {author.bio}
              </p>
              <div className="mt-8 flex justify-center md:justify-start gap-4">
                 <Link 
                  to={`/authors/${author.id}`} 
                  className="px-6 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black hover:bg-zinc-100 transition-all"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comments Section Wrapper */}
        <div id="comments" className="mt-32">
          <div className="flex items-center gap-4 mb-12">
             <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
             <div className="px-6 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Join the Conversation</div>
             <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <CommentSection postId={post.id} />
        </div>
      </div>

      {/* Next Article / Related Footer */}
      {relatedPosts.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900/50 py-32 mt-32 border-t border-zinc-100 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">Keep Exploring</h2>
                <p className="text-zinc-500 font-medium text-lg">Dive deeper into the {category?.name || 'tech'} ecosystem.</p>
              </div>
              <Link to="/blog" className="hidden md:flex items-center gap-2 text-sm font-black text-orange-600 hover:gap-3 transition-all underline underline-offset-8 decoration-2">
                Browse All Articles <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedPosts.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/blog/${p.slug}`} className="group block">
                    <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 bg-zinc-200 dark:bg-zinc-800 shadow-lg">
                      <img 
                        src={p.featured_image_url || ''} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3">
                       <Tag className="w-3 h-3" /> {category?.name || 'Insight'}
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">
                      {p.title}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}