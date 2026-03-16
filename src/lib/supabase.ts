import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://isxjvwttyknslkjlecgb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzeGp2d3R0eWtuc2xramxlY2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjI5NTMsImV4cCI6MjA4OTE5ODk1M30.6SQUCG5_5dXMKkF0SA3IhPsNcMx-wlCL44aGlXeVcNA';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Uploads an image to the Supabase Storage bucket.
 * @param file The file object to upload
 * @param bucket The bucket name (defaults to 'blog-images')
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (file: File, bucket: string = 'blog-images'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

/**
 * Searches for blog posts across title, content, excerpt, category name, and tags.
 * @param query The search query string
 * @returns A list of matching posts with their categories and tags
 */
export const searchBlogPosts = async (query: string) => {
  if (!query.trim()) return [];

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      post_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  const { data: categoryMatches } = await supabase
    .from('posts')
    .select(`
      *,
      categories!inner (
        id,
        name,
        slug
      ),
      post_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .ilike('categories.name', searchTerm)
    .eq('status', 'published');

  const { data: tagMatches } = await supabase
    .from('posts')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      post_tags!inner (
        tags!inner (
          id,
          name,
          slug
        )
      )
    `)
    .ilike('post_tags.tags.name', searchTerm)
    .eq('status', 'published');

  const allResults = [
    ...(data || []),
    ...(categoryMatches || []),
    ...(tagMatches || [])
  ];

  const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
  
  return uniqueResults.sort((a, b) => 
    new Date(b.published_at || b.created_at).getTime() - 
    new Date(a.published_at || a.created_at).getTime()
  );
};

/**
 * Newsletter Subscriptions
 */

/**
 * Subscribes an email to the newsletter.
 * @param email The email address to subscribe
 */
export const subscribeToNewsletter = async (email: string) => {
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ email }])
    .select()
    .single();

  if (error) {
    // Handle unique constraint violation (already subscribed)
    if (error.code === '23505') {
      throw new Error('This email is already subscribed to our newsletter.');
    }
    throw error;
  }

  return data;
};

/**
 * Fetches all newsletter subscribers (Admin only).
 */
export const getSubscribers = async () => {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers:', error);
    throw error;
  }

  return data;
};

/**
 * Deletes a newsletter subscriber (Admin only).
 * @param id The ID of the subscriber to delete
 */
export const deleteSubscriber = async (id: string) => {
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subscriber:', error);
    throw error;
  }
};

/**
 * Newsletter Campaigns
 */

/**
 * Fetches all newsletter campaigns (Admin only).
 */
export const getNewsletterCampaigns = async () => {
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .select('*')
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }

  return data;
};

/**
 * Creates a new newsletter campaign record (Admin only).
 * @param subject The email subject
 * @param content The email content (HTML)
 */
export const createNewsletterCampaign = async (subject: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .insert([{ 
      subject, 
      content,
      sent_by: user?.id 
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }

  return data;
};