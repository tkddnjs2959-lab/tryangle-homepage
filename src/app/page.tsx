import Image from 'next/image';
import { NEWS } from './newsData';
import styles from './page.module.css';
import TrackedLink from './TrackedLink';
import ContactForm from './ContactForm';
import ConsultationSummaryCard from './ConsultationSummaryCard';
import StudentChangesCarousel from './StudentChangesCarousel';
import PageMotion from './PageMotion';

const KAKAO_URL = 'https://app.tryangle-official.co.kr/go/kakao?utm_source=homepage&utm_medium=owned&utm_campaign=homepage_cta&utm_content=main';

const PROCESS = [
  {
    n: '01',
    title: '이미지 심층 분석',
    body: '퍼스널 리서치를 바탕으로 배우의 현재 외적 이미지를 객관적으로 분석합니다.',
  },
  {
    n: '02',
    title: '캐릭터 포지션 적합도 분석',
    body: (
      <>
        이미지 심층 분석 결과와 클래스 진행 과정에서 확인한 배우의 특성, 보이스 컬러, 매력, 개성 등을 바탕으로
        <br className={styles.brDesktop} />
        배우에게 가장 적합한 캐릭터 포지션을 탐색합니다.
      </>
    ),
  },
  {
    n: '03',
    title: '캐릭터 포지션 선정',
    body: '배우에게 가장 경쟁력 있는 캐릭터 포지션을 선정합니다.',
  },
  {
    n: '04',
    title: '비주얼 브랜딩',
    body: '캐릭터 포지션이 효과적으로 전달될 수 있도록 프로필 비주얼 전략을 수립합니다.',
  },
  {
    n: '05',
    title: '캐릭터 R&D',
    body: (
      <>
        캐릭터 포지션이 연기영상에서도 일관되게 전달될 수 있도록 캐릭터 포지션에 적합한 모놀로그를
        <br className={styles.brMobile} />
        {' '}선정하고, 배우에게 맞게 디벨롭하여 연기영상을 완성합니다.
      </>
    ),
  },
];

const CAREER = [
  { text: '세종대학교 대학원 예술학 박사 수료 (연기 전공)' },
  { text: '세종대학교 대학원 예술학 석사 (연기 전공)' },
  { text: '배우 브랜딩 전문기업 TRY앵글 CEO' },
  { text: '『퍼스널브랜딩 바이블』 저자' },
  { text: '한국퍼스널브랜딩연구소 콘텐츠개발본부 책임연구원' },
  { text: 'SM엔터테인먼트 소속생 연기 지도' },
  {
    text: '연기 지도 수강생 소속사 다수 합격',
    note: '(9아토 엔터테인먼트, MYM 엔터테인먼트, 모드하우스 등)',
  },
  {
    text: '주요 연극영화과 졸업생 매체연기 지도',
    note: '(중앙대, 한양대, 단국대, 동덕여대, 성신여대, 서울예대 등)',
  },
  { text: '경기대학교 학점은행제 출강', note: '(뮤지컬제작실습 드라마 코치)' },
  { text: '본스타트레이닝센터 연기트레이너' },
  { text: '티아이연기학원 연기트레이너' },
];

export default function Home() {
  return (
    <>
      <PageMotion />
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <Image src="/logo.jpg" alt="TRY앵글" width={36} height={36} className={styles.logoImg} priority />
            TRY앵글
          </div>
        </div>
      </header>

      <main className={styles.homeLayout}>
        <div className={styles.page}>
        <section className={`${styles.hero} ${styles.homeHero}`} data-motion="hero">
          <div className={styles.heroBrand}>
            <Image
              src="/logo.jpg"
              alt="TRY앵글"
              width={48}
              height={48}
              className={styles.heroLogo}
              priority
            />
            <p className={styles.eyebrow}>TRY앵글 시그니처 클래스</p>
          </div>
          <h1 className={`${styles.h1} ${styles.homeHeroTitle}`}>
            캐릭터 포지셔닝 클래스
          </h1>
        </section>

        <section className={`${styles.sheet} ${styles.hookSection}`} data-motion="hook">
          <div className={styles.hookGrid}>
            <div className={styles.hookQuestion}>
              <p className={styles.sectionEyebrow}>WHY POSITIONING MATTERS</p>
              <h2 className={styles.hookTitle}>
                <span>왜 어떤 배우는</span>
                <span>오디션 기회를 얻고,</span>
                <span>어떤 배우는 얻지 못할까요?</span>
              </h2>
              <p className={styles.hookBody}>
                <span className={styles.hookBodyDesktop}>
                  <span>오디션 기회는 무작정 많이 지원한다고 생기지 않습니다.</span>
                  <span>배우로서 자신에게 가장 경쟁력 있는</span>
                  <span>캐릭터 포지션을 정확히 알고, 그 포지션을</span>
                  <span>필요로 하는 작품의 오디션을 전략적으로 공략해야 합니다.</span>
                </span>
                <span className={styles.hookBodyMobile}>
                  <span>오디션 기회는 무작정 많이 지원한다고</span>
                  <span>생기지 않습니다.</span>
                  <span className={styles.hookBodyParagraph}>배우로서 자신에게 가장 경쟁력 있는</span>
                  <span>캐릭터 포지션을 정확히 알고,</span>
                  <span>그 포지션을 필요로 하는 작품의 오디션을</span>
                  <span>전략적으로 공략해야 합니다.</span>
                </span>
              </p>
            </div>

            <div className={styles.hookResults}>
              <h3 className={styles.resultTitle}>캐릭터 포지셔닝을 통해 얻게 되는 3가지 결과</h3>
              <ol className={styles.resultList}>
                <li>
                  <span className={styles.resultNum} aria-hidden="true">01</span>
                  <span className={styles.resultCopy}>
                    <span className={styles.resultPrefix}>오디션 기회로 연결될 수 있는</span>
                    <strong>나만의 캐릭터 포지션 도출</strong>
                  </span>
                </li>
                <li>
                  <span className={styles.resultNum} aria-hidden="true">02</span>
                  <span className={styles.resultCopy}>
                    <span className={styles.resultPrefix}>자신의 캐릭터 포지션을 필요로 하는</span>
                    <strong>오디션 선별 기준 정립</strong>
                  </span>
                </li>
                <li>
                  <span className={styles.resultNum} aria-hidden="true">03</span>
                  <span className={styles.resultCopy}>
                    <span className={styles.resultPrefix}>오디션 실물미팅 가능성을 높이는</span>
                    <strong>프로필·연기영상 구축</strong>
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <StudentChangesCarousel />

        <section className={styles.sheet} data-motion="process">
          <h2 className={styles.h2}>‘캐릭터 포지셔닝’은 어떻게 진행될까요?</h2>
          <p className={styles.bodyMuted}>
            TRY앵글 캐릭터 포지셔닝 프로세스는
            <br className={styles.brMobile} />
            {' '}크게 5단계로 구성되어 있습니다.
          </p>
          <ol className={styles.steps}>
            {PROCESS.map((p) => (
              <li key={p.n} className={styles.step}>
                <span className={styles.stepNum}>{p.n}</span>
                <div>
                  <h3 className={styles.stepTitle}>{p.title}</h3>
                  <p className={styles.stepBody}>{p.body}</p>
                </div>
              </li>
            ))}
          </ol>

        </section>

        <section id="mentor" className={styles.sheet} data-motion="mentor">
          <p className={styles.body}>
            이 과정을 이끄는 캐릭터 포지셔닝 멘토 이주아는
            <br className={styles.brMobile} />
            <br className={styles.brDesktop} />
            <strong>‘브랜딩’과 ‘연기’ 두 분야의 전문 지식을 바탕으로</strong>
            <br className={styles.brMobile} />
            {' '}감이 아닌, <strong>근거 있는 캐릭터 포지셔닝을 진행</strong>합니다.
          </p>
          <div className={styles.sectionDivider} aria-hidden="true" />

          <div className={styles.mentorHead}>
            <Image
              src="/mentor.jpg"
              alt="이주아 · TRY앵글 대표 브랜딩 어드바이저"
              width={200}
              height={249}
              className={styles.mentorPhoto}
            />
            <div>
              <span className={styles.eyebrowSm}>캐릭터 포지셔닝 멘토</span>
              <h2 className={styles.h2}>이주아</h2>
              <p className={styles.bodyMuted}>TRY앵글 대표 브랜딩 어드바이저</p>
            </div>
          </div>

          <h3 className={styles.h3}>주요 전문 분야</h3>
          <p className={styles.body}>배우 캐릭터 포지셔닝</p>

          <h3 className={styles.h3}>대표 이력</h3>
          <ul className={styles.list}>
            {CAREER.map((c) => (
              <li key={c.text}>
                <span>{c.text}</span>
                {c.note && <span className={styles.careerNote}>{c.note}</span>}
              </li>
            ))}
          </ul>

          <h3 className={styles.h3}>관련 뉴스</h3>
          <ul className={styles.newsList}>
            {NEWS.map((n) => (
              <li key={n.url}>
                <a href={n.url} target="_blank" rel="noopener noreferrer">
                  <span className={styles.newsMedia}>[{n.media}]</span> {n.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.sheet} data-motion="method">
          <h2 className={styles.h2}>진행 방식</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <b>12주</b>
              <span>총 과정 기간</span>
            </div>
            <div className={styles.stat}>
              <b>주 1회 · 90분</b>
              <span>월 4회 진행</span>
            </div>
            <div className={styles.stat}>
              <b>최대 4명</b>
              <span>소수 정예 정원</span>
            </div>
          </div>

          <div className={styles.callout}>
            <p className={styles.calloutTitle}>클래스 운영 스케줄</p>
            💡 캐릭터 포지셔닝 클래스(그룹)는
            <br className={styles.brMobile} />
            {' '}연 4회만 오픈하는 클래스입니다.
            <table className={styles.schedule}>
              <tbody>
                <tr>
                  <td>화요일 클래스</td>
                  <td>19:00 ~ 20:30 (90분)</td>
                </tr>
                <tr>
                  <td>토요일 클래스</td>
                  <td>11:00 ~ 12:30 (90분)</td>
                </tr>
              </tbody>
            </table>

            <p className={styles.calloutTitle} style={{ marginTop: 20 }}>캐릭터 포지셔닝 클래스 8기 개강일</p>
            <table className={styles.schedule}>
              <tbody>
                <tr>
                  <td>화요일반</td>
                  <td>2026.09.08 (화)</td>
                </tr>
                <tr>
                  <td>토요일반</td>
                  <td>2026.09.12 (토)</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.calloutSub}>※ 9기는 12월 중순 개강 예정입니다.</p>
          </div>
        </section>

        <section className={styles.sheet} data-motion="cost">
          <h2 className={styles.h2}>비용 안내</h2>
          <div className={styles.priceBox}>
            <div className={styles.priceOld}>정가 · 65만원</div>
            <div className={styles.priceNew}>
              8기 한정가 · <b>45만원</b>
              <em>8기 모집 기간 한정</em>
            </div>
          </div>
          <p className={styles.bodyMuted}>
            현재 TRY앵글 캐릭터 포지셔닝 클래스는
            <br className={styles.brMobile} />
            {' '}8기 상담 및 신청이 진행 중입니다.
            <br />
            <br className={styles.brMobile} />
            정원 마감 시 모집이 조기 종료될 수 있으니,
            <br className={styles.brMobile} />
            {' '}상담을 원하시는 경우 미리 신청해주세요.
          </p>
        </section>

        <section className={styles.sheet} data-motion="consultation">
          <h2 className={styles.h2}>지금부터 정확히 알고, 전략적으로 공략하세요!</h2>
          <p className={styles.bodyMuted}>상담 신청 내용을 확인한 뒤, 상담 가능 일정과 진행 방법을 안내해드립니다.</p>

          <div className={styles.ctaDivider} aria-hidden="true" />
          <p className={styles.visitNote}>
            <span className={styles.visitNoteIcon}>💡</span>
            <span>
              방문상담을 희망하시는 경우,
              <br className={styles.brMobile} />
              아래 내용을 작성하여 메시지를 보내주세요.
            </span>
          </p>

          <ContactForm />
        </section>
        </div>
        <ConsultationSummaryCard variant="desktop" />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Image src="/logo.jpg" alt="TRY앵글" width={22} height={22} className={styles.footerLogo} />
          ⓒ Artist Branding Company TRY앵글
        </div>
        <TrackedLink
          href={KAKAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          eventName="click_kakao_consult"
          eventParams={{ placement: 'main_footer' }}
        >
          카카오톡 채널
        </TrackedLink>
      </footer>
    </>
  );
}
