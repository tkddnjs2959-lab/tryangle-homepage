import 'server-only';

import { createHmac } from 'node:crypto';

function securitySecret() {
  const secret = process.env.INQUIRY_SECURITY_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('INQUIRY_SECURITY_SECRET 또는 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.');
  return secret;
}

export function normalizedPhone(value: string) {
  return value.replace(/\D/g, '');
}

export function secureFingerprint(namespace: string, value: string) {
  return createHmac('sha256', securitySecret())
    .update(`${namespace}:${value}`)
    .digest('hex');
}

export function requestAddress(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return req.headers.get('x-real-ip')?.trim() || forwarded || 'unknown';
}

export function requestTrustSignals(req: Request) {
  const origin = req.headers.get('origin')?.trim() || null;
  const secFetchSite = req.headers.get('sec-fetch-site')?.trim().toLowerCase() || null;
  const contentType = req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() || null;
  const contentLength = Number(req.headers.get('content-length') || 0);
  const userAgent = (req.headers.get('user-agent') || '').trim().slice(0, 500);
  let requestOrigin = '';
  try { requestOrigin = new URL(req.url).origin; } catch { requestOrigin = ''; }

  const configured = (process.env.INQUIRY_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const allowedOrigins = new Set([
    'https://tryangle-official.co.kr',
    'https://www.tryangle-official.co.kr',
    requestOrigin,
    ...configured,
  ].filter(Boolean));
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:3000');
    allowedOrigins.add('http://127.0.0.1:3000');
  }

  return {
    origin,
    secFetchSite,
    contentType,
    contentLength: Number.isFinite(contentLength) && contentLength > 0 ? contentLength : 0,
    userAgent,
    originAllowed: !origin || allowedOrigins.has(origin),
    isCrossSite: secFetchSite === 'cross-site',
  };
}

export function requestFingerprints(req: Request, contact: string) {
  const address = requestAddress(req);
  const userAgent = (req.headers.get('user-agent') || 'unknown').slice(0, 500);
  return {
    contactFingerprint: secureFingerprint('contact', normalizedPhone(contact)),
    ipFingerprint: secureFingerprint('ip', address),
    browserFingerprint: secureFingerprint('browser', `${address}|${userAgent}`),
  };
}
