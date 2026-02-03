'use client';

import { QuestCard } from './QuestCard';
import { QuestResult } from '@/lib/core/types';

interface QuestSectionProps {
    quests: QuestResult[];
    onSetupClick: () => void;
}

export function QuestSection({ quests, onSetupClick }: QuestSectionProps) {
    const getQuestDescription = (id: string) => {
        switch (id) {
            case 'q_log_food': return '記錄今日任何一筆飲食';
            case 'q_move_it': return '記錄運動日誌或消耗 >300 kcal';
            case 'q_goal_target': return '保持今日淨熱量低於目標 (赤字狀態)';
            case 'q_daily_weigh_in': return '記錄今日體重';
            case 'q_setup_profile': return '完善個人資料與 BMR';
            default: return '完成指定目標';
        }
    };

    return (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>
                今日任務
            </h3>

            {quests.map((quest) => {
                const isSetup = quest.id === 'q_setup_profile' && quest.status === 'available';
                const description = getQuestDescription(quest.id);

                return (
                    <div
                        key={quest.id}
                        onClick={() => isSetup ? onSetupClick() : null}
                        style={{ cursor: isSetup ? 'pointer' : 'default' }}
                    >
                        <QuestCard
                            title={quest.title}
                            description={description}
                            xp={quest.xp_reward}
                            status={quest.status}
                        />
                    </div>
                );
            })}

            {quests.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                    🎉 任務系統載入中...
                </div>
            )}

            {/* Wizard Modal Controlled by Parent */}
        </section>
    );
}
