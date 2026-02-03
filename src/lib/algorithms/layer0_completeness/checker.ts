import { BodyLog, FoodLog, WorkoutLog } from '../../core/types';
import type { DataCompleteness, CompletenessDetails } from '../../core/types';

/**
 * Layer 0.5: Completeness Checker
 * 
 * 職責：判定當日資料完整度，為後續 Layer 提供 Missing Data 語義
 * 輸入：Raw Logs
 * 輸出：CompletenessDetails
 */

export interface RawLogs {
    body: BodyLog[];
    food: FoodLog[];
    workout: WorkoutLog[];
}

/**
 * 判定當日資料完整度
 * 
 * Complete: 所有三種記錄類型皆有至少一筆
 * Partial: 有部分記錄但缺少關鍵類型
 * Unknown: 無任何記錄
 */
export function checkDataCompleteness(logs: RawLogs): DataCompleteness {
    const hasFood = logs.food.length > 0;
    const hasWorkout = logs.workout.length > 0;
    const hasBody = logs.body.length > 0;

    const allPresent = hasFood && hasWorkout && hasBody;
    const anyPresent = hasFood || hasWorkout || hasBody;

    if (allPresent) return 'complete';
    if (anyPresent) return 'partial';
    return 'unknown';
}

/**
 * 取得詳細完整度資訊
 */
export function getCompletenessDetails(
    logs: RawLogs,
    lastCompleteDate: string | null = null
): CompletenessDetails {
    const overall = checkDataCompleteness(logs);

    return {
        overall,
        food: logs.food.length > 0,
        workout: logs.workout.length > 0,
        body: logs.body.length > 0,
        lastCompleteDate
    };
}

/**
 * 判定某個 metric 是否可信賴計算
 * 
 * 例如：net_calories 需要 food AND workout 皆有記錄
 */
export function canCalculateMetric(
    metricName: 'net_calories' | 'calories_in' | 'calories_out' | 'bmr',
    logs: RawLogs
): boolean {
    switch (metricName) {
        case 'net_calories':
            // 需要飲食和運動都有記錄
            return logs.food.length > 0 && logs.workout.length > 0;

        case 'calories_in':
            return logs.food.length > 0;

        case 'calories_out':
            return logs.workout.length > 0;

        case 'bmr':
            // BMR 需要體重數據
            return logs.body.length > 0;

        default:
            return false;
    }
}
