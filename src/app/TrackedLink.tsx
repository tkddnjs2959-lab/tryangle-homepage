'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { track } from '@vercel/analytics';
import { getAnalyticsSessionId, isAnalyticsDisabled, isClarityReady, sendFirstPartyEvent } from '@/lib/analytics-session';
import { getAttribution } from './AttributionCapture';

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  clarity?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

function applyLeadIdentity(leadRef: string, formName: string) {
  const win = window as WindowWithDataLayer;
  if (typeof win.clarity !== 'function') return false;

  const sessionId = getAnalyticsSessionId();
  win.clarity('upgrade', 'consultation_lead');
  win.clarity('identify', leadRef, sessionId || undefined, window.location.pathname, `상담 ${leadRef.slice(-6)}`);
  win.clarity('set', 'lead_ref', leadRef);
  if (sessionId) win.clarity('set', 'session_ref', sessionId);
  win.clarity('set', 'form_name', formName);
  return isClarityReady();
}

export function identifyLeadInClarity(leadRef: string, formName: string) {
  return applyLeadIdentity(leadRef, formName);
}

export async function retryIdentifyLeadInClarity(
  leadRef: string,
  formName: string,
  emitSuccessEvent: boolean
) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (applyLeadIdentity(leadRef, formName)) {
      if (emitSuccessEvent) {
        (window as WindowWithDataLayer).clarity?.('event', 'form_submit_success');
      }
      return true;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 500));
  }
  return false;
}

/** GTM과 Microsoft Clarity에 같은 행동 이벤트를 함께 보낸다. */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (isAnalyticsDisabled()) return false;

  const win = window as WindowWithDataLayer;
  const attribution = getAttribution();
  const payload = { ...attribution, ...eventParams };
  sendFirstPartyEvent(eventName, payload);
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

  if (eventName === 'form_submit_success' && typeof win.fbq === 'function') {
    win.fbq('track', 'Lead', { content_name: 'consultation_form' });
  }

  if (typeof win.clarity === 'function') {
    const clarityTags: Record<string, unknown> = {
      traffic_source: attribution.utm_source,
      traffic_medium: attribution.utm_medium,
      traffic_campaign: attribution.utm_campaign,
      cta_placement: eventParams?.placement,
      form_name: eventParams?.form,
      funnel_section: eventParams?.section,
      form_issue: eventParams?.reason,
      schedule_step: eventParams?.selection_type,
      page_path: eventParams?.page_path,
      lead_ref: eventParams?.lead_ref,
    };

    Object.entries(clarityTags).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        win.clarity?.('set', key, String(value).slice(0, 255));
      }
    });
    win.clarity('event', eventName);
    return true;
  }

  return false;
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
        if (eventName === 'click_kakao_consult') {
          trackEvent('kakao_click', eventParams);
        }
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
