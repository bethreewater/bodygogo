
# Algorithm & Quest Testing / Validation Policy  
# 演算法、任務與系統驗證正式規格

---

## 0. 文件定位（Document Positioning）

本文件定義 **所有會影響系統語意、數值、狀態的邏輯，在上線前必須通過的最低驗證標準**。

本文件的目的不是追求 100% 覆蓋率，
而是防止以下三件事發生：

1. 改了算法卻不知道影響誰
2. 修了 bug 卻悄悄改變歷史行為
3. 系統因害怕回歸錯誤而不敢演進

---

## 1. 測試適用範圍（Scope）

本政策適用於：

- Algorithm Catalog 中定義的所有 metrics
- Quest Evaluation Rules
- Game State Rules（streak / xp / level）
- Execution Order
- Community Visibility Rules

---

## 2. 測試層級定義（Testing Layers）

所有變更 **至少必須通過對應層級的測試**。

---

### 2.1 Unit Test（單一規則驗證）

#### 目的
驗證單一算法或規則在隔離情境下的正確性。

#### 必測內容
- 正常輸入
- 邊界輸入
- 缺值輸入
- 不合法輸入

#### 適用對象
- 單一 metric
- 單一 quest rule
- 單一 game rule

---

### 2.2 Integration Test（跨層一致性驗證）

#### 目的
驗證跨層資料流是否正確、無反向依賴。

#### 必測內容
- Raw → Quest → Game → Metrics 順序
- 多個算法共同運作結果一致
- 任一層失敗是否正確阻斷後續層

---

### 2.3 Regression Test（回歸驗證）

#### 目的
確保新版本未破壞既有行為。

#### 必測內容
- 舊版本與新版本輸出差異是否符合預期
- 不相關指標是否維持不變
- 歷史資料是否未被影響

---

### 2.4 Snapshot Test（歷史快照驗證）

#### 目的
確保在固定輸入與固定版本下，輸出永遠一致。

#### 必測內容
- 固定一組 raw logs
- 固定一組 algorithm_version
- 輸出結果完全相同

---

## 3. 任務系統專屬測試要求（Quest-Specific）

每一個 Quest Rule **必須至少測試以下情境**：

- 任務完成
- 任務未完成
- 邊界情況（剛好達標）
- 完全無輸入

並驗證：
- quest_results_daily.status
- progress_value / target_value

---

## 4. 遊戲化系統專屬測試（Game State）

必須涵蓋：

- streak 正常累積
- streak 中斷
- streak 重啟
- 跨日期連續性
- 不可回算行為驗證

---

## 5. 社群與隱私驗證（Visibility & RLS）

必須驗證：

- 不同 visibility level 的資料正確過濾
- 無法透過 API 推測不可見資料
- RLS 規則正確執行
- UI 不因空值或缺值洩漏資訊

---

## 6. 上線前最低門檻（Release Gate）

任何影響算法、任務、遊戲化或可見性的變更 **不得上線**，除非：

- Algorithm Catalog 已更新
- Versioning Policy 已遵守
- Replay Policy 無違規
- 對應測試全部通過
- Governance 流程完成

---

## 7. 禁止行為（Hard Prohibitions）

以下行為視為嚴重違規：

- 無測試即上線
- 只測新功能，不測舊行為
- 因時間壓力略過回歸測試
- 以 UI 驗證取代邏輯驗證

---

## 8. 文件階層關係（Authority Order）

Architecture Specification
Testing Policy Governance Policy > Implementation
---

## 9. 結語

本測試政策的存在，是為了確保：

> **你可以放心修改系統，而不用靠祈禱它不會壞。**

只要遵守本文件：
- 系統可以持續演進
- 歷史行為永遠可信
- 開發決策不再靠運氣

---

