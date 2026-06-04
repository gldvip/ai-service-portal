'use client';

import { useEffect, useState } from 'react';

const sections = [
  {
    title: '使用指南',
    icon: '📘',
    children: [
      { id: 'claude-code-使用指南', label: 'Claude Code' },
      { id: 'codex-使用指南', label: 'Codex' },
      { id: 'openclaw-龙虾-使用指南', label: 'OpenClaw' },
    ],
  },
  {
    title: '安装教程',
    icon: '⚙️',
    children: [
      { id: 'claude-code-安装教程', label: 'Claude Code' },
      { id: 'codex-安装教程', label: 'Codex' },
      { id: 'openclaw-龙虾-安装教程', label: 'OpenClaw' },
    ],
  },
  {
    title: '推荐工具',
    icon: '⭐',
    children: [
      { id: 'cc-switch-统一管理所有-ai-编程工具', label: 'CC Switch' },
    ],
  },
];

const allIds = sections.flatMap((s) => s.children.map((c) => c.id));

export default function DocSidebar() {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <nav className="sticky top-24">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
          目录导航
        </p>
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="flex items-center gap-2 px-3 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>{section.icon}</span>
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.children.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block pl-8 pr-3 py-1.5 text-sm rounded-lg transition-colors ${
                    activeId === item.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
