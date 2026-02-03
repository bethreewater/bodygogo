'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';

// Pseudo-walk frames generated from PXgirl.png
const SPRITE_CONFIG = {
    fps: 8
};

interface PixelHeroSpriteProps {
    action: 'idle' | 'walk';
    direction: 'left' | 'right';
    isMoving: boolean;
    className?: string;
    style?: React.CSSProperties;
}


export function PixelHeroSprite({
    direction = 'right',
    isMoving = false,
    style,
    className
}: PixelHeroSpriteProps) {
    const BASE = '/sprites/PXgirl_walk';
    const idleFrames = [`${BASE}/idle_0.png`];
    const walkFrames = Array.from({ length: 4 }, (_, i) => `${BASE}/walk_${i}.png`);
    const frames = isMoving ? walkFrames : idleFrames;

    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        let lastTime = 0;
        let raf: number;
        const interval = 1000 / SPRITE_CONFIG.fps;

        const loop = (t: number) => {
            if (!lastTime) lastTime = t;
            const delta = t - lastTime;
            if (delta > interval) {
                if (isMoving) {
                    setFrameIndex((prev) => (prev + 1) % walkFrames.length);
                } else {
                    setFrameIndex(0);
                }
                lastTime = t;
            }
            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [isMoving, walkFrames.length]);

    return (
        <div
            className={className}
            style={{
                ...style,
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <img
                src={frames[frameIndex]}
                alt=""
                draggable={false}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
                    userSelect: 'none'
                }}
            />
        </div>
    );
}
