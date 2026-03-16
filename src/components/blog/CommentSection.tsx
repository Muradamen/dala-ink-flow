import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Comment } from '../../types';
import { toast } from 'sonner';
import { MessageSquare, Send, User } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      toast.error('Could not load comments');
    } else {
      setComments(data as Comment[]);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_name: formData.name,
        user_email: formData.email,
        content: formData.content,
        status: 'pending'
      });

    if (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment');
    } else {
      toast.success('Comment submitted and awaiting moderation!');
      setFormData({ name: '', email: '', content: '' });
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 dark:bg-orange-950/30 text-orange-600 rounded-lg">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
          {comments.length} Approved Comments
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Leave a thought</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Your Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 text-sm font-medium"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 text-sm font-medium"
              placeholder="e.g. john@example.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Comment</label>
          <textarea
            rows={4}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 text-sm font-medium"
            placeholder="Share your perspective..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-black hover:bg-zinc-800 dark:hover:bg-zinc-300 transition-all disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Post Comment'}
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
                  <User className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h4 className="font-bold text-zinc-900 dark:text-white">{comment.user_name}</h4>
                  <span className="text-xs text-zinc-400">{formatDate(comment.created_at)}</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
             <p className="text-zinc-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};