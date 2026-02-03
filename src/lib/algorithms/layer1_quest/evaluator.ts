import { DailyMetrics, QuestResult } from '../../core/types';

/**
 * Layer 1: Quest Evaluation
 * Determines validity of quests based on Descriptive Metrics.
 */

interface QuestDefinition {
    id: string;
    description: string; // Internal or fallback
    evaluate: (metrics: DailyMetrics) => QuestResult;
}

export interface QuestTargets {
    calories_intake: number;
    calories_out: number;
    goal_type: 'lose' | 'gain' | 'maintain';
}

// Registry
const getQuests = (targets: QuestTargets): QuestDefinition[] => [
    // 0. Setup Profile (New User)
    {
        id: 'q_setup_profile',
        description: 'Complete Profile',
        evaluate: (metrics) => {
            // If weight is missing, treat as not set up
            const isCompleted = metrics.weight_kg !== null && metrics.weight_kg > 0;
            return {
                id: 'q_setup_profile',
                title: '設定檔案',
                status: isCompleted ? 'completed' : 'available',
                xp_reward: 20,
                icon: '📝'
            };
        }
    },
    // 1. Daily Weigh-in
    {
        id: 'q_daily_weigh_in',
        description: 'Record Weight',
        evaluate: (metrics) => {
            const hasWeight = metrics.weight_kg !== null && metrics.weight_kg > 0;
            return {
                id: 'q_daily_weigh_in',
                title: '每日量測',
                status: hasWeight ? 'completed' : 'available',
                xp_reward: 50,
                icon: '⚖️'
            };
        }
    },
    // 2. Log Meals (>500kcal)
    {
        id: 'q_log_food',
        description: 'Log Meals',
        evaluate: (metrics) => {
            // v2: If no food data, return unavailable instead of available
            if (metrics.calories_in === null) {
                return {
                    id: 'q_log_food',
                    title: '紀錄飲食',
                    status: 'unavailable',
                    xp_reward: 50,
                    icon: '🥗'
                };
            }
            const current = metrics.calories_in || 0;
            const isCompleted = current > 500; // Threshold to ensure meaningful logging
            return {
                id: 'q_log_food',
                title: '紀錄飲食',
                status: isCompleted ? 'completed' : 'available',
                xp_reward: 50,
                icon: '🥗'
            };
        }
    },
    // 3. Move (>100kcal)
    {
        id: 'q_move_it',
        description: 'Burn Calories',
        evaluate: (metrics) => {
            // v2: If no workout data, return unavailable
            if (metrics.calories_out === null) {
                return {
                    id: 'q_move_it',
                    title: '動起來',
                    status: 'unavailable',
                    xp_reward: 50,
                    icon: '🔥'
                };
            }
            const current = metrics.calories_out || 0;
            const isCompleted = current > 100;
            return {
                id: 'q_move_it',
                title: '動起來',
                status: isCompleted ? 'completed' : 'available',
                xp_reward: 50,
                icon: '🔥'
            };
        }
    },
    // 4. Dynamic Goal Quest
    {
        id: 'q_goal_target',
        description: 'Hit Daily Target',
        evaluate: (metrics) => {
            if (!metrics.bmr || metrics.net_calories === null) {
                return {
                    id: 'q_goal_target',
                    title: '達成目標',
                    status: 'available',
                    xp_reward: 100,
                    icon: '🎯'
                };
            }

            // Logic based on Goal Direction
            let isSuccess = false;
            let title = '達成目標';
            let icon = '🎯';

            if (targets.goal_type === 'lose') {
                title = '保持赤字';
                icon = '🛡';
                // Deficit: Net < BMR (or Target Intake)
                // Using BMR as a loose baseline for deficit, but strictly it depends on TDEE.
                // For simplified "Quest", let's use Target Intake as the ceiling.
                isSuccess = metrics.net_calories <= targets.calories_intake;
            } else if (targets.goal_type === 'gain') {
                title = '營養盈餘';
                icon = '💪';
                // Surplus: Net > BMR
                isSuccess = metrics.net_calories >= metrics.bmr;
            } else {
                title = '維持平衡';
                icon = '⚖️';
                // Maintenance: Within +/- 10% of BMR (Approximation)
                const diff = Math.abs(metrics.net_calories - metrics.bmr);
                isSuccess = diff < (metrics.bmr * 0.15);
            }

            return {
                id: 'q_goal_target',
                title: title,
                status: isSuccess ? 'completed' : 'available',
                xp_reward: 100,
                icon: icon
            };
        }
    }
];

export function evaluateDailyQuests(metrics: DailyMetrics, date: string, targets?: QuestTargets): QuestResult[] {
    const safeTargets: QuestTargets = targets || {
        calories_intake: 2000,
        calories_out: 300,
        goal_type: 'maintain'
    };
    const quests = getQuests(safeTargets);
    return quests.map(quest => {
        const result = quest.evaluate(metrics);
        return result;
    });
}
