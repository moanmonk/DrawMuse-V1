import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Sparkles, Compass, Grid, Calendar, Trophy, ArrowRight, Zap } from 'lucide-react';

interface HeroSectionProps {
  onGenerate: () => void;
  onNavigate: (tab: string) => void;
  selectedCategory: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGenerate,
  onNavigate,
  selectedCategory,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 sm:py-20 px-4 text-center">
      {/* Floating Studio Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
      >
        <Logo size={22} animate />
        <span className="font-semibold tracking-wider uppercase text-cyan-300">
          GEMINI 3.6 CONCEPT STUDIO ENGINE
        </span>
      </motion.div>

      {/* Main Studio Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 font-sans">
        What should we draw{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-500">
          today?
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-zinc-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-sans font-normal">
        Unleash high-concept art direction, lighting cues, and creative hooks built specifically for digital artists and traditional sketchers.
      </p>

      {/* Primary Visual Centerpiece Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerate}
          className="hero-glow-btn w-full sm:w-auto px-10 py-5 rounded-2xl text-white font-sans font-bold text-lg sm:text-xl flex items-center justify-center gap-3.5 group cursor-pointer border border-white/20"
        >
          <Sparkles className="w-7 h-7 text-cyan-200 group-hover:rotate-12 transition-transform filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <span className="tracking-wide">Generate Prompt</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform text-pink-200" />
        </motion.button>

        <button
          onClick={() => onNavigate('categories')}
          className="w-full sm:w-auto px-7 py-5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-sans font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2.5 hover:border-purple-500/40"
        >
          <Grid className="w-5 h-5 text-purple-400" />
          <span>Browse 40+ Categories</span>
        </button>
      </div>

      {/* Quick Access Feature Cards with Gradient Borders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        {[
          { id: 'daily', title: 'Daily Prompt', desc: 'Curated featured prompt', icon: Calendar, color: 'from-amber-500 to-rose-500', iconColor: 'text-amber-400' },
          { id: 'wheel', title: 'Inspiration Wheel', desc: 'Random slot reels', icon: Compass, color: 'from-purple-500 to-indigo-500', iconColor: 'text-purple-400' },
          { id: 'challenges', title: 'Art Challenges', desc: '30, 100, 365 days', icon: Trophy, color: 'from-emerald-500 to-teal-500', iconColor: 'text-emerald-400' },
          { id: 'categories', title: '40+ Categories', desc: 'Cyberpunk, Fantasy...', icon: Grid, color: 'from-cyan-500 to-blue-500', iconColor: 'text-cyan-400' },
        ].map((feat) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.id}
              whileHover={{ y: -4 }}
              onClick={() => onNavigate(feat.id)}
              className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div>
                <div className="p-2.5 rounded-xl bg-white/5 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${feat.iconColor}`} />
                </div>
                <div className="font-bold text-sm text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </div>
                <div className="text-xs text-zinc-400">
                  {feat.desc}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

