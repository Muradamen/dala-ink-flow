import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw, Wand2, Search, Type, Hash, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface AIWriterProps {
  onGenerateContent: (data: { title: string; excerpt: string; content: string }) => void;
  onSuggestTags: (tags: string[]) => void;
  onSuggestMeta: (meta: string) => void;
  currentContent: string;
  currentTitle: string;
}

export const AIWriter: React.FC<AIWriterProps> = ({ 
  onGenerateContent, 
  onSuggestTags, 
  onSuggestMeta,
  currentContent,
  currentTitle 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'optimize' | 'analyze'>('generate');
  const [keywords, setKeywords] = useState('');
  const [analysis, setAnalysis] = useState<{
    score: number;
    suggestions: string[];
    readability: string;
  } | null>(null);

  const simulateAI = async (ms: number = 2000) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, ms));
    setIsGenerating(false);
  };

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast.error('Please enter keywords or a topic');
      return;
    }
    await simulateAI(2500);
    onGenerateContent({
      title: `The Future of ${keywords} in 2025`,
      excerpt: `An in-depth look at how ${keywords} is reshaping the industry and what to expect in the coming years.`,
      content: `<h2>Introduction to ${keywords}</h2><p>The landscape of ${keywords} has shifted dramatically. What was once a niche interest is now at the forefront of technological innovation.</p><h3>Key Trends</h3><ul><li>Hyper-automation in ${keywords} workflows</li><li>The integration of advanced analytics</li><li>Sustainability-focused development</li></ul><p>As we look towards 2025, the impact of ${keywords} will only continue to grow...</p>`
    });
    toast.success('Content generated successfully!');
  };

  const handleSuggestTags = async () => {
    if (!currentTitle && !currentContent) {
      toast.error('Add some content first to suggest tags');
      return;
    }
    await simulateAI(1500);
    const suggestedTags = ['AI', 'Tech', 'Innovation', 'Future', 'Business'];
    onSuggestTags(suggestedTags);
    toast.success('Tags suggested!');
  };

  const handleSuggestMeta = async () => {
    if (!currentTitle && !currentContent) {
      toast.error('Add some content first to suggest meta description');
      return;
    }
    await simulateAI(1500);
    onSuggestMeta(`Discover how ${currentTitle || 'the latest trends'} are shaping the future of technology and business in this comprehensive guide.`);
    toast.success('Meta description suggested!');
  };

  const handleAnalyze = async () => {
    if (!currentContent || currentContent.length < 100) {
      toast.error('Content is too short for a meaningful analysis');
      return;
    }
    await simulateAI(1800);
    setAnalysis({
      score: 82,
      readability: 'Good',
      suggestions: [
        'Break down long paragraphs for better mobile reading.',
        'Add more subheadings to improve scannability.',
        'Use more active voice in the introduction.',
        'The reading level is appropriate for your audience (Grade 10).'
      ]
    });
    toast.success('Analysis complete!');
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">Meyra AI Assistant</span>
        </div>
        {isGenerating && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 animate-pulse uppercase tracking-widest">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </div>
        )}
      </div>

      <div className="flex border-b border-zinc-100 dark:border-zinc-800">
        {[
          { id: 'generate', icon: Wand2, label: 'Writer' },
          { id: 'optimize', icon: Search, label: 'SEO' },
          { id: 'analyze', icon: Gauge, label: 'Analysis' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all",
              activeTab === tab.id 
                ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/30 dark:bg-orange-600/5" 
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {activeTab === 'generate' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">What are we writing about?</label>
                <div className="relative">
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. AI in Fintech, Web3 Trends..."
                    className="w-full pl-3 pr-10 py-2.5 bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !keywords}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                AI will generate a draft including title, excerpt, and formatted HTML content.
              </p>
            </motion.div>
          )}

          {activeTab === 'optimize' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <button
                onClick={handleSuggestTags}
                disabled={isGenerating}
                className="w-full flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg group-hover:text-orange-600 transition-colors">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold">Suggest Tags</p>
                    <p className="text-[10px] text-zinc-500">Auto-tag based on content</p>
                  </div>
                </div>
                <RefreshCw className={cn("w-3.5 h-3.5 text-zinc-400 group-hover:rotate-180 transition-transform duration-500", isGenerating && "animate-spin")} />
              </button>

              <button
                onClick={handleSuggestMeta}
                disabled={isGenerating}
                className="w-full flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg group-hover:text-orange-600 transition-colors">
                    <Type className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold">Meta Description</p>
                    <p className="text-[10px] text-zinc-500">SEO-friendly summary</p>
                  </div>
                </div>
                <RefreshCw className={cn("w-3.5 h-3.5 text-zinc-400 group-hover:rotate-180 transition-transform duration-500", isGenerating && "animate-spin")} />
              </button>
            </motion.div>
          )}

          {activeTab === 'analyze' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {!analysis ? (
                <div className="text-center py-4">
                  <div className="mx-auto w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                    <Gauge className="w-6 h-6 text-zinc-400" />
                  </div>
                  <p className="text-sm font-bold">Content Health Check</p>
                  <p className="text-[11px] text-zinc-500 mt-1 mb-4">Analyze readability and get improvement tips.</p>
                  <button
                    onClick={handleAnalyze}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    Start Analysis
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-orange-600">{analysis.score}</span>
                        <span className="text-xs font-bold text-zinc-400">/100</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Readability</p>
                      <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{analysis.readability}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Suggestions</p>
                    {analysis.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-2 items-start text-xs text-zinc-600 dark:text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                        <p>{s}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setAnalysis(null)}
                    className="w-full py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 hover:text-orange-600 transition-colors"
                  >
                    Reset Analysis
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800">
         <div className="flex items-center gap-2">
           <AlertCircle className="w-3 h-3 text-zinc-400" />
           <p className="text-[10px] text-zinc-500 font-medium">AI generated content may need human review.</p>
         </div>
      </div>
    </div>
  );
};