import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { addSubscriber } from '../lib/supabase';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface NewsletterSignupFormProps {
  variant?: 'boxed' | 'inline' | 'simple';
  className?: string;
}

export function NewsletterSignupForm({ variant = 'boxed', className }: NewsletterSignupFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await addSubscriber(email);
      setSuccess(true);
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'simple') {
    return (
      <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", className)}>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full pl-11 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm font-bold"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe Now'}
        </button>
      </form>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden",
        variant === 'boxed' 
          ? "p-8 md:p-16 rounded-[3rem] bg-zinc-900 text-white" 
          : "p-8 md:p-12 rounded-[2.5rem] bg-orange-600 text-white",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f2cc6f-5f7c-49f8-bb43-379eb530d0ac/newsletter-banner-02250cfb-1773632811540.webp"
          alt="Newsletter Pattern"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6">
             <Mail className="w-4 h-4 text-orange-400" />
             <span className="text-[10px] font-black uppercase tracking-widest">Stay Updated</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4 tracking-tighter text-white">
            THE INSIGHT <br />
            <span className="text-orange-500">NEWSLETTER.</span>
          </h2>
          <p className="text-zinc-300 dark:text-zinc-200 text-lg md:text-xl font-medium max-w-md">
            Get the latest tech reports and market analysis delivered straight to your inbox every Sunday.
          </p>
        </div>

        <div className="w-full md:w-96 text-left">
          {success ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20 text-center"
            >
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-white">You're in!</h3>
              <p className="text-zinc-300 font-medium">Welcome to the inner circle. Keep an eye on your inbox.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 text-sm font-black uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors underline decoration-2 underline-offset-8"
              >
                Subscribe another email
              </button>
            </motion.div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                   <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    required
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-white text-zinc-900 hover:bg-orange-600 hover:text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Join the list <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              <p className="mt-6 text-[10px] text-zinc-400 font-bold text-center uppercase tracking-widest">
                No spam. Only deep insights. Unsubscribe anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}