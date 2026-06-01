# 🦞 OpenClaw 小龙虾 — 部署指南

## 环境要求

- 操作系统：Windows 10/11、macOS 12+、Linux（Ubuntu/Debian/CentOS）
- Node.js：22.x 及以上
- Git：2.x 及以上

## 一、安装 OpenClaw

### Windows（推荐：一键安装包）

1. 下载安装包（最新版本 2.7.1）：
   ```
   https://openclaw.ai/install
   ```
2. 右键压缩包 → 解压到**纯英文路径**（不含中文、空格、中文标点）
   ✅ 推荐：`D:\OpenClaw`
   ❌ 错误：`D:\软件\OpenClaw`（含中文）
3. 进入解压目录 → 双击「Openclaw Windows 一键启动.exe」（红色龙虾图标）
4. 点击「开始使用」→ 选择安装路径 → 完成

### Windows（命令行安装）

以管理员身份打开 PowerShell，执行：
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### macOS / Linux

打开终端，执行：
```bash
curl -fsSL https://openclaw.ai/install.sh | sh
```

## 二、获取 API Token

### 推荐：DeepSeek Token（每日免费额度）

1. 访问 https://chat.deepseek.com 注册
2. 左下角「API Keys」→「创建新密钥」
3. 复制密钥（只显示一次，妥善保存）

### 其他免费渠道

| 平台 | 地址 | 免费额度 |
|------|------|----------|
| DeepSeek | chat.deepseek.com | 每日一定量 |
| 阿里通义千问 | qwen.ai | 注册送 Token |
| 智谱 GLM | bigmodel.cn | 注册送 Token |

## 三、配置 Token

1. 打开 OpenClaw → 左下角「设置」
2. 找到「模型配置」或「API Keys」
3. 填入你的 Token，选择默认模型

## 四、导入工作流

1. 打开 OpenClaw → 新建一个 Agent
2. 在 Agent 的提示词框中，复制本仓库 `workflows/` 下对应工作流的提示词
3. 保存，开始使用

## 五、云端一键部署（免本地）

不想本地安装？用云端：

### 百度智能云
访问「百度智能云轻量应用服务器」→ 搜索 OpenClaw 镜像 → 一键购买部署，最快 3 分钟上线。

### 阿里云
1. 登录阿里云 → 轻量应用服务器
2. 选择 OpenClaw 镜像（已有预置镜像）
3. 实例规格：内存 2GiB 及以上
4. 等待 3-5 分钟自动部署完成

## 六、常见问题

**Q: 安装时报错"路径含中文"**  
A: 安装路径必须为纯英文，不含中文、空格、特殊字符。

**Q: API Key 认证失败**  
A: 检查 Key 是否完整（前后不能有多余空格），确认 Key 是否在有效期内。

**Q: 启动后龙虾图标是灰色**  
A: 等待 10-30 秒初始化完成；若持续灰色，重启应用。

## 七、相关资源

- OpenClaw 官网：https://openclaw.ai
- 安装脚本：https://openclaw.ai/install
- GitHub：https://github.com/openclaw/openclaw
