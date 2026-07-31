import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Challenge } from '../types';
import { Trophy, CheckCircle2, Calendar, Flame, Award, Sparkles } from 'lucide-react';

interface ChallengesSectionProps {
  challenges: Challenge[];
  onCompleteDay: (challengeId: '30-day' | '100-day' | '365-day') => void;
  onGenerateChallengePrompt: () => void;
}

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  challenges,
  onCompleteDay,
  onGenerateChallengePrompt,
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<'30-day' | '100-day' | '365-day'>('30-day');

  const currentChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = currentChallenge.completedDates.includes(todayStr);

  const handleComplete = (id: '30-day' | '100-day' | '365-day') => {
    onCompleteDay(id);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#3b82f6', '#ec4899', '#22d3ee'],
    });
  };

  const percent = Math.min(100, Math.round((currentChallenge.completedDays / currentChallenge.totalDays) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>CONSISTENCY ENGINE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 font-sans tracking-tight">
          Drawing Challenges
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-base font-sans">
          Build a high-level daily habit. Complete prompts, log your artwork sessions, and earn studio achievement badges.
        </p>
      </div>

      {/* Challenge Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {challenges.map((ch) => {
          const isSelected = ch.id === selectedChallengeId;
          const prog = Math.min(100, Math.round((ch.completedDays / ch.totalDays) * 100));

          return (
            <div
              key={ch.id}
              onClick={() => setSelectedChallengeId(ch.id)}
              className={`glass-card p-6 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/40 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                  : 'border-white/10 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
                  {ch.title}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {ch.currentStreak}d streak
                </span>
              </div>

              <h4 className="text-xl font-bold text-white mb-2 font-sans">
                {ch.subtitle}
              </h4>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mt-4 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${prog}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>{ch.completedDays} / {ch.totalDays} days</span>
                <span className="text-cyan-300 font-bold">{prog}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Challenge Detailed Panel */}
      <div className="glass-card glow-border rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Award className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white font-sans">
                {currentChallenge.title} Tracker
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Badge Reward: <strong className="text-cyan-300">{currentChallenge.badgeName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGenerateChallengePrompt}
              className="px-4 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Get Prompt</span>
            </button>

            <button
              onClick={() => handleComplete(currentChallenge.id)}
              disabled={isCompletedToday}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isCompletedToday
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompletedToday ? "Today's Sketch Logged!" : 'Log Today’s Sketch'}</span>
            </button>
          </div>
        </div>

        {/* Milestone Grid visual */}
        <div>
          <h4 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2 font-sans">
            <Calendar className="w-4 h-4 text-purple-400" />
            Milestone Grid Progress
          </h4>
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2.5">
            {Array.from({ length: Math.min(30, currentChallenge.totalDays) }).map((_, i) => {
              const dayNum = i + 1;
              const isLogged = dayNum <= currentChallenge.completedDays;

              return (
                <div
                  key={dayNum}
                  className={`aspect-square rounded-xl border text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    isLogged
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'bg-zinc-900/60 border-white/5 text-zinc-600'
                  }`}
                >
                  {isLogged ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" /> : dayNum}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

