import 'server-only';
import { db } from './supabase';

/**
 * 카카오 '나에게 보내기' — 문의 접수를 관리자 본인의 카카오톡으로 알린다.
 *
 * 절차 (1회성, 관리자 본인만):
 *   1. Kakao Developers 에서 앱 생성 → 카카오 로그인 활성화 →
 *      동의항목에서 '카카오톡 메시지 전송(talk_message)' 활성화
 *   2. Redirect URI 등록 (KAKAO_REDIRECT_URI 와 동일해야 함)
 *   3. /api/kakao/authorize 접속 → 본인 계정으로 동의
 *   4. 콜백에서 최초 refresh_token 을 kakao_token 테이블에 저장
 *
 * 이후 자동:
 *   access_token 은 ~12시간, refresh_token 은 ~60일 후 만료된다.
 *   보낼 때마다 refresh_token 으로 access_token 을 새로 받고,
 *   카카오가 refresh_token 을 회전시켜 돌려주면(만료 1개월 이내일 때)
 *   DB 에도 갱신해 반영한다 — 정적 환경변수로는 이걸 할 수 없어서
 *   토큰을 DB 에 둔다.
 */

const REST_KEY = () => process.env.KAKAO_REST_API_KEY;
const CLIENT_SECRET = () => process.env.KAKAO_CLIENT_SECRET; // 선택

async function getStoredRefreshToken(): Promise<string | null> {
  const { data } = await db().from('kakao_token').select('refresh_token').eq('id', true).maybeSingle();
  return data?.refresh_token ?? null;
}

async function saveRefreshToken(refreshToken: string, expiresInSec: number) {
  const expiresAt = new Date(Date.now() + expiresInSec * 1000).toISOString();
  await db().from('kakao_token').upsert({
    id: true,
    refresh_token: refreshToken,
    refresh_token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  });
}

/** refresh_token 으로 새 access_token 을 받는다. 회전된 refresh_token 은 저장한다. */
async function refreshAccessToken(): Promise<string | null> {
  const restKey = REST_KEY();
  if (!restKey) return null;

  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) return null;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: restKey,
    refresh_token: refreshToken,
  });
  const secret = CLIENT_SECRET();
  if (secret) body.set('client_secret', secret);

  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    console.error('카카오 토큰 갱신 실패', res.status, await res.text().catch(() => ''));
    return null;
  }

  const json = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    refresh_token_expires_in?: number;
  };

  // 카카오가 새 refresh_token 을 함께 주는 경우(만료 1개월 이내였던 경우)에만 갱신한다
  if (json.refresh_token && json.refresh_token_expires_in) {
    await saveRefreshToken(json.refresh_token, json.refresh_token_expires_in);
  }

  return json.access_token;
}

/** 문의 접수를 관리자 본인의 카카오톡 '나와의 채팅'으로 보낸다. 실패해도 조용히 넘어간다. */
export async function notifyKakao(input: { name: string; contact: string; message: string | null }) {
  if (!REST_KEY()) {
    console.warn('KAKAO_REST_API_KEY 미설정 — 카카오 알림을 건너뜁니다.');
    return;
  }

  try {
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      console.warn('카카오 액세스 토큰을 받지 못했습니다 — /api/kakao/authorize 로 재연동이 필요할 수 있습니다.');
      return;
    }

    // 어드민 문의함 주소 (선택). 설정하려면 그 도메인을 카카오 디벨로퍼스
    // 앱 설정 > 플랫폼 > Web 사이트 도메인에도 등록해야 한다 — 등록되지
    // 않은 도메인을 링크로 넣으면 카카오가 조용히 첫 번째 등록 도메인으로
    // 바꿔서 보낸다 (에러 없이 엉뚱한 링크로 감). 안 정해두면 텍스트만 보낸다.
    const adminUrl = process.env.ADMIN_INQUIRIES_URL;

    const template = {
      object_type: 'text',
      text:
        `[TRY앵글] 새 상담 문의\n\n` +
        `이름: ${input.name}\n` +
        `연락처: ${input.contact}\n` +
        `내용: ${input.message || '(내용 없음)'}`,
      link: adminUrl ? { web_url: adminUrl, mobile_web_url: adminUrl } : undefined,
    };

    const res = await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ template_object: JSON.stringify(template) }),
    });

    if (!res.ok) {
      console.error('카카오 메모 발송 실패', res.status, await res.text().catch(() => ''));
    }
  } catch (err) {
    console.error('카카오 알림 처리 중 오류', err);
  }
}
