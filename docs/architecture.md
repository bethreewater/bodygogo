
# Architecture Specification  
# 系統架構正式規格文件

---

## 0. 文件定位（Document Positioning）

本文件定義本專案的**不可動搖之系統架構地基**。

任何功能擴充、演算法調整、模組新增、前後端修改：
- ✅ **可以延伸**
- ❌ **不可破壞本文件定義之結構與資料流**

本文件優先於：
- 實作程式碼
- 個別功能需求
- UI/UX 決策

---

## 1. 系統目標（System Goals）

本系統為一個**以算法為核心（Algorithm-Centric）**的健康管理平台，其目標為：

1. 長期健康資料可累積、可回溯、可解釋  
2. 所有健康語意由後端算法產生，而非前端推導  
3. 系統允許需求與玩法演進，但避免架構腐化  
4. 社群功能不影響個人資料正確性與隱私  

---

## 2. 核心不可變原則（Non-Negotiable Principles）

以下原則**不可被任何功能需求覆寫**：

### 2.1 Raw Data 與 Derived Data 必須分離
- Raw Data = 使用者輸入的事實
- Derived Data = 系統對事實的解釋

Derived Data **永遠不得回寫、修正、影響 Raw Data**。

---

### 2.2 單向資料流（Unidirectional Data Flow）

系統資料流 **只允許以下方向**：

Raw Logs → Quest Evaluation → Game State → Metrics → UI / Community
任何反向依賴皆視為**架構錯誤**。

---

### 2.3 前端不承載業務語意
前端：
- ❌ 不計算健康結論
- ❌ 不推測任務完成
- ❌ 不重算指標

前端唯一可信數據來源為後端輸出結果。

---

### 2.4 規則一定會改，因此必須可版本化
- 任務規則
- streak 規則
- 指標算法

**修改方式必須被限制，但修改本身不被禁止。**

---

## 3. 系統分層架構（Layered Architecture）

### Layer 0：Raw Event Layer（事實層）

#### 職責
記錄使用者的實際行為事實。

#### 內容
- body_logs
- food_logs
- workout_logs

#### 規則
- 僅記錄，不解釋
- 不可依賴任何 Derived Data
- 為整個系統的唯一事實來源

---

### Layer 1：Quest Evaluation Layer（行為判定層）

#### 職責
根據規則判定使用者是否完成特定行為。

#### 輸入
- Raw Event Layer
- Quest Definitions
- Quest Rules（版本化）

#### 輸出
- quest_results_daily

#### 限制
- 不可依賴 Metrics
- 不可修改 Raw Data
- 判定結果必須可重播（replayable）

---

### Layer 2：Game State Layer（長期狀態層）

#### 職責
維護跨日期的遊戲化狀態。

#### 輸入
- quest_results_daily
- 前一日 game_state

#### 輸出
- game_state（streak、xp、level…）

#### 限制
- 不得直接分析 Raw Logs
- 不得回寫任務結果

---

### Layer 3：Metrics Layer（描述指標層）

#### 職責
產出對使用者與社群顯示的描述性數值。

#### 輸入
- Raw Logs
- Quest Results
- Game State
- 使用者設定（如身高、目標）

#### 輸出
- metrics_daily

#### 限制
- Metrics 僅為描述，不可反向影響系統狀態

---

## 4. 模組劃分（Modules）

本系統至少包含以下模組：

1. 身體紀錄模組（Body）
2. 飲食紀錄模組（Food）
3. 運動紀錄模組（Workout）
4. 任務系統模組（Quest）
5. 遊戲化模組（Game）
6. 趨勢模組（Trends）
7. 社群模組（Community）
8. 算法庫模組（Algorithm Library）

模組之間**只透過定義好的資料層溝通**。

---

## 5. 架構違規定義（Architecture Violations）

以下行為明確定義為架構違規：

- Metrics 影響任務完成判定
- 前端自行推算健康結論
- 新功能引入反向資料流
- 規則修改但未版本化
- 歷史資料被無聲重算

---

## 6. 本文件的地位（Authority）

若發生衝突：

Architecture Spec
Algorithm Spec Feature Spec > Implementation
本文件為最高優先級。

---

## 7. 結語

本架構的目標不是限制功能，
而是**限制錯誤的修改方式**。

只要遵守本文件：
- 功能可以無限延伸
- 系統不會隨時間腐化
- 歷史資料永遠可信

---


