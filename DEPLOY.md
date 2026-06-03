# 部署指南

## 域名配置

二级域名：`ai.cccode.com.cn`

### DNS解析配置

在你的域名DNS管理后台添加以下记录：

| 主机记录 | 记录类型 | 记录值 | TTL |
|---------|---------|--------|-----|
| ai | A | 你的服务器IP | 600 |

---

## 服务器部署

### 1. 安装Docker和Docker Compose

```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 克隆代码

```bash
cd /opt
git clone https://github.com/你的用户名/ai-service-portal.git
cd ai-service-portal
```

### 3. 配置环境变量

```bash
# 创建环境变量文件
cat > .env.local << EOF
EMAIL_USER=gldvip@qq.com
EMAIL_PASS=abadeacqvpkebcbc
RECEIVE_EMAIL=gldvip@qq.com
EOF
```

### 4. 启动服务

```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 检查状态
docker-compose ps
```

### 5. 配置Nginx反向代理

```bash
# 安装Nginx
sudo apt update
sudo apt install nginx -y

# 复制Nginx配置
sudo cp nginx.conf /etc/nginx/sites-available/ai.cccode.com.cn

# 创建软链接
sudo ln -s /etc/nginx/sites-available/ai.cccode.com.cn /etc/nginx/sites-enabled/

# 删除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 6. 配置SSL证书（HTTPS）

#### 方式一：Let's Encrypt（免费）

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d ai.cccode.com.cn

# 自动续期测试
sudo certbot renew --dry-run
```

#### 方式二：使用自己的证书

```bash
# 创建证书目录
sudo mkdir -p /etc/nginx/ssl

# 复制证书文件
sudo cp your-cert.pem /etc/nginx/ssl/ai.cccode.com.cn.pem
sudo cp your-cert.key /etc/nginx/ssl/ai.cccode.com.cn.key

# 重启Nginx
sudo systemctl restart nginx
```

---

## 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 进入容器
docker exec -it ai-service-portal sh

# 重启服务
docker-compose restart
```

---

## 更新部署

```bash
# 拉取最新代码
git pull

# 重建并重启
docker-compose up -d --build
```

---

## 域名绑定验证

部署完成后，访问以下地址验证：

- https://ai.cccode.com.cn
- https://ai.cccode.com.cn/tools
- https://ai.cccode.com.cn/pricing
- https://ai.cccode.com.cn/contact

---

## SEO验证

- Google Search Console: https://search.google.com/search-console
- 提交sitemap: https://ai.cccode.com.cn/sitemap.xml
- 百度站长平台: https://ziyuan.baidu.com
