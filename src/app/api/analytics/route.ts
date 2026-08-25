import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { requestFingerprints, requestTrustSignals } from '@/lib/inquiry-security';

export const dynamic = 'force-dynamic';

const EVENT_NAME = /^(landing_view|page_view|clarity_ready|scroll_(25|50|75|90)|view_section_[a-z0-9_]+|click_[a-z0-9_]+|form_(open|close|start|validation_error|submit_attempt|submit_success|submit_failure))$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : null;
}

function safeProperties(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const result: Record<string, string | number | boolean | null> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, 24)) {
    if (!/^[a-z0-9_]{1,60}$/i.test(key)) continue;
    if (typeof item === 'string') result[key] = item.slice(0, 255);
    else if (typeof item === 'number' && Number.isFinite(item)) result[key] = item;
    else if (typeof item === 'boolean' || item === null) result[key] = item;
  }
  return result;
}

async function logAnalyticsSecurity(reason: string, ipFingerprint: string, details: Record<string, string | number | boolean> = {}) {
  const { data: logAllowed } = await db().rpc('consume_inquiry_rate_limit', {
    p_key: `security:event:analytics_${reason}:${ipFingerprint}`,
    p_limit: 10,
    p_window_seconds: 3600,
  });
  if (!logAllowed) return;
  await db().from('inquiry_security_events').insert({
    event_type: 'analytics_request',
    outcome: 'blocked',
    reason: `analytics_${reason}`,
    submission_id: randomUUID(),
    ip_fingerprint: ipFingerprint,
    details,
  });
}

export async function POST(req: Request) {
  const fingerprints = requestFingerprints(req, 'analytics');
  const trust = requestTrustSignals(req);
  const { data: ipAllowed, error: ipLimitError } = await db().rpc('consume_inquiry_rate_limit', {
    p_key: `analytics:ip:1m:${fingerprints.ipFingerprint}`,
    p_limit: 100,
    p_window_seconds: 60,
  });
  if (ipLimitError || !ipAllowed) {
    if (!ipLimitError) await logAnalyticsSecurity('ip_1m', fingerprints.ipFingerprint);
    return NextResponse.json({ message: '요청이 너무 많습니다.' }, {
      status: ipLimitError ? 503 : 429,
      headers: ipLimitError ? undefined : { 'Retry-After': '60' },
    });
  }
  if (trust.contentLength > 32_768) {
    await logAnalyticsSecurity('request_too_large', fingerprints.ipFingerprint, { contentLength: trust.contentLength });
    return NextResponse.json({ message: '요청 내용이 너무 큽니다.' }, { status: 413 });
  }
  if (trust.contentType !== 'application/json') {
    await logAnalyticsSecurity('invalid_content_type', fingerprints.ipFingerprint);
    return NextResponse.json({ message: '지원하지 않는 요청 형식입니다.' }, { status: 415 });
  }
  if (!trust.originAllowed || trust.isCrossSite) {
    await logAnalyticsSecurity(trust.isCrossSite ? 'cross_site_fetch' : 'cross_site_origin', fingerprints.ipFingerprint);
    return NextResponse.json({ message: '허용되지 않은 요청입니다.' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    const bodyText = await req.text();
    if (bodyText.length > 32_768) {
      await logAnalyticsSecurity('request_too_large', fingerprints.ipFingerprint, { bodyLength: bodyText.length });
      return NextResponse.json({ message: '요청 내용이 너무 큽니다.' }, { status: 413 });
    }
    body = JSON.parse(bodyText) as Record<string, unknown>;
  } catch {
    await logAnalyticsSecurity('invalid_json', fingerprints.ipFingerprint);
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const sessionId = text(body.sessionId, 36) ?? '';
  const eventName = text(body.eventName, 80) ?? '';
  if (!UUID.test(sessionId) || !EVENT_NAME.test(eventName)) {
    await logAnalyticsSecurity('invalid_event', fingerprints.ipFingerprint);
    return NextResponse.json({ message: '허용되지 않은 분석 이벤트입니다.' }, { status: 400 });
  }

  const { data: allowed, error: limitError } = await db().rpc('consume_inquiry_rate_limit', {
    p_key: `analytics:session:10m:${fingerprints.ipFingerprint}:${sessionId}`,
    p_limit: 80,
    p_window_seconds: 600,
  });
  if (limitError || !allowed) {
    return NextResponse.json({ message: '요청이 너무 많습니다.' }, { status: limitError ? 503 : 429 });
  }

  const properties = safeProperties(body.properties);
  const pagePath = text(body.pagePath, 500);
  const landingPath = text(body.landingPath, 1000);
  const referrerHost = text(body.referrerHost, 255);
  const device = text(body.deviceType, 20);
  const context = text(body.browserContext, 50);
  const clarityReady = body.clarityReady === true;
  const scrollDepth = eventName.startsWith('scroll_') ? Number(eventName.slice(7)) : 0;
  const now = new Date().toISOString();

  const sessionInsert = {
    id: sessionId,
    landing_path: landingPath,
    last_page_path: pagePath,
    referrer_host: referrerHost,
    utm_source: text(properties.utm_source, 100),
    utm_medium: text(properties.utm_medium, 100),
    utm_campaign: text(properties.utm_campaign, 150),
    utm_content: text(properties.utm_content, 150),
    utm_term: text(properties.utm_term, 150),
    device_type: ['mobile', 'tablet', 'desktop'].includes(device ?? '') ? device : null,
    browser_context: context,
    clarity_ready: clarityReady,
    clarity_ready_at: clarityReady ? now : null,
    max_scroll: scrollDepth,
  };

  const { error: createError } = await db()
    .from('analytics_sessions')
    .upsert(sessionInsert, { onConflict: 'id', ignoreDuplicates: true });
  if (createError) {
    console.error(JSON.stringify({ level: 'error', message: 'analytics_session_create_failed', error: createError.message }));
    return NextResponse.json({ message: '분석 기록에 실패했습니다.' }, { status: 500 });
  }

  const { data: current } = await db()
    .from('analytics_sessions')
    .select('max_scroll')
    .eq('id', sessionId)
    .maybeSingle();

  const sessionUpdate: Record<string, unknown> = {
    last_seen_at: now,
    last_page_path: pagePath,
    last_utm_source: text(properties.utm_source, 100),
    last_utm_medium: text(properties.utm_medium, 100),
    last_utm_campaign: text(properties.utm_campaign, 150),
    last_utm_content: text(properties.utm_content, 150),
    last_utm_term: text(properties.utm_term, 150),
    max_scroll: Math.max(Number(current?.max_scroll ?? 0), scrollDepth),
  };
  if (clarityReady) {
    sessionUpdate.clarity_ready = true;
    sessionUpdate.clarity_ready_at = now;
  }

  const [{ error: updateError }, { error: eventError }] = await Promise.all([
    db().from('analytics_sessions').update(sessionUpdate).eq('id', sessionId),
    db().from('analytics_events').insert({
      session_id: sessionId,
      event_name: eventName,
      page_path: pagePath,
      properties,
    }),
  ]);

  if (updateError || eventError) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'analytics_event_store_failed',
      updateError: updateError?.message,
      eventError: eventError?.message,
    }));
    return NextResponse.json({ message: '분석 기록에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
