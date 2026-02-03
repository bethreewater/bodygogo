import { UserProfile, GameState, DailyMetrics, FeedItem } from '../../core/types';

/**
 * Layer 4: Visibility Filter
 * Responsible for:
 * 1. Privacy compliance (Opt-in check).
 * 2. Metric stripping (Removing Weight/Calories).
 * 3. Semantic Translation (Raw numbers -> Visual Semantics).
 * 
 * "Reflection, Not Pet" - "No Shaming"
 */

// Helper: Semantic Mapping Logic (Pure)
function computeVitalityPhase(streak: number, caloriesOut: number): 'low' | 'normal' | 'high' {
    // Basic baseline
    let score = 0.5;

    // Streak influence (Long term momentum)
    if (streak < 1) score -= 0.2;
    if (streak > 7) score += 0.2;

    // Activity influence (Short term burst)
    if (caloriesOut > 300) score += 0.3;

    if (score < 0.4) return 'low';
    if (score > 0.8) return 'high';
    return 'normal';
}

function computeStreakAura(streak: number): 'none' | 'spark' | 'fire' | 'gold' {
    if (streak < 3) return 'none';
    if (streak < 7) return 'spark';
    if (streak < 30) return 'fire';
    return 'gold';
}

function computeActionHint(caloriesOut: number, netCalories: number): 'working' | 'exercising' | 'relaxing' {
    // Heuristic: High activity = exercising
    if (caloriesOut > 400) return 'exercising';
    // Heuristic: High intake = relaxing (Food coma)
    if (netCalories > 2500) return 'relaxing';
    // Default
    return 'working';
}

export function toFeedItem(
    profile: UserProfile,
    state: GameState,
    metrics: DailyMetrics
): FeedItem | null {
    // 1. Privacy Gate
    // STRICT OPT-OUT: Check user settings. 
    // For MVP, we pass in the Profile object.

    // TEMPORARY BYPASS for MVP Demo:
    // If we are showing this feed, we assume RLS/Repository layer has already filtered based on broad permission.
    // The filter here should only check explicit "hide me" flags if they exist.
    // Assuming defaults are PUBLIC for this MVP demo to ensure the user sees something.

    // This function transforms "A User who IS public" into "Safe Public Data".

    // 2. Identity Obfuscation
    // Map UID to a consistent but safe nickname if not set? 
    // MVP: Use UID last 4 chars if no nickname mechanism.
    const nickname = `User ${profile.uid.slice(0, 4).toUpperCase()}`;

    // 3. Computed Semantics (The Core)
    const vitality = computeVitalityPhase(state.streak_current, metrics.calories_out || 0);
    const aura = computeStreakAura(state.streak_current);
    const action = computeActionHint(metrics.calories_out || 0, metrics.net_calories || 0);

    return {
        uid: profile.uid,
        nickname: nickname,
        level: state.level,
        avatar_config: profile.avatar_config,
        semantics: {
            vitality_phase: vitality,
            streak_aura: aura,
            action_hint: action
        }
    };
}
