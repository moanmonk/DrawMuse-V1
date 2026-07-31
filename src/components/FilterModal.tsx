import React from 'react';
import { PromptFilters } from '../types';
import { X, Sliders, RotateCcw, Check } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PromptFilters;
  onChange: (filters: PromptFilters) => void;
  onReset: () => void;
  onApplyAndGenerate: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  onApplyAndGenerate,
}) => {
  if (!isOpen) return null;

  const handleOptionSelect = (key: keyof PromptFilters, val: any) => {
    const currentVal = filters[key];
    const newVal = currentVal === val ? 'Any' : val;
    onChange({
      ...filters,
      [key]: newVal,
    });
  };

  const filterSections = [
    {
      id: 'difficulty',
      label: 'Difficulty / Detail',
      key: 'difficulty' as keyof PromptFilters,
      options: ['Easy', 'Medium', 'Hard', 'Professional'],
    },
    {
      id: 'mood',
      label: 'Atmospheric Mood',
      key: 'mood' as keyof PromptFilters,
      options: ['Peaceful', 'Dark', 'Epic', 'Dreamlike', 'Whimsical', 'Lonely', 'Mysterious', 'Emotional', 'Melancholic'],
    },
    {
      id: 'lighting',
      label: 'Lighting Cues',
      key: 'lighting' as keyof PromptFilters,
      options: ['Morning', 'Golden Hour', 'Sunset', 'Night', 'Moonlight', 'Storm', 'Fog', 'Chiaroscuro', 'Ambient'],
    },
    {
      id: 'weather',
      label: 'Weather & Climate',
      key: 'weather' as keyof PromptFilters,
      options: ['Clear', 'Rainy', 'Foggy', 'Snowy', 'Stormy', 'Overcast', 'Windy'],
    },
    {
      id: 'colorPalette',
      label: 'Color Palette',
      key: 'colorPalette' as keyof PromptFilters,
      options: ['Warm', 'Cool', 'Pastel', 'Earth Tones', 'Monochrome', 'Limited Palette', 'Terracotta & Sage'],
    },
    {
      id: 'perspective',
      label: 'Camera Perspective',
      key: 'perspective' as keyof PromptFilters,
      options: ['Front', 'Side', 'Top', "Bird's Eye", "Worm's Eye", 'Three Quarter', 'Wide Angle', 'Close-up'],
    },
    {
      id: 'artStyle',
      label: 'Artistic Medium / Style',
      key: 'artStyle' as keyof PromptFilters,
      options: ['Oil Painting', 'Fine Ink', 'Watercolor', 'Concept Art', 'Pencil Sketch', 'Charcoal', 'Digital Gouache'],
    },
    {
      id: 'characterCount',
      label: 'Character Count',
      key: 'characterCount' as keyof PromptFilters,
      options: ['Single', 'Duo', 'Group', 'Crowd', 'None'],
    },
    {
      id: 'complexity',
      label: 'Visual Complexity',
      key: 'complexity' as keyof PromptFilters,
      options: ['Minimal', 'Balanced', 'Intricate'],
    },
    {
      id: 'promptLength',
      label: 'Prompt Length',
      key: 'promptLength' as keyof PromptFilters,
      options: ['micro', 'standard', 'detailed'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[var(--accent-terracotta)]" />
            <h3 className="font-serif text-xl font-bold text-[var(--text-main)]">
              Refine Inspiration Filters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Scroll Container */}
        <div className="overflow-y-auto space-y-6 pr-1 my-2 grow">
          {filterSections.map((sec) => (
            <div key={sec.id}>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2.5 font-semibold">
                {sec.label}
              </label>
              <div className="flex flex-wrap gap-2">
                {sec.options.map((opt) => {
                  const isSelected = filters[sec.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect(sec.key, opt)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer border ${
                        isSelected
                          ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)] font-semibold shadow-xs'
                          : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Storytelling Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div>
              <div className="text-xs font-semibold text-[var(--text-main)]">
                Emphasize Narrative Twist
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Weave an unexpected storytelling hook or emotional subtext into the prompt
              </div>
            </div>
            <input
              type="checkbox"
              checked={filters.storytelling || false}
              onChange={(e) => onChange({ ...filters, storytelling: e.target.checked })}
              className="w-4 h-4 accent-[var(--accent-terracotta)] cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between shrink-0 gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            onClick={() => {
              onApplyAndGenerate();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-semibold flex items-center gap-2 hover:opacity-95 transition-all shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4 text-[var(--accent-terracotta)]" />
            <span>Apply & Generate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
