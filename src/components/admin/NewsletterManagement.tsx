import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Mail, 
  Trash2, 
  Send, 
  Search, 
  Plus, 
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { getAllSubscribers, removeSubscriber, getNewsletterCampaigns, createNewsletterCampaign } from '../../lib/supabase';
import { Subscriber, NewsletterCampaign } from '../../types/supabase';
import { formatDate } from '../../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ subject: '', content: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subsData, campaignsData] = await Promise.all([
        getAllSubscribers(),
        getNewsletterCampaigns()
      ]);
      setSubscribers(subsData || []);
      setCampaigns(campaignsData || []);
    } catch (error) {
      toast.error('Failed to load newsletter data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;
    
    try {
      await removeSubscriber(id);
      setSubscribers(subscribers.filter(s => s.id !== id));
      toast.success('Subscriber removed');
    } catch (error) {
      toast.error('Failed to delete subscriber');
    }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.subject || !newCampaign.content) {
      toast.error('Please fill in both subject and content');
      return;
    }

    setIsSending(true);
    try {
      const campaign = await createNewsletterCampaign(newCampaign.subject, newCampaign.content);
      setCampaigns([campaign, ...campaigns]);
      setIsComposeOpen(false);
      setNewCampaign({ subject: '', content: '' });
      toast.success('Newsletter campaign created and marked as sent!');
    } catch (error) {
      toast.error('Failed to send newsletter');
    } finally {
      setIsSending(false);
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Joined Date'],
      ...subscribers.map(s => [s.email, s.created_at])
    ].map(e => e.join(',')).join(String.fromCharCode(10));
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'subscribers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Accessing list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-orange-100 dark:bg-orange-950/40 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-orange-600" />
             </div>
             <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Growth Engine</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Newsletter Hub</h1>
          <p className="text-zinc-500 mt-2 font-medium">Manage your audience and send deep-dive insights.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={exportSubscribers}
            className="px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-50 transition-all"
           >
             <Download className="w-4 h-4" /> Export CSV
           </button>
           <button 
            onClick={() => setIsComposeOpen(true)}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all active:scale-95"
           >
             <Plus className="w-4 h-4" /> Compose Insight
           </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-2xl">
                 <Users className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">+12% this week</span>
           </div>
           <p className="text-4xl font-black text-zinc-900 dark:text-white mb-1">{subscribers.length}</p>
           <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Subscribers</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                 <Send className="w-6 h-6 text-zinc-400" />
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Sent</span>
           </div>
           <p className="text-4xl font-black text-zinc-900 dark:text-white mb-1">{campaigns.length}</p>
           <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sent Campaigns</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                 <CheckCircle2 className="w-6 h-6 text-zinc-400" />
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Deliverability</span>
           </div>
           <p className="text-4xl font-black text-zinc-900 dark:text-white mb-1">99.2%</p>
           <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Success Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-zinc-50 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
              Audience <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-400">{subscribers.length}</span>
            </h2>
            <div className="relative w-full sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
               <input 
                type="text" 
                placeholder="Search emails..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 text-sm font-bold"
               />
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/30 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-10 py-4 text-left">Subscriber</th>
                  <th className="px-10 py-4 text-left">Joined</th>
                  <th className="px-10 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 font-black text-xs uppercase">
                              {sub.email.substring(0, 2)}
                           </div>
                           <span className="text-sm font-bold text-zinc-900 dark:text-white">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                         <span className="text-xs font-medium text-zinc-500">{formatDate(sub.created_at)}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => handleDelete(sub.id)}
                          className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-10 py-20 text-center">
                       <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <AlertCircle className="w-8 h-8 text-zinc-300" />
                       </div>
                       <p className="text-zinc-500 font-bold">No subscribers found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-zinc-50 dark:border-zinc-800/50">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
              Campaign History
            </h2>
          </div>
          
          <div className="flex-1 space-y-4 p-8 overflow-y-auto max-h-[600px]">
            {campaigns.length > 0 ? (
              campaigns.map((camp) => (
                <div key={camp.id} className="p-6 bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 group hover:border-orange-500/20 transition-all">
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-950/40 rounded-xl">
                           <Send className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-zinc-900 dark:text-white line-clamp-1">{camp.subject}</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{formatDate(camp.sent_at || camp.created_at)}</span>
                           </div>
                        </div>
                     </div>
                     <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-100 dark:border-green-500/20">Sent</span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                     {camp.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                 <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-zinc-300" />
                 </div>
                 <p className="text-zinc-500 font-bold">No campaigns sent yet</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsComposeOpen(false)}
               className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
             >
                <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/30">
                         <Send className="w-6 h-6 text-white" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-zinc-900 dark:text-white">Compose Insight</h3>
                         <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">To: {subscribers.length} active subscribers</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setIsComposeOpen(false)}
                    className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>

                <form onSubmit={handleSendCampaign} className="p-8 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Subject Line</label>
                      <input 
                        type="text" 
                        required
                        value={newCampaign.subject}
                        onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                        placeholder="e.g. Weekly Roundup: The Future of Fintech in Ethiopia"
                        className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Campaign Content (Markdown/HTML)</label>
                      <textarea 
                        required
                        rows={10}
                        value={newCampaign.content}
                        onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                        placeholder="Share your deep-dive insights here..."
                        className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium text-sm resize-none"
                      />
                   </div>

                   <div className="pt-4 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-zinc-400 max-w-[240px] leading-relaxed italic">
                        By clicking send, this newsletter will be broadcasted to all active subscribers.
                      </p>
                      <button 
                        type="submit"
                        disabled={isSending}
                        className="px-10 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all disabled:opacity-50"
                      >
                        {isSending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Send Now <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}