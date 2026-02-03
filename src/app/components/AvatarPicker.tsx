'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { UserProfile } from '@/lib/core/types';

const PRESETS = [
    { id: 'boy', src: '/avatars/boy.png', label: '男孩' },
    { id: 'girl', src: '/avatars/girl.png', label: '女孩' },
    { id: 'cat', src: '/avatars/cat.png', label: '貓貓' },
    { id: 'dog', src: '/avatars/dog.png', label: '狗狗' },
    { id: 'robot', src: '/avatars/robot.png', label: '機器人' },
];

export function AvatarPicker({ currentConfig, onSave }: {
    currentConfig?: UserProfile['avatar_config'],
    onSave: (config: UserProfile['avatar_config']) => void
}) {
    const [mode, setMode] = useState<'preset' | 'upload'>(currentConfig?.type === 'upload' ? 'upload' : 'preset');
    const [selectedPreset, setSelectedPreset] = useState(currentConfig?.type === 'preset' ? currentConfig.value : 'boy');
    const [uploadPreview, setUploadPreview] = useState(currentConfig?.type === 'upload' ? currentConfig.value : null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result as string);
                onSave({ type: 'upload', value: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const selectPreset = (id: string) => {
        setSelectedPreset(id);
        onSave({ type: 'preset', value: id });
    };

    return (
        <div style={{ background: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>選擇頭像</h3>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    onClick={() => setMode('preset')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: mode === 'preset' ? '2px solid var(--accent)' : '2px solid transparent',
                        fontWeight: mode === 'preset' ? 700 : 500,
                        color: mode === 'preset' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        cursor: 'pointer',
                        background: 'transparent'
                    }}
                >
                    官方像素圖
                </button>
                <button
                    onClick={() => setMode('upload')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: mode === 'upload' ? '2px solid var(--accent)' : '2px solid transparent',
                        fontWeight: mode === 'upload' ? 700 : 500,
                        color: mode === 'upload' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        cursor: 'pointer',
                        background: 'transparent'
                    }}
                >
                    上傳照片
                </button>
            </div>

            {/* Config Area */}
            {mode === 'preset' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: '1rem' }}>
                    {PRESETS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => selectPreset(p.id)}
                            style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                borderRadius: '50%',
                                padding: '4px',
                                border: selectedPreset === p.id ? '2px solid var(--accent)' : '2px solid transparent',
                                background: 'var(--bg-card)',
                                cursor: 'pointer',
                                transition: 'transform 0.1s'
                            }}
                        >
                            <img src={p.src} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        </button>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '96px',
                        height: '96px',
                        margin: '0 auto 1rem',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed var(--text-tertiary)'
                    }}>
                        {uploadPreview ? (
                            <img src={uploadPreview} alt="Uploaded avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '2rem', color: 'var(--text-tertiary)' }}>📷</span>
                        )}
                    </div>
                    <label style={{
                        display: 'inline-block',
                        padding: '0.5rem 1.5rem',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>
                        選擇檔案
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                </div>
            )}
        </div>
    );
}
