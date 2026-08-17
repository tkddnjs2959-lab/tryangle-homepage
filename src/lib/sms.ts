import 'server-only';
import { SolapiMessageService } from 'solapi';

const SMS_MAX_BYTES = 90;

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function truncateToBytes(value: string, maxBytes: number) {
  let result = '';

  for (const character of value) {
    if (Buffer.byteLength(result + character, 'utf8') > maxBytes) break;
    result += character;
  }

  return result;
}

/**
 * 새 상담 신청을 관리자 휴대전화로 알린다.
 *
 * 고객에게 보내는 광고 문자가 아니라 내부 접수 알림이다. 발송 실패가
 * 상담 신청 자체를 막지 않도록 오류는 기록만 하고 외부로 던지지 않는다.
 * 이름·나이·상담일자만 90 byte 이내 단문 문자(SMS)로 발송한다.
 */
export async function notifySms(input: {
  name: string;
  age: string;
  consultationDate: string;
}) {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = digitsOnly(process.env.SOLAPI_SENDER_NUMBER ?? '');
  const to = digitsOnly(process.env.ADMIN_PHONE_NUMBER ?? '');

  if (!apiKey || !apiSecret || !from || !to) {
    console.warn(
      'SOLAPI_API_KEY / SOLAPI_API_SECRET / SOLAPI_SENDER_NUMBER / ADMIN_PHONE_NUMBER 미설정 — 문자 알림을 건너뜁니다.'
    );
    return;
  }

  try {
    const prefix =
      `[TRY앵글] 신청\n` +
      `이름: ${input.name}\n` +
      `나이: ${input.age}\n` +
      '상담일자: ';
    const availableDateBytes = SMS_MAX_BYTES - Buffer.byteLength(prefix, 'utf8');
    const text = `${prefix}${truncateToBytes(input.consultationDate, Math.max(availableDateBytes, 0))}`;
    const messageService = new SolapiMessageService(apiKey, apiSecret);
    await messageService.send({
      to,
      from,
      text,
      type: 'SMS',
      autoTypeDetect: false,
    });
  } catch (error) {
    console.error('문자 알림 발송 실패', error);
  }
}
