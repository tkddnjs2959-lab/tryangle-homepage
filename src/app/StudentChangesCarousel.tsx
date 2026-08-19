'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from './TrackedLink';
import styles from './page.module.css';

const CASES = [
  {
    label: 'CASE 1',
    title: '캐릭터 포지션에 맞는 오디션 선별 → 조연 캐스팅 → 부산국제영화제 상영',
    quote: '이전에는 어떤 오디션을 지원해야 할지 몰라 무작정 지원하는 경우가 많았어요. 캐릭터 포지셔닝 이후에는 저에게 맞는 오디션을 선별해 지원할 수 있게 되었고, 오디션 기회도 눈에 띄게 늘어났습니다. 난생처음 조연으로 캐스팅된 작품이 부산국제영화제 상영작으로 선정되었을 때 정말 놀랐어요.',
  },
  {
    label: 'CASE 2',
    title: '캐릭터 포지션에 맞는 작품 공략 → 장편독립영화 캐스팅',
    quote: '캐릭터 포지셔닝을 통해 저만의 캐릭터 포지션을 도출한 후, 해당 포지션을 필요로 하는 스릴러 장르 작품 오디션에 지원했습니다. 대학생들이 제작하는 단편영화 오디션 기회조차 얻기 어려웠던 제가 장편독립영화에 캐스팅된 그 순간이 아직도 기억나요.',
  },
  {
    label: 'CASE 3',
    title: '캐릭터 포지션 반영 → 오디션 연락 증가',
    quote: '캐릭터 포지셔닝 결과를 바탕으로 프로필과 연기영상을 재정비했어요. 이후 혼자서 여러 차례 새로운 프로필을 촬영했지만, 캐릭터 포지셔닝 클래스에서 대표님과 함께 제작한 프로필에서 가장 많은 오디션 연락을 받고 있어요.',
  },
] as const;

export default function StudentChangesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMedia = window.matchMedia('(max-width: 560px)');
    const syncPreference = () => {
      setReduceMotion(motionMedia.matches);
      setMobileView(mobileMedia.matches);
    };
    syncPreference();
    motionMedia.addEventListener('change', syncPreference);
    mobileMedia.addEventListener('change', syncPreference);
    return () => {
      motionMedia.removeEventListener('change', syncPreference);
      mobileMedia.removeEventListener('change', syncPreference);
    };
  }, []);

  useEffect(() => {
    if (!mobileView || !autoPlay || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % CASES.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [autoPlay, mobileView, reduceMotion]);

  function move(direction: 'prev' | 'next') {
    setActiveIndex((current) => direction === 'next'
      ? (current + 1) % CASES.length
      : (current - 1 + CASES.length) % CASES.length);
    trackEvent('student_case_navigate', { direction });
  }

  function select(index: number) {
    setActiveIndex(index);
    trackEvent('student_case_navigate', { direction: 'dot', case_number: index + 1 });
  }

  return (
    <section className={`${styles.sheet} ${styles.changeSection}`} aria-labelledby="student-changes-title">
      <div className={styles.changeHeading}>
        <div>
          <p className={styles.sectionEyebrow}>REAL CHANGES</p>
          <h2 id="student-changes-title" className={`${styles.h2} ${styles.changeTitle}`}>캐릭터 포지셔닝 이후, 실제 수강생들의 변화</h2>
        </div>
        {mobileView && !reduceMotion ? (
          <button
            type="button"
            className={styles.autoPlayButton}
            onClick={() => setAutoPlay((playing) => !playing)}
            aria-pressed={!autoPlay}
          >
            {autoPlay ? '자동 넘김 일시정지' : '자동 넘김 재생'}
          </button>
        ) : null}
      </div>

      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {CASES.map((item) => (
            <article key={item.label} className={styles.changeCard} aria-hidden={mobileView && CASES[activeIndex] !== item}>
              <span className={styles.caseLabel}>{item.label}</span>
              <h3>{item.title}</h3>
              <blockquote>“{item.quote}”</blockquote>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.carouselControls}>
        <button type="button" onClick={() => move('prev')} aria-label="이전 수강생 사례">←</button>
        <div className={styles.carouselDots} aria-label="수강생 사례 선택">
          {CASES.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={index === activeIndex ? styles.carouselDotActive : ''}
              onClick={() => select(index)}
              aria-label={`${index + 1}번 사례 보기`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <button type="button" onClick={() => move('next')} aria-label="다음 수강생 사례">→</button>
      </div>
    </section>
  );
}
