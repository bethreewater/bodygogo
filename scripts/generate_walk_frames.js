/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Generate pseudo-walk frames from a single PNG sprite.
 * Uses small rotations/translations to create distinct frames.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT = path.join(__dirname, '..', 'public', 'sprites', 'PXgirl_clean.png');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'sprites', 'PXgirl_walk');

const PAD = 20;

const FRAMES = [
  { name: 'idle_0', rotate: 0, dx: 0, dy: 0 },
  { name: 'walk_0', rotate: -2, dx: -4, dy: -2 },
  { name: 'walk_1', rotate: 0, dx: 0, dy: -3 },
  { name: 'walk_2', rotate: 2, dx: 4, dy: -2 },
  { name: 'walk_3', rotate: 0, dx: 0, dy: -1 }
];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function buildFrame(frame) {
  const base = sharp(INPUT).ensureAlpha();
  const rotated = frame.rotate
    ? await base.rotate(frame.rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
    : await base.png().toBuffer();

  const meta = await sharp(rotated).metadata();
  const width = meta.width;
  const height = meta.height;

  const canvas = sharp({
    create: {
      width: width + PAD * 2,
      height: height + PAD * 2,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });

  const left = PAD + frame.dx;
  const top = PAD + frame.dy;

  const composited = await canvas
    .composite([{ input: rotated, left: left, top: top }])
    .extract({ left: PAD, top: PAD, width: width, height: height })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return { buffer: composited, width, height };
}

async function run() {
  await ensureDir(OUTPUT_DIR);
  for (const frame of FRAMES) {
    const { buffer } = await buildFrame(frame);
    await sharp(buffer).toFile(path.join(OUTPUT_DIR, `${frame.name}.png`));
  }
  console.log('✓ Generated frames in', OUTPUT_DIR);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
