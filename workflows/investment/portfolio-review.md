# 📊 Investment Portfolio Review Workflow / 持仓诊断工作流

> **适用场景**: 定期诊断自己的投资持仓，发现问题并给出调整建议  
> **来源**: 投资顾问 Agent，¥128K 资管经验  
> **难度**: ⭐⭐⭐

---

## 📝 Exact Prompt / 完整提示词

### 中文版

```
你是一位投资顾问。请帮我诊断我的基金投资持仓。

## 当前持仓（截至 [日期]）
| 基金名称 | 持仓金额 | 日投额 | 类别 |
|----------|----------|--------|------|
| [基金A] | ¥X | X元/日 | [类别] |
| [基金B] | ¥X | X元/日 | [类别] |
... |

## 资金情况
- 活期现金：¥X
- 月收入：约 ¥X
- 可用于追加投资的金额：¥X

## 我的投资目标
- 投资周期：[1年/5年/10年]
- 风险偏好：[保守/稳健/积极]
- 资产配置目标：[列出目标比例]

## 我需要你帮我

1. **持仓健康度检查**
   - 当前各资产类别的实际占比 vs 目标占比
   - 是否存在严重超配/低配
   - 需要调整的优先级排序

2. **定投效率分析**
   - 当前日投金额分配是否合理
   - 哪些基金需要增加/减少/暂停

3. **具体调整建议**
   - 立即该做什么（如果有）
   - 1-3个月内的操作计划
   - 1年后的预期效果

4. **风险预警**
   - 是否有集中风险（单一类别占比过高）
   - 相关性风险（高度相关资产过度集中）
   - 黑天鹅对冲是否充分

请给出结构化报告，结论先行。
```

### English Version

```
You are an investment advisor. Help me review my fund portfolio.

## Current Holdings (as of [date])
| Fund Name | Amount | Daily Invest | Category |
|-----------|--------|--------------|----------|
| [Fund A] | ¥X | ¥X/day | [Category] |
...

## Capital Situation
- Cash reserves: ¥X
- Monthly income: ~¥X
- Available for additional investment: ¥X

## My Investment Goals
- Horizon: [1Y/5Y/10Y]
- Risk tolerance: [Conservative/Moderate/Aggressive]
- Target allocation: [list target ratios]

## Analyze

1. **Portfolio Health Check**
   - Current vs target allocation by asset class
   - Any severe over/under-allocation
   - Priority ranking for rebalancing

2. **DCA Efficiency Analysis**
   - Is daily investment allocation reasonable
   - Which funds need increase/decrease/pause

3. **Actionable Recommendations**
   - Immediate actions (if any)
   - 1-3 month action plan
   - Expected outcome in 1 year

4. **Risk Alerts**
   - Concentration risk (single class >40%)
   - Correlation risk (highly correlated assets)
   - Black swan hedge adequacy

Provide structured report with conclusions first.
```

---

## 📊 Expected Output Format

```markdown
# 持仓诊断报告 / Portfolio Review

## 综合评分
⭐⭐⭐⭐☆ (X/10)

## 核心结论
[1句话总结]

## 1. 资产配置健康度 / Allocation Health

| 类别 | 当前占比 | 目标占比 | 偏差 | 优先级 |
|------|----------|----------|------|--------|
| 美股 | X% | 20% | +X% ⚠️ | P1 |
| 黄金 | X% | 15% | -X% ⚠️ | P1 |

## 2. 定投调整建议 / DCA Adjustments

| 基金 | 当前日投 | 建议 | 原因 |
|------|----------|------|------|
| [基金] | X元 | → Y元 | X |

## 3. 行动计划 / Action Plan

### 立即执行
- [ ] 科创板：25元/日 → 60元/日

### 1-3个月内
- [ ] 卖出/转换 X 基金

## 4. 风险预警 / Risk Alerts
⚠️ [风险描述] → [应对方案]

## 5. 1年后预期 / 1-Year Projection
| 类别 | 1年后存量 | 占比 | 目标 | 状态 |
|------|-----------|------|------|------|
```

---

*Version 1.0 | 2026-06-01*
