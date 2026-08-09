import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { notifyKakao } from '@/lib/kakao';
import { notifyNewInquiry } from '@/lib/notify';

export const dynamic = 'force-dynamic';

const ERRORS: Record<string, { status: number; message: string }> = {
  NAME_REQUIRED: { status: 400, message: '이름을 입력해주세요.' },
  CONTACT_REQUIRED: { status: 400, message: '연락처를 입력해주세요.' },
  TOO_LONG: { status: 400, message: '입력 내용이 너무 깁니다.' },
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const raw = body as { name?: unknown; contact?: unknown; message?: unknown };
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const contact = typeof raw.contact === 'string' ? raw.contact.trim() : '';
  const message = typeof raw.message === 'string' ? raw.message.trim() : '';

  if (!name || !contact) {
    return NextResponse.json({ message: '이름과 연락처를 입력해주세요.' }, { status: 400 });
  }

  const { error } = await db().rpc('submit_inquiry', {
    p_name: name,
    p_contact: contact,
    p_message: message || null,
  });

  if (error) {
    const known = Object.keys(ERRORS).find((k) => error.message?.includes(k));
    if (known) {
      const { status, message: msg } = ERRORS[known];
      return NextResponse.json({ message: msg }, { status });
    }
    console.error('submit_inquiry 실패', error);
    return NextResponse.json(
      { message: '접수에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }

  // 둘 다 내부에서 에러를 삼키므로 실패해도 여기서 던지지 않는다.
  // await 없이 넘기면 서버리스 환경에서 응답 직후 함수가 종료되며
  // 발송이 끊길 수 있어 반드시 기다린다. 이메일·카카오는 서로 독립이라
  // 하나가 설정 안 돼 있거나 실패해도 다른 쪽은 정상 발송된다.
  const notice = { name, contact, message: message || null };
  await Promise.all([notifyNewInquiry(notice), notifyKakao(notice)]);

  return NextResponse.json({ ok: true });
}
