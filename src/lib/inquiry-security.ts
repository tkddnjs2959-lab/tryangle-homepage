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

export function requestFingerprints(req: Request, contact: string) {
  const address = requestAddress(req);
  const userAgent = (req.headers.get('user-agent') || 'unknown').slice(0, 500);
  return {
    contactFingerprint: secureFingerprint('contact', normalizedPhone(contact)),
    ipFingerprint: secureFingerprint('ip', address),
    browserFingerprint: secureFingerprint('browser', `${address}|${userAgent}`),
  };
}
