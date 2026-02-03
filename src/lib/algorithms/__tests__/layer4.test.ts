import { describe, it, expect } from 'vitest';
import { toFeedItem } from '../layer4_visibility/filter';
import type { DailyMetrics, GameState, UserProfile } from '../../core/types';

describe('Layer 4: Visibility Filter', () => {
    const profile: UserProfile = {
        uid: 'abcd1234',
        height_cm: 170,
        birth_date: '1990-01-01',
        sex: 'male',
        activity_level: 'sedentary',
        avatar_config: { type: 'preset', value: 'hero' }
    };

    const state: GameState = {
        uid: 'abcd1234',
        date: '2026-02-02',
        streak_current: 0,
        streak_freeze_available: 0,
        level: 3,
        xp_current: 20,
        xp_next_level: 100
    };

    const metrics: DailyMetrics = {
        weight_kg: 70,
        bmr: 1600,
        calories_in: 1800,
        calories_out: 0,
        net_calories: 1800,
        quest_completion: 0,
        checkin_done: false,
        streak_days: 0
    };

    it('should generate a nickname from UID and include avatar config', () => {
        const item = toFeedItem(profile, state, metrics);
        expect(item?.nickname).toBe('User ABCD');
        expect(item?.avatar_config?.value).toBe('hero');
    });

    it('should map low activity + no streak to low vitality and none aura', () => {
        const item = toFeedItem(profile, { ...state, streak_current: 0 }, { ...metrics, calories_out: 0 });
        expect(item?.semantics.vitality_phase).toBe('low');
        expect(item?.semantics.streak_aura).toBe('none');
    });

    it('should map long streak + high activity to high vitality and fire aura', () => {
        const item = toFeedItem(
            profile,
            { ...state, streak_current: 10 },
            { ...metrics, calories_out: 450, net_calories: 1000 }
        );
        expect(item?.semantics.vitality_phase).toBe('high');
        expect(item?.semantics.streak_aura).toBe('fire');
    });

    it('should prioritize exercising when calories_out is high', () => {
        const item = toFeedItem(
            profile,
            state,
            { ...metrics, calories_out: 500, net_calories: 3000 }
        );
        expect(item?.semantics.action_hint).toBe('exercising');
    });
});
