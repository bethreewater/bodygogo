'use client';

import { useActionState, useEffect } from 'react';
import { submitWeight, submitFood, submitWorkout } from '../actions/inputs';
import { InputCard } from './InputCard';
import type { BodyLog, FoodLog, WorkoutLog } from '@/lib/core/types';
import { invalidateClientCache } from '@/lib/client-cache';

/**
 * Client Components for User Input
 */

const INPUT_STYLE = {
    background: 'var(--bg-app)', // Slight contrast input bg
    border: '1px solid transparent',
    color: 'var(--text-primary)',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    width: '100%',
    fontSize: '1rem',
    marginBottom: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
};

const BUTTON_STYLE = {
    background: 'var(--text-primary)', // Alo white/black contrast
    color: 'var(--bg-app)', // Inverted
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: 'var(--radius-full)', // Pill shape
    cursor: 'pointer',
    fontWeight: 600,
    width: '100%',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    transition: 'opacity 0.2s'
};

export function WeightEntryForm() {
    const [state, formAction, isPending] = useActionState(submitWeight, null);

    useEffect(() => {
        if (state?.message) {
            invalidateClientCache();
        }
    }, [state?.message]);

    return (
        <InputCard title="記錄體重">
            <form action={formAction}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="number"
                        inputMode="decimal"
                        name="weight"
                        placeholder="體重 (kg)"
                        step="0.1"
                        style={INPUT_STYLE}
                        disabled={isPending}
                    />
                    <input
                        type="number"
                        inputMode="decimal"
                        name="body_fat"
                        placeholder="體脂 (%)"
                        step="0.1"
                        style={INPUT_STYLE}
                        disabled={isPending}
                    />
                </div>
                <button type="submit" style={{ ...BUTTON_STYLE, opacity: isPending ? 0.7 : 1 }} disabled={isPending}>
                    {isPending ? '同步中...' : '確認紀錄'}
                </button>
                {state?.message && <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: state.message.includes('成功') ? 'var(--accent)' : 'var(--text-secondary)', textAlign: 'center' }}>{state.message}</p>}
            </form>
        </InputCard>
    );
}

import { useState } from 'react';
import { analyzeFoodText } from '../actions/analysis';

export function FoodEntryForm() {
    const [state, formAction, isPending] = useActionState(submitFood, null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisMode, setAnalysisMode] = useState(false);

    // Analysis State
    const [smartText, setSmartText] = useState('');
    const [name, setName] = useState('');
    const [macros, setMacros] = useState({ calories: '', protein: '', fat: '', carbs: '' });

    useEffect(() => {
        if (state?.message) {
            invalidateClientCache();
        }
    }, [state?.message]);

    const handleAnalyze = async () => {
        if (!smartText.trim()) return;
        setAnalyzing(true);
        try {
            const result = await analyzeFoodText(smartText);
            setName(smartText); // Auto-fill name
            setMacros({
                calories: result.calories.toString(),
                protein: result.protein_g.toString(),
                fat: result.fat_g.toString(),
                carbs: result.carbs_g.toString()
            });
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <InputCard title="記錄飲食">
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    type="button"
                    onClick={() => setAnalysisMode(false)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: !analysisMode ? 'var(--text-primary)' : 'transparent', color: !analysisMode ? 'var(--bg-app)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}
                >
                    一般輸入
                </button>
                <button
                    type="button"
                    onClick={() => setAnalysisMode(true)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: analysisMode ? 'var(--text-primary)' : 'transparent', color: analysisMode ? 'var(--bg-app)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}
                >
                    ✨ 智慧分析
                </button>
            </div>

            <form action={formAction}>
                {analysisMode && (
                    <div style={{ marginBottom: '1rem' }}>
                        <textarea
                            value={smartText}
                            onChange={(e) => setSmartText(e.target.value)}
                            placeholder="輸入食物描述 (例如: 一顆水煮蛋和一杯拿鐵)..."
                            style={{ ...INPUT_STYLE, minHeight: '80px', resize: 'vertical' }}
                        />
                        <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={analyzing || !smartText}
                            style={{
                                background: 'var(--accent)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                width: '100%',
                                opacity: analyzing ? 0.7 : 1
                            }}
                        >
                            {analyzing ? '分析中...' : '✨ 開始分析'}
                        </button>
                    </div>
                )}

                <div style={{ background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>食物名稱</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="例如: 雞胸肉沙拉"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1rem', color: 'var(--text-primary)', outline: 'none' }}
                        disabled={isPending}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>熱量 (kcal)</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            name="calories"
                            placeholder="0"
                            required
                            value={macros.calories}
                            onChange={(e) => setMacros({ ...macros, calories: e.target.value })}
                            style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', outline: 'none' }}
                            disabled={isPending}
                        />
                    </div>

                    {/* Conditional Macros */}
                    <div style={{ background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: analysisMode ? 'block' : 'none' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>蛋白質 (g)</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            name="protein"
                            placeholder="0"
                            value={macros.protein}
                            onChange={(e) => setMacros({ ...macros, protein: e.target.value })}
                            style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', outline: 'none' }}
                        />
                    </div>
                    <div style={{ background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: analysisMode ? 'block' : 'none' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>脂肪 (g)</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            name="fat"
                            placeholder="0"
                            value={macros.fat}
                            onChange={(e) => setMacros({ ...macros, fat: e.target.value })}
                            style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', outline: 'none' }}
                        />
                    </div>
                    <div style={{ background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: analysisMode ? 'block' : 'none' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>碳水 (g)</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            name="carbs"
                            placeholder="0"
                            value={macros.carbs}
                            onChange={(e) => setMacros({ ...macros, carbs: e.target.value })}
                            style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', outline: 'none' }}
                        />
                    </div>
                </div>

                <button type="submit" style={{ ...BUTTON_STYLE, opacity: isPending ? 0.7 : 1 }} disabled={isPending}>
                    {isPending ? '同步中...' : '確認紀錄'}
                </button>
                {state?.message && <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{state.message}</p>}
            </form>
        </InputCard>
    );
}

import { analyzeWorkoutImage } from '../actions/analysis';
import { ExerciseSet } from '@/lib/core/types';

export function WorkoutEntryForm() {
    const [state, formAction, isPending] = useActionState(submitWorkout, null);
    const [category, setCategory] = useState<'cardio' | 'strength'>('cardio'); // Default to Cardio
    const [scanning, setScanning] = useState(false);

    // Form State
    const [type, setType] = useState('');
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');
    const [exercises, setExercises] = useState<ExerciseSet[]>([{ name: '', weight_kg: 0, reps: 0, sets: 0 }]);

    useEffect(() => {
        if (state?.message) {
            invalidateClientCache();
        }
    }, [state?.message]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setScanning(true);
        try {
            const result = await analyzeWorkoutImage(formData); // Mock call
            setType(result.type);
            setDuration(result.duration_minutes.toString());
            setCalories(result.estimated_calories.toString());
            setExercises(result.exercises);
        } catch (error) {
            console.error("Scan failed", error);
        } finally {
            setScanning(false);
        }
    };

    const updateExercise = (index: number, field: keyof ExerciseSet, value: string | number) => {
        const newEx = [...exercises];
        newEx[index] = { ...newEx[index], [field]: value };
        setExercises(newEx);
    };

    return (
        <InputCard title="記錄運動">
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    type="button"
                    onClick={() => setCategory('cardio')}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: category === 'cardio' ? 'var(--text-primary)' : 'transparent', color: category === 'cardio' ? 'var(--bg-app)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}
                >
                    🏃‍♀️ 有氧運動
                </button>
                <button
                    type="button"
                    onClick={() => setCategory('strength')}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: category === 'strength' ? 'var(--text-primary)' : 'transparent', color: category === 'strength' ? 'var(--bg-app)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}
                >
                    💪 重訓 (AI)
                </button>
            </div>

            <form action={formAction}>
                <input type="hidden" name="category" value={category} />
                {/* Only submit exercises if in Strength mode */}
                {category === 'strength' && <input type="hidden" name="exercises" value={JSON.stringify(exercises)} />}

                {/* AI Scan - Only for Strength */}
                {category === 'strength' && (
                    <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <label style={{
                            display: 'block',
                            padding: '2rem',
                            border: '2px dashed var(--text-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            background: 'rgba(0,0,0,0.02)'
                        }}>
                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>
                                {scanning ? '🔄' : '📸'}
                            </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {scanning ? '分析影像中...' : '上傳課表照片 (AI 掃描)'}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                disabled={scanning}
                            />
                        </label>
                    </div>
                )}

                {/* Exercises Grid (Only show if Strength mode and has exercises) */}
                {category === 'strength' && exercises.length > 0 && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            辨識結果 (動作 | 重量 | 次數 | 組數)
                        </div>

                        {/* Headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.25rem', padding: '0 0.25rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>項目</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>重量</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>次數</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>組數</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {exercises.map((ex, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        value={ex.name}
                                        onChange={(e) => updateExercise(i, 'name', e.target.value)}
                                        style={{ ...INPUT_STYLE, margin: 0, padding: '0.5rem', fontSize: '0.875rem' }}
                                        placeholder="動作"
                                    />
                                    <input
                                        type="number"
                                        value={ex.weight_kg}
                                        onChange={(e) => updateExercise(i, 'weight_kg', Number(e.target.value))}
                                        style={{ ...INPUT_STYLE, margin: 0, padding: '0.5rem', fontSize: '0.875rem', textAlign: 'center' }}
                                        placeholder="kg"
                                    />
                                    <input
                                        type="number"
                                        value={ex.reps}
                                        onChange={(e) => updateExercise(i, 'reps', Number(e.target.value))}
                                        style={{ ...INPUT_STYLE, margin: 0, padding: '0.5rem', fontSize: '0.875rem', textAlign: 'center' }}
                                        placeholder="次"
                                    />
                                    <input
                                        type="number"
                                        value={ex.sets}
                                        onChange={(e) => updateExercise(i, 'sets', Number(e.target.value))}
                                        style={{ ...INPUT_STYLE, margin: 0, padding: '0.5rem', fontSize: '0.875rem', textAlign: 'center' }}
                                        placeholder="組"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <input
                    type="text"
                    name="type"
                    placeholder="運動類型 (例如: 慢跑、深蹲)"
                    required
                    style={INPUT_STYLE}
                    disabled={isPending}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="number"
                        inputMode="numeric"
                        name="duration"
                        placeholder="時長 (min)"
                        required
                        style={INPUT_STYLE}
                        disabled={isPending}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                    <input
                        type="number"
                        inputMode="numeric"
                        name="calories"
                        placeholder="消耗 (kcal)"
                        required
                        style={INPUT_STYLE}
                        disabled={isPending}
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                    />
                </div>
                <button type="submit" style={{ ...BUTTON_STYLE, opacity: isPending ? 0.7 : 1 }} disabled={isPending}>
                    {isPending ? '同步中...' : '確認紀錄'}
                </button>
                {state?.message && <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{state.message}</p>}
            </form>
        </InputCard>
    );
}

export function HistoryList({ items }: { items: Array<BodyLog | FoodLog | WorkoutLog> }) {
    if (!items || items.length === 0) {
        return <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem' }}>今日暫無紀錄</p>;
    }

    const getTitle = (item: BodyLog | FoodLog | WorkoutLog) => {
        if ('name' in item) return item.name;
        if ('type' in item) return item.type;
        return `${item.weight_kg} kg`;
    };

    const getSub = (item: BodyLog | FoodLog | WorkoutLog) => {
        if ('calories' in item) return `${item.calories} kcal`;
        return new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item) => (
                <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-app)', // Slight contrast against card
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9375rem',
                    transition: 'transform 0.1s',
                    cursor: 'default'
                    // hover effect via css if possible, or inline
                }}
                >
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                        {getTitle(item)}
                        {'body_fat_percent' in item && item.body_fat_percent ? (
                            <span style={{ fontSize: '0.85em', color: 'var(--text-tertiary)', marginLeft: '0.5rem' }}>
                                ({item.body_fat_percent}%)
                            </span>
                        ) : null}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {getSub(item)}
                    </div>
                </div>
            ))}
        </div>
    );
}
