import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import AttributionCapture from './AttributionCapture';
import ConsultationCta from './ConsultationCta';
import FunnelAnalytics from './FunnelAnalytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://tryangle-official.co.kr'),
  alternates: { canonical: '/' },
  other: { 'link:alternate': 'https://tryangle-official.co.kr/insights/feed.xml' },
  openGraph: {
    type: 'website',
    url: 'https://tryangle-official.co.kr',
    siteName: 'TRYANGLE',
    images: [{ url: '/logo.jpg', width: 512, height: 512 }],
  },
  title: 'TRY앵글 — 배우 퍼스널 브랜딩',
  description: '배우를 위한 퍼스널 브랜딩 · 캐릭터 분석',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#BFDFF2', // TRY앵글 연한 스카이블루
};

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {gtmId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        ) : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <AttributionCapture />
        <FunnelAnalytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'TRYANGLE',
          url: 'https://tryangle-official.co.kr',
          image: 'https://tryangle-official.co.kr/logo.jpg',
          areaServed: 'KR',
        }) }} />
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        {children}
        <ConsultationCta />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
