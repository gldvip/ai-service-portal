'use client';

import { useEffect, useRef } from 'react';

/**
 * 将 Markdown 文本渲染为 HTML，带精细排版样式、代码复制、一键安装卡片。
 */
export default function DocContent({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 为所有复制按钮绑定事件（委托）
    const handler = async (e: Event) => {
      const btn = (e.target as HTMLElement).closest('.copy-btn') as HTMLButtonElement | null;
      if (!btn) return;
      const code = btn.getAttribute('data-code') || '';
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const orig = btn.textContent;
      btn.textContent = '已复制 ✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('copied');
      }, 2000);
    };

    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [content]);

  const html = markdownToHtml(content);
  return (
    <div
      ref={ref}
      className="doc-content text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function markdownToHtml(md: string): string {
  let html = md;

  const seenIds = new Set<string>();
  function uniqueId(raw: string): string {
    if (!seenIds.has(raw)) {
      seenIds.add(raw);
      return raw;
    }
    let n = 2;
    while (seenIds.has(`${raw}-${n}`)) n++;
    const id = `${raw}-${n}`;
    seenIds.add(id);
    return id;
  }


  // ── 一键安装卡片（:::quick-install ... :::）──────────────────
  html = html.replace(
    /:::quick-install\n([\s\S]*?):::/g,
    (_m, body) => {
      const lines = body.trim().split('\n').filter((l: string) => l.trim());
      let title = '';
      const items: Array<{ os: string; cmd: string }> = [];

      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('title:')) {
          title = t.replace(/^title:\s*/, '');
        } else if (t.startsWith('- ')) {
          // 格式: - macOS/Linux: `command`
          const match = t.match(/^- (.+?):\s*`(.+?)`$/);
          if (match) {
            items.push({ os: match[1], cmd: match[2] });
          }
        }
      }

      const rows = items
        .map(
          (item) => `
        <div class="qi-row">
          <span class="qi-os">${item.os}</span>
          <code class="qi-cmd">${escapeHtml(item.cmd)}</code>
          <button class="copy-btn qi-copy" data-code="${escapeAttr(item.cmd)}" title="复制命令">
            <svg class="qi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>复制</span>
          </button>
        </div>`
        )
        .join('');

      return `
      <div class="quick-install">
        <div class="qi-header">
          <div class="qi-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          </div>
          <div>
            <div class="qi-title">${title || '一键安装'}</div>
            <div class="qi-subtitle">复制命令到终端执行，自动完成环境检查和安装</div>
          </div>
        </div>
        <div class="qi-body">${rows}</div>
      </div>`;
    }
  );

  // ── 代码块（带复制按钮）─────────────────────────────────────
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_m, lang, code) => {
      const escaped = escapeHtml(code.trim());
      const encoded = escapeAttr(code.trim());
      return `<div class="code-block group relative my-6">
        <div class="code-toolbar absolute top-0 right-0 flex items-center gap-1.5 bg-gray-800 border-b border-l border-gray-700 text-gray-400 text-xs rounded-bl-xl rounded-tr-xl px-1 py-0.5">
          <span class="font-mono select-none px-1.5 py-0.5">${lang || 'text'}</span>
          <button class="copy-btn px-2.5 py-1 rounded-lg hover:bg-gray-700 hover:text-gray-200 transition-all cursor-pointer font-medium" data-code="${encoded}">复制</button>
        </div>
        <pre class="bg-gray-900 text-gray-100 rounded-xl p-5 pt-9 overflow-x-auto text-sm leading-relaxed border border-gray-800"><code class="font-mono">${escaped}</code></pre>
      </div>`;
    }
  );

  // ── 行内代码 ──────────────────────────────────────────────
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono border border-gray-200">$1</code>'
  );

  // ── 标题 ──────────────────────────────────────────────────
  html = html.replace(
    /^## (.+)$/gm,
    (_m, title) => {
      const raw = title.replace(/<[^>]*>/g, '').replace(/[^\w一-鿿]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
      const id = uniqueId(raw);
      return `<h2 id="${id}" class="text-xl font-bold text-gray-900 mt-12 mb-4 pb-3 border-b border-gray-200 flex items-center gap-2 scroll-mt-24"><span class="w-1 h-5 bg-blue-500 rounded-full inline-block"></span>${title}</h2>`;
    }
  );
  html = html.replace(
    /^### (.+)$/gm,
    (_m, title) => {
      const raw = title.replace(/<[^>]*>/g, '').replace(/[^\w一-鿿]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
      const id = uniqueId(raw);
      return `<h3 id="${id}" class="text-lg font-semibold text-gray-900 mt-8 mb-3 flex items-center gap-2 scroll-mt-24"><span class="w-1.5 h-1.5 bg-blue-400 rounded-full inline-block"></span>${title}</h3>`;
    }
  );

  // ── 粗体、斜体 ───────────────────────────────────────────
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="text-gray-700">$1</em>');

  // ── 表格 ─────────────────────────────────────────────────
  html = html.replace(/(\|.+\|\n)+/g, (tableBlock) => {
    const rows = tableBlock.trim().split('\n');
    if (rows.length < 2) return tableBlock;

    const headerCells = rows[0]
      .split('|')
      .filter(Boolean)
      .map((c) => `<th class="px-5 py-3 text-left bg-gray-50 font-semibold text-gray-700 text-sm">${c.trim()}</th>`)
      .join('');

    const bodyRows = rows.slice(2).map((row) => {
      const cells = row
        .split('|')
        .filter(Boolean)
        .map((c) => `<td class="px-5 py-3 border-t border-gray-100 text-sm">${c.trim()}</td>`)
        .join('');
      return `<tr class="hover:bg-gray-50/50 transition-colors">${cells}</tr>`;
    });

    return `<div class="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm"><table class="w-full text-sm"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows.join('')}</tbody></table></div>`;
  });

  // ── 引用块 ────────────────────────────────────────────────
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="border-l-4 border-blue-400 bg-blue-50/70 text-sm text-gray-700 pl-5 py-3 my-5 rounded-r-xl">$1</blockquote>'
  );

  // ── 无序列表 ──────────────────────────────────────────────
  html = html.replace(/^- (.+)$/gm, '<li class="ml-5 list-none mb-2 pl-1 relative before:content-[\'▸\'] before:absolute before:-left-3 before:text-blue-400 before:text-xs">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul class="my-4 space-y-0.5">${match}</ul>`);

  // ── 有序列表 ──────────────────────────────────────────────
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal mb-2 marker:text-blue-500 marker:font-semibold">$1</li>');

  // ── 水平线 ────────────────────────────────────────────────
  html = html.replace(/^---$/gm, '<hr class="my-10 border-gray-200" />');

  // ── 链接 ──────────────────────────────────────────────────
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-200 underline-offset-2 hover:decoration-blue-400 transition-colors" target="_blank" rel="noopener">$1</a>'
  );

  // ── 段落 ──────────────────────────────────────────────────
  html = html.replace(/\n\n/g, '</p><p class="mb-4 leading-7">');
  html = html.replace(/\n/g, '<br/>');
  html = `<p class="mb-4 leading-7">${html}</p>`;
  html = html.replace(/<p class="mb-4 leading-7"><\/p>/g, '');
  html = html.replace(/<p class="mb-4 leading-7"><br\/><\/p>/g, '');

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
