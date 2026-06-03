import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI工具安装服务 - Claude Code/Codex/OpenClaw专业安装 | ai.cccode.com.cn",
  description: "提供Claude Code、Codex、OpenClaw(龙虾)等主流AI工具的专业安装与配置服务，10分钟快速上手AI编程，限时特惠¥19.9",
  keywords: ["AI工具安装", "Claude Code安装", "Codex安装", "OpenClaw", "龙虾AI", "AI编程助手", "代码生成", "AI软件配置"],
  authors: [{ name: "AI工具安装服务" }],
  creator: "AI工具安装服务",
  publisher: "AI工具安装服务",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ai.cccode.com.cn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI工具安装服务 - Claude Code/Codex/OpenClaw专业安装",
    description: "提供Claude Code、Codex、OpenClaw(龙虾)等主流AI工具的专业安装与配置服务，10分钟快速上手AI编程",
    url: "https://ai.cccode.com.cn",
    siteName: "AI工具安装服务",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI工具安装服务 - Claude Code/Codex/OpenClaw专业安装",
    description: "提供Claude Code、Codex、OpenClaw(龙虾)等主流AI工具的专业安装与配置服务",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
