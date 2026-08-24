'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getAnalyticsSessionId, isClarityReady } from '@/lib/analytics-session';
import { trackEvent } from './TrackedLink';

const LANDING_SENT_KEY = 'tryangle_landing_sent';

type ClarityWindow = Window & {
  clarity?: (...args: unknown[]) => void;
};

function identifySession(pathname: string) {
  const sessionId = getAnalyticsSessionId();
  const clarity = (window as ClarityWindow).clarity;
  if (!sessionId || typeof clarity !== 'function') return;

  clarity('identify', `session_${sessionId}`, sessionId, pathname);
  clarity('set', 'session_ref', sessionId);
  clarity('set', 'page_path', pathname);
}

export default function AnalyticsBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    getAnalyticsSessionId();
    identifySession(pathname);

    if (!window.sessionStorage.getItem(LANDING_SENT_KEY)) {
      window.sessionStorage.setItem(LANDING_SENT_KEY, '1');
      trackEvent('landing_view', { page_path: pathname });
    }
    trackEvent('page_view', { page_path: pathname });

    const onClarityLoaded = () => {
      identifySession(pathname);
      trackEvent('clarity_ready', { page_path: pathname });
    };

    if (isClarityReady()) onClarityLoaded();
    window.addEventListener('tryangle-clarity-loaded', onClarityLoaded);
    return () => window.removeEventListener('tryangle-clarity-loaded', onClarityLoaded);
  }, [pathname]);

  return null;
}

