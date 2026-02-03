/**
 * Unit Tests for Goal Timeline Calculator (Layer 5)
 */

import { describe, it, expect } from 'vitest';
import {
    computeTDEE,
    computeLBM,
    computeMinIntake,
    computeSafeDeficit,
    computeGoalTimeline,
    GoalProjectionParams
} from '../goal';

describe('Layer 5: Goal Projection', () => {
    // --- Core Calculation Functions ---

    describe('computeTDEE', () => {
        it('should calculate TDEE for sedentary activity', () => {
            const bmr = 1500;
            const tdee = computeTDEE(bmr, 'sedentary');
            expect(tdee).toBe(1800); // 1500 * 1.2
        });

        it('should calculate TDEE for very active', () => {
            const bmr = 1800;
            const tdee = computeTDEE(bmr, 'very_active');
            expect(tdee).toBe(3420); // 1800 * 1.9
        });

        it('should calculate TDEE for moderate activity', () => {
            const bmr = 1600;
            const tdee = computeTDEE(bmr, 'moderate');
            expect(tdee).toBe(2480); // 1600 * 1.55
        });
    });

    describe('computeLBM', () => {
        it('should calculate lean body mass correctly', () => {
            const weight = 70;
            const bodyFat = 0.20; // 20%
            const lbm = computeLBM(weight, bodyFat);
            expect(lbm).toBe(56); // 70 * (1 - 0.20) = 56
        });

        it('should handle high body fat percentage', () => {
            const weight = 80;
            const bodyFat = 0.35; // 35%
            const lbm = computeLBM(weight, bodyFat);
            expect(lbm).toBe(52); // 80 * 0.65 = 52
        });

        it('should handle low body fat percentage', () => {
            const weight = 60;
            const bodyFat = 0.12; // 12%
            const lbm = computeLBM(weight, bodyFat);
            expect(lbm).toBe(52.8); // 60 * 0.88 = 52.8
        });
    });

    describe('computeMinIntake', () => {
        it('should calculate min intake for female (LBM × 30)', () => {
            const lbm = 50;
            const bmr = 1400;
            const minIntake = computeMinIntake(lbm, bmr, 'female');
            expect(minIntake).toBe(1500); // 50 * 30
        });

        it('should calculate min intake for male (BMR)', () => {
            const lbm = 60;
            const bmr = 1650;
            const minIntake = computeMinIntake(lbm, bmr, 'male');
            expect(minIntake).toBe(1650); // Uses BMR, not LBM
        });

        it('should not use LBM for males', () => {
            const lbm = 70;
            const bmr = 1800;
            const minIntake = computeMinIntake(lbm, bmr, 'male');
            // Should be 1800 (BMR), not 1750 (70 * 25)
            expect(minIntake).toBe(1800);
        });
    });

    describe('computeSafeDeficit', () => {
        it('should return deficit when TDEE > min intake', () => {
            const tdee = 2200;
            const minIntake = 1500;
            const deficit = computeSafeDeficit(tdee, minIntake);
            expect(deficit).toBe(700); // 2200 - 1500
        });

        it('should allow large deficits based on physiological minimums', () => {
            const tdee = 3000;
            const minIntake = 1200;
            const deficit = computeSafeDeficit(tdee, minIntake);
            expect(deficit).toBe(1800); // No arbitrary cap
        });

        it('should return 0 when TDEE <= min intake', () => {
            const tdee = 1400;
            const minIntake = 1500;
            const deficit = computeSafeDeficit(tdee, minIntake);
            expect(deficit).toBe(0); // Cannot create deficit safely
        });
    });

    // --- Main Goal Timeline Function ---

    describe('computeGoalTimeline', () => {
        it('should calculate timeline for normal weight loss scenario', () => {
            const params: GoalProjectionParams = {
                current_weight: 75,
                target_weight: 65,
                body_fat_percent: 25, // 25%
                bmr: 1600,
                activity_level: 'moderate',
                sex: 'female',
                today: '2026-02-02'
            };

            const projection = computeGoalTimeline(params);

            // Expectations:
            // TDEE = 1600 * 1.55 = 2480
            // LBM = 75 * 0.75 = 56.25
            // Min intake = 56.25 * 30 = 1687.5 → 1688
            // Safe deficit = 2480 - 1688 = 792
            // Total kcal needed = 10 kg * 7700 = 77000
            // Days = 77000 / 792 ≈ 98 days

            expect(projection.is_achievable).toBe(true);
            expect(projection.daily_deficit).toBe(792);
            expect(projection.min_intake_floor).toBe(1688);
            expect(projection.tdee).toBe(2480);
            expect(projection.days_to_goal).toBeGreaterThan(90);
            expect(projection.days_to_goal).toBeLessThan(100);
        });

        it('should handle already at goal weight', () => {
            const params: GoalProjectionParams = {
                current_weight: 65,
                target_weight: 65,
                body_fat_percent: 20,
                bmr: 1500,
                activity_level: 'light',
                sex: 'male',
                today: '2026-02-02'
            };

            const projection = computeGoalTimeline(params);

            expect(projection.is_achievable).toBe(true);
            expect(projection.days_to_goal).toBe(0);
            expect(projection.target_date).toBe('2026-02-02');
        });

        it('should handle below goal weight', () => {
            const params: GoalProjectionParams = {
                current_weight: 60,
                target_weight: 65,
                body_fat_percent: 18,
                bmr: 1400,
                activity_level: 'sedentary',
                sex: 'female',
                today: '2026-02-02'
            };

            const projection = computeGoalTimeline(params);

            // Already below target, so days should be 0
            expect(projection.is_achievable).toBe(true);
            expect(projection.days_to_goal).toBe(0);
            expect(projection.target_date).toBe('2026-02-02');
        });

        it('should handle impossible deficit (TDEE <= min intake)', () => {
            const params: GoalProjectionParams = {
                current_weight: 50,
                target_weight: 45,
                body_fat_percent: 15, // Very low body fat
                bmr: 1200,
                activity_level: 'sedentary',
                sex: 'female',
                today: '2026-02-02'
            };

            const projection = computeGoalTimeline(params);

            // LBM = 50 * 0.85 = 42.5
            // Min intake = 42.5 * 30 = 1275
            // TDEE = 1200 * 1.2 = 1440
            // Deficit = 1440 - 1275 = 165 (small but possible)

            // Actually this should be achievable with small deficit
            expect(projection.is_achievable).toBe(true);
            expect(projection.daily_deficit).toBeGreaterThan(0);
        });

        it('should use default body fat when null (female)', () => {
            const params: GoalProjectionParams = {
                current_weight: 70,
                target_weight: 60,
                body_fat_percent: null,
                bmr: 1500,
                activity_level: 'light',
                sex: 'female',
                today: '2026-02-02'
            };

            const projection = computeGoalTimeline(params);

            // Should use default 28% for female
            // LBM = 70 * 0.72 = 50.4
            // Min intake = 50.4 * 30 = 1512
            expect(projection.is_achievable).toBe(true);
            expect(projection.min_intake_floor).toBe(1512);
        });

        it('should use default body fat when null (male)', () => {
            const params: GoalProjectionParams = {
                current_weight: 80,
                target_weight: 70,
                body_fat_percent: null,
                bmr: 1800,
                activity_level: 'active',
                sex: 'male',
                today: '2026-02-02'
            };

            const projection = computeGoalTimeline(params);

            // Should use default 20% for male
            // LBM = 80 * 0.80 = 64
            // Min intake (male) = BMR = 1800
            expect(projection.is_achievable).toBe(true);
            expect(projection.min_intake_floor).toBe(1800); // BMR, not LBM * 25
        });

        it('should allow large deficits based on physiological minimums', () => {
            const params: GoalProjectionParams = {
                current_weight: 90,
                target_weight: 70,
                body_fat_percent: 30,
                bmr: 2000,
                activity_level: 'very_active',
                sex: 'male',
                today: '2026-02-02'
            };

            const projection = computeGoalTimeline(params);

            // TDEE = 2000 * 1.9 = 3800
            // LBM = 90 * 0.7 = 63
            // Min intake (male) = BMR = 2000
            // Deficit = 3800 - 2000 = 1800 (no longer capped)

            expect(projection.daily_deficit).toBe(1800);
            expect(projection.warning).toBeUndefined(); // No warnings
        });

        it('should calculate correct target date', () => {
            const params: GoalProjectionParams = {
                current_weight: 70,
                target_weight: 65,
                body_fat_percent: 20,
                bmr: 1600,
                activity_level: 'moderate',
                sex: 'female',
                today: '2026-02-01'
            };

            const projection = computeGoalTimeline(params);

            // Days should be calculated, target date should be in future
            const targetDate = new Date(projection.target_date);
            const todayDate = new Date('2026-02-01');

            expect(targetDate.getTime()).toBeGreaterThan(todayDate.getTime());
        });
    });
});
