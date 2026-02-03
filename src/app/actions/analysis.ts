'use server';

interface FoodAnalysisResult {
    calories: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
}

/**
 * Mock AI Analysis
 * Simulates parsing natural language to return macros.
 */
export async function analyzeFoodText(text: string): Promise<FoodAnalysisResult> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const lower = text.toLowerCase();

    // Rule-based mock logic
    let calories = 0;
    let protein = 0;
    let fat = 0;
    let carbs = 0;

    // Detection Logic (Simple keyword accumulation)
    if (lower.includes('egg') || lower.includes('蛋')) {
        // 1 Egg approx
        calories += 70;
        protein += 6;
        fat += 5;
        carbs += 0.6;
    }
    if (lower.includes('banana') || lower.includes('香蕉')) {
        calories += 105;
        protein += 1.3;
        fat += 0.4;
        carbs += 27;
    }
    if (lower.includes('chicken') || lower.includes('雞') || lower.includes('breast')) {
        // 100g Chicken Breast
        calories += 165;
        protein += 31;
        fat += 3.6;
        carbs += 0;
    }
    if (lower.includes('rice') || lower.includes('飯')) {
        // 1 bowl rice
        calories += 200;
        protein += 4;
        fat += 0.4;
        carbs += 44;
    }
    if (lower.includes('milk') || lower.includes('奶')) {
        calories += 150;
        protein += 8;
        fat += 8;
        carbs += 12;
    }
    if (lower.includes('coffee') || lower.includes('拿鐵')) {
        calories += 120;
        protein += 6;
        fat += 6;
        carbs += 9;
    }

    // Default if noting matched but text exists (Simulate "unknown but estimated")
    if (calories === 0 && text.trim().length > 0) {
        calories = 250; // Generic guess
        protein = 10;
        fat = 10;
        carbs = 30;
    }

    return {
        calories: Math.round(calories),
        protein_g: Math.round(protein),
        fat_g: Math.round(fat),
        carbs_g: Math.round(carbs)
    };
}

export async function analyzeWorkoutImage(_formData: FormData) {
    void _formData;
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, we would send the file to an AI Vision API (e.g., GPT-4o, Claude 3.5 Sonnet Vision)
    // For now, we return a hardcoded "Gym" result.

    return {
        type: 'Strength Training',
        duration_minutes: 60,
        estimated_calories: 320,
        exercises: [
            { name: 'Barbell Squat', weight_kg: 60, reps: 8, sets: 4 },
            { name: 'Bench Press', weight_kg: 50, reps: 10, sets: 3 },
            { name: 'Lat Pulldown', weight_kg: 40, reps: 12, sets: 3 },
            { name: 'Shoulder Press', weight_kg: 15, reps: 12, sets: 3 }
        ]
    };
}
