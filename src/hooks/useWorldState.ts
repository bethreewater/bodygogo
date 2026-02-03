
import { useMemo } from 'react';

export interface WorldState {
    lightLevel: number;   // 0.3 (Dim) -> 1.0 (Bright)
    warmth: number;       // 0.0 (Cold) -> 1.0 (Warm/Golden)
    vitality: number;     // 0.0 (Still) -> 1.0 (Active/Particles)
    cleanliness: 'clean' | 'dusty' | 'messy';
}

interface UseWorldStateProps {
    metrics: {
        calories_net: number;
        calories_in: number;
        calories_out: number;
        streak: number;
    };
    targets: {
        calories_intake: number;
        calories_out: number;
    };
    questCompletion: number; // 0.0 - 1.0
}

export function useWorldState({ metrics, targets, questCompletion }: UseWorldStateProps): WorldState {
    return useMemo(() => {
        // 1. Light Level (Based on Intake vs Target)
        const intakeRatio = targets.calories_intake > 0 ? (metrics.calories_in || 0) / targets.calories_intake : 0;

        // Clamp 0.6 start (soft morning light) to 1.1 (bright sun)
        let lightLevel = 0.6 + (intakeRatio * 0.5);
        if (lightLevel > 1.1) lightLevel = 1.1;

        // 2. Warmth (Based on Streak)
        // 0 days = 0 (Cold Blue)
        // 7 days = 1 (Warm Golden)
        const warmth = Math.min(metrics.streak, 7) / 7;

        // 3. Vitality (Based on Activity vs Target)
        const activityRatio = targets.calories_out > 0 ? metrics.calories_out / targets.calories_out : 0;
        const vitality = Math.min(activityRatio, 1.0);

        // 4. Cleanliness (Based on Quest Completion)
        let cleanliness: WorldState['cleanliness'] = 'messy';
        if (questCompletion >= 0.8) cleanliness = 'clean';
        else if (questCompletion >= 0.4) cleanliness = 'dusty';

        return {
            lightLevel,
            warmth,
            vitality,
            cleanliness
        };
    }, [metrics, targets, questCompletion]);
}
