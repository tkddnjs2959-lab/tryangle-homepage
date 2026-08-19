'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { track } from '@vercel/analytics';
import { getAttribution } from './AttributionCapture';

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  clarity?: (...args: unknown[]) => void;
};

/** GTM과 Microsoft Clarity에 같은 행동 이벤트를 함께 보낸다. */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  const win = window as WindowWithDataLayer;
  const attribution = getAttribution();
  const payload = { ...attribution, ...eventParams };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({
    event: eventName,
    ...payload,
  });

  const analyticsProperties = Object.fromEntries(
    Object.entries(payload).filter((entry): entry is [string, string | number | boolean | null] => {
      const value = entry[1];
      return value === null || ['string', 'number', 'boolean'].includes(typeof value);
    })
  );
  track(eventName, analyticsProperties);

  if (typeof win.clarity === 'function') {
    const clarityTags: Record<string, unknown> = {
      traffic_source: attribution.utm_source,
      traffic_medium: attribution.utm_medium,
      traffic_campaign: attribution.utm_campaign,
      cta_placement: eventParams?.placement,
      form_name: eventParams?.form,
      funnel_section: eventParams?.section,
      form_issue: eventParams?.reason,
      page_path: eventParams?.page_path,
    };

    Object.entries(clarityTags).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        win.clarity?.('set', key, String(value).slice(0, 255));
      }
    });
    win.clarity('event', eventName);
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
