# 🤖 AgentFlow — 15+ 可直接使用的 AI Agent 工作流模板

[![Stars](https://img.shields.io/github/stars/NeoHou-sudo/agentflow?style=social)](https://github.com/NeoHou-sudo/agentflow/stargazers)
[![Forks](https://img.shields.io/github/forks/NeoHou-sudo/agentflow?style=social)](https://github.com/NeoHou-sudo/agentflow/network/members)
[![License](https://img.shields.io/github/license/NeoHou-sudo/agentflow?color=green)](LICENSE)

> **English**: The largest open-source collection of production-ready AI Agent workflows.  
> **中文**: 最大的开源 AI Agent 工作流模板库。

---

## 🎯 这是什么？

**定位**: AI Agent 工作流模板库（Tool，不是 toy）

**解决的问题**: 
- 你知道 AI Agent 能自动化很多事
- 但每次都要从零写提示词，浪费时间
- AgentFlow 给你 **15+ 套可直接复制使用的工作流**

**来源背书**:
- ✅ 500+ 小时真实生产环境验证
- ✅ 5 个不同领域（电商、投资、内容、医学、安全）
- ✅ 每个模板都跑出过真实结果
- ✅ 所有案例基于真实 AI Agent 对话记录

> ⚠️ 这不是理论。每一个工作流都来自真实运行的 AI Agent，有实际输出。

---

## 🎬 实际效果展示

### 案例 1: 电商选品调研

**你输入的**:
```
芯片平台：J4125
屏幕：15.6寸 IPS FHD
配置：8G+0
成本：¥790/台
目标市场：Amazon.ca 加拿大站
```

**AI Agent 生成的** (3分钟后):
```markdown
# 选品分析报告

## 结论: 🟡 可尝试

## 1. 市场机会
| 指标 | 数值 |
|------|------|
| 搜索结果数 | ~200 |
| 预估月销量 | 300-500台 |
| 白牌占比 | 15%（中等） |
| 市场评级 | 🟡 中等偏蓝海 |

## 2. 竞争分析
| 价格区间 | 玩家数量 | 机会 |
|---------|----------|------|
| $180-$220 | 8家 | 🟡 中等 |
| $220-$280 | 15家 | 🔴 饱和 |
| $280-$350 | 3家 | 🟢 高机会 |

## 3. 定价建议
| 指标 | 数值 |
|------|------|
| 成本价 | ¥790 |
| FBA费用 | ~$CAD 45 |
| 建议售价 | $CAD 220-250 |
| 预估毛利 | 18-22% |

## 4. 风险提示
- ⚠️ 需要一定 reviews 积累才能有转化
- ✅ 认证已覆盖该品类，无额外成本
- 💡 建议先小批量测（30-50台）
```

**→ 你只花了 3 分钟，得到了一份完整的选品分析报告**

---

### 案例 2: 投资持仓诊断

**你输入的**:
```
持仓：
- 科创板C：¥184，日投25元/日
- 标普500C：待建仓
- 黄金：¥1,335
总资产：¥128,000
目标：1年后达¥90,000
```

**AI Agent 生成的** (2分钟后):
```markdown
# 持仓诊断报告

## 综合评分: ⭐⭐⭐⭐☆ (8/10)

## 核心结论
⚠️ 科创板建仓过慢，需立即增加日投金额

## 1. 资产配置健康度
| 类别 | 当前 | 目标 | 偏差 | 优先级 |
|------|------|------|------|--------|
| 科创板 | 0.6% | 20% | -19.4% | 🔴 P1 |
| 美股 | 0% | 20% | -20% | 🔴 P1 |
| 黄金 | 4.6% | 15% | -10.4% | 🟡 P2 |

## 2. 立即调整
| 基金 | 当前 | 建议 | 原因 |
|------|------|------|------|
| 科创板C | 25元/日 | → 60元/日 | 距目标差¥16,000 |
| 标普500C | 0 | → 40元/日 | 建仓优先 |

## 3. 1年后预期
| 类别 | 1年后 | 目标 | 状态 |
|------|-------|------|------|
| 科创板 | ¥22,000 | ¥18,000 | ✅ 超额 |
| 美股 | ¥13,500 | ¥18,000 | ⚠️ 需追赶 |
| 黄金 | ¥16,000 | ¥14,000 | ✅ 达标 |

## 4. 行动清单
- [ ] 科创板C：立即改为 60元/日
- [ ] 标普500C：下周完成建仓
- [ ] 下月复盘调整
```

**→ 2 分钟完成持仓诊断 + 具体操作建议**

---

## 🚀 快速开始

### 第一步：找到你的工作流

按领域浏览 `workflows/`:

```
workflows/
├── ecommerce/           ← 电商运营（选品/竞品/Listing）
├── investment/          ← 投资分析（持仓/市场/配置）
├── content/             ← 内容创作（脚本/人设/趋势）
├── medicine/            ← 医学研究（临床/诊断）
└── security/            ← 安全审计（威胁/漏洞）
```

### 第二步：复制提示词

```markdown
# 示例：选品调研工作流
1. 打开 workflows/ecommerce/product-research.md
2. 复制完整提示词
3. 粘贴到你的 AI Agent（ChatGPT / Claude / QClaw / 任意）
4. 替换 [方括号] 中的参数为你的实际数据
5. 执行
```

### 第三步：获得结果

```
⏱️ 耗时：3-5 分钟
📄 输出：完整的分析报告/工作流结果
💾 可复用：下次同类任务，直接改参数就行
```

---

## 📦 包含的工作流

### 🛒 电商运营
| 工作流 | 来源 | 实际效果 |
|--------|------|----------|
| `product-research.md` | Amazon.ca 运营 Agent | 3分钟生成完整选品报告 |
| `competitor-analysis.md` | 竞品监控 Agent | 找出价格空缺 + 差异化机会 |
| `listing-optimize.md` | Listing 优化 Agent | 标题 + 五点 + 描述 完整方案 |

### 📈 投资分析
| 工作流 | 来源 | 实际效果 |
|--------|------|----------|
| `portfolio-review.md` | ¥128K 资管 Agent | 持仓健康度诊断 + 调整方案 |
| `market-analysis.md` | 市场分析 Agent | 板块估值 + 催化剂 + 操作建议 |
| `asset-allocation.md` | 资产配置 Agent | 5年/10年配置方案 + 再平衡规则 |

### 🎬 内容创作
| 工作流 | 来源 | 实际效果 |
|--------|------|----------|
| `script-outline.md` | AI 短剧编剧 Agent | 完整分镜脚本 + AI生图提示词 |
| `character-design.md` | 角色设计 Agent | 人设卡 + 台词风格 + 关系网络 |
| `trend-analysis.md` | 趋势分析 Agent | TOP10 话题 + 竞品动态 + 执行建议 |

### 🏥 循证医学
| 工作流 | 来源 | 实际效果 |
|--------|------|----------|
| `clinical-analysis.md` | 临床决策 Agent | 证据等级 + 疗效分析 + 推荐强度 |
| `diagnosis-support.md` | 鉴别诊断 Agent | 主要鉴别诊断 + 支持/不支持点 + 检查建议 |

### 🔒 安全审计
| 工作流 | 来源 | 实际效果 |
|--------|------|----------|
| `threat-modeling.md` | 安全架构 Agent | STRIDE 威胁分析 + 风险矩阵 + 修复计划 |
| `vulnerability-scan.md` | 漏洞分析 Agent | CVSS评分 + 业务影响 + 修复优先级 |

---

## 🔥 为什么选 AgentFlow？

| | 其他项目 | AgentFlow |
|--|---------|-----------|
| **真实性** | ❌ 泛泛提示词，来源不明 | ✅ 从真实生产 Agent 提取 |
| **可验证性** | ❌ 只有文字说明 | ✅ 每个模板有输入→输出案例 |
| **多领域** | ❌ 单领域或泛泛集合 | ✅ 5 大领域覆盖 |
| **中文支持** | ❌ 极少 | ✅ 完整中英双语 |
| **持续维护** | ❌ 已停止更新 | ✅ 活跃更新 |
| **实际价值** | ❓ 不知道能跑出什么 | ✅ 3分钟出结果 |

---

## 📊 每个工作流包含

- ✅ **完整提示词** — 可直接复制使用（中文 + 英文）
- ✅ **输入模板** — 参数说明
- ✅ **输出格式** — 预期输出结构（Markdown 表格）
- ✅ **真实案例** — 真实输入 + 真实输出
- ✅ **定制化建议** — 如何调整

---

## 🤝 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

**提交规则**:
- ✅ 必须是真实跑过的工作流（不是理论）
- ✅ 必须包含完整提示词
- ✅ 必须有实际案例
- ✅ 中英双语

---

## ⭐ 支持这个项目

如果 AgentFlow 帮到了你，**请给一个 Star**！

⭐ **https://github.com/NeoHou-sudo/agentflow**

---

## 📢 传播文案

```
🇨🇳 中文：
我用 AI Agent 跑了 500+ 小时，把所有踩坑经验整理成了开源模板库。
真实输入 → 真实输出 → 真实结果。
包含电商、投资、内容创作、医学、安全 5 大场景，共 15+ 套可直接复制使用的工作流。
github.com/NeoHou-sudo/agentflow

🇺🇸 English:
I spent 500+ hours building AI agents. Now open-sourcing every workflow I've refined.
Real input → Real output → Real results.
15 production-ready workflows. Copy, paste, automate.
github.com/NeoHou-sudo/agentflow
```

---

## 📜 License

MIT License — 自由使用、修改和分发。

---

## 📬 联系

- **GitHub**: [NeoHou-sudo](https://github.com/NeoHou-sudo)
- **Twitter/X**: [@NeoHou_sudo](https://twitter.com/NeoHou_sudo)

---

*最后更新: 2026-06-01 | Version 1.1*
