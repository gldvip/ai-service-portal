#!/usr/bin/env bash
# ============================================================
#  OpenClaw（龙虾）一键安装脚本
#  支持系统：macOS / Linux / Windows (Git Bash / WSL2)
#  使用方法：
#    macOS/Linux:  curl -fsSL https://ai.cccode.com.cn/scripts/install-openclaw.sh | bash
#    Windows Git Bash: bash install-openclaw.sh
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
echo -e "${R}${B}"
echo '     ╔══════════════════════════════════════════╗'
echo '     ║                                          ║'
echo '     ║    ◆  OpenClaw (龙虾)  一键安装脚本  ◆   ║'
echo '     ║                                          ║'
echo '     ╚══════════════════════════════════════════╝'
echo -e "${N}"
bar

# ── 检测系统 ─────────────────────────────────────────────────
step "1/5" "检测操作系统"

OS="$(uname -s)"
case "$OS" in
    Darwin*)                PLATFORM="macos";   ok "macOS $(sw_vers -productVersion 2>/dev/null || echo '')" ;;
    Linux*)                 PLATFORM="linux";   ok "Linux $(uname -r)" ;;
    MINGW*|MSYS*|CYGWIN*)   PLATFORM="windows"; ok "Windows (Git Bash)" ;;
    *)                      fail "不支持的操作系统: $OS"; exit 1 ;;
esac

# ── 检查 Python ──────────────────────────────────────────────
step "2/5" "检查 Python 环境"

PYTHON_CMD=""
PYTHON_VER=""

for cmd in python3 python; do
    if command -v "$cmd" &>/dev/null; then
        v=$("$cmd" --version 2>&1 || true)
        if [[ "$v" =~ Python\ ([0-9]+)\.([0-9]+)\.([0-9]+) ]]; then
            maj="${BASH_REMATCH[1]}"
            min="${BASH_REMATCH[2]}"
            if [[ "$maj" -ge 3 && "$min" -ge 10 ]]; then
                PYTHON_CMD="$cmd"
                PYTHON_VER="$maj.$min.${BASH_REMATCH[3]}"
                break
            fi
        fi
    fi
done

if [[ -n "$PYTHON_CMD" ]]; then
    ok "Python ${PYTHON_VER} ($PYTHON_CMD)"
    hint "满足最低要求 3.10"
else
    fail "未找到 Python 3.10+"
    echo ""
    case "$PLATFORM" in
        macos)
            hint "安装方法："
            hint "  ① brew install python@3.12"
            hint "  ② 访问 https://www.python.org/downloads/ 下载"
            echo ""
            if command -v brew &>/dev/null; then
                read -rp "       是否用 brew 自动安装 Python? (y/n): " c
                if [[ "$c" == "y" || "$c" == "Y" ]]; then
                    step "2/5" "正在通过 brew 安装 Python..."
                    brew install python@3.12
                    PYTHON_CMD="python3"
                    PYTHON_VER=$($PYTHON_CMD --version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
                    ok "Python ${PYTHON_VER} 安装完成"
                else
                    fail "请先安装 Python 3.10+，然后重新运行此脚本"; exit 1
                fi
            else
                fail "请先安装 Python 3.10+，然后重新运行此脚本"; exit 1
            fi
            ;;
        linux)
            hint "安装方法："
            hint "  sudo apt update && sudo apt install python3.12 python3.12-venv python3-pip"
            echo ""
            fail "请先安装 Python 3.10+，然后重新运行此脚本"; exit 1
            ;;
        windows)
            hint "安装方法："
            hint "  ① 访问 https://www.python.org/downloads/ 下载"
            hint "  ② 安装时务必勾选 'Add Python to PATH'"
            echo ""
            fail "请先安装 Python 3.10+，然后重新运行此脚本"; exit 1
            ;;
    esac
fi

# ── 检查 pip ─────────────────────────────────────────────────
step "3/5" "检查 pip 包管理器"

PIP_CMD=""
for cmd in pip3 pip "$PYTHON_CMD -m pip"; do
    if $cmd --version &>/dev/null 2>&1; then
        PIP_CMD="$cmd"
        break
    fi
done

if [[ -z "$PIP_CMD" ]]; then
    warn "pip 未找到，正在安装..."
    if "$PYTHON_CMD" -m ensurepip --upgrade &>/dev/null 2>&1; then
        PIP_CMD="$PYTHON_CMD -m pip"
        ok "pip 安装成功"
    else
        fail "pip 安装失败"
        hint "请手动运行: $PYTHON_CMD -m ensurepip --upgrade"
        exit 1
    fi
else
    ok "pip 可用 ($PIP_CMD)"
fi

# ── 检查 venv ────────────────────────────────────────────────
step "4/5" "检查 venv 模块"

if "$PYTHON_CMD" -m venv --help &>/dev/null 2>&1; then
    ok "venv 模块可用"
else
    fail "venv 模块不可用"
    echo ""
    case "$PLATFORM" in
        macos)  hint "请重新安装: brew install python@3.12" ;;
        linux)  hint "请安装: sudo apt install python3.12-venv" ;;
        windows) hint "请重新安装 Python 并确保勾选所有可选组件" ;;
    esac
    exit 1
fi

# ── 创建虚拟环境 ─────────────────────────────────────────────
step "5/5" "创建虚拟环境并安装 OpenClaw"

VENV_DIR="$HOME/.openclaw-env"

if [[ -d "$VENV_DIR" ]]; then
    warn "虚拟环境已存在: $VENV_DIR"
    read -rp "       是否重新创建? (y/n): " c
    if [[ "$c" == "y" || "$c" == "Y" ]]; then
        rm -rf "$VENV_DIR"
        "$PYTHON_CMD" -m venv "$VENV_DIR"
        ok "虚拟环境已重新创建"
    else
        ok "使用现有虚拟环境"
    fi
else
    "$PYTHON_CMD" -m venv "$VENV_DIR"
    ok "虚拟环境创建成功"
fi

echo -e "       ${D}路径: $VENV_DIR${N}"

# 激活虚拟环境
source "$VENV_DIR/bin/activate"
ok "虚拟环境已激活"

# 安装 OpenClaw
echo ""
echo -e "       ${D}pip install openclaw${N}"
echo ""

if pip install openclaw 2>&1 | while IFS= read -r line; do echo -e "       ${D}${line}${N}"; done; then
    echo ""
    ok "OpenClaw 安装成功"
else
    echo ""
    fail "OpenClaw 安装失败"
    echo ""
    hint "可能的原因："
    hint "  ① 网络连接问题 — 请检查网络或设置代理"
    hint "  ② pip 版本过旧 — 尝试: pip install --upgrade pip"
    echo ""
    hint "设置代理："
    hint '  export HTTPS_PROXY="http://127.0.0.1:7890"'
    echo ""
    exit 1
fi

# ── 验证安装 ─────────────────────────────────────────────────
bar
echo -e "\n${C}${B}  验证安装${N}"

if command -v openclaw &>/dev/null; then
    VER=$(openclaw --version 2>&1 || true)
    ok "openclaw --version → ${VER}"
else
    fail "openclaw 命令不可用"
    hint "请确保虚拟环境已激活: source $VENV_DIR/bin/activate"
    exit 1
fi

# ── 完成 ─────────────────────────────────────────────────────
bar
echo ""
echo -e "${G}${B}"
echo '     ╔══════════════════════════════════════════╗'
echo '     ║          ✔  OpenClaw 安装完成            ║'
echo '     ╚══════════════════════════════════════════╝'
echo -e "${N}"
echo -e "  ${B}版本${N}   ${VER}"
echo -e "  ${B}环境${N}   ${VENV_DIR}"
echo ""
bar
echo -e "\n${B}  下一步做什么？${N}\n"
echo -e "  ${G}①${N} 激活虚拟环境（每次使用前都要执行）"
echo -e "     ${Y}source ~/.openclaw-env/bin/activate${N}"
echo ""
echo -e "  ${G}②${N} 配置 LLM 后端"
echo -e "     ${Y}openclaw config${N}"
echo -e "     ${D}支持: OpenAI / Anthropic / Ollama / DeepSeek${N}"
echo ""
echo -e "  ${G}③${N} 开始使用"
echo -e "     ${Y}openclaw chat \"你好\"${N}"
echo ""
bar
echo -e "\n${B}  常用命令${N}\n"
echo -e "  ${Y}openclaw config${N}              配置模型和 API Key"
echo -e "  ${Y}openclaw chat \"你的问题\"${N}       智能对话"
echo -e "  ${Y}openclaw gen --lang python \"描述\"${N}  生成代码"
echo -e "  ${Y}openclaw plugin install xxx${N}  安装插件"
echo ""
bar
echo -e "\n${B}  支持的模型后端${N}\n"
echo -e "  ${Y}OpenAI${N}      GPT-4o, GPT-4.1"
echo -e "  ${Y}Anthropic${N}   Claude Sonnet 4"
echo -e "  ${Y}Ollama${N}      Llama 3, Qwen 2.5（本地，无需 API Key）"
echo -e "  ${Y}DeepSeek${N}    DeepSeek V3（国内可直连）"
echo ""
bar
echo -e "\n${B}  使用本地模型（可选）${N}\n"
echo -e "  ${G}①${N} 安装 Ollama: https://ollama.com/download"
echo -e "  ${G}②${N} 下载模型: ${Y}ollama pull llama3${N}"
echo -e "  ${G}③${N} 配置: ${Y}openclaw config${N} → 选择 Ollama"
echo ""
bar
echo -e "\n${B}  卸载方法${N}\n"
echo -e "  ${Y}rm -rf ~/.openclaw-env${N}"
echo ""
bar
echo -e "  ${D}遇到问题？请访问 https://ai.cccode.com.cn/docs${N}"
echo ""
