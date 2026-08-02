import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DrawingPrompt } from '../types';
import { History, Search, Trash2, Copy, Share2, Check, Heart } from 'lucide-react';

interface HistoryViewProps {
  history: DrawingPrompt[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenExport: (prompt: DrawingPrompt) => void;
  onSelectFromHistory: (prompt: DrawingPrompt) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
  onDeleteHistoryItem,
  onToggleFavorite,
  onOpenExport,
  onSelectFromHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(history.map((h) => h.category));
    return ['All', ...Array.from(cats)];
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [history, searchTerm, selectedCategory]);

  const handleCopy = (prompt: DrawingPrompt) => {
    navigator.clipboard.writeText(prompt.text);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="p-4 rounded-full bg-[var(--bg-surface)] text-[var(--accent-terracotta)] border border-[var(--border-subtle)] w-14 h-14 mx-auto flex items-center justify-center">
          <History className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[var(--text-main)]">
          No Prompt History Yet
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto font-sans leading-relaxed">
          Every prompt generated during your drawing sessions will automatically be logged here for easy review.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text-main)]">
            Studio History ({history.length})
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Recent concepts generated during your creative workflow
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-main)]"
            />
          </div>

          <button
            onClick={onClearHistory}
            className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* History Log */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              whileHover={{ y: -2 }}
              className="editorial-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div
                onClick={() => onSelectFromHistory(item)}
                className="cursor-pointer flex-1 space-y-1.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-terracotta)] font-bold">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[var(--text-main)]">
                  {item.title}
                </h4>

                <p className="font-serif italic text-xs text-[var(--text-muted)] line-clamp-2">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleFavorite(item.id)}
                  title={item.isFavorite ? 'Remove favorite' : 'Save favorite'}
                  className="p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-rose-500 border border-[var(--border-subtle)] cursor-pointer"
                >
                  <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current text-rose-500' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopy(item)}
                  title="Copy prompt text"
                  className="p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onOpenExport(item)}
                  title="Export PNG card"
                  className="p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteHistoryItem(item.id)}
                  title="Delete entry"
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
