'use server';

import { revalidatePathsAndDashboard } from '@/lib/server/cache-tags';
import { updateUserProfile, addBodyLog } from '@/lib/data/supabase-repository';
import { UserProfile } from '@/lib/core/types';

export async function completeOnboarding(prevState: unknown, formData: FormData) {
    const height = Number(formData.get('height'));
    const weight = Number(formData.get('weight'));
    const sex = formData.get('sex') as 'male' | 'female';
    const birth_date = formData.get('birth_date') as string;
    const activity_level = formData.get('activity_level') as UserProfile['activity_level'];
    const body_fat = Number(formData.get('body_fat')) || undefined;  // Added

    if (!height || !weight || !sex || !birth_date) {
        return { error: '請填寫所有欄位' };
    }

    try {
        // 1. Update Profile
        // Calculate simplified targets based on Goal
        // (For MVP, we just save raw data. Targets can be computed later or defaults set here)
        // Let's set some defaults
        const target_weight = Number(formData.get('target_weight')) || weight;
        const target_body_fat = Number(formData.get('target_body_fat')) || undefined;

        await updateUserProfile({
            height_cm: height,
            sex,
            birth_date,
            activity_level: activity_level || 'sedentary',
            target_weight_kg: target_weight,
            target_body_fat_percent: target_body_fat
        });

        // 2. Add First Body Log
        const now = new Date().toISOString();
        await addBodyLog({
            timestamp: now,
            date: now.split('T')[0],
            weight_kg: weight,
            body_fat_percent: body_fat, // Added
            source: 'user'
        });

        await revalidatePathsAndDashboard(['/'], now.split('T')[0]);
        return { success: true };
    } catch (e: unknown) {
        console.error('Onboarding Error', e);
        const message = e instanceof Error ? e.message : '發生錯誤';
        return { error: message };
    }
}
