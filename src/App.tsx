import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PromptCard } from './components/PromptCard';
import { CategoryGrid } from './components/CategoryGrid';
import { FilterModal } from './components/FilterModal';
import { FavoritesView } from './components/FavoritesView';
import { HistoryView } from './components/HistoryView';
import { ExportCardModal } from './components/ExportCardModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { DrawingPrompt, PromptFilters, AppSettings } from './types';
import { generateClientPrompt, getClientDailyPrompt } from './utils/clientPrompts';

async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }
    const text = await res.text();
    if (!text || (!text.trim().startsWith('{') && !text.trim().startsWith('['))) {
      return null;
    }
    const data = JSON.parse(text);
    if (!res.ok) return null;
    return data;
  } catch (err) {
    console.warn(`API call to ${url} returned non-JSON or failed, using client fallback:`, err);
    return null;
  }
}

export default function App() {
  // Navigation & UI Modal States
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [exportModalPrompt, setExportModalPrompt] = useState<DrawingPrompt | null>(null);

  // Core Prompt States
  const [activePrompt, setActivePrompt] = useState<DrawingPrompt | null>(null);
  const [dailyPrompt, setDailyPrompt] = useState<DrawingPrompt | null>(null);
  const [history, setHistory] = useState<DrawingPrompt[]>(() => {
    try {
      const saved = localStorage.getItem('drawmuse_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<DrawingPrompt[]>(() => {
    try {
      const saved = localStorage.getItem('drawmuse_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('drawmuse_settings');
      return saved
        ? JSON.parse(saved)
        : {
            theme: 'light',
            promptLength: 'standard',
            animationsEnabled: true,
            soundEffects: true,
          };
    } catch {
      return {
        theme: 'light',
        promptLength: 'standard',
        animationsEnabled: true,
        soundEffects: true,
      };
    }
  });

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('General Inspiration');
  const [filters, setFilters] = useState<PromptFilters>({});

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  // Sync Persistence
  useEffect(() => {
    localStorage.setItem('drawmuse_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('drawmuse_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('drawmuse_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply Theme Classes to HTML/Body
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Fetch Daily Featured Prompt on Mount
  useEffect(() => {
    const fetchDaily = async () => {
      let data = await safeFetchJson('/api/daily-prompt');
      if (!data) {
        data = getClientDailyPrompt();
      }

      const dailyItem: DrawingPrompt = {
        id: `daily-${data.date}`,
        title: data.title,
        text: data.prompt,
        category: data.category || 'Daily Spotlight',
        filters: {},
        createdAt: Date.now(),
        isFavorite: favorites.some((f) => f.id === `daily-${data.date}`),
        isDaily: true,
        dailyDate: data.date,
      };

      setDailyPrompt(dailyItem);
    };

    fetchDaily();
  }, []);

  // API Action: Generate New Prompt
  const handleGeneratePrompt = async (categoryOverride?: string) => {
    const cat = categoryOverride || selectedCategory;
    if (categoryOverride) {
      setSelectedCategory(categoryOverride);
    }

    setIsLoading(true);
    // Immediately switch to generator tab for instant smooth transition
    setActiveTab('generator');

    try {
      let data = await safeFetchJson('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          filters,
          lengthPreference: settings.promptLength,
        }),
      });

      if (!data || !data.prompt) {
        // Fallback to client prompt engine if server API returns non-JSON or fails
        const clientData = generateClientPrompt(cat, filters, settings.promptLength);
        data = {
          title: clientData.title,
          prompt: clientData.prompt,
          category: clientData.category,
        };
      }

      const newPrompt: DrawingPrompt = {
        id: `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: data.title,
        text: data.prompt,
        category: data.category || cat,
        filters: { ...filters },
        createdAt: Date.now(),
        isFavorite: false,
      };

      setActivePrompt(newPrompt);
      setHistory((prev) => [newPrompt, ...prev]);
    } catch (err: any) {
      console.error('Error generating prompt, using client fallback:', err);
      const clientData = generateClientPrompt(cat, filters, settings.promptLength);
      const fallbackPrompt: DrawingPrompt = {
        id: `prompt-${Date.now()}`,
        title: clientData.title,
        text: clientData.prompt,
        category: clientData.category,
        filters: { ...filters },
        createdAt: Date.now(),
        isFavorite: false,
      };
      setActivePrompt(fallbackPrompt);
      setHistory((prev) => [fallbackPrompt, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  // API Action: Remix Prompt
  const handleRemix = async () => {
    if (!activePrompt) return;
    setIsRemixing(true);

    try {
      let data = await safeFetchJson('/api/remix-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existingPrompt: activePrompt.text,
          category: activePrompt.category,
          filters: activePrompt.filters,
        }),
      });

      if (!data || !data.prompt) {
        const twists = [
          'in a bright futuristic cyberpunk city with vibrant neon lights and rain puddles.',
          'underwater with clear sunbeams streaming through deep blue ocean water.',
          'on a snowy mountain peak under a glowing starry night sky.',
          'with warm candlelight and soft atmospheric shadows.',
        ];
        const randomTwist = twists[Math.floor(Math.random() * twists.length)];
        data = {
          title: 'Remixed Concept',
          prompt: `${activePrompt.text} — Reimagined ${randomTwist}`,
        };
      }

      const remixedPrompt: DrawingPrompt = {
        id: `remix-${Date.now()}`,
        title: data.title,
        text: data.prompt,
        category: activePrompt.category,
        filters: activePrompt.filters,
        createdAt: Date.now(),
        isFavorite: false,
        remixCount: (activePrompt.remixCount || 0) + 1,
        sourcePromptId: activePrompt.id,
      };

      setActivePrompt(remixedPrompt);
      setHistory((prev) => [remixedPrompt, ...prev]);
    } catch (err: any) {
      console.error('Error remixing:', err);
    } finally {
      setIsRemixing(false);
    }
  };

  // API Action: Expand Prompt
  const handleExpand = async () => {
    if (!activePrompt) return;
    setIsExpanding(true);

    try {
      let data = await safeFetchJson('/api/expand-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existingPrompt: activePrompt.text,
        }),
      });

      if (!data || !data.prompt) {
        data = {
          prompt: `${activePrompt.text}\n\nArtistic Details: Focus on atmospheric depth, soft ambient lighting, clean focal points, and rich environmental textures.`,
        };
      }

      const expandedPrompt: DrawingPrompt = {
        ...activePrompt,
        text: data.prompt,
        title: `${activePrompt.title} (Expanded)`,
      };

      setActivePrompt(expandedPrompt);
      setHistory((prev) => [expandedPrompt, ...prev.filter((p) => p.id !== activePrompt.id)]);
    } catch (err: any) {
      console.error('Error expanding:', err);
    } finally {
      setIsExpanding(false);
    }
  };

  // Favorite Toggle
  const handleToggleFavorite = (id: string) => {
    let target: DrawingPrompt | undefined =
      (activePrompt && activePrompt.id === id ? activePrompt : undefined) ||
      (dailyPrompt && dailyPrompt.id === id ? dailyPrompt : undefined) ||
      history.find((h) => h.id === id);

    if (!target) return;

    const isFav = favorites.some((f) => f.id === id);

    if (isFav) {
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } else {
      setFavorites((prev) => [{ ...target, isFavorite: true }, ...prev]);
    }

    if (activePrompt && activePrompt.id === id) {
      setActivePrompt({ ...activePrompt, isFavorite: !isFav });
    }
    if (dailyPrompt && dailyPrompt.id === id) {
      setDailyPrompt({ ...dailyPrompt, isFavorite: !isFav });
    }
    setHistory((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isFavorite: !isFav } : h))
    );
  };

  // Toggle Theme
  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans transition-colors duration-300">
      {/* Top Navbar & Bottom Floating Nav */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'generator' && !activePrompt) {
            handleGeneratePrompt();
          } else {
            setActiveTab(tab);
          }
        }}
        theme={settings.theme}
        toggleTheme={toggleTheme}
        openSettings={() => setIsSettingsOpen(true)}
        openAbout={() => setIsAboutOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="pb-28 pt-4">
        {activeTab === 'home' && (
          <HomeView
            dailyPrompt={dailyPrompt}
            favorites={favorites}
            history={history}
            onSelectCategoryAndGenerate={(catName) => {
              setSelectedCategory(catName);
              handleGeneratePrompt(catName);
            }}
            onSelectPromptToDraw={(prompt) => {
              setActivePrompt(prompt);
              setActiveTab('generator');
            }}
            onToggleFavorite={handleToggleFavorite}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'generator' && (
          <PromptCard
            prompt={activePrompt}
            isLoading={isLoading}
            isRemixing={isRemixing}
            isExpanding={isExpanding}
            onGenerateAnother={() => handleGeneratePrompt()}
            onRemix={handleRemix}
            onExpand={handleExpand}
            onToggleFavorite={handleToggleFavorite}
            onOpenExport={(p) => setExportModalPrompt(p)}
            onOpenFilters={() => setIsFilterModalOpen(true)}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryGrid
            selectedCategory={selectedCategory}
            onSelectCategory={(catName) => {
              setSelectedCategory(catName);
              handleGeneratePrompt(catName);
            }}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenExport={(p) => setExportModalPrompt(p)}
            onRemixPrompt={(p) => {
              setActivePrompt(p);
              setActiveTab('generator');
              handleRemix();
            }}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onClearHistory={() => setHistory([])}
            onDeleteHistoryItem={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
            onToggleFavorite={handleToggleFavorite}
            onOpenExport={(p) => setExportModalPrompt(p)}
            onSelectFromHistory={(p) => {
              setActivePrompt(p);
              setActiveTab('generator');
            }}
          />
        )}
      </main>

      <footer className="py-6 border-t border-[var(--border-subtle)] text-center text-xs font-mono text-[var(--text-muted)]">
        <span>DrawMuse • Designed by MahibHasan</span>
      </footer>

      {/* Filter Bottom Sheet Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({})}
        onApplyAndGenerate={() => handleGeneratePrompt()}
      />

      {/* Export PNG Card Modal */}
      {exportModalPrompt && (
        <ExportCardModal
          prompt={exportModalPrompt}
          onClose={() => setExportModalPrompt(null)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
          onClearHistory={() => setHistory([])}
          onClearFavorites={() => setFavorites([])}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* About Modal */}
      {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}
    </div>
  );
}
