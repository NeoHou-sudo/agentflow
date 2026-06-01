# 🛡️ Threat Modeling Workflow / 威胁建模工作流

> **适用场景**: 系统性分析系统/产品的安全威胁  
> **来源**: 网络安全架构 Agent  
> **难度**: ⭐⭐⭐⭐

---

## 📝 Exact Prompt / 完整提示词

### 中文版

```
你是一位网络安全架构师。请帮我进行威胁建模分析。

## 系统信息
- 系统名称：[名称]
- 核心功能：[功能描述]
- 用户类型：[如：内部员工/外部客户/管理员]
- 数据类型：[如：用户隐私/交易数据/商业机密]
- 部署环境：[如：云端/本地/混合]

## 资产梳理
列出系统中的关键资产：
- [资产1]: [描述] → 机密性需求：[高/中/低]
- [资产2]: [描述] → 完整性需求：[高/中/低]
- [资产3]: [描述] → 可用性需求：[高/中/低]

## 需要分析的内容

### 1. 攻击面分析
- 外部接口（API/网站/移动端）
- 内部接口
- 第三方集成
- 数据存储

### 2. 威胁识别（STRIDE 模型）
对每个资产组件分析：
| 威胁类型 | 描述 | 影响 | 可能性 | 风险等级 |
|----------|------|------|--------|----------|

### 3. 安全控制现状
列出已有的安全措施：
- 身份验证：[方式]
- 授权：[方式]
- 加密：[方式]
- 日志监控：[方式]

### 4. 风险优先级排序
| 风险 | 影响 | 可能性 | 综合评分 | 处理策略 |
|------|------|--------|----------|----------|
| [风险] | 高 | 高 | 🔴 高 | 立即修复 |

### 5. 改进建议
- 高优先级修复
- 中优先级改进
- 低优先级监控

请给出结构化威胁建模报告。
```

### English Version

```
You are a cybersecurity architect. Help me perform threat modeling analysis.

## System Information
- System name: [name]
- Core functions: [description]
- User types: [internal/external/admin]
- Data types: [user data/transactions/secrets]
- Deployment: [cloud/on-prem/hybrid]

## Asset Inventory
List key assets:
- [Asset1]: [desc] → Confidentiality: [H/M/L]
- [Asset2]: [desc] → Integrity: [H/M/L]
- [Asset3]: [desc] → Availability: [H/M/L]

## Analysis Requirements

### 1. Attack Surface Analysis
- External interfaces (API/web/mobile)
- Internal interfaces
- Third-party integrations
- Data storage

### 2. Threat Identification (STRIDE Model)
For each asset/component:

| Threat Type | Description | Impact | Likelihood | Risk Level |
|-------------|-------------|--------|-------------|------------|
| [Threat] | | | | |

### 3. Security Controls Assessment
Existing controls:
- Authentication: [method]
- Authorization: [method]
- Encryption: [method]
- Logging/Monitoring: [method]

### 4. Risk Prioritization

| Risk | Impact | Likelihood | Score | Treatment |
|------|--------|------------|-------|-----------|
| [Risk] | High | High | 🔴 | Fix now |

### 5. Recommendations
- High priority: [actions]
- Medium priority: [actions]
- Low priority: [monitor]

Provide structured threat modeling report.
```

---

## 📊 Expected Output Format

```markdown
# 威胁建模报告 / Threat Modeling Report

## 系统概览
| 属性 | 值 |
|------|------|
| 系统名 | X |
| 安全等级 | [机密/秘密/公开] |

## 攻击面矩阵

| 接口 | 类型 | 暴露程度 | 主要威胁 |
|------|------|----------|----------|
| /api/users | REST | 高 | SQL注入、信息泄露 |
| /admin | Web | 中 | 弱密码、暴力破解 |

## STRIDE 威胁分析

### 数据存储层
| 威胁 | 描述 | 影响 | 可能性 | 风险 |
|------|------|------|--------|------|
| S-Spoofing | 身份伪造 | 高 | 低 | 🟡 |
| T-Tampering | 数据篡改 | 高 | 中 | 🔴 |
| R-Repudiation | 否认操作 | 中 | 低 | 🟢 |

## 风险优先级矩阵

🔴 高风险（立即处理）
🟡 中风险（限期处理）
🟢 低风险（接受/监控）

## 安全改进路线图

| 阶段 | 时间 | 措施 | 优先级 |
|------|------|------|--------|
| P0 | 1周内 | 修复高风险漏洞 | P1 |
```

---

*Version 1.0 | 2026-06-01*
