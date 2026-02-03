'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/data/supabase-server';
import { updateUserSettings } from '@/lib/data/supabase-repository';

export async function login(prevState: unknown, formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signup(prevState: unknown, formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // Redirect to source helper if needed, usually handles email confirmation
            // For now simple signup
        }
    });

    if (error) {
        return { error: error.message };
    }

    // Seed user settings immediately when we have a session.
    if (data?.session) {
        await updateUserSettings({
            theme: 'cozy_light',
            notifications: true,
            units: 'metric',
            privacy: 'private'
        });
    }

    // For many setups, signUp returns a session immediately if email verification is off.
    // If on, it tells user to check email.
    // Let's assume we want to redirect or show message.

    return { success: true, message: '註冊成功！請檢查您的信箱進行驗證。' };
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}
