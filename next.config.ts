import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 允许 Cloudflare Tunnel 访问开发服务器
  allowedDevOrigins: ['ai.cccode.com.cn'],
};

export default nextConfig;
