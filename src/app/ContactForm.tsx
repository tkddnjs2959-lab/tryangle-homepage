'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { getAttribution } from './AttributionCapture';
import TrackedLink from './TrackedLink';

const DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const KAKAO_URL = 'https://app.tryangle-official.co.kr/go/kakao?utm_source=homepage&utm_medium=owned&utm_campaign=inquiry_complete&utm_content=contact_form';
const TIMES = Array.from({ length: 12 }, (_, index) => {
  const totalMinutes = 10 * 60 + index * 60;
  const hour = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  return `${hour}:00`;
});
const MORNING_TIMES = TIMES.filter((time) => Number(time.slice(0, 2)) < 12);
const AFTERNOON_TIMES = TIMES.filter((time) => Number(time.slice(0, 2)) >= 12);

export default function ContactForm({
  programLabel,
  hideCoachingAvailability = false,
  hideGender = false,
  bookingMode = false,
  lessonTypeSelection = false,
  kakaoInquiryUrl,
}: {
  programLabel?: string;
  hideCoachingAvailability?: boolean;
  hideGender?: boolean;
  bookingMode?: boolean;
  lessonTypeSelection?: boolean;
  kakaoInquiryUrl?: string;
} = {}) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState(DAYS[0]);
  const [preferredSlots, setPreferredSlots] = useState<Record<string, string[]>>({});
  const [major, setMajor] = useState('');
  const [mediaExperience, setMediaExperience] = useState('없음');
  const [bookingPreference, setBookingPreference] = useState('');
  const [lessonType, setLessonType] = useState<'2:1' | '1:1'>('2:1');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const phoneDigits = contact.replace(/[^0-9]/g, '');
    const selectedSlots = selectedDays.flatMap((day) => (preferredSlots[day] ?? []).map((time) => `${day} ${time}`));
    if (!name.trim() || !age || (!hideGender && !gender) || !contact.trim() || !major || (!hideCoachingAvailability && !mediaExperience)) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (!privacyAgreed) {
      setError('개인정보 수집·이용에 동의해주세요.');
      return;
    }
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setError('연락처는 휴대전화 번호를 정확히 입력해주세요.');
      return;
    }
    if (!hideCoachingAvailability && selectedSlots.length === 0) {
      setError('상담 희망 요일별로 시간을 한 개 이상 선택해주세요.');
      return;
    }
    if (!hideCoachingAvailability && selectedDays.some((day) => (preferredSlots[day] ?? []).length === 0)) {
      setError('선택한 모든 요일에 상담 시간을 지정해주세요.');
      return;
    }
    setState('sending');
    setError(null);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          message: [
            ...(programLabel ? [`신청 프로그램: ${programLabel}`] : []),
            ...(lessonTypeSelection ? [`레슨 유형: ${lessonType}`] : []),
            `나이: ${age}세`,
            ...(!hideGender ? [`성별: ${gender}`] : []),
            ...(bookingMode && bookingPreference.trim() ? [`희망 요일·시간: ${bookingPreference.trim()}`] : []),
            ...(!hideCoachingAvailability ? [`상담 희망: ${selectedSlots.join(', ')}`] : []),
            `연기 전공 여부: ${major}`,
            ...(!hideCoachingAvailability ? [`매체연기 경력(연극 제외): ${mediaExperience}`] : []),
          ].join('\n'),
          website,
          attribution: getAttribution(),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setError(json.message ?? '접수에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setState('idle');
        return;
      }
      setState('done');
    } catch {
      setError('네트워크 오류입니다. 연결을 확인하고 다시 시도해주세요.');
      setState('idle');
    }
  }

  function toggleDay(day: string) {
    setActiveDay(day);
    setSelectedDays((current) => current.includes(day)
      ? current.filter((item) => item !== day)
      : [...current, day]);
  }

  function toggleTime(time: string) {
    setSelectedDays((current) => current.includes(activeDay) ? current : [...current, activeDay]);
    setPreferredSlots((current) => {
      const times = current[activeDay] ?? [];
      return {
        ...current,
        [activeDay]: times.includes(time) ? times.filter((item) => item !== time) : [...times, time].sort(),
      };
    });
  }

  function renderTimeButtons(times: string[]) {
    return times.map((time) => {
      const active = (preferredSlots[activeDay] ?? []).includes(time);
      return (
        <button
          type="button"
          key={time}
          className={`${styles.timeButton} ${active ? styles.timeButtonActive : ''}`}
          onClick={() => toggleTime(time)}
        >
          {time}
        </button>
      );
    });
  }

  if (state === 'done') {
    return (
      <div className={styles.formDone}>
        <strong>{bookingMode ? '상담 예약이 접수되었습니다.' : '상담 신청이 접수되었습니다.'}</strong>
        <strong className={styles.formDoneMessage}>
          아래 버튼을 눌러 카카오톡에서<br />
          “{bookingMode ? '상담 예약했어요' : '상담 신청했어요'}”라고 메시지를 남겨주세요.
          <br />
          {bookingMode ? '확인 후 방문상담 가능 일정을 안내해드리겠습니다.' : '확인 후 상담 가능 일정과 진행 방법을 안내해드리겠습니다.'}
        </strong>
        <TrackedLink
          className={styles.formDoneButton}
          href={kakaoInquiryUrl ?? KAKAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          eventName="click_kakao_consult"
          eventParams={{ placement: bookingMode ? 'coaching_booking_complete' : 'contact_form_complete' }}
        >
          {kakaoInquiryUrl ? '카카오톡 문의하기' : 'TRY앵글 카카오톡 채널 바로가기'}
        </TrackedLink>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        className={styles.honeypot}
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {bookingMode && lessonTypeSelection && (
        <div className={styles.lessonTypeTabs} role="group" aria-label="레슨 유형 선택">
          {(['2:1', '1:1'] as const).map((type) => (
            <button
              type="button"
              key={type}
              aria-pressed={lessonType === type}
              className={styles.lessonTypeTab + (lessonType === type ? ' ' + styles.lessonTypeTabActive : '')}
              onClick={() => setLessonType(type)}
            >
              {type} 레슨
            </button>
          ))}
        </div>
      )}
      <div className={styles.formRow}>
        <input
          className={styles.input}
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
        <input
          className={styles.input}
          type="number"
          placeholder="ex)27"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min={13}
          max={99}
          inputMode="numeric"
        />
      </div>
      <div className={hideGender ? styles.formRowSingle : styles.formRow}>
        {!hideGender && (
          <select className={styles.input} value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">성별 선택</option>
            <option value="여">여</option>
            <option value="남">남</option>
          </select>
        )}
        <input
          className={styles.input}
          type="tel"
          placeholder="전화번호 (-)없이 입력"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          maxLength={13}
          inputMode="tel"
        />
      </div>
      <div className={hideCoachingAvailability ? styles.formRowSingle : styles.formRow}>
        <label className={styles.fieldLabel}>
          <span className={styles.fieldTitle}>연기 전공 여부</span>
          <select className={styles.input} value={major} onChange={(e) => setMajor(e.target.value)}>
            <option value="">선택해주세요</option>
            <option value="전공">전공</option>
            <option value="비전공">비전공</option>
          </select>
        </label>
        {!hideCoachingAvailability && (
          <label className={styles.fieldLabel}>
            <span className={styles.fieldTitle}>매체연기 경력 <small>(연극 제외)</small></span>
            <select className={styles.input} value={mediaExperience} onChange={(e) => setMediaExperience(e.target.value)}>
              <option value="없음">없음</option>
              <option value="1년 미만">1년 미만</option>
              <option value="1–3년">1–3년</option>
              <option value="4년 이상">4년 이상</option>
            </select>
          </label>
        )}
      </div>
      {bookingMode && (
        <label className={styles.fieldLabel}>
          <span className={styles.fieldTitle}>희망 요일·시간</span>
          <textarea
            className={styles.textarea}
            value={bookingPreference}
            onChange={(e) => setBookingPreference(e.target.value)}
            placeholder="예: 월요일 3시 이후, 금요일 6시"
            rows={3}
            maxLength={300}
          />
        </label>
      )}
      {!hideCoachingAvailability && <fieldset className={styles.choiceGroup}>
        <legend>
          상담 희망 요일·시간
          <br className={styles.brMobile} />
          <span>(요일과 시간을 눌러 선택해주세요 / 복수 선택 가능)</span>
        </legend>
        <div className={styles.dayPicker}>
          {DAYS.map((day) => (
            <button
              type="button"
              key={day}
              className={`${styles.dayButton} ${selectedDays.includes(day) ? styles.dayButtonSelected : ''} ${selectedDays.includes(day) && (preferredSlots[day] ?? []).length > 0 ? styles.dayButtonComplete : ''} ${selectedDays.includes(day) && (preferredSlots[day] ?? []).length === 0 ? styles.dayButtonPending : ''} ${activeDay === day ? styles.dayButtonCurrent : ''}`}
              onClick={() => toggleDay(day)}
            >
              {day.replace('요일', '')}
              {(preferredSlots[day] ?? []).length > 0 && <small>{preferredSlots[day].length}개</small>}
            </button>
          ))}
        </div>
        <div className={styles.selectedDayLabel}>{activeDay} 상담 가능 시간</div>
        <div className={styles.timeSection}>
          <span>오전</span>
          <div className={styles.timeGrid}>{renderTimeButtons(MORNING_TIMES)}</div>
        </div>
        <div className={styles.timeSection}>
          <span>오후</span>
          <div className={styles.timeGrid}>{renderTimeButtons(AFTERNOON_TIMES)}</div>
        </div>
      </fieldset>}
      <label className={styles.privacyAgree}>
        <input
          type="checkbox"
          checked={privacyAgreed}
          onChange={(e) => setPrivacyAgreed(e.target.checked)}
          required
        />
        <span>
          {bookingMode ? '레슨 예약' : '상담 신청'}을 위한 개인정보 수집·이용에 동의합니다.
          <small>
            수집 항목: 이름, 연락처, 나이{hideGender ? '' : ', 성별'}{lessonTypeSelection ? ', 레슨 유형' : ''}{bookingMode ? ', 희망 요일·시간' : hideCoachingAvailability ? '' : ', 상담 희망 시간'} 등 · 이용 목적: 상담 일정 안내 및 연락
          </small>
        </span>
      </label>
      {error && <p className={styles.formError}>{error}</p>}
      <button className={styles.formSubmit} type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? '접수 중…' : bookingMode ? '상담 예약하기' : '상담 신청하기'}
      </button>
      <TrackedLink
        className={`${styles.kakaoBtn} ${styles.kakaoBtnWide}`}
        href={kakaoInquiryUrl ?? KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        eventName="click_kakao_consult"
        eventParams={{ placement: bookingMode ? 'coaching_booking_form' : 'contact_form' }}
      >
        카카오톡으로 문의하기
      </TrackedLink>
    </form>
  );
}
