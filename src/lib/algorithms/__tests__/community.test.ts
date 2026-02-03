import { describe, it, expect, vi } from 'vitest';
import { getCommunityFeed } from '../community';
import type { DailyMetrics, GameState, PublicProfile } from '../../core/types';

vi.mock('../../data/supabase-repository', () => ({
    getCommunityFeedData: vi.fn()
}));

const { getCommunityFeedData } = await import('../../data/supabase-repository');
const mockedGetCommunityFeedData = vi.mocked(getCommunityFeedData);

describe('Community Feed', () => {
    const baseState: GameState = {
        uid: 'u1',
        date: '2026-02-02',
        streak_current: 3,
        streak_freeze_available: 0,
        level: 2,
        xp_current: 20,
        xp_next_level: 100
    };

    const baseMetrics: DailyMetrics = {
        weight_kg: null,
        bmr: null,
        calories_in: 800,
        calories_out: 200,
        net_calories: 600,
        macros: { protein: 0, fat: 0, carbs: 0 },
        quest_completion: 0.5,
        checkin_done: true,
        streak_days: 3
    };

    it('should exclude non-public profiles (default deny)', async () => {
        const publicProfile: PublicProfile = {
            uid: 'pub_1',
            username: 'User PUB1',
            level: 2,
            streak: 3,
            privacy: 'public'
        };
        const privateProfile: PublicProfile = {
            uid: 'pri_1',
            username: 'User PRI1',
            level: 2,
            streak: 3,
            privacy: 'private'
        };

        mockedGetCommunityFeedData.mockResolvedValue([
            { profile: publicProfile, state: { ...baseState, uid: publicProfile.uid }, metrics: baseMetrics },
            { profile: privateProfile, state: { ...baseState, uid: privateProfile.uid }, metrics: baseMetrics }
        ]);

        const items = await getCommunityFeed();
        expect(items.length).toBe(1);
        expect(items[0].uid).toBe(publicProfile.uid);
        expect(items[0].privacy).toBe('public');
    });

    it('should exclude profiles with missing privacy', async () => {
        const missingPrivacy: PublicProfile = {
            uid: 'no_priv',
            username: 'User NOPR',
            level: 1,
            streak: 0
        };

        mockedGetCommunityFeedData.mockResolvedValue([
            { profile: missingPrivacy, state: { ...baseState, uid: missingPrivacy.uid }, metrics: baseMetrics }
        ]);

        const items = await getCommunityFeed();
        expect(items.length).toBe(0);
    });
});
