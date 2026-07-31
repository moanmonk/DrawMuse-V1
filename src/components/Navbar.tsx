import React from 'react';
import { Logo } from './Logo';
import { ThemeMode } from '../types';
import {
  Home,
  Grid,
  Sparkles,
  Bookmark,
  History,
  Settings,
  Sun,
  Moon,
  Info,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  openSettings: () => void;
  openAbout: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  openSettings,
  openAbout,
  favoritesCount,
}) => {
  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'generator', label: 'Generator', icon: Sparkles },
    { id: 'favorites', label: 'Favorites', icon: Bookmark, badge: favoritesCount > 0 ? favoritesCount : null },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <>
      {/* Top Editorial Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <Logo size={28} className="text-[var(--text-main)] transition-transform duration-300 group-hover:scale-105" />
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[var(--text-main)]">
                DrawMuse
              </span>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={`Switch theme`}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[var(--text-main)]" />}
            </button>

            <button
              onClick={openAbout}
              title="About DrawMuse"
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={openSettings}
              title="Settings"
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg bg-[var(--bg-card)]/95 backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl rounded-2xl p-1.5 flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[var(--bg-main)] bg-[var(--text-main)] font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4 mb-0.5" />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1.2 py-0.2 rounded-full text-[9px] font-mono bg-[var(--accent-terracotta)] text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wide font-sans">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
