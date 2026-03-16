import React from 'react';
import { motion } from 'framer-motion';

export function About() {
  return (
    <div className="pb-24">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-zinc-950">
         <img 
           src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e7f2cc6f-5f7c-49f8-bb43-379eb530d0ac/tech-and-business-insight-background-670e20eb-1773626654921.webp" 
           className="absolute inset-0 w-full h-full object-cover opacity-50"
           alt="About Meyra Blog"
         />
         <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-black text-white">About Meyra Blog</h1>
            <p className="mt-4 text-xl text-zinc-300 max-w-2xl mx-auto">Documenting the digital evolution of Ethiopia through independent journalism.</p>
         </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 mt-24">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Our Mission</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Meyra Blog is an independent digital publishing platform dedicated to exploring the intersection of technology, AI, and business within the Ethiopian context. We believe that high-quality, insightful reporting is essential for a thriving digital ecosystem.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-20">
            <div>
               <h3 className="text-2xl font-bold">Deep Insights</h3>
               <p className="text-zinc-600 dark:text-zinc-400">
                 We go beyond the headlines to provide context and analysis on tech trends, from AI adoption to fintech regulations.
               </p>
            </div>
            <div>
               <h3 className="text-2xl font-bold">Ecosystem Growth</h3>
               <p className="text-zinc-600 dark:text-zinc-400">
                 By covering startup announcements and success stories, we aim to inspire the next generation of Ethiopian tech entrepreneurs.
               </p>
            </div>
          </div>

          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Independent Voice</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Founded in Addis Ababa, Meyra Blog operates with editorial independence. Our goal is to serve as a reliable source of information for tech professionals, investors, and policymakers who are building the future of our nation.
          </p>
        </div>
      </div>
    </div>
  );
}