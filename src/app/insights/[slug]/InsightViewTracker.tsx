'use client';

import { useEffect } from 'react';
import { trackEvent } from '../../TrackedLink';

export default function InsightViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent('view_insight', { article: slug });
  }, [slug]);

  return null;
}
