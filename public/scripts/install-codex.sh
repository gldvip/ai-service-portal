#!/usr/bin/env bash
# ============================================================
#  OpenAI Codex CLI 一键安装脚本
#  支持系统：macOS / Linux / Windows (Git Bash / WSL2)
#  使用方法：
#    macOS/Linux:  curl -fsSL https://ai.cccode.com.cn/scripts/install-codex.sh | bash
#    Windows Git Bash: bash install-codex.sh
# ============================================================

set -euo pipefail

# ── 颜色 ─────────────────────────────────────────────────────
R='\033[0;31m'   # 红
G='\033[0;32m'   # 绿
Y='\033[1;33m'   # 黄
C='\033[0;36m'   # 青
M='\033[0;35m'   # 紫
B='\033[1m'      # 粗
D='\033[2m'      # 暗
N='\033[0m'      # 重置

# ── 输出工具 ──────────────────────────────────────────────────
step()  { echo -e "\n${C}${B}  [$1]${N} ${C}$2${N}"; }
ok()    { echo -e "       ${G}✔${N} $1"; }
warn()  { echo -e "       ${Y}⚠${N} $1"; }
fail()  { echo -e "       ${R}✘${N} $1"; }
hint()  { echo -e "       ${D}$1${N}"; }
bar()   { echo -e "  ${D}──────────────────────────────────────────────${N}"; }

# ── Banner ───────────────────────────────────────────────────
echo ""
echo -e "${C}${B}"
echo '     ╔══════════════════════════════════════════╗'
echo '     ║                                          ║'
echo '     ║     ◆  Codex CLI  一键安装脚本  ◆        ║'
echo '     ║                                          ║'
echo '     ╚══════════════════════════════════════════╝'
echo -e "${N}"
bar

# ── 检测系统 ─────────────────────────────────────────────────
step "1/4" "检测操作系统"

OS="$(uname -s)"
case "$OS" in
    Darwin*)                PLATFORM="macos";   ok "macOS $(sw_vers -productVersion 2>/dev/null || echo '')" ;;
    Linux*)                 PLATFORM="linux";   ok "Linux $(uname -r)" ;;
    MINGW*|MSYS*|CYGWIN*)   PLATFORM="windows"; ok "Windows (Git Bash)" ;;
    *)                      fail "不支持的操作系统: $OS"; exit 1 ;;
esac

# ── 检查 Node.js ─────────────────────────────────────────────
step "2/4" "检查 Node.js 环境"

NODE_VER=""
if command -v node &>/dev/null; then
    v=$(node --version 2>&1 || true)
    if [[ "$v" =~ v([0-9]+)\.([0-9]+)\.([0-9]+) ]]; then
        maj="${BASH_REMATCH[1]}"
        if [[ "$maj" -ge 22 ]]; then
            NODE_VER="${maj}.${BASH_REMATCH[2]}.${BASH_REMATCH[3]}"
        fi
    fi
fi

if [[ -n "$NODE_VER" ]]; then
    ok "Node.js v${NODE_VER}"
    hint "满足最低要求 v22"
else
    fail "未找到 Node.js 22+"
    echo ""
    case "$PLATFORM" in
        macos)
            hint "安装方法："
            hint "  ① brew install node"
            hint "  ② 访问 https://nodejs.org/ 下载"
            echo ""
            if command -v brew &>/dev/null; then
                read -rp "       是否用 brew 自动安装? (y/n): " c
                if [[ "$c" == "y" || "$c" == "Y" ]]; then
                    step "2/4" "正在通过 brew 安装 Node.js..."
                    brew install node
                    NODE_VER=$(node --version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
                    ok "Node.js v${NODE_VER} 安装完成"
                else
                    fail "请先安装 Node.js 22+，然后重新运行此脚本"; exit 1
                fi
            else
                fail "请先安装 Node.js 22+，然后重新运行此脚本"; exit 1
            fi
            ;;
        linux)
            hint "安装方法："
            hint "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -"
            hint "  sudo apt-get install -y nodejs"
            echo ""
            fail "请先安装 Node.js 22+，然后重新运行此脚本"; exit 1
            ;;
        windows)
            hint "安装方法："
            hint "  ① 访问 https://nodejs.org/ 下载安装"
            hint "  ② 安装完成后重新运行此脚本"
            echo ""
            fail "请先安装 Node.js 22+，然后重新运行此脚本"; exit 1
            ;;
    esac
fi

# ── 检查 npm ─────────────────────────────────────────────────
step "3/4" "检查 npm 包管理器"

if command -v npm &>/dev/null; then
    ok "npm v$(npm --version 2>&1)"
else
    fail "npm 未找到（通常随 Node.js 一起安装）"
    hint "请重新安装 Node.js: https://nodejs.org/"
    exit 1
fi

# ── 安装 Codex CLI ───────────────────────────────────────────
step "4/4" "安装 Codex CLI"

echo -e "       ${D}npm install -g @openai/codex${N}"
echo ""

if npm install -g @openai/codex 2>&1 | while IFS= read -r line; do echo -e "       ${D}${line}${N}"; done; then
    echo ""
    ok "Codex CLI 安装成功"
else
    echo ""
    fail "Codex CLI 安装失败"
    echo ""
    hint "可能的原因："
    hint "  ① 网络连接问题 — 请检查网络或设置代理"
    hint "  ② npm 权限问题 — 修复方法："
    hint "     mkdir -p ~/.npm-global"
    hint "     npm config set prefix '~/.npm-global'"
    hint '     echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.zshrc'
    echo ""
    hint "设置代理："
    hint '  export https_proxy="http://127.0.0.1:7890"'
    echo ""
    exit 1
fi

# ── 验证安装 ─────────────────────────────────────────────────
bar
echo -e "\n${C}${B}  验证安装${N}"

if command -v codex &>/dev/null; then
    VER=$(codex --version 2>&1 || true)
    ok "codex --version → ${VER}"
else
    NPM_PREFIX=$(npm config get prefix 2>/dev/null || echo "")
    CODEX_BIN="$NPM_PREFIX/bin/codex"
    if [[ -n "$NPM_PREFIX" && -f "$CODEX_BIN" ]]; then
        warn "codex 已安装但不在 PATH 中，正在修复..."
        SHELL_RC=""
        [[ "$SHELL" == */zsh ]]  && SHELL_RC="$HOME/.zshrc"
        [[ "$SHELL" == */bash ]] && SHELL_RC="$HOME/.bashrc"
        if [[ -n "$SHELL_RC" ]]; then
            echo "" >> "$SHELL_RC"
            echo "# Codex CLI" >> "$SHELL_RC"
            echo "export PATH=\"$NPM_PREFIX/bin:\$PATH\"" >> "$SHELL_RC"
            export PATH="$NPM_PREFIX/bin:$PATH"
            ok "PATH 已写入 $SHELL_RC"
        fi
        VER=$("$CODEX_BIN" --version 2>&1 || true)
        ok "codex --version → ${VER}"
    else
        fail "找不到 codex 可可执行文件"
        hint "请检查: npm config get prefix"
        exit 1
    fi
fi

# ── 检查认证 ─────────────────────────────────────────────────
bar
echo -e "\n${C}${B}  检查认证配置${N}"

if [[ -n "${OPENAI_API_KEY:-}" ]]; then
    ok "检测到 OPENAI_API_KEY 环境变量"
else
    warn "未检测到 OPENAI_API_KEY"
    echo ""
    hint "你需要配置认证才能使用 Codex："
    hint "  方式一：设置 API Key（推荐）"
    hint '    export OPENAI_API_KEY="sk-xxxxxxxx"'
    hint "  方式二：ChatGPT 账号认证"
    hint "    codex auth login"
fi

# ── 完成 ─────────────────────────────────────────────────────
bar
echo ""
echo -e "${G}${B}"
echo '     ╔══════════════════════════════════════════╗'
echo '     ║           ✔  Codex 安装完成              ║'
echo '     ╚══════════════════════════════════════════╝'
echo -e "${N}"
echo -e "  ${B}版本${N}   ${VER}"
echo ""
bar
echo -e "\n${B}  下一步做什么？${N}\n"
echo -e "  ${G}①${N} 配置认证"
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    echo -e "     ${Y}export OPENAI_API_KEY=\"sk-xxxxxxxx\"${N}"
    echo -e "     或者: ${Y}codex auth login${N}"
else
    echo -e "     ${G}✔ 已配置${N}"
fi
echo ""
echo -e "  ${G}②${N} 启动 Codex"
echo -e "     ${Y}codex${N}"
echo ""
echo -e "  ${G}③${N} 直接使用"
echo -e "     ${Y}codex \"用 Python 写一个 Hello World\"${N}"
echo ""
bar
echo -e "\n${B}  工作模式${N}\n"
echo -e "  ${Y}suggest${N}     只提供建议，不自动执行（默认）"
echo -e "  ${Y}auto-edit${N}   自动修改文件，不执行命令"
echo -e "  ${Y}full-auto${N}   完全自动执行（建议在 Git 项目中使用）"
echo ""
bar
echo -e "\n${B}  常用命令${N}\n"
echo -e "  ${Y}codex${N}                                  启动交互模式"
echo -e "  ${Y}codex \"你的问题\"${N}                        直接对话"
echo -e "  ${Y}codex --approval-mode full-auto${N}         全自动模式"
echo ""
bar
echo -e "\n${B}  国内用户${N}  如遇网络问题，设置代理：\n"
echo -e "  ${Y}export https_proxy=\"http://127.0.0.1:7890\"${N}"
echo -e "  ${Y}export http_proxy=\"http://127.0.0.1:7890\"${N}"
echo ""
bar
echo -e "  ${D}遇到问题？请访问 https://ai.cccode.com.cn/docs${N}"
echo ""
