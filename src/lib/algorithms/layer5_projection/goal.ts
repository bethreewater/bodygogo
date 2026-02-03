/**
 * Layer 5: Goal Projection Calculator
 * 
 * Computes ETA for weight loss goals based on:
 * - Calorie deficit physics (7700 kcal = 1 kg fat)
 * - Safe minimum intake (LBM × 30 for women, less strict for men)
 * - TDEE based on BMR and activity level
 */

import { UserProfile } from '../../core/types';

// --- Constants ---

const KCAL_PER_KG_FAT = 7700;
// Removed: MAX_SAFE_DAILY_DEFICIT - now using only physiological minimums

// Activity multipliers for TDEE
const ACTIVITY_MULTIPLIERS: Record<UserProfile['activity_level'], number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

// Default body fat estimates when not provided
const DEFAULT_BODY_FAT: Record<'male' | 'female', number> = {
    male: 0.20,   // 20%
    female: 0.28, // 28%
};

// --- Core Calculation Functions ---

/**
 * Compute Total Daily Energy Expenditure (TDEE)
 * TDEE = BMR × Activity Multiplier
 */
export function computeTDEE(bmr: number, activityLevel: UserProfile['activity_level']): number {
    return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Compute Lean Body Mass (LBM)
 * LBM = Weight × (1 - Body Fat %)
 */
export function computeLBM(weight: number, bodyFatPercent: number): number {
    return weight * (1 - bodyFatPercent);
}

/**
 * Compute Minimum Safe Intake (kcal/day)
 * For women: LBM × 30 (prevents hypothalamic amenorrhea)
 * For men: BMR (must not fall below basal metabolic rate)
 */
export function computeMinIntake(lbm: number, bmr: number, sex: 'male' | 'female'): number {
    if (sex === 'female') {
        return Math.round(lbm * 30);
    } else {
        // Males: do not go below BMR
        return Math.round(bmr);
    }
}

/**
 * Compute the maximum safe daily deficit
 * Based purely on physiological minimum intake:
 * - Female: LBM × 30 kcal (prevents hypothalamic amenorrhea)
 * - Male: BMR (basal metabolic rate floor)
 */
export function computeSafeDeficit(tdee: number, minIntake: number): number {
    // Safe deficit is simply TDEE minus the physiological minimum
    // No arbitrary cap - the body's needs determine the limit
    return Math.max(0, tdee - minIntake);
}

// --- Main Projection Interface ---

export interface GoalProjection {
    days_to_goal: number;
    target_date: string; // YYYY-MM-DD
    daily_deficit: number;
    min_intake_floor: number;
    tdee: number;
    is_achievable: boolean;
    warning?: string;
    // Progress tracking
    start_weight?: number;
    current_weight: number;
    target_weight: number;
    start_body_fat?: number;
    current_body_fat?: number;
    target_body_fat?: number;
}

export interface GoalProjectionParams {
    current_weight: number;
    target_weight: number;
    body_fat_percent: number | null; // If null, use sex-based default
    bmr: number;
    activity_level: UserProfile['activity_level'];
    sex: 'male' | 'female';
    today: string; // YYYY-MM-DD
    // Progress tracking (optional)
    start_weight?: number;
    start_body_fat_percent?: number;
    target_body_fat_percent?: number;
}

/**
 * Main Goal Timeline Calculator
 * 
 * Computes how many days and what date the user will reach their target weight,
 * given their current metrics and safe calorie deficit constraints.
 */
export function computeGoalTimeline(params: GoalProjectionParams): GoalProjection {
    const {
        current_weight,
        target_weight,
        body_fat_percent,
        bmr,
        activity_level,
        sex,
        today,
        start_weight,
        start_body_fat_percent,
        target_body_fat_percent,
    } = params;

    // 1. Compute TDEE
    const tdee = computeTDEE(bmr, activity_level);

    // 2. Compute LBM (use default if body fat not provided)
    const effectiveBodyFat = body_fat_percent !== null
        ? body_fat_percent / 100 // Convert from percentage to decimal
        : DEFAULT_BODY_FAT[sex];
    const lbm = computeLBM(current_weight, effectiveBodyFat);

    // 3. Compute minimum safe intake
    const minIntake = computeMinIntake(lbm, bmr, sex);

    // 4. Compute safe daily deficit
    const safeDeficit = computeSafeDeficit(tdee, minIntake);

    // 5. Calculate weight to lose
    const weightToLose = current_weight - target_weight;

    // Handle edge cases
    if (weightToLose <= 0) {
        // Already at or below target
        return {
            days_to_goal: 0,
            target_date: today,
            daily_deficit: 0,
            min_intake_floor: minIntake,
            tdee,
            is_achievable: true,
            warning: undefined,
            // Progress tracking
            start_weight,
            current_weight,
            target_weight,
            start_body_fat: start_body_fat_percent,
            current_body_fat: body_fat_percent ?? undefined,
            target_body_fat: target_body_fat_percent,
        };
    }

    if (safeDeficit <= 0) {
        // Cannot create a deficit safely
        return {
            days_to_goal: Infinity,
            target_date: 'N/A',
            daily_deficit: 0,
            min_intake_floor: minIntake,
            tdee,
            is_achievable: false,
            warning: '您的 TDEE 低於安全攝入下限，無法創造熱量缺口。建議增加活動量。',
            // Progress tracking
            start_weight,
            current_weight,
            target_weight,
            start_body_fat: start_body_fat_percent,
            current_body_fat: body_fat_percent ?? undefined,
            target_body_fat: target_body_fat_percent,
        };
    }

    // 6. Compute days to goal
    const totalKcalNeeded = weightToLose * KCAL_PER_KG_FAT;
    const daysToGoal = Math.ceil(totalKcalNeeded / safeDeficit);

    // 7. Compute target date
    const todayDate = new Date(today);
    todayDate.setDate(todayDate.getDate() + daysToGoal);
    const targetDate = todayDate.toISOString().split('T')[0];

    // 8. No warnings needed - physiological minimums are enforced
    const warning: string | undefined = undefined;

    return {
        days_to_goal: daysToGoal,
        target_date: targetDate,
        daily_deficit: safeDeficit,
        min_intake_floor: minIntake,
        tdee,
        is_achievable: true,
        warning,
        // Progress tracking
        start_weight,
        current_weight,
        target_weight,
        start_body_fat: start_body_fat_percent,
        current_body_fat: body_fat_percent ?? undefined,
        target_body_fat: target_body_fat_percent,
    };
}
