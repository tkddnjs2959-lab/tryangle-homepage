'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'tryangle_attribution';
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

const SEARCH_SOURCES: Array<[string, string]> = [
  ['google.', 'google'],
  ['search.naver.', 'naver'],
  ['search.daum.', 'daum'],
  ['bing.', 'bing'],
];

function inferGeneralAttribution() {
  if (!document.referrer) {
    return { utm_source: 'direct', utm_medium: 'none', utm_campaign: 'general_direct' };
  }

  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin) return null;

    const searchSource = SEARCH_SOURCES.find(([host]) => referrer.hostname.includes(host));
    if (searchSource) {
      return {
        utm_source: searchSource[1],
        utm_medium: 'organic',
        utm_campaign: 'general_search',
        referrer_host: referrer.hostname,
      };
    }

    return {
      utm_source: referrer.hostname,
      utm_medium: 'referral',
      utm_campaign: 'general_referral',
      referrer_host: referrer.hostname,
    };
  } catch {
    return { utm_source: 'referral', utm_medium: 'referral', utm_campaign: 'general_referral' };
  }
}

export default function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const current = Object.fromEntries(
      KEYS.filter((key) => params.get(key)).map((key) => [key, params.get(key)])
    );

    if (Object.keys(current).length > 0) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...current,
        landing_page: `${window.location.pathname}${window.location.search}`,
      }));
      return;
    }

    if (!window.sessionStorage.getItem(STORAGE_KEY)) {
      const general = inferGeneralAttribution();
      if (general) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...general,
          landing_page: window.location.pathname,
        }));
      }
    }
  }, []);

  return null;
}

export function getAttribution() {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}') as Record<string, string>;
  } catch {
    return {};
  }
}
