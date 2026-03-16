import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderTree, Users, MessageSquare, Image, Settings, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminSidebar = () => {
  const links = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Posts', path: '/admin/posts', icon: FileText },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Comments', path: '/admin/comments', icon: MessageSquare },
    { name: 'Newsletter', path: '/admin/newsletter', icon: Mail },
    { name: 'Media', path: '/admin/media', icon: Image },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link to="/" className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-1 group">
          <span className="bg-orange-600 text-white px-2 py-0.5 rounded-lg group-hover:bg-zinc-900 transition-colors">M</span>EYRA<span className="text-orange-600">.</span>BLOG
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/admin'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-zinc-100 dark:bg-zinc-900 text-orange-600 dark:text-orange-500 shadow-sm" 
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              )
            }
          >
            <link.icon className="w-4 h-4" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
           <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f2cc6f-5f7c-49f8-bb43-379eb530d0ac/author-profile-image-5db0928e-1773625569881.webp" className="w-10 h-10 rounded-xl object-cover ring-2 ring-orange-100 dark:ring-orange-900/20" alt="Admin" />
           <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-zinc-900 dark:text-white truncate">Amanuel T.</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Chief Editor</p>
           </div>
        </div>
      </div>
    </div>
  );
};