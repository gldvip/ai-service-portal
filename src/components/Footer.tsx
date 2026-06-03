import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-semibold text-gray-900">AI工具安装服务</span>
            </div>
            <p className="text-sm text-gray-500">
              专业AI工具安装与配置服务，让您快速上手各类AI软件
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">服务</h3>
            <ul className="space-y-2">
              <li><Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">AI工具安装</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-blue-600">服务定价</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600">技术支持</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">AI工具</h3>
            <ul className="space-y-2">
              <li><Link href="/tools#claude-code" className="text-sm text-gray-500 hover:text-blue-600">Claude Code</Link></li>
              <li><Link href="/tools#codex" className="text-sm text-gray-500 hover:text-blue-600">Codex</Link></li>
              <li><Link href="/tools#openclaw" className="text-sm text-gray-500 hover:text-blue-600">OpenClaw（龙虾）</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-500">🐟 闲鱼搜索：AI工具安装服务</li>
              <li className="text-sm text-gray-500">⏰ 工作时间：9:00-22:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} AI工具安装服务. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
