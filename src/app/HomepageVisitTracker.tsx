'use client';

import { useEffect } from 'react';

/** 메인 페이지 방문을 하루 한 브라우저 1회로 익명 집계한다. */
export default function HomepageVisitTracker() {
  useEffect(() => {
    void fetch('/api/analytics/visit', {
      method: 'POST',
      cache: 'no-store',
      keepalive: true,
    }).catch(() => {
      // 방문 집계 실패가 홈페이지 이용을 방해하지 않게 한다.
    });
  }, []);

  return null;
}
