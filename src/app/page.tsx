import { getCachedDashboard, getCachedDailyLogs } from '@/lib/cache';
import { LevelProgress } from './components/LevelProgress';
import { DashboardActions } from './components/DashboardActions';

import { DashboardInteractions } from './components/DashboardInteractions';
import { UserIcon } from './components/icons/UserIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { GoalCountdown } from './components/GoalCountdown';
import Link from 'next/link';

// Cache for 30 seconds
export const revalidate = 30;

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = params.date || today;

  // OPTIMIZATION: Parallel fetch with React Cache
  const [viewModel, logs] = await Promise.all([
    getCachedDashboard(selectedDate),
    getCachedDailyLogs(selectedDate)
  ]);

  const { metrics } = viewModel;

  // Level Data
  const levelData = metrics.level.status === 'ready' ? metrics.level.value : { current: 1, xp: 0, nextXP: 100 };

  // v2: Handle null values properly (don't convert to 0)
  const streakDays = metrics.streak.status === 'ready' ? (metrics.streak.value || 0) : 0;

  // Date Formatting (Chinese)
  const dateObj = new Date(selectedDate);
  const dateMonthStr = new Intl.DateTimeFormat('zh-TW', { month: 'long', day: 'numeric' }).format(dateObj);
  const dateWeekdayStr = new Intl.DateTimeFormat('zh-TW', { weekday: 'long' }).format(dateObj);



  return (
    <div style={{
      maxWidth: '480px', // Mobile focused width
      margin: '0 auto',
      padding: '2rem 1.5rem',
      paddingBottom: '8rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      background: 'var(--bg-app)',
      minHeight: '100vh'
    }}>


      {/* 1. Header Row */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {/* Date format: 1月28日 星期三 */}
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            lineHeight: 1.2
          }}>
            {dateWeekdayStr},<br />
            <span style={{ color: 'var(--text-primary)' }}>{dateMonthStr}</span>
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <span>⚡️</span>
            <span>連續 {streakDays} 天</span>
          </div>
        </div>

        {/* User / Settings Icons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>

          <Link href="/profile" style={{ textDecoration: 'none' }} aria-label="個人檔案">
            <div className="premium-icon-btn">
              <UserIcon />
            </div>
          </Link>
          <Link href="/settings" style={{ textDecoration: 'none' }} aria-label="設定">
            <div className="premium-icon-btn">
              <SettingsIcon />
            </div>
          </Link>
        </div>
      </header>

      {/* Level Progress */}
      <LevelProgress
        level={levelData.current}
        currentXP={levelData.xp}
        nextXP={levelData.nextXP}
      />

      {/* Goal Countdown */}
      {viewModel.goal_projection && (
        <GoalCountdown projection={viewModel.goal_projection} />
      )}

      {/* 2. Interactive Area (Hero, Metrics, Quests, Trends) */}
      <DashboardInteractions viewModel={viewModel} logs={logs} />

      {/* Floating Actions */}
      <DashboardActions />

    </div>


  );
}
