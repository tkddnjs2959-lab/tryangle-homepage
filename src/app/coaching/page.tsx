import Image from 'next/image';
import pageStyles from '../page.module.css';
import TrackedLink from '../TrackedLink';
import ContactForm from '../ContactForm';
import styles from './coaching.module.css';
import { PRICING, TRAINER } from './content';

/**
 * 수강생 전용 숨김 랜딩페이지.
 *
 * 상단/하단 메뉴 어디에도 이 경로로 가는 링크를 두지 않는다 — 직접 링크로만
 * 접근한다. noindex 로 검색엔진 수집도 막는다. robots.txt 에는 이 경로를
 * 적지 않는다 — robots.txt 는 공개 파일이라 거기 적으면 오히려
 * "여기 숨은 페이지 있음"을 광고하는 꼴이 된다.
 */
export const metadata = {
  title: '주아쌤의 2:1 매체연기 수업',
  robots: { index: false, follow: false, nocache: true },
};

export default function CoachingPage() {
  return (
    <>
      <main className={pageStyles.page}>
        <section className={`${pageStyles.hero} ${styles.coachHero}`}>
          <h1 className={styles.coachTitle}>주아쌤의 2:1 매체연기 수업</h1>
        </section>
        {/* ---------- 레슨별 수강료 ---------- */}
        <section id="pricing" className={`${pageStyles.sheet} ${styles.featuredPricing}`}>
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
          <h2 className={pageStyles.h2}>상담 신청</h2>
          <p className={pageStyles.body}>
            신청 내용을 확인한 뒤 상담 가능 일정과 수업 진행 방법을 안내해드립니다.
          </p>
          <ContactForm
            programLabel="주아쌤의 2:1 매체연기 수업"
            hideCoachingAvailability
            kakaoInquiryUrl="https://open.kakao.com/o/sVHJE6Ui"
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
