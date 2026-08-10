import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/coaching', '/api/'] },
    sitemap: 'https://tryangle-official.co.kr/sitemap.xml',
  };
}
