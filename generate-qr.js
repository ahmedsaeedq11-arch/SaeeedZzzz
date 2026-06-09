/**
 * SAEED PIXEL QR GENERATOR
 * Generates a high-quality pixel-art styled QR code for banner printing
 * Output: SVG (vector, infinite resolution) + PNG (4000x4000 px)
 */

const QRCode = require('qrcode');
const fs     = require('fs');
const path   = require('path');

const URL        = 'https://ahmedsaeedq11-arch.github.io/SaeeedZzzz/preview.html';
const OUT_DIR    = path.join(__dirname, 'assets', 'qr');
const CELL       = 14;          // px per QR module (high-res for print)
const QUIET      = 4;           // quiet zone modules
const PALETTE    = {
  dark:    '#1a0f2e',           // deep purple-black (QR modules)
  light:   '#ffffff',           // white background
  accent:  '#f4c842',           // gold (corner squares)
  purple:  '#9566f0',           // purple (decorative)
  green:   '#4ade80',           // green (eye centers)
  bg:      '#0d0820',           // dark background of card
  border:  '#f4c842',           // gold border
};

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Generate QR data matrix ─────────────────────────────────────────────────
async function buildQR() {
  const qr = await QRCode.create(URL, {
    errorCorrectionLevel: 'H',   // highest (30%) — allows logo overlay
    version: undefined,          // auto-size
  });

  const matrix = qr.modules;
  const N      = matrix.size;
  const total  = N + QUIET * 2;
  const SIZE   = total * CELL;

  // ── Helper ────────────────────────────────────────────────────────────────
  function isFinderCenter(r, c) {
    // The 3 finder patterns: top-left, top-right, bottom-left
    const inTL = r >= 2 && r <= 4 && c >= 2 && c <= 4;
    const inTR = r >= 2 && r <= 4 && c >= N - 5 && c <= N - 3;
    const inBL = r >= N - 5 && r <= N - 3 && c >= 2 && c <= 4;
    return inTL || inTR || inBL;
  }

  function isFinderOuter(r, c) {
    const inTL = r >= 0 && r <= 6 && c >= 0 && c <= 6;
    const inTR = r >= 0 && r <= 6 && c >= N - 7 && c <= N - 1;
    const inBL = r >= N - 7 && r <= N - 1 && c >= 0 && c <= 6;
    return inTL || inTR || inBL;
  }

  // ── Build SVG ─────────────────────────────────────────────────────────────
  const PAD = QUIET * CELL;
  let cells = '';

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!matrix.get(r, c)) continue;  // light cell — skip

      const x = PAD + c * CELL;
      const y = PAD + r * CELL;
      const R = CELL * 0.12;            // default slight rounding

      let fill   = PALETTE.dark;
      let radius = R;
      let size   = CELL;

      if (isFinderCenter(r, c)) {
        fill   = PALETTE.green;
        radius = CELL * 0.2;
        size   = CELL + 0.5;           // slightly larger for center dots
      } else if (isFinderOuter(r, c)) {
        fill   = PALETTE.accent;
        radius = CELL * 0.15;
      }

      cells += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${fill}"/>`;
    }
  }

  // ── Outer decorative frame ────────────────────────────────────────────────
  const FRAME_PAD  = 40;
  const FULL_W     = SIZE + FRAME_PAD * 2;
  const FULL_H     = SIZE + FRAME_PAD * 2 + 180;   // extra space for text below

  // Pixel corner L-shapes (top-left, top-right, bottom-left, bottom-right)
  const cornerSize = 60;
  const cStroke    = 8;
  function pixelCorner(x, y, flipH, flipV) {
    const sx = flipH ? -1 : 1;
    const sy = flipV ? -1 : 1;
    return `
      <rect x="${x}" y="${y}" width="${cornerSize}" height="${cStroke}" fill="${PALETTE.accent}" transform="scale(${sx},${sy}) translate(${flipH ? -(x*2+cornerSize) : 0},${flipV ? -(y*2+cStroke) : 0})"/>
      <rect x="${x}" y="${y}" width="${cStroke}" height="${cornerSize}" fill="${PALETTE.accent}" transform="scale(${sx},${sy}) translate(${flipH ? -(x*2+cStroke) : 0},${flipV ? -(y*2+cornerSize) : 0})"/>
    `;
  }

  // Simpler corner approach using absolute coords
  const c1 = FRAME_PAD - 20;
  const c2 = FULL_W - FRAME_PAD + 20;
  const c3 = FRAME_PAD - 20;
  const c4 = SIZE + FRAME_PAD + 20;
  const cW = cornerSize;
  const cH = cStroke;

  const corners = `
    <!-- TL -->
    <rect x="${c1}" y="${c3}" width="${cW}" height="${cH}" rx="2" fill="${PALETTE.accent}"/>
    <rect x="${c1}" y="${c3}" width="${cH}" height="${cW}" rx="2" fill="${PALETTE.accent}"/>
    <!-- TR -->
    <rect x="${c2 - cW}" y="${c3}" width="${cW}" height="${cH}" rx="2" fill="${PALETTE.accent}"/>
    <rect x="${c2 - cH}" y="${c3}" width="${cH}" height="${cW}" rx="2" fill="${PALETTE.accent}"/>
    <!-- BL -->
    <rect x="${c1}" y="${c4 - cH}" width="${cW}" height="${cH}" rx="2" fill="${PALETTE.accent}"/>
    <rect x="${c1}" y="${c4 - cW}" width="${cH}" height="${cW}" rx="2" fill="${PALETTE.accent}"/>
    <!-- BR -->
    <rect x="${c2 - cW}" y="${c4 - cH}" width="${cW}" height="${cH}" rx="2" fill="${PALETTE.accent}"/>
    <rect x="${c2 - cH}" y="${c4 - cW}" width="${cH}" height="${cW}" rx="2" fill="${PALETTE.accent}"/>
  `;

  // Scanline overlay (subtle CRT feel for visual style)
  const scanlines = Array.from({ length: Math.ceil(FULL_H / 6) }, (_, i) =>
    `<rect x="0" y="${i * 6}" width="${FULL_W}" height="1" fill="rgba(0,0,0,0.04)"/>`
  ).join('');

  // Center logo overlay — pixelated "S" in gold on dark circle
  const cx = FULL_W / 2;
  const cy = FRAME_PAD + SIZE / 2;
  const logoR = CELL * 2.8;

  const logoCircle = `
    <circle cx="${cx}" cy="${cy}" r="${logoR + 4}" fill="${PALETTE.bg}"/>
    <circle cx="${cx}" cy="${cy}" r="${logoR}" fill="${PALETTE.dark}" stroke="${PALETTE.accent}" stroke-width="3"/>
    <text x="${cx}" y="${cy + 1}" font-family="monospace" font-size="${logoR * 1.1}" font-weight="900"
          text-anchor="middle" dominant-baseline="middle" fill="${PALETTE.accent}" letter-spacing="-1">S</text>
  `;

  // ── Text block below QR ───────────────────────────────────────────────────
  const textY = FRAME_PAD + SIZE + 30;

  const textBlock = `
    <!-- SCAN ME label -->
    <text x="${FULL_W / 2}" y="${textY + 22}"
          font-family="'Courier New', monospace" font-size="22" font-weight="900"
          text-anchor="middle" fill="${PALETTE.accent}" letter-spacing="8">▶ SCAN ME ◀</text>

    <!-- Divider pixel line -->
    <rect x="${FULL_W/2 - 120}" y="${textY + 38}" width="240" height="3" fill="${PALETTE.purple}" rx="1"/>

    <!-- Name -->
    <text x="${FULL_W / 2}" y="${textY + 72}"
          font-family="'Courier New', monospace" font-size="30" font-weight="900"
          text-anchor="middle" fill="#ffffff" letter-spacing="3">AHMED SAEED</text>

    <!-- Tag -->
    <text x="${FULL_W / 2}" y="${textY + 102}"
          font-family="'Courier New', monospace" font-size="15"
          text-anchor="middle" fill="${PALETTE.purple}" letter-spacing="4">DESIGN STUDENT • PIXEL PORTFOLIO</text>

    <!-- URL -->
    <text x="${FULL_W / 2}" y="${textY + 134}"
          font-family="'Courier New', monospace" font-size="12"
          text-anchor="middle" fill="rgba(255,255,255,0.4)" letter-spacing="1">${URL}</text>

    <!-- Stars deco -->
    <text x="${FULL_W / 2}" y="${textY + 160}"
          font-family="'Courier New', monospace" font-size="18"
          text-anchor="middle" fill="${PALETTE.accent}" letter-spacing="8">★  ★  ★</text>
  `;

  // ── Assemble final SVG ────────────────────────────────────────────────────
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${FULL_W}" height="${FULL_H}"
     viewBox="0 0 ${FULL_W} ${FULL_H}">

  <!-- Background -->
  <rect width="${FULL_W}" height="${FULL_H}" fill="${PALETTE.bg}"/>

  <!-- QR white zone -->
  <rect x="${FRAME_PAD - 10}" y="${FRAME_PAD - 10}"
        width="${SIZE + 20}" height="${SIZE + 20}"
        fill="${PALETTE.light}" rx="4"/>

  <!-- QR modules -->
  <g transform="translate(${FRAME_PAD}, ${FRAME_PAD})">
    ${cells}
  </g>

  <!-- Center logo -->
  ${logoCircle}

  <!-- Pixel corner brackets -->
  ${corners}

  <!-- CRT scanlines -->
  ${scanlines}

  <!-- Text block -->
  ${textBlock}

</svg>`;

  // ── Write SVG ─────────────────────────────────────────────────────────────
  const svgPath = path.join(OUT_DIR, 'saeed-qr-pixel.svg');
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log(`✅ SVG written: ${svgPath}`);
  console.log(`   Size: ${FULL_W} × ${FULL_H} px (vector — scalable to any size)`);
  console.log(`   QR version: ${qr.version}, modules: ${N}×${N}`);
  console.log(`   Error correction: H (30%)`);
  console.log(`   URL encoded: ${URL}`);
  console.log('');
  console.log('📋 For banner printing:');
  console.log('   • Open the SVG in Inkscape / Illustrator / Figma');
  console.log('   • Export as PNG at 300 DPI → perfect for print');
  console.log('   • Or print directly from the SVG (vector = infinite quality)');
}

buildQR().catch(console.error);
