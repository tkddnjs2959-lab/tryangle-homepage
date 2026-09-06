'use client';

import styles from './page.module.css';
import { useRemainingTime } from './EnrollmentCountdown';

type ConsultationSummaryCardProps = {
  variant: 'desktop' | 'mobile';
};

function SummaryContents({ placement, deadline }: { placement: string; deadline: string }) {
  const remainingTime = useRemainingTime(deadline);
  const timeDigits = remainingTime && remainingTime !== null
    ? [remainingTime.hours, remainingTime.minutes, remainingTime.seconds].map((value) => String(value).padStart(2, '0'))
    : ['--', '--', '--'];
  function openConsultation() {
    window.dispatchEvent(new CustomEvent('tryangle:open-consultation', {
      detail: { placement },
    }));
  }

  return (
    <div className={styles.sideCard}>
      <p className={styles.sideStatus}><span aria-hidden="true" />8기 상담 및 신청 진행 중</p>
      <h2>8기 클래스 안내</h2>
      <div className={styles.sideCountdown} aria-label="8기 신청 및 등록 마감까지 남은 시간">
        <span>⏰ 8기 신청 및 등록 마감까지</span>
        {remainingTime === null ? <strong>마감</strong> : (
          <div className={styles.sideCountdownTimer} role="timer" aria-live="off">
            <div className={styles.sideCountdownGroup}>
              <div className={styles.sideCountdownDigits}><b>{remainingTime === undefined ? '--' : String(remainingTime.days).padStart(2, '0')[0]}</b><b>{remainingTime === undefined ? '--' : String(remainingTime.days).padStart(2, '0')[1]}</b></div>
              <small>일</small>
            </div>
            {timeDigits.map((value, index) => (
              <span className={styles.sideCountdownTimeGroup} key={index}>
                {index > 0 && <i aria-hidden="true">:</i>}
                <span className={styles.sideCountdownGroup}>
                  <div className={styles.sideCountdownDigits}><b>{value[0]}</b><b>{value[1]}</b></div>
                  <small>{['시간', '분', '초'][index]}</small>
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
      <p className={styles.sideNextCohort}>9기 신청 가능 시기는 12월입니다.</p>

      <dl className={styles.sideFacts}>
        <div>
          <dt>개강</dt>
          <dd>화 9월 8일 · 토 9월 12일</dd>
        </div>
        <div>
          <dt>시간</dt>
          <dd>화 19:00 · 토 11:00</dd>
        </div>
        <div>
          <dt>구성</dt>
          <dd>12주 · 월 4회 · 회당 90분</dd>
        </div>
        <div>
          <dt>정원</dt>
          <dd>반별 최대 4명</dd>
        </div>
      </dl>

      <div className={styles.sidePrice}>
        <span>8기 한정가</span>
        <div><del>65만원</del><strong>45만원</strong></div>
      </div>

      <button className={styles.sideButton} type="button" onClick={openConsultation}>
        8기 상담 신청하기
      </button>
      <p className={styles.sideNote}>정원 마감 시 모집이 조기 종료될 수 있습니다.</p>
    </div>
  );
}

export default function ConsultationSummaryCard({ variant, deadline }: ConsultationSummaryCardProps & { deadline: string }) {
  if (variant === 'mobile') {
    return (
      <section className={styles.mobileSummary} aria-label="모바일 8기 클래스 핵심 안내">
        <SummaryContents placement="homepage_mobile_summary" deadline={deadline} />
      </section>
    );
  }

  return (
    <aside className={styles.sideRail} aria-label="8기 클래스 핵심 안내" data-motion="summary">
      <SummaryContents placement="homepage_sticky_summary" deadline={deadline} />
    </aside>
  );
}
