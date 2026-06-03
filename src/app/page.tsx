import Link from 'next/link';

const features = [
  {
    icon: '⚡',
    title: '快速安装',
    description: '10分钟内完成AI工具安装配置，立即开始使用',
  },
  {
    icon: '🔧',
    title: '专业配置',
    description: '根据您的需求定制最优配置方案',
  },
  {
    icon: '🛡️',
    title: '售后保障',
    description: '7天免费技术支持，确保稳定运行',
  },
  {
    icon: '📚',
    title: '使用指导',
    description: '提供详细使用教程和最佳实践指南',
  },
];

const tools = [
  { name: 'Claude Code', desc: 'Anthropic官方AI编程助手', icon: '🤖' },
  { name: 'Codex', desc: 'OpenAI代码生成模型', icon: '💻' },
  { name: 'OpenClaw', desc: '龙虾AI - 智能开发工具', icon: '🦞' },
];

const steps = [
  { step: '01', title: '咨询需求', desc: '告诉我您需要安装的AI工具' },
  { step: '02', title: '远程安装', desc: '通过远程协助完成安装配置' },
  { step: '03', title: '测试验收', desc: '确保工具正常运行' },
  { step: '04', title: '使用指导', desc: '提供使用教程和技巧' },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              专业<span className="text-blue-600">AI工具</span>安装服务
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Claude Code、Codex、OpenClaw（龙虾）等主流AI工具一键安装配置，
              让您10分钟内开始AI编程之旅
            </p>
            {/* 活动横幅 */}
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg inline-block mb-6">
              <span className="font-bold text-lg">限时活动</span>
              <span className="mx-2">|</span>
              <span>所有工具安装仅需 ¥19.9</span>
              <span className="mx-2">|</span>
              <span>截止6月底</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                立即咨询
              </Link>
              <Link
                href="/tools"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                查看工具列表
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们</h2>
            <p className="text-gray-600">专业的服务，让您专注于创作</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">支持的AI工具</h2>
            <p className="text-gray-600">覆盖主流AI开发工具，一站式安装服务</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{tool.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-600">{tool.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/tools"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              查看全部工具 →
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">服务流程</h2>
            <p className="text-gray-600">简单四步，完成AI工具安装</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好开始AI编程了吗？
          </h2>
          <p className="text-blue-100 mb-8">
            立即联系我们，10分钟内完成AI工具安装
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            免费咨询
          </Link>
        </div>
      </section>
    </div>
  );
}
