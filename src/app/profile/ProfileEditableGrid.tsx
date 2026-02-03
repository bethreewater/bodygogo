'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/lib/core/types'; // Assuming types are here
import { QuickAddSheet } from '../components/QuickAddSheet';
import { useActionState } from 'react'; // Or create a wrapper since useActionState is for forms
import { updateProfile } from '../actions/profile';

// We'll use a wrapper form for the sheet content
function EditForm({
    field,
    value,
    type = 'number',
    options,
    step,
    nameOverride
}: {
    field: string,
    value: string | number | undefined,
    type?: string,
    options?: { value: string, label: string }[],
    step?: string,
    nameOverride?: string
}) {
    const [state, formAction, isPending] = useActionState(updateProfile, null);

    return (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            {options ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {options.map(opt => (
                        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-app)', borderRadius: '8px' }}>
                            <input
                                type="radio"
                                name={nameOverride || field}
                                value={opt.value}
                                defaultChecked={String(value) === opt.value}
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            ) : (
                <input
                    type={type}
                    name={nameOverride || field}
                    defaultValue={value}
                    step={step}
                    style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid transparent',
                        background: 'var(--bg-app)',
                        fontSize: '1rem'
                    }}
                />
            )}

            <button
                type="submit"
                disabled={isPending}
                style={{
                    background: 'var(--text-primary)',
                    color: 'var(--bg-app)',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    opacity: isPending ? 0.7 : 1
                }}
            >
                {isPending ? '儲存中...' : '儲存變更'}
            </button>
            {state?.message && <p style={{ fontSize: '0.875rem', color: 'green', textAlign: 'center' }}>{state.message}</p>}
        </form>
    );
}

interface ProfileEditableGridProps {
    profile: UserProfile;
    age: number;
    weight: number;
}

export function ProfileEditableGrid({ profile, age, weight }: ProfileEditableGridProps) {
    const [editing, setEditing] = useState<{ field: string, label: string } | null>(null);

    return (
        <>
            {/* Personal Details */}
            <section>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    基本資料
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <StatBox
                        label="性別"
                        value={profile.sex === 'male' ? '男性' : '女性'}
                        editable
                        onClick={() => setEditing({ field: 'sex', label: '設定性別' })}
                    />
                    <StatBox
                        label="年齡 (生日)"
                        value={`${age} 歲`}
                        editable
                        onClick={() => setEditing({ field: 'birth_date', label: '設定生日' })}
                    />
                    <StatBox
                        label="身高"
                        value={`${profile.height_cm} cm`}
                        editable
                        onClick={() => setEditing({ field: 'height', label: '設定身高', })}
                    />
                    <StatBox label="目前體重" value={weight ? `${weight} kg` : '--'} /> {/* Weight is logged, not edited here */}
                </div>
            </section>

            {/* Goals Section */}
            <section>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    設定目標 (核心指標)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <StatBox
                        label="目標體重"
                        value={profile.target_weight_kg ? `${profile.target_weight_kg} kg` : '--'}
                        highlight
                        editable
                        onClick={() => setEditing({ field: 'target_weight', label: '設定目標體重' })}
                    />
                    <StatBox
                        label="目標體脂率"
                        value={profile.target_body_fat_percent ? `${profile.target_body_fat_percent} %` : '--'}
                        highlight
                        editable
                        onClick={() => setEditing({ field: 'target_body_fat', label: '設定目標體脂' })}
                    />
                </div>
            </section>

            {/* Activity ... */}
            <section>
                {/* ... */}
            </section>


            {/* Sheet */}
            <QuickAddSheet
                isOpen={!!editing}
                onClose={() => setEditing(null)}
                title={editing?.label || '編輯'}
            >
                {editing && (
                    <>
                        {/* ... existing fields ... */}
                        {editing.field === 'sex' && (
                            <EditForm field="sex" value={profile.sex} options={[{ value: 'male', label: '男性' }, { value: 'female', label: '女性' }]} />
                        )}
                        {editing.field === 'birth_date' && (
                            <EditForm field="birth_date" value={profile.birth_date} type="date" />
                        )}
                        {editing.field === 'height' && (
                            <EditForm field="height_cm" nameOverride="height" value={profile.height_cm} />
                        )}
                        {editing.field === 'target_weight' && (
                            <EditForm field="target_weight_kg" nameOverride="target_weight" value={profile.target_weight_kg} step="0.1" />
                        )}
                        {editing.field === 'target_body_fat' && (
                            <EditForm field="target_body_fat_percent" nameOverride="target_body_fat" value={profile.target_body_fat_percent} step="0.1" />
                        )}

                        {editing.field === 'activity_level' && (
                            <EditForm
                                field="activity_level"
                                value={profile.activity_level}
                                options={[
                                    { value: 'sedentary', label: '久坐 (辦公室、少運動)' },
                                    { value: 'light', label: '輕度 (每週運動 1-3 天)' },
                                    { value: 'moderate', label: '中度 (每週運動 3-5 天)' },
                                    { value: 'active', label: '高度 (每週運動 6-7 天)' },
                                    { value: 'very_active', label: '非常活躍 (勞力工作、雙倍訓練)' }
                                ]}
                            />
                        )}
                    </>
                )}
            </QuickAddSheet>
        </>
    );
}

function StatBox({ label, value, sub, highlight = false, editable = false, onClick }: { label: string, value: string, sub?: string, highlight?: boolean, editable?: boolean, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            style={{
                background: highlight ? 'var(--bg-card)' : 'var(--bg-card)',
                border: highlight ? '2px solid var(--primary)' : 'none',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: editable ? 'pointer' : 'default',
                position: 'relative'
            }}
        >
            {editable && <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.75rem', opacity: 0.3 }}>✏️</div>}
            <div style={{ fontSize: '0.75rem', color: highlight ? 'var(--primary)' : 'var(--text-tertiary)', marginBottom: '0.25rem', fontWeight: highlight ? 700 : 400 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
                {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sub}</div>}
            </div>
        </div>
    );
}
