# BodyGoGo: Algorithm-Centric Health System

> **隱私優先 • 算法核心 • 嚴格分層**

BodyGoGo 是一個示範性的健康管理系統，展示了如何透過 **Algorithm-Centric Architecture** 構建高可靠、隱私安全的應用程式。

## 核心架構 (Core Architecture)

本專案採用嚴格的 **5-Layer Architecture**，確保數據流向的單一性與可預測性：

*   **Layer 0 (Raw Data)**: 原始事件日誌 (Immutable Logs)。系統認定所有輸入皆為事實。
*   **Layer 1 (Quest Rules)**: 每日任務評價邏輯 (e.g., Eat > 2000kcal)。
*   **Layer 2 (Game Engine)**: 狀態機，處理 Streak 與 XP 累積。
*   **Layer 3 (Metrics)**: 生理數值計算 (BMR, TDEE, Net Calories)。
*   **Layer 4 (Visibility)**: 隱私防火牆，確保社群功能不外洩敏感數據。

所有邏輯皆集中於 `Brain` (Orchestrator)，前端 UI 僅作為 "Dumb View" 負責顯示。

## 功能特色 (Features)

### 1. 完整紀錄功能
*   **身體紀錄 (/body)**: 體重追蹤與歷史曲線（模擬）。
*   **飲食紀錄 (/food)**: 熱量攝取與餐點列表。
*   **運動紀錄 (/workout)**: 運動類型與消耗計算。

### 2. 遊戲化引導 (Gamification)
*   **Streak 機制**: 連續達成目標可累積 Streak。
*   **Level System**: 完成任務獲得 XP，提升等級。
*   **Quest System**: 每日自動派發任務（如：紀錄飲食、達成熱量赤字）。

### 3. 社群與隱私 (Community & Privacy)
*   **隱私防火牆**: 嚴格過濾敏感數據（體重、具體熱量）。
*   **Visibility Levels**: 支援 Private / Status / Progress / Detailed 四種隱私等級。
*   **Community Feed**: 安全地展示好友進度。

### 4. 歷史回放 (Time Travel)
*   支援透過 URL (`?date=YYYY-MM-DD`) 查看任意歷史日期的狀態。
*   系統會根據當時的數據重新計算所有狀態。

### 5. 可靠性 (Reliability)
*   包含 **Vitest** 自動化測試，覆蓋核心算法 (BMR, Quest Progress)。

## 技術堆疊 (Tech Stack)

*   **Framework**: Next.js 14+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Vanilla CSS (Glassmorphism Design)
*   **Testing**: Vitest
*   **State Management**: Server Actions + React Search Params (No Client Store)

## 如何執行

```bash
npm install
npm run dev
# 訪問 http://localhost:3000
```

## 測試

```bash
npm test
```

## 資料庫遷移 (Supabase)

請依序執行 `docs/migrations` 內的 SQL 檔案（可在 Supabase SQL Editor 執行）。

1. `docs/migrations/001_user_settings.sql`
2. `docs/migrations/002_user_settings_rls.sql`
3. （可選）Rollback：`docs/migrations/003_user_settings_rollback.sql`

### 透過腳本執行

可使用 `scripts/apply-migrations.sh`（需設定環境變數）：

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ./scripts/apply-migrations.sh
```

可選參數：
- `--only <file>` 只執行單一檔案（例如 `--only 001_user_settings.sql`）
- `--include-rollback` 允許執行 rollback 檔案（預設會跳過）
- `--dry-run` 只列出將執行的檔案，不實際套用

### RLS 測試
- 以登入狀態執行：
  - `select * from public.user_settings where uid = auth.uid();`
