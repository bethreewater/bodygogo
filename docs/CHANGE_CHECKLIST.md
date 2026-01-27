
```md
# CHANGE_CHECKLIST  
# 系統變更強制檢查清單（Governance Gate）

---

## 0. 文件定位（Document Positioning）

本文件為 **任何系統變更的強制檢查清單（Hard Gate）**。

凡涉及以下任一情況：
- 演算法
- 任務規則
- 遊戲化邏輯
- 指標定義
- 歷史資料
- 社群可見性

**未完整通過本清單，不得實作、不得合併、不得上線。**

---

## 1. 架構一致性檢查（Architecture）

- [ ] 是否遵守 `architecture.md` 定義的模組與責任邊界  
- [ ] 是否維持單向資料流  
```

Raw → Quest → Game → Metrics → UI

```
- [ ] 是否引入任何反向依賴（❌ 若有直接拒絕）

---

## 2. 執行順序檢查（Execution Order）

- [ ] 是否符合 `execution-order.md`
- [ ] 是否正確標示所屬 Layer（Raw / Quest / Game / Metrics）
- [ ] 是否會影響其他 Layer 的計算順序
- [ ] 若失敗，是否會正確阻斷後續層級

---

## 3. 演算法與指標檢查（Algorithm Catalog）

- [ ] 是否修改或新增指標（metric）
- [ ] 是否已在 `algorithm-catalog.md` 中定義
- [ ] 是否明確標示：
- metric_id
- category
- inputs
- output
- [ ] 是否避免使用未定義指標（❌ 若有直接拒絕）

---

## 4. 版本與歷史檢查（Versioning）

- [ ] 是否改變算法公式或判定條件
- [ ] 是否正確升級版本（PATCH / MINOR / MAJOR）
- [ ] 是否遵守 `versioning-policy.md`
- [ ] 是否影響歷史資料
- [ ] 若是，是否被明確禁止
- [ ] 若允許，是否完整記錄

---

## 5. 資料回放與重算檢查（Replay）

- [ ] 是否觸發資料重算
- [ ] 是否符合 `replay-policy.md`
- [ ] 是否嘗試重算以下禁止項目（若是，直接拒絕）：
- streak_days
- quest_results_daily
- [ ] 是否留下完整審計紀錄

---

## 6. 任務與遊戲化檢查（Quest / Game）

- [ ] 是否修改任務完成條件
- [ ] 是否影響 streak / xp / level
- [ ] 是否讓任務依賴 metrics（❌ 嚴禁）
- [ ] 是否讓遊戲化依賴 descriptive metrics（❌ 嚴禁）

---

## 7. 前端行為檢查（UI Contract）

- [ ] 前端是否僅顯示後端結果
- [ ] 是否有任何前端計算語意數值的行為
- [ ] 是否正確使用 ready / processing / failed 狀態
- [ ] 是否使用動畫暗示數值變化（❌ 若有直接拒絕）

---

## 8. 社群與隱私檢查（Visibility）

- [ ] 是否影響社群顯示資料
- [ ] 是否符合 `visibility-policy.md`
- [ ] 是否可能被反向推測隱私
- [ ] 是否擴大可見性（若是，是否 Class C 變更）

---

## 9. 治理與責任檢查（Governance）

- [ ] 是否已分類變更等級（Class A / B / C）
- [ ] 是否取得必要核准：
- [ ] Product Owner
- [ ] System Architect
- [ ] 是否更新所有相關文件

---

## 10. 測試與驗證檢查（Testing）

- [ ] 是否新增 / 更新 Unit Tests
- [ ] 是否通過 Integration Tests
- [ ] 是否通過 Regression Tests
- [ ] 是否未影響歷史 Snapshot

---

## 11. 最終確認（Release Gate）

- [ ] 所有以上項目皆為 ✅
- [ ] 無任何「暫時跳過」
- [ ] 無任何「之後再補」

---

## 結語（不可刪）

> **本清單不是建議，而是規則。**

如果你覺得這份清單「很煩」，
代表它正在成功阻止你做出未來會後悔的決定。

-
