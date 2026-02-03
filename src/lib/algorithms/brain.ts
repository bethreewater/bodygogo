import { getRawLogs, getUserProfile, getGameStateBefore, updateGameState, getNetCaloriesHistory, getActiveMinutesHistory } from '../data/supabase-repository';
import * as Descriptive from './layer3_metrics/descriptive';
import * as Evaluator from './layer1_quest/evaluator';
import * as GameEngine from './layer2_game/engine';
import * as Completeness from './layer0_completeness/checker';
import { DashboardViewModel, DailyMetrics, GoalProjection } from '../core/types';
import * as GoalProjector from './layer5_projection/goal';
import { getTodayDateString } from '../core/date-utils';

/**
 * The BRAIN (Orchestrator)
 * 
 * Flow:
 * 1. UI requests View Model for User U on Date D.
 * 2. Brain fetches Raw Logs (Layer 0).
 * 3. Brain computes Daily Metrics (Layer 3).
 * 4. Brain evaluates Quests (Layer 1) using Metrics.
 * 5. Brain projects Game State (Layer 2) using Quests + History.
 * 6. Brain returns View Model (Strict Contract).
 */

export async function getDashboardViewModel(date: string): Promise<DashboardViewModel> {
    // 1. Fetch Data (Layer 0)
    const rawData = await getRawLogs(date);
    const profile = await getUserProfile();

    // Default Profile Fallback for New Users (Prevent Crash)
    if (!profile) {
        const completenessForNew = Completeness.getCompletenessDetails({ body: rawData.body, food: rawData.food, workout: rawData.workout });
        return {
            date,
            metrics: {
                weight: { status: 'ready', value: null, timestamp: new Date().toISOString() },
                bmr: { status: 'ready', value: null, timestamp: new Date().toISOString() },
                tdee: { status: 'ready', value: null, timestamp: new Date().toISOString() },
                calories_in: { status: 'ready', value: null, timestamp: new Date().toISOString() },
                calories_net: { status: 'ready', value: null, timestamp: new Date().toISOString() },  // v2: null instead of 0
                quest_completion: { status: 'ready', value: 0, timestamp: new Date().toISOString() },
                streak: { status: 'ready', value: 0, timestamp: new Date().toISOString() },
                calories_out: { status: 'ready', value: null, timestamp: new Date().toISOString() },  // v2: null instead of 0
                level: { status: 'ready', value: { current: 1, xp: 0, nextXP: 100 }, timestamp: new Date().toISOString() },
                macros: { status: 'ready', value: { protein: 0, fat: 0, carbs: 0 }, timestamp: new Date().toISOString() }
            },
            targets: { calories_intake: 2000, calories_out: 300 },
            quests: {
                status: 'ready',
                items: [{
                    id: 'q_setup_profile',
                    title: '建立檔案',
                    status: 'available',
                    xp_reward: 50,
                    icon: '📝'
                }]
            },
            completeness: completenessForNew,  // v2: 新增完整度資訊
            trends: {
                calories_net: [0, 0, 0, 0, 0, 0, 0],
                minutes: [0, 0, 0, 0, 0, 0, 0]
            },
            bodyStatus: 'Welcome'
        };
    }

    // BUG FIX: Always fetch the *Base State* (strictly before today) to ensure idempotency.
    // If we fetch Today's state, we will add Today's XP on top of Today's XP, causing infinite loops.
    const lastState = await getGameStateBefore(date);

    // v2: Layer 0.5 - Check Data Completeness
    const completenessDetails = Completeness.getCompletenessDetails({
        body: rawData.body,
        food: rawData.food,
        workout: rawData.workout
    });

    // 2. Compute Metrics (Layer 3)
    const weight = Descriptive.computeWeight(rawData.body, rawData.latestWeight);
    const bmr = Descriptive.computeBMR(profile, weight, date);
    const tdee = (bmr && profile.activity_level) ? GoalProjector.computeTDEE(bmr, profile.activity_level) : null;

    // v2: Only compute calories if data is present, otherwise return null
    const canCalcCaloriesIn = Completeness.canCalculateMetric('calories_in', { body: rawData.body, food: rawData.food, workout: rawData.workout });
    const canCalcCaloriesOut = Completeness.canCalculateMetric('calories_out', { body: rawData.body, food: rawData.food, workout: rawData.workout });
    const canCalcNet = Completeness.canCalculateMetric('net_calories', { body: rawData.body, food: rawData.food, workout: rawData.workout });

    const caloriesResult = Descriptive.computeCalories(rawData.food, rawData.workout);
    const calories_in = canCalcCaloriesIn ? caloriesResult.calories_in : null;
    const calories_out = canCalcCaloriesOut ? caloriesResult.calories_out : null;
    const net_calories = canCalcNet ? caloriesResult.net_calories : null;
    const macros = caloriesResult.macros;

    const dailyMetrics: DailyMetrics = {
        weight_kg: weight,
        bmr,
        calories_in,
        calories_out,
        net_calories,
        macros, // Pass aggregated macros
        // Behavioral & Game are computed next
        quest_completion: 0,
        checkin_done: false,
        streak_days: lastState.streak_current // Temporary holder
    };

    // Defaults if not set in profile
    const targetIntake = profile.target_calories_intake || 2000;
    const targetOut = profile.target_calories_out || 300;
    const targetWeight = profile.target_weight_kg || (weight ? weight : 70);

    // Determine Goal Direction
    let goalType: 'lose' | 'gain' | 'maintain' = 'maintain';
    if (weight && targetWeight) {
        if (targetWeight < (weight - 0.5)) goalType = 'lose';
        else if (targetWeight > (weight + 0.5)) goalType = 'gain';
    }

    // 3. Evaluate Quests (Layer 1)
    // Note: Quest Rules might need Metrics to be fully populated.
    const questResults = Evaluator.evaluateDailyQuests(dailyMetrics, date, {
        calories_intake: targetIntake,
        calories_out: targetOut,
        goal_type: goalType
    });

    // Update Metrics with Behavioral results
    const completedCount = questResults.filter(q => q.status === 'completed').length;
    dailyMetrics.quest_completion = questResults.length > 0 ? (completedCount / questResults.length) : null;
    dailyMetrics.checkin_done = questResults.some(q => q.status === 'completed'); // Simplified checkin rule

    // 4. Game State (Layer 2)
    const projectedState = GameEngine.computeNextGameState(lastState, questResults, date);

    // PERSISTENCE: If the date matches today (or is newer), save this state as the new truth.
    // This ensures that when we add logs -> revalidate -> Brain calcs new state -> Brain saves new state.
    // CRITICAL: Only save if user exists (profile.uid !== 'pending') to avoid Foreign Key Violation (Error 23503)
    // OPTIMIZATION: Only write if state actually changed/is new to avoid spamming DB.
    const todayStr = getTodayDateString();
    if (date === todayStr && profile.uid !== 'pending') {
        const hasChanged =
            lastState.date !== todayStr || // We are moving from Yesterday -> Today (New Record)
            lastState.xp_current !== projectedState.xp_current ||
            lastState.streak_current !== projectedState.streak_current ||
            lastState.level !== projectedState.level ||
            lastState.streak_freeze_available !== projectedState.streak_freeze_available;

        if (hasChanged) {
            try {
                await updateGameState(projectedState);
            } catch (err) {
                console.error('Brain: Failed to persist game state (non-fatal)', err);
            }
        }
    }

    dailyMetrics.streak_days = projectedState.streak_current;

    // 5. Construct View Model (UI Contract)

    // Fetch trends
    // In a real implementation, we might process raw logs for 7 days here.
    // For now, we fetch pre-computed/mocked trends from the repo.
    // We slice(0, 6) to get previous 6 days, then append today's live value.
    const netHistory = await getNetCaloriesHistory(7);
    const minutesHistory = await getActiveMinutesHistory(7);

    // Overwrite the last element (Today) with real-time computed metrics
    const trends = {
        calories_net: [
            ...netHistory.slice(0, 6),
            (dailyMetrics.net_calories !== null ? dailyMetrics.net_calories : 0)
        ],
        minutes: [
            ...minutesHistory.slice(0, 6),
            (dailyMetrics.calories_out ? Math.round(dailyMetrics.calories_out / 8) : 0) // Approximation: 1 min ~ 8 cal? No, wait. 
            // Correct approach: We need actual duration.
            // But dailyMetrics only has calories_out. 
            // We should use rawData.workout to sum duration_minutes.
        ]
    };

    // Recalculate today's minutes correctly
    const todayMinutes = rawData.workout.reduce((sum, log) => sum + log.duration_minutes, 0);
    trends.minutes[6] = todayMinutes;

    const bodyStatus = 'Stable';

    // 6. Goal Projection (Layer 5)
    let goal_projection: GoalProjection | undefined = undefined;
    if (profile.target_weight_kg && weight && bmr) {
        // Get current body fat from latest body log
        const sortedBodyLogs = [...rawData.body].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        const latestBodyFat = sortedBodyLogs.length > 0
            ? sortedBodyLogs[0].body_fat_percent ?? null
            : null;

        // Get start weight and body fat (earliest record)
        const earliestBodyLog = rawData.body.length > 0
            ? [...rawData.body].sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0]
            : null;

        const startWeight = earliestBodyLog?.weight_kg;
        const startBodyFat = earliestBodyLog?.body_fat_percent;

        // Collect historical data for trend visualization (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentBodyLogs = [...rawData.body]
            .filter(log => new Date(log.timestamp) >= thirtyDaysAgo)
            .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

        const weight_history = recentBodyLogs
            .filter(log => log.weight_kg != null)
            .map(log => ({
                date: log.timestamp.split('T')[0],
                value: log.weight_kg!
            }));

        const body_fat_history = recentBodyLogs
            .filter(log => log.body_fat_percent != null)
            .map(log => ({
                date: log.timestamp.split('T')[0],
                value: log.body_fat_percent!
            }));

        goal_projection = GoalProjector.computeGoalTimeline({
            current_weight: weight,
            target_weight: profile.target_weight_kg,
            body_fat_percent: latestBodyFat,
            bmr: bmr,
            activity_level: profile.activity_level,
            sex: profile.sex,
            today: date,
            // Progress tracking
            start_weight: startWeight,
            start_body_fat_percent: startBodyFat,
            target_body_fat_percent: profile.target_body_fat_percent,
        });

        // Add historical data to projection
        if (goal_projection) {
            goal_projection.weight_history = weight_history.length > 0 ? weight_history : undefined;
            goal_projection.body_fat_history = body_fat_history.length > 0 ? body_fat_history : undefined;
        }
    }

    // (Targets already defined above)

    return {
        date: date,
        metrics: {
            weight: {
                status: 'ready',
                value: dailyMetrics.weight_kg,
                timestamp: new Date().toISOString()
            },
            bmr: {
                status: 'ready',
                value: bmr,
                timestamp: new Date().toISOString()
            },
            tdee: {
                status: 'ready',
                value: tdee,
                timestamp: new Date().toISOString()
            },
            calories_in: {
                status: 'ready',
                value: dailyMetrics.calories_in,
                timestamp: new Date().toISOString()
            },
            calories_net: {
                status: 'ready',
                value: dailyMetrics.net_calories,
                timestamp: new Date().toISOString()
            },
            streak: {
                status: 'ready',
                value: projectedState.streak_current,
                timestamp: new Date().toISOString()
            },
            calories_out: {
                status: 'ready',
                value: dailyMetrics.calories_out,
                timestamp: new Date().toISOString()
            },
            quest_completion: {
                status: 'ready',
                value: dailyMetrics.quest_completion,
                timestamp: new Date().toISOString()
            },
            level: {
                status: 'ready',
                value: {
                    current: projectedState.level,
                    xp: projectedState.xp_current,
                    nextXP: projectedState.xp_next_level
                },
                timestamp: new Date().toISOString()
            },
            macros: {
                status: 'ready',
                value: dailyMetrics.macros || { protein: 0, fat: 0, carbs: 0 },
                timestamp: new Date().toISOString()
            }
        },
        targets: {
            calories_intake: targetIntake,
            calories_out: targetOut
        },
        quests: {
            status: 'ready',
            items: questResults
        },
        completeness: completenessDetails,  // v2: 資料完整度資訊
        trends,
        bodyStatus,
        goal_projection, // Layer 5: Goal Timeline
    };
}

export async function getDailyLogs(date: string) {
    // Simply proxy to Data Layer for now, but allows future filtering/permission checks
    return await getRawLogs(date);
}
