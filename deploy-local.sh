#!/bin/bash

# 本机生产环境部署脚本
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "  AI工具安装服务 - 本机生产环境部署"
echo "=========================================="

# 1. 停止旧服务
echo ""
echo -e "${YELLOW}[1/5] 停止旧服务...${NC}"
pm2 delete ai-service-portal 2>/dev/null || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

# 2. 构建生产版本
echo ""
echo -e "${YELLOW}[2/5] 构建生产版本...${NC}"
cd /Users/luck/cccode/ai-service-portal
npm run build

# 3. 用PM2启动生产服务
echo ""
echo -e "${YELLOW}[3/5] 启动生产服务...${NC}"
pm2 start ecosystem.config.js
pm2 save

# 4. 配置Nginx
echo ""
echo -e "${YELLOW}[4/5] 配置Nginx...${NC}"
NGINX_CONF_DIR=$(nginx -t 2>&1 | grep "configuration file" | awk '{print $4}' | xargs dirname)
cp nginx-local.conf "$NGINX_CONF_DIR/servers/ai.cccode.com.cn.conf" 2>/dev/null || \
  sudo cp nginx-local.conf "$NGINX_CONF_DIR/servers/ai.cccode.com.cn.conf" 2>/dev/null || \
  mkdir -p "$NGINX_CONF_DIR/servers" && cp nginx-local.conf "$NGINX_CONF_DIR/servers/ai.cccode.com.cn.conf"

# 5. 重启Nginx
echo ""
echo -e "${YELLOW}[5/5] 重启Nginx...${NC}"
sudo nginx -t && sudo nginx -s reload 2>/dev/null || sudo nginx

echo ""
echo -e "${GREEN}=========================================="
echo "  部署完成！"
echo "==========================================${NC}"
echo ""
echo "服务状态："
pm2 status
echo ""
echo "访问地址："
echo "  - http://localhost:3000"
echo "  - https://ai.cccode.com.cn"
echo ""
echo "常用命令："
echo "  - 查看日志: pm2 logs ai-service-portal"
echo "  - 重启服务: pm2 restart ai-service-portal"
echo "  - 停止服务: pm2 stop ai-service-portal"
echo ""
