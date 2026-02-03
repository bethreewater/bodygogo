import { describe, it, expect } from 'vitest';
import { computeNextGameState } from '../layer2_game/engine';
import type { GameState, QuestResult } from '../../core/types';

describe('Layer 2: Game State Engine', () => {
    const baseState: GameState = {
        uid: 'u1',
        date: '2026-02-01',
        streak_current: 5,
        streak_freeze_available: 1,
        level: 1,
        xp_current: 20,
        xp_next_level: 100
    };

    const completedQuest = (xp_reward: number): QuestResult => ({
        id: 'q_any',
        title: 'Any Quest',
        status: 'completed',
        xp_reward,
        icon: '✅'
    });

    const availableQuest: QuestResult = {
        id: 'q_any',
        title: 'Any Quest',
        status: 'available',
        xp_reward: 50,
        icon: '✅'
    };

    it('should increment streak when any quest is completed', () => {
        const next = computeNextGameState(baseState, [completedQuest(10)], '2026-02-02');
        expect(next.streak_current).toBe(6);
    });

    it('should reset streak to 0 when no quest is completed', () => {
        const next = computeNextGameState(baseState, [availableQuest], '2026-02-02');
        expect(next.streak_current).toBe(0);
    });

    it('should add XP from completed quests', () => {
        const next = computeNextGameState(baseState, [completedQuest(30), completedQuest(40)], '2026-02-02');
        expect(next.xp_current).toBe(90);
        expect(next.level).toBe(1);
        expect(next.xp_next_level).toBe(100);
    });

    it('should level up when XP crosses next level threshold', () => {
        const nearLevelUp: GameState = { ...baseState, xp_current: 90, xp_next_level: 100 };
        const next = computeNextGameState(nearLevelUp, [completedQuest(20)], '2026-02-02');
        expect(next.level).toBe(2);
        expect(next.xp_current).toBe(10);
        expect(next.xp_next_level).toBe(120);
    });
});
