
# Algorithm Execution Order Specification  
# 演算法執行順序與依賴正式規格

---

## 0. 文件定位（Document Positioning）

本文件定義系統中 **所有資料計算、狀態更新、指標產生的唯一合法執行順序**。

任何演算法、任務、指標、遊戲化邏輯：
- ✅ 可以新增
- ❌ 不可改變本文件定義的層級順序
- ❌ 不可建立跨層反向依賴

本文件是防止系統「越改越亂」的**硬性地基**。

---

## 1. 核心原則（Hard Principles）

1. **單向資料流（Unidirectional Execution）**
2. **分層計算（Layered Evaluation）**
3. **失敗即停止（Fail Fast, No Skip）**
4. **同一日期、同一使用者，執行順序必須一致**

---

## 2. 系統執行層級定義（Execution Layers）

系統計算被嚴格劃分為四層，層級不可變動。

---

### Layer 0：Raw Event Layer（事實層）

#### 角色
記錄使用者行為事實，不進行任何解釋。

#### 輸入
- 使用者輸入
- 裝置同步資料（若有）

#### 輸出
- body_logs
- food_logs
- workout_logs

#### 限制
- 不可依賴任何 Derived Data
- 不可自動推導任何指標
- 不可觸發後續層級的「部分執行」

---

### Layer 1：Quest Evaluation Layer（任務判定層）

#### 角色
根據定義好的規則，判定使用者是否完成任務。

#### 輸入
- Raw Event Layer
- Quest Definitions
- Quest Rules（含版本）

#### 輸出
- quest_results_daily

#### 限制
- 不可依賴 metrics
- 不可依賴 game_state（除非規則明確允許歷史值）
- 每一個判定結果必須可回放

---

### Layer 2：Game State Layer（遊戲狀態層）

#### 角色
維護跨日期的長期狀態。

#### 輸入
- quest_results_daily
- 前一日 game_state

#### 輸出
- game_state（streak、xp、level…）

#### 限制
- 不可直接讀取 Raw Logs
- 不可回寫 quest_results
- 不可依賴 metrics

---

### Layer 3：Metrics Calculation Layer（指標計算層）

#### 角色
產出對使用者與社群顯示的描述性數值。

#### 輸入
- Raw Logs
- quest_results_daily
- game_state
- user_profile

#### 輸出
- metrics_daily

#### 限制
- Metrics 僅為結果，不可反向影響系統狀態
- 不可觸發任務或遊戲化判定

---

## 3. 合法依賴矩陣（Dependency Matrix）

| From \\ To | Raw | Quest | Game | Metrics |
|-----------|-----|-------|------|---------|
| Raw       | ❌  | ✅    | ❌   | ✅      |
| Quest     | ❌  | ❌    | ✅   | ✅      |
| Game      | ❌  | ❌    | ❌   | ✅      |
| Metrics   | ❌  | ❌    | ❌   | ❌      |

❌ = 永遠禁止  
✅ = 明確允許

---

## 4. 單日執行流程（Per User / Per Date）

對於任一使用者、任一日期，合法執行流程如下：

1. 收集並確認 Raw Logs
2. 執行所有 Quest Evaluation
3. 更新 Game State
4. 計算 Metrics

任何步驟失敗：
- ❌ 不得跳過
- ❌ 不得只執行後半段
- 必須回傳失敗狀態

---

## 5. 新增演算法或規則的強制要求

新增任何一個以下項目時：
- 指標
- 任務
- 遊戲化規則

**必須明確標示：**
1. 所屬 Layer
2. 所使用的輸入來源
3. 是否影響其他層級
4. 是否符合本文件依賴矩陣

不符合者，視為架構違規。

---

## 6. 常見錯誤模式（Anti-Patterns）

以下情境明確禁止：

- Quest 判定使用 metrics_daily
- Game State 依賴 calories / bmr
- Metrics 回寫 quest 結果
- 前端模擬部分計算流程

---

## 7. 文件階層關係（Authority Order）

Architecture Specification
Execution Order Specification Algorithm Catalog > Quest / Game Rules > Implementation
---

## 8. 結語

本文件的存在，是為了保證一件事：

> **無論系統成長到多複雜，  
> 你永遠知道「先算什麼、後算什麼」。**

只要本文件不被破壞：
- 系統可持續演進
- 歷史結果永遠可信
- 開發不會失控

---



