import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DrawingPrompt } from '../types';
import {
  Heart,
  Copy,
  Check,
  Share2,
  RefreshCw,
  Sparkles,
  Sliders,
  Maximize2,
} from 'lucide-react';

interface PromptCardProps {
  prompt: DrawingPrompt | null;
  isLoading: boolean;
  isRemixing: boolean;
  isExpanding: boolean;
  onGenerateAnother: () => void;
  onRemix: () => void;
  onExpand: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenExport: (prompt: DrawingPrompt) => void;
  onOpenFilters?: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isLoading,
  isRemixing,
  isExpanding,
  onGenerateAnother,
  onRemix,
  onExpand,
  onToggleFavorite,
  onOpenExport,
  onOpenFilters,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-24 sm:py-32 px-6 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8 p-4 rounded-full bg-[var(--bg-surface)] text-[var(--accent-terracotta)] border border-[var(--border-subtle)]"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)] mb-3">
          Composing Concept Idea...
        </h3>
        <p className="text-sm text-[var(--text-muted)] max-w-md font-sans">
          Curating atmospheric lighting, subject balance, and storytelling nuance.
        </p>
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={prompt.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 min-h-[65vh] flex flex-col justify-between"
      >
        {/* Category Header & Filter Trigger */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)] mb-8 sm:mb-12">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-terracotta)] font-bold">
              {prompt.category || 'Drawing Prompt'}
            </span>
            {prompt.provider && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{prompt.provider}</span>
              </span>
            )}
            {prompt.remixCount ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                Remix v{prompt.remixCount + 1}
              </span>
            ) : null}
          </div>

          {onOpenFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenFilters}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer border border-[var(--border-subtle)]"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Filters</span>
            </motion.button>
          )}
        </div>

        {/* Hero Editorial Quote Box */}
        <div className="my-auto py-8 sm:py-12 text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-main)] leading-[1.2] mb-6 tracking-tight"
          >
            {prompt.title}
          </motion.h2>

          <motion.blockquote
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-serif italic text-lg sm:text-2xl text-[var(--text-main)] leading-relaxed tracking-wide opacity-90 my-6"
          >
            "{prompt.text}"
          </motion.blockquote>
        </div>

        {/* Minimalist Editorial Action Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 mt-8">
          {/* Main Controls: Generate Again & Remix */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGenerateAnother}
              disabled={isLoading || isRemixing || isExpanding}
              className="px-6 py-3 rounded-2xl bg-[var(--text-main)] text-[var(--bg-main)] font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent-terracotta)]" />
              <span>Generate Again</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRemix}
              disabled={isLoading || isRemixing || isExpanding}
              className="px-4 py-3 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] font-medium text-xs sm:text-sm flex items-center gap-2 hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRemixing ? 'animate-spin' : ''}`} />
              <span>Remix</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExpand}
              disabled={isLoading || isRemixing || isExpanding}
              className="px-4 py-3 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] font-medium text-xs sm:text-sm flex items-center gap-2 hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span className="hidden sm:inline">Expand</span>
            </motion.button>
          </div>

          {/* Social / Saved Utilities */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggleFavorite(prompt.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                prompt.isFavorite
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
              title={prompt.isFavorite ? 'Remove Favorite' : 'Save Favorite'}
            >
              <Heart className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-3 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
              title="Copy text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenExport(prompt)}
              className="px-4 py-3 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-2 hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />
              <span>Share</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
