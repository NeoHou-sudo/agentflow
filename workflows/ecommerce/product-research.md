# 🛒 E-commerce Product Research Workflow / 电商选品调研工作流

> **适用场景 / Use Case**: 新品市场调研、选品分析  
> **来源 / Source**: Real Amazon.ca laptop export operation  
> **难度 / Difficulty**: ⭐⭐⭐ Intermediate

---

## 📋 Workflow Description / 工作流描述

通过 AI Agent 进行系统化选品调研，确定产品是否有市场机会。

**English**: Systematically research product market opportunity using AI Agent.

**中文**: 系统化分析产品市场机会，判断是否值得进入。

---

## 🎯 When to Use / 何时使用

- 你发现了一个看起来不错的芯片平台（如 J4125、N5095）
- 你想确认这个产品在目标市场（Amazon.ca）是否有需求
- 你需要评估竞争激烈程度（白牌密度）

---

## 📝 Exact Prompt / 完整提示词

### 中文版

```
你是一位跨境电商选品专家。我需要你帮我分析一款笔记本电脑是否值得在 Amazon.ca 加拿大站销售。

## 产品信息
- 芯片平台：[J4125 / N5095 / Ryzen 3500U / 其他]
- 屏幕尺寸：[14寸 / 15.6寸]
- 屏幕类型：[TN / IPS]
- 分辨率：[1366x768 / 1920x1080]
- 配置：[8G+0 / 0+0 / 其他]
- 其他特性：[指纹、背光、Type-C 等]

## 我需要你帮我分析

1. **市场机会评估**
   - 在 Amazon.ca 搜索这个品类的关键词，估算月销量
   - 搜索 "[芯片型号] laptop" 查看竞争对手数量
   - 计算白牌占比（白牌数/总结果数）

2. **竞争分析**
   - 列出主要竞品（TOP 10）的价格区间
   - 找出价格空缺区间（高价、低价）

3. **定价建议**
   - 基于成本 [X元]，建议售价区间
   - 考虑 FBA 费用后的毛利估算
   - 给出保本价和目标价

4. **风险提示**
   - 主要风险点（认证、品牌、竞争等）
   - 是否有坑需要注意

请给出结构化的分析报告，结论先行。
```

### English Version

```
You are a cross-border e-commerce product research expert. Help me analyze whether a laptop product is worth selling on Amazon.ca.

## Product Info
- Chipset: [J4125 / N5095 / Ryzen 3500U / Other]
- Screen: [14" / 15.6"]
- Display type: [TN / IPS]
- Resolution: [1366x768 / 1920x1080]
- Config: [8GB+0 / 0+0 / Other]
- Features: [Fingerprint, Backlight, Type-C, etc.]

## Analyze

1. **Market Opportunity**
   - Search Amazon.ca for this category, estimate monthly sales
   - Search "[chipset] laptop" to count competitors
   - Calculate white-box ratio (white-box / total results)

2. **Competitive Analysis**
   - List TOP 10 competitors' price ranges
   - Find price gap opportunities

3. **Pricing Strategy**
   - Based on cost [X], suggest selling price range
   - Calculate margin after FBA fees
   - Give break-even and target prices

4. **Risk Assessment**
   - Main risks (certification, brand, competition)
   - Watch out for pitfalls

Provide structured analysis with conclusions first.
```

---

## 📊 Expected Output Format / 预期输出格式

```markdown
# 选品分析报告 / Product Research Report

## 结论 / Summary
✅ [值得进入] / ⚠️ [谨慎] / ❌ [不建议]

## 1. 市场机会 / Market Opportunity
| 指标 | 数值 |
|------|------|
| 搜索结果数 | X |
| 预估月销量 | X |
| 白牌占比 | X% |
| 市场评级 | 🟢 蓝海 / 🟡 中等 / 🔴 红海 |

## 2. 竞争分析 / Competitive Analysis
| 价格区间 | 玩家数量 | 机会评估 |
|----------|----------|----------|
| $X-$Y | X | 🟢 高机会 |
| $Y-$Z | X | 🟡 中等 |
| $Z-$W | X | 🔴 饱和 |

## 3. 定价建议 / Pricing
| 指标 | 数值 |
|------|------|
| 成本价 | ¥X |
| 建议售价 | $CAD X |
| FBA 费用估算 | ~$CAD X |
| 预估毛利 | ~X% |

## 4. 风险评估 / Risks
| 风险 | 等级 | 应对方案 |
|------|------|----------|
| X | ⚠️ | X |
```

---

## 🔧 Customization Tips / 定制化建议

1. **加入自己的成本**: 替换 `[X元]` 为实际采购成本
2. **加入竞品链接**: 在 AI 分析时粘贴竞品链接获取更准确数据
3. **调整目标市场**: 加拿大站换成美国、英国、德国等

---

## ✅ Real Example / 真实案例

> **产品**: 14寸 J4125, 8G+0, TN 1366x768, 无指纹背光  
> **成本**: ¥790/台  
> **分析结果**: Amazon.ca 搜索结果约 200 个，白牌占比约 15%，中等机会  
> **建议售价**: $CAD 220-250  
> **预估毛利**: 约 15-20%  
> **结论**: 🟡 可尝试，需要优化 listing 和积累 reviews

---

*Workflow version: 1.0 | Last updated: 2026-06-01*
