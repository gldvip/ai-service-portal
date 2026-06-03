'use client';

import { useState } from 'react';

const contactMethods = [
  {
    icon: '🐟',
    title: '闲鱼咨询',
    value: '搜索店铺：AI工具安装服务',
    description: '闲鱼搜索店铺名，直接咨询下单',
  },
  {
    icon: '💬',
    title: '闲鱼私信',
    value: '私信联系客服',
    description: '在闲鱼APP内私信沟通需求',
  },
  {
    icon: '⏰',
    title: '工作时间',
    value: '9:00 - 22:00',
    description: '全年无休，随时响应',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    tools: [] as string[],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toolOptions = [
    'Claude Code',
    'Codex',
    'OpenClaw（龙虾）',
    '全部工具套餐',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert('提交失败，请稍后重试或直接联系闲鱼客服');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请稍后重试或直接联系闲鱼客服');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToolToggle = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            如需AI工具安装服务，请通过以下方式联系我们，我们将尽快为您安排
          </p>
          {/* 活动横幅 */}
          <div className="mt-6 bg-red-500 text-white px-8 py-4 rounded-xl inline-block">
            <span className="font-bold text-xl">🎉 限时特惠</span>
            <span className="mx-3">|</span>
            <span className="text-lg">所有工具安装仅需 <span className="font-bold text-2xl">¥19.9</span></span>
            <span className="mx-3">|</span>
            <span className="text-lg">截止6月底</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="space-y-6 mb-8">
              {contactMethods.map((method) => (
                <div
                  key={method.title}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100"
                >
                  <div className="text-3xl">{method.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{method.title}</h3>
                    <p className="text-blue-600 font-medium">{method.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">服务流程</h3>
              <ol className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    1
                  </span>
                  闲鱼搜索店铺咨询下单
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    2
                  </span>
                  确认需求和报价
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    3
                  </span>
                  远程协助安装配置
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    4
                  </span>
                  验收后闲鱼确认收货
                </li>
              </ol>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  咨询已提交！
                </h2>
                <p className="text-gray-600 mb-4">
                  我们已收到您的咨询，稍后会通过邮件通知您
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  也请前往闲鱼搜索「AI工具安装服务」下单
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', contact: '', tools: [], message: '' });
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  继续提交其他咨询
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  预约咨询服务
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  提交后将通过邮件通知站长，请放心填写
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      您的称呼
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的称呼"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系方式（微信/手机/邮箱）
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contact: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的联系方式"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      需要安装的AI工具（可多选）
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {toolOptions.map((tool) => (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => handleToolToggle(tool)}
                          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            formData.tools.includes(tool)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      其他说明
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请描述您的具体需求或问题"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '提交中...' : '提交咨询'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
