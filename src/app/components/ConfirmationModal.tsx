'use client';

import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDanger?: boolean;
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = '確定',
    cancelText = '取消',
    onConfirm,
    onCancel,
    isDanger = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem'
        }}>
            <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                width: '100%',
                maxWidth: '320px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                animation: 'scaleIn 0.2s ease-out'
            }}>
                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: isDanger ? '#ef4444' : 'var(--text-primary)'
                }}>
                    {title}
                </h3>

                <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                }}>
                    {message}
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '12px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--text-tertiary)',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '12px',
                            background: isDanger ? '#ef4444' : 'var(--brand)',
                            border: 'none',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
