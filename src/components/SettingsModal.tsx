import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSettings } from '../types';
import { X, Settings, Trash2, Sun, Moon } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearHistory: () => void;
  onClearFavorites: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClearHistory,
  onClearFavorites,
  onClose,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-[var(--accent-terracotta)]" />
              <h3 className="font-serif text-xl font-bold text-[var(--text-main)]">
                Studio Preferences
              </h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="space-y-6">
            {/* Theme Mode */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2 font-semibold">
                Appearance Mode
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'light', name: 'Editorial Light', icon: Sun },
                  { id: 'dark', name: 'Charcoal Dark', icon: Moon },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = settings.theme === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdateSettings({ theme: t.id as any })}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)] shadow-xs font-bold'
                          : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Detail Preference */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2 font-semibold">
                Default Prompt Detail
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'micro', label: 'Micro (20w)', desc: 'Quick spark' },
                  { id: 'standard', label: 'Standard (50w)', desc: 'Balanced detail' },
                  { id: 'detailed', label: 'Detailed (90w)', desc: 'Rich concept' },
                ].map((len) => (
                  <motion.button
                    key={len.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onUpdateSettings({ promptLength: len.id as any })}
                    className={`p-3 rounded-2xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      settings.promptLength === len.id
                        ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)] font-semibold'
                        : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="font-semibold">{len.label}</div>
                    <div className="text-[10px] opacity-70">{len.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* AI Generator & Offline Library Engine Status */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                  Multi-Tier Generator Chain
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold">
                  Active
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                <strong className="text-[var(--text-main)]">Online APIs:</strong> Gemini 3.6 Flash / 2.5 Flash, Pollinations Free AI (Mistral, OpenAI, Qwen, Llama), and Hugging Face Inference API.
              </p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                <strong className="text-[var(--text-main)]">Offline Library:</strong> DrawMuse Smart Offline Engine with 34 specialized category databases &amp; 10,000+ words of rich visual vocabulary.
              </p>
            </div>

            {/* Clear Storage Danger Actions */}
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-rose-500 mb-1 font-semibold">
                Data Management
              </label>
              <div className="flex flex-wrap gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (confirm('Clear all prompt history log?')) onClearHistory();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/20 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History Log</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (confirm('Clear all saved favorites?')) onClearFavorites();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/20 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Saved Favorites</span>
                </motion.button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
            DrawMuse Studio v2.0 • Editorial Concept Art Director
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
