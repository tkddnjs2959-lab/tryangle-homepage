'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'tryangle_attribution';
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export default function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const current = Object.fromEntries(
      KEYS.filter((key) => params.get(key)).map((key) => [key, params.get(key)])
    );

    if (Object.keys(current).length > 0) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
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
