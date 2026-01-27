
# Algorithm Versioning & Deprecation Policy  
# 演算法版本與淘汰正式規格

---

## 0. 文件定位（Document Positioning）

本文件定義系統中 **所有演算法、任務規則、遊戲化規則的版本管理方式**。

本文件的存在目的是確保：
- 規則可以修改
- 系統可以演進
- 歷史資料永遠可被正確解釋

本文件優先於：
- 實作細節
- 效能最佳化
- UI 行為需求

---

## 1. 適用範圍（Scope）

本政策適用於下列所有邏輯：

- Algorithm Catalog 中定義的所有 metrics
- Quest Evaluation Rules
- Game State Rules（streak / xp / level）
- 任一影響數值語意的判定邏輯

---

## 2. 核心原則（Hard Principles）

1. **演算法一定會改，因此必須版本化**
2. **歷史資料不得被無聲修改**
3. **版本是資料的一部分，不是程式細節**
4. **新版本預設只影響未來資料**

---

## 3. 版本格式（Version Format）

所有演算法與規則 **必須使用 Semantic Versioning**：

MAJOR.MINOR.PATCH
### 3.1 PATCH（修補）
- 修正實作錯誤
- 不改變語意輸出
- 不影響歷史解釋

### 3.2 MINOR（行為調整）
- 調整公式或條件
- 核心語意一致
- 僅影響新資料

### 3.3 MAJOR（語意變更）
- 指標或規則意義改變
- 使用者解讀方式改變
- 嚴禁影響歷史資料

---

## 4. 什麼情況必須升版本

以下任一行為 **必須升版本**：

- 公式變更
- 輸入依賴變更
- 邊界條件調整
- 缺值處理方式改變
- 判定條件改變
- 四捨五入或取整規則改變

---

## 5. 歷史資料處理規則（Historical Integrity）

### 5.1 預設行為

- 新資料使用新版本
- 舊資料維持原版本
- 每一筆 derived data 必須標記版本號

---

### 5.2 禁止行為（Hard Prohibitions）

- 直接覆寫歷史 metrics
- 使用新版本重新解釋舊行為
- 修改歷史結果而未留下紀錄
- 因 UI 需求修改演算法版本

---

## 6. 演算法淘汰（Deprecation Policy）

### 6.1 淘汰定義

- 淘汰 ≠ 刪除
- 被淘汰的版本：
  - 不再用於新資料
  - 必須仍可查詢與解釋歷史資料

---

### 6.2 淘汰流程

1. 標記版本為 deprecated
2. 停止新資料使用
3. 保留文件與對照能力
4. 禁止刪除歷史版本

---

## 7. 對前端與文件的要求

- 前端不得假設算法永遠不變
- 文件必須記錄：
  - 當前版本
  - 歷史版本
  - 版本差異說明

---

## 8. 文件階層關係（Authority Order）

Architecture Specification
Versioning Policy Algorithm Catalog > Implementation
---

## 9. 結語

本文件的目標只有一個：

> **讓你可以放心改規則，而不用害怕歷史資料被毀。**

只要遵守本政策：
- 系統永遠可信
- 改動永遠可控
- 技術債不會失控

---

