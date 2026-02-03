'use client';

import React, { useState } from 'react';
import { QuickAddSheet } from './QuickAddSheet';
import { FoodEntryForm, WorkoutEntryForm, WeightEntryForm } from './Forms';

export function DashboardActions() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'food' | 'workout' | 'weight'>('food');

    const TABS = [
        { id: 'food', label: '飲食', icon: '🥗' },
        { id: 'workout', label: '運動', icon: '🏃' },
        { id: 'weight', label: '體重', icon: '⚖️' }
    ] as const;

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: 'calc(2rem + 60px)', // Above Nav
                    right: '1.5rem',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--text-primary)',
                    color: 'var(--bg-app)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    zIndex: 90
                }}
            >
                +
            </button>

            {/* Quick Add Sheet */}
            <QuickAddSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="快速記錄"
            >
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                background: activeTab === tab.id ? 'var(--accent)' : 'var(--bg-app)',
                                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'food' && <FoodEntryForm />}
                {activeTab === 'workout' && <WorkoutEntryForm />}
                {activeTab === 'weight' && <WeightEntryForm />}
            </QuickAddSheet>
        </>
    );
}
