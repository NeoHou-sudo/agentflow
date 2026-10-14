# AgentFlow

> 18+ Production AI Agent Workflows. Copy, paste, automate — in 2 minutes.

---

## What It Does

See what a real workflow looks like before you copy it.

---

## Real Example: E-Commerce Product Research (3 min)

**Your input:**
> Category: Laptops / CPU: Intel N100 / Screen: 15.6" IPS  
> Cost: ¥800 / Target: Amazon.com US

**Agent output:**
> ✅ Entry point found in the $280–350 range (only 3 major sellers).  
> Recommended sell price: $299–329. Margin: 22–26%.  
> Risk: CE certification required for EU, FCC for US.  
> Suggestion: Start with 20-unit test batch.

---

## Real Example: Investment Portfolio Diagnosis (2 min)

**Your input:**
> Portfolio: E-Commerce Store (¥50,000) + Growth Fund (¥30,000)  
> Total Assets: ¥120,000 / Annual Goal: ¥100,000

**Agent output:**
> ⚠️ E-commerce holdings are 41% of portfolio — too concentrated.  
> Action: Rebalance to 60/40 (equity/bonds) within 30 days.  
> Current drawdown risk: HIGH.  
> Add: Low-cost S&P 500 ETF to diversify geographically.

---

## How It Works

Every workflow is a complete prompt + output format guide.

**Product Research Workflow core prompt (example):**

```
You are an e-commerce product research expert.

## Product Info
- Category: [laptops / electronics / home goods]
- CPU/Chip: [model]
- Screen: [size + type]
- Your cost: ¥[amount]

## Analyze
1. Market size and competition density
2. Price gap opportunity in top 10 sellers
3. Suggested sell price → margin estimate
4. Risk flags (certification, competition, seasonality)
```

**Output format:**

```
## Verdict: 🟡 Worth Testing

## Market
| Metric          | Value    |
|-----------------|----------|
| Top sellers     | 12       |
| Avg rating      | 4.1★     |
| Price range     | $180-350 |

## Opportunity
| Price range    | Players | Gap? |
|----------------|---------|------|
| $180–$220     | 6       | 🟡   |
| $280–$350     | 3       | 🟢   |

## Risks
- FCC certification required
- Seasonal demand spike Q4
```

---

## Included Workflows

**E-Commerce** (3)
- Product Research / Competitor Analysis / Listing Optimization

**Investment** (3)
- Portfolio Diagnosis / Market Analysis / Asset Allocation

**Content Creation** (3)
- Short Video Script / Topic Ideation / Batch Content

**Medical** (2)
- Clinical Decision Support / Differential Diagnosis

**Security** (2)
- Threat Modeling / Vulnerability Scanning

---

## Quick Start

1. Open `workflows/` — pick your use case
2. Copy the prompt into any AI Agent (ChatGPT, Claude, DeepSeek…)
3. Fill in your own values, run

Bilingual: every workflow has Chinese + English versions.

---

## FAQ

**Q: Do I need technical skills?**  
No. Copy, paste, change the parameters.

**Q: Which AI models work?**  
Any model that handles long text: GPT-4, Claude, DeepSeek, Qwen, Kimi…

**Q: Where do these workflows come from?**  
Real users running real tasks — not generated from scratch.

**Q: Can I modify them?**  
MIT license. Change whatever you want.

---

## Contribute

Rules:
1. Must be something you actually ran, not scraped from the internet
2. Must include a real example with input → output

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

⭐ [github.com/NeoHou-sudo/agentflow](https://github.com/NeoHou-sudo/agentflow)

[![Stars](https://img.shields.io/github/stars/NeoHou-sudo/agentflow?style=social)](https://github.com/NeoHou-sudo/agentflow/stargazers)
[![Forks](https://img.shields.io/github/forks/NeoHou-sudo/agentflow?style=social)](https://github.com/NeoHou-sudo/agentflow/network/members)
