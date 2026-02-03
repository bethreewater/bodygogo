import { useState, useEffect } from 'react';

/**
 * Loads an image, removes the specified "key color", and returns a Blob URL of the transparent image.
 */
export function useChromaKey(src: string, keyColor: { r: number, g: number, b: number } = { r: 0, g: 255, b: 0 }) {
    const [processedSrc, setProcessedSrc] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;

        img.onload = () => {
            if (!active) return;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Chroma Key Logic
            // Tolerance to handle slight compression artifacts
            const tolerance = 60;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Dynamic Key Color Distance Check
                // Dist^2 = (r-keyR)^2 + (g-keyG)^2 + (b-keyB)^2
                const dist = Math.sqrt(
                    Math.pow(r - keyColor.r, 2) +
                    Math.pow(g - keyColor.g, 2) +
                    Math.pow(b - keyColor.b, 2)
                );

                // Special handling for White Backgrounds (Common in gen AI)
                // If key is WHITE (255,255,255)
                if (keyColor.r > 240 && keyColor.g > 240 && keyColor.b > 240) {
                    // Smart "White/Gray" Removal
                    // 1. Brightness check (Must be bright)
                    if (r > 210 && g > 210 && b > 210) {
                        // 2. Saturation check (Must be neutral/gray)
                        // Skin usually has higher R than B. Gray has R~G~B.
                        const maxVal = Math.max(r, g, b);
                        const minVal = Math.min(r, g, b);
                        const diff = maxVal - minVal;

                        // If it's bright AND has low saturation (difference between channels is small)
                        // It's likely background artifact, not skin.
                        if (diff < 20) {
                            data[i + 3] = 0;
                        }
                    }
                }
                // Default Color Keying (for Green Screen)
                else {
                    if (dist < tolerance) {
                        data[i + 3] = 0;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);

            canvas.toBlob((blob) => {
                if (blob && active) {
                    const url = URL.createObjectURL(blob);
                    setProcessedSrc(url);
                }
            });
        };

        return () => {
            active = false;
        };
    }, [src, keyColor.r, keyColor.g, keyColor.b]);

    return processedSrc;
}
