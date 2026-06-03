import Link from 'next/link';

const tools = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    company: 'Anthropic',
    icon: '🤖',
    category: 'AI编程助手',
    description: 'Anthropic官方推出的AI编程助手，集成在终端中，支持代码编写、调试、重构等任务，是目前最强大的AI编程工具之一。',
    features: ['终端集成', '代码生成', '智能调试', '项目理解', '多语言支持'],
    difficulty: '中等',
    installTime: '10-15分钟',
  },
  {
    id: 'codex',
    name: 'Codex',
    company: 'OpenAI',
    icon: '💻',
    category: '代码生成模型',
    description: 'OpenAI开发的代码生成模型，能够理解自然语言并生成高质量代码，支持多种编程语言。',
    features: ['自然语言转代码', '多语言支持', '代码补全', '上下文理解'],
    difficulty: '简单',
    installTime: '5-10分钟',
  },
  {
    id: 'openclaw',
    name: 'OpenClaw（龙虾）',
    company: 'OpenClaw',
    icon: '🦞',
    category: 'AI开发工具',
    description: '龙虾AI - 智能开发工具，提供强大的AI辅助编程能力，帮助开发者提高编码效率和代码质量。',
    features: ['AI辅助编程', '代码优化', '智能提示', '项目管理', '团队协作'],
    difficulty: '简单',
    installTime: '5-10分钟',
  },
];

export default function ToolsPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">支持的AI工具</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们提供主流AI工具的专业安装与配置服务
          </p>
          {/* 活动横幅 */}
          <div className="mt-6 bg-red-500 text-white px-8 py-4 rounded-xl inline-block">
            <span className="font-bold text-xl">🎉 限时特惠活动</span>
            <span className="mx-3">|</span>
            <span className="text-lg">所有工具安装仅需 <span className="font-bold text-2xl">¥19.9</span></span>
            <span className="mx-3">|</span>
            <span className="text-lg">截止6月底</span>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              id={tool.id}
              className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{tool.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{tool.name}</h3>
                      <p className="text-sm text-gray-500">{tool.company}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                    {tool.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>⏱️ {tool.installTime}</span>
                    <span>📊 {tool.difficulty}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 line-through text-sm">¥49</span>
                    <span className="text-red-500 font-bold text-lg ml-2">¥19.9</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="block mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  立即咨询安装
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            活动截止6月底，抓紧时间！
          </h2>
          <p className="text-gray-600 mb-6">
            所有AI工具安装服务统一定价 ¥19.9，错过再等一年
          </p>
          <Link
            href="/contact"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            立即抢购
          </Link>
        </div>
      </div>
    </div>
  );
}
