import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Post, Category, Author } from './types';
import { supabase } from './lib/supabase';
import { toast } from 'sonner';

interface BlogContextType {
  posts: Post[];
  categories: Category[];
  authors: Author[];
  loading: boolean;
  refreshPosts: () => Promise<void>;
  addPost: (post: Partial<Post>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostBySlug: (slug: string) => Post | undefined;
  getCategoryById: (id: string | null) => Category | undefined;
  getAuthorById: (id: string | null) => Author | undefined;
  seedSampleContent: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }
    setCategories((data || []).map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      color: 'orange' 
    })));
  }, []);

  const fetchAuthors = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) {
      console.error('Error fetching authors:', error);
      return;
    }
    setAuthors((data || []).map(a => ({
      id: a.id,
      name: a.full_name || a.username || 'Unknown Author',
      role: a.role || 'Writer',
      avatar: a.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'A Meyra Blog contributor.'
    })));
  }, []);

  const refreshPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
      setLoading(false);
      return;
    }

    const transformedPosts: Post[] = (data || []).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      featured_image_url: p.featured_image_url,
      author_id: p.author_id,
      category_id: p.category_id,
      status: p.status as any,
      meta_title: p.meta_title,
      meta_description: p.meta_description,
      social_image_url: p.social_image_url,
      published_at: p.published_at || p.created_at,
      views: p.views || 0,
      created_at: p.created_at,
      updated_at: p.updated_at
    }));

    setPosts(transformedPosts);
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchCategories(), fetchAuthors(), refreshPosts()]);
    };
    init();
  }, [fetchCategories, fetchAuthors, refreshPosts]);

  const addPost = async (newPost: Partial<Post>) => {
    const { error } = await supabase
      .from('posts')
      .insert(newPost as any);
    if (error) {
      console.error('Error adding post:', error);
      toast.error(error.message);
      throw error;
    }
    await refreshPosts();
  };

  const updatePost = async (id: string, updatedFields: Partial<Post>) => {
    const { error } = await supabase
      .from('posts')
      .update(updatedFields as any)
      .eq('id', id);
    if (error) {
      console.error('Error updating post:', error);
      toast.error(error.message);
      throw error;
    }
    await refreshPosts();
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting post:', error);
      toast.error(error.message);
      throw error;
    }
    await refreshPosts();
  };

  const seedSampleContent = async () => {
    try {
      setLoading(true);
      // Create a category first
      const { data: catData, error: catError } = await supabase.from('categories').insert([{
        name: 'Technology & AI',
        slug: 'technology-ai',
        description: 'Latest insights in AI and business technology.',
        language: 'en'
      }]).select().single();

      if (catError && catError.code !== '23505') throw catError;
      
      const categoryId = catData?.id || (categories.find(c => c.slug === 'technology-ai')?.id);

      // Create a post
      const { error: postError } = await supabase.from('posts').insert([{
        title: 'The Future of AI in Modern Business: Strategies for Success',
        slug: 'future-ai-modern-business',
        excerpt: 'Explore how artificial intelligence is reshaping the corporate landscape and how your business can adapt to thrive in an AI-first world.',
        content: `
<h2>The AI Revolution in Business</h2>
<p>Artificial intelligence (AI) is no longer a futuristic concept reserved for science fiction; it is a fundamental driver of innovation in today's business world. From automating routine tasks to providing deep predictive analytics, AI is transforming how companies operate, compete, and deliver value to customers.</p>

<h3>Why Business Insights Matter Now More Than Ever</h3>
<p>In an era of data abundance, the ability to extract actionable insights is the ultimate competitive advantage. Business intelligence tools, powered by AI, allow organizations to pivot quickly based on market trends and consumer behavior.</p>

<h3>Key Strategies for AI Integration</h3>
<ul>
  <li><strong>Identify High-Impact Use Cases:</strong> Focus on areas where AI can provide immediate value, such as customer support automation or supply chain optimization.</li>
  <li><strong>Invest in Data Quality:</strong> AI is only as good as the data it's trained on. Ensure your data pipelines are robust and clean.</li>
  <li><strong>Foster an AI-First Culture:</strong> Encourage experimentation and continuous learning among your staff to demystify AI.</li>
</ul>

<p>As we look toward the future, the integration of AI and human expertise will be the hallmark of successful enterprises. Stay tuned for more insights on the Meyra Blog.</p>
`,
        featured_image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f2cc6f-5f7c-49f8-bb43-379eb530d0ac/the-future-of-ai-in-modern-business-ce1ee2c4-1773631391724.webp',
        category_id: categoryId,
        status: 'published',
        language: 'en',
        meta_title: 'The Future of AI in Modern Business | Meyra Blog',
        meta_description: 'Discover how AI is transforming business strategies and driving growth in 2024.',
        published_at: new Date().toISOString()
      }]);

      if (postError) throw postError;

      toast.success('Sample content added successfully!');
      await Promise.all([fetchCategories(), refreshPosts()]);
    } catch (err: any) {
      console.error('Error seeding content:', err);
      toast.error('Failed to seed content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);
  const getCategoryById = (id: string | null) => categories.find(c => c.id === id);
  const getAuthorById = (id: string | null) => authors.find(a => a.id === id);

  return (
    <BlogContext.Provider value={{ 
      posts, categories, authors, loading,
      refreshPosts, addPost, updatePost, deletePost, 
      getPostBySlug, getCategoryById, getAuthorById,
      seedSampleContent
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within a BlogProvider');
  return context;
};