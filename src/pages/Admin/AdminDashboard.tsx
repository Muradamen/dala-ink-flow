import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { DashboardOverview } from '../../components/admin/DashboardOverview';
import { PostManagement } from '../../components/admin/PostManagement';
import { PostEditor } from '../../components/admin/PostEditor';
import { CommentModeration } from '../../components/admin/CommentModeration';
import { NewsletterManagement } from '../../components/admin/NewsletterManagement';
import { Settings as SettingsIcon, Database } from 'lucide-react';
import { useBlog } from '../../store';
import { toast } from 'sonner';

export function AdminLayout() {
  const { posts, loading, seedSampleContent } = useBlog();

  // Auto-seed if database is empty and not loading
  useEffect(() => {
    if (!loading && posts.length === 0) {
      const hasSeeded = localStorage.getItem('meyra_blog_initial_seed');
      if (!hasSeeded) {
        toast('Welcome! No posts found. Seeding sample content...', {
          icon: <Database className="w-4 h-4 text-orange-600" />,
          duration: 5000,
        });
        seedSampleContent().then(() => {
          localStorage.setItem('meyra_blog_initial_seed', 'true');
        }).catch(err => {
          console.error('Auto-seed failed:', err);
        });
      }
    }
  }, [loading, posts.length, seedSampleContent]);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/posts" element={<PostManagement />} />
          <Route path="/posts/new" element={<PostEditor />} />
          <Route path="/posts/edit/:id" element={<PostEditor isEdit />} />
          <Route path="/comments" element={<CommentModeration />} />
          <Route path="/newsletter" element={<NewsletterManagement />} />
          <Route path="*" element={
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
               <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-full mb-4">
                  <SettingsIcon className="w-8 h-8 text-orange-600 animate-spin-slow" />
               </div>
               <h2 className="text-xl font-black text-zinc-900 dark:text-white">Feature Under Construction</h2>
               <p className="text-zinc-500 mt-2 max-w-xs">We're working hard to bring this module to the Meyra Admin panel.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}