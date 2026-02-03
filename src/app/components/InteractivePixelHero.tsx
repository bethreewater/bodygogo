'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { PixelHeroSprite } from './PixelHeroSprite';

import { useWorldState } from '@/hooks/useWorldState';
import { BodyLog, FoodLog, WorkoutLog } from '@/lib/core/types';

interface InteractivePixelHeroProps {
    metrics: {
        calories_net: number;
        calories_out: number;
        streak: number;
        // v2: Added for persistent bubbles
        calories_in: number;
        weight?: number | null;
        body_fat?: number | null; // Added
        macros?: { // Added
            protein: number;
            fat: number;
            carbs: number;
        };
    };
    logs: {
        body: BodyLog[];
        food: FoodLog[];
        workout: WorkoutLog[];
    };
    targets: {
        calories_intake: number;
        calories_out: number;
    };
    questCompletion: number;
    isSetupAvailable?: boolean;
    onSetupClick?: () => void;
}

export function InteractivePixelHero({ metrics, logs, targets, questCompletion, isSetupAvailable, onSetupClick }: InteractivePixelHeroProps) {
    // World State Logic
    const { lightLevel, warmth, cleanliness } = useWorldState({ metrics, targets, questCompletion });

    // --- TILE MAP CONFIG ---
    const GRID_COLS = 16;
    const GRID_ROWS = 16;
    const TILE_W = 100 / GRID_COLS;
    const TILE_H = 100 / GRID_ROWS;

    type Tile = { x: number; y: number };

    const [tilePos, setTilePos] = useState<Tile>({ x: 8, y: 9 });
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [isMoving, setIsMoving] = useState(false);
    const [walkPath, setWalkPath] = useState<Tile[]>([]);

    const interactionSpots = useMemo(() => ([
        { id: 'fridge', tile: { x: 12, y: 9 }, action: 'eat' as const },
        { id: 'workout', tile: { x: 9, y: 12 }, action: 'yoga' as const },
        { id: 'scale', tile: { x: 6, y: 8 }, action: 'work' as const },
        { id: 'trophy', tile: { x: 6, y: 3 }, action: 'work' as const }
    ]), []);

    const blockedMap = useMemo(() => {
        const grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false));
        const blockRect = (x1: number, y1: number, x2: number, y2: number) => {
            for (let y = y1; y <= y2; y++) {
                for (let x = x1; x <= x2; x++) {
                    if (x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS) {
                        grid[y][x] = true;
                    }
                }
            }
        };

        // Walls
        blockRect(0, 0, GRID_COLS - 1, 0);
        blockRect(0, GRID_ROWS - 1, GRID_COLS - 1, GRID_ROWS - 1);
        blockRect(0, 0, 0, GRID_ROWS - 1);
        blockRect(GRID_COLS - 1, 0, GRID_COLS - 1, GRID_ROWS - 1);

        // Desk / shelves (left)
        blockRect(1, 5, 5, 9);
        blockRect(1, 1, 7, 3);

        // Trophy shelf (top middle-left)
        blockRect(6, 1, 10, 3);

        // Plants (bottom left)
        blockRect(1, 12, 5, 15);

        // Mat / weights (center-bottom)
        blockRect(7, 11, 10, 13);
        blockRect(11, 12, 12, 13);

        // Fridge (right)
        blockRect(12, 7, 15, 11);

        // Window / door area (top right)
        blockRect(11, 1, 15, 4);

        // Ensure interaction tiles are walkable
        interactionSpots.forEach((s) => {
            grid[s.tile.y][s.tile.x] = false;
        });

        return grid;
    }, [interactionSpots]);

    const walkableTiles = useMemo(() => {
        const tiles: Tile[] = [];
        for (let y = 0; y < GRID_ROWS; y++) {
            for (let x = 0; x < GRID_COLS; x++) {
                if (!blockedMap[y][x]) tiles.push({ x, y });
            }
        }
        return tiles;
    }, [blockedMap]);

    const isWalkable = useCallback((x: number, y: number) => {
        if (x < 0 || y < 0 || x >= GRID_COLS || y >= GRID_ROWS) return false;
        return !blockedMap[y][x];
    }, [blockedMap]);

    const findPath = useCallback((start: Tile, goal: Tile): Tile[] => {
        const key = (t: Tile) => `${t.x},${t.y}`;
        const queue: Tile[] = [start];
        const visited = new Set<string>([key(start)]);
        const prev = new Map<string, Tile>();

        while (queue.length) {
            const cur = queue.shift()!;
            if (cur.x === goal.x && cur.y === goal.y) break;
            const neighbors = [
                { x: cur.x + 1, y: cur.y },
                { x: cur.x - 1, y: cur.y },
                { x: cur.x, y: cur.y + 1 },
                { x: cur.x, y: cur.y - 1 }
            ];
            for (const n of neighbors) {
                const k = key(n);
                if (!visited.has(k) && isWalkable(n.x, n.y)) {
                    visited.add(k);
                    prev.set(k, cur);
                    queue.push(n);
                }
            }
        }

        const goalKey = key(goal);
        if (!visited.has(goalKey)) return [];

        const path: Tile[] = [];
        let cur: Tile | undefined = goal;
        while (cur && !(cur.x === start.x && cur.y === start.y)) {
            path.push(cur);
            cur = prev.get(key(cur));
        }
        return path.reverse();
    }, [isWalkable]);

    useEffect(() => {
        if (walkPath.length === 0) {
            setIsMoving(false);
            return;
        }
        setIsMoving(true);
        const next = walkPath[0];
        if (next.x < tilePos.x) setDirection('left');
        if (next.x > tilePos.x) setDirection('right');

        const timer = setTimeout(() => {
            setTilePos(next);
            setWalkPath((prev) => prev.slice(1));
        }, 320);
        return () => clearTimeout(timer);
    }, [walkPath, tilePos]);

    useEffect(() => {
        if (walkPath.length > 0 || isMoving) return;

        const idleDelay = 1200 + Math.random() * 1800;
        const timer = setTimeout(() => {
            const goToAction = Math.random() < 0.35;
            let target: Tile;
            if (goToAction) {
                const spot = interactionSpots[Math.floor(Math.random() * interactionSpots.length)];
                target = spot.tile;
            } else {
                target = walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
            }

            const path = findPath(tilePos, target);
            if (path.length > 0) setWalkPath(path);
        }, idleDelay);

        return () => clearTimeout(timer);
    }, [walkPath.length, isMoving, tilePos, walkableTiles, findPath, interactionSpots]);


    // Auto-walk on phase change (Optional, keeping simple for now)
    // You can re-enable this if you want the character to move automatically based on vitality
    /*
    useEffect(() => {
         // ... existing auto-walk logic ...
    }, [currentPhase]);
    */

    // --- ICONS (Simple Inline SVGs) ---
    const Icons = {
        Food: () => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f87171' }}>
                <path d="M18 8c0 4.5-3.5 8-8 8s-8-3.5-8-8c0-4.5 3.5-8 8-8s8 3.5 8 8zm0 0l3-3m-3 3l-3 3" />
                <path d="M22 6L18 8" />
            </svg>
        ),
        Fire: () => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fb923c' }}>
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3z" />
            </svg>
        ),
        Scale: () => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
                <rect x="2" y="10" width="20" height="12" rx="2" />
                <path d="M12 2v8" />
                <path d="M4 10h16" />
                <path d="M12 14v.01" />
            </svg>
        ),
        Trophy: () => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f59e0b' }}>
                <path d="M8 21h8" />
                <path d="M12 17v4" />
                <path d="M7 4h10v3a5 5 0 0 1-10 0V4z" />
                <path d="M4 5h3v2a3 3 0 0 1-3 3" />
                <path d="M20 5h-3v2a3 3 0 0 0 3 3" />
            </svg>
        ),
        Arrow: () => (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        )
    };

    const [expandedBubble, setExpandedBubble] = useState<string | null>(null);

    // --- FINALIZED POSITIONS ---
    // User Confirmed: Food T:46 L:91 | Workout T:52 L:63 | Scale T:47 L:37

    // --- BUBBLE COMPONENT ---
    const PersistentBubble = ({
        id,
        icon: Icon,
        label,
        value,
        unit,
        details,
        top,
        left
    }: {
        id: string,
        icon: React.FC,
        label: string,
        value?: number | string | null,
        unit?: string,
        details?: React.ReactNode,
        top: string,
        left: string
    }) => {
        const isExpanded = expandedBubble === id;
        const displayValue = value ?? '--';

        const handleInteraction = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!isExpanded) setExpandedBubble(id);
        };

        // Close when clicking outside
        useEffect(() => {
            const close = () => setExpandedBubble(null);
            if (isExpanded) {
                window.addEventListener('click', close);
                return () => window.removeEventListener('click', close);
            }
        }, [isExpanded]);

        return (
            <div
                style={{
                    position: 'absolute',
                    top, left,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isExpanded ? 50 : 35,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                onClick={handleInteraction}
            >
                {/* The Bubble */}
                {/* The Bubble */}
                {/* The Bubble */}
                {/* The Bubble */}
                {/* The Bubble */}
                {/* The Bubble */}
                <div style={{
                    // PIXEL ART SPEECH BUBBLE STYLE - MICRO V6
                    background: 'rgba(255, 255, 255, 0.2)', // 20% opacity
                    backdropFilter: 'blur(0px)', // Remove blur for crisp pixel look or keep? User wants transparent.
                    border: '1px solid black', // Solid black border for visibility
                    boxShadow: '1px 1px 0px rgba(0,0,0,0.5)', // Sharp shadow

                    borderRadius: '4px',
                    padding: isExpanded ? '6px 8px' : '1px 3px', // MICRO PADDING
                    width: 'fit-content',
                    maxWidth: 'fit-content',
                    minWidth: 'auto', // REMOVE 110px. Let it shrink to content.
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isExpanded ? '4px' : '0px',
                    transition: 'transform 0.1s steps(2)', // Snappy pixel transition
                    transform: isExpanded ? 'scale(1)' : 'scale(1)',
                }}>
                    {/* Header: Icon + Value (ROW LAYOUT) */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px', justifyContent: isExpanded ? 'space-between' : 'center' }}>{/* Removed width:100% */}
                        {/* Icon */}
                        <div style={{
                            background: isExpanded ? 'rgba(0,0,0,0.05)' : 'transparent',
                            padding: isExpanded ? '3px' : '0px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <div style={{ transform: isExpanded ? 'scale(0.8)' : 'scale(0.65)' }}>{/* Micro Icon */}
                                <Icon />
                            </div>
                        </div>

                        {/* Text Group */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isExpanded ? 'flex-end' : 'flex-start', lineHeight: 1 }}>
                            <span style={{ fontSize: '0.45rem', fontWeight: 700, color: '#1f2937', marginBottom: '0px', display: isExpanded ? 'block' : 'none', letterSpacing: '-0.3px' }}>
                                {label}
                            </span>

                            <span style={{ fontSize: isExpanded ? '0.7rem' : '0.6rem', fontWeight: 900, color: 'black', display: 'flex', alignItems: 'baseline', gap: '0px', textShadow: '0px 0px 8px rgba(255,255,255,0.8)' }}>
                                {displayValue} <span style={{ fontSize: '0.45rem', fontWeight: 700, color: '#374151', marginLeft: '1px' }}>{unit}</span>
                            </span>
                        </div>
                    </div>

                    {/* Detailed Expanded Content */}
                    <div style={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                        width: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        alignItems: 'center'
                    }}>
                        {/* Divider */}
                        <div style={{ width: '100%', height: '1px', background: 'black', opacity: 0.1, marginBottom: '2px' }} />

                        <div style={{ width: '100%' }}>
                            {details}
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    // Helper for Macro Row
    const MacroRow = ({ label, val, color }: { label: string, val: number, color: string }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', width: '100%' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontWeight: 600, color }}>{val}g</span>
        </div>
    );

    const foodItems = logs.food.slice(0, 3);
    const workoutItems = logs.workout.slice(0, 3);

    const characterLeft = `${(tilePos.x + 0.5) * TILE_W}%`;
    const characterTop = `${(tilePos.y + 0.5) * TILE_H}%`;

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#FDFCF8',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
            }}
            onClick={() => {
                // Background click closes
            }}
        >
            <Image
                src="/pixel_room_v2.png"
                alt="Cozy Gym Room"
                fill
                style={{ objectFit: 'contain' }}
                priority
            />

            {/* DEBUG OVERLAY */}
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 100, fontSize: '10px', color: 'red', pointerEvents: 'none', opacity: 0 }}>
                Setup: {isSetupAvailable ? 'TRUE' : 'FALSE'}
            </div>

            {/* CHARACTER - Frame-by-Frame Animation */}
            <div style={{
                position: 'absolute',
                left: characterLeft,
                top: characterTop,
                transform: `translate(-50%, -50%)`,
                width: '92px',    // tuned for PXgirl (bigger)
                height: '184px',
                zIndex: 25,
                pointerEvents: 'none',
                transition: 'left 0.32s ease-in-out, top 0.32s ease-in-out',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    animation: isMoving
                        ? 'walkBob 0.6s ease-in-out infinite'
                        : 'breathe 6s ease-in-out infinite',
                    transformOrigin: 'bottom center'
                }}>
                    {/* PixelHeroSprite Component - Dynamic Idle/Walk */}
                    <PixelHeroSprite
                        action={isMoving ? 'walk' : 'idle'}
                        direction={direction}
                        isMoving={isMoving}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </div>
            </div>

            {/* --- PERSISTENT BUBBLES --- */}

            {/* 1. FRIDGE (Food) */}
            <PersistentBubble
                id="food"
                icon={Icons.Food}
                value={metrics.calories_in}
                unit="kcal"
                label="今日攝取"
                top="46%"
                left="91%"
                details={
                    <div className="flex flex-col gap-2 w-full pt-1">
                        {metrics.macros ? (
                            <>
                                <MacroRow label="蛋白質" val={metrics.macros.protein} color="#ef4444" />
                                <MacroRow label="碳水" val={metrics.macros.carbs} color="#f59e0b" />
                                <MacroRow label="脂肪" val={metrics.macros.fat} color="#3b82f6" />
                            </>
                        ) : (
                            <span className="text-xs text-stone-400">尚未記錄營養素</span>
                        )}
                        <div style={{ width: '100%', height: '1px', background: 'black', opacity: 0.1 }} />
                        {foodItems.length > 0 ? (
                            <div className="flex flex-col gap-1 w-full">
                                {foodItems.map((item, idx) => (
                                    <div key={`${item.name}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                                        <span style={{ fontWeight: 600 }}>{item.calories} kcal</span>
                                    </div>
                                ))}
                                {logs.food.length > foodItems.length && (
                                    <span className="text-[0.6rem]" style={{ color: 'var(--text-tertiary)' }}>
                                        另有 {logs.food.length - foodItems.length} 筆
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-xs text-stone-400">今日尚未記錄飲食</span>
                        )}
                    </div>
                }
            />

            {/* 2. MAT (Workout) */}
            <PersistentBubble
                id="workout"
                icon={Icons.Fire}
                value={metrics.calories_out}
                unit="kcal"
                label="運動消耗"
                top="52%"
                left="63%"
                details={
                    <div className="flex flex-col gap-2 w-full pt-1">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>活躍時間</span>
                            <span style={{ fontWeight: 600 }}>{Math.round((metrics.calories_out || 0) / 8)} min</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>強度</span>
                            <span style={{ fontWeight: 600, color: '#f59e0b' }}>中等</span>
                        </div>
                        <div style={{ width: '100%', height: '1px', background: 'black', opacity: 0.1 }} />
                        {workoutItems.length > 0 ? (
                            <div className="flex flex-col gap-1 w-full">
                                {workoutItems.map((item, idx) => (
                                    <div key={`${item.type}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>{item.type}</span>
                                        <span style={{ fontWeight: 600 }}>{item.duration_minutes} min</span>
                                    </div>
                                ))}
                                {logs.workout.length > workoutItems.length && (
                                    <span className="text-[0.6rem]" style={{ color: 'var(--text-tertiary)' }}>
                                        另有 {logs.workout.length - workoutItems.length} 筆
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-xs text-stone-400">今日尚未記錄運動</span>
                        )}
                    </div>
                }
            />

            {/* 3. SCALE (Weight) */}
            <PersistentBubble
                id="scale"
                icon={Icons.Scale}
                value={metrics.weight}
                unit="kg"
                label="今日體重"
                top="47%"
                left="37%"
                details={
                    <div className="flex flex-col gap-1 w-full pt-1">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>體脂率</span>
                            <span style={{ fontWeight: 600 }}>{metrics.body_fat ? `${metrics.body_fat}%` : '--'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>BMI</span>
                            <span style={{ fontWeight: 600 }}>--</span>
                        </div>
                    </div>
                }
            />

            {/* 4. TROPHY (Streak) */}
            <PersistentBubble
                id="trophy"
                icon={Icons.Trophy}
                value={metrics.streak}
                unit="天"
                label="連續記錄"
                top="18%"
                left="30%"
                details={
                    <div className="flex flex-col gap-1 w-full pt-1">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>連續天數</span>
                            <span style={{ fontWeight: 600 }}>{metrics.streak} 天</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>狀態</span>
                            <span style={{ fontWeight: 600, color: metrics.streak >= 7 ? '#f59e0b' : 'var(--text-secondary)' }}>
                                {metrics.streak >= 30 ? '🔥 長期連勝' : metrics.streak >= 7 ? '✨ 穩定連勝' : '🌱 起步中'}
                            </span>
                        </div>
                    </div>
                }
            />

            <style jsx>{`
                @keyframes breathe {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.02) translateY(-1%); }
                }
                @keyframes walkBob {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-2px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes idleShift {
                    0%, 45%, 55%, 100% { transform: rotate(0deg) skewX(0deg); }
                    50% { transform: rotate(1deg) skewX(0.5deg); }
                }
                @keyframes ambientWalkCycle {
                     0% { transform: rotate(-2deg) translateY(0); }
                     25% { transform: rotate(0deg) translateY(-2px); }
                     50% { transform: rotate(2deg) translateY(0); }
                     75% { transform: rotate(0deg) translateY(-2px); }
                     100% { transform: rotate(-2deg) translateY(0); }
                }
            `}</style>

            {/* ... Environmental Effects ... */}
            {cleanliness !== 'clean' && (
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
                    background: 'url(/textures/grain.png)',
                    backgroundSize: 'cover',
                    opacity: cleanliness === 'messy' ? 0.4 : 0.2,
                    filter: 'contrast(1.2)'
                }} >
                    <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }}>
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#noise)" />
                    </svg>
                </div>
            )}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20,
                backgroundColor: `rgba(0,0,50, ${Math.max(0, (1 - lightLevel) * 0.2)})`,
                mixBlendMode: 'multiply',
                transition: 'background-color 1s ease'
            }} />
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 21,
                background: `linear-gradient(135deg, 
                    rgba(255,200,0,${warmth * 0.2}) 0%, 
                    rgba(255,100,0,${warmth * 0.1}) 100%)`,
                mixBlendMode: 'overlay',
                transition: 'opacity 1s ease'
            }} />

            {/* SETUP PROFILE COMPUTER BUBBLE */}
            {isSetupAvailable && (
                <div
                    style={{
                        position: 'absolute',
                        top: '45%',
                        left: '18%',
                        width: '25%',
                        height: '25%',
                        cursor: 'pointer',
                        zIndex: 50,
                    }}
                    onClick={onSetupClick}
                >
                    <div className="pixel-bubble">
                        <span>👋 按此建立檔案</span>
                        <div className="pixel-arrow" />
                    </div>
                </div>
            )}
            <style jsx>{`
                .pixel-bubble {
                    position: absolute;
                    bottom: 100%; left: 50%;
                    transform: translateX(-50%);
                    background: #fff;
                    border: 2px solid #000;
                    padding: 8px 12px;
                    border-radius: 8px;
                    white-space: nowrap;
                    font-weight: 700;
                    font-size: 0.9rem;
                    box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
                    animation: floatBubble 2s ease-in-out infinite;
                }
                .pixel-arrow {
                    position: absolute;
                    top: 100%; left: 50%;
                    transform: translateX(-50%);
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 6px solid #000;
                }
                @keyframes floatBubble {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-5px); }
                }
            `}</style>
        </div>
    );
}
