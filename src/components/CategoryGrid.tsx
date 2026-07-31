import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../data/categories';
import { Search, ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('All');

  const groups = [
    'All',
    'Character & Creatures',
    'Environments & World',
    'Objects & Props',
    'Themes & Narrative',
    'Artistic Styles',
    'Technical & Practice',
  ];

  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      const matchesGroup = activeGroup === 'All' || cat.group === activeGroup;
      const matchesSearch =
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [activeGroup, searchTerm]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight">
          Concept Domains
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans">
          Select any category below to immediately enter its dedicated generator with tailored creative direction.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-main)]"
          />
        </div>

        {/* Group Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeGroup === group
                  ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-semibold shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const isSelected = selectedCategory === cat.name;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              onClick={() => onSelectCategory(cat.name)}
              className={`editorial-card p-6 cursor-pointer flex flex-col justify-between min-h-[220px] relative group transition-all ${
                isSelected
                  ? 'border-[var(--text-main)] shadow-md ring-1 ring-[var(--text-main)]'
                  : 'border-[var(--border-subtle)] hover:border-[var(--text-main)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-terracotta)] font-bold">
                    {cat.group}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    № {cat.id.slice(0, 4)}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-main)] mb-2 group-hover:text-[var(--accent-terracotta)] transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--text-main)]">
                <span>Enter Generator</span>
                <ArrowRight className="w-4 h-4 text-[var(--accent-terracotta)] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
