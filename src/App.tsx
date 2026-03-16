import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { BlogProvider } from './store';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { BlogListing } from './pages/BlogListing';
import { SinglePost } from './pages/SinglePost';
import { Categories } from './pages/Categories';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Search } from './pages/Search';
import { AdminLayout } from './pages/Admin/AdminDashboard';
import { HelmetProvider } from 'react-helmet-async';

// Public Layout Wrapper
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-orange-100 dark:selection:bg-orange-500/30">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <BlogProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <PublicLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<BlogListing />} />
              <Route path="/blog/:slug" element={<SinglePost />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<BlogListing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<Search />} />
              <Route path="/admin/*" element={<AdminLayout />} />
            </Routes>
          </PublicLayout>
        </BrowserRouter>
      </BlogProvider>
    </HelmetProvider>
  );
}