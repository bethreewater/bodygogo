'use client';

import { useTransition } from 'react';
import { signOut } from '../actions/settings';

export function SignOutButton() {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => startTransition(() => signOut())}
            disabled={isPending}
            style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--error)',
                color: 'var(--error)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem',
                opacity: isPending ? 0.6 : 1
            }}
        >
            {isPending ? '登出中...' : '登出帳號'}
        </button>
    );
}
