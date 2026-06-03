import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '服务定价 - AI工具安装限时特惠¥19.9 | 截止6月底',
  description: 'AI工具安装服务限时特惠，Claude Code、Codex、OpenClaw仅需¥19.9/个，全套套餐¥49.9，截止6月底',
  keywords: ['AI工具价格', 'Claude Code价格', 'Codex价格', 'AI安装服务', '限时优惠'],
  openGraph: {
    title: '服务定价 - AI工具安装限时特惠¥19.9',
    description: 'AI工具安装服务限时特惠，Claude Code、Codex、OpenClaw仅需¥19.9/个',
    url: 'https://ai.cccode.com.cn/pricing',
  },
};

const tools = [
  { name: 'Claude Code', icon: '🤖', originalPrice: '49' },
  { name: 'Codex', icon: '💻', originalPrice: '49' },
  { name: 'OpenClaw（龙虾）', icon: '🦞', originalPrice: '49' },
];

const additionalServices = [
  { name: '远程调试', price: '29/次', description: '解决AI工具运行异常问题' },
  { name: '环境迁移', price: '39/次', description: '将AI工具配置迁移到新设备' },
  { name: '使用培训', price: '99/小时', description: '一对一AI工具使用培训' },
  { name: '企业定制', price: '面议', description: '企业批量部署和定制服务' },
];

export default function PricingPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">服务定价</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            限时活动，超值优惠，错过再等一年！
          </p>
        </div>

        {/* 活动横幅 */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 mb-12 text-white text-center">
          <div className="text-2xl font-bold mb-2">🎉 限时特惠活动</div>
          <div className="text-4xl font-bold mb-4">所有工具安装仅需 ¥19.9</div>
          <div className="text-lg opacity-90">活动截止：2024年6月30日</div>
          <div className="mt-4 text-sm opacity-80">原价 ¥49/个，现在统统 ¥19.9！</div>
        </div>

        {/* 定价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm rounded-bl-lg">
                限时特价
              </div>
              <div className="p-8">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6">单次安装服务</p>

                <div className="mb-6">
                  <span className="text-gray-400 line-through text-lg">¥{tool.originalPrice}</span>
                  <span className="text-red-500 font-bold text-5xl ml-3">¥19.9</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    '专业安装配置',
                    '安装后测试验收',
                    '基础使用指导',
                    '3天技术支持',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="block text-center py-3 rounded-lg font-medium transition-colors bg-red-500 text-white hover:bg-red-600"
                >
                  立即抢购
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 全部工具套餐 */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              全部工具套餐
            </h2>
            <p className="text-gray-600 mb-6">
              一次购买，享受所有AI工具安装服务
            </p>
            <div className="mb-6">
              <span className="text-gray-400 line-through text-xl">¥147</span>
              <span className="text-blue-600 font-bold text-5xl ml-3">¥49.9</span>
            </div>
            <p className="text-sm text-gray-500 mb-8">包含 Claude Code + Codex + OpenClaw 全部安装</p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              立即抢购套餐
            </Link>
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            附加服务
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service) => (
              <div
                key={service.name}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">¥{service.price}</p>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            常见问题
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: '活动什么时候截止？',
                a: '本次活动截止到2024年6月30日，过后恢复原价。',
              },
              {
                q: '安装过程需要多长时间？',
                a: '单个工具安装通常需要5-15分钟，具体时间取决于网络环境和工具复杂度。',
              },
              {
                q: '支持哪些操作系统？',
                a: '支持Windows、macOS和Linux系统，部分工具可能有系统版本要求。',
              },
              {
                q: '安装失败怎么办？',
                a: '我们提供免费重试服务，如果多次安装失败可全额退款。',
              },
              {
                q: '如何支付？',
                a: '通过闲鱼平台下单支付，安装验收后再确认收货，交易有保障。',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-red-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            活动截止6月底，抓紧时间！
          </h2>
          <p className="text-red-100 mb-6">
            所有AI工具安装服务统一定价 ¥19.9，错过再等一年
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-red-500 px-8 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            立即抢购
          </Link>
        </div>
      </div>
    </div>
  );
}
