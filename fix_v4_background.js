/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Aggressive white background removal for v4 sprite
 * Targets all light pixels while using edge detection to preserve character
 */
const sharp = require('sharp');
const path = require('path');

const INPUT_PATH = path.join(__dirname, 'public', 'pixel_girl_spritesheet_v4_original.png');
const OUTPUT_PATH = path.join(__dirname, 'public', 'pixel_girl_spritesheet_v4_fixed.png');

async function aggressiveBackgroundRemoval() {
    try {
        console.log('Processing with aggressive background removal:', INPUT_PATH);

        const image = await sharp(INPUT_PATH)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const { data, info } = image;
        const width = info.width;
        const height = info.height;
        console.log('Image size:', width, 'x', height);

        // Helper to get pixel at x,y
        const getPixel = (x, y) => {
            if (x < 0 || x >= width || y < 0 || y >= height) return null;
            const i = (y * width + x) * 4;
            return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
        };

        // Helper to check if a pixel is "dark" (part of character)
        const isDarkPixel = (pixel) => {
            if (!pixel) return false;
            const avg = (pixel.r + pixel.g + pixel.b) / 3;
            return avg < 180; // Dark enough to be character (hair, clothing, shadow)
        };

        let pixelsChanged = 0;

        // Pass 1: Aggressive removal based on brightness and color
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                const avg = (r + g + b) / 3;
                const colorVariance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);

                // Target light pixels (potential background)
                const isLight = avg > 200;
                const isNeutral = colorVariance < 40;

                // Also check for pre-existing alpha
                const hasLowAlpha = a < 255;

                if ((isLight && isNeutral) || hasLowAlpha) {
                    // Check if pixel is adjacent to dark pixels (character edge)
                    const neighbors = [
                        getPixel(x - 1, y), getPixel(x + 1, y),
                        getPixel(x, y - 1), getPixel(x, y + 1),
                        getPixel(x - 1, y - 1), getPixel(x + 1, y - 1),
                        getPixel(x - 1, y + 1), getPixel(x + 1, y + 1)
                    ];

                    const hasDarkNeighbor = neighbors.some(isDarkPixel);

                    if (!hasDarkNeighbor) {
                        // Safe to make transparent - not near character edge
                        data[i + 3] = 0;
                        pixelsChanged++;
                    } else if (avg > 230) {
                        // Very light pixel even near edge - likely antialiasing artifact
                        data[i + 3] = 0;
                        pixelsChanged++;
                    } else {
                        // On character edge - preserve but reduce alpha for smooth edge
                        const alphaMult = Math.max(0, 1 - (avg - 180) / 50);
                        data[i + 3] = Math.floor(255 * alphaMult);
                        if (data[i + 3] !== a) pixelsChanged++;
                    }
                }
            }
        }

        console.log(`Modified ${pixelsChanged} pixels`);

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
        console.log('✓ Background removed with edge preservation!');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

aggressiveBackgroundRemoval();
