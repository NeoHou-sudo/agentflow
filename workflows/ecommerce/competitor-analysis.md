# 🔍 E-commerce Competitor Analysis Workflow / 竞品分析工作流

> **适用场景**: 对已有竞品进行深度分析，找出差距和机会  
> **来源**: Amazon.ca operation agent  
> **难度**: ⭐⭐⭐

---

## 📝 Exact Prompt / 完整提示词

### 中文版

```
你是一位跨境电商竞品分析专家。我需要你帮我深度分析 Amazon.ca 上的竞争对手。

## 目标竞品
- 产品链接或名称：[粘贴链接]
- 定位：([高端/中端/性价比])

## 分析维度

### 1. Listing 质量评估
- 标题关键词布局
- 图片质量（数量、场景、功能展示）
- A+ 内容是否有
- Bullet points 完整度
- 评分与评价数量

### 2. 定价策略分析
- 当前价格：$CAD X
- 历史价格波动（如果能看到）
- 优惠券/Deal 频率

### 3. 流量来源推测
- 自然搜索排名靠前的关键词
- 广告投放推测（关键词覆盖）

### 4. 差异化机会
- 竞品的弱点（差评中找）
- 买家未满足的需求
- 可以超越的空间

### 5. 行动建议
- 我的产品应该如何差异化
- 定价建议
- Listing 优化优先级

请给出结构化报告，结论先行。
```

### English Version

```
You are a cross-border e-commerce competitor analysis expert. Help me deeply analyze competitors on Amazon.ca.

## Target Competitor
- Product link: [paste link]
- Positioning: ([Premium/Mid-range/Budget])

## Analysis Dimensions

1. **Listing Quality**
   - Title keyword structure
   - Image quality (count, scenarios, features)
   - A+ content?
   - Bullet points completeness
   - Rating & review count

2. **Pricing Strategy**
   - Current price: $CAD X
   - Price history (if visible)
   - Coupon/Deal frequency

3. **Traffic Source Analysis**
   - Organic ranking keywords
   - Ad spend estimation

4. **Differentiation Opportunities**
   - Competitor weaknesses (from negative reviews)
   - Unmet buyer needs
   - Room for improvement

5. **Actionable Recommendations**
   - How should my product differentiate
   - Pricing suggestions
   - Listing optimization priorities

Provide structured report with conclusions first.
```

---

## 📊 Expected Output Format

```markdown
# 竞品分析报告

## 结论
✅ [值得借鉴] / ⚠️ [谨慎模仿] / ❌ [避开]

## 1. Listing 质量
| 维度 | 评分(1-10) | 说明 |
|------|------------|------|
| 标题 | X | X |
| 图片 | X | X |
| A+ | ✅/❌ | X |

## 2. 定价区间
| 定价 | 市场份额 | 竞争强度 |
|------|----------|----------|
| $X-$Y | X% | 🟢 |
| $Y-$Z | X% | 🟡 |
| $Z-$W | X% | 🔴 |

## 3. 差异化机会
| 机会点 | 竞品弱点 | 可行性 |
|--------|----------|--------|
| X | X | ⭐⭐⭐ |

## 4. 行动建议
1. [优先级排序的优化建议]
```

---

*Version 1.0 | 2026-06-01*
