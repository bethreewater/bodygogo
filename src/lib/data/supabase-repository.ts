import { createClient } from './supabase-server';
import { BodyLog, FoodLog, WorkoutLog, UserProfile, UserSettings, PublicProfile, GameState, DailyMetrics } from '../core/types';
import { getTodayDateString } from '../core/date-utils';

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type FoodRow = { date: string; calories: number | null };
type WorkoutRow = { date: string; calories: number | null; duration_minutes?: number | null };
type FoodRowWithUid = FoodRow & { uid: string };
type WorkoutRowWithUid = WorkoutRow & { uid: string };
type GameStateRow = {
    uid: string;
    date: string;
    streak_current?: number | null;
    streak_freeze_available?: number | null;
    level?: number | null;
    xp_current?: number | null;
    xp_next_level?: number | null;
};
type UserRow = { uid: string; avatar_config?: UserProfile['avatar_config'] };
type PrivacyRow = { uid: string; privacy: 'public' | 'private' | null };

export async function getViewerId(): Promise<string | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
}

async function ensureUserRow(supabase: SupabaseClient, uid: string) {
    const { error } = await supabase
        .from('users')
        .upsert({ uid }, { onConflict: 'uid' });
    if (error) throw error;
}

// --- Raw Logs ---

export async function getRawLogs(date: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const uid = user?.id;

    if (!uid) {
        return { body: [], food: [], workout: [], latestWeight: null };
    }

    const [{ data: body }, { data: food }, { data: workout }] = await Promise.all([
        supabase.from('logs_body').select('*').eq('uid', uid).eq('date', date),
        supabase.from('logs_food').select('*').eq('uid', uid).eq('date', date),
        supabase.from('logs_workout').select('*').eq('uid', uid).eq('date', date)
    ]);

    const { data: latest } = await supabase.from('logs_body')
        .select('*')
        .eq('uid', uid)
        .not('weight_kg', 'is', null)
        .lt('date', date)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

    return {
        body: (body || []) as BodyLog[],
        food: (food || []) as FoodLog[],
        workout: (workout || []) as WorkoutLog[],
        latestWeight: (latest || null) as BodyLog | null
    };
}

export async function addBodyLog(data: Partial<BodyLog> & ({ weight_kg: number } | { body_fat_percent: number })) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const timestamp = data.timestamp || new Date().toISOString();
    const date = data.date || getTodayDateString();

    let weightToUse = 'weight_kg' in data ? data.weight_kg : undefined;

    // If no weight provided but body_fat is provided, fetch latest weight
    if (weightToUse === undefined && data.body_fat_percent !== undefined) {
        const { data: latestLog } = await supabase
            .from('logs_body')
            .select('weight_kg')
            .eq('uid', user.id)
            .not('weight_kg', 'is', null)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        if (latestLog?.weight_kg) {
            weightToUse = latestLog.weight_kg;
        } else {
            // No previous weight found - cannot proceed
            throw new Error('請先記錄體重，或同時輸入體重與體脂');
        }
    }

    // Build upsert object with only defined values
    const upsertData: Partial<BodyLog> & { uid: string; date: string; timestamp: string; source: 'user' | 'device'; weight_kg?: number } = {
        uid: user.id,
        date,
        timestamp,
        source: data.source || 'user',
        weight_kg: weightToUse  // This should now always have a value
    };

    // Only add body_fat_percent if it exists
    if (data.body_fat_percent !== undefined) {
        upsertData.body_fat_percent = data.body_fat_percent;
    }

    const { error } = await supabase.from('logs_body').upsert(upsertData, { onConflict: 'uid,date' });
    if (error) throw error;
}

export async function addFoodLog(data: Partial<FoodLog>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const timestamp = data.timestamp || new Date().toISOString();
    const date = data.date || getTodayDateString();

    const { error } = await supabase.from('logs_food').insert({
        uid: user.id,
        date,
        timestamp,
        name: data.name,
        calories: data.calories,
        protein_g: data.protein_g,
        fat_g: data.fat_g,
        carbs_g: data.carbs_g
    });
    if (error) throw error;
}

export async function addWorkoutLog(data: Partial<WorkoutLog>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const timestamp = data.timestamp || new Date().toISOString();
    const date = data.date || getTodayDateString();

    const { error } = await supabase.from('logs_workout').insert({
        uid: user.id,
        date,
        timestamp,
        type: data.type,
        category: data.category,
        duration_minutes: data.duration_minutes,
        calories: data.calories,
        exercises: data.exercises
    });
    if (error) throw error;
}

// --- User Profile ---

export async function getUserProfile(): Promise<UserProfile | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.from('users').select('*').eq('uid', user.id).single();

    if (error || !data) return null;

    return data as UserProfile;
}

export async function updateUserProfile(profile: Partial<UserProfile>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    await ensureUserRow(supabase, user.id);

    const { error } = await supabase.from('users').upsert({
        uid: user.id,
        ...profile
    }, { onConflict: 'uid' });

    if (error) throw error;
}

// --- User Settings ---

export async function getUserSettings(): Promise<UserSettings> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            theme: 'cozy_light',
            notifications: true,
            units: 'metric',
            privacy: 'private'
        };
    }

    const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('uid', user.id)
        .maybeSingle();

    if (error || !data) {
        const defaults: UserSettings = {
            theme: 'cozy_light',
            notifications: true,
            units: 'metric',
            privacy: 'private'
        };

        // Seed defaults on first read to keep settings persistent.
        await ensureUserRow(supabase, user.id);
        await supabase.from('user_settings').upsert({
            uid: user.id,
            ...defaults
        }, { onConflict: 'uid' });

        return defaults;
    }

    return {
        theme: data.theme ?? 'cozy_light',
        notifications: data.notifications ?? true,
        units: data.units ?? 'metric',
        privacy: data.privacy ?? 'private'
    };
}

export async function updateUserSettings(settings: Partial<UserSettings>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    await ensureUserRow(supabase, user.id);

    const { error } = await supabase
        .from('user_settings')
        .upsert({
            uid: user.id,
            ...settings
        }, { onConflict: 'uid' });

    if (error) throw error;
}

// --- Game State ---

export const DEFAULT_GAME_STATE: GameState = {
    uid: '',
    date: '',
    streak_current: 0,
    streak_freeze_available: 0,
    level: 1,
    xp_current: 0,
    xp_next_level: 100
};

export async function getLastGameState(date: string): Promise<GameState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ...DEFAULT_GAME_STATE };

    const { data } = await supabase.from('game_states')
        .select('*')
        .eq('uid', user.id)
        .eq('date', date)
        .maybeSingle();

    if (data) return data as GameState;

    const { data: prev } = await supabase.from('game_states')
        .select('*')
        .eq('uid', user.id)
        .lt('date', date)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (prev) return prev as GameState;

    return { ...DEFAULT_GAME_STATE, uid: user.id, date };
}

export async function getGameStateBefore(date: string): Promise<GameState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ...DEFAULT_GAME_STATE };

    const { data: prev } = await supabase.from('game_states')
        .select('*')
        .eq('uid', user.id)
        .lt('date', date)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (prev) return prev as GameState;

    return { ...DEFAULT_GAME_STATE, uid: user.id, date: '2000-01-01' };
}

export async function updateGameState(state: GameState) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase.from('game_states').upsert({
        ...state,
        uid: user.id
    }, { onConflict: 'uid, date' });
    if (error) throw error;
}

// --- History & Stats ---

export async function getNetCaloriesHistory(days: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Array(days).fill(0);

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days + 1);
    const startDateStr = startDate.toISOString().split('T')[0];

    const [{ data: food }, { data: workout }] = await Promise.all([
        supabase.from('logs_food')
            .select('date, calories')
            .eq('uid', user.id)
            .gte('date', startDateStr),
        supabase.from('logs_workout')
            .select('date, calories')
            .eq('uid', user.id)
            .gte('date', startDateStr)
    ]);

    const foodMap = new Map<string, number>();
    (food as FoodRow[] | null || []).forEach((log) => {
        const d = log.date;
        foodMap.set(d, (foodMap.get(d) || 0) + (log.calories || 0));
    });

    const workoutMap = new Map<string, number>();
    (workout as WorkoutRow[] | null || []).forEach((log) => {
        const d = log.date;
        workoutMap.set(d, (workoutMap.get(d) || 0) + (log.calories || 0));
    });

    const result = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const caloriesIn = foodMap.get(dateStr) || 0;
        const caloriesOut = workoutMap.get(dateStr) || 0;
        result.push(caloriesIn - caloriesOut);
    }

    return result;
}

export async function getActiveMinutesHistory(days: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Array(days).fill(0);

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days + 1);
    const startDateStr = startDate.toISOString().split('T')[0];

    const { data } = await supabase.from('logs_workout')
        .select('date, duration_minutes')
        .eq('uid', user.id)
        .gte('date', startDateStr);

    if (!data) return Array(days).fill(0);

    const dailyMap = new Map<string, number>();
    (data as WorkoutRow[]).forEach((log) => {
        const d = log.date;
        dailyMap.set(d, (dailyMap.get(d) || 0) + (log.duration_minutes || 0));
    });

    const result = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        result.push(dailyMap.get(dateStr) || 0);
    }

    return result;
}

export async function getWorkoutHistory(days: number = 7): Promise<number[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Array(days).fill(0);

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days + 1);
    const startDateStr = startDate.toISOString().split('T')[0];

    const { data } = await supabase.from('logs_workout')
        .select('date, calories')
        .eq('uid', user.id)
        .gte('date', startDateStr);

    if (!data) return Array(days).fill(0);

    const dailyMap = new Map<string, number>();
    (data as WorkoutRow[]).forEach((log) => {
        const d = log.date;
        dailyMap.set(d, (dailyMap.get(d) || 0) + (log.calories || 0));
    });

    const result = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        result.push(dailyMap.get(dateStr) || 0);
    }

    return result;
}

export async function getFoodHistory(days: number = 7): Promise<number[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Array(days).fill(0);

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days + 1);
    const startDateStr = startDate.toISOString().split('T')[0];

    const { data } = await supabase.from('logs_food')
        .select('date, calories')
        .eq('uid', user.id)
        .gte('date', startDateStr);

    if (!data) return Array(days).fill(0);

    const dailyMap = new Map<string, number>();
    (data as FoodRow[]).forEach((log) => {
        const d = log.date;
        dailyMap.set(d, (dailyMap.get(d) || 0) + (log.calories || 0));
    });

    const result = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        result.push(dailyMap.get(dateStr) || 0);
    }

    return result;
}

export async function getWeightTrend(days: number): Promise<number[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase.from('logs_body')
        .select('weight_kg, date')
        .eq('uid', user.id)
        .not('weight_kg', 'is', null)
        .order('date', { ascending: false })
        .limit(days);

    if (!data) return [];

    return (data as Array<{ weight_kg: number }>)
        .map(d => d.weight_kg)
        .reverse();
}

// --- Community (OPTIMIZED) ---
// Use Parallel Fetch instead of massive JOIN to prevent timeout
async function getPrivacyMap(supabase: SupabaseClient, uids: string[]): Promise<Map<string, 'public' | 'private'>> {
    const { data, error } = await supabase
        .from('user_settings')
        .select('uid, privacy')
        .in('uid', uids);

    if (error || !data) return new Map();

    const map = new Map<string, 'public' | 'private'>();
    (data as PrivacyRow[]).forEach((row) => {
        if (row?.uid && row.privacy) map.set(row.uid, row.privacy);
    });
    return map;
}

export async function getCommunityUsers(): Promise<PublicProfile[]> {
    const supabase = await createClient();

    // 1. Fetch Users (Limit 20)
    const usersRes = await supabase
        .from('users')
        .select('uid, avatar_config')
        .limit(20);

    let users = usersRes.data as UserRow[] | null;
    let error = usersRes.error;
    if (error) {
        const retry = await supabase
            .from('users')
            .select('uid, avatar_config')
            .limit(20);
        users = retry.data as UserRow[] | null;
        error = retry.error;
    }

    if (error) {
        console.error('Community fetch error:', error);
        return [];
    }

    if (!users || users.length === 0) return [];

    const uidsAll = users.map(u => u.uid);
    const privacyMap = await getPrivacyMap(supabase, uidsAll);

    const visibleUsers = users.filter(u => {
        const privacy = privacyMap.get(u.uid) || 'private';
        return privacy === 'public';
    });
    if (visibleUsers.length === 0) return [];

    const uids = visibleUsers.map(u => u.uid);
    const { data: states } = await supabase
        .from('game_states')
        .select('uid, level, streak_current, date')
        .in('uid', uids)
        .order('date', { ascending: false });

    const latestByUid = new Map<string, { level: number; streak_current: number }>();
    (states as GameStateRow[] | null || []).forEach((row) => {
        if (!latestByUid.has(row.uid)) {
            latestByUid.set(row.uid, {
                level: row.level || 1,
                streak_current: row.streak_current || 0
            });
        }
    });

    const profiles: PublicProfile[] = visibleUsers.map((user) => {
        const latest = latestByUid.get(user.uid);
        const privacy = privacyMap.get(user.uid) || 'private';
        return {
            uid: user.uid,
            username: `User ${user.uid.slice(0, 4)}`,
            level: latest?.level || 1,
            streak: latest?.streak_current || 0,
            privacy: privacy,
            avatar_config: user.avatar_config || { type: 'preset' as const, value: 'adventurer' }
        };
    });

    return profiles;
}

export const getCommunityFeed = getCommunityUsers;

export async function getCommunityFeedData(date?: string): Promise<Array<{
    profile: PublicProfile;
    state: GameState;
    metrics: DailyMetrics;
}>> {
    const supabase = await createClient();
    const targetDate = date || getTodayDateString();

    const usersRes = await supabase
        .from('users')
        .select('uid, avatar_config')
        .limit(20);

    let users = usersRes.data as UserRow[] | null;
    let error = usersRes.error;
    if (error) {
        const retry = await supabase
            .from('users')
            .select('uid, avatar_config')
            .limit(20);
        users = retry.data as UserRow[] | null;
        error = retry.error;
    }

    if (error || !users || users.length === 0) return [];

    const uidsAll = users.map(u => u.uid);
    const privacyMap = await getPrivacyMap(supabase, uidsAll);

    const visibleUsers = users.filter(u => {
        const privacy = privacyMap.get(u.uid) || 'private';
        return privacy === 'public';
    });
    if (visibleUsers.length === 0) return [];

    const uids = visibleUsers.map(u => u.uid);

    const [stateRes, foodRes, workoutRes] = await Promise.all([
        supabase.from('game_states')
            .select('uid, date, streak_current, streak_freeze_available, level, xp_current, xp_next_level')
            .in('uid', uids)
            .order('date', { ascending: false }),
        supabase.from('logs_food')
            .select('uid, date, calories')
            .in('uid', uids)
            .eq('date', targetDate),
        supabase.from('logs_workout')
            .select('uid, date, calories')
            .in('uid', uids)
            .eq('date', targetDate)
    ]);

    const latestStateByUid = new Map<string, GameState>();
    (stateRes.data as GameStateRow[] | null || []).forEach((row) => {
        if (!latestStateByUid.has(row.uid)) {
            latestStateByUid.set(row.uid, {
                uid: row.uid,
                date: row.date,
                streak_current: row.streak_current || 0,
                streak_freeze_available: row.streak_freeze_available || 0,
                level: row.level || 1,
                xp_current: row.xp_current || 0,
                xp_next_level: row.xp_next_level || 100
            });
        }
    });

    const foodMap = new Map<string, number>();
    (foodRes.data as FoodRowWithUid[] | null || []).forEach((row) => {
        if (!row.uid) return;
        foodMap.set(row.uid, (foodMap.get(row.uid) || 0) + (row.calories || 0));
    });

    const workoutMap = new Map<string, number>();
    (workoutRes.data as WorkoutRowWithUid[] | null || []).forEach((row) => {
        if (!row.uid) return;
        workoutMap.set(row.uid, (workoutMap.get(row.uid) || 0) + (row.calories || 0));
    });

    return visibleUsers.map((user) => {
        const caloriesIn = foodMap.get(user.uid) || 0;
        const caloriesOut = workoutMap.get(user.uid) || 0;
        const state = latestStateByUid.get(user.uid) || {
            ...DEFAULT_GAME_STATE,
            uid: user.uid,
            date: targetDate
        };

        const metrics: DailyMetrics = {
            weight_kg: null,
            bmr: null,
            calories_in: caloriesIn,
            calories_out: caloriesOut,
            net_calories: caloriesIn - caloriesOut,
            macros: { protein: 0, fat: 0, carbs: 0 },
            quest_completion: 0,
            checkin_done: false,
            streak_days: state.streak_current
        };

        const privacy = privacyMap.get(user.uid) || 'private';

        return {
            profile: {
                uid: user.uid,
                username: `User ${user.uid.slice(0, 4)}`,
                level: state.level,
                streak: state.streak_current,
                is_active_today: caloriesIn > 0 || caloriesOut > 0,
                privacy: privacy,
                avatar_config: user.avatar_config || { type: 'preset' as const, value: 'adventurer' }
            },
            state,
            metrics
        };
    });
}

// --- DANGER / RESET ---

export async function resetUserData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 1. Delete Child Records First (Constraint Safety)
    // We must delete quest_history first as it likely references users/game_states
    const { error: errorQuests } = await supabase.from('quest_history').delete().eq('uid', user.id);
    if (errorQuests) console.error('Error clearing quests:', errorQuests);

    const { error: errorBody } = await supabase.from('logs_body').delete().eq('uid', user.id);
    if (errorBody) throw errorBody;

    const { error: errorFood } = await supabase.from('logs_food').delete().eq('uid', user.id);
    if (errorFood) throw errorFood;

    const { error: errorWorkout } = await supabase.from('logs_workout').delete().eq('uid', user.id);
    if (errorWorkout) throw errorWorkout;

    // 2. Delete Game State
    const { error: errorGame } = await supabase.from('game_states').delete().eq('uid', user.id);
    if (errorGame) throw errorGame;

    // 3. Delete Profile
    const { error: errorUser } = await supabase.from('users').delete().eq('uid', user.id);
    if (errorUser) throw errorUser;
}
