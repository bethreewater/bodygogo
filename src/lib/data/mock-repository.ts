import { BodyLog, FoodLog, WorkoutLog, UserProfile, GameState, UserSettings } from '../core/types';

/**
 * Mutable Mock Data Repository
 * Serves as the "Layer 0" (Raw Data) Source of Truth.
 */

// Helper: Simulate DB Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MOCK_USER: UserProfile = {
    uid: 'user_001',
    height_cm: 175,
    birth_date: '1995-06-15',
    sex: 'male',
    activity_level: 'moderate',
    target_weight_kg: 68, // Target: Lose weight (70 -> 68)
    target_body_fat_percent: 18 // New target
};

let userSettings: UserSettings = {
    theme: 'cozy_light',
    notifications: true,
    units: 'metric',
    privacy: 'public'
};

// ... (Rest of file) ...

// Fetch last N days of weight logs for trends
export async function getWeightTrend(days: number = 7): Promise<number[]> {
    await delay(100);
    // Sort logs by date ascending
    const sorted = [...bodyLogs].sort((a, b) => a.date.localeCompare(b.date));

    // Get last N entries (mock logic: just return last N values or null padded?)
    // Real logic: We want a continuous trend? 
    // Sparkline just needs the values we HAVE. The x-axis is implicit order.

    // Return the weight values of the last N logs. 
    // If not enough data, return what we have.
    const slice = sorted.slice(-days);
    return slice.map(l => l.weight_kg);
}

export async function getFoodHistory(_days: number = 7): Promise<number[]> {
    void _days;
    await delay(50);
    // Mock data: Intake
    return [1800, 2100, 1950, 2200, 1850, 2000, 0];
}

export async function getWorkoutHistory(_days: number = 7): Promise<number[]> {
    void _days;
    await delay(50);
    // Mock data: Burn (Calories)
    return [300, 0, 450, 200, 300, 150, 0];
}

export async function getActiveMinutesHistory(_days: number = 7): Promise<number[]> {
    void _days;
    await delay(50);
    // Mock data: Duration (Minutes)
    return [45, 0, 60, 30, 45, 20, 0];
}

export async function getNetCaloriesHistory(_days: number = 7): Promise<number[]> {
    void _days;
    await delay(50);
    // Mock data: Net = Intake - Burn (Simplified for mock)
    // In real app, this would be computed from daily logs
    // For now, return hardcoded acceptable values
    return [1500, 2100, 1500, 2000, 1550, 1850, 0];
}

export async function getUserProfile() {
    return MOCK_USER;
}

export async function updateUserProfile(partial: Partial<UserProfile>) {
    await delay(300);
    Object.assign(MOCK_USER, partial);
    return MOCK_USER;
}

export async function getUserSettings() {
    await delay(100);
    return userSettings;
}

export async function updateUserSettings(partial: Partial<UserSettings>) {
    await delay(300);
    userSettings = { ...userSettings, ...partial };
    return userSettings;
}
export const DEFAULT_GAME_STATE: GameState = {
    uid: 'user_001',
    date: '2025-01-03', // State as of yesterday
    streak_current: 5,
    streak_freeze_available: 2,
    level: 3,
    xp_current: 350,
    xp_next_level: 1000
};

let currentGameState = { ...DEFAULT_GAME_STATE };

// Mutable Arrays
const bodyLogs: BodyLog[] = [
    { id: 'b_01', timestamp: '2025-01-02T08:00:00Z', date: '2025-01-02', weight_kg: 70.5, source: 'device' },
    { id: 'b_02', timestamp: '2025-01-03T08:00:00Z', date: '2025-01-03', weight_kg: 70.2, source: 'device' },
    { id: 'b_03', timestamp: '2025-01-04T08:00:00Z', date: '2025-01-04', weight_kg: 69.8, source: 'user' },
];

const foodLogs: FoodLog[] = [
    { id: 'f_01', timestamp: '2025-01-04T12:00:00Z', date: '2025-01-04', name: 'Chicken Salad', calories: 450 },
    { id: 'f_02', timestamp: '2025-01-04T18:00:00Z', date: '2025-01-04', name: 'Beef Stake', calories: 800 },
];

const workoutLogs: WorkoutLog[] = [
    { id: 'w_01', timestamp: '2025-01-04T17:00:00Z', date: '2025-01-04', type: 'Running', duration_minutes: 30, calories: 300 },
];

// --- Reads ---

export async function getRawLogs(date: string) {
    // Simulate DB Latency
    await new Promise(resolve => setTimeout(resolve, 300));

    // AUTO-SEED: If fetching for today and empty, generate some sample data
    // This ensures the dashboard never looks "broken" or empty for new users
    const todayStr = new Date().toISOString().split('T')[0];

    if (date === todayStr) {
        // Check if we have logs for today
        const hasLogs = bodyLogs.some(l => l.date === date) || foodLogs.some(l => l.date === date);

        if (!hasLogs) {
            // Seed Body Log
            bodyLogs.push({
                id: `b_${Date.now()}`,
                timestamp: new Date().toISOString(),
                date: date,
                weight_kg: 70.0,
                body_fat_percent: 20.5,
                source: 'device'
            });

            // Seed Food Logs
            foodLogs.push({
                id: `f_${Date.now()}_1`,
                timestamp: new Date().toISOString(),
                date: date,
                name: 'Oatmeal & Berries',
                calories: 350
            });
            foodLogs.push({
                id: `f_${Date.now()}_2`,
                timestamp: new Date().toISOString(),
                date: date,
                name: 'Grilled Chicken Salad',
                calories: 550
            });

            // Seed Workout Log
            workoutLogs.push({
                id: `w_${Date.now()}`,
                timestamp: new Date().toISOString(),
                date: date,
                type: 'Morning Yoga',
                duration_minutes: 45,
                calories: 180
            });
        }
    }

    return {
        body: bodyLogs.filter(l => l.date === date),
        food: foodLogs.filter(l => l.date === date),
        workout: workoutLogs.filter(l => l.date === date),
        latestWeight: bodyLogs.length > 0 ? bodyLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0] : null
    };
}



// For history simulation, we return a state relative to the requested date.
export async function getLastGameState(date: string) {
    const requestedDate = new Date(date);
    const today = new Date(); // Real time

    const diffTime = today.getTime() - requestedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If viewing today (diff ~0), return current state.
    // If viewing past, return a simulated weaker state.
    if (diffDays <= 1) {
        return currentGameState;
    }

    // SIMULATION for older dates
    return {
        ...currentGameState,
        date: date,
        streak_current: Math.max(0, currentGameState.streak_current - diffDays),
        level: Math.max(1, currentGameState.level - Math.floor(diffDays / 10)),
        xp_current: 0
    };
}

// --- Writes (Mutations) ---

export async function addBodyLog(log: Omit<BodyLog, 'id'>) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Write latency
    const newLog: BodyLog = {
        ...log,
        id: `b_${Date.now()}`
    };
    bodyLogs.push(newLog);
    return newLog;
}

export async function addFoodLog(log: Omit<FoodLog, 'id'>) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLog: FoodLog = {
        ...log,
        id: `f_${Date.now()}`
    };
    foodLogs.push(newLog);
    return newLog;
}

export async function addWorkoutLog(log: Omit<WorkoutLog, 'id'>) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLog: WorkoutLog = {
        ...log,
        id: `w_${Date.now()}`
    };
    workoutLogs.push(newLog);
    return newLog;
}

// --- Community Data ---

export interface MockCommunityUser {
    uid: string;
    visibility: 'private' | 'status' | 'progress';
    gameState: GameState;
    // We simulate their "Today's Metrics" roughly
    todayMetrics: {
        checkin_done: boolean;
        quest_completion: number;
    }
}

export const MOCK_COMMUNITY: MockCommunityUser[] = [
    {
        uid: 'user_alpha',
        visibility: 'progress',
        gameState: { ...DEFAULT_GAME_STATE, uid: 'user_alpha', level: 10, streak_current: 45 },
        todayMetrics: { checkin_done: true, quest_completion: 0.8 }
    },
    {
        uid: 'user_beta',
        visibility: 'status',
        gameState: { ...DEFAULT_GAME_STATE, uid: 'user_beta', level: 5, streak_current: 12 },
        todayMetrics: { checkin_done: false, quest_completion: 0.2 }
    },
    {
        uid: 'user_ghost',
        visibility: 'private',
        gameState: { ...DEFAULT_GAME_STATE, uid: 'user_ghost', level: 99, streak_current: 999 },
        todayMetrics: { checkin_done: true, quest_completion: 1.0 }
    }
];

export async function updateGameState(newState: GameState) {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 200));

    // Validate: Ensure we don't regress (optional, but good for game logic)
    if (newState.xp_current >= currentGameState.xp_current || newState.level > currentGameState.level || newState.date !== currentGameState.date) {
        currentGameState = { ...newState };
    }

    return currentGameState;
}

export async function getCommunityUsers() {
    return MOCK_COMMUNITY;
}
