'use server';

import { updateUserProfile } from '@/lib/data/supabase-repository';
import { UserProfile } from '@/lib/core/types';
import { revalidatePathsAndDashboard } from '@/lib/server/cache-tags';
import { getTodayDateString } from '@/lib/core/date-utils';

export async function updateProfile(prevState: unknown, formData: FormData) {
    const updates: Partial<UserProfile> = {};

    const height = formData.get('height');
    if (height) updates.height_cm = Number(height);

    const sex = formData.get('sex');
    if (sex) updates.sex = sex as 'male' | 'female';

    const birthDate = formData.get('birth_date');
    if (birthDate) updates.birth_date = birthDate.toString();

    const activity = formData.get('activity_level');
    if (activity) updates.activity_level = activity as UserProfile['activity_level'];

    const targetWeight = formData.get('target_weight');
    if (targetWeight) updates.target_weight_kg = Number(targetWeight);

    const targetBodyFat = formData.get('target_body_fat');
    if (targetBodyFat) updates.target_body_fat_percent = Number(targetBodyFat);

    // Calorie targets are no longer manually updated via this form
    // const targetIntake = formData.get('target_intake'); ...
    // const targetBurn = formData.get('target_burn'); ...

    await updateUserProfile(updates);
    revalidatePathsAndDashboard(['/profile', '/body', '/'], getTodayDateString());

    return { message: '更新成功' };
}
