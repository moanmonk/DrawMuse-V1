import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

export function ensureIconsExist() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const appleTouchPath = path.join(publicDir, 'apple-touch-icon.png');
  const icon512Path = path.join(publicDir, 'icon-512.png');
  const faviconPngPath = path.join(publicDir, 'favicon.png');

  // Always regenerate to guarantee icon is present
  generateAppIconPNG(appleTouchPath, 180);
  generateAppIconPNG(icon512Path, 512);
  generateAppIconPNG(faviconPngPath, 64);

  // Write PWA manifest.json
  const manifestPath = path.join(publicDir, 'manifest.json');
  const manifestContent = JSON.stringify(
    {
      name: 'DrawMuse — Prompt Studio',
      short_name: 'DrawMuse',
      description: 'Inspiring drawing prompts for digital and traditional artists.',
      start_url: '/',
      display: 'standalone',
      background_color: '#161412',
      theme_color: '#161412',
      icons: [
        {
          src: '/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    null,
    2
  );
  fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
}

function generateAppIconPNG(outputPath: string, size: number) {
  const png = new PNG({ width: size, height: size });

  // Color Definitions (RGBA)
  const bgR = 0x16, bgG = 0x14, bgB = 0x12, bgA = 0xFF; // Dark Warm Charcoal #161412
  const innerR = 0x24, innerG = 0x20, innerB = 0x1D; // Card Surface #24201D
  const terraR = 0xC8, terraG = 0x5A, terraB = 0x32; // Terracotta #C85A32
  const goldR = 0xD4, goldG = 0x9A, goldB = 0x3D; // Amber Gold #D49A3D
  const whiteR = 0xF7, whiteG = 0xF4, whiteB = 0xEE; // Soft Ivory #F7F4EE

  const center = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Default fill: dark charcoal
      let r = bgR, g = bgG, b = bgB, a = bgA;

      // Subtle inner rounded container
      const dx = Math.abs(x - center);
      const dy = Math.abs(y - center);

      if (dx < radius && dy < radius) {
        r = innerR; g = innerG; b = innerB;
      }

      // Draw Center Star/Pencil Nib Motif
      // 1. Draw Terracotta Diagonal Pencil Blade (Bottom Left to Top Right)
      const px = x - center;
      const py = y - center;

      // Main diagonal bar
      const perpDist = Math.abs(px + py) / Math.SQRT2;
      const projDist = (px - py) / Math.SQRT2;

      const barWidth = size * 0.12;
      const barLen = size * 0.28;

      if (perpDist < barWidth && Math.abs(projDist) < barLen) {
        r = terraR; g = terraG; b = terraB;
      }

      // 2. Draw Golden 4-Point Sparkle Star in Top Right
      const starCx = size * 0.62;
      const starCy = size * 0.38;
      const sdx = Math.abs(x - starCx);
      const sdy = Math.abs(y - starCy);
      const starRadius = size * 0.16;

      if (sdx + sdy < starRadius) {
        r = goldR; g = goldG; b = goldB;
      }

      // 3. Crisp Ivory Accent Point in Center
      if (dx < size * 0.04 && dy < size * 0.04) {
        r = whiteR; g = whiteG; b = whiteB;
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPath, buffer);
}
