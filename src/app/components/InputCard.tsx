import React, { ReactNode } from 'react';

export function InputCard({ title, children }: { title: string, children: ReactNode }) {
    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-soft)'
        }}>
            <h3 style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem'
            }}>
                {title}
            </h3>
            {children}
        </div>
    );
}
