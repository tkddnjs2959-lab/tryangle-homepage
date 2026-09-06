'use client';

import styles from './page.module.css';
import type { RemainingTime } from './EnrollmentCountdown';

export default function CountdownBoxes({ remainingTime }: { remainingTime: RemainingTime | null | undefined }) {
  if (remainingTime === null) return <strong className={styles.countdownClosed}>마감</strong>;
  const values = remainingTime === undefined
    ? { days: '--', hours: '--', minutes: '--', seconds: '--' }
    : { days: String(remainingTime.days).padStart(2, '0'), hours: String(remainingTime.hours).padStart(2, '0'), minutes: String(remainingTime.minutes).padStart(2, '0'), seconds: String(remainingTime.seconds).padStart(2, '0') };
  return (
    <div className={styles.instagramCountdown} role="timer" aria-live="off">
      <span className={styles.instagramDays}>{values.days}<small>일</small></span>
      {(['hours', 'minutes', 'seconds'] as const).map((key, index) => (
        <span className={styles.instagramTimeGroup} key={key}>
          {index > 0 && <i aria-hidden="true">:</i>}
          <span className={styles.instagramTimeValue}>
            <span className={styles.instagramDigits}><b>{values[key][0]}</b><b>{values[key][1]}</b></span>
            <small>{['시간', '분', '초'][index]}</small>
          </span>
        </span>
      ))}
    </div>
  );
}
