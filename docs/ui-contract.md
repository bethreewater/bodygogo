
# UI Contract Specification  
# 前端行為與資料顯示正式規格

---

## 0. 文件定位（Document Positioning）

本文件定義 **前端（Web / App）在整個系統中的唯一合法職責範圍**。

本文件的存在目的不是為了 UI 美感，
而是為了 **防止前端在無意間承載業務語意，導致系統邏輯腐化**。

本文件優先於：
- UI/UX 設計稿
- 元件實作細節
- 動畫與互動需求

---

## 1. 前端的唯一責任（Frontend Responsibilities）

前端 **只允許** 做以下三件事：

1. **資料呈現（Render）**
2. **使用者輸入收集（Input）**
3. **狀態視覺化（State Visualization）**

---

## 2. 前端明確禁止事項（Hard Prohibitions）

前端 **嚴格禁止**：

- ❌ 計算健康結論（BMI、熱量差、趨勢）
- ❌ 推測任務是否完成
- ❌ 自行更新 streak / XP / level
- ❌ 根據動畫或輸入即時改變數值語意
- ❌ 補值、猜值、平滑化後端數據

> 前端顯示的任何數值，**必須與後端結果一字不差**。

---

## 3. 數值顯示三態模型（Metric Display State Machine）

所有來自後端的數值，必須遵守以下三態模型：

### 3.1 `ready`
- 條件：已取得最新 authoritative data
- 行為：
  - 顯示數值
  - 顯示單位
  - 不附加任何預測或提示語意

---

### 3.2 `processing`
- 條件：
  - 使用者提交 raw data
  - 後端尚未完成計算

- 行為：
  - **保留最後一筆已確認數值**
  - 顯示 pixel-style 動畫（僅作狀態提示）
  - 不得顯示「即將增加 / 減少」等暗示

---

### 3.3 `failed`
- 條件：後端回傳錯誤或超時
- 行為：
  - 保留最後一筆數值
  - 顯示錯誤狀態
  - 提供 retry 機制
  - 不自行回退或修正數值

---

## 4. Pixel Animation 規範（重要）

Pixel Animation 的角色是：

> **「讓使用者知道系統正在處理，而不是讓使用者誤以為數值正在變化」**

### 規則
- 僅可出現在 `processing` 狀態
- 不得根據動畫推動數值變化
- 不得提前顯示結果方向
- 不得與實際數值同步變化

---

## 5. 各頁面 UI 契約（Page-Level Contracts）

### 5.1 初始進入頁（Onboarding / Entry）

- 職責：
  - 引導使用者完成設定
- 不得顯示：
  - 任務完成度
  - 健康指標推論

---

### 5.2 首頁 / 遊戲化儀表板（Home / Dashboard）

#### 可顯示
- metrics_daily（彙總後）
- quest_results_daily（狀態）
- game_state（streak、xp、level）

#### 不可顯示
- 任務判定邏輯
- 任務完成原因
- raw logs

---

### 5.3 飲食紀錄頁（Food Logs）

- 顯示：
  - raw food logs（列表）
  - 當日相關 metrics（唯讀）

- 禁止：
  - 由食物列表即時計算熱量總和
  - 前端自行加總或修正數值

---

### 5.4 運動紀錄頁（Workout Logs）

- 顯示：
  - raw workout logs
  - 後端計算後的消耗指標

- 禁止：
  - 依動畫或即時輸入改變消耗數值

---

### 5.5 演算法庫頁（Algorithm Library）

- 僅顯示：
  - 演算法名稱
  - 說明文字
  - 版本號
  - 輸入與輸出描述

- 明確禁止：
  - 在前端重現計算公式
  - 提供即時計算工具

---

### 5.6 社群頁（Community）

- 僅可顯示：
  - 經 Visibility Policy 過濾後的結果資料

- 禁止：
  - 顯示 raw logs
  - 顯示可反推出隱私的數值
  - 顯示時間戳細節

---

## 6. 前端與後端的資料契約（Data Contract）

前端僅可依賴以下資料來源：

- quest_results_daily
- game_state
- metrics_daily

前端 **不得假設**：
- 資料更新頻率
- 算法永遠不變
- 今日邏輯與昨日相同

---

## 7. 架構違規示例（Anti-Patterns）

以下行為視為嚴重錯誤：

- 「前端先顯示變化，之後再等後端修正」
- 「這個數值前端算比較快」
- 「動畫順便當進度條」

---

## 8. 本文件的地位（Authority）

Architecture Spec
UI Contract UI Design > Component Implementation
---

## 9. 結語

本文件的目的不是讓前端變笨，
而是確保 **系統的智慧只存在一個地方：後端算法**。

只要遵守本契約：
- 前端可以自由設計
- 系統邏輯永遠不會分裂

---

