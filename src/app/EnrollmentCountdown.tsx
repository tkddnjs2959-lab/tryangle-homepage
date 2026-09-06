'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
};

export const getRemainingTime = (deadline: string): RemainingTime | null => {
  const remainingMilliseconds = new Date(deadline).getTime() - Date.now();

  if (remainingMilliseconds <= 0) return null;

  const totalMinutes = Math.ceil(remainingMilliseconds / 60_000);

  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor((totalMinutes % (60 * 24)) / 60),
    minutes: totalMinutes % 60,
  };
};

export function useRemainingTime(deadline: string) {
  const [remainingTime, setRemainingTime] = useState<RemainingTime | null | undefined>(undefined);

  useEffect(() => {
    const updateRemainingTime = () => {
      const nextRemainingTime = getRemainingTime(deadline);
      setRemainingTime((current) => {
        if (current === null && nextRemainingTime === null) return current;
        if (current && nextRemainingTime && current.days === nextRemainingTime.days && current.hours === nextRemainingTime.hours && current.minutes === nextRemainingTime.minutes) return current;
        return nextRemainingTime;
      });
    };
    updateRemainingTime();
    const timer = window.setInterval(updateRemainingTime, 1_000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  return remainingTime;
}

export default function EnrollmentCountdown({ deadline }: { deadline: string }) {
  const remainingTime = useRemainingTime(deadline);

  const isLoading = remainingTime === undefined;
  const isClosed = remainingTime === null;

  return (
    <div className={styles.countdown} aria-label="8기 신청 마감 안내">
      <p className={styles.countdownLabel}>
        <span aria-hidden="true">⏰</span>
        8기 신청 마감까지
      </p>

      {isClosed ? (
        <p className={styles.countdownClosed}>8기 상담 및 등록이 마감되었습니다.</p>
      ) : (
        <div className={styles.countdownTime} role="timer" aria-live="off">
          <span>
            <strong>{isLoading ? '--' : remainingTime.days}</strong>
            <small>일</small>
          </span>
          <i aria-hidden="true" />
          <span>
            <strong>{isLoading ? '--' : String(remainingTime.hours).padStart(2, '0')}</strong>
            <small>시간</small>
          </span>
          <i aria-hidden="true" />
          <span>
            <strong>{isLoading ? '--' : String(remainingTime.minutes).padStart(2, '0')}</strong>
            <small>분</small>
          </span>
        </div>
      )}

      <p className={styles.countdownNext}>
        <span>이번 기수를 놓치면</span>
        <span>9기 참여 가능 시기는 12월입니다.</span>
      </p>
    </div>
  );
}
