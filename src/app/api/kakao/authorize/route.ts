import { NextResponse } from 'next/server';

/**
 * 카카오 '나에게 보내기' 1회성 연동 시작점.
 *
 * 대표 본인이 딱 한 번 방문해서 본인 카카오 계정으로 동의하면 된다.
 * 링크를 남에게 공유할 이유가 없는 페이지라 어드민 인증을 별도로 걸지
 * 않았다 — 남이 접속해도 자기 카카오 계정 동의만 요구받을 뿐, 우리
 * 시스템에는 그 사람의 refresh_token 이 저장되지 않는다(콜백에서
 * '본인 것'을 저장하는 게 아니라 이 서버가 대신 보관하는 구조이므로,
 * 실제로 이 흐름을 완료하는 사람이 곧 알림을 받는 카카오 계정이 된다).
 * 따라서 실수로 남이 완료하지 않도록 실제 운영 중에는 이 URL을
 * 대표 본인만 사용할 것.
 */
export async function GET() {
  const restKey = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  if (!restKey || !redirectUri) {
    return NextResponse.json(
      {
        message:
          'KAKAO_REST_API_KEY / KAKAO_REDIRECT_URI 환경변수가 없습니다. .env.local 에 먼저 설정하세요.',
      },
      { status: 500 }
    );
  }

  const url = new URL('https://kauth.kakao.com/oauth/authorize');
  url.searchParams.set('client_id', restKey);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'talk_message');

  return NextResponse.redirect(url.toString());
}
