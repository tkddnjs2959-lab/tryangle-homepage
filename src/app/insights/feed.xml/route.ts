import { INSIGHTS } from '../content';

export const dynamic = 'force-static';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function GET() {
  const items = INSIGHTS.map((item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>https://tryangle-official.co.kr/insights/${item.slug}</link>
      <guid isPermaLink="true">https://tryangle-official.co.kr/insights/${item.slug}</guid>
      <description>${escapeXml(item.description)}</description>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>TRYANGLE Insights</title>
  <link>https://tryangle-official.co.kr/insights</link>
  <description>배우 이미지와 캐릭터 브랜딩 인사이트</description>${items}
</channel></rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
