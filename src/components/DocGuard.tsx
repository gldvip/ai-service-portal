'use client';

import { useState, useEffect, type ReactNode } from 'react';

const DOC_PASSWORD = '1201';
const STORAGE_KEY = 'doc_unlocked';

export default function DocGuard({ title, preview, children }: DocGuardProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      setUnlocked(true);
    }
    setMounted(true);
  }, []);

  // 解锁后 / hash 变化时滚动到锚点，带重试（等 DOM 渲染完成）
  // 延迟首次 scroll 确保在 Next.js 路由 scroll-to-top 之后执行
  useEffect(() => {
    if (!unlocked) return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const targetId = decodeURIComponent(hash.slice(1));
      let retries = 0;
      const maxRetries = 30;

      const tryScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(tryScroll, 100);
        }
      };

      // 延迟 150ms 让 Next.js router scroll 先完成，再执行锚点定位
      setTimeout(tryScroll, 150);
    };

    // 首次挂载时执行
    scrollToHash();

    // 监听 hashchange 以响应同页内的锚点跳转
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [unlocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DOC_PASSWORD) {
      setUnlocked(true);
      setError(false);
      localStorage.setItem(STORAGE_KEY, '1');
    } else {
      setError(true);
    }
  };

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
        {title}
      </h1>

      <div className="text-base text-gray-600 leading-relaxed mb-8 whitespace-pre-line border-l-4 border-blue-200 pl-5 py-1">
        {preview}
      </div>

      {!mounted ? (
        <div className="mt-2">
          <div className="blur-sm select-none opacity-30 pointer-events-none text-gray-400 text-sm leading-loose space-y-2 mb-6">
            <div className="h-3 bg-gray-200 rounded w-11/12" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
            <div className="h-3 bg-gray-200 rounded w-9/12" />
            <div className="h-3 bg-gray-200 rounded w-10/12" />
          </div>
        </div>
      ) : unlocked ? (
        <div className="animate-fade-in">{children}</div>
      ) : (
        <div className="relative mt-2">
          <div
            className="blur-sm select-none opacity-30 pointer-events-none text-gray-400 text-sm leading-loose space-y-2 mb-6"
            aria-hidden="true"
          >
            <div className="h-3 bg-gray-200 rounded w-11/12" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
            <div className="h-3 bg-gray-200 rounded w-9/12" />
            <div className="h-3 bg-gray-200 rounded w-10/12" />
            <div className="h-3 bg-gray-200 rounded w-3/5" />
            <div className="h-3 bg-gray-200 rounded w-8/12" />
            <div className="h-3 bg-gray-200 rounded w-11/12" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>

          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 mt-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-lg shadow-gray-100/50 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold mb-1">此文档受密码保护</p>
            <p className="text-sm text-gray-500 mb-6">请输入查阅密码解锁完整内容</p>
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="请输入查阅密码"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
              >
                解锁
              </button>
            </form>
            {error && (
              <p className="text-red-500 text-sm mt-3 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                密码错误，请重试或联系客服获取密码
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

interface DocGuardProps {
  title: string;
  preview: string;
  children: ReactNode;
}
