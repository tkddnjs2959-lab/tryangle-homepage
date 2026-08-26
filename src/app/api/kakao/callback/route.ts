import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { KAKAO_LINK_COOKIE, verifyKakaoOAuthState } from '@/lib/kakao-link-security';

export const dynamic = 'force-dynamic';

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] || char);
}

function page(title: string, body: string, ok: boolean, status = 200) {
  return new NextResponse(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>body{font-family:system-ui,sans-serif;background:#bfdff2;display:grid;place-items:center;min-height:100vh;margin:0}.box{background:#fff;border-radius:16px;padding:32px 28px;max-width:420px;text-align:center}h1{font-size:18px;color:${ok ? '#1a6b43' : '#a83232'};margin:0 0 10px}p{font-size:13.5px;color:#4f5b69;line-height:1.6;white-space:pre-wrap}</style></head><body><main class="box"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p></main></body></html>`, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  });
}

export async function GET(req: Request) {
  const jar = await cookies();
  const stateCookie = jar.get(KAKAO_LINK_COOKIE)?.value;
  jar.delete(KAKAO_LINK_COOKIE);
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || '';
  if (!verifyKakaoOAuthState(state, stateCookie)) {
    return page('연동 요청 만료', '보안 확인에 실패했습니다. 관리자 연동 화면에서 다시 시작해주세요.', false, 403);
  }

  if (searchParams.get('error')) return page('연동이 취소되었습니다', '카카오 계정 동의가 완료되지 않았습니다.', false, 400);
  const code = searchParams.get('code');
  if (!code) return page('잘못된 접근입니다', '카카오 인증 코드가 없습니다.', false, 400);

  const restKey = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;
  const secret = process.env.KAKAO_CLIENT_SECRET;
  if (!restKey || !redirectUri) return page('설정 오류', '카카오 연동 설정이 완료되지 않았습니다.', false, 503);

  const body = new URLSearchParams({ grant_type: 'authorization_code', client_id: restKey, redirect_uri: redirectUri, code });
  if (secret) body.set('client_secret', secret);
  const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(8_000),
  }).catch(() => null);
  if (!tokenResponse?.ok) {
    console.error(JSON.stringify({ level: 'error', message: 'kakao_link_token_failed', status: tokenResponse?.status || 0 }));
    return page('토큰 발급 실패', '카카오 연결을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.', false, 502);
  }

  const json = await tokenResponse.json() as { refresh_token?: string; refresh_token_expires_in?: number };
  if (!json.refresh_token || !json.refresh_token_expires_in) return page('토큰 발급 실패', '카카오 연결 정보를 받지 못했습니다.', false, 502);
  const expiresAt = new Date(Date.now() + json.refresh_token_expires_in * 1000).toISOString();
  const { error } = await db().from('kakao_token').upsert({ id: true, refresh_token: json.refresh_token, refresh_token_expires_at: expiresAt, updated_at: new Date().toISOString() });
  if (error) {
    console.error(JSON.stringify({ level: 'error', message: 'kakao_link_store_failed', error: error.message }));
    return page('저장 실패', '연동 정보를 안전하게 저장하지 못했습니다.', false, 503);
  }
  return page('카카오 연동 완료', '이제부터 상담 문의 알림이 연결된 카카오 계정으로 전달됩니다.\n이 창은 닫으셔도 됩니다.', true);
}
