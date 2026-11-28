import Image from 'next/image';
import pageStyles from '../page.module.css';
import TrackedLink from '../TrackedLink';
import ContactForm from '../ContactForm';
import styles from './coaching.module.css';
import { HOMEPAGE_TEAM_TRAINER, LEAD_TRAINER, PRICING_1_TO_1, PRICING_2_TO_1, TEAM_TRAINER } from './content';

type CoachingPageProps = {
  profileVariant?: 'coaching' | 'homepage';
};

export default function CoachingPage({ profileVariant = 'coaching' }: CoachingPageProps) {
  const isHomepage = profileVariant === 'homepage';

  return (
    <>
      <main className={`${pageStyles.page} ${styles.themePage}`} data-coaching-theme="dark">
        <section className={`${pageStyles.hero} ${styles.coachHero}`}>
          <Image
            src="/jua-t-logo.png"
            alt="JAU T 주아T 로고"
            width={1240}
            height={1240}
            sizes="(max-width: 560px) 190px, 248px"
            className={styles.coachLogo}
            priority
          />
          <h1 className={styles.coachTitle}>주아T 매체연기 레슨</h1>
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
                    <span>회당 1시간</span>
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
            <div className={`${styles.priceGrid} ${styles.soloPriceGrid}`}>
              {PRICING_1_TO_1.map((p) => (
                <div key={p.trainer} className={`${styles.priceCard} ${styles.priceCardSolo}`}>
                  <div className={styles.priceTrainerBlock}>
                    <span className={styles.priceTrainer}>{p.trainer}</span>
                    <strong className={styles.priceFrequency}>{p.freq} 레슨</strong>
                  </div>
                  <div className={styles.priceSchedule}>
                    <span>월 총 {p.monthlyCount}회</span>
                    <span>회당 1시간</span>
                  </div>
                  <div className={styles.priceAmounts}>
                    <b>{p.price}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 주아T TEAM ---------- */}
        <section id="profile" className={`${pageStyles.sheet} ${styles.teamSection}`}>
          <h2 className={styles.teamHeading}>주아T TEAM</h2>

          <article className={styles.profileLayout}>
            <div className={styles.profileDetails}>
              <h3 className={styles.profileHeading}>대표 연기트레이너</h3>
              <p className={styles.teamTrainerName}>이주아 연기트레이너</p>
              <div className={styles.profileTimeline}>
                <div className={styles.profileGroup}>
                  <h4>학력</h4>
                  <ul>{LEAD_TRAINER.education.map((e) => <li key={e}>{e}</li>)}</ul>
                </div>
                <div className={`${styles.profileGroup} ${styles.careerGroup}`}>
                  <h4>{isHomepage ? '대표 이력' : '연기트레이너 대표 이력'}</h4>
                  <ul>{LEAD_TRAINER.trainerCareer.map((c) => (
                    <li key={c}>{c.split('\n').map((part, index) => <span key={part}>{index > 0 && <br />}{part}</span>)}</li>
                  ))}</ul>
                </div>
                <div className={styles.profileGroup}>
                  <h4>배우 활동</h4>
                  <ul>{LEAD_TRAINER.actingCareer.map((c) => <li key={c}>{c}</li>)}</ul>
                </div>
              </div>
            </div>
            <div className={styles.profilePhotoColumn}>
              <Image
                src={isHomepage ? '/trainer-lee-jua-home.jpg' : '/mentor.jpg'}
                alt="이주아 대표 연기트레이너"
                width={isHomepage ? 873 : 200}
                height={isHomepage ? 1049 : 249}
                sizes="(max-width: 560px) 112px, 245px"
                className={styles.profilePhoto}
              />
            </div>
          </article>

          <div className={styles.teamDivider} aria-hidden="true"><span /></div>

          <article className={`${styles.profileLayout} ${styles.teamTrainerProfile}`}>
            <div className={styles.profileDetails}>
              <h3 className={styles.profileHeading}>소속 연기트레이너</h3>
              <p className={styles.teamTrainerName}>김유리 연기트레이너</p>
              {isHomepage ? (
                <div className={styles.profileTimeline}>
                  <div className={styles.profileGroup}>
                    <h4>학력</h4>
                    <ul>{HOMEPAGE_TEAM_TRAINER.education.map((education) => <li key={education}>{education}</li>)}</ul>
                  </div>
                  <div className={styles.profileGroup}>
                    <h4>대표 이력</h4>
                    <ul>{HOMEPAGE_TEAM_TRAINER.trainerCareer.map((career) => <li key={career}>{career}</li>)}</ul>
                  </div>
                  <div className={styles.profileGroup}>
                    <h4>배우 활동</h4>
                    <ul>{HOMEPAGE_TEAM_TRAINER.actingCareer.map((career) => <li key={career}>{career}</li>)}</ul>
                  </div>
                </div>
              ) : (
                <ul className={styles.teamTrainerCareer}>
                  {TEAM_TRAINER.career.map((career) => <li key={career}>{career}</li>)}
                </ul>
              )}
            </div>
            <div className={styles.profilePhotoColumn}>
              <Image
                src={TEAM_TRAINER.photo}
                alt={`${TEAM_TRAINER.name} 소속 연기트레이너`}
                width={2633}
                height={3224}
                sizes="(max-width: 560px) 112px, 245px"
                className={`${styles.profilePhoto} ${styles.teamTrainerPhoto}`}
              />
            </div>
          </article>
        </section>

        {/* ---------- 메인 페이지와 동일한 신청 폼 ---------- */}
        <section id="consultation" className={`${pageStyles.sheet} ${styles.applicationSection}`}>
          <h2 className={pageStyles.h2}>상담 예약</h2>
          <ContactForm
            programLabel="주아T 매체연기 레슨"
            hideCoachingAvailability
            hideGender
            bookingMode
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
