import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { notifySms } from '@/lib/sms';
import { createLeadReference } from '@/lib/lead-reference';
import {
  normalizedPhone,
  requestAddress,
  requestFingerprints,
  requestTrustSignals,
  secureFingerprint,
} from '@/lib/inquiry-security';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ERRORS: Record<string, { status: number; message: string }> = {
  NAME_REQUIRED: { status: 400, message: '이름을 입력해주세요.' },
  CONTACT_REQUIRED: { status: 400, message: '연락처를 입력해주세요.' },
  TOO_LONG: { status: 400, message: '입력 내용이 너무 깁니다.' },
};
type Fingerprints = ReturnType<typeof requestFingerprints>;

async function logSecurity(eventType: string, outcome: 'blocked' | 'duplicate' | 'warning', reason: string, submissionId: string, f: Fingerprints, details: Record<string, string | number | boolean> = {}) {
  const { data: logAllowed, error: logLimitError } = await db().rpc('consume_inquiry_rate_limit', {
    p_key: `security:event:${reason}:${f.ipFingerprint}`,
    p_limit: 10,
    p_window_seconds: 3600,
  });
  if (logLimitError || !logAllowed) {
    if (logLimitError) console.error(JSON.stringify({ level: 'error', message: 'security_event_limit_failed', error: logLimitError.message }));
    return;
  }
  const { error } = await db().from('inquiry_security_events').insert({
    event_type: eventType, outcome, reason, submission_id: submissionId,
    ip_fingerprint: f.ipFingerprint, contact_fingerprint: f.contactFingerprint,
    browser_fingerprint: f.browserFingerprint, details,
  });
  if (error) console.error(JSON.stringify({ level: 'error', message: 'security_event_store_failed', error: error.message }));
}

async function removeClaim(submissionId: string) {
  await db().from('inquiry_submission_claims').delete().eq('submission_id', submissionId);
}

export async function POST(req: Request) {
  const startedAt = Date.now();
  const requestId = req.headers.get('x-vercel-id') ?? 'local';
  const preliminarySubmissionId = randomUUID();
  const preliminaryFingerprints = requestFingerprints(req, 'missing');
  const trust = requestTrustSignals(req);

  const requestLimits = [
    { reason: 'request_ip_1m', key: `inquiry:request:ip:1m:${preliminaryFingerprints.ipFingerprint}`, limit: 20, seconds: 60 },
    { reason: 'request_ip_hour', key: `inquiry:request:ip:hour:${preliminaryFingerprints.ipFingerprint}`, limit: 80, seconds: 3600 },
  ];
  const requestLimitResults = await Promise.all(requestLimits.map((item) => db().rpc('consume_inquiry_rate_limit', {
    p_key: item.key,
    p_limit: item.limit,
    p_window_seconds: item.seconds,
  })));
  const requestLimitFailure = requestLimitResults.find((result) => result.error);
  if (requestLimitFailure?.error) {
    console.error(JSON.stringify({ level: 'error', message: 'inquiry_request_limit_failed', error: requestLimitFailure.error.message }));
    return NextResponse.json({ message: '잠시 후 다시 시도해주세요.' }, { status: 503 });
  }
  const requestBlockedAt = requestLimitResults.findIndex((result) => !result.data);
  if (requestBlockedAt >= 0) {
    const reason = requestLimits[requestBlockedAt].reason;
    await logSecurity('inquiry_request', 'blocked', reason, preliminarySubmissionId, preliminaryFingerprints);
    return NextResponse.json(
      { message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429, headers: { 'Retry-After': requestLimits[requestBlockedAt].seconds.toString() } },
    );
  }

  if (trust.contentLength > 24_576) {
    await logSecurity('inquiry_request', 'blocked', 'request_too_large', preliminarySubmissionId, preliminaryFingerprints, { contentLength: trust.contentLength });
    return NextResponse.json({ message: '요청 내용이 너무 큽니다.' }, { status: 413 });
  }
  if (trust.contentType !== 'application/json') {
    await logSecurity('inquiry_request', 'blocked', 'invalid_content_type', preliminarySubmissionId, preliminaryFingerprints);
    return NextResponse.json({ message: '지원하지 않는 요청 형식입니다.' }, { status: 415 });
  }
  if (!trust.originAllowed || trust.isCrossSite) {
    await logSecurity('inquiry_request', 'blocked', trust.isCrossSite ? 'cross_site_fetch' : 'cross_site_origin', preliminarySubmissionId, preliminaryFingerprints);
    return NextResponse.json({ message: '허용되지 않은 요청입니다.' }, { status: 403 });
  }

  let body: unknown;
  try {
    const bodyText = await req.text();
    if (bodyText.length > 24_576) {
      await logSecurity('inquiry_request', 'blocked', 'request_too_large', preliminarySubmissionId, preliminaryFingerprints, { bodyLength: bodyText.length });
      return NextResponse.json({ message: '요청 내용이 너무 큽니다.' }, { status: 413 });
    }
    body = JSON.parse(bodyText);
  } catch {
    await logSecurity('inquiry_request', 'blocked', 'invalid_json', preliminarySubmissionId, preliminaryFingerprints);
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const raw = body as { name?: unknown; contact?: unknown; message?: unknown; website?: unknown; attribution?: unknown; turnstileToken?: unknown; submissionId?: unknown; sessionId?: unknown; clarityReady?: unknown; securityContext?: unknown };
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const contact = typeof raw.contact === 'string' ? raw.contact.trim() : '';
  const message = typeof raw.message === 'string' ? raw.message.trim() : '';
  const phone = normalizedPhone(contact);
  const submissionId = typeof raw.submissionId === 'string' && UUID.test(raw.submissionId) ? raw.submissionId : randomUUID();
  const f = requestFingerprints(req, phone || 'missing');

  const retentionCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await Promise.all([
    db().from('inquiry_security_events').delete().lt('occurred_at', retentionCutoff),
    db().from('inquiry_submission_claims').delete().lt('created_at', retentionCutoff),
  ]);

  if (typeof raw.website === 'string' && raw.website.trim()) {
    await logSecurity('form_submission', 'blocked', 'honeypot', submissionId, f);
    return NextResponse.json({ ok: true });
  }
  if (!name || !contact) {
    await logSecurity('form_submission', 'blocked', 'invalid_required_fields', submissionId, f);
    return NextResponse.json({ message: '이름과 연락처를 입력해주세요.' }, { status: 400 });
  }
  if (phone.length < 10 || phone.length > 11) {
    await logSecurity('form_submission', 'blocked', 'invalid_phone', submissionId, f);
    return NextResponse.json({ message: '연락처를 정확히 입력해주세요.' }, { status: 400 });
  }
  if (name.length > 40 || contact.length > 30 || message.length > 5000) {
    await logSecurity('form_submission', 'blocked', 'invalid_field_length', submissionId, f);
    return NextResponse.json({ message: '입력 내용이 너무 깁니다.' }, { status: 400 });
  }

  const attribution = raw.attribution && typeof raw.attribution === 'object' && !Array.isArray(raw.attribution) ? raw.attribution as Record<string, unknown> : {};
  const source = typeof attribution.utm_source === 'string' ? attribution.utm_source : 'unknown';
  const medium = typeof attribution.utm_medium === 'string' ? attribution.utm_medium : 'unknown';
  const campaign = typeof attribution.utm_campaign === 'string' ? attribution.utm_campaign : 'unknown';
  const content = typeof attribution.utm_content === 'string' ? attribution.utm_content : 'unknown';
  const sessionId = typeof raw.sessionId === 'string' && UUID.test(raw.sessionId) ? raw.sessionId : null;
  const clarityReady = raw.clarityReady === true;
  const securityContext = raw.securityContext && typeof raw.securityContext === 'object' && !Array.isArray(raw.securityContext)
    ? raw.securityContext as Record<string, unknown>
    : {};
  const formElapsedMs = typeof securityContext.formElapsedMs === 'number' && Number.isFinite(securityContext.formElapsedMs)
    ? Math.max(0, Math.min(Math.round(securityContext.formElapsedMs), 3_600_000))
    : 0;
  const pageElapsedMs = typeof securityContext.pageElapsedMs === 'number' && Number.isFinite(securityContext.pageElapsedMs)
    ? Math.max(0, Math.min(Math.round(securityContext.pageElapsedMs), 86_400_000))
    : 0;
  const interactionCount = typeof securityContext.interactionCount === 'number' && Number.isFinite(securityContext.interactionCount)
    ? Math.max(0, Math.min(Math.round(securityContext.interactionCount), 100))
    : 0;
  const behaviorSignals: string[] = [];
  let riskScore = 0;
  if (!raw.securityContext || typeof raw.securityContext !== 'object') { behaviorSignals.push('missing_behavior_context'); riskScore += 3; }
  if (formElapsedMs > 0 && formElapsedMs < 1_200) { behaviorSignals.push('rapid_form_completion'); riskScore += 2; }
  if (interactionCount < 3) { behaviorSignals.push('low_interaction'); riskScore += 2; }
  if (!sessionId) { behaviorSignals.push('missing_session'); riskScore += 2; }
  if (!clarityReady) { behaviorSignals.push('tracking_unavailable'); riskScore += 1; }
  if (!trust.userAgent) { behaviorSignals.push('missing_user_agent'); riskScore += 2; }
  if (!trust.secFetchSite) { behaviorSignals.push('missing_fetch_metadata'); riskScore += 1; }
  if (riskScore >= 4) {
    await logSecurity('form_behavior', 'warning', 'behavior_risk', submissionId, f, {
      riskScore,
      signals: behaviorSignals.join(',').slice(0, 240),
      formElapsedMs,
      pageElapsedMs,
      interactionCount,
    });
  }

  const { error: claimError } = await db().from('inquiry_submission_claims').insert({
    submission_id: submissionId, contact_fingerprint: f.contactFingerprint,
    ip_fingerprint: f.ipFingerprint, browser_fingerprint: f.browserFingerprint,
  });
  if (claimError) {
    if (claimError.code !== '23505') return NextResponse.json({ message: '잠시 후 다시 시도해주세요.' }, { status: 503 });
    const { data: claim } = await db().from('inquiry_submission_claims').select('status, inquiry_id').eq('submission_id', submissionId).maybeSingle();
    if (claim?.status === 'completed' && typeof claim.inquiry_id === 'string') return NextResponse.json({ ok: true, duplicate: true, leadRef: createLeadReference(claim.inquiry_id) });
    if (claim?.status === 'blocked') return NextResponse.json({ message: '신청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
    return NextResponse.json({ message: '신청을 처리하고 있습니다. 잠시 후 다시 확인해주세요.' }, { status: 409 });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (Boolean(turnstileSecret) !== Boolean(turnstileSiteKey)) {
    console.warn(JSON.stringify({ level: 'warn', message: 'turnstile_configuration_incomplete' }));
  }
  if (turnstileSecret && turnstileSiteKey) {
    const token = typeof raw.turnstileToken === 'string' ? raw.turnstileToken : '';
    try {
      const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: turnstileSecret, response: token, remoteip: requestAddress(req), idempotency_key: submissionId }),
        signal: AbortSignal.timeout(8_000),
      });
      const result = await verification.json() as { success?: boolean; action?: string; hostname?: string; 'error-codes'?: string[] };
      const hostnames = (process.env.TURNSTILE_ALLOWED_HOSTNAMES || 'tryangle-official.co.kr').split(',').map((value) => value.trim()).filter(Boolean);
      if (!result.success || result.action !== 'inquiry' || !result.hostname || !hostnames.includes(result.hostname)) {
        await removeClaim(submissionId);
        await logSecurity('form_submission', 'blocked', 'turnstile_failed', submissionId, f, { errors: (result['error-codes'] || []).join(',').slice(0, 200) });
        return NextResponse.json({ message: '자동 신청 방지 확인이 필요합니다. 잠시 후 다시 시도해주세요.' }, { status: 403 });
      }
    } catch (error) {
      await removeClaim(submissionId);
      console.error(JSON.stringify({ level: 'error', message: 'turnstile_verification_failed', error: error instanceof Error ? error.message : 'unknown' }));
      return NextResponse.json({ message: '자동 신청 방지 확인이 지연되고 있습니다. 잠시 후 다시 시도해주세요.' }, { status: 503 });
    }
  }

  const { data: recent } = await db().from('inquiries').select('id')
    .eq('contact_fingerprint', f.contactFingerprint)
    .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (recent?.id) {
    await db().from('inquiry_submission_claims').update({ status: 'completed', inquiry_id: recent.id, reason: 'duplicate_contact_30m', updated_at: new Date().toISOString() }).eq('submission_id', submissionId);
    await logSecurity('form_submission', 'duplicate', 'duplicate_contact_30m', submissionId, f);
    return NextResponse.json({ ok: true, duplicate: true, leadRef: createLeadReference(recent.id) });
  }

  const limits = [
    { reason: 'ip_10m', key: `inquiry:ip:10m:${f.ipFingerprint}`, limit: 5, seconds: 600 },
    { reason: 'ip_daily', key: `inquiry:ip:daily:${f.ipFingerprint}`, limit: 15, seconds: 86400 },
    { reason: 'browser_10m', key: `inquiry:browser:10m:${f.browserFingerprint}`, limit: 3, seconds: 600 },
    { reason: 'browser_daily', key: `inquiry:browser:daily:${f.browserFingerprint}`, limit: 8, seconds: 86400 },
    { reason: 'contact_daily', key: `inquiry:contact:daily:${f.contactFingerprint}`, limit: 2, seconds: 86400 },
    {
      reason: 'payload_daily',
      key: `inquiry:payload:daily:${secureFingerprint('payload', `${name.toLowerCase()}|${message.toLowerCase().replace(/\s+/g, ' ').trim()}`)}`,
      limit: 4,
      seconds: 86400,
    },
  ];
  const results = await Promise.all(limits.map((item) => db().rpc('consume_inquiry_rate_limit', { p_key: item.key, p_limit: item.limit, p_window_seconds: item.seconds })));
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    await removeClaim(submissionId);
    console.error(JSON.stringify({ level: 'error', message: 'inquiry_rate_limit_failed', error: failed.error.message }));
    return NextResponse.json({ message: '잠시 후 다시 시도해주세요.' }, { status: 503 });
  }
  const blockedAt = results.findIndex((result) => !result.data);
  if (blockedAt >= 0) {
    const reason = limits[blockedAt].reason;
    await db().from('inquiry_submission_claims').update({ status: 'blocked', reason, updated_at: new Date().toISOString() }).eq('submission_id', submissionId);
    await logSecurity('form_submission', 'blocked', reason, submissionId, f);
    return NextResponse.json({ message: '신청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }, { status: 429, headers: { 'Retry-After': '600' } });
  }

  const { data: inquiryId, error } = await db().rpc('submit_inquiry', {
    p_name: name, p_contact: contact, p_message: message || null,
    p_source: source, p_medium: medium, p_campaign: campaign, p_content: content,
    p_session_id: sessionId, p_clarity_ready: clarityReady,
    p_submission_id: submissionId, p_contact_fingerprint: f.contactFingerprint,
  });
  if (error || typeof inquiryId !== 'string' || !inquiryId) {
    await removeClaim(submissionId);
    const known = Object.keys(ERRORS).find((key) => error?.message?.includes(key));
    if (known) return NextResponse.json({ message: ERRORS[known].message }, { status: ERRORS[known].status });
    console.error(JSON.stringify({ level: 'error', message: 'inquiry_submit_failed', requestId, error: error?.message }));
    return NextResponse.json({ message: '접수에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }

  await db().from('inquiry_submission_claims').update({ status: 'completed', inquiry_id: inquiryId, updated_at: new Date().toISOString() }).eq('submission_id', submissionId);
  const lineValue = (label: string) => message.split('\n').find((item) => item.startsWith(`${label}:`))?.slice(label.length + 1).trim() || '-';
  const { data: smsAllowed, error: smsLimitError } = await db().rpc('consume_inquiry_rate_limit', { p_key: 'inquiry:sms:daily', p_limit: 20, p_window_seconds: 86400 });
  let smsStatus: string = 'skipped_cap';
  if (smsLimitError) {
    smsStatus = 'limit_error';
    await logSecurity('sms_notification', 'warning', 'sms_limit_error', submissionId, f);
  } else if (smsAllowed) {
    smsStatus = await notifySms({ name, age: lineValue('나이'), consultationDate: lineValue('상담 희망') });
  } else {
    await logSecurity('sms_notification', 'warning', 'sms_daily_cap', submissionId, f, { limit: 20 });
  }
  await db().from('inquiries').update({ sms_notification_status: smsStatus }).eq('id', inquiryId);

  const leadRef = createLeadReference(inquiryId);
  console.log(JSON.stringify({ level: 'info', message: 'inquiry_submit_succeeded', requestId, duration_ms: Date.now() - startedAt, source, medium, campaign, leadRef, sessionId, clarityReady, smsStatus }));
  return NextResponse.json({ ok: true, leadRef });
}
