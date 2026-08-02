import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { X, Feather, BookOpen } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
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
          className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-10 shadow-2xl"
        >
          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Logo animate size={36} />
            </div>
            <h2 className="font-serif text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
              DrawMuse
            </h2>
            <p className="font-serif italic text-base text-[var(--accent-terracotta)] mt-1">
              "Inspiration for every canvas."
            </p>
          </div>

          {/* Philosophy Content */}
          <div className="space-y-4 text-[var(--text-main)] text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <h4 className="font-serif text-base font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent-terracotta)]" />
                Designed Exclusively for Artists
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                DrawMuse is <strong>NOT</strong> an AI image generator. It is a digital art direction magazine and concept prompt engine designed to solve one question: <em>"What should I draw today?"</em>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Whether you draw in <strong>Procreate, Photoshop, Clip Studio, Blender, Krita</strong>, or an analog physical sketchbook, DrawMuse offers evocative prompt quotes, lighting parameters, and creative twists to ignite your visual imagination.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Designed by MahibHasan</span>
            <span className="flex items-center gap-1.5 text-[var(--accent-terracotta)] font-semibold">
              <Feather className="w-3.5 h-3.5" /> DrawMuse Studio
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
