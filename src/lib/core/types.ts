/**
 * Core Type Definitions
 * Based on Single Source of Truth: docs/algorithm-catalog.md
 */

// --- Metric Definition Schema ---

export type MetricCategory = 'descriptive' | 'behavioral' | 'game';
export type MetricUnit = 'kg' | 'kcal' | 'kcal_day' | 'ratio' | 'boolean' | 'days' | 'count' | 'null';
export type OutputType = 'numeric' | 'integer' | 'boolean' | 'null';

// --- v2: Data Completeness (Missing Data Policy) ---

export type DataCompleteness = 'complete' | 'partial' | 'unknown';

export interface CompletenessDetails {
  overall: DataCompleteness;
  food: boolean;       // true = 當日有記錄
  workout: boolean;
  body: boolean;
  lastCompleteDate: string | null;  // 最近一次 Complete 的日期
}

export interface MetricDefinition {
  id: string;
  category: MetricCategory;
  description: string;
  unit: MetricUnit;
  outputType: OutputType;
  version: string;
}

// --- Authoritative Metrics (Section 5) ---

export interface DailyMetrics {
  // Descriptive
  weight_kg: number | null;
  bmr: number | null;
  calories_in: number | null;
  calories_out: number | null;
  net_calories: number | null;
  macros?: {
    protein: number;
    fat: number;
    carbs: number;
  };


  // Behavioral
  quest_completion: number | null; // ratio
  checkin_done: boolean;

  // Game
  streak_days: number;
}

// --- Raw Data Layers (Section 3 - Inputs) ---

export interface BodyLog {
  id: string;
  timestamp: string; // ISO 8601
  date: string; // YYYY-MM-DD
  weight_kg: number;
  body_fat_percent?: number; // Optional body fat percentage
  source: 'user' | 'device';
}

export interface FoodLog {
  id: string;
  timestamp: string;
  date: string;
  name: string;
  calories: number;
  protein_g?: number;
  fat_g?: number;
  carbs_g?: number;
}

export interface ExerciseSet {
  name: string;
  weight_kg: number;
  reps: number;
  sets: number;
}

export interface WorkoutLog {
  id: string;
  timestamp: string;
  date: string;
  type: string;
  category?: 'cardio' | 'strength'; // Added for Phase 60
  duration_minutes: number;
  calories: number;
  exercises?: ExerciseSet[];
}

export interface UserProfile {
  uid: string;
  height_cm: number;
  birth_date: string;
  sex: 'male' | 'female';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  // Targets
  target_calories_intake?: number; // e.g. 2000
  target_calories_out?: number; // e.g. 300
  target_weight_kg?: number; // e.g. 65
  target_body_fat_percent?: number; // e.g. 20

  // Customization (Phase 62)
  avatar_config?: {
    type: 'preset' | 'upload';
    value: string; // 'boy', 'girl'.. or 'blob:...'
  };
}

export interface UserSettings {
  theme: 'cozy_light' | 'cozy_dark';
  notifications: boolean;
  units: 'metric' | 'imperial';
  privacy: 'public' | 'private';
}

export interface GameState {
  uid: string;
  date: string;
  streak_current: number;
  streak_freeze_available: number;
  level: number;
  xp_current: number;
  xp_next_level: number;
}

export interface QuestResult {
  id: string;
  title: string;
  status: 'available' | 'completed' | 'unavailable';  // v2: 新增 unavailable 狀態
  xp_reward: number;
  icon?: string;
}

export interface MetricDisplayState<T> {
  status: 'ready' | 'processing' | 'failed';
  value: T;
  lastValue?: T;
  timestamp?: string; // ISO string
}

export interface DashboardViewModel {
  date: string;
  metrics: {
    weight: MetricDisplayState<number | null>;
    bmr: MetricDisplayState<number | null>;
    tdee: MetricDisplayState<number | null>;
    calories_in: MetricDisplayState<number | null>;
    calories_net: MetricDisplayState<number | null>;
    calories_out: MetricDisplayState<number | null>;
    quest_completion: MetricDisplayState<number | null>;
    streak: MetricDisplayState<number>;
    level: MetricDisplayState<{
      current: number;
      xp: number;
      nextXP: number;
    }>;
    macros: MetricDisplayState<{
      protein: number;
      fat: number;
      carbs: number;
    }>;
  };
  targets: {
    calories_intake: number;
    calories_out: number;
  };
  quests: {
    status: 'loading' | 'ready' | 'error';
    items: QuestResult[];
  };
  completeness: CompletenessDetails;  // v2: 資料完整度
  trends?: {
    calories_net: number[];
    minutes: number[];
  };
  bodyStatus?: string;
  goal_projection?: GoalProjection; // Layer 5: Goal Timeline
}

// --- Goal Projection (Layer 5) ---

export interface GoalProjection {
  days_to_goal: number;
  target_date: string; // YYYY-MM-DD
  daily_deficit: number;
  min_intake_floor: number;
  tdee: number;
  is_achievable: boolean;
  warning?: string;
  // Progress tracking
  start_weight?: number;
  current_weight: number;
  target_weight: number;
  start_body_fat?: number;
  current_body_fat?: number;
  target_body_fat?: number;
  // Historical data for trend visualization
  weight_history?: Array<{ date: string; value: number }>;
  body_fat_history?: Array<{ date: string; value: number }>;
}

// --- Community & Visibility (Section 2) ---

export interface PublicProfile {
  uid: string;
  username: string; // Derived/Obfuscated
  level: number; // Always visible if public
  streak: number | null; // Visible if Level >= Status
  privacy?: 'public' | 'private';

  // Explicitly OPTIONAL/NULL for privacy
  // The type itself enforces that these might not be there.
  last_active?: string;

  // Status Level
  is_active_today?: boolean; // Derived from logs existance

  // Progress Level (Only if Level >= Progress)
  quest_completion_ratio?: number; // Derived
  avatar_config?: {
    type: 'preset' | 'upload';
    value: string;
  };
}

/**
 * Community Feed Item (MVP)
 * "The Reflection" - strictly semantic, no raw numbers.
 */
export interface FeedItem {
  // 1. Identity (Obfuscated / Nickname)
  uid: string;
  nickname: string;
  privacy?: 'public' | 'private';

  // 2. Visual Configuration
  // Strictly typed from UserProfile to avoid 'any' casting
  avatar_config?: {
    type: 'preset' | 'upload';
    value: string;
  };

  // 3. Behavior Semantics (The Core)
  semantics: {
    vitality_phase: 'low' | 'normal' | 'high'; // Determines Idle Animation
    streak_aura: 'none' | 'spark' | 'fire' | 'gold'; // Determines Particles
    action_hint: 'working' | 'exercising' | 'relaxing'; // Determines Action
  };

  // 4. Honor
  level: number;
}
