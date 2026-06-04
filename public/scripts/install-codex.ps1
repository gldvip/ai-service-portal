#!/usr/bin/env pwsh
# ============================================================
#  OpenAI Codex CLI 一键安装脚本 - Windows PowerShell 版
#  使用方法：以管理员身份运行 PowerShell，执行：
#  irm https://ai.cccode.com.cn/scripts/install-codex.ps1 | iex
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
Write-Host "     ╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "     ║                                          ║" -ForegroundColor Cyan
Write-Host "     ║     ◆  Codex CLI  一键安装脚本  ◆        ║" -ForegroundColor White
Write-Host "     ║                                          ║" -ForegroundColor Cyan
Write-Host "     ╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Bar

# ── 检测系统 ─────────────────────────────────────────────────
Step "1/4" "检测操作系统"
Ok "$([System.Runtime.InteropServices.RuntimeInformation]::OSDescription)"

# ── 检查 Node.js ─────────────────────────────────────────────
Step "2/4" "检查 Node.js 环境"

$nodeVer = $null
try {
    $v = & node --version 2>&1
    if ($v -match "v(\d+)\.(\d+)\.(\d+)") {
        $maj = [int]$Matches[1]
        if ($maj -ge 22) { $nodeVer = "$maj.$($Matches[2]).$($Matches[3])" }
    }
} catch {}

if ($nodeVer) {
    Ok "Node.js v$nodeVer"
    Hint "满足最低要求 v22"
} else {
    Fail "未找到 Node.js 22+"
    Write-Host ""
    Hint "安装方法："
    Hint "  1. 访问 https://nodejs.org/ 下载 LTS 版本"
    Hint "  2. winget install OpenJS.NodeJS.LTS"
    Write-Host ""

    $hasNvm = $false
    try { & nvm version 2>&1 | Out-Null; $hasNvm = $true } catch {}

    if ($hasNvm) {
        $c = Read-Host "       检测到 nvm-windows，是否自动安装 Node.js 22? (y/n)"
        if ($c -eq "y" -or $c -eq "Y") {
            & nvm install 22
            & nvm use 22
            $nodeVer = & node --version 2>&1
            Ok "Node.js $nodeVer 安装完成"
        } else { Fail "请先安装 Node.js 22+"; exit 1 }
    } else {
        $c = Read-Host "       是否用 winget 自动安装? (y/n)"
        if ($c -eq "y" -or $c -eq "Y") {
            try {
                Step "2/4" "正在通过 winget 安装 Node.js..."
                winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
                Ok "Node.js 安装完成"
                Warn "请关闭并重新打开 PowerShell，然后重新运行此脚本"
            } catch { Fail "winget 安装失败，请手动安装 Node.js" }
            exit 1
        } else { Fail "请先安装 Node.js 22+"; exit 1 }
    }
}

# ── 检查 npm ─────────────────────────────────────────────────
Step "3/4" "检查 npm 包管理器"

try {
    $npmVer = & npm --version 2>&1
    Ok "npm v$npmVer"
} catch {
    Fail "npm 未找到（通常随 Node.js 一起安装）"
    Hint "请重新安装 Node.js: https://nodejs.org/"
    exit 1
}

# ── 安装 Codex CLI ───────────────────────────────────────────
Step "4/4" "安装 Codex CLI"

Write-Host "       npm install -g @openai/codex" -ForegroundColor DarkGray
Write-Host ""

try {
    & npm install -g @openai/codex 2>&1 | ForEach-Object { Write-Host "       $_" -ForegroundColor DarkGray }
    Write-Host ""
    Ok "Codex CLI 安装成功"
} catch {
    Write-Host ""
    Fail "Codex CLI 安装失败"
    Write-Host ""
    Hint "可能的原因："
    Hint "  1. 网络连接问题 - 请检查网络或设置代理"
    Hint "  2. npm 权限问题"
    Write-Host ""
    Hint "设置代理："
    Hint '  $env:HTTPS_PROXY = "http://127.0.0.1:7890"'
    Write-Host ""
    exit 1
}

# ── 验证安装 ─────────────────────────────────────────────────
Bar
Write-Host "`n  验证安装" -ForegroundColor Cyan

$codexVer = $null
try {
    $codexVer = & codex --version 2>&1
    Ok "codex --version -> $codexVer"
} catch {
    Fail "codex 命令不可用"
    try {
        $npmPrefix = & npm config get prefix 2>&1
        $codexPath = "$npmPrefix\codex.cmd"
        if (Test-Path $codexPath) {
            Warn "codex 已安装但不在 PATH 中"
            Hint "请将以下路径添加到系统 PATH 环境变量："
            Hint "  $npmPrefix"
        }
    } catch {}
    exit 1
}

# ── 检查认证 ─────────────────────────────────────────────────
Bar
Write-Host "`n  检查认证配置" -ForegroundColor Cyan

$hasKey = $false
if ($env:OPENAI_API_KEY) {
    Ok "检测到 OPENAI_API_KEY 环境变量"
    $hasKey = $true
} else {
    Warn "未检测到 OPENAI_API_KEY"
    Write-Host ""
    Hint "你需要配置认证才能使用 Codex："
    Hint "  方式一：设置 API Key（推荐）"
    Hint '    $env:OPENAI_API_KEY = "sk-xxxxxxxx"'
    Hint "  方式二：ChatGPT 账号认证"
    Hint "    codex auth login"
}

# ── 完成 ─────────────────────────────────────────────────────
Bar
Write-Host ""
Write-Host "     ╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "     ║           ✔  Codex 安装完成              ║" -ForegroundColor Green
Write-Host "     ╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  版本   $codexVer" -ForegroundColor White
Write-Host ""
Bar

Write-Host "`n  下一步做什么？`n" -ForegroundColor White

Write-Host "  " -NoNewline
Write-Host "①" -ForegroundColor Green -NoNewline
Write-Host " 配置认证"
if (-not $hasKey) {
    Write-Host '     $env:OPENAI_API_KEY = "sk-xxxxxxxx"' -ForegroundColor Yellow
    Write-Host "     或者: codex auth login" -ForegroundColor Yellow
} else {
    Write-Host "     已配置" -ForegroundColor Green
}

Write-Host "`n  " -NoNewline
Write-Host "②" -ForegroundColor Green -NoNewline
Write-Host " 启动 Codex"
Write-Host "     codex" -ForegroundColor Yellow

Write-Host "`n  " -NoNewline
Write-Host "③" -ForegroundColor Green -NoNewline
Write-Host " 直接使用"
Write-Host '     codex "用 Python 写一个 Hello World"' -ForegroundColor Yellow

Write-Host ""
Bar

Write-Host "`n  工作模式`n" -ForegroundColor White
Write-Host "  suggest     " -ForegroundColor Yellow -NoNewline
Write-Host "只提供建议，不自动执行（默认）"
Write-Host "  auto-edit   " -ForegroundColor Yellow -NoNewline
Write-Host "自动修改文件，不执行命令"
Write-Host "  full-auto   " -ForegroundColor Yellow -NoNewline
Write-Host "完全自动执行（建议在 Git 项目中使用）"

Write-Host ""
Bar

Write-Host "`n  常用命令`n" -ForegroundColor White
Write-Host "  codex                                  " -ForegroundColor Yellow -NoNewline
Write-Host "启动交互模式"
Write-Host '  codex "你的问题"                        ' -ForegroundColor Yellow -NoNewline
Write-Host "直接对话"
Write-Host "  codex --approval-mode full-auto         " -ForegroundColor Yellow -NoNewline
Write-Host "全自动模式"

Write-Host ""
Bar

Write-Host "`n  国内用户" -ForegroundColor White -NoNewline
Write-Host "  如遇网络问题，设置代理：`n"
Write-Host '  $env:HTTPS_PROXY = "http://127.0.0.1:7890"' -ForegroundColor Yellow

Write-Host ""
Bar
Write-Host "  遇到问题？请访问 https://ai.cccode.com.cn/docs" -ForegroundColor DarkGray
Write-Host ""
