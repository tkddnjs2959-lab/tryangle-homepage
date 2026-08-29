import type { MetadataRoute } from 'next';
import { INSIGHTS } from './insights/content';
import { INSIGHTS_PUBLISHED } from './insights/publishing';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://tryangle-official.co.kr', changeFrequency: 'weekly', priority: 1 },
    ...(INSIGHTS_PUBLISHED ? [
      { url: 'https://tryangle-official.co.kr/insights', changeFrequency: 'weekly' as const, priority: 0.8 },
      ...INSIGHTS.map(({ slug }) => ({ url: `https://tryangle-official.co.kr/insights/${slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ] : []),
  ];
}
