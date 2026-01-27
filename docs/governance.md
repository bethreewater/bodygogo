

# Algorithm & Data Governance Specification  
# 系統治理與權責正式規格

---

## 0. 文件定位（Document Positioning）

本文件定義 **誰可以修改系統的什麼部分、以什麼流程修改、誰對結果負責**。

本文件的存在不是為了官僚，
而是為了確保 **任何會影響數值語意、歷史解釋、使用者信任的改動都有責任歸屬**。

本文件優先於：
- 個人開發習慣
- 開發速度需求
- 臨時修補行為

---

## 1. 治理對象（Governed Assets）

以下項目 **全部必須受治理政策約束**：

- Algorithm Catalog 中的所有 metrics
- Quest Rules 與 Quest Definitions
- Game State Rules（streak / xp / level）
- Versioning Policy
- Replay / Recompute 行為
- Community Visibility Policy

---

## 2. 角色定義（Roles & Responsibilities）

系統治理採用「**角色責任制**」，即使同一人身兼多職，責任仍需被明確標示。

---

### 2.1 Product Owner（PO）

#### 責任
- 決定「**是否要改**」
- 決定「**改動的產品語意**」
- 評估對使用者體驗與信任的影響

#### 權限
- 核准或否決規則變更
- 核准高風險重算行為

---

### 2.2 System Architect（SA）

#### 責任
- 確保變更符合架構規格
- 防止反向依賴與結構性破壞
- 確保文件同步更新

#### 權限
- 對任何違反架構的變更 **擁有否決權（Veto）**

---

### 2.3 Implementer（Engineer / AI）

#### 責任
- 僅依文件實作
- 不自行解釋或修改規則語意
- 確保實作與文件一致

#### 限制
- 不得跳過文件直接改邏輯
- 不得自行決定算法版本

---

## 3. 變更等級分類（Change Classification）

所有變更 **必須先被分類**，再進行實作。

---

### Class A：低風險變更（Low Risk）

#### 包含
- 文件補充說明
- UI 文案與呈現調整
- 不影響數值語意的 refactor

#### 要求
- 記錄變更即可
- 不需升算法版本

---

### Class B：中風險變更（Medium Risk）

#### 包含
- 演算法公式調整
- 任務規則修改
- 邊界條件修正

#### 要求
- 升 algorithm_version（MINOR / PATCH）
- 更新 Algorithm Catalog
- 通過測試政策
- PO 或 SA 核准其一

---

### Class C：高風險變更（High Risk）

#### 包含
- 指標語意改變
- streak 規則變更
- 歷史資料重算
- 社群可見性擴大

#### 要求
- 升 MAJOR 版本
- PO + SA 共同核准
- 明確紀錄原因與影響
- 嚴格遵守 Replay Policy

---

## 4. 強制變更流程（Mandatory Change Process）

任何 Class B / C 變更 **必須完整走完以下流程**：

1. 撰寫變更說明（Why / What / Impact）
2. 標示影響範圍（資料、日期、使用者）
3. 指定版本號
4. 更新相關文件
5. 通過測試政策
6. 取得必要核准
7. 才可實作與上線

跳過任一步驟，視為治理違規。

---

## 5. 審計與可追溯性（Auditability）

系統必須能回答以下問題：

- 這個規則是誰定義的？
- 什麼時候改的？
- 為什麼要改？
- 使用的是哪個版本？

所有變更必須留下：
- 文件紀錄
- 版本紀錄
- 核准紀錄

---

## 6. 架構違規示例（Violations）

以下行為視為嚴重違規：

- 未更新文件即修改邏輯
- 未升版本即改變語意
- 未經批准即重算歷史資料
- 因方便而繞過治理流程

---

## 7. 文件階層關係（Authority Order）

Architecture Specification
Governance Policy Versioning / Replay Policy > Implementation
---

## 8. 結語

治理的目的不是拖慢開發，
而是確保：

> **每一次修改，都是可被承擔、可被解釋、可被回顧的。**

只要遵守本文件：
- 系統可以快速演進
- 但不會失控

---


