import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { DrawingPrompt, CategoryItem } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Grid,
  Bookmark,
  Compass,
  Feather,
} from 'lucide-react';

interface HomeViewProps {
  dailyPrompt: DrawingPrompt | null;
  favorites: DrawingPrompt[];
  history: DrawingPrompt[];
  onSelectCategoryAndGenerate: (categoryName: string) => void;
  onSelectPromptToDraw: (prompt: DrawingPrompt) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  dailyPrompt,
  favorites,
  history,
  onSelectCategoryAndGenerate,
  onSelectPromptToDraw,
  onToggleFavorite,
  onNavigateTab,
}) => {
  // Select top featured categories to showcase on home
  const topCategories = CATEGORIES.slice(0, 8);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-16">
      {/* 1. Header & Hero Intro */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-3"
        >
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] shadow-xs">
            <Logo size={42} animate />
          </div>
        </motion.div>

        <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-[var(--text-main)] tracking-tight leading-[1.15]">
          DrawMuse
        </h1>

        <p className="font-serif text-lg sm:text-2xl text-[var(--text-muted)] italic font-normal max-w-xl mx-auto">
          "Inspiration for every canvas."
        </p>

        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans max-w-md mx-auto pt-1 leading-relaxed">
          Curated concept direction, lighting cues, and creative hooks designed for digital illustrators and traditional sketchbooks.
        </p>
      </div>

      {/* 2. Hero Quick Launch Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="editorial-card p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-surface)] to-[var(--bg-card)] flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 text-center sm:text-left max-w-xl">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent-terracotta)] font-bold">
            ARTIST PROMPT ENGINE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            Instant inspiration for your next drawing.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans">
            Tap any category below to immediately generate a fresh, easy-to-understand drawing idea tailored to your style.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigateTab('generator')}
            className="px-5 py-3 rounded-xl bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent-terracotta)]" />
            <span>Generate Prompt</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigateTab('categories')}
            className="px-4 py-3 rounded-xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-2 hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
          >
            <Grid className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Categories</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 3. Today's Prompt Spotlight Card */}
      {dailyPrompt && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Today's Concept Spotlight
            </h3>
            <span className="text-xs font-mono text-[var(--accent-terracotta)] font-semibold">
              {dailyPrompt.dailyDate || 'FEATURED'}
            </span>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            className="editorial-card p-6 sm:p-10 space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-terracotta)] font-bold">
                {dailyPrompt.category}
              </span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleFavorite(dailyPrompt.id)}
                className={`p-2.5 rounded-full transition-colors cursor-pointer border ${
                  dailyPrompt.isFavorite
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                }`}
              >
                <Heart className={`w-4 h-4 ${dailyPrompt.isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                {dailyPrompt.title}
              </h4>
              <p className="font-serif italic text-base sm:text-xl text-[var(--text-main)] leading-relaxed opacity-90">
                "{dailyPrompt.text}"
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectPromptToDraw(dailyPrompt)}
                className="px-5 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
              >
                <span>Draw This Concept</span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />
              </motion.button>
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* 4. Browse Categories Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Browse Concept Domains
            </h3>
            <p className="text-xs text-[var(--text-muted)] pt-0.5">
              Tap any category to launch its dedicated prompt generator immediately
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('categories')}
            className="text-xs font-semibold text-[var(--accent-terracotta)] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View All ({CATEGORIES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategoryAndGenerate(cat.name)}
              className="editorial-card p-5 cursor-pointer hover:border-[var(--text-main)] transition-all flex flex-col justify-between min-h-[160px] group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  {cat.group}
                </span>
                <h4 className="font-serif text-lg font-bold text-[var(--text-main)] mt-1 mb-2 group-hover:text-[var(--accent-terracotta)] transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[var(--text-main)]">
                <span>Enter Generator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[var(--accent-terracotta)]" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Recent Inspiration & Saved Favorites Preview */}
      {(favorites.length > 0 || history.length > 0) && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Recent Studio Inspiration
            </h3>
            <div className="flex items-center gap-3 text-xs font-medium text-[var(--text-muted)]">
              {favorites.length > 0 && (
                <button
                  onClick={() => onNavigateTab('favorites')}
                  className="hover:text-[var(--text-main)] cursor-pointer flex items-center gap-1"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Favorites ({favorites.length})</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(favorites.length > 0 ? favorites.slice(0, 2) : history.slice(0, 2)).map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPromptToDraw(p)}
                className="editorial-card p-5 cursor-pointer hover:border-[var(--text-main)] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-terracotta)] font-semibold">
                    {p.category}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(p.id);
                    }}
                    className="p-1 rounded-full text-[var(--text-muted)] hover:text-rose-500"
                  >
                    <Heart className={`w-3.5 h-3.5 ${p.isFavorite ? 'fill-current text-rose-500' : ''}`} />
                  </motion.button>
                </div>

                <div className="space-y-1">
                  <h5 className="font-serif text-base font-bold text-[var(--text-main)] line-clamp-1">
                    {p.title}
                  </h5>
                  <p className="font-serif italic text-xs text-[var(--text-muted)] line-clamp-2">
                    "{p.text}"
                  </p>
                </div>

                <div className="text-[11px] font-semibold text-[var(--text-main)] flex items-center gap-1 pt-1">
                  <span>Draw Concept</span>
                  <ArrowRight className="w-3 h-3 text-[var(--accent-terracotta)]" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
