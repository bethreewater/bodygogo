'use server';

import { addBodyLog, addFoodLog } from '@/lib/data/supabase-repository';
import { revalidatePathsAndDashboard } from '@/lib/server/cache-tags';
import type { BodyLog, WorkoutLog } from '@/lib/core/types';

/**
 * Server Actions: The Input Interface for Layer 0.
 * 
 * Rules:
 * 1. Accept FormData / Raw Input.
 * 2. Validate Input.
 * 3. Write to Repository (Layer 0).
 * 4. Trigger Revalidation (Tell Brain to wake up).
 * 5. Return success/error status.
 * 
 * Anti-Pattern Prevention:
 * - Do NOT return the "new weight" or "new calories". 
 * - The UI must wait for the page reload (revalidatePath) to get the truth.
 */

export async function submitWeight(prevState: unknown, formData: FormData) {
    const weightStr = formData.get('weight');
    const bodyFatStr = formData.get('body_fat');

    // At least one must be provided
    if (!weightStr && !bodyFatStr) {
        return { message: '請至少輸入體重或體脂其中一項' };
    }

    let weight: number | undefined;
    let bodyFat: number | undefined;

    // Validate weight if provided
    if (weightStr) {
        weight = parseFloat(weightStr.toString());
        if (isNaN(weight) || weight <= 0) {
            return { message: '體重數值無效' };
        }
    }

    // Validate body fat if provided
    if (bodyFatStr) {
        bodyFat = parseFloat(bodyFatStr.toString());
        if (isNaN(bodyFat) || bodyFat <= 0 || bodyFat > 100) {
            return { message: '體脂百分比無效 (需介於 0-100)' };
        }
    }

    // Use current time
    const now = new Date();
    const isoString = now.toISOString();
    const dateString = isoString.split('T')[0];

    if (weight !== undefined) {
        await addBodyLog({
            timestamp: isoString,
            date: dateString,
            source: 'user',
            weight_kg: weight,
            body_fat_percent: bodyFat
        });
    } else {
        await addBodyLog({
            timestamp: isoString,
            date: dateString,
            source: 'user',
            body_fat_percent: bodyFat as number
        });
    }

    // Critical: This tells Next.js to re-run the Page Component (and thus the Brain)
    await revalidatePathsAndDashboard(['/', '/body', '/profile'], dateString); // Weight changes profile stats

    return { message: '記錄成功！' };
}

export async function submitFood(prevState: unknown, formData: FormData) {
    const name = formData.get('name')?.toString();
    const caloriesStr = formData.get('calories');

    // Optional Macros
    const protein = formData.get('protein') ? Number(formData.get('protein')) : undefined;
    const fat = formData.get('fat') ? Number(formData.get('fat')) : undefined;
    const carbs = formData.get('carbs') ? Number(formData.get('carbs')) : undefined;

    if (!name || !caloriesStr) {
        return { message: 'Name and Calories required' };
    }

    const calories = parseInt(caloriesStr.toString());

    // Use current time
    const now = new Date();
    const isoString = now.toISOString();
    const dateString = isoString.split('T')[0];

    await addFoodLog({
        timestamp: isoString,
        date: dateString,
        name: name,
        calories: calories,
        protein_g: protein,
        fat_g: fat,
        carbs_g: carbs
    });

    await revalidatePathsAndDashboard(['/', '/food', '/body'], dateString); // Calories affect body stats
    return { message: 'Food logged' };
}

export async function submitWorkout(prevState: unknown, formData: FormData) {
    const type = formData.get('type')?.toString();
    const durationStr = formData.get('duration');
    const caloriesStr = formData.get('calories');

    if (!type || !durationStr || !caloriesStr) {
        return { message: 'Type, Duration, and Calories required' };
    }

    const duration = parseInt(durationStr.toString());
    const calories = parseInt(caloriesStr.toString());

    // Parse Exercises if present
    const exercisesStr = formData.get('exercises')?.toString();
    let exercises: WorkoutLog['exercises'] | undefined = undefined;
    if (exercisesStr) {
        try {
            exercises = JSON.parse(exercisesStr);
        } catch (e) {
            console.error("Failed to parse exercises", e);
        }
    }

    const category = formData.get('category')?.toString() as 'cardio' | 'strength' | undefined;

    // Use current time
    const now = new Date();
    const isoString = now.toISOString(); // 2026-01-28T...
    const dateString = isoString.split('T')[0]; // 2026-01-28

    // Need to import addWorkoutLog
    const { addWorkoutLog } = await import('@/lib/data/supabase-repository');

    await addWorkoutLog({
        timestamp: isoString,
        date: dateString,
        type: type,
        category: category,
        duration_minutes: duration,
        calories: calories,
        exercises: exercises
    });

    await revalidatePathsAndDashboard(['/', '/workout', '/body'], dateString);
    return { message: 'Workout logged' };
}
