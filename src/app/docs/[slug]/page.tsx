import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { docs } from '../data';
import DocGuard from '@/components/DocGuard';
import DocContent from './DocContent';
import DocSidebar from './DocSidebar';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) return {};
  return {
    title: `${doc.title} - AI工具安装服务`,
    description: doc.summary,
  };
}

export default async function DocDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-10">
        {/* 左侧导航 */}
        <DocSidebar />

        {/* 主内容 */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
            <Link href="/docs" className="hover:text-blue-600 transition-colors">
              使用教程
            </Link>
            <span>/</span>
            <span className="text-gray-900">{doc.title}</span>
          </nav>

          {/* DocGuard：密码保护 */}
          <DocGuard title={doc.title} preview={doc.preview}>
            <DocContent content={doc.content} />
          </DocGuard>

          {/* 底部导航 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/docs"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← 返回使用教程
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
