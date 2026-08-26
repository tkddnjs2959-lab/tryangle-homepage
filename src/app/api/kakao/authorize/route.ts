import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { requestFingerprints } from '@/lib/inquiry-security';
import {
  createKakaoOAuthState,
  isKakaoLinkingEnabled,
  KAKAO_LINK_COOKIE,
  verifyKakaoLinkCode,
} from '@/lib/kakao-link-security';

export const dynamic = 'force-dynamic';

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function page(title: string, body: string, disabled = false) {
  const form = disabled ? '' : `
    <form method="post">
      <label for="code">관리자 연동 코드</label>
      <input id="code" name="code" type="password" autocomplete="one-time-code" required maxlength="200">
      <button type="submit">카카오 계정 연동 시작</button>
    </form>`;
  return new NextResponse(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font-family:system-ui,sans-serif;background:#eef1f4;display:grid;place-items:center;min-height:100vh;margin:0}.box{background:#fff;border-radius:16px;padding:30px 26px;max-width:420px;width:calc(100% - 40px);box-sizing:border-box}h1{font-size:18px;color:#102652;margin:0 0 10px}p,label{font-size:14px;color:#4f5b69;line-height:1.6}label{display:block;margin:18px 0 6px}input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #ccd3dc;border-radius:9px}button{width:100%;margin-top:12px;padding:12px;border:0;border-radius:9px;background:#102652;color:#fff;font-weight:700}</style></head><body><main class="box"><h1>${title}</h1><p>${body}</p>${form}</main></body></html>`, {
    status: disabled ? 404 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS },
  });
}

export async function GET() {
  if (!isKakaoLinkingEnabled()) {
    return page('카카오 연동 잠김', '관리자만 일시적으로 열 수 있는 연동 화면입니다.', true);
  }
  return page('카카오 알림 계정 연동', '대표자 확인을 위해 관리자 연동 코드를 입력해주세요.');
}

export async function POST(request: Request) {
  if (!isKakaoLinkingEnabled()) return page('카카오 연동 잠김', '현재 연동 기능이 비활성화되어 있습니다.', true);
  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentType !== 'application/x-www-form-urlencoded' || contentLength > 4096) {
    return new NextResponse('Bad Request', { status: 400, headers: SECURITY_HEADERS });
  }

  const fingerprint = requestFingerprints(request, 'kakao-link').ipFingerprint;
  const { data: allowed, error } = await db().rpc('consume_inquiry_rate_limit', {
    p_key: `kakao:link:ip:15m:${fingerprint}`,
    p_limit: 10,
    p_window_seconds: 900,
  });
  if (error || !allowed) {
    return new NextResponse('Too Many Requests', { status: error ? 503 : 429, headers: { ...SECURITY_HEADERS, 'Retry-After': '900' } });
  }

  const body = new URLSearchParams(await request.text());
  if (!verifyKakaoLinkCode(body.get('code') || '')) {
    return new NextResponse('연동 코드가 올바르지 않습니다.', { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS } });
  }

  const restKey = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;
  if (!restKey || !redirectUri) return new NextResponse('카카오 연동 설정이 완료되지 않았습니다.', { status: 503, headers: SECURITY_HEADERS });

  const state = createKakaoOAuthState();
  const url = new URL('https://kauth.kakao.com/oauth/authorize');
  url.searchParams.set('client_id', restKey);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'talk_message');
  url.searchParams.set('state', state);

  const response = NextResponse.redirect(url.toString(), 303);
  response.cookies.set(KAKAO_LINK_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10 * 60,
  });
  return response;
}
