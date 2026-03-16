import React from 'react';
import { Search, Filter, Plus, Edit, Trash, FileText, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../../store';
import { formatDate, cn } from '../../lib/utils';
import { toast } from 'sonner';

export const PostManagement = () => {
  const { posts, deletePost, loading } = useBlog();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        toast.success('Post deleted successfully');
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Content Management</h1>
          <p className="text-zinc-500 font-medium">Manage, edit and publish your articles.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/posts/new')}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl text-sm font-black hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-5">Article Content</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Published</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {posts.map((post) => (
                  <tr key={post.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden ring-2 ring-zinc-100 dark:ring-zinc-800">
                          {post.featured_image_url ? (
                            <img src={post.featured_image_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-zinc-900 dark:text-white truncate max-w-[240px] group-hover:text-orange-600 transition-colors">{post.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                               <FileText className="w-3 h-3" /> 5 min read
                             </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        post.status === 'published' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                         {post.category_id ? 'Categorized' : 'General'}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-zinc-500">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                          className="p-2.5 hover:bg-white dark:hover:bg-zinc-700 rounded-xl text-zinc-500 hover:text-orange-600 shadow-sm transition-all"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-red-500 transition-all"
                          title="Delete Post"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};