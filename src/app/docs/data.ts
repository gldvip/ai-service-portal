export interface DocItem {
  slug: string;
  title: string;
  category: 'usage' | 'install';
  summary: string;
  preview: string;
  content: string;
}

export const docs: DocItem[] = [
  {
    slug: 'guides',
    title: 'AI 编程工具使用与安装教程',
    category: 'usage',
    summary: 'Claude Code、Codex、OpenClaw、CC Switch 的完整使用指南与安装教程',
    preview: '一站式掌握所有主流 AI 编程工具的安装与使用方法。',
    content: `## Claude Code 使用指南

## 环境要求

- macOS 12+、Ubuntu 20.04+ 或 Windows (WSL2)
- Node.js 18 或更高版本
- 稳定的网络连接

## 基础使用

### 启动 Claude Code

在终端中直接输入 \`claude\` 即可启动交互模式。首次使用需要完成账号认证：

\`\`\`bash
claude
# 首次启动会引导你完成 OAuth 认证
\`\`\`

### 日常对话

启动后你可以直接用自然语言描述需求：

- "帮我写一个 Express 路由，处理用户注册"
- "这段代码有 bug，帮我看看"
- "把这段 Python 代码转换成 TypeScript"

### 代码审查

Claude Code 可以审查当前项目的代码变更：

\`\`\`bash
claude review
# 自动分析 git diff 中的变更并给出建议
\`\`\`

## 核心功能详解

### 1. 文件操作

Claude Code 可以直接读写项目文件。你只需描述需求，它会自动定位文件并完成修改：

- 创建新文件："创建一个 React 组件用于用户登录表单"
- 修改现有文件："在 utils.ts 中添加日期格式化函数"
- 批量重构："把项目中所有 var 替换为 const"

### 2. 终端命令执行

Claude Code 可以帮你执行终端命令并解释输出结果：

- "运行测试并告诉我哪些失败了"
- "安装 lodash 和 @types/lodash"
- "查看 3000 端口被谁占用了"

### 3. 上下文理解

Claude Code 会自动分析项目结构，理解代码上下文。你可以通过以下方式提供额外信息：

- 使用 \`@filename\` 引用特定文件
- 使用 \`@folder\` 引用整个目录
- 直接粘贴错误信息让它分析

## 高级技巧

### 管道模式

将其他命令的输出传给 Claude Code：

\`\`\`bash
cat error.log | claude "分析这个错误日志"
git diff | claude "审查这些变更"
\`\`\`

### 项目记忆

Claude Code 支持项目级别的记忆文件（CLAUDE.md），你可以在项目根目录创建该文件记录：

- 项目架构说明
- 编码规范
- 常用命令
- 特殊约定

### 多文件编辑

描述一个涉及多个文件的修改任务，Claude Code 会自动规划并执行：

"把用户认证模块从 JWT 迁移到 session-based，涉及 auth middleware、user model 和登录路由"

## 常见问题

**Q: Claude Code 和 Claude 网页版有什么区别？**
A: Claude Code 运行在终端中，可以直接操作你的项目文件、执行命令、理解代码上下文。网页版无法直接访问你的代码库。

**Q: 代码会被上传到云端吗？**
A: Claude Code 会在对话过程中将相关代码发送到 Anthropic 服务器进行处理，但不会用于模型训练。敏感项目建议先确认公司的数据安全政策。

**Q: 支持哪些编程语言？**
A: 理论上支持所有编程语言，对 Python、JavaScript/TypeScript、Java、Go、Rust 等主流语言的支持最为完善。

---

## Codex 使用指南

## 环境要求

- macOS、Linux 或 Windows (WSL2)
- Node.js 22+
- OpenAI API Key 或 ChatGPT Plus/Pro 账号

## 验证安装

安装完成后，运行以下命令验证：

\`\`\`bash
codex --version
# 应输出版本号，如 codex 0.1.x
\`\`\`

## 基础使用

### 交互模式

\`\`\`bash
codex
# 进入交互式对话
\`\`\`

在交互模式中，你可以：

- 描述需求让它生成代码
- 提问编程相关问题
- 让它解释现有代码

### 单次命令

\`\`\`bash
codex "写一个 Python 脚本，批量重命名文件夹中的图片文件"
# 直接生成并可选择执行
\`\`\`

## 核心功能

### 1. 代码生成

描述你的需求，Codex 会生成完整的代码文件：

- "创建一个 FastAPI 项目，包含用户 CRUD 接口"
- "写一个 Shell 脚本自动备份 MySQL 数据库"
- "生成一个 React Hook 用于防抖搜索"

### 2. 代码解释

选中代码或指定文件，让 Codex 逐行解释：

\`\`\`bash
codex "解释 src/utils/parser.ts 中的 parseConfig 函数"
\`\`\`

### 3. Bug 调试

粘贴错误信息或描述异常行为，Codex 会定位问题并给出修复方案：

\`\`\`bash
codex "运行 npm test 报错 TypeError: Cannot read property 'map' of undefined，帮我修复"
\`\`\`

### 4. 代码重构

指定文件和重构目标：

\`\`\`bash
codex "把 src/api/ 目录下的回调风格代码全部改成 async/await"
\`\`\`

## 工作模式

Codex 提供三种工作模式，通过命令行参数切换：

- **suggest**（默认）：只提供建议和代码，不自动执行
- **auto-edit**：自动修改文件，但不执行命令
- **full-auto**：完全自动执行，包括文件修改和命令运行

\`\`\`bash
codex --approval-mode full-auto "重构这个模块"
\`\`\`

> 注意：full-auto 模式下 Codex 会自主执行操作，建议在 Git 管理的项目中使用。

## 实用技巧

### 上下文管理

- 使用 \`@file path\` 引入特定文件作为上下文
- Codex 会自动读取项目中的 CLAUDE.md 和 README.md
- 在对话中说 "看看 src/ 目录结构" 可以让它浏览项目

### 会话管理

- \`Ctrl+C\` 中断当前操作
- \`Ctrl+D\` 退出交互模式
- 历史对话会自动保存

## 常见问题

**Q: Codex 和 GitHub Copilot 有什么区别？**
A: Copilot 主要在编辑器中提供行内补全。Codex 是独立的命令行工具，能理解项目上下文、执行命令、创建和修改文件，能力更全面。

**Q: API 费用大概多少？**
A: 取决于使用频率和代码量。日常开发使用大约 $5-15/天，建议设置用量上限避免超支。

**Q: 支持离线使用吗？**
A: 不支持。Codex 依赖云端模型处理，需要网络连接。

---

## OpenClaw（龙虾）使用指南

## 简介

OpenClaw（龙虾）是一个开源的 AI 编程工具，特点在于：

- 支持多种 LLM 后端（OpenAI、Anthropic、本地模型等）
- 可自定义 Agent 行为和工具链
- 社区活跃，插件生态丰富

## 环境要求

- Python 3.10+
- pip 或 poetry
- 至少一个 LLM API Key

## 基础使用

### 启动 OpenClaw

\`\`\`bash
openclaw
# 或
python -m openclaw
\`\`\`

### 配置模型

首次启动需要配置 LLM 后端：

\`\`\`bash
openclaw config
# 交互式配置 API Key、模型选择等
\`\`\`

支持的模型后端：

| 后端 | 模型示例 | 说明 |
|------|---------|------|
| OpenAI | GPT-4o, GPT-4.1 | 需要 API Key |
| Anthropic | Claude Sonnet 4 | 需要 API Key |
| Ollama | Llama 3, Qwen 2.5 | 本地运行，无需 Key |
| DeepSeek | DeepSeek V3 | 国内可直连 |

## 核心功能

### 1. 智能对话

在终端中与 AI 对话，讨论代码问题：

\`\`\`bash
openclaw chat "如何优化这个 SQL 查询的性能？"
\`\`\`

### 2. 代码生成

\`\`\`bash
openclaw gen --lang python "实现一个 LRU 缓存"
# 生成代码并保存到文件
\`\`\`

### 3. 项目分析

\`\`\`bash
openclaw analyze ./src
# 分析项目结构、代码质量，生成报告
\`\`\`

### 4. 插件系统

OpenClaw 支持通过插件扩展功能：

\`\`\`bash
openclaw plugin install code-review
openclaw plugin install doc-generator
openclaw plugin list
\`\`\`

常用插件：

- **code-review**：自动代码审查
- **doc-generator**：自动生成文档
- **test-writer**：自动生成单元测试
- **refactor-assist**：智能重构建议

## 高级配置

### Agent 自定义

在项目根目录创建 \`.openclaw/config.yaml\`：

\`\`\`yaml
agent:
  name: "my-assistant"
  system_prompt: "你是一个专注于 Python 后端开发的 AI 助手"
  tools:
    - file_read
    - file_write
    - shell_exec
    - web_search
  max_iterations: 10
\`\`\`

### 多模型切换

在对话中动态切换模型：

\`\`\`bash
openclaw model switch deepseek
openclaw model switch claude
\`\`\`

## 常见问题

**Q: OpenClaw 和 Claude Code 哪个好？**
A: 各有优势。Claude Code 与 Anthropic 生态深度集成，体验流畅。OpenClaw 更灵活，支持多模型后端和插件扩展，适合喜欢自定义的开发者。

**Q: 可以用本地模型吗？**
A: 可以。通过 Ollama 集成，支持 Llama 3、Qwen 2.5 等本地模型，适合对数据隐私有要求的场景。

**Q: 如何贡献插件？**
A: 参考 GitHub 仓库中的 Plugin Development Guide，使用 Python 编写插件并提交到社区仓库。

---

## Claude Code 安装教程

:::quick-install
title: ⚡ 一键安装 Claude Code
- macOS / Linux: \`curl -fsSL https://ai.cccode.com.cn/scripts/install-claude-code.sh | bash\`
- Windows PowerShell: \`irm https://ai.cccode.com.cn/scripts/install-claude-code.ps1 | iex\`
- Windows Git Bash: \`bash <(curl -fsSL https://ai.cccode.com.cn/scripts/install-claude-code.sh)\`
:::

## 系统要求

| 系统 | 最低版本 |
|------|---------|
| macOS | 12 Monterey+ |
| Ubuntu/Debian | 20.04+ |
| Windows | WSL2 (Ubuntu 20.04+) |

其他依赖：

- Node.js 18 或更高版本
- npm 9+（随 Node.js 安装）
- Git

## 第一步：安装 Node.js

### macOS

\`\`\`bash
# 使用 Homebrew
brew install node@18

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 18
nvm use 18
\`\`\`

### Linux (Ubuntu/Debian)

\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

### Windows (WSL2)

在 WSL2 终端中执行与 Linux 相同的命令。

### 验证 Node.js 安装

\`\`\`bash
node --version  # 应显示 v18.x.x
npm --version   # 应显示 9.x.x 或更高
\`\`\`

## 第二步：安装 Claude Code

\`\`\`bash
npm install -g @anthropic-ai/claude-code
\`\`\`

安装完成后验证：

\`\`\`bash
claude --version
\`\`\`

如果提示 \`command not found\`，可能是 npm 全局路径未加入 PATH：

\`\`\`bash
# 查看 npm 全局路径
npm config get prefix

# 将输出的路径加入 PATH（以 /usr/local 为例）
export PATH="/usr/local/bin:$PATH"

# 写入 shell 配置使其永久生效
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
\`\`\`

## 第三步：首次认证

\`\`\`bash
claude
\`\`\`

首次启动会引导你完成 OAuth 认证流程：

1. 终端会显示一个认证链接
2. 在浏览器中打开链接
3. 登录 Anthropic 账号并授权
4. 返回终端，看到欢迎信息即表示认证成功

## 第四步：验证安装

\`\`\`bash
claude "你好，请做个自我介绍"
# 如果得到正常回复，说明安装成功
\`\`\`

## 可选配置

### 设置 API Key（可选）

如果你有 Anthropic API Key，可以直接设置环境变量：

\`\`\`bash
export ANTHROPIC_API_KEY="your-api-key-here"
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.zshrc
\`\`\`

### 配置代理（国内用户）

如果网络不通，可以设置代理：

\`\`\`bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
\`\`\`

## 常见安装问题

**Q: npm install 报权限错误？**
A: 不要使用 sudo，而是修复 npm 权限：
\`\`\`bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
\`\`\`

**Q: 安装后 claude 命令找不到？**
A: 检查 npm 全局 bin 目录是否在 PATH 中，参考上面的 PATH 配置。

**Q: 认证页面打不开？**
A: 检查网络连接，国内用户可能需要设置代理。

## 💡 推荐：安装 CC Switch 统一管理工具

> Claude Code 安装好了，推荐安装 **CC Switch** 来管理供应商配置，一键切换、自动故障转移，不用再手动改配置文件。

[👉 查看 CC Switch 安装教程 →](#cc-switch-统一管理所有-ai-编程工具)

---

## Codex 安装教程

:::quick-install
title: ⚡ 一键安装 Codex CLI
- macOS / Linux: \`curl -fsSL https://ai.cccode.com.cn/scripts/install-codex.sh | bash\`
- Windows PowerShell: \`irm https://ai.cccode.com.cn/scripts/install-codex.ps1 | iex\`
- Windows Git Bash: \`bash <(curl -fsSL https://ai.cccode.com.cn/scripts/install-codex.sh)\`
:::

## 系统要求

| 系统 | 最低版本 |
|------|---------|
| macOS | 13 Ventura+ |
| Linux | 主流发行版 |
| Windows | WSL2 |

依赖：

- Node.js 22 或更高版本
- OpenAI API Key 或 ChatGPT Plus/Pro 订阅

## 第一步：安装 Node.js 22+

### macOS

\`\`\`bash
brew install node
# 或使用 nvm
nvm install 22
nvm use 22
\`\`\`

### Linux

\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

验证：

\`\`\`bash
node --version  # v22.x.x 或更高
\`\`\`

## 第二步：安装 Codex CLI

\`\`\`bash
npm install -g @openai/codex
\`\`\`

验证安装：

\`\`\`bash
codex --version
\`\`\`

## 第三步：配置认证

### 方式一：API Key

如果你有 OpenAI API Key：

\`\`\`bash
export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"
echo 'export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"' >> ~/.zshrc
source ~/.zshrc
\`\`\`

### 方式二：ChatGPT 账号

如果你是 ChatGPT Plus 或 Pro 用户，Codex 支持直接使用 ChatGPT 账号认证：

\`\`\`bash
codex auth login
# 按提示在浏览器中完成 ChatGPT 账号授权
\`\`\`

## 第四步：验证安装

\`\`\`bash
codex "用 Python 写一个 Hello World"
# 正常输出代码即表示安装成功
\`\`\`

## 配置建议

### 设置默认模型

\`\`\`bash
# 在 ~/.codex/config.json 中配置
{
  "model": "o4-mini",
  "approval_mode": "suggest"
}
\`\`\`

### 设置代理（国内用户）

\`\`\`bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
\`\`\`

### Shell 补全

\`\`\`bash
# Bash
codex completion bash >> ~/.bashrc

# Zsh
codex completion zsh >> ~/.zshrc

# Fish
codex completion fish > ~/.config/fish/completions/codex.fish
\`\`\`

## 常见安装问题

**Q: 安装报错 "Unsupported engine"？**
A: Codex 要求 Node.js 22+，请先升级 Node.js 版本。

**Q: API Key 无效？**
A: 确认 Key 以 \`sk-\` 开头，且账户有足够余额。可在 OpenAI 控制台检查。

**Q: 国内网络无法连接？**
A: 需要设置代理，或者使用支持的中转 API 服务。

## 💡 推荐：安装 CC Switch 统一管理工具

> Codex 安装好了，推荐安装 **CC Switch** 来管理供应商配置，一键切换、自动故障转移，不用再手动改配置文件。

[👉 查看 CC Switch 安装教程 →](#cc-switch-统一管理所有-ai-编程工具)

---

## OpenClaw（龙虾）安装教程

:::quick-install
title: ⚡ 一键安装 OpenClaw（龙虾）
- macOS / Linux: \`curl -fsSL https://ai.cccode.com.cn/scripts/install-openclaw.sh | bash\`
- Windows PowerShell: \`irm https://ai.cccode.com.cn/scripts/install-openclaw.ps1 | iex\`
- Windows Git Bash: \`bash <(curl -fsSL https://ai.cccode.com.cn/scripts/install-openclaw.sh)\`
:::

## 系统要求

- Python 3.10 或更高版本
- pip 或 poetry
- Git

## 第一步：安装 Python

### macOS

\`\`\`bash
brew install python@3.12
# 或使用 pyenv
pyenv install 3.12
pyenv global 3.12
\`\`\`

### Linux (Ubuntu)

\`\`\`bash
sudo apt update
sudo apt install python3.12 python3.12-venv python3-pip
\`\`\`

### 验证

\`\`\`bash
python3 --version  # Python 3.10+
pip3 --version
\`\`\`

## 第二步：创建虚拟环境（推荐）

\`\`\`bash
python3 -m venv openclaw-env
source openclaw-env/bin/activate
\`\`\`

## 第三步：安装 OpenClaw

### 方式一：pip 安装

\`\`\`bash
pip install openclaw
\`\`\`

### 方式二：从源码安装

\`\`\`bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pip install -e .
\`\`\`

### 验证安装

\`\`\`bash
openclaw --version
\`\`\`

## 第四步：初始配置

### 交互式配置

\`\`\`bash
openclaw config
# 按提示选择模型后端、输入 API Key
\`\`\`

### 手动配置

在 \`~/.openclaw/config.yaml\` 中编辑：

\`\`\`yaml
llm:
  provider: openai  # 可选: openai, anthropic, ollama, deepseek
  api_key: "your-api-key"
  model: "gpt-4o"

settings:
  language: zh-CN
  theme: dark
\`\`\`

### 使用本地模型（Ollama）

如果你想使用本地模型，先安装 Ollama：

\`\`\`bash
# macOS
brew install ollama

# 启动 Ollama 服务
ollama serve

# 下载模型（新终端执行）
ollama pull llama3
ollama pull qwen2.5
\`\`\`

然后配置 OpenClaw 使用 Ollama：

\`\`\`yaml
llm:
  provider: ollama
  model: llama3
  base_url: http://localhost:11434
\`\`\`

## 第五步：安装常用插件

\`\`\`bash
openclaw plugin install code-review
openclaw plugin install doc-generator
openclaw plugin install test-writer
\`\`\`

## 第六步：验证安装

\`\`\`bash
openclaw "你好，介绍一下你自己"
# 正常回复即安装成功
\`\`\`

## 常见安装问题

**Q: pip install 报错？**
A: 确认 Python 版本 >= 3.10，建议在虚拟环境中安装避免依赖冲突。

**Q: Ollama 模型下载很慢？**
A: 模型文件较大（几 GB），建议使用稳定的网络。国内可以尝试设置 Hugging Face 镜像。

**Q: 多个模型后端如何切换？**
A: 使用 \`openclaw config\` 重新配置，或在 \`config.yaml\` 中修改 provider 字段。

**Q: 如何更新 OpenClaw？**
A: \`pip install --upgrade openclaw\` 或进入源码目录 \`git pull && pip install -e .\`

## 💡 推荐：安装 CC Switch 统一管理工具

> OpenClaw 安装好了，推荐安装 **CC Switch** 来管理供应商配置，一键切换、自动故障转移，不用再手动改配置文件。

[👉 查看 CC Switch 安装教程 →](#cc-switch-统一管理所有-ai-编程工具)

---

## CC Switch — 统一管理所有 AI 编程工具

> 💡 **强烈推荐**：安装好上面的工具后，建议安装 CC Switch 来统一管理所有工具的供应商配置，告别手动编辑配置文件。

## 简介

CC Switch 是一款开源桌面应用，为你提供可视化界面来统一管理所有 AI 编程 CLI 工具。

**支持的工具：** Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes Agent

**核心优势：**

- 🎯 一个应用管理 7 个工具
- ⚡ 50+ 供应商预设，一键导入
- 🔄 系统托盘一键切换供应商
- 🛡️ 自动故障转移，供应商异常时自动切换
- 📊 跨供应商统一用量追踪
- 🔧 统一 MCP / Skills / Prompts 管理
- ☁️ 跨设备云同步（Dropbox / OneDrive / iCloud / WebDAV）

## 安装 CC Switch

### macOS

\`\`\`bash
brew tap farion1231/ccswitch
brew install cc-switch
\`\`\`

或下载 DMG：[GitHub Releases](https://github.com/farion1231/cc-switch/releases/latest)

### Windows

下载 MSI 安装包或便携版 ZIP：[GitHub Releases](https://github.com/farion1231/cc-switch/releases/latest)

### Linux

\`\`\`bash
# Ubuntu/Debian
wget https://github.com/farion1231/cc-switch/releases/latest/download/CC-Switch-v3.16.1-Linux-x86_64.deb
sudo dpkg -i CC-Switch-v3.16.1-Linux-x86_64.deb

# 或使用 AppImage
wget https://github.com/farion1231/cc-switch/releases/latest/download/CC-Switch-v3.16.1-Linux-x86_64.AppImage
chmod +x CC-Switch-v3.16.1-Linux-x86_64.AppImage
./CC-Switch-v3.16.1-Linux-x86_64.AppImage
\`\`\`

## 使用方法

### 添加供应商

1. 启动 CC Switch，点击 **"添加供应商"**
2. 从 50+ 预设中选择（Anthropic、OpenAI、AWS Bedrock、各类中转服务等）
3. 填入 API Key，点击保存

### 切换供应商

- **主界面**：点击供应商卡片上的"切换"按钮
- **系统托盘**：右键托盘图标，选择目标供应商

### MCP / Skills 管理

CC Switch 提供统一面板管理所有工具的 MCP 服务器和 Skills，支持双向同步。

## 常见问题

**Q: CC Switch 是免费的吗？**
A: 是的，完全开源免费。

**Q: 会收集我的 API Key 吗？**
A: 不会。所有数据存储在本地 SQLite 数据库中。

## 相关链接

- 🌐 [官方网站](https://ccswitch.io)
- 📖 [官方文档](https://ccswitch.io/zh/docs)
- 💻 [GitHub 仓库](https://github.com/farion1231/cc-switch)`,
  },
];
