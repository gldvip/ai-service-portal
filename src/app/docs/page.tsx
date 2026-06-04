import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '使用教程 - Claude Code / Codex / OpenClaw 安装与使用指南',
  description: 'Claude Code、Codex、OpenClaw（龙虾）的详细使用指南和安装教程，助你快速上手AI编程',
};

const usageSections = [
  { title: 'Claude Code 使用指南', anchor: 'claude-code-使用指南', summary: '从零开始掌握 Claude Code 的核心功能与日常开发工作流' },
  { title: 'Codex 使用指南', anchor: 'codex-使用指南', summary: '掌握 OpenAI Codex CLI 的使用方法，高效完成代码生成与调试' },
  { title: 'OpenClaw（龙虾）使用指南', anchor: 'openclaw-龙虾-使用指南', summary: '全面了解 OpenClaw 的功能特性与日常开发使用方法' },
];

const installSections = [
  { title: 'Claude Code 安装教程', anchor: 'claude-code-安装教程', summary: '手把手指导你在 macOS / Linux / Windows 上安装 Claude Code' },
  { title: 'Codex 安装教程', anchor: 'codex-安装教程', summary: '完整指导 OpenAI Codex CLI 的安装、认证与初始配置' },
  { title: 'OpenClaw（龙虾）安装教程', anchor: 'openclaw-龙虾-安装教程', summary: '详细指导 OpenClaw 在不同环境下的安装与模型配置' },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>📚</span>
            <span>全部文档免费阅读 · 需联系客服获取查阅密码</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            使用<span className="text-blue-600">教程</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Claude Code、Codex、OpenClaw（龙虾）三大主流 AI 编程工具的
            <br className="hidden sm:block" />
            详细使用指南与手把手安装教程，助你 10 分钟上手 AI 编程
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 使用指南 */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
              📘
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">使用指南</h2>
              <p className="text-sm text-gray-500 mt-0.5">从入门到精通，掌握每个工具的核心功能</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {usageSections.map((section, i) => (
              <Link
                key={section.anchor}
                href={`/docs/guides#${section.anchor}`}
                className="group relative bg-white border border-gray-200 group-hover:border-blue-300 rounded-2xl p-7 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                    📘 使用指南
                  </span>
                  <span className="text-3xl font-black text-gray-100 group-hover:text-gray-200 transition-colors select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2.5 group-hover:text-blue-600 transition-colors leading-snug">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{section.summary}</p>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                  查看文档
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 安装教程 */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
              ⚙️
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">安装教程</h2>
              <p className="text-sm text-gray-500 mt-0.5">覆盖 macOS / Linux / Windows，每一步都有详细说明</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {installSections.map((section, i) => (
              <Link
                key={section.anchor}
                href={`/docs/guides#${section.anchor}`}
                className="group relative bg-white border border-gray-200 group-hover:border-emerald-300 rounded-2xl p-7 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />

                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                    ⚙️ 安装教程
                  </span>
                  <span className="text-3xl font-black text-gray-100 group-hover:text-gray-200 transition-colors select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2.5 group-hover:text-emerald-600 transition-colors leading-snug">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{section.summary}</p>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
                  查看教程
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 密码提示 */}
        <div className="relative bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-10 text-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full shadow-sm">
            需要密码
          </div>
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-gray-700 font-medium mb-2">以上文档需要输入查阅密码才能查看完整内容</p>
          <p className="text-sm text-gray-500">
            请{' '}
            <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
              联系我们
            </Link>{' '}
            获取密码 · 密码仅用于保护原创内容
          </p>
        </div>
      </div>
    </div>
  );
}
