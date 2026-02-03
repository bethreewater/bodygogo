'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const navItems = [
        { path: '/', label: '首頁' },
        { path: '/body', label: '身體' },
        { path: '/food', label: '飲食' },
        { path: '/workout', label: '運動' },
        { path: '/community', label: '社群' },
        { path: '/algorithms', label: '算法' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            zIndex: 100,
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            boxShadow: 'var(--shadow-soft)',
            alignItems: 'center'
        }}>
            {navItems.map((item) => {
                const active = isActive(item.path);

                return (
                    <Link key={item.path} href={item.path} style={{
                        position: 'relative',
                        padding: '0.5rem 1rem',
                        color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        transition: 'all 0.3s ease',
                        background: active ? 'var(--bg-app)' : 'transparent',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        fontWeight: active ? 600 : 500,
                        letterSpacing: '-0.01em',
                        textDecoration: 'none'
                    }}>
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
