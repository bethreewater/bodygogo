'use client';

import { useEffect, useRef, useState } from 'react';
import { Toast } from '@/app/components/Toast';
import { UserSettings } from '@/lib/core/types';
import { setTheme, setUnits, setPrivacy, toggleNotifications } from '../actions/settings';
import { SegmentedSetting } from './SegmentedSetting';

interface SettingsListProps {
    settings: UserSettings;
}

export function SettingsList({ settings }: SettingsListProps) {
    const [theme, setLocalTheme] = useState(settings.theme);
    const [localSettings, setLocalSettings] = useState(settings);
    const [saveNote, setSaveNote] = useState<string | null>(null);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleThemeChange = async (newTheme: 'cozy_light' | 'cozy_dark') => {
        setLocalTheme(newTheme);
        setLocalSettings((prev) => ({ ...prev, theme: newTheme }));
        await setTheme(newTheme);
        flashSaved();
    };

    const flashSaved = (message: string = '已更新') => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        setSaveNote(message);
        saveTimerRef.current = setTimeout(() => setSaveNote(null), 1500);
    };

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, []);

    return (
        <>
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    偏好設定
                </h3>
                {saveNote && <Toast message={saveNote} variant="success" />}

                <SegmentedSetting
                    label="主題"
                    description="介面風格"
                    currentValue={theme}
                    options={[
                        { label: '溫馨 (亮)', value: 'cozy_light', action: () => handleThemeChange('cozy_light') },
                        { label: '暗黑 (Pixel)', value: 'cozy_dark', action: () => handleThemeChange('cozy_dark') }
                    ]}
                />

                <SegmentedSetting
                    label="通知"
                    description="每日提醒"
                    currentValue={localSettings.notifications ? 'on' : 'off'}
                    options={[
                        {
                            label: '開啟',
                            value: 'on',
                            action: async () => {
                                if (!localSettings.notifications) {
                                    await toggleNotifications();
                                    setLocalSettings((prev) => ({ ...prev, notifications: true }));
                                    flashSaved();
                                }
                            }
                        },
                        {
                            label: '關閉',
                            value: 'off',
                            action: async () => {
                                if (localSettings.notifications) {
                                    await toggleNotifications();
                                    setLocalSettings((prev) => ({ ...prev, notifications: false }));
                                    flashSaved();
                                }
                            }
                        }
                    ]}
                />

                <SegmentedSetting
                    label="單位"
                    description="測量標準"
                    currentValue={localSettings.units}
                    options={[
                        {
                            label: '公制 (kg)',
                            value: 'metric',
                            action: async () => {
                                await setUnits('metric');
                                setLocalSettings((prev) => ({ ...prev, units: 'metric' }));
                                flashSaved();
                            }
                        },
                        {
                            label: '英制 (lb)',
                            value: 'imperial',
                            action: async () => {
                                await setUnits('imperial');
                                setLocalSettings((prev) => ({ ...prev, units: 'imperial' }));
                                flashSaved();
                            }
                        }
                    ]}
                />
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    帳號管理
                </h3>

                <div style={{
                    background: 'var(--bg-card)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: 0.8
                }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Email</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>user@example.com</span>
                </div>

                <SegmentedSetting
                    label="隱私設定"
                    description="數據可見度"
                    currentValue={localSettings.privacy}
                    options={[
                        {
                            label: '公開',
                            value: 'public',
                            action: async () => {
                                await setPrivacy('public');
                                setLocalSettings((prev) => ({ ...prev, privacy: 'public' }));
                                flashSaved('已更新，立即生效');
                            }
                        },
                        {
                            label: '私人',
                            value: 'private',
                            action: async () => {
                                await setPrivacy('private');
                                setLocalSettings((prev) => ({ ...prev, privacy: 'private' }));
                                flashSaved('已更新，立即生效');
                            }
                        }
                    ]}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '-0.5rem' }}>
                    設為私人後，你不會出現在社群排行榜與動態中。
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    變更會立即生效。
                </div>
            </section>
        </>
    );
}
