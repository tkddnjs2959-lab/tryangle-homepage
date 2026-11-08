'use client';

import { useEffect } from 'react';

export default function InsightViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ event: 'view_insight', article: slug });
  }, [slug]);

  return null;
}
