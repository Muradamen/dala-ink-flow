import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Comment } from '../../types';
import { toast } from 'sonner';
import { Check, X, Trash, MessageSquare, ExternalLink, Loader2, User, Filter, MoreHorizontal, Inbox, CircleCheck, CircleX } from 'lucide-react';
import { formatDate, cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface CommentWithPost extends Comment {
  posts: { 
    title: string;
    slug: string; 
  } | null;
}

export const CommentModeration = () => {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, posts(title, slug)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } else {
      setComments((data as unknown) as CommentWithPost[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    const { error } = await supabase
      .from('comments')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Comment ${status}`);
      setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment forever?')) return;
    
    setActionLoading(id);
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete comment');
    } else {
      toast.success('Comment deleted');
      setComments(prev => prev.filter(c => c.id !== id));
    }
    setActionLoading(null);
  };

  const filteredComments = comments.filter(c => filter === 'all' ? true : c.status === filter);

  const stats = {
    pending: comments.filter(c => c.status === 'pending').length,
    approved: comments.filter(c => c.status === 'approved').length,
    rejected: comments.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Engagement Hub</h1>
          <p className="text-zinc-500 font-medium">Manage user interactions and moderate discussions.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
              <button 
                onClick={() => setFilter('pending')}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                  filter === 'pending' ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                <Inbox className="w-3 h-3" /> Pending {stats.pending > 0 && <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded-full text-[8px]">{stats.pending}</span>}
              </button>
              <button 
                onClick={() => setFilter('approved')}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                  filter === 'approved' ? "bg-white dark:bg-zinc-800 text-green-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                <CircleCheck className="w-3 h-3" /> Approved
              </button>
              <button 
                onClick={() => setFilter('rejected')}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                  filter === 'rejected' ? "bg-white dark:bg-zinc-800 text-red-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                <CircleX className="w-3 h-3" /> Rejected
              </button>
              <button 
                onClick={() => setFilter('all')}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                  filter === 'all' ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                All
              </button>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            <p className="text-zinc-500 text-sm font-bold animate-pulse uppercase tracking-widest">Syncing Discussions...</p>
          </div>
        ) : filteredComments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-5">User Info</th>
                  <th className="px-6 py-5">Discussion Snippet</th>
                  <th className="px-6 py-5">Linked Article</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredComments.map((comment) => (
                  <tr key={comment.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-zinc-900 dark:text-white truncate">{comment.user_name || 'Anonymous'}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight truncate">{comment.user_email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1 max-w-md">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 italic">
                          "{comment.content}"
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5">
                          <MoreHorizontal className="w-3 h-3" /> {formatDate(comment.created_at)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {comment.posts ? (
                        <Link 
                          to={`/blog/${comment.posts.slug}`} 
                          className="group/link inline-flex items-center gap-1.5 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all hover:bg-orange-50 dark:hover:bg-orange-950/20"
                          target="_blank"
                        >
                          <span className="text-xs font-bold text-zinc-500 group-hover/link:text-orange-600 truncate max-w-[150px]">{comment.posts.title}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-400 group-hover/link:text-orange-600" />
                        </Link>
                      ) : (
                        <span className="text-xs font-bold text-zinc-400 line-through">Article Deleted</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        comment.status === 'approved' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        comment.status === 'rejected' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {comment.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {comment.status !== 'approved' && (
                          <button 
                            onClick={() => handleStatusUpdate(comment.id, 'approved')}
                            disabled={actionLoading === comment.id}
                            className="p-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl hover:bg-green-100 dark:hover:bg-green-800 transition-all hover:scale-105 active:scale-95"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {comment.status !== 'rejected' && (
                          <button 
                            onClick={() => handleStatusUpdate(comment.id, 'rejected')}
                            disabled={actionLoading === comment.id}
                            className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-800 transition-all hover:scale-105 active:scale-95"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(comment.id)}
                          disabled={actionLoading === comment.id}
                          className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 dark:hover:bg-red-800 transition-all hover:scale-105 active:scale-95"
                          title="Delete Forever"
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
        ) : (
          <div className="text-center py-32 px-6">
             <div className="inline-flex p-6 bg-zinc-50 dark:bg-zinc-800 rounded-full mb-6 border border-zinc-100 dark:border-zinc-700">
                <Inbox className="w-10 h-10 text-zinc-300" />
             </div>
             <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Inbox Cleared!</h2>
             <p className="text-zinc-500 mt-2 max-w-sm mx-auto font-medium">
               {filter === 'pending' 
                 ? "There are no comments awaiting moderation at this time. Great job staying on top of things!"
                 : "No comments found in this category. Your community is quiet... for now."}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};