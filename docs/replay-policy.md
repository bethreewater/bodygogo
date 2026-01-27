
# Data Replay & Recompute Policy  
# 資料回放與重算正式規格

---

## 0. 文件定位（Document Positioning）

本文件定義系統中 **所有資料是否可以、以及如何被重新計算（recompute / replay）** 的唯一合法規則。

本文件的目標不是限制修正錯誤，
而是防止系統在未受控的情況下「回頭改寫歷史」。

本文件優先於：
- 除錯需求
- 效能優化需求
- UI 顯示需求

---

## 1. 資料類型分類（Data Classification）

系統中的資料被嚴格分為兩大類：

---

### 1.1 Immutable Facts（不可變事實）

#### 定義
直接來自使用者的行為紀錄。

#### 包含
- body_logs
- food_logs
- workout_logs

#### 規則
- 一旦寫入即視為事實
- 不因任何演算法修改而改變
- 不允許批次重算或覆寫

---

### 1.2 Derived Data（衍生資料）

#### 定義
系統根據事實資料所產生的解釋性結果。

#### 包含
- quest_results_daily
- game_state
- metrics_daily

#### 特性
- 可被重新計算
- 但必須遵守本文件限制

---

## 2. 重算等級定義（Recompute Levels）

所有 Derived Data 必須被標記其 **重算等級**。

---

### Level A：禁止重算（Never Recompute）

#### 包含
- quest_results_daily
- streak_days
- 任何已對社群公開的歷史結果

#### 原因
- 直接影響使用者信任
- 破壞歷史連續性
- 影響社群公平性

---

### Level B：限制性重算（Conditional Recompute）

#### 包含
- game_state（xp、level 等）
- quest_completion

#### 允許條件
- 嚴重演算法錯誤
- 明確紀錄原因
- 不影響已公開歷史排名或狀態

---

### Level C：允許重算（Recomputable）

#### 包含
- 描述型指標（Descriptive Metrics）
  - bmr
  - calories_in
  - calories_out
  - net_calories
  - 趨勢相關指標

#### 規則
- 必須標記使用的 algorithm_version
- 重算行為必須可審計

---

## 3. 合法重算觸發條件（Allowed Triggers）

重算 **僅允許** 在以下情況發生：

1. 已確認的演算法錯誤（bug）
2. 遺漏或修正 raw data（由使用者主動修改）
3. 新算法僅套用於未來資料
4. 經人工批准的歷史回放（研究 / 分析用途）

---

## 4. 重算執行流程（Mandatory Procedure）

任何重算行為 **必須遵循以下流程**：

1. 明確指定：
   - 使用者
   - 日期範圍
2. 指定：
   - 使用的 algorithm_version
3. 記錄：
   - 重算原因
   - 執行時間
   - 執行者
4. 產生新的結果版本
5. 不得無聲覆寫原始結果

---

## 5. 嚴格禁止行為（Hard Prohibitions）

以下行為視為嚴重違規：

- 因數值「看起來不合理」而重算
- 因 UI 顯示需求而重算歷史資料
- 自動對所有歷史資料套用新算法
- 未留任何紀錄的批次重算

---

## 6. 前端與社群的影響限制

- 社群已顯示的歷史資料：
  - 一律視為不可變
- 若因重大錯誤必須調整：
  - 必須明確標示「資料已修正」
  - 不得默默改動

---

## 7. 文件階層關係（Authority Order）

Architecture Specification
Replay Policy Versioning Policy > Implementation
---

## 8. 結語

本文件的存在，是為了確保一件事：

> **時間一旦過去，就不會被悄悄改寫。**

遵守本政策：
- 系統永遠可信
- 使用者不會被歷史背叛
- 開發者可以安心修正錯誤

---

