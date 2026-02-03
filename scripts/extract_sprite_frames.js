/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Extract frames from pixel_girl_spritesheet_v4_original.png
 * Outputs transparent PNG frames for idle and walk actions.
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const INPUT_PATH = path.join(__dirname, '..', 'public', 'pixel_girl_spritesheet_v4_original.png');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'sprites', 'pixel_girl_original');

const FRAME_W = 128;
const FRAME_H = 256;
const COLS = 8;

const ROW_IDLE = 3;
const ROW_WALK = 3;

const WHITE_THRESHOLD = 205;
const VARIANCE_MAX = 120;
const AGGRESSIVE = true;

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

function removeWhiteBackgroundFlood(data, width, height) {
  const isBgLike = (idx) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const variance = max - min;
    const lightness = (r + g + b) / 3;
    const isLight = lightness > WHITE_THRESHOLD;
    const isLowSat = variance < VARIANCE_MAX;
    return isLight && isLowSat;
  };

  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed from edges
  for (let x = 0; x < width; x++) {
    queue.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y], [width - 1, y]);
  }

  const pushIf = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const offset = idx * 4;
    if (isBgLike(offset)) {
      visited[idx] = 1;
      queue.push([x, y]);
    }
  };

  // Flood fill
  while (queue.length) {
    const [x, y] = queue.shift();
    pushIf(x + 1, y);
    pushIf(x - 1, y);
    pushIf(x, y + 1);
    pushIf(x, y - 1);
  }

  // Apply transparency to visited (background)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!visited[idx]) continue;
      const offset = idx * 4;
      data[offset + 3] = 0;
    }
  }

  // Edge cleanup: remove near-white fringe adjacent to transparent pixels
  const alphaAt = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return 0;
    return data[(y * width + x) * 4 + 3];
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = data[idx + 3];
      if (a === 0) continue;
      if (!isBgLike(idx)) continue;
      const neighborTransparent =
        alphaAt(x + 1, y) === 0 ||
        alphaAt(x - 1, y) === 0 ||
        alphaAt(x, y + 1) === 0 ||
        alphaAt(x, y - 1) === 0;
      if (neighborTransparent) {
        data[idx + 3] = 0;
      }
    }
  }

  if (AGGRESSIVE) {
    // Final cleanup: drop remaining light pixels near transparency
    const alphaAt2 = (x, y) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return 0;
      return data[(y * width + x) * 4 + 3];
    };
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (data[idx + 3] === 0) continue;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const lightness = (r + g + b) / 3;
        if (lightness < 200) continue;
        const neighborTransparent =
          alphaAt2(x + 1, y) === 0 ||
          alphaAt2(x - 1, y) === 0 ||
          alphaAt2(x, y + 1) === 0 ||
          alphaAt2(x, y - 1) === 0;
        if (neighborTransparent) data[idx + 3] = 0;
      }
    }
  }
}

async function extractFrame(row, col) {
  const left = col * FRAME_W;
  const top = row * FRAME_H;
  const buffer = await sharp(INPUT_PATH)
    .extract({ left, top, width: FRAME_W, height: FRAME_H })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = buffer;
  removeWhiteBackgroundFlood(data, info.width, info.height);

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png({ compressionLevel: 9 });
}

async function run() {
  await ensureDir(OUTPUT_DIR);

  // Idle: export all idle frames
  for (let col = 0; col < COLS; col++) {
    const frame = await extractFrame(ROW_IDLE, col);
    await frame.toFile(path.join(OUTPUT_DIR, `idle_${col}.png`));
  }

  // Walk: 8 frames
  for (let col = 0; col < COLS; col++) {
    const frame = await extractFrame(ROW_WALK, col);
    await frame.toFile(path.join(OUTPUT_DIR, `walk_${col}.png`));
  }

  console.log('✓ Frames extracted to', OUTPUT_DIR);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
