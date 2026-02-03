/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Remove white background while preserving skin tones
 * More conservative approach to protect character colors
 */
const sharp = require('sharp');
const path = require('path');

const INPUT_PATH = path.join(__dirname, 'public', 'pixel_girl_spritesheet_v4_original.png');
const OUTPUT_PATH = path.join(__dirname, 'public', 'pixel_girl_spritesheet_v4_original_transparent.png');

async function removeWhiteBackground() {
    try {
        console.log('Processing:', INPUT_PATH);

        const image = await sharp(INPUT_PATH)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const { data, info } = image;
        console.log('Image size:', info.width, 'x', info.height);

        // More conservative threshold to preserve skin tones
        // Skin tones typically have lower RGB values than pure white
        const threshold = 240; // Only remove very bright pixels
        let pixelsChanged = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Only target near-white pixels
            // Skin tones have more variation between RGB channels
            const isVeryWhite = r > threshold && g > threshold && b > threshold;

            // Additional check: RGB values should be very close to each other (white/gray)
            const colorVariance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
            const isGrayscale = colorVariance < 30; // Low variance = grayscale

            if (isVeryWhite && isGrayscale) {
                // Make completely transparent
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 0; // Alpha: fully transparent
                pixelsChanged++;
            }
            // Otherwise keep original pixel unchanged (preserves skin tones)
        }

        console.log(`Changed ${pixelsChanged} pixels to transparent`);

        // Save processed image
        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .png({ compressionLevel: 9 })
            .toFile(OUTPUT_PATH);

        console.log('✓ Saved to:', OUTPUT_PATH);
        console.log('✓ Skin tones should be preserved!');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

removeWhiteBackground();
