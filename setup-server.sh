#!/bin/bash

# AI工具安装服务 - 服务器一键部署脚本
# 使用方法：在服务器上运行 bash setup-server.sh

set -e

echo "=========================================="
echo "  AI工具安装服务 - 服务器部署脚本"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 sudo 运行此脚本${NC}"
    echo "使用方法: sudo bash setup-server.sh"
    exit 1
fi

echo ""
echo -e "${YELLOW}[1/6] 检查并安装 Docker...${NC}"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
    echo -e "${GREEN}Docker 安装完成${NC}"
else
    echo -e "${GREEN}Docker 已安装${NC}"
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "安装 Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose 安装完成${NC}"
else
    echo -e "${GREEN}Docker Compose 已安装${NC}"
fi

echo ""
echo -e "${YELLOW}[2/6] 克隆项目代码...${NC}"

# 克隆代码
cd /opt
if [ -d "ai-service-portal" ]; then
    echo "项目目录已存在，更新代码..."
    cd ai-service-portal
    git pull
else
    git clone https://github.com/gldvip/ai-service-portal.git
    cd ai-service-portal
fi

echo ""
echo -e "${YELLOW}[3/6] 配置环境变量...${NC}"

# 创建环境变量文件
cat > .env.local << 'EOF'
EMAIL_USER=gldvip@qq.com
EMAIL_PASS=abadeacqvpkebcbc
RECEIVE_EMAIL=gldvip@qq.com
EOF

echo -e "${GREEN}环境变量配置完成${NC}"

echo ""
echo -e "${YELLOW}[4/6] 构建并启动 Docker 容器...${NC}"

# 停止旧容器（如果存在）
docker-compose down 2>/dev/null || true

# 构建并启动
docker-compose up -d --build

echo -e "${GREEN}Docker 容器启动成功${NC}"

echo ""
echo -e "${YELLOW}[5/6] 检查服务状态...${NC}"

# 等待服务启动
sleep 5

# 检查容器状态
if docker ps | grep -q "ai-service-portal"; then
    echo -e "${GREEN}✓ 服务运行正常${NC}"
else
    echo -e "${RED}✗ 服务启动失败，请检查日志: docker-compose logs${NC}"
    exit 1
fi

# 测试本地访问
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo -e "${GREEN}✓ 本地访问正常${NC}"
else
    echo -e "${YELLOW}⚠ 服务可能还在启动中，请稍等片刻${NC}"
fi

echo ""
echo -e "${YELLOW}[6/6] 检查 Cloudflare Tunnel...${NC}"

# 检查 cloudflared 是否安装
if command -v cloudflared &> /dev/null; then
    echo -e "${GREEN}cloudflared 已安装${NC}"
    echo ""
    echo "请在 Cloudflare Zero Trust 控制台添加隧道配置："
    echo "-----------------------------------------------"
    echo "1. 访问 https://one.dash.cloudflare.com"
    echo "2. 左侧菜单 → 网络 → Tunnels"
    echo "3. 找到现有隧道，点击配置"
    echo "4. 公共主机名 → 添加公共主机名"
    echo "5. 填写："
    echo "   - 子域名: ai"
    echo "   - 域名: cccode.com.cn"
    echo "   - 类型: HTTP"
    echo "   - URL: localhost:3000"
    echo "-----------------------------------------------"
else
    echo -e "${YELLOW}cloudflared 未安装${NC}"
    echo ""
    echo "是否安装 cloudflared？(y/n)"
    read -r install_cf

    if [ "$install_cf" = "y" ] || [ "$install_cf" = "Y" ]; then
        echo "安装 cloudflared..."

        # 检测系统类型
        if [ -f /etc/debian_version ]; then
            # Debian/Ubuntu
            curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
            dpkg -i cloudflared.deb
            rm cloudflared.deb
        elif [ -f /etc/redhat-release ]; then
            # CentOS/RHEL
            curl -L --output cloudflared.rpm https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm
            rpm -i cloudflared.rpm
            rm cloudflared.rpm
        else
            # 通用Linux
            curl -L --output cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
            chmod +x cloudflared
            mv cloudflared /usr/local/bin/
        fi

        echo -e "${GREEN}cloudflared 安装完成${NC}"
        echo ""
        echo "请运行以下命令登录并配置隧道："
        echo "  cloudflared tunnel login"
        echo "  cloudflared tunnel create ai-service"
        echo "  cloudflared tunnel route dns ai-service ai.cccode.com.cn"
    fi
fi

echo ""
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""
echo "服务信息："
echo "  - 本地地址: http://localhost:3000"
echo "  - 项目目录: /opt/ai-service-portal"
echo ""
echo "常用命令："
echo "  - 查看日志: cd /opt/ai-service-portal && docker-compose logs -f"
echo "  - 重启服务: cd /opt/ai-service-portal && docker-compose restart"
echo "  - 停止服务: cd /opt/ai-service-portal && docker-compose down"
echo "  - 更新服务: cd /opt/ai-service-portal && git pull && docker-compose up -d --build"
echo ""
echo "访问地址（配置隧道后）: https://ai.cccode.com.cn"
echo ""
