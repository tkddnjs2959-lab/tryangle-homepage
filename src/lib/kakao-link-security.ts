import 'server-only';

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const KAKAO_LINK_COOKIE = '__Host-tryangle_kakao_link';
const STATE_TTL_MS = 10 * 60 * 1000;

function configuredSecret() {
  return process.env.KAKAO_LINK_SECRET?.trim() || null;
}

function digest(value: string) {
  const secret = configuredSecret();
  if (!secret) throw new Error('KAKAO_LINK_SECRET 환경변수가 없습니다.');
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(first: string, second: string) {
  const left = Buffer.from(first);
  const right = Buffer.from(second);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isKakaoLinkingEnabled() {
  return Boolean(configuredSecret());
}

export function verifyKakaoLinkCode(input: string) {
  const secret = configuredSecret();
  if (!secret || !input) return false;
  return safeEqual(digest(`code:${input}`), digest(`code:${secret}`));
}

export function createKakaoOAuthState() {
  const issuedAt = Date.now().toString(36);
  const nonce = randomBytes(32).toString('base64url');
  const payload = `${issuedAt}.${nonce}`;
  return `${payload}.${digest(`state:${payload}`)}`;
}

export function verifyKakaoOAuthState(state: string, cookieValue: string | undefined) {
  if (!configuredSecret()) return false;
  if (!state || !cookieValue || !safeEqual(state, cookieValue)) return false;
  const [issuedAt, nonce, signature] = state.split('.');
  if (!issuedAt || !nonce || !signature) return false;
  const timestamp = Number.parseInt(issuedAt, 36);
  if (!Number.isFinite(timestamp) || Date.now() - timestamp < 0 || Date.now() - timestamp > STATE_TTL_MS) return false;
  return safeEqual(signature, digest(`state:${issuedAt}.${nonce}`));
}
