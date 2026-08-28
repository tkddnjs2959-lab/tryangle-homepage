import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import AttributionCapture from './AttributionCapture';
import ConsultationCta from './ConsultationCta';
import FunnelAnalytics from './FunnelAnalytics';
import AnalyticsBootstrap from './AnalyticsBootstrap';
import ContentProtection from './ContentProtection';
import AnalyticsProviders from './AnalyticsProviders';

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
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1408099347850769';
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'xzpk8gu4t8';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Script id="analytics-privacy" strategy="beforeInteractive">
          {`
            (function(w){
              var key='tryangle_analytics_disabled';
              var host=w.location.hostname.toLowerCase();
              var local=host==='localhost'||host==='127.0.0.1'||host==='::1';
              try {
                var params=new URLSearchParams(w.location.search);
                var mode=params.get('analytics');
                if(mode==='off')w.localStorage.setItem(key,'1');
                if(mode==='on')w.localStorage.removeItem(key);
                w.__tryangleAnalyticsDisabled=local||w.localStorage.getItem(key)==='1';
                if(mode==='off'||mode==='on'){
                  params.delete('analytics');
                  var query=params.toString();
                  w.history.replaceState({},'',w.location.pathname+(query?'?'+query:'')+w.location.hash);
                }
              } catch(e) {
                w.__tryangleAnalyticsDisabled=local;
              }
            })(window);
          `}
        </Script>
        <Script id="microsoft-clarity-fallback" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i){
              if(c.__tryangleAnalyticsDisabled)return;
              function ready(){
                c.__tryangleClarityLoaded=true;
                c.dispatchEvent(new Event('tryangle-clarity-loaded'));
              }
              function ensureClarity(){
                if(c.__tryangleClarityBootstrapped)return;
                c.__tryangleClarityBootstrapped=true;

                // GTM의 Clarity가 먼저 준비됐다면 기존 설치를 그대로 사용합니다.
                if(typeof c[a]==='function'){
                  ready();
                  return;
                }

                // 카카오 인앱 등 GTM이 차단된 환경에서만 직접 설치로 대체합니다.
                c[a]=function(){(c[a].q=c[a].q||[]).push(arguments)};
                var t=l.createElement(r),y=l.getElementsByTagName(r)[0];
                t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                t.onload=ready;
                y.parentNode.insertBefore(t,y);
              }
              c.setTimeout(ensureClarity,2500);
            })(window,document,"clarity","script","${clarityProjectId}");
          `}
        </Script>
        {gtmId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(){
                if(window.__tryangleAnalyticsDisabled)return;
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              })();
            `}
          </Script>
        ) : null}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            (function(){
              if(window.__tryangleAnalyticsDisabled)return;
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            })();
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <ContentProtection />
        <AttributionCapture />
        <AnalyticsBootstrap />
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
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
        <ConsultationCta />
        <AnalyticsProviders />
      </body>
    </html>
  );
}
