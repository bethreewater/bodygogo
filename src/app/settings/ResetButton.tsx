'use client';

import { useActionState, useState, useEffect } from 'react';
import { resetAccount } from '@/app/actions/settings';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useRouter } from 'next/navigation';

export function ResetButton() {
    const [state, action, isPending] = useActionState(resetAccount, null);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/');
        }
    }, [state, router]);

    const handleSubmit = () => {
        // Find and submit the form programmatically
        const form = document.getElementById('reset-account-form') as HTMLFormElement;
        form?.requestSubmit();
        setShowModal(false);
    };

    return (
        <>
            <button
                type="button"
                disabled={isPending}
                onClick={() => setShowModal(true)}
                style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #fee2e2',
                    background: '#fef2f2',
                    color: '#ef4444',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    opacity: isPending ? 0.7 : 1
                }}
            >
                {isPending ? '清除中...' : '🗑️ 清除所有資料 (重新開始)'}
            </button>

            <ConfirmationModal
                isOpen={showModal}
                title="⚠️ 危險操作"
                message={'確定要刪除所有資料並重新開始嗎？\n此動作無法復原，請三思。'}
                confirmText="確認清除 (無法復原)"
                cancelText="取消"
                isDanger={true}
                onCancel={() => setShowModal(false)}
                onConfirm={handleSubmit}
            />

            {/* Hidden form to trigger server action */}
            <form id="reset-account-form" action={action} style={{ display: 'none' }} />
        </>
    );
}
