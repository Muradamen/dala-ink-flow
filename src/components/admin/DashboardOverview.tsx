import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Zap,
  Clock,
  ExternalLink,
  ShieldCheck,
  Database
} from 'lucide-react';
import { useBlog } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/utils';

export function DashboardOverview() {
  const { posts, loading, seedSampleContent } = useBlog();
  const navigate = useNavigate();

  const stats = [
    { 
      label: 'Total Articles', 
      value: posts.length, 
      icon: FileText, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      trend: '+12%',
      isPositive: true
    },
    { 
      label: 'Total Views', 
      value: posts.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString(), 
      icon: Eye, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      trend: '+8%',
      isPositive: true
    },
    { 
      label: 'Comments', 
      value: '24', 
      icon: MessageSquare, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      trend: '-2%',
      isPositive: false
    },
    { 
      label: 'Active Users', 
      value: '1.2k', 
      icon: Users, 
      color: 'text-green-600', 
      bg: 'bg-green-50 dark:bg-green-950/20',
      trend: '+24%',
      isPositive: true
    },
  ];

  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Welcome back, <span className="text-orange-600">Meyra!</span>
          </h1>
          <p className="text-zinc-500 font-medium mt-1">Here's what's happening with your blog today.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button 
             onClick={seedSampleContent}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
           >
             <Database className="w-4 h-4" />
             Seed Sample Data
           </button>
           <Link 
            to="/admin/posts/new"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
           >
             <Plus className="w-4 h-4" />
             New Article
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.isPositive ? 'text-green-600' : 'text-red-600'} bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-lg`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
               <Zap className="w-5 h-5 text-orange-600" />
               Recent Publications
            </h2>
            <Link to="/admin/posts" className="text-xs font-bold text-orange-600 hover:underline">View All</Link>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center">
                 <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Loading content...</p>
              </div>
            ) : recentPosts.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer" onClick={() => navigate(`/admin/posts/edit/${post.id}`)}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                            <img src={post.featured_image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80'} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div>
                            <h4 className="font-black text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">{post.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                               <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(post.created_at)}</span>
                               <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views || 0} views</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:text-orange-600 transition-colors">\
                            <ArrowUpRight className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-zinc-200" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">No articles yet</h3>
                <p className="text-zinc-500 text-sm mt-1 mb-8 max-w-xs mx-auto">Start sharing your insights with the world today.</p>
                <Link to="/admin/posts/new" className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold hover:bg-orange-600 hover:text-white transition-all">
                   Create First Post
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-orange-600/20">
            <div className="relative z-10">
               <ShieldCheck className="w-10 h-10 text-white/50 mb-4" />
               <h3 className="text-2xl font-black leading-tight mb-2">Pro Tips for Better SEO</h3>
               <p className="text-orange-100 text-sm font-medium mb-6">Articles with at least 800 words and 3 images rank 40% higher in search results.</p>
               <button className="w-full py-3 bg-white text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                  Learn More <ExternalLink className="w-4 h-4" />
               </button>
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                System Health
             </h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-zinc-400">Storage Used</span>
                      <span className="text-zinc-900 dark:text-white">12%</span>
                   </div>
                   <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600 rounded-full" style={{ width: '12%' }} />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-zinc-400">AI Token Usage</span>
                      <span className="text-zinc-900 dark:text-white">64%</span>
                   </div>
                   <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '64%' }} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}