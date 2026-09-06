'use client';

import styles from './page.module.css';
import type { RemainingTime } from './EnrollmentCountdown';

type CountdownBoxesProps = {
  remainingTime: RemainingTime | null | undefined;
  compact?: boolean;
};

const GROUPS = [
  ['days', '일'],
  ['hours', '시간'],
  ['minutes', '분'],
  ['seconds', '초'],
] as const;

export default function CountdownBoxes({ remainingTime, compact = false }: CountdownBoxesProps) {
  if (remainingTime === null) return <strong className={styles.countdownClosed}>마감</strong>;
  const values = remainingTime === undefined
    ? { days: '--', hours: '--', minutes: '--', seconds: '--' }
    : { days: String(remainingTime.days).padStart(2, '0'), hours: String(remainingTime.hours).padStart(2, '0'), minutes: String(remainingTime.minutes).padStart(2, '0'), seconds: String(remainingTime.seconds).padStart(2, '0') };
  return (
    <div className={`${styles.instagramCountdown} ${compact ? styles.instagramCountdownCompact : ''}`} role="timer" aria-live="off">
      {GROUPS.map(([key, label], index) => (
        <span className={styles.instagramTimeGroup} key={key}>
          {index > 0 && <i aria-hidden="true">:</i>}
          <span className={styles.instagramTimeValue}>
            <span className={styles.instagramDigits}><b>{values[key][0]}</b><b>{values[key][1]}</b></span>
            <small>{label}</small>
          </span>
        </span>
      ))}
    </div>
  );
}
