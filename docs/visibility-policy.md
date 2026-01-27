

# Community Visibility Policy Specification  
# 社群可見性與隱私正式規格

---

## 0. 文件定位（Document Positioning）

本文件定義 **使用者資料在社群場景中的唯一合法可見方式**。

本文件的目的不是社交互動設計，
而是 **防止健康資料在社群功能中被直接或間接推測**。

本文件優先於：
- 社群 UI 設計
- 排行榜規則
- 社交互動需求

---

## 1. 核心原則（Hard Principles）

1. **預設不可見（Default Deny）**
2. **只顯示結果，不顯示原因**
3. **禁止反向推測（Anti-Inference）**
4. **可見性屬於資料層規則，不是 UI 決定**

---

## 2. 可見性層級定義（Visibility Levels）

每位使用者的社群資料可見性 **必須明確屬於以下其中一級**。

---

### Level 0：Private（完全隱私）

#### 可見
- 無任何健康、行為、遊戲化資料

#### 用途
- 預設值
- 未開啟社群功能者

---

### Level 1：Status（狀態級）

#### 可見
- checkin_done
- streak_days
- last_active_date（日期，不含時間）

#### 不可見
- 任務內容
- 任務數量
- 任務完成原因
- 任何數值型健康資料

---

### Level 2：Progress（進度級）

#### 可見
- Level 1 全部
- quest_completion（比例，不顯示分母）
- 趨勢方向（↑ / ↓ / →，不顯示數值）

#### 不可見
- calories
- bmr
- weight
- raw logs

---

### Level 3：Detailed（明確授權）

#### 可見
- 使用者主動白名單的 metrics
- 僅限 metrics_daily 輸出

#### 限制
- 不可顯示 raw logs
- 不可顯示時間戳
- 不可顯示可反推出其他數值的組合

---

## 3. 可見性設定來源（Source of Truth）

- 所有可見性規則 **必須存在於資料層**
- 建議表：`privacy_settings`

前端：
- ❌ 不得自行決定顯示與否
- ❌ 不得透過隱藏 UI 推測資料存在與否

---

## 4. 禁止推測規則（Anti-Inference Rules）

以下即使「邏輯上可推測」，也必須禁止：

- 由 quest_completion 推測任務內容
- 由 streak 中斷推測某日行為缺失
- 由 calories_out 推測運動種類
- 由趨勢箭頭推測實際數值

---

## 5. 社群功能限制（Feature Constraints）

### 5.1 排行榜（Leaderboard）

- 僅允許使用：
  - streak_days
  - checkin_done
- 不允許使用：
  - 熱量
  - 體重
  - 任務完成比例

---

### 5.2 好友動態（Activity Feed）

- 僅顯示：
  - 狀態變化（完成 / 連續）
- 不顯示：
  - 何時
  - 如何
  - 為何完成

---

### 5.3 群組功能（若未來新增）

- 群組必須有獨立 visibility 設定
- 群組不可覆寫個人設定

---

## 6. 架構違規示例（Violations）

以下行為視為嚴重違規：

- 顯示 raw logs
- 顯示可回推出健康狀態的組合數據
- 因 UI 動畫暴露數值變化
- 未經同意擴大資料可見性

---

## 7. 文件階層關係（Authority Order）

Architecture Specification
Visibility Policy Community Features > UI Implementation
---

## 8. 結語

社群的價值在於陪伴，而非比較。

本文件確保：
- 社群永遠不會變成健康數據競賽
- 使用者不會因參與社群而暴露隱私
- 系統在擴充社交功能時仍然安全

---


