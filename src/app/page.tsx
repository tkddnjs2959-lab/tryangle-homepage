import type { Metadata } from 'next';
import CoachingLanding from './coaching/CoachingLanding';

export const metadata: Metadata = {
  title: '주아쌤 매체연기 레슨',
  description: '성인 대상 2:1 및 1:1 매체연기 레슨. 주아쌤의 매체연기 코칭을 안내합니다.',
  alternates: { canonical: 'https://tryangle-official.co.kr/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://tryangle-official.co.kr/',
    siteName: 'JAU T',
    title: '주아쌤 매체연기 레슨',
    description: '성인 대상 2:1 및 1:1 매체연기 레슨. 주아쌤의 매체연기 코칭을 안내합니다.',
    images: [{ url: '/jua-t-logo.png', width: 1240, height: 1240, alt: 'JAU T 주아쌤 로고' }],
  },
};

export default function Home() {
  return <CoachingLanding />;
}
