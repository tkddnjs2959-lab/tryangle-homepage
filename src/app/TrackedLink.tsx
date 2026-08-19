'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { getAttribution } from './AttributionCapture';

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  clarity?: (...args: unknown[]) => void;
};

/** GTM과 Microsoft Clarity에 같은 행동 이벤트를 함께 보낸다. */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  const win = window as WindowWithDataLayer;
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({
    event: eventName,
    ...getAttribution(),
    ...eventParams,
  });
  if (typeof win.clarity === 'function') {
    win.clarity('event', eventName);
    const placement = eventParams?.placement;
    if (placement) win.clarity('set', 'cta_placement', String(placement));
  }
}

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  eventParams?: Record<string, unknown>;
  children: ReactNode;
};

export default function TrackedLink({
  eventName,
  eventParams,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
