import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

export function ensureIconsExist() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const appleTouchPath = path.join(publicDir, 'apple-touch-icon.png');
  const appleTouchPrecomposedPath = path.join(publicDir, 'apple-touch-icon-precomposed.png');
  const icon192Path = path.join(publicDir, 'icon-192.png');
  const icon512Path = path.join(publicDir, 'icon-512.png');
  const faviconPngPath = path.join(publicDir, 'favicon.png');
  const faviconIcoPath = path.join(publicDir, 'favicon.ico');

  // Generate PNG icons for iOS Safari and PWAs
  generateAppIconPNG(appleTouchPath, 180);
  generateAppIconPNG(appleTouchPrecomposedPath, 180);
  generateAppIconPNG(icon192Path, 192);
  generateAppIconPNG(icon512Path, 512);
  generateAppIconPNG(faviconPngPath, 64);
  generateAppIconPNG(faviconIcoPath, 64);

  // Write PWA manifest.json referencing PNG and SVG
  const manifestPath = path.join(publicDir, 'manifest.json');
  const manifestContent = JSON.stringify(
    {
      short_name: 'DrawMuse',
      name: 'DrawMuse — Prompt Studio',
      description: 'Inspiring drawing prompts for digital and traditional artists.',
      start_url: '/',
      display: 'standalone',
      background_color: '#09090b',
      theme_color: '#09090b',
      orientation: 'portrait',
      icons: [
        {
          src: '/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icon.svg',
          sizes: '512x512',
          type: 'image/svg+xml'
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
  const bgR = 0x09, bgG = 0x09, bgB = 0x0B, bgA = 0xFF; // Dark Zinc #09090b
  const cardR = 0x1A, cardG = 0x18, cardB = 0x16; // Warm Charcoal Card #1a1816
  const terraR = 0xE0, terraG = 0x73, terraB = 0x4C; // Bright Terracotta #E0734C
  const goldR = 0xF5, goldG = 0xC0, goldB = 0x6B; // Gold Sparkle #F5C06B
  const whiteR = 0xF7, whiteG = 0xF4, whiteB = 0xEE; // Soft Ivory #F7F4EE

  const center = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Default dark fill
      let r = bgR, g = bgG, b = bgB, a = bgA;

      const dx = x - center;
      const dy = y - center;

      // Inner Squircle / Rounded Card Area
      const cornerRadius = size * 0.22;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const boxSize = size * 0.42;

      if (absDx < boxSize && absDy < boxSize) {
        // Simple rounded box formula
        const cornerDx = Math.max(0, absDx - (boxSize - cornerRadius));
        const cornerDy = Math.max(0, absDy - (boxSize - cornerRadius));
        if (cornerDx * cornerDx + cornerDy * cornerDy < cornerRadius * cornerRadius) {
          r = cardR; g = cardG; b = cardB;
        }
      }

      // Pencil Nib Body (Diagonal Terracotta Stripe)
      const perpDist = Math.abs(dx + dy) / Math.SQRT2;
      const projDist = (dx - dy) / Math.SQRT2;
      const barWidth = size * 0.11;
      const barLen = size * 0.28;

      if (perpDist < barWidth && Math.abs(projDist) < barLen) {
        r = terraR; g = terraG; b = terraB;
      }

      // Sparkle Star (Gold 4-Point Star in Top Right)
      const starCx = size * 0.16;
      const starCy = -size * 0.16;
      const sdx = Math.abs(dx - starCx);
      const sdy = Math.abs(dy - starCy);
      const starRadius = size * 0.14;

      if (sdx + sdy < starRadius) {
        r = goldR; g = goldG; b = goldB;
      }

      // Nib Tip Ivory Highlight (Bottom Left)
      const tipCx = -size * 0.16;
      const tipCy = size * 0.16;
      if (Math.hypot(dx - tipCx, dy - tipCy) < size * 0.05) {
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

