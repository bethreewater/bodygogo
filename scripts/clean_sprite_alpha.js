/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Clean white fringe from a PNG sprite with alpha.
 */
const sharp = require('sharp');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'public', 'sprites', 'PXgirl.png');
const OUTPUT = path.join(__dirname, '..', 'public', 'sprites', 'PXgirl_clean.png');

// Tuning
const WHITE_LUMA = 220;
const SAT_THRESHOLD = 25; // low saturation -> likely fringe
const EDGE_ERODE = true;

function colorDist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

function sampleBgColors(data, w, h) {
  const samples = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)]
  ];
  const colors = [];
  for (const [x, y] of samples) {
    const i = (y * w + x) * 4;
    colors.push([data[i], data[i + 1], data[i + 2]]);
  }
  return colors;
}

async function run() {
  const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  const luma = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b);
  const sat = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

  // Detect background colors (for checkerboard PNGs)
  const bgColors = sampleBgColors(data, w, h);

  // Clean near-white pixels by reducing alpha
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a === 0) continue;
    const L = luma(r, g, b);
    const S = sat(r, g, b);
    const isBg = bgColors.some(c => colorDist([r, g, b], c) < 12);
    if (isBg || (L > WHITE_LUMA && S < SAT_THRESHOLD)) {
      // reduce alpha aggressively
      data[i + 3] = 0;
    }
  }

  // Optional: erode 1px edges where alpha is thin
  if (EDGE_ERODE) {
    const alphaAt = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return 0;
      return data[(y * w + x) * 4 + 3];
    };
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const a = data[idx + 3];
        if (a === 0) continue;
        const neighborTransparent =
          alphaAt(x + 1, y) === 0 ||
          alphaAt(x - 1, y) === 0 ||
          alphaAt(x, y + 1) === 0 ||
          alphaAt(x, y - 1) === 0;
        if (neighborTransparent && a < 255) data[idx + 3] = 0;
      }
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT);

  console.log('✓ Saved', OUTPUT);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
