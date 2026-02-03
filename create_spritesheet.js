/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Create a walking sprite sheet from individual frame
 * Uses the idle pose and creates 8 variations for walk cycle
 */
const sharp = require('sharp');
const path = require('path');

const IDLE_PATH = path.join(__dirname, 'public', 'pixel_girl_idle.png');
const OUTPUT_PATH = path.join(__dirname, 'public', 'pixel_girl_spritesheet_v5.png');

// Sprite sheet: 8 cols x 2 rows
// Row 0: Idle (frame 0)
// Row 1: Walk cycle (8 frames)
const FRAME_WIDTH = 128;
const FRAME_HEIGHT = 256;
const COLS = 8;
const ROWS = 2;

async function createSpriteSheet() {
    try {
        console.log('Loading idle sprite:', IDLE_PATH);

        // Load and get info about the idle sprite
        const idleImage = sharp(IDLE_PATH);
        const idleMeta = await idleImage.metadata();
        console.log('Idle sprite dimensions:', idleMeta.width, 'x', idleMeta.height);

        // Create blank canvas
        const canvasWidth = FRAME_WIDTH * COLS;
        const canvasHeight = FRAME_HEIGHT * ROWS;

        console.log('Creating sprite sheet:', canvasWidth, 'x', canvasHeight);

        // Resize idle to exact frame size if needed
        const resizedIdle = await sharp(IDLE_PATH)
            .resize(FRAME_WIDTH, FRAME_HEIGHT, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .toBuffer();

        // For now, create a simple sheet with the same idle pose repeated
        // In production, you would have actual walk cycle frames
        const composites = [];

        // Row 0: Idle frame (position 0,0)
        composites.push({
            input: resizedIdle,
            top: 0,
            left: 0
        });

        // Row 1: Walk frames (8 frames)
        // Use the same idle for now - user will need to provide proper walk frames
        for (let col = 0; col < COLS; col++) {
            composites.push({
                input: resizedIdle,
                top: FRAME_HEIGHT,
                left: col * FRAME_WIDTH
            });
        }

        // Create white background canvas
        const canvas = await sharp({
            create: {
                width: canvasWidth,
                height: canvasHeight,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        })
            .composite(composites)
            .png()
            .toBuffer();

        // Now remove white background
        const processed = await sharp(canvas)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const { data, info } = processed;
        console.log('Processing transparency...');

        const threshold = 240;
        let pixelsChanged = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const isVeryWhite = r > threshold && g > threshold && b > threshold;
            const colorVariance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
            const isGrayscale = colorVariance < 30;

            if (isVeryWhite && isGrayscale) {
                data[i + 3] = 0; // Transparent
                pixelsChanged++;
            }
        }

        console.log(`Made ${pixelsChanged} pixels transparent`);

        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .png()
            .toFile(OUTPUT_PATH);

        console.log('✓ Sprite sheet saved:', OUTPUT_PATH);
        console.log('⚠ Note: Walk frames are placeholders. For proper animation, you need actual walk cycle frames.');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createSpriteSheet();
