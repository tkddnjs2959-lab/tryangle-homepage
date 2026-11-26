import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  alternates: { canonical: 'https://tryangle-official.co.kr/coaching' },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * 코칭 랜딩페이지는 현재 홈페이지 루트에서 운영한다.
 * 추후 /coaching 주소를 다시 활성화할 때 이 라우트를 복구한다.
 */
export default function CoachingPage() {
  notFound();
}
