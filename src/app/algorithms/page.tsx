import { DateSwitcher } from '@/app/components/DateSwitcher';

export default function AlgorithmsPage() {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', paddingBottom: '6rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap-reverse', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>算法庫</h1>
                <DateSwitcher currentDate={new Date().toISOString().split('T')[0]} />
            </header>

            <section style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-soft)'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>核心運作邏輯 (Algorithm Catalog)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    本系統嚴格遵守 Algorithm-Centric 架構。以下是當前生效的運算規則與任務定義。
                    所有數值皆由後端 Brain 統一計算，前端僅負責顯示。
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <AlgorithmCard
                        title="基礎代謝率 (BMR)"
                        formula="Mifflin-St Jeor: (10×體重) + (6.25×身高) - (5×年齡) + 性別常數"
                        desc="男性常數 +5，女性常數 -161。計算完全靜息狀態下每日維持生命所需能量。"
                        layer="Layer 3 (Metrics)"
                    />
                    <AlgorithmCard
                        title="淨熱量 (Net Calories)"
                        formula="攝取 (In) - 消耗 (Out)"
                        desc="計算每日熱量平衡。不包含 BMR，僅計算行為產生的熱量差。"
                        layer="Layer 3 (Metrics)"
                    />
                    <AlgorithmCard
                        title="連續紀錄 (Streak)"
                        formula="每日至少完成一項任務"
                        desc="若當日有任何 Quest 完成，則 Streak +1。若當日無任何紀錄，則 Streak 凍結或重置（視系統版本而定）。"
                        layer="Layer 2 (Game)"
                    />
                    <AlgorithmCard
                        title="每日總消耗 (TDEE)"
                        formula="BMR × Activity Multiplier"
                        desc="基於基礎代謝與活動程度，計算每日總能量消耗。用於目標時間線預測。"
                        layer="Layer 5 (Projection)"
                    />
                    <AlgorithmCard
                        title="去脂體重 (LBM)"
                        formula="Weight × (1 - Body Fat %)"
                        desc="計算去除脂肪後的體重，用於確定最低安全熱量攝入。"
                        layer="Layer 5 (Projection)"
                    />
                    <AlgorithmCard
                        title="目標達成時間線"
                        formula="(Current - Target) × 7700 ÷ (TDEE - 安全攝入底線)"
                        desc="基於生理學安全底線與物理定律（1kg = 7700kcal）預測達成日期。女性需≥LBM×30防止下視丘閉經（FHA），男性需≥BMR維持基礎代謝功能。"
                        layer="Layer 5 (Projection)"
                    />
                </div>
            </section>

            <section style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-soft)'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>任務定義 (Quest Registry)</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <AlgorithmCard
                        title="紀錄飲食"
                        formula="攝取 > 2000 kcal"
                        desc="鼓勵使用者誠實紀錄完整飲食。"
                        layer="Layer 1 (Quest)"
                    />
                    <AlgorithmCard
                        title="活動消耗"
                        formula="運動消耗 > 400 kcal"
                        desc="鼓勵每日進行中等強度運動。"
                        layer="Layer 1 (Quest)"
                    />
                </div>
            </section>
        </div>
    );
}

function AlgorithmCard({ title, formula, desc, layer }: { title: string, formula: string, desc: string, layer: string }) {
    return (
        <div style={{
            background: 'var(--bg-app)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: 'none'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{layer}</span>
            </div>
            <div style={{
                color: 'var(--text-tertiary)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                marginBottom: '0.5rem',
                background: 'rgba(0,0,0,0.03)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                display: 'inline-block'
            }}>
                {formula}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {desc}
            </p>
        </div>
    );
}
