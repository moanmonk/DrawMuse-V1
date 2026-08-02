export type ThemeMode = 'light' | 'dark' | 'system';

export type PromptLength = 'micro' | 'standard' | 'detailed';

export interface PromptFilters {
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Professional' | 'Any';
  mood?: 'Peaceful' | 'Dark' | 'Epic' | 'Dreamlike' | 'Cute' | 'Whimsical' | 'Lonely' | 'Mysterious' | 'Emotional' | 'Melancholic' | 'Any';
  lighting?: 'Morning' | 'Golden Hour' | 'Sunset' | 'Night' | 'Moonlight' | 'Storm' | 'Fog' | 'Chiaroscuro' | 'Ambient' | 'Any';
  weather?: 'Clear' | 'Rainy' | 'Foggy' | 'Snowy' | 'Stormy' | 'Overcast' | 'Windy' | 'Any';
  colorPalette?: 'Warm' | 'Cool' | 'Pastel' | 'Earth Tones' | 'Monochrome' | 'Limited Palette' | 'Terracotta & Sage' | 'Any';
  perspective?: 'Front' | 'Side' | 'Top' | "Bird's Eye" | "Worm's Eye" | 'Three Quarter' | 'Wide Angle' | 'Close-up' | 'Any';
  artStyle?: 'Oil Painting' | 'Fine Ink' | 'Watercolor' | 'Concept Art' | 'Pencil Sketch' | 'Charcoal' | 'Digital Gouache' | 'Any';
  complexity?: 'Minimal' | 'Balanced' | 'Intricate' | 'Any';
  promptLength?: 'micro' | 'standard' | 'detailed';
  storytelling?: boolean;
  characterCount?: 'Single' | 'Duo' | 'Group' | 'Crowd' | 'None' | 'Any';
  constraints?: 'Only Ink' | 'Only Pencil' | 'One Continuous Line' | 'Silhouette Only' | 'No Eraser' | 'Black & White' | '10 Minute Sketch' | '5 Color Limit' | 'Only Shapes' | 'Any';
}

export interface DrawingPrompt {
  id: string;
  text: string;
  title: string;
  category: string;
  filters: PromptFilters;
  createdAt: number;
  isFavorite: boolean;
  remixCount?: number;
  sourcePromptId?: string;
  isDaily?: boolean;
  dailyDate?: string; // YYYY-MM-DD
  provider?: string; // AI provider or generator engine name
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  group: 'Character & Creatures' | 'Environments & World' | 'Objects & Props' | 'Artistic Styles' | 'Technical & Practice' | 'Themes & Narrative';
  sampleIdea: string;
  editorialTag?: string;
  editorialGradient?: string;
}

export interface WheelState {
  subject: string;
  mood: string;
  weather: string;
  lighting: string;
  location: string;
  twist: string;
}

export interface Challenge {
  id: '30-day' | '100-day' | '365-day';
  title: string;
  subtitle: string;
  totalDays: number;
  completedDays: number;
  completedDates: string[]; // YYYY-MM-DD
  currentStreak: number;
  lastCompletedDate?: string;
  badgeName: string;
  badgeIcon: string;
}

export interface AppSettings {
  theme: ThemeMode;
  promptLength: PromptLength;
  animationsEnabled: boolean;
  soundEffects: boolean;
}
