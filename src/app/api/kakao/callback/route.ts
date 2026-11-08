import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

function page(title: string, body: string, ok: boolean) {
  return new NextResponse(
    `<!doctype html><html lang="ko"><head><meta charset="utf-8">
      <title>${title}</title>
      <style>
        body{font-family:system-ui,'Malgun Gothic',sans-serif;background:#BFDFF2;
          display:grid;place-items:center;min-height:100vh;margin:0}
        .box{background:#fff;border-radius:16px;padding:32px 28px;max-width:420px;text-align:center}
        h1{font-size:18px;color:${ok ? '#1a6b43' : '#a83232'};margin:0 0 10px}
        p{font-size:13.5px;color:#4f5b69;line-height:1.6;white-space:pre-wrap}
      </style></head>
      <body><div class="box"><h1>${title}</h1><p>${body}</p></div></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

/** 카카오 동의 완료 후 콜백 — 최초 refresh_token 을 발급받아 DB 에 저장한다. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const kakaoError = searchParams.get('error');

  if (kakaoError) {
    return page('연동이 취소되었습니다', `카카오 쪽 응답: ${kakaoError}`, false);
  }
  if (!code) {
    return page('잘못된 접근입니다', 'code 파라미터가 없습니다. /api/kakao/authorize 로 다시 시작해주세요.', false);
  }

  const restKey = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;
  const secret = process.env.KAKAO_CLIENT_SECRET;

  if (!restKey || !redirectUri) {
    return page('설정 오류', 'KAKAO_REST_API_KEY / KAKAO_REDIRECT_URI 환경변수가 없습니다.', false);
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: restKey,
    redirect_uri: redirectUri,
    code,
  });
  if (secret) body.set('client_secret', secret);

  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return page('토큰 발급 실패', `카카오 응답(${res.status}):\n${detail}`, false);
  }

  const json = (await res.json()) as {
    refresh_token: string;
    refresh_token_expires_in: number;
  };

  const expiresAt = new Date(Date.now() + json.refresh_token_expires_in * 1000).toISOString();
  const { error } = await db().from('kakao_token').upsert({
    id: true,
    refresh_token: json.refresh_token,
    refresh_token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return page('저장 실패', `토큰은 받았지만 DB 저장에 실패했습니다: ${error.message}`, false);
  }

  return page(
    '카카오 연동 완료',
    '이제부터 문의가 접수되면 이 카카오 계정의 "나와의 채팅"으로 알림이 옵니다.\n이 창은 닫으셔도 됩니다.',
    true
  );
}
