import { describe, it, expect } from 'vitest';
import { evaluateDailyQuests } from '../layer1_quest/evaluator';
import { DailyMetrics } from '@/lib/core/types';

describe('Layer 1: Quest Evaluation', () => {

    // Test Metrics Shim
    const baseMetrics: DailyMetrics = {
        weight_kg: 70,
        bmr: 1500,
        calories_in: 0,
        calories_out: 0,
        net_calories: 0,
        quest_completion: 0,
        checkin_done: false,
        streak_days: 0
    };

    it('should calculate "Log Meals" progress correctly (Partial)', () => {
        const input = { ...baseMetrics, calories_in: 1000 };
        // Target 2000
        const results = evaluateDailyQuests(input, '2025-01-01');
        const quest = results.find(q => q.id === 'q_log_food');

        expect(quest).toBeDefined();
        expect(quest?.status).toBe('completed');
    });

    it('should complete "Log Meals" when target reached', () => {
        const input = { ...baseMetrics, calories_in: 2500 };
        const results = evaluateDailyQuests(input, '2025-01-01');
        const quest = results.find(q => q.id === 'q_log_food');

        expect(quest?.status).toBe('completed');
    });

    it('should handle "Deficit" quest correctly', () => {
        // net < bmr = deficit
        const deficitInput = { ...baseMetrics, net_calories: 1400, bmr: 1500 };
        const results = evaluateDailyQuests(deficitInput, '2025-01-01');
        const quest = results.find(q => q.id === 'q_goal_target');

        expect(quest?.status).toBe('completed');
    });
});
