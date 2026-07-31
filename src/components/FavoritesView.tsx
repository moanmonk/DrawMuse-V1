import React, { useState, useMemo } from 'react';
import { DrawingPrompt } from '../types';
import { Heart, Search, Trash2, Copy, Share2, RefreshCw, Check, ArrowRight } from 'lucide-react';

interface FavoritesViewProps {
  favorites: DrawingPrompt[];
  onToggleFavorite: (id: string) => void;
  onOpenExport: (prompt: DrawingPrompt) => void;
  onRemixPrompt: (prompt: DrawingPrompt) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onToggleFavorite,
  onOpenExport,
  onRemixPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(favorites.map((f) => f.category));
    return ['All', ...Array.from(cats)];
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      const matchesSearch =
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [favorites, searchTerm, selectedCategory]);

  const handleCopy = (prompt: DrawingPrompt) => {
    navigator.clipboard.writeText(prompt.text);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="p-4 rounded-full bg-[var(--bg-surface)] text-[var(--accent-terracotta)] border border-[var(--border-subtle)] w-14 h-14 mx-auto flex items-center justify-center">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[var(--text-main)]">
          Your Studio Vault is Empty
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto font-sans leading-relaxed">
          When you find a prompt that triggers your creative drive, click the ♡ favorite button to save it here for future sketch sessions.
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
            Saved Concepts ({favorites.length})
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Your personal collection of saved prompts and artistic inspiration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-main)]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--text-main)]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFavorites.map((item) => (
          <div
            key={item.id}
            className="editorial-card p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-terracotta)] font-bold">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-[var(--text-main)] mb-2">
                {item.title}
              </h4>

              <p className="font-serif italic text-sm text-[var(--text-main)] leading-relaxed opacity-90">
                "{item.text}"
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
              <button
                onClick={() => onRemixPrompt(item)}
                className="text-xs font-semibold text-[var(--text-main)] hover:text-[var(--accent-terracotta)] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Draw / Remix</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item)}
                  title="Copy prompt text"
                  className="p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onOpenExport(item)}
                  title="Export PNG card"
                  className="p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />
                </button>

                <button
                  onClick={() => onToggleFavorite(item.id)}
                  title="Remove from favorites"
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
