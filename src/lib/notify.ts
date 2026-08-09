import 'server-only';
import { Resend } from 'resend';

/**
 * 문의 접수 알림 메일.
 *
 * 카카오 알림톡은 쓰지 않는다 — 채널 비즈니스 인증 + 인증된 중개업체 가입이
 * 선행돼야 해서 지금 규모에는 맞지 않는다. 대신 대표가 매일 확인하는
 * 이메일로 보낸다.
 *
 * Resend 무료 티어의 기본 발신 도메인(onboarding@resend.dev)은 계정
 * 가입 시 등록한 이메일로만 보낼 수 있다 — 자기 자신에게 보내는
 * 이 용도와 정확히 맞아서 도메인 인증 없이 바로 쓸 수 있다.
 *
 * 이메일 발송 실패가 문의 접수 자체를 막으면 안 된다. 실패해도
 * 로그만 남기고 조용히 넘어간다 — 문의는 이미 DB에 저장됐다.
 */
export async function notifyNewInquiry(input: {
  name: string;
  contact: string;
  message: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  if (!apiKey || !to) {
    console.warn('RESEND_API_KEY / ADMIN_EMAIL 미설정 — 알림 메일을 건너뜁니다.');
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'TRY앵글 홈페이지 <onboarding@resend.dev>',
      to,
      subject: `[TRY앵글] 새 상담 문의 — ${input.name}`,
      text:
        `이름: ${input.name}\n` +
        `연락처: ${input.contact}\n` +
        `내용: ${input.message || '(내용 없음)'}\n\n` +
        `어드민에서 확인: (배포된 tryangle-research 주소)/admin/inquiries`,
    });
  } catch (err) {
    console.error('알림 메일 발송 실패', err);
  }
}
