import React, { useState, useRef, useEffect } from 'react';
import { DrawingPrompt } from '../types';
import { Download, X, Image as ImageIcon, Check, Sparkles } from 'lucide-react';

interface ExportCardModalProps {
  prompt: DrawingPrompt | null;
  onClose: () => void;
}

type AspectRatio = 'story' | 'post' | 'square' | 'wallpaper';
type CardTheme =
  | 'terracotta'
  | 'charcoal'
  | 'sage'
  | 'clay'
  | 'twilight'
  | 'cobalt'
  | 'lilac'
  | 'monochrome'
  | 'parchment';

interface ThemeDefinition {
  id: CardTheme;
  label: string;
  bgColor: string;
  panelBgColor: string;
  textColor: string;
  subTextColor: string;
  accentColor: string;
  borderColor: string;
}

const THEMES: Record<CardTheme, ThemeDefinition> = {
  terracotta: {
    id: 'terracotta',
    label: 'Ivory & Terracotta',
    bgColor: '#FAF7F2',
    panelBgColor: '#F2ECE4',
    textColor: '#24201D',
    subTextColor: '#736B63',
    accentColor: '#C85A32',
    borderColor: '#E2D9CD',
  },
  charcoal: {
    id: 'charcoal',
    label: 'Midnight Charcoal',
    bgColor: '#141312',
    panelBgColor: '#1E1C1A',
    textColor: '#F8F6F2',
    subTextColor: '#A09B93',
    accentColor: '#E8C5A5',
    borderColor: '#322E2A',
  },
  sage: {
    id: 'sage',
    label: 'Forest Sage',
    bgColor: '#14261C',
    panelBgColor: '#1D3627',
    textColor: '#F3F8F4',
    subTextColor: '#9CB5A4',
    accentColor: '#80C49B',
    borderColor: '#2A4A37',
  },
  clay: {
    id: 'clay',
    label: 'Coral Terracotta',
    bgColor: '#C85A32',
    panelBgColor: '#B64E28',
    textColor: '#FFFFFF',
    subTextColor: '#FCE2D9',
    accentColor: '#FFD54F',
    borderColor: '#D86B43',
  },
  twilight: {
    id: 'twilight',
    label: 'Twilight Plum',
    bgColor: '#1C1328',
    panelBgColor: '#281B3A',
    textColor: '#FAF6FF',
    subTextColor: '#B9A8CD',
    accentColor: '#EBA2C6',
    borderColor: '#392850',
  },
  cobalt: {
    id: 'cobalt',
    label: 'Royal Cobalt',
    bgColor: '#0F192E',
    panelBgColor: '#182748',
    textColor: '#FFFFFF',
    subTextColor: '#9EB5E0',
    accentColor: '#FCA311',
    borderColor: '#253C68',
  },
  lilac: {
    id: 'lilac',
    label: 'Ethereal Lavender',
    bgColor: '#231B30',
    panelBgColor: '#2E243E',
    textColor: '#FAFAFD',
    subTextColor: '#C1B2D8',
    accentColor: '#D8B4F8',
    borderColor: '#433659',
  },
  monochrome: {
    id: 'monochrome',
    label: 'Stark Gallery Mono',
    bgColor: '#111111',
    panelBgColor: '#1C1C1C',
    textColor: '#FFFFFF',
    subTextColor: '#888888',
    accentColor: '#FFFFFF',
    borderColor: '#333333',
  },
  parchment: {
    id: 'parchment',
    label: 'Warm Vintage Parchment',
    bgColor: '#F7F1E3',
    panelBgColor: '#EDE3D1',
    textColor: '#2C251E',
    subTextColor: '#7A6E63',
    accentColor: '#A0522D',
    borderColor: '#D8CCB9',
  },
};

export const ExportCardModal: React.FC<ExportCardModalProps> = ({ prompt, onClose }) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('story');
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('terracotta');
  const [isExporting, setIsExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!prompt || !canvasRef.current) return;
    renderCanvasCard();
  }, [prompt, selectedRatio, selectedTheme]);

  const renderCanvasCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !prompt) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas resolution setup
    let width = 1080;
    let height = 1920; // Default story 9:16

    if (selectedRatio === 'post') {
      width = 1080;
      height = 1350; // Instagram post 4:5
    } else if (selectedRatio === 'square') {
      width = 1080;
      height = 1080; // Square 1:1
    } else if (selectedRatio === 'wallpaper') {
      width = 1920;
      height = 1080; // Landscape 16:9
    }

    canvas.width = width;
    canvas.height = height;

    const theme = THEMES[selectedTheme];

    // 1. Fill Outer Canvas Background
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, width, height);

    // Subtle gradient depth
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, theme.bgColor);
    grad.addColorStop(1, theme.panelBgColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Margins and Inner Frame Container
    const margin = 56;
    const cardX = margin;
    const cardY = margin;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;

    // Draw Inner Card Panel (Filling majority of image)
    ctx.fillStyle = theme.panelBgColor;
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 32);
    ctx.fill();
    ctx.stroke();

    // Corner Accents
    const cornerTick = 24;
    ctx.strokeStyle = theme.accentColor;
    ctx.lineWidth = 4;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(cardX + 16, cardY + 16 + cornerTick);
    ctx.lineTo(cardX + 16, cardY + 16);
    ctx.lineTo(cardX + 16 + cornerTick, cardY + 16);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(cardX + cardW - 16 - cornerTick, cardY + 16);
    ctx.lineTo(cardX + cardW - 16, cardY + 16);
    ctx.lineTo(cardX + cardW - 16, cardY + 16 + cornerTick);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(cardX + 16, cardY + cardH - 16 - cornerTick);
    ctx.lineTo(cardX + 16, cardY + cardH - 16);
    ctx.lineTo(cardX + 16 + cornerTick, cardY + cardH - 16);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(cardX + cardW - 16 - cornerTick, cardY + cardH - 16);
    ctx.lineTo(cardX + cardW - 16, cardY + cardH - 16);
    ctx.lineTo(cardX + cardW - 16, cardY + cardH - 16 - cornerTick);
    ctx.stroke();

    // Content Padding inside inner card
    const px = cardX + 60;
    const contentW = cardW - 120;

    // 2. Header: Brand & Category Badge
    const headerY = cardY + 70;

    ctx.fillStyle = theme.accentColor;
    ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✦  DrawMuse', px, headerY);

    // Category Tag Badge
    const categoryText = (prompt.category || 'DRAWING PROMPT').toUpperCase();
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    const catMetrics = ctx.measureText(categoryText);
    const badgeW = catMetrics.width + 36;
    const badgeH = 38;
    const badgeX = cardX + cardW - 60 - badgeW;
    const badgeY = headerY - 26;

    ctx.fillStyle = theme.accentColor;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 19);
    ctx.fill();

    ctx.fillStyle = theme.panelBgColor;
    ctx.textAlign = 'center';
    ctx.fillText(categoryText, badgeX + badgeW / 2, badgeY + 25);
    ctx.textAlign = 'left';

    // 3. Dynamic High-Legibility Body Text Auto-Scaling (Fills ~75% of available space!)
    const footerH = 80;
    const availableTop = headerY + 60;
    const availableBottom = cardY + cardH - footerH - 40;
    const maxTextH = availableBottom - availableTop;

    let targetPromptFontSize = selectedRatio === 'story' ? 62 : selectedRatio === 'square' ? 48 : 54;
    let titleFontSize = targetPromptFontSize + 18;
    let lineHeight = Math.round(targetPromptFontSize * 1.42);
    let promptLines: string[] = [];

    // Auto-scale font size dynamically so it nicely covers up the whole image area!
    for (let size = targetPromptFontSize; size >= 28; size -= 2) {
      ctx.font = `600 ${size}px "Plus Jakarta Sans", -apple-system, sans-serif`;
      const words = prompt.text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        if (ctx.measureText(testLine).width > contentW && currentLine !== '') {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const calculatedTitleSize = Math.min(Math.round(size * 1.3), 72);
      const titleBlockH = calculatedTitleSize + 28;
      const bodyBlockH = lines.length * Math.round(size * 1.42);
      const totalH = titleBlockH + bodyBlockH + 40;

      if (totalH <= maxTextH || size === 28) {
        targetPromptFontSize = size;
        titleFontSize = calculatedTitleSize;
        lineHeight = Math.round(size * 1.42);
        promptLines = lines;
        break;
      }
    }

    // Calculate vertical centering of the text block inside the inner card
    const titleBlockH = titleFontSize + 28;
    const bodyBlockH = promptLines.length * lineHeight;
    const totalBlockH = titleBlockH + bodyBlockH;

    let startY = availableTop + (maxTextH - totalBlockH) / 2;
    if (startY < availableTop) startY = availableTop;

    // Decorative quote mark
    ctx.fillStyle = theme.accentColor;
    ctx.font = `800 ${Math.round(titleFontSize * 1.2)}px serif`;
    ctx.fillText('“', px, startY);

    startY += titleFontSize * 0.7;

    // Draw Title (Bold & Crisp)
    ctx.fillStyle = theme.textColor;
    ctx.font = `800 ${titleFontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    ctx.fillText(prompt.title, px, startY);

    startY += titleFontSize + 20;

    // Draw Divider Line
    ctx.strokeStyle = theme.accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px, startY - 10);
    ctx.lineTo(px + 100, startY - 10);
    ctx.stroke();

    startY += 20;

    // Draw Prompt Lines (Large, Highly Legible, Covering Card)
    ctx.fillStyle = theme.textColor;
    ctx.font = `600 ${targetPromptFontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;

    for (let i = 0; i < promptLines.length; i++) {
      ctx.fillText(promptLines[i], px, startY);
      startY += lineHeight;
    }

    // 4. Subtle, Clean Footer Credit
    const footerY = cardY + cardH - 50;

    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, footerY - 30);
    ctx.lineTo(cardX + cardW - 60, footerY - 30);
    ctx.stroke();

    ctx.fillStyle = theme.subTextColor;
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ARTIST CONCEPT PROMPT', px, footerY);

    ctx.fillStyle = theme.subTextColor;
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('DrawMuse • Designed by MahibHasan', cardX + cardW - 60, footerY);
    ctx.textAlign = 'left';
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !prompt) return;

    setIsExporting(true);
    setTimeout(() => {
      const imageURI = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanTitle = prompt.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `drawmuse-${selectedRatio}-${cleanTitle}.png`;
      link.href = imageURI;
      link.click();
      setIsExporting(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    }, 300);
  };

  if (!prompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[94vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[var(--accent-terracotta)]" />
            <h3 className="font-serif text-xl font-bold text-[var(--text-main)]">
              Shareable Prompt Art Card
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Ratio & Themes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Format Ratio */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2 font-semibold">
              Format Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'story', label: 'Story / Reel (9:16)' },
                { id: 'post', label: 'Instagram Post (4:5)' },
                { id: 'square', label: 'Square Post (1:1)' },
                { id: 'wallpaper', label: 'Landscape (16:9)' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRatio(r.id as AspectRatio)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    selectedRatio === r.id
                      ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)] font-semibold shadow-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aesthetic Palette */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2 font-semibold">
              Color Palette Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTheme === t.id
                      ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)] font-semibold shadow-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/20"
                    style={{ backgroundColor: t.bgColor }}
                  />
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex justify-center">
          <canvas
            ref={canvasRef}
            className="w-full max-w-sm h-auto rounded-xl shadow-xl border border-[var(--border-subtle)] transition-all"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-muted)] font-mono">
            Designed by MahibHasan
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs font-semibold hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="px-6 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>PNG Card Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[var(--accent-terracotta)]" />
                  <span>{isExporting ? 'Generating PNG...' : 'Download High-Res PNG'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
