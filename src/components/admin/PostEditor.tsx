import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Globe, Eye, Settings, Image as ImageIcon, Sparkles, Trash, Upload, Check, Loader2, Layout, Search, BarChart3, MessageSquare, Twitter, ExternalLink, Info } from 'lucide-react';
import { useBlog } from '../../store';
import { toast } from 'sonner';
import { AIWriter } from './AIWriter';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { Post } from '../../types';

interface PostEditorProps {
  isEdit?: boolean;
}

export const PostEditor: React.FC<PostEditorProps> = ({ isEdit = false }) => {
  const { categories, addPost, updatePost, posts, loading: blogLoading } = useBlog();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const existingPost = posts.find(p => p.id === id);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    featured_image_url: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    meta_title: '',
    meta_description: '',
    social_image_url: '',
  });

  useEffect(() => {
    if (isEdit && existingPost) {
      setFormData({
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt || '',
        content: existingPost.content,
        category_id: existingPost.category_id || (categories[0]?.id || ''),
        featured_image_url: existingPost.featured_image_url || '',
        status: existingPost.status,
        meta_title: existingPost.meta_title || '',
        meta_description: existingPost.meta_description || '',
        social_image_url: existingPost.social_image_url || '',
      });
    } else if (categories.length > 0 && !formData.category_id) {
       setFormData(prev => ({ ...prev, category_id: categories[0].id }));
    }
  }, [isEdit, existingPost, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      const dbData: Partial<Post> = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category_id: formData.category_id || null,
        featured_image_url: formData.featured_image_url || null,
        status: formData.status,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        social_image_url: formData.social_image_url || null,
        author_id: user?.id || null,
        updated_at: new Date().toISOString()
      };

      if (isEdit && id) {
        await updatePost(id, dbData);
        toast.success('Post updated successfully');
      } else {
        await addPost(dbData);
        toast.success('Post published successfully');
      }
      navigate('/admin/posts');
    } catch (err: any) {
      toast.error('Failed to save post: ' + err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'featured_image_url' | 'social_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(field);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, [field]: publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Upload failed: ' + error.message);
    } finally {
      setIsUploading(null);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      // Only auto-generate slug for new posts if it hasn't been edited manually
      slug: !isEdit ? generateSlug(val) : prev.slug
    }));
  };

  const seoScore = useMemo(() => {
    let score = 0;
    if (formData.meta_title && formData.meta_title.length >= 30 && formData.meta_title.length <= 60) score += 25;
    if (formData.meta_description && formData.meta_description.length >= 100 && formData.meta_description.length <= 160) score += 25;
    if (formData.social_image_url || formData.featured_image_url) score += 25;
    if (formData.content.length > 500) score += 25;
    return score;
  }, [formData.meta_title, formData.meta_description, formData.social_image_url, formData.featured_image_url, formData.content]);

  if (blogLoading && isEdit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
        <p className="text-zinc-500 font-bold animate-pulse">Fetching your masterpiece...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/posts')}
            className="p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{isEdit ? 'Edit Article' : 'New Story'}</h1>
            <div className="flex items-center gap-2">
               <span className={cn(
                 "w-2 h-2 rounded-full",
                 formData.status === 'published' ? "bg-green-500" : "bg-amber-500"
               )} />
               <p className="text-xs font-bold text-zinc-500 uppercase">{formData.status}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button 
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="flex-1 md:flex-none px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-black hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
           >
             Discard
           </button>
           <button 
             form="post-form"
             type="submit"
             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
           >
             <Save className="w-4 h-4" />
             {isEdit ? 'Save Changes' : 'Publish Now'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab('content')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'content' ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab('seo')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'seo' ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              SEO & Social
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'media' ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Media
            </button>
          </div>

          <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'content' && (
              <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Main Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleTitleChange}
                      className="w-full px-0 bg-transparent border-none text-4xl font-black focus:ring-0 placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
                      placeholder="The Headline Goes Here..."
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50 w-fit">
                     <Globe className="w-4 h-4 text-zinc-400" />
                     <span className="text-xs text-zinc-400 font-bold">meyra.blog/</span>
                     <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      className="bg-transparent border-none p-0 text-xs font-bold text-orange-600 focus:ring-0"
                      placeholder="url-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Short Excerpt</label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-orange-500 text-sm font-medium leading-relaxed"
                    placeholder="A compelling summary to hook readers..."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Story Content</label>
                    <div className="flex gap-4">
                       <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><Layout className="w-3 h-3"/> Blocks</span>
                       <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Assisted</span>
                    </div>
                  </div>
                  <textarea
                    rows={15}
                    required
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full px-6 py-6 bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 rounded-3xl focus:ring-2 focus:ring-orange-500 text-base font-medium leading-relaxed min-h-[500px] shadow-inner"
                    placeholder="Write your story..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-orange-600" />
                      <h3 className="text-sm font-black uppercase tracking-widest">Search Engine Presence</h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full border border-green-100 dark:border-green-900/30">
                      <Check className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase">Auto-sync enabled</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Meta Title</label>
                        <span className={cn("text-[10px] font-bold", formData.meta_title.length > 60 ? "text-red-500" : "text-zinc-400")}>
                          {formData.meta_title.length} / 60
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.meta_title}
                        onChange={e => setFormData({...formData, meta_title: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-orange-500 text-sm font-bold"
                        placeholder="SEO Title (e.g. 5 Tech Trends in Ethiopia for 2024)"
                      />
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1"><Info className="w-3 h-3"/> Use 50-60 characters for best Google results.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Meta Description</label>
                        <span className={cn("text-[10px] font-bold", formData.meta_description.length > 160 ? "text-red-500" : "text-zinc-400")}>
                          {formData.meta_description.length} / 160
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={formData.meta_description}
                        onChange={e => setFormData({...formData, meta_description: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-orange-500 text-sm font-medium leading-relaxed"
                        placeholder="Summarize your article for search engines..."
                      />
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1"><Info className="w-3 h-3"/> Use 120-160 characters for best click-through rate.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Social Media Preview</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Share Image (1200x630)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.social_image_url}
                            onChange={e => setFormData({...formData, social_image_url: e.target.value})}
                            className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-orange-500 text-xs font-mono"
                            placeholder="Social Image URL..."
                          />
                          <label className="cursor-pointer flex items-center justify-center p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 transition-colors border border-zinc-200 dark:border-zinc-700">
                            {isUploading === 'social_image_url' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'social_image_url')} />
                          </label>
                        </div>
                        <p className="text-[10px] text-zinc-500 italic">Defaults to featured image if left empty.</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl">
                         <div className="flex gap-3 items-start">
                            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                              Social media images should be high-contrast and contain minimal text for best performance on mobile feeds.
                            </p>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                       {/* Google Search Preview Mockup */}
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700 overflow-hidden shadow-inner">
                           <p className="text-xs text-zinc-400 mb-3 flex items-center gap-2"><Globe className="w-3 h-3"/> Google Search Preview</p>
                           <div className="space-y-1">
                              <h4 className="text-lg text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer leading-snug">{formData.meta_title || formData.title || 'Page Title'}</h4>
                              <p className="text-xs text-green-700 dark:text-green-500 truncate">meyra.blog \u203a {formData.slug || 'slug'}</p>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">{formData.meta_description || formData.excerpt || 'Enter a meta description to see how this will look in search results.'}</p>
                           </div>
                        </div>

                        {/* Twitter Card Preview */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                           <div className="aspect-[1.91/1] bg-zinc-100 dark:bg-zinc-800 relative">
                              {(formData.social_image_url || formData.featured_image_url) ? (
                                <img src={formData.social_image_url || formData.featured_image_url} className="w-full h-full object-cover" alt="OG Preview" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                   <ImageIcon className="w-8 h-8 text-zinc-300" />
                                </div>
                              )}
                           </div>
                           <div className="p-4">
                              <p className="text-xs text-zinc-400 uppercase font-black tracking-widest mb-1">Meyra.blog</p>
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 truncate">{formData.meta_title || formData.title || 'Title'}</h4>
                              <p className="text-xs text-zinc-500 line-clamp-1">{formData.meta_description || formData.excerpt || 'Article summary...'}</p>
                           </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Featured Image Management</h3>
                </div>

                <div className="space-y-6">
                  <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center group hover:border-orange-500 transition-colors">
                    {formData.featured_image_url ? (
                      <div className="relative">
                        <img src={formData.featured_image_url} className="w-full max-h-[400px] object-cover rounded-2xl shadow-lg" alt="Featured" />
                        <div className="absolute top-4 right-4 flex gap-2">
                           <button 
                            type="button"
                            onClick={() => setFormData({...formData, featured_image_url: ''})}
                            className="p-2 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-colors"
                           >
                             <Trash className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-400 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900 dark:text-white">Click to upload featured image</p>
                          <p className="text-xs text-zinc-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
                        </div>
                        <label className="inline-flex px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-black rounded-xl cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200">
                          {isUploading === 'featured_image_url' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Choose File'}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'featured_image_url')} />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Manual Image URL</label>
                    <input
                      type="text"
                      value={formData.featured_image_url}
                      onChange={e => setFormData({...formData, featured_image_url: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-orange-500 text-xs font-mono"
                      placeholder="Or paste a URL from Unsplash or Pexels..."
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <AIWriter 
            currentContent={formData.content}
            currentTitle={formData.title}
            onGenerateContent={(data) => setFormData(prev => ({ ...prev, ...data, slug: generateSlug(data.title) }))}
            onSuggestTags={(tags) => console.log('Tags suggested:', tags)}
            onSuggestMeta={(meta) => setFormData(prev => ({ ...prev, meta_description: meta }))}
          />

          <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Publish Settings</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">Category</label>
                <select
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-orange-500 text-sm font-bold outline-none cursor-pointer"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">Visibility Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-orange-500 text-sm font-bold outline-none cursor-pointer"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Public)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-zinc-500">Words Count</span>
                    <span className="text-zinc-900 dark:text-white">{formData.content.trim() ? formData.content.trim().split(/\\s+/).length : 0}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-zinc-500">Reading Time</span>
                    <span className="text-zinc-900 dark:text-white">{Math.ceil((formData.content.trim() ? formData.content.trim().split(/\\s+/).length : 0) / 200)} min</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30 space-y-4">
             <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-600">Optimization Score</h3>
             </div>
             <div className="space-y-2">
                <div className="h-2 bg-orange-200 dark:bg-orange-900/50 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-orange-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${seoScore}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-orange-700 dark:text-orange-400">
                  {seoScore === 100 ? "Perfectly optimized!" : "Complete all SEO fields for better visibility."}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};