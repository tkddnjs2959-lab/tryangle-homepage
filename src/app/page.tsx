import type { Metadata } from 'next';
import CoachingLanding from './coaching/CoachingLanding';

export const metadata: Metadata = {
  title: '주아쌤 매체연기 레슨',
  description: '성인 대상 2:1 및 1:1 매체연기 레슨. 주아쌤의 매체연기 코칭을 안내합니다.',
  alternates: { canonical: 'https://tryangle-official.co.kr/' },
  robots: { index: true, follow: true },
};

export default function Home() {
  return <CoachingLanding />;
}
