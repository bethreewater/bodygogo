'use client';

import React, { ReactNode } from 'react';

interface QuickAddSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function QuickAddSheet({ isOpen, onClose, title, children }: QuickAddSheetProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    zIndex: 100,
                    animation: 'fadeIn 0.3s ease-out'
                }}
            />

            {/* Sheet */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'var(--bg-surface)',
                borderTopLeftRadius: 'var(--radius-lg)',
                borderTopRightRadius: 'var(--radius-lg)',
                padding: '2rem',
                paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
                zIndex: 101,
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                maxHeight: '85vh',
                overflow: 'auto'
            }}>
                {/* Handle */}
                <div style={{
                    width: '48px',
                    height: '4px',
                    background: 'var(--text-tertiary)',
                    borderRadius: 'var(--radius-full)',
                    margin: '0 auto 1.5rem'
                }} />

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                    }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                {children}
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
