import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WHEEL_DATA } from '../data/wheelData';
import { WheelState } from '../types';
import { Compass, Sparkles, Shuffle } from 'lucide-react';

interface InspirationWheelProps {
  onSpinGenerate: (wheelState: WheelState) => void;
  isLoading: boolean;
}

export const InspirationWheel: React.FC<InspirationWheelProps> = ({
  onSpinGenerate,
  isLoading,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWheel, setCurrentWheel] = useState<WheelState>({
    subject: WHEEL_DATA.subjects[0],
    mood: WHEEL_DATA.moods[0],
    weather: WHEEL_DATA.weather[0],
    lighting: WHEEL_DATA.lighting[0],
    location: WHEEL_DATA.locations[0],
    twist: WHEEL_DATA.twists[0],
  });

  const handleSpin = () => {
    if (isSpinning || isLoading) return;
    setIsSpinning(true);

    let counter = 0;
    const interval = setInterval(() => {
      setCurrentWheel({
        subject: WHEEL_DATA.subjects[Math.floor(Math.random() * WHEEL_DATA.subjects.length)],
        mood: WHEEL_DATA.moods[Math.floor(Math.random() * WHEEL_DATA.moods.length)],
        weather: WHEEL_DATA.weather[Math.floor(Math.random() * WHEEL_DATA.weather.length)],
        lighting: WHEEL_DATA.lighting[Math.floor(Math.random() * WHEEL_DATA.lighting.length)],
        location: WHEEL_DATA.locations[Math.floor(Math.random() * WHEEL_DATA.locations.length)],
        twist: WHEEL_DATA.twists[Math.floor(Math.random() * WHEEL_DATA.twists.length)],
      });
      counter++;

      if (counter > 15) {
        clearInterval(interval);
        const finalState: WheelState = {
          subject: WHEEL_DATA.subjects[Math.floor(Math.random() * WHEEL_DATA.subjects.length)],
          mood: WHEEL_DATA.moods[Math.floor(Math.random() * WHEEL_DATA.moods.length)],
          weather: WHEEL_DATA.weather[Math.floor(Math.random() * WHEEL_DATA.weather.length)],
          lighting: WHEEL_DATA.lighting[Math.floor(Math.random() * WHEEL_DATA.lighting.length)],
          location: WHEEL_DATA.locations[Math.floor(Math.random() * WHEEL_DATA.locations.length)],
          twist: WHEEL_DATA.twists[Math.floor(Math.random() * WHEEL_DATA.twists.length)],
        };
        setCurrentWheel(finalState);
        setIsSpinning(false);
        onSpinGenerate(finalState);
      }
    }, 100);
  };

  const reels = [
    { label: 'Subject', value: currentWheel.subject, color: 'border-purple-500/50', badgeColor: 'bg-purple-500/20 text-purple-300' },
    { label: 'Mood', value: currentWheel.mood, color: 'border-cyan-500/50', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
    { label: 'Weather', value: currentWheel.weather, color: 'border-blue-500/50', badgeColor: 'bg-blue-500/20 text-blue-300' },
    { label: 'Lighting', value: currentWheel.lighting, color: 'border-amber-500/50', badgeColor: 'bg-amber-500/20 text-amber-300' },
    { label: 'Location', value: currentWheel.location, color: 'border-emerald-500/50', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { label: 'Twist', value: currentWheel.twist, color: 'border-pink-500/50', badgeColor: 'bg-pink-500/20 text-pink-300' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Compass className="w-4 h-4 animate-spin-slow text-cyan-400" />
          <span>RANDOM CONCEPT MATRIX</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 font-sans tracking-tight">
          Inspiration Wheel
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-base font-sans">
          Spin the reels to generate spontaneous art variables, then let Gemini orchestrate them into a unified concept prompt.
        </p>
      </div>

      {/* Slots Reels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        {reels.map((reel, idx) => (
          <motion.div
            key={reel.label}
            animate={isSpinning ? { scale: [1, 1.02, 0.98, 1] } : { scale: 1 }}
            transition={{ duration: 0.2, repeat: isSpinning ? Infinity : 0 }}
            className={`glass-card p-6 rounded-2xl border ${reel.color} flex flex-col justify-between min-h-[130px] relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold ${reel.badgeColor}`}>
                Reel 0{idx + 1} • {reel.label}
              </span>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            </div>
            <div className="font-bold text-base sm:text-lg text-white font-sans line-clamp-2">
              {reel.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Spin Button */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSpin}
          disabled={isSpinning || isLoading}
          className="hero-glow-btn px-10 py-5 rounded-2xl text-white font-sans font-bold text-lg sm:text-xl flex items-center gap-3.5 mx-auto disabled:opacity-50 cursor-pointer border border-white/20"
        >
          <Shuffle className={`w-6 h-6 text-cyan-200 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Spinning Reels...' : 'Spin & Craft Prompt'}</span>
          <Sparkles className="w-5 h-5 text-pink-200" />
        </motion.button>
      </div>
    </div>
  );
};

