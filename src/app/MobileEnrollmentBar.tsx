'use client';

import styles from './page.module.css';
import { useRemainingTime } from './EnrollmentCountdown';

export default function MobileEnrollmentBar({ deadline }: { deadline: string }) {
  const remainingTime = useRemainingTime(deadline);
  function openConsultation() {
    window.dispatchEvent(new CustomEvent('tryangle:open-consultation', {
      detail: { placement: 'homepage_mobile_enrollment_bar' },
    }));
  }

  return (
    <div className={styles.mobileEnrollmentBar} role="region" aria-label="8기 상담 및 등록 안내">
      <p className={styles.mobileEnrollmentCopy}>
        <span className={styles.mobileEnrollmentTimer}>
          ⏰ 8기 마감까지 {remainingTime === undefined ? '--일 --시간 --분' : remainingTime === null ? '마감' : `${remainingTime.days}일 ${String(remainingTime.hours).padStart(2, '0')}시간 ${String(remainingTime.minutes).padStart(2, '0')}분`}
        </span>
        <span>이번 기수를 놓치면</span>
        <strong>9기 참여 가능 시기는 12월입니다.</strong>
      </p>
      <button type="button" className={styles.mobileEnrollmentButton} onClick={openConsultation}>
        상담 신청하기
      </button>
    </div>
  );
}
