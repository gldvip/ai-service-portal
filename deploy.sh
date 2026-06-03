#!/bin/bash

# 部署脚本 - 解决缓存问题
set -e

echo "=========================================="
echo "  AI工具安装服务 - 部署更新"
echo "=========================================="

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}[1/4] 拉取最新代码...${NC}"
git pull

echo ""
echo -e "${YELLOW}[2/4] 停止旧容器...${NC}"
docker-compose down

echo ""
echo -e "${YELLOW}[3/4] 清除缓存并重新构建...${NC}"
# 清除Docker缓存
docker builder prune -f
# 重新构建（不使用缓存）
docker-compose build --no-cache

echo ""
echo -e "${YELLOW}[4/4] 启动新容器...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}=========================================="
echo "  部署完成！"
echo "==========================================${NC}"
echo ""
echo "访问 https://ai.cccode.com.cn 查看效果"
echo ""
