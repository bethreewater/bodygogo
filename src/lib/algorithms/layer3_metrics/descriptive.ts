import { BodyLog, FoodLog, WorkoutLog, UserProfile } from '../../core/types';

/**
 * Layer 3: Descriptive Metrics Calculator
 * Pure functions to compute metrics from Raw Data.
 */

// 1. Weight (Latest Valid)
export function computeWeight(todaysLogs: BodyLog[], latestKnown: BodyLog | null): number | null {
    if (todaysLogs.length > 0) {
        // Sort by timestamp desc
        return todaysLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0].weight_kg;
    }
    return latestKnown ? latestKnown.weight_kg : null;
}

// 2. BMR (Mifflin-St Jeor)
export function computeBMR(
    profile: UserProfile,
    weight: number | null,
    todayInput: Date | string = new Date()
): number | null {
    if (!weight) return null;

    // Mifflin-St Jeor Equation
    // Men: 10W + 6.25H - 5A + 5
    // Women: 10W + 6.25H - 5A - 161

    const { height_cm, birth_date, sex } = profile;

    // Age calculation
    const today = typeof todayInput === 'string' ? new Date(todayInput) : todayInput;
    const birthDate = new Date(birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    let bmr = (10 * weight) + (6.25 * height_cm) - (5 * age);

    if (sex === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    return Math.round(bmr);
}

// 3. Calories
export function computeCalories(foodLogs: FoodLog[], workoutLogs: WorkoutLog[]) {
    const calories_in = foodLogs.reduce((acc, log) => acc + log.calories, 0);
    const calories_out = workoutLogs.reduce((acc, log) => acc + log.calories, 0);

    const protein = foodLogs.reduce((acc, log) => acc + (log.protein_g || 0), 0);
    const fat = foodLogs.reduce((acc, log) => acc + (log.fat_g || 0), 0);
    const carbs = foodLogs.reduce((acc, log) => acc + (log.carbs_g || 0), 0);

    // Note: BMR is typically added to calories_out for TDEE, but "net_calories" spec says:
    // net = in - out (workout only usually, or depending on spec).
    // Catalog spec: net_calories = calories_in - calories_out
    const net_calories = calories_in - calories_out;

    return {
        calories_in,
        calories_out,
        net_calories,
        macros: { protein, fat, carbs }
    };
}
