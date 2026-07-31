import React, { useState } from 'react';
import { PromptFilters } from '../types';
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, Sparkles } from 'lucide-react';

interface FilterBarProps {
  filters: PromptFilters;
  onChange: (filters: PromptFilters) => void;
  customKeywords: string;
  onCustomKeywordsChange: (val: string) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  customKeywords,
  onCustomKeywordsChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterConfigs = [
    {
      key: 'difficulty' as keyof PromptFilters,
      label: 'Difficulty',
      options: ['Any', 'Easy', 'Medium', 'Hard', 'Professional'],
    },
    {
      key: 'mood' as keyof PromptFilters,
      label: 'Mood',
      options: ['Any', 'Peaceful', 'Dark', 'Epic', 'Dreamlike', 'Cute', 'Whimsical', 'Lonely', 'Mysterious', 'Emotional'],
    },
    {
      key: 'lighting' as keyof PromptFilters,
      label: 'Lighting',
      options: ['Any', 'Morning', 'Golden Hour', 'Sunset', 'Night', 'Moonlight', 'Storm', 'Fog', 'Snow', 'Rain'],
    },
    {
      key: 'perspective' as keyof PromptFilters,
      label: 'Perspective',
      options: ['Any', 'Front', 'Side', 'Top', "Bird's Eye", "Worm's Eye", 'Three Quarter', 'Camera Lens', 'Wide Angle', 'Close-up'],
    },
    {
      key: 'colorPalette' as keyof PromptFilters,
      label: 'Color Palette',
      options: ['Any', 'Warm', 'Cool', 'Pastel', 'Earth Tones', 'Neon', 'Monochrome', 'Limited Palette'],
    },
    {
      key: 'action' as keyof PromptFilters,
      label: 'Action / Pose',
      options: ['Any', 'Idle', 'Walking', 'Running', 'Flying', 'Reading', 'Cooking', 'Building', 'Fighting', 'Sleeping', 'Exploring'],
    },
    {
      key: 'emotion' as keyof PromptFilters,
      label: 'Emotion',
      options: ['Any', 'Happy', 'Sad', 'Angry', 'Hopeful', 'Curious', 'Calm', 'Fear', 'Wonder'],
    },
    {
      key: 'constraints' as keyof PromptFilters,
      label: 'Artist Constraints',
      options: ['Any', 'Only Ink', 'Only Pencil', 'One Continuous Line', 'Silhouette Only', 'No Eraser', 'Black & White', '10 Minute Sketch', '5 Color Limit', 'Only Shapes', 'One Point Perspective', 'Two Point Perspective'],
    },
  ];

  const handleSelect = (key: keyof PromptFilters, val: string) => {
    onChange({
      ...filters,
      [key]: val === 'Any' ? undefined : val,
    });
  };

  const activeCount = Object.values(filters).filter((v) => v && v !== 'Any').length + (customKeywords.trim() ? 1 : 0);

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      {/* Toggle Header Button */}
      <div className="flex items-center justify-between gap-3 bg-stone-100/90 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700/60 rounded-xl px-4 py-3 transition-colors">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-stone-800 dark:text-stone-200 text-sm font-medium hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex-1 text-left"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span>Refine Art Parameters & Filters</span>
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-mono bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950">
              {activeCount} active
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-200/60 dark:hover:bg-zinc-700/60 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Filter Controls */}
      {isOpen && (
        <div className="mt-2 p-5 bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-lg space-y-4 animate-in fade-in duration-200">
          {/* Custom Keywords Input */}
          <div>
            <label className="block text-xs font-mono uppercase text-stone-500 dark:text-stone-400 mb-1.5">
              Custom Artist Keywords / Extra Context (Optional)
            </label>
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => onCustomKeywordsChange(e.target.value)}
              placeholder="e.g. bioluminescent, overgrown ruins, ghibli aesthetic, tea house..."
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Grid of Dropdown Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {filterConfigs.map((cfg) => {
              const currentVal = filters[cfg.key] || 'Any';
              return (
                <div key={cfg.key}>
                  <label className="block text-xs font-sans font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {cfg.label}
                  </label>
                  <select
                    value={currentVal}
                    onChange={(e) => handleSelect(cfg.key, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
                  >
                    {cfg.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
