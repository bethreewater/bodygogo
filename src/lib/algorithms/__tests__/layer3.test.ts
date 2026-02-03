import { describe, it, expect } from 'vitest';
import { computeBMR, computeCalories } from '../layer3_metrics/descriptive';
import { UserProfile, FoodLog, WorkoutLog } from '@/lib/core/types';

describe('Layer 3: Descriptive Metrics', () => {

    describe('BMR Calculation (Mifflin-St Jeor)', () => {
        const mockProfile: UserProfile = {
            uid: 'test',
            height_cm: 180,
            birth_date: '1990-01-01', // Age ~35
            sex: 'male',
            activity_level: 'sedentary'
        };

        it('should calculate BMR correctly for standard male', () => {
            // Formula: 10*W + 6.25*H - 5*A + 5
            // Age ~35
            // Weight 80kg
            // 800 + 1125 - 180 + 5 = 1750 (Age 36 in 2026)
            const bmr = computeBMR(mockProfile, 80, '2026-02-03');
            expect(bmr).toBeCloseTo(1750, -1);
        });

        it('should return null if weight is missing', () => {
            const bmr = computeBMR(mockProfile, null, '2026-02-03');
            expect(bmr).toBeNull();
        });
    });

    describe('Calories Calculation', () => {
        it('should sum food logs correctly', () => {
            const foodLogs: FoodLog[] = [
                { id: '1', calories: 500, date: '', name: '', timestamp: '' },
                { id: '2', calories: 200, date: '', name: '', timestamp: '' }
            ];
            const result = computeCalories(foodLogs, []);
            expect(result.calories_in).toBe(700);
            expect(result.calories_out).toBe(0);
            expect(result.net_calories).toBe(700);
        });

        it('should handle workouts correctly', () => {
            const workouts: WorkoutLog[] = [
                { id: '1', calories: 300, date: '', timestamp: '', duration_minutes: 30, type: 'run' }
            ];
            const result = computeCalories([], workouts);
            expect(result.calories_out).toBe(300);
            expect(result.net_calories).toBe(-300);
        });
    });
});
