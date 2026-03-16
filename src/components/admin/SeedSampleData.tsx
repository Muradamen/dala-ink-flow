import React, { useState } from 'react';
import { Database, Sparkles, Loader2, CheckCircle2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useBlog } from '../../store';
import { toast } from 'sonner';

const SAMPLE_POSTS = [
  {
    title: '10 Essential Web Development Tools for 2025',
    slug: 'essential-web-dev-tools-2025',
    excerpt: 'Stay ahead of the curve with the most impactful web development tools of 2025.',
    content: `<p>Modern web development is moving faster than ever. From AI-powered IDEs to next-gen deployment platforms, these are the tools you need to stay ahead of the curve.</p><h2>The Next-Gen IDE</h2><p>VS Code continues to dominate, but with AI integration, it's becoming more than just an editor.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
    meta_title: '10 Essential Web Dev Tools 2025 | Meyra Blog',
    meta_description: 'Discover the must-have tools for modern web developers in 2025.',
    category_name: 'Technology',
    category_slug: 'technology'
  },
  {
    title: 'The Rise of Edge Computing in Modern Architecture',
    slug: 'rise-of-edge-computing',
    excerpt: 'How edge computing is reshaping the landscape of modern digital infrastructure.',
    content: `<p>Edge computing is transforming how we process data, moving computation closer to where it's needed. This post explores why this shift is happening and how it impacts latency and performance.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'Edge Computing in Modern Architecture | Meyra Blog',
    meta_description: 'Explore the benefits and implementation strategies of edge computing.',
    category_name: 'Technology',
    category_slug: 'technology'
  },
  {
    title: 'Mastering React 19: New Features and Best Practices',
    slug: 'mastering-react-19',
    excerpt: 'A deep dive into the latest version of React and its most impactful updates.',
    content: `<p>React 19 brings powerful new features like Server Actions and improved Hooks. Learn how to leverage these tools to build faster and more maintainable user interfaces.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'Mastering React 19 Features | Meyra Blog',
    meta_description: "Get up to speed with React 19's new features and best practices.",
    category_name: 'Technology',
    category_slug: 'technology'
  },
  {
    title: 'Why Cybersecurity is More Important Than Ever for Startups',
    slug: 'cybersecurity-for-startups',
    excerpt: 'Protect your startup from evolving digital threats with these key security strategies.',
    content: `<p>In an increasingly digital world, startups are becoming prime targets for cyberattacks. Learn the essential security measures every small business should implement from day one.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'Cybersecurity Essentials for Startups | Meyra Blog',
    meta_description: 'Essential cybersecurity strategies to protect your growing business.',
    category_name: 'Technology',
    category_slug: 'technology'
  },
  {
    title: 'The Evolution of UX Design: Trends to Watch',
    slug: 'evolution-of-ux-design',
    excerpt: 'Stay ahead of the curve with these emerging trends in user experience design.',
    content: `<p>UX design is constantly evolving. We look at the top trends for the coming year, including voice interfaces, accessibility-first design, and immersive experiences.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'UX Design Trends and Evolution | Meyra Blog',
    meta_description: 'Discover the future of user experience design and key trends for the year.',
    category_name: 'Technology',
    category_slug: 'technology'
  },
  {
    title: 'Building Scalable Backend Systems with Node.js and Supabase',
    slug: 'scalable-backend-nodejs-supabase',
    excerpt: 'Master the combination of Node.js and Supabase for high-performance backends.',
    content: `<p>Learn how to combine the power of Node.js with Supabase's scalable architecture to build robust backend systems that can handle any load.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'Scalable Backend with Node.js and Supabase | Meyra Blog',
    meta_description: 'Build high-performance, scalable backend systems with ease.',
    category_name: 'Technology',
    category_slug: 'technology'
  },
  {
    title: 'The Impact of Artificial Intelligence on Creative Industries',
    slug: 'ai-impact-creative-industries',
    excerpt: 'How AI is reshaping creativity, art, and content production in modern industries.',
    content: `<p>Artificial Intelligence is changing the creative landscape, from AI-generated art to automated content creation. We discuss the implications for creative professionals.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'AI in Creative Industries | Meyra Blog',
    meta_description: 'Explore the impact of AI on creativity and the future of the arts.',
    category_name: 'Artificial Intelligence',
    category_slug: 'ai'
  },
  {
    title: 'Data Privacy in the Age of Big Data',
    slug: 'data-privacy-big-data',
    excerpt: 'Navigating the complexities of data privacy in a world driven by big data.',
    content: `<p>With more data being generated than ever before, privacy has become a major concern. Learn about the latest regulations and best practices for data protection.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'Data Privacy and Protection | Meyra Blog',
    meta_description: 'Essential guide to data privacy regulations and security best practices.',
    category_name: 'Technology',
    category_slug: 'technology'
  },
  {
    title: 'Remote Work Culture: Strategies for Success',
    slug: 'remote-work-culture-strategies',
    excerpt: 'Building a thriving remote work culture and staying productive in a distributed team.',
    content: `<p>Remote work is here to stay. Discover how to build a strong team culture, maintain productivity, and avoid burnout when working from anywhere.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'Success in Remote Work Culture | Meyra Blog',
    meta_description: 'Proven strategies for building and maintaining a successful remote work culture.',
    category_name: 'Technology',
    category_slug: 'technology'
  },
  {
    title: 'The Future of Sustainable Technology',
    slug: 'future-of-sustainable-tech',
    excerpt: 'How sustainable technology is shaping the future of innovation and environmental responsibility.',
    content: `<p>Sustainable tech is no longer just a trend—it's a necessity. We explore the innovations driving the green revolution in the tech sector.</p>`,
    featured_image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000',
    meta_title: 'Sustainable Tech Future | Meyra Blog',
    meta_description: 'Insights into the green revolution and the future of sustainable innovation.',
    category_name: 'Technology',
    category_slug: 'technology'
  }
];

export const SeedSampleData: React.FC = () => {
  const { refreshPosts, categories } = useBlog();
  const [isSeeding, setIsSeeding] = useState(false);

  const seedSamplePosts = async () => {
    setIsSeeding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let createdCount = 0;

      for (const sample of SAMPLE_POSTS) {
        // 1. Ensure category exists
        let categoryId = categories.find(c => c.slug === sample.category_slug)?.id;
        
        if (!categoryId) {
          const { data: newCat, error: catError } = await supabase
            .from('categories')
            .upsert({
              name: sample.category_name,
              slug: sample.category_slug,
              description: `Articles related to ${sample.category_name}.`,
              language: 'en'
            }, { onConflict: 'slug' })
            .select()
            .single();
          
          if (catError) throw catError;
          categoryId = newCat.id;
        }

        // 2. Insert post with ON CONFLICT DO NOTHING
        const { error: postError } = await supabase
          .from('posts')
          .upsert({
            title: sample.title,
            slug: sample.slug,
            excerpt: sample.excerpt,
            content: sample.content,
            featured_image_url: sample.featured_image_url,
            category_id: categoryId,
            status: 'published',
            author_id: user?.id || null,
            meta_title: sample.meta_title,
            meta_description: sample.meta_description,
            language: 'en',
            published_at: new Date().toISOString()
          }, { onConflict: 'slug' });

        if (postError) {
          console.error(`Error seeding post ${sample.slug}:`, postError);
        } else {
          createdCount++;
        }
      }

      toast.success(`Successfully seeded ${createdCount} sample posts!`);
      await refreshPosts();
    } catch (error: any) {
      console.error('Seeding error:', error);
      toast.error('Failed to seed data: ' + error.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-2xl">
        <Sparkles className="w-6 h-6 text-orange-600" />
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Quick Start</h3>
        <p className="text-xs text-zinc-500 mt-1">Populate your blog with 10 high-quality sample posts with featured images.</p>
      </div>
      <button
        onClick={seedSamplePosts}
        disabled={isSeeding}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black hover:bg-zinc-800 dark:hover:bg-zinc-300 transition-all disabled:opacity-50"
      >
        {isSeeding ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Seeding 10 Posts...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Seed 10 Sample Posts
          </>
        )}
      </button>
    </div>
  );
};