'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { isAnalyticsDisabled } from '@/lib/analytics-session';

export default function AnalyticsProviders() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!isAnalyticsDisabled());
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
