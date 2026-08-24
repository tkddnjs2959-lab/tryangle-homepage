'use client';

const SESSION_KEY = 'tryangle_analytics_session';

type AnalyticsWindow = Window & {
  __tryangleClarityLoaded?: boolean;
};

function fallbackUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (token) => {
    const random = Math.floor(Math.random() * 16);
    const value = token === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function getAnalyticsSessionId() {
  if (typeof window === 'undefined') return '';

  const current = window.sessionStorage.getItem(SESSION_KEY);
  if (current) return current;

  const sessionId = typeof window.crypto?.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : fallbackUuid();
  window.sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function isClarityReady() {
  return typeof window !== 'undefined'
    && Boolean((window as AnalyticsWindow).__tryangleClarityLoaded);
}

function browserContext() {
  const agent = navigator.userAgent.toLowerCase();
  if (agent.includes('kakaotalk')) return 'kakao_in_app';
  if (agent.includes('instagram')) return 'instagram_in_app';
  if (agent.includes('fbav') || agent.includes('fban')) return 'facebook_in_app';
  if (agent.includes('naver')) return 'naver_in_app';
  return 'standard_browser';
}

function deviceType() {
  const agent = navigator.userAgent.toLowerCase();
  if (/ipad|tablet/.test(agent)) return 'tablet';
  if (/android|iphone|ipod|mobile/.test(agent)) return 'mobile';
  return 'desktop';
}

function referrerHost() {
  if (!document.referrer) return null;
  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === window.location.origin ? null : referrer.hostname;
  } catch {
    return null;
  }
}

export function sendFirstPartyEvent(eventName: string, properties: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  const sessionId = getAnalyticsSessionId();
  if (!sessionId) return;

  const body = JSON.stringify({
    sessionId,
    eventName,
    pagePath: window.location.pathname,
    landingPath: `${window.location.pathname}${window.location.search}`,
    referrerHost: referrerHost(),
    deviceType: deviceType(),
    browserContext: browserContext(),
    clarityReady: isClarityReady(),
    properties,
  });

  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // 분석 기록 실패가 사용자 행동이나 상담 신청을 막아서는 안 된다.
  });
}
