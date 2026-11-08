import Image from 'next/image';
import pageStyles from '../page.module.css';
import TrackedLink from '../TrackedLink';
import ContactForm from '../ContactForm';
import styles from './coaching.module.css';
import { PRICING_1_TO_1, PRICING_2_TO_1, TRAINER } from './content';

export default function CoachingPage() {
  return (
    <>
      <main className={`${pageStyles.page} ${styles.themePage}`} data-coaching-theme="dark">
        <section className={`${pageStyles.hero} ${styles.coachHero}`}>
          <Image
            src="/jua-t-logo.png"
            alt="JAU T 주아쌤 로고"
            width={1240}
            height={1240}
            sizes="(max-width: 560px) 190px, 248px"
            className={styles.coachLogo}
            priority
          />
          <h1 className={styles.coachTitle}>주아쌤 매체연기 레슨</h1>
          <p className={styles.audienceNote}>*본 레슨은 성인(만 19세 이상)만을 대상으로 합니다.</p>
        </section>
        {/* ---------- 레슨별 수강료 ---------- */}
        <section id="pricing" className={`${pageStyles.sheet} ${styles.featuredPricing}`}>
          <div className={styles.priceGroup}>
            <h2 className={styles.priceGroupHeading}>2:1 레슨</h2>
            <div className={styles.priceGrid}>
              {PRICING_2_TO_1.map((p, index) => (
                <div key={p.freq} className={`${styles.priceCard} ${index === 0 ? styles.priceCardLight : styles.priceCardDark}`}>
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
          <div className={`${styles.priceGroup} ${styles.priceGroupSolo}`}>
            <h2 className={styles.priceGroupHeading}>1:1 레슨</h2>
            <div className={styles.priceGrid}>
              {PRICING_1_TO_1.map((p) => (
                <div key={p.freq} className={`${styles.priceCard} ${styles.priceCardSolo}`}>
                  <strong className={styles.priceFrequency}>{p.freq} 레슨</strong>
                  <div className={styles.priceSchedule}>
                    <span>월 총 {p.monthlyCount}회</span>
                    <span>회당 1시간 기준</span>
                  </div>
                  <div className={styles.priceAmounts}>
                    <b>{p.price}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 코치 이력 ---------- */}
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
            <Image
              src="/mentor.jpg"
              alt="이주아 연기트레이너"
              width={200}
              height={249}
              className={styles.profilePhoto}
            />
            <h2 className={styles.profileName}>{TRAINER.name}</h2>
            <p className={styles.profileTitle}>{TRAINER.title}</p>
          </div>
        </section>

        {/* ---------- 메인 페이지와 동일한 신청 폼 ---------- */}
        <section id="consultation" className={`${pageStyles.sheet} ${styles.applicationSection}`}>
          <h2 className={pageStyles.h2}>상담 예약</h2>
          <ContactForm
            programLabel="주아쌤 매체연기 레슨"
            hideCoachingAvailability
            hideGender
            bookingMode
            lessonTypeSelection
            kakaoInquiryUrl="https://pf.kakao.com/_mWxcMb"
          />
        </section>
      </main>

      <TrackedLink
        className={styles.stickyApply}
        href="#consultation"
        eventName="click_application_form"
        eventParams={{ placement: 'coaching_sticky' }}
      >
        신청하기
      </TrackedLink>

    </>
  );
}
