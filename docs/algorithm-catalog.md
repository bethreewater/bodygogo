
# Algorithm Catalog Specification  
# 演算法庫正式規格文件（Single Source of Truth）

---

## 0. 文件定位（Document Positioning）

本文件定義本系統中 **所有演算法、指標、數值與狀態的唯一權威來源**。

任何出現在系統中的數值：
- 必須在本文件中被定義
- 必須有清楚的語意
- 必須可被版本化
- 必須可被歷史解釋

未在本文件中定義之數值，視為 **非法指標**。

---

## 1. Algorithm Catalog 的責任範圍

Algorithm Catalog 負責定義：

1. 系統中存在哪些指標（Metrics）
2. 每一個指標的：
   - 語意定義
   - 輸入來源
   - 計算規則
   - 輸出型別
3. 指標之間的依賴關係
4. 演算法的版本演進規則

本文件 **不負責**：
- 程式碼實作
- 計算效能
- UI 呈現方式

---

## 2. 指標分類（Metric Classification）

所有指標必須且僅能屬於以下其中一類：

### 2.1 Descriptive Metrics（描述型指標）
- 描述使用者狀態
- 不直接影響任務或遊戲化判定

### 2.2 Behavioral Metrics（行為結果指標）
- 由使用者行為結果推導
- 可影響任務完成與打卡判定

### 2.3 Game Metrics（遊戲狀態指標）
- 反映長期狀態
- 與健康事實無直接等價關係

### 2.4 Projection Metrics（預測型指標）
- 基於當前狀態與目標預測未來
- 用於輔助決策與規劃
- 不影響遊戲化判定


---

## 3. 指標定義強制格式（Mandatory Definition Schema）

每一個指標 **必須完整定義以下欄位**。

### 3.1 基本資訊

- `metric_id`  
  系統內唯一識別碼（不可重用）

- `category`  
  descriptive / behavioral / game

- `description`  
  人類可讀語意定義，不得包含實作細節

- `unit`  
  kg / kcal / kcal_day / ratio / boolean / days

---

### 3.2 輸入定義（Inputs）

- `input_sources`  
  raw_logs / quest_results / game_state / user_profile

- `required_inputs`  
  缺失即無法計算

- `optional_inputs`  
  缺失時的處理規則必須明確定義

---

### 3.3 計算規則（Computation）

- `algorithm_version`
- `calculation_frequency`  
  per_event / daily / rolling

- `formula_description`  
  文字描述，不寫程式碼

- `rounding_rule`
- `edge_case_handling`

---

### 3.4 輸出定義（Output）

- `output_type`  
  numeric / integer / boolean

- `output_range`
- `nullability`

---

## 4. 指標依賴規則（Dependency Rules）

### 4.1 合法依賴

- Descriptive ← Raw Logs / User Profile
- Behavioral ← Raw Logs / Quest Results
- Game ← Quest Results / Game State（歷史）

### 4.2 禁止依賴

- 任務判定 ← Metrics
- 任意指標 ← 未來日期資料
- Descriptive ← Game Metrics

---

## 5. 標準指標定義（Authoritative Metrics）

---

### 5.1 `weight_kg`

- category: descriptive  
- unit: kg  
- input_sources: raw_logs  
- required_inputs: body_logs.weight_kg  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
指定日期中最後一筆有效體重紀錄。

**邊界處理**
- 當日無體重紀錄 → 使用最近一次有效體重
- 無任何歷史紀錄 → 輸出 null

---

### 5.2 `bmr`（Basal Metabolic Rate）

- category: descriptive  
- unit: kcal_day  
- input_sources: raw_logs, user_profile  
- required_inputs:
  - body_logs.weight_kg
  - user_profile.height_cm
  - user_profile.age
  - user_profile.sex  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
使用者在完全靜息狀態下，每日維持基本生命機能所需的能量消耗。

**計算規則（文字描述）**  
採用 Mifflin–St Jeor 方程式，依性別計算。

**邊界處理**
- 任一 required_input 缺失 → 輸出 null
- 當日無體重 → 使用最近一次有效體重
- 性別未定義 → 輸出 null

**架構限制**
- 不得直接用於任務判定
- 可作為熱量相關指標之輸入

---

### 5.3 `calories_in`

- category: descriptive  
- unit: kcal  
- input_sources: raw_logs  
- required_inputs: food_logs.calories  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
指定日期中所有有效飲食紀錄之熱量總和。

---

### 5.4 `calories_out`

- category: descriptive  
- unit: kcal  
- input_sources: raw_logs  
- required_inputs: workout_logs.calories  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
指定日期中所有運動紀錄之估計能量消耗總和。

---

### 5.5 `net_calories`

- category: descriptive  
- unit: kcal  
- input_sources: metrics  
- required_inputs: calories_in, calories_out  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
net_calories = calories_in − calories_out

---

### 5.6 `quest_completion`

- category: behavioral  
- unit: ratio  
- input_sources: quest_results  
- required_inputs:
  - completed_quests
  - assigned_quests  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
當日完成任務數 ÷ 當日指派任務數。  
若 assigned_quests = 0 → 輸出 null。

---

### 5.7 `checkin_done`

- category: behavioral  
- unit: boolean  
- input_sources: quest_results  
- required_inputs: quest_results.status  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
當日至少完成一項被標記為 checkin_relevant 的任務。

---

### 5.8 `streak_days`

- category: game  
- unit: days  
- input_sources: quest_results, game_state(history)  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
連續符合 streak 規則之天數。

**限制**
- 不可回算
- 不可被 metrics 影響

---

## 5.9 Layer 5: Projection Metrics (預測層)

---

### 5.9.1 `tdee`（Total Daily Energy Expenditure）

- category: projection  
- unit: kcal_day  
- input_sources: metrics, user_profile  
- required_inputs:
  - bmr
  - user_profile.activity_level  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
使用者每日總能量消耗，包含基礎代謝與活動消耗。

**計算規則**  
TDEE = BMR × Activity_Multiplier

Activity_Multiplier:
- sedentary: 1.2
- light: 1.375
- moderate: 1.55
- active: 1.725
- very_active: 1.9

**邊界處理**
- BMR 為 null → 輸出 null
- activity_level 未定義 → 使用 sedentary (1.2)

---

### 5.9.2 `lbm`（Lean Body Mass）

- category: projection  
- unit: kg  
- input_sources: metrics, raw_logs  
- required_inputs: weight_kg  
- optional_inputs: body_fat_percent  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
去脂體重，即體重中非脂肪組織的重量。

**計算規則**  
LBM = Weight × (1 - Body_Fat_Percent)

**邊界處理**
- body_fat_percent 缺失時使用預設值：
  - 女性: 28%
  - 男性: 20%
- weight_kg 為 null → 輸出 null

---

### 5.9.3 `min_intake`（Minimum Safe Calorie Intake）

- category: projection  
- unit: kcal_day  
- input_sources: metrics, user_profile  
- required_inputs:
  - weight_kg
  - bmr
  - user_profile.sex  
- optional_inputs: body_fat_percent  
- algorithm_version: 2.0.0  
- calculation_frequency: daily  

**定義**  
最低安全熱量攝入，低於此值可能導致健康風險。

**計算規則**  
- **女性**: LBM × 30 kcal/day（低於此數值會導致下視丘閉經 FHA）
- **男性**: BMR（不得低於基礎代謝率）

**健康約束**  
此數值為安全底線，任何減重計畫不得低於此攝入量。

**邊界處理**
- BMR 為 null → 輸出 null
- 女性：body_fat_percent 缺失時使用預設值 28%
- 男性：直接使用 BMR，不需要 body_fat_percent
- sex 未定義 → 使用女性標準（更嚴格）

---

### 5.9.4 `goal_projection`（Goal Achievement Timeline）

- category: projection  
- unit: composite (days + date + kcal)  
- input_sources: metrics, user_profile  
- required_inputs:
  - weight_kg (current)
  - target_weight_kg
  - bmr
  - activity_level
  - sex  
- optional_inputs: body_fat_percent  
- algorithm_version: 1.0.0  
- calculation_frequency: daily  

**定義**  
基於當前狀態與安全熱量缺口，預測達成目標體重的時間線。

**計算規則**  
1. 計算 TDEE
2. 計算 LBM 與 min_intake
3. 計算安全每日缺口 = TDEE - min_intake（純粹基於生理學底線）
4. 計算所需總熱量缺口 = (current_weight - target_weight) × 7700
5. 計算天數 = 總熱量缺口 ÷ 每日缺口
6. 計算目標日期 = 今日 + 天數

**物理定律與生理學約束**  
- 1 kg 脂肪組織 ≈ 7700 kcal 能量缺口
- 安全底線由生理學決定：
  - 女性：LBM × 30 kcal（防止下視丘閉經）
  - 男性：BMR（不得低於基礎代謝）

**輸出欄位**
- days_to_goal: integer
- target_date: string (YYYY-MM-DD)
- daily_deficit: integer (kcal)
- min_intake_floor: integer (kcal)
- tdee: integer (kcal)
- is_achievable: boolean
- warning: string | null

**邊界處理**
- 任一 required_input 缺失 → is_achievable = false
- current_weight <= target_weight → days_to_goal = 0
- TDEE <= min_intake → is_achievable = false, warning 提示增加活動

**架構限制**
- 僅用於輔助決策與顯示
- 不影響任務判定或遊戲化機制
- 不可回寫至歷史狀態


---

## 6. 版本演進規則（Versioning Rules）

- 任一公式、依賴、邊界條件變更 → 必須升版本
- 舊版本不得刪除
- 歷史資料必須保留使用版本資訊

---

## 7. 文件階層關係（Authority Order）

Architecture Specification
Algorithm Catalog Quest Rules > Game Rules > Implementation
---

## 8. 結語

Algorithm Catalog 的存在，
是為了確保整個系統：

- 只有一種正確解釋
- 可以安全演進
- 永遠能回答「這個數字是怎麼來的」

---



