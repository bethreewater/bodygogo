
# 健康管理系統 — 文件總覽（Docs Index）

本資料夾包含本專案所有**架構級、規格級文件**。  
這些文件的目的是：

> **允許系統無限延伸，但禁止破壞性修改。**

任何人（包含你自己、工程師、或 AI）  
在修改系統核心邏輯前，**必須先閱讀並遵守這些文件**。

---

## 一、核心設計哲學（必讀）

- 本系統為 **Algorithm-Centric Architecture**
- 所有健康與行為語意由後端算法產生
- 前端僅負責顯示與互動，不承載語意
- 所有規則皆可修改，但必須：
  - 版本化
  - 可回溯
  - 不破壞歷史
- 社群功能遵守最小揭露與防推測原則

---

## 二、文件閱讀順序（強制）

請依下列順序閱讀，**不可跳過**：

1. `architecture.md`  
   👉 系統最高層架構與不可變原則

2. `ui-contract.md`  
   👉 前端責任邊界與禁止事項

3. `algorithm-catalog.md`  
   👉 所有指標與算法的唯一權威來源

4. `execution-order.md`  
   👉 Raw → Quest → Game → Metrics 的執行鎖定

5. `visibility-policy.md`  
   👉 社群資料可見性與隱私防線

6. `versioning-policy.md`  
   👉 演算法與規則如何合法修改

7. `replay-policy.md`  
   👉 什麼資料可以／不可以重算

8. `governance.md`  
   👉 誰可以改、怎麼改、誰負責

9. `testing-policy.md`  
   👉 改動前必須通過的驗證標準

---

## 三、文件權威層級（Authority Order）

當文件或需求衝突時，以下順序為最終裁決依據：

Architecture Specification
Execution Order Algorithm Catalog > Versioning / Replay Policy > Governance > Testing Policy > Feature / UI Spec > Implementation
---

## 四、變更基本規則（Summary）

- ❌ 不允許未更新文件就修改邏輯
- ❌ 不允許前端計算語意數值
- ❌ 不允許無聲修改歷史資料
- ✅ 允許演算法演進
- ✅ 允許功能擴充
- ✅ 允許重構，但需遵守架構

---

## 五、給 AI / 工程師的重要提醒

> **這不是參考文件，而是系統憲法。**

任何「為了方便」而違反文件的行為，
都視為技術債與治理失敗。

---


