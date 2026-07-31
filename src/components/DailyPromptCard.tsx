import React, { useState } from 'react';
import { DrawingPrompt } from '../types';
import { Calendar, Sparkles, Copy, Check, Bookmark, Share2 } from 'lucide-react';

interface DailyPromptCardProps {
  dailyPrompt: DrawingPrompt | null;
  isLoading: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenExport: (prompt: DrawingPrompt) => void;
}

export const DailyPromptCard: React.FC<DailyPromptCardProps> = ({
  dailyPrompt,
  isLoading,
  onToggleFavorite,
  onOpenExport,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!dailyPrompt) return;
    navigator.clipboard.writeText(dailyPrompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-10 rounded-3xl glass-card animate-pulse text-center">
        <div className="h-6 w-36 bg-white/10 rounded mx-auto mb-4" />
        <div className="h-8 w-64 bg-white/10 rounded mx-auto mb-4" />
        <div className="h-16 w-full bg-white/10 rounded mb-4" />
      </div>
    );
  }

  if (!dailyPrompt) return null;

  const dateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="relative overflow-hidden rounded-3xl glass-card glow-border p-8 sm:p-12 shadow-2xl">
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            <Calendar className="w-4 h-4 text-cyan-300" />
            <span>FEATURED DAILY SPOTLIGHT</span>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            {dateFormatted}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 font-sans tracking-tight">
          {dailyPrompt.title}
        </h3>

        {/* Daily Prompt Text */}
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-lg sm:text-xl text-zinc-100 leading-relaxed font-sans italic font-normal">
            "{dailyPrompt.text}"
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Curated daily for global studio practice
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(dailyPrompt.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border cursor-pointer ${
                dailyPrompt.isFavorite
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${dailyPrompt.isFavorite ? 'fill-current text-pink-400' : 'text-zinc-400'}`} />
              <span>{dailyPrompt.isFavorite ? 'Saved' : 'Favorite'}</span>
            </button>

            <button
              onClick={() => onOpenExport(dailyPrompt)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-300" />
              <span>Export PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

