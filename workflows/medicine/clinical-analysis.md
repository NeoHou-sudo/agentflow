# 🏥 Clinical Research Analysis Workflow / 临床研究分析工作流

> **适用场景**: 分析医学文献/临床研究，辅助诊断决策  
> **来源**: 循证医学顾问 Agent  
> **难度**: ⭐⭐⭐⭐

---

## ⚠️ 免责声明 / Disclaimer

> **本工作流仅用于学习参考，不能替代专业医疗建议。**  
> **This workflow is for educational reference only, not a substitute for professional medical advice.**

---

## 📝 Exact Prompt / 完整提示词

### 中文版

```
你是一位循证医学专家。请帮我分析以下临床问题。

## 临床问题
[描述具体的临床问题，如：某药物对某疾病的疗效比较]

## 文献/证据（如有）
[粘贴相关摘要或关键数据]

## 分析要求

### 1. 证据检索与评估
- 相关的大型临床研究（RCT/系统评价）
- 证据等级评估（LEVEL A/B/C）
- 样本量与统计显著性

### 2. 疗效分析
- 主要终点指标改善
- 次要终点指标
- 绝对获益 vs 相对获益

### 3. 安全性评估
- 不良反应发生率
- 严重不良事件
- 特殊人群（老年人/肝肾功能不全）的安全性

### 4. 适用性分析
- 研究人群 vs 实际患者人群的差异
- 结果的外推性
- 临床可行性

### 5. 综合结论
- 证据质量评级（高/中/低）
- 推荐强度（强推荐/弱推荐/不推荐）
- 需要注意的局限性

请给出基于证据的分析，保持客观中立。
```

### English Version

```
You are an evidence-based medicine specialist. Help me analyze the following clinical question.

## Clinical Question
[Describe specific clinical question]

## Literature/Evidence (if any)
[Paste relevant abstracts or key data]

## Analysis Requirements

1. **Evidence Search & Evaluation**
   - Relevant large clinical trials (RCT/SR)
   - Evidence level (LEVEL A/B/C)
   - Sample size & statistical significance

2. **Efficacy Analysis**
   - Primary endpoint improvement
   - Secondary endpoints
   - Absolute vs relative benefit

3. **Safety Assessment**
   - Adverse event rate
   - Serious adverse events
   - Safety in special populations

4. **Applicability Analysis**
   - Study population vs real patient population
   - Generalizability
   - Clinical feasibility

5. **Conclusion**
   - Evidence quality (High/Medium/Low)
   - Recommendation strength (Strong/Weak/No recommendation)
   - Limitations to note

Provide evidence-based analysis with objectivity.
```

---

## 📊 Expected Output Format

```markdown
# 临床研究分析 / Clinical Analysis

## 临床问题
[描述]

## 证据质量评估

| 研究 | 类型 | 样本量 | 证据等级 |
|------|------|--------|----------|
| [研究1] | RCT | N=X | A |
| [研究2] | SR | N=X | A |

## 疗效分析

| 指标 | 干预组 | 对照组 | 差值 | 统计学意义 |
|------|--------|--------|------|------------|
| 主要终点 | X% | Y% | +Z% | ✅/❌ |

## 安全性

| 不良事件 | 发生率 | 严重程度 |
|----------|--------|----------|
| [AE] | X% | 轻/中/重 |

## 综合结论

| 评估项 | 结果 |
|--------|------|
| 证据质量 | 🔵 高 / 🟡 中 / 🔴 低 |
| 推荐强度 | ✅ 强推荐 / ⚠️ 弱推荐 / ❌ 不推荐 |
| 关键局限 | X |

## 临床建议
[基于证据的可执行建议]
```

---

*Version 1.0 | 2026-06-01*
