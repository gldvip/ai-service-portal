#!/usr/bin/env pwsh
# ============================================================
#  Claude Code 一键安装脚本 - Windows PowerShell 版
#  使用方法：以管理员身份运行 PowerShell，执行：
#  irm https://ai.cccode.com.cn/scripts/install-claude-code.ps1 | iex
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
Write-Host "     $([char]0x2554)$([char]0x2550)" -NoNewline -ForegroundColor Magenta
Write-Host "$([char]0x2550)" -NoNewline -ForegroundColor Magenta
Write-Host ("$([char]0x2550)" * 38) -NoNewline -ForegroundColor Magenta
Write-Host "$([char]0x2550)$([char]0x2557)" -ForegroundColor Magenta
Write-Host "     $([char]0x2551)" -NoNewline -ForegroundColor Magenta
Write-Host (" " * 40) -NoNewline
Write-Host "$([char]0x2551)" -ForegroundColor Magenta
Write-Host "     $([char]0x2551)" -NoNewline -ForegroundColor Magenta
Write-Host "    ◆  Claude Code  一键安装脚本  ◆       " -NoNewline -ForegroundColor White
Write-Host "$([char]0x2551)" -ForegroundColor Magenta
Write-Host "     $([char]0x2551)" -NoNewline -ForegroundColor Magenta
Write-Host (" " * 40) -NoNewline
Write-Host "$([char]0x2551)" -ForegroundColor Magenta
Write-Host "     $([char]0x255A)" -NoNewline -ForegroundColor Magenta
Write-Host ("$([char]0x2550)" * 40) -NoNewline -ForegroundColor Magenta
Write-Host "$([char]0x255D)" -ForegroundColor Magenta
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
        if ($maj -ge 18) { $nodeVer = "$maj.$($Matches[2]).$($Matches[3])" }
    }
} catch {}

if ($nodeVer) {
    Ok "Node.js v$nodeVer"
    Hint "满足最低要求 v18"
} else {
    Fail "未找到 Node.js 18+"
    Write-Host ""
    Hint "安装方法："
    Hint "  1. 访问 https://nodejs.org/ 下载 LTS 版本"
    Hint "  2. winget install OpenJS.NodeJS.LTS"
    Write-Host ""

    $hasNvm = $false
    try { & nvm version 2>&1 | Out-Null; $hasNvm = $true } catch {}

    if ($hasNvm) {
        $c = Read-Host "       检测到 nvm-windows，是否自动安装 Node.js 18? (y/n)"
        if ($c -eq "y" -or $c -eq "Y") {
            & nvm install 18
            & nvm use 18
            $nodeVer = & node --version 2>&1
            Ok "Node.js $nodeVer 安装完成"
        } else { Fail "请先安装 Node.js 18+"; exit 1 }
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
        } else { Fail "请先安装 Node.js 18+"; exit 1 }
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

# ── 安装 Claude Code ─────────────────────────────────────────
Step "4/4" "安装 Claude Code"

Write-Host "       npm install -g @anthropic-ai/claude-code" -ForegroundColor DarkGray
Write-Host ""

try {
    & npm install -g @anthropic-ai/claude-code 2>&1 | ForEach-Object { Write-Host "       $_" -ForegroundColor DarkGray }
    Write-Host ""
    Ok "Claude Code 安装成功"
} catch {
    Write-Host ""
    Fail "Claude Code 安装失败"
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

$claudeVer = $null
try {
    $claudeVer = & claude --version 2>&1
    Ok "claude --version -> $claudeVer"
} catch {
    Fail "claude 命令不可用"
    try {
        $npmPrefix = & npm config get prefix 2>&1
        $claudePath = "$npmPrefix\claude.cmd"
        if (Test-Path $claudePath) {
            Warn "claude 已安装但不在 PATH 中"
            Hint "请将以下路径添加到系统 PATH 环境变量："
            Hint "  $npmPrefix"
        }
    } catch {}
    exit 1
}

# ── 完成 ─────────────────────────────────────────────────────
Bar
Write-Host ""
Write-Host "     ╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "     ║         ✔  Claude Code 安装完成          ║" -ForegroundColor Green
Write-Host "     ╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  版本   $claudeVer" -ForegroundColor White
Write-Host ""
Bar

Write-Host "`n  下一步做什么？`n" -ForegroundColor White

Write-Host "  " -NoNewline
Write-Host "①" -ForegroundColor Green -NoNewline
Write-Host " 启动 Claude Code"
Write-Host "     claude" -ForegroundColor Yellow

Write-Host "`n  " -NoNewline
Write-Host "②" -ForegroundColor Green -NoNewline
Write-Host " 首次启动会引导你完成 OAuth 认证"
Write-Host "     终端会显示链接 -> 浏览器打开 -> 登录授权 -> 返回终端"

Write-Host "`n  " -NoNewline
Write-Host "③" -ForegroundColor Green -NoNewline
Write-Host " 认证成功后，直接用自然语言对话"
Write-Host '     claude "帮我写一个 Express 路由"' -ForegroundColor Yellow

Write-Host ""
Bar

Write-Host "`n  常用命令`n" -ForegroundColor White
Write-Host "  claude                            " -ForegroundColor Yellow -NoNewline
Write-Host "启动交互模式"
Write-Host '  claude "你好"                      ' -ForegroundColor Yellow -NoNewline
Write-Host "直接对话"
Write-Host "  claude review                     " -ForegroundColor Yellow -NoNewline
Write-Host "审查代码变更"

Write-Host ""
Bar

Write-Host "`n  认证方式`n" -ForegroundColor White
Write-Host "  " -NoNewline
Write-Host "推荐" -ForegroundColor Green -NoNewline
Write-Host "  OAuth 认证 — 直接运行 claude，按提示操作"
Write-Host "  " -NoNewline
Write-Host "备选" -ForegroundColor Green -NoNewline
Write-Host "  API Key"
Write-Host '    $env:ANTHROPIC_API_KEY = "your-api-key"' -ForegroundColor Yellow

Write-Host ""
Bar

Write-Host "`n  国内用户" -ForegroundColor White -NoNewline
Write-Host "  如遇网络问题，设置代理：`n"
Write-Host '  $env:HTTPS_PROXY = "http://127.0.0.1:7890"' -ForegroundColor Yellow

Write-Host ""
Bar
Write-Host "  遇到问题？请访问 https://ai.cccode.com.cn/docs" -ForegroundColor DarkGray
Write-Host ""
