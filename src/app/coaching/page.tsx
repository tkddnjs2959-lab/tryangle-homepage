import Image from 'next/image';
import pageStyles from '../page.module.css';
import TrackedLink from '../TrackedLink';
import ContactForm from '../ContactForm';
import styles from './coaching.module.css';
import { PRICING, TRAINER } from './content';
import { KAKAO_CHANNEL_PROFILE_URL } from '@/lib/external-links';

export const metadata = {
  title: '주아쌤의 매체연기 레슨',
  robots: { index: false, follow: false, nocache: true },
};

export default function CoachingPage() {
  return (
    <>
      <main className={pageStyles.page}>
        <section className={`${pageStyles.hero} ${styles.coachHero}`}>
          <h1 className={styles.coachTitle}>주아쌤의 매체연기 레슨</h1>
          <p className={styles.audienceNote}>이 레슨은 성인 대상으로 합니다.</p>
        </section>
        <section id="pricing" className={`${pageStyles.sheet} ${styles.featuredPricing}`}>
          <h2 className={styles.pricingHeading}>레슨비</h2>
          <div className={styles.priceGroups}>
            <div className={styles.priceGroup}>
              <h3 className={styles.groupHeading}>2:1 그룹 레슨</h3>
              <div className={styles.priceGrid}>
                {PRICING.map((p) => (
                  <div key={p.freq} className={styles.priceCard}>
                    <strong className={styles.priceFrequency}>{p.freq} 레슨</strong>
                    <div className={styles.priceSchedule}>
                      <span>월 총 {p.monthlyCount}회</span>
                      <span>회당 1시간 기준</span>
                    </div>
                    <div className={styles.priceAmounts}>
                      <del>정가 {p.original}</del>
                      <b>{p.price}</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.priceGroupOne}>
              <h3 className={styles.groupHeading}>1:1 개인 레슨</h3>
              <div className={styles.individualPrice}>
                <span>주 1회 · 월 4회 · 회당 1시간</span>
                <b>월 25만원</b>
              </div>
            </div>
          </div>
        </section>
        <section id="profile" className={`${pageStyles.sheet} ${styles.profileLayout}`}>
          <div className={styles.profileDetails}>
            <h2 className={`${pageStyles.h2} ${styles.profileHeading}`}>이력 사항</h2>
            <div className={styles.profileTimeline}>
              <div className={styles.profileGroup}>
                <h3>학력</h3>
                <ul>{TRAINER.education.map((e) => <li key={e}>{e}</li>)}</ul>
              </div>
              <div className={`${styles.profileGroup} ${styles.careerGroup}`}>
                <h3>연기트레이너 대표 이력</h3>
                <ul>{TRAINER.trainerCareer.map((c) => (
                  <li key={c}>{c.split('\n').map((part, index) => <span key={part}>{index > 0 && <br />}{part}</span>)}</li>
                ))}</ul>
              </div>
              <div className={styles.profileGroup}>
                <h3>배우 활동</h3>
                <ul>{TRAINER.actingCareer.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          </div>
          <div className={styles.profilePhotoColumn}>
            <Image src="/mentor.jpg" alt="이주아 연기트레이너" width={200} height={249} className={styles.profilePhoto} />
            <h2 className={styles.profileName}>{TRAINER.name}</h2>
            <p className={styles.profileTitle}>{TRAINER.title}</p>
          </div>
        </section>
        <section id="consultation" className={`${pageStyles.sheet} ${styles.applicationSection}`}>
          <h2 className={pageStyles.h2}>레슨 예약</h2>
          <p className={pageStyles.body}>희망하는 요일과 시간을 남겨주시면 확인 후 레슨 일정을 안내해드립니다.</p>
          <ContactForm
            formName="coaching_lesson_booking"
            successPlacement="coaching_lesson_booking_success"
            consultationLabel="레슨 예약"
            programLabel="주아쌤의 매체연기 레슨"
            kakaoUrl={KAKAO_CHANNEL_PROFILE_URL}
          />
        </section>
      </main>
      <TrackedLink
        className={styles.stickyApply}
        href="#consultation"
        eventName="click_application_form"
        eventParams={{ placement: 'coaching_sticky' }}
      >
        레슨 예약
      </TrackedLink>
    </>
  );
}
