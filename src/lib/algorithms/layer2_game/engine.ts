import { GameState, QuestResult } from '../../core/types';

/**
 * Layer 2: Game State Engine
 * Computes NEW GameState based on History + Today's Quests.
 */

export function computeNextGameState(
    previousState: GameState,
    todaysQuests: QuestResult[],
    date: string
): GameState {

    // 1. Streak Logic
    // Definition: If any 'checkin_relevant' quest is completed, streak + 1.
    // For now, let's assume ALL quests are relevant (simplification).
    const anyQuestCompleted = todaysQuests.some(q => q.status === 'completed');

    let newStreak = previousState.streak_current;

    // Note: True streak logic requires knowing if we missed *yesterday*.
    // For this "Daily Calculation", we assume we are running this at the end of the day 
    // OR we are previewing what the state WOULD be.

    // Simplification for the View Model:
    // If we already have a streak from yesterday, and we did a quest today, show (Streak + 1).
    // If we didn't do a quest today, show (Streak) [but Pending].

    // However, the `GameState` type implies *settled* state.
    // Let's implement a "preview" logic or "settlement" logic.
    // Here we implement the strict State Transition: S_t = f(S_t-1, Action_t)

    if (anyQuestCompleted) {
        // Quest completed: increment streak
        newStreak = previousState.streak_current + 1;
    } else {
        // FIX: No quest completed → reset streak to 0
        // Future enhancement: Use streak freeze if available
        newStreak = 0;
    }

    // 2. XP Logic
    // FIX: Use actual quest rewards instead of fixed 100 XP
    const xpGained = todaysQuests
        .filter(q => q.status === 'completed')
        .reduce((sum, q) => sum + q.xp_reward, 0);

    let newXp = previousState.xp_current + xpGained;
    let newLevel = previousState.level;
    let newNextXp = previousState.xp_next_level;

    // Level Up Logic
    while (newXp >= newNextXp) {
        newXp -= newNextXp;
        newLevel += 1;
        newNextXp = Math.floor(newNextXp * 1.2); // +20% harder each level
    }

    return {
        uid: previousState.uid,
        date: date,
        streak_current: newStreak,
        streak_freeze_available: previousState.streak_freeze_available,
        level: newLevel,
        xp_current: newXp,
        xp_next_level: newNextXp
    };
}
