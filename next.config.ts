import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 禁用静态页面缓存
  staticPageGenerationTimeout: 60,
  // 添加实验性功能
  experimental: {
    // 禁用静态优化缓存
  },
};

export default nextConfig;
