#!/usr/bin/env pwsh
# ============================================================
#  OpenClaw（龙虾）一键安装脚本 - Windows PowerShell 版
#  使用方法：以管理员身份运行 PowerShell，执行：
#  irm https://ai.cccode.com.cn/scripts/install-openclaw.ps1 | iex
# ============================================================

$ErrorActionPreference = "Stop"

# ── 输出工具 ──────────────────────────────────────────────────
function Step   { param($n, $msg) Write-Host "`n  [$n] $msg" -ForegroundColor Cyan }
function Ok     { param($msg) Write-Host "       $([char]0x2714) $msg" -ForegroundColor Green }
function Warn   { param($msg) Write-Host "       $([char]0x26A0) $msg" -ForegroundColor Yellow }
function Fail   { param($msg) Write-Host "       $([char]0x2718) $msg" -ForegroundColor Red }
function Hint   { param($msg) Write-Host "       $msg" -ForegroundColor DarkGray }
function Bar    { Write-Host "  ──────────────────────────────────────────────" -ForegroundColor DarkGray }

# ── Banner ───────────────────────────────────────────────────
Write-Host ""
Write-Host "     ╔══════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "     ║                                          ║" -ForegroundColor Red
Write-Host "     ║    ◆  OpenClaw (龙虾)  一键安装脚本  ◆   ║" -ForegroundColor White
Write-Host "     ║                                          ║" -ForegroundColor Red
Write-Host "     ╚══════════════════════════════════════════╝" -ForegroundColor Red
Bar

# ── 检测系统 ─────────────────────────────────────────────────
Step "1/5" "检测操作系统"
Ok "$([System.Runtime.InteropServices.RuntimeInformation]::OSDescription)"

# ── 检查 Python ──────────────────────────────────────────────
Step "2/5" "检查 Python 环境"

$pythonCmd = $null
$pythonVer = $null

foreach ($cmd in @("python3", "python")) {
    try {
        $v = & $cmd --version 2>&1
        if ($v -match "Python (\d+)\.(\d+)\.(\d+)") {
            $maj = [int]$Matches[1]
            $min = [int]$Matches[2]
            if ($maj -ge 3 -and $min -ge 10) {
                $pythonCmd = $cmd
                $pythonVer = "$maj.$min.$($Matches[3])"
                break
            }
        }
    } catch {}
}

if ($pythonCmd) {
    Ok "Python $pythonVer ($pythonCmd)"
    Hint "满足最低要求 3.10"
} else {
    # 检查 py launcher
    try { & py --version 2>&1 | Out-Null; $pythonCmd = "py" } catch {}

    if (-not $pythonCmd) {
        Fail "未找到 Python 3.10+"
        Write-Host ""
        Hint "安装方法："
        Hint "  1. 访问 https://www.python.org/downloads/ 下载"
        Hint "  2. winget install Python.Python.3.12"
        Hint "  3. 安装时务必勾选 'Add Python to PATH'"
        Write-Host ""

        $c = Read-Host "       是否用 winget 自动安装 Python? (y/n)"
        if ($c -eq "y" -or $c -eq "Y") {
            try {
                Step "2/5" "正在通过 winget 安装 Python..."
                winget install Python.Python.3.12 --accept-package-agreements --accept-source-agreements
                Ok "Python 安装完成"
                Warn "请关闭并重新打开 PowerShell，然后重新运行此脚本"
            } catch { Fail "winget 安装失败，请手动安装 Python" }
            exit 1
        } else { Fail "请先安装 Python 3.10+"; exit 1 }
    }
}

# ── 检查 pip ─────────────────────────────────────────────────
Step "3/5" "检查 pip 包管理器"

$pipCmd = $null
foreach ($cmd in @("pip3", "pip", "$pythonCmd -m pip")) {
    try {
        $parts = $cmd.Split(" ")
        $pipVer = & $parts[0] $parts[1..($parts.Length-1)] --version 2>&1
        if ($pipVer -match "pip") { $pipCmd = $cmd; break }
    } catch {}
}

if ($pipCmd) {
    Ok "pip 可用 ($pipCmd)"
} else {
    Warn "pip 未找到，正在安装..."
    try {
        & $pythonCmd -m ensurepip --upgrade 2>&1 | Out-Null
        $pipCmd = "$pythonCmd -m pip"
        Ok "pip 安装成功"
    } catch {
        Fail "pip 安装失败"
        Hint "请手动运行: $pythonCmd -m ensurepip --upgrade"
        exit 1
    }
}

# ── 检查 venv ────────────────────────────────────────────────
Step "4/5" "检查 venv 模块"

try {
    & $pythonCmd -m venv --help 2>&1 | Out-Null
    Ok "venv 模块可用"
} catch {
    Fail "venv 模块不可用"
    Hint "请重新安装 Python 并确保勾选所有可选组件"
    exit 1
}

# ── 创建虚拟环境并安装 ──────────────────────────────────────
Step "5/5" "创建虚拟环境并安装 OpenClaw"

$venvPath = "$env:USERPROFILE\.openclaw-env"

if (Test-Path $venvPath) {
    Warn "虚拟环境已存在: $venvPath"
    $c = Read-Host "       是否重新创建? (y/n)"
    if ($c -eq "y" -or $c -eq "Y") {
        Remove-Item -Recurse -Force $venvPath
        & $pythonCmd -m venv $venvPath
        Ok "虚拟环境已重新创建"
    } else {
        Ok "使用现有虚拟环境"
    }
} else {
    & $pythonCmd -m venv $venvPath
    Ok "虚拟环境创建成功"
}

Write-Host "       路径: $venvPath" -ForegroundColor DarkGray

# 激活虚拟环境
$activateScript = "$venvPath\Scripts\Activate.ps1"
if (Test-Path $activateScript) {
    & $activateScript
    Ok "虚拟环境已激活"
} else {
    Fail "找不到激活脚本: $activateScript"
    exit 1
}

# 安装 OpenClaw
Write-Host ""
Write-Host "       pip install openclaw" -ForegroundColor DarkGray
Write-Host ""

try {
    & pip install openclaw 2>&1 | ForEach-Object { Write-Host "       $_" -ForegroundColor DarkGray }
    Write-Host ""
    Ok "OpenClaw 安装成功"
} catch {
    Write-Host ""
    Fail "OpenClaw 安装失败"
    Write-Host ""
    Hint "可能的原因："
    Hint "  1. 网络连接问题 - 请检查网络或设置代理"
    Hint "  2. pip 版本过旧 - 尝试: pip install --upgrade pip"
    Write-Host ""
    Hint "设置代理："
    Hint '  $env:HTTPS_PROXY = "http://127.0.0.1:7890"'
    Write-Host ""
    exit 1
}

# ── 验证安装 ─────────────────────────────────────────────────
Bar
Write-Host "`n  验证安装" -ForegroundColor Cyan

try {
    $ver = & openclaw --version 2>&1
    Ok "openclaw --version -> $ver"
} catch {
    Fail "openclaw 命令不可用"
    Hint "请确保激活虚拟环境: & '$activateScript'"
    exit 1
}

# ── 完成 ─────────────────────────────────────────────────────
Bar
Write-Host ""
Write-Host "     ╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "     ║          ✔  OpenClaw 安装完成            ║" -ForegroundColor Green
Write-Host "     ╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  版本   $ver" -ForegroundColor White
Write-Host "  环境   $venvPath" -ForegroundColor White
Write-Host ""
Bar

Write-Host "`n  下一步做什么？`n" -ForegroundColor White

Write-Host "  " -NoNewline
Write-Host "①" -ForegroundColor Green -NoNewline
Write-Host " 激活虚拟环境（每次使用前都要执行）"
Write-Host "     & '$activateScript'" -ForegroundColor Yellow

Write-Host "`n  " -NoNewline
Write-Host "②" -ForegroundColor Green -NoNewline
Write-Host " 配置 LLM 后端"
Write-Host "     openclaw config" -ForegroundColor Yellow
Write-Host "     支持: OpenAI / Anthropic / Ollama / DeepSeek" -ForegroundColor DarkGray

Write-Host "`n  " -NoNewline
Write-Host "③" -ForegroundColor Green -NoNewline
Write-Host " 开始使用"
Write-Host '     openclaw chat "你好"' -ForegroundColor Yellow

Write-Host ""
Bar

Write-Host "`n  常用命令`n" -ForegroundColor White
Write-Host "  openclaw config              " -ForegroundColor Yellow -NoNewline
Write-Host "配置模型和 API Key"
Write-Host '  openclaw chat "你的问题"       ' -ForegroundColor Yellow -NoNewline
Write-Host "智能对话"
Write-Host '  openclaw gen --lang python "描述"' -ForegroundColor Yellow -NoNewline
Write-Host " 生成代码"
Write-Host "  openclaw plugin install xxx  " -ForegroundColor Yellow -NoNewline
Write-Host "安装插件"

Write-Host ""
Bar

Write-Host "`n  支持的模型后端`n" -ForegroundColor White
Write-Host "  OpenAI      " -ForegroundColor Yellow -NoNewline
Write-Host "GPT-4o, GPT-4.1"
Write-Host "  Anthropic   " -ForegroundColor Yellow -NoNewline
Write-Host "Claude Sonnet 4"
Write-Host "  Ollama      " -ForegroundColor Yellow -NoNewline
Write-Host "Llama 3, Qwen 2.5（本地，无需 API Key）"
Write-Host "  DeepSeek    " -ForegroundColor Yellow -NoNewline
Write-Host "DeepSeek V3（国内可直连）"

Write-Host ""
Bar

Write-Host "`n  使用本地模型（可选）`n" -ForegroundColor White
Write-Host "  " -NoNewline
Write-Host "①" -ForegroundColor Green -NoNewline
Write-Host " 安装 Ollama: https://ollama.com/download"
Write-Host "  " -NoNewline
Write-Host "②" -ForegroundColor Green -NoNewline
Write-Host " 下载模型: ollama pull llama3" -ForegroundColor Yellow
Write-Host "  " -NoNewline
Write-Host "③" -ForegroundColor Green -NoNewline
Write-Host " 配置: openclaw config -> 选择 Ollama" -ForegroundColor Yellow

Write-Host ""
Bar

Write-Host "`n  卸载方法`n" -ForegroundColor White
Write-Host "  Remove-Item -Recurse -Force '$venvPath'" -ForegroundColor Yellow

Write-Host ""
Bar
Write-Host "  遇到问题？请访问 https://ai.cccode.com.cn/docs" -ForegroundColor DarkGray
Write-Host ""
