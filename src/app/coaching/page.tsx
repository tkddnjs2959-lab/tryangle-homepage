import Image from 'next/image';
import Link from 'next/link';
import { NEWS } from '../newsData';
import pageStyles from '../page.module.css';
import TrackedLink from '../TrackedLink';
import styles from './coaching.module.css';
import { BENEFITS, COACHING_AREAS, DIFFERENCE_FROM_GROUP_CLASS, FAQ, PRICING, TRAINER } from './content';

const KAKAO_URL = 'https://app.tryangle-official.co.kr/go/kakao?utm_source=homepage&utm_medium=owned&utm_campaign=coaching_cta&utm_content=coaching';

/** 콘텐츠 문자열의 '\n' 을 모바일에서만 줄바꿈으로 바꾼다 (데스크톱은 한 줄로 이어짐). */
function mobileLines(text: string) {
  return text.split('\n').map((part, i) =>
    i === 0 ? (
      <span key={part}>{part}</span>
    ) : (
      <span key={part}>
        {' '}
        <br className={styles.brM} />
        {part}
      </span>
    ),
  );
}

/**
 * 수강생 전용 숨김 랜딩페이지.
 *
 * 상단/하단 메뉴 어디에도 이 경로로 가는 링크를 두지 않는다 — 직접 링크로만
 * 접근한다. noindex 로 검색엔진 수집도 막는다. robots.txt 에는 이 경로를
 * 적지 않는다 — robots.txt 는 공개 파일이라 거기 적으면 오히려
 * "여기 숨은 페이지 있음"을 광고하는 꼴이 된다.
 */
export const metadata = {
  title: '1:1 매체연기 코칭 · TRY앵글',
  robots: { index: false, follow: false, nocache: true },
};

export default function CoachingPage() {
  return (
    <>
      {/* 기존 홈페이지와 동일한 헤더 (신청 폼 없이 카카오 문의로 통일) */}
      <header className={pageStyles.nav}>
        <div className={pageStyles.navInner}>
          <div className={pageStyles.logo}>
            <Image src="/logo.jpg" alt="TRY앵글" width={36} height={36} className={pageStyles.logoImg} priority />
            TRY앵글
          </div>
          <TrackedLink
            className={pageStyles.navKakao}
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            eventName="click_kakao_consult"
            eventParams={{ placement: 'coaching_header' }}
          >
            카카오 상담
          </TrackedLink>
        </div>
      </header>

      <main className={pageStyles.page}>
        {/* ---------- 히어로 ---------- */}
        <section className={pageStyles.hero}>
          <span className={styles.exclusiveTag}>캐릭터 포지셔닝 클래스 수료생 전용</span>
          <h1 className={pageStyles.h1}>1:1 매체연기 코칭</h1>
          <p className={pageStyles.heroLead}>
            TRY앵글 1:1 매체연기 코칭은
            <br />
            &lsquo;캐릭터 포지셔닝 클래스&rsquo;를 이수한 배우만{' '}
            <br className={styles.brM} />
            신청 가능한 후속 케어 프로그램입니다.
          </p>
          <p className={pageStyles.heroLead} style={{ marginTop: -18 }}>
            캐릭터와의 어울림이 &lsquo;오디션 기회&rsquo;를 만든다면,
            <span className={styles.gapM} aria-hidden="true" />
            <br className={styles.brD} />
            연기력은 그 기회를{' '}
            <br className={styles.brM} />
            &lsquo;캐스팅&rsquo;이라는 결과로 만드는 힘입니다.
          </p>
          <div className={pageStyles.heroActions}>
            <TrackedLink
              className={pageStyles.kakaoBtn}
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              eventName="click_kakao_consult"
              eventParams={{ placement: 'coaching_hero' }}
            >
              카카오톡으로 문의하기
            </TrackedLink>
          </div>
        </section>

        {/* ---------- 소개 ---------- */}
        <section className={pageStyles.sheet}>
          <h2 className={pageStyles.h2}>1:1 매체연기 코칭이란</h2>
          <p className={pageStyles.body}>
            <span className={styles.leadStrong}>TRY앵글의 1:1 매체연기 코칭은</span>
            <span className={styles.gapM} aria-hidden="true" />
            <br className={styles.brD} />
            배우가 오디션 기회를{' '}
            <br className={styles.brM} />
            &lsquo;캐스팅&rsquo;이라는 결과로 연결할 수 있도록,
            <br />
            연기의 완성도를 높이는 데 집중합니다.
          </p>
        </section>

        {/* ---------- 왜 1:1인가 ---------- */}
        <section className={pageStyles.sheet}>
          <h2 className={pageStyles.h2}>왜 1:1 코칭인가요?</h2>
          <p className={pageStyles.body}>
            배우마다 강점과 보완해야 할 부분, 그리고 목표는 모두 다릅니다.
            <br className={styles.brD} /> 그렇기 때문에 모든 배우에게 같은 방식으로 진행되는 수업보다,
            <br className={styles.brD} /> 배우 개개인에게 필요한 훈련을 맞춤형으로 설계하는 것이 더욱 중요합니다.
          </p>
          <p className={pageStyles.body}>
            TRY앵글은 배우의 현재 역량과 목표를 면밀히 분석한 뒤,
            <br className={styles.brD} /> 가장 필요한 훈련을 바탕으로 밀도 높은 1:1 맞춤형 코칭을 제공합니다.
            <span className={styles.gapM} aria-hidden="true" />
            <br className={styles.brD} />
            매체연기 심화 훈련부터 오디션 준비,
            <br />
            연기 스펙트럼 확장까지{' '}
            <span className={styles.gapM} aria-hidden="true" />
            배우의 성장 단계에 맞는
            <br />
            체계적인 코칭으로 실질적인 변화를 만들어갑니다.
          </p>
        </section>

        {/* ---------- 기존 클래스와의 차이 (원고 준비되면 노출) ---------- */}
        {DIFFERENCE_FROM_GROUP_CLASS && (
          <section className={pageStyles.sheet}>
            <h2 className={pageStyles.h2}>캐릭터 포지셔닝 클래스와의 차이</h2>
            <p className={pageStyles.body}>{DIFFERENCE_FROM_GROUP_CLASS}</p>
          </section>
        )}

        {/* ---------- 코칭 분야 ---------- */}
        <section className={pageStyles.sheet}>
          <h2 className={pageStyles.h2}>코칭 분야</h2>
          <ul className={pageStyles.list}>
            {COACHING_AREAS.map((a) => (
              <li key={a}>{mobileLines(a)}</li>
            ))}
          </ul>
        </section>

        {/* ---------- 코치 소개 (이 페이지 전용 · 연기트레이너 이력 중심) ---------- */}
        <section className={pageStyles.sheet}>
          <div className={styles.profileEyebrow}>
            <span className={pageStyles.eyebrowSm}>이주아 대표 | 연기트레이너 프로필</span>
          </div>

          <div className={`${pageStyles.mentorHead} ${styles.mentorHeadCenter}`}>
            <Image
              src="/mentor.jpg"
              alt="이주아 · TRY앵글 대표"
              width={200}
              height={249}
              className={pageStyles.mentorPhoto}
            />
            <div>
              <h2 className={pageStyles.h2}>{TRAINER.name}</h2>
              <p className={pageStyles.bodyMuted}>{TRAINER.title}</p>
            </div>
          </div>

          <h3 className={pageStyles.h3}>학력</h3>
          <ul className={pageStyles.list}>
            {TRAINER.education.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>

          <h3 className={pageStyles.h3}>연기트레이너 대표 이력</h3>
          <ul className={pageStyles.list}>
            {TRAINER.trainerCareer.map((c) => (
              <li key={c}>{mobileLines(c)}</li>
            ))}
          </ul>

          <h3 className={pageStyles.h3}>배우 활동</h3>
          <ul className={pageStyles.list}>
            {TRAINER.actingCareer.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <h3 className={pageStyles.h3}>관련 뉴스</h3>
          <ul className={pageStyles.newsList}>
            {NEWS.map((n) => (
              <li key={n.url}>
                <a href={n.url} target="_blank" rel="noopener noreferrer">
                  <span className={pageStyles.newsMedia}>[{n.media}]</span> {n.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- 수업 안내 ---------- */}
        <section className={pageStyles.sheet}>
          <h2 className={pageStyles.h2}>수업 안내</h2>
          <div className={pageStyles.stats}>
            <div className={pageStyles.stat}>
              <b>1:1 맞춤형</b>
              <span>코칭 방식</span>
            </div>
            <div className={pageStyles.stat}>
              <b>회당 50분</b>
              <span>진행 시간</span>
            </div>
          </div>
        </section>

        {/* ---------- 비용 ---------- */}
        <section className={pageStyles.sheet}>
          <h2 className={pageStyles.h2}>비용</h2>
          <div className={styles.priceGrid}>
            {PRICING.map((p) => (
              <div key={p.freq} className={styles.priceCard}>
                <span>{p.freq}</span>
                <b>{p.price}</b>
              </div>
            ))}
          </div>
          <div className={pageStyles.callout} style={{ marginTop: 20 }}>
            💡 본 프로그램은 소수 인원으로 운영되며,
            <br />
            <span className={styles.calloutIndent}>
              보다 밀도 높은 코칭을 위해{' '}
              <br className={styles.brM} />
              정원에 제한을 두고 있습니다.
            </span>
          </div>
        </section>

        {/* ---------- 기존 수강생 전용 혜택 (원고 준비되면 노출) ---------- */}
        {BENEFITS.length > 0 && (
          <section className={pageStyles.sheet}>
            <h2 className={pageStyles.h2}>수료생 전용 혜택</h2>
            <ul className={pageStyles.list}>
              {BENEFITS.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- FAQ (원고 준비되면 노출) ---------- */}
        {FAQ.length > 0 && (
          <section className={pageStyles.sheet}>
            <h2 className={pageStyles.h2}>자주 묻는 질문</h2>
            {FAQ.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <p className={styles.faqQ}>Q. {f.q}</p>
                <p className={styles.faqA}>A. {f.a}</p>
              </div>
            ))}
          </section>
        )}

        {/* ---------- 신청 방법 ---------- */}
        <section className={pageStyles.sheet}>
          <h2 className={pageStyles.h2}>신청 방법</h2>
          <p className={pageStyles.body}>
            1:1 매체연기 코칭에 관심 있으신 분들은{' '}
            <br className={styles.brM} />
            카카오톡 채널을 통해
            <br />
            &lsquo;개인 레슨 신청 희망&rsquo;이라고 메시지를 남겨주세요.
          </p>
          <p className={pageStyles.body}>
            신청해주신 배우분들에 한해 개별 상담을 진행하며,
            <br />
            현재 연기 역량과 목표를 바탕으로 코칭 방향 및 일정을 함께 조율합니다.
          </p>

          <TrackedLink
            className={`${pageStyles.kakaoBtn} ${pageStyles.kakaoBtnWide}`}
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            eventName="click_kakao_consult"
            eventParams={{ placement: 'coaching_application_section' }}
          >
            TRY앵글 공식 카카오톡 채널 바로가기
          </TrackedLink>
        </section>
      </main>

      <footer className={pageStyles.footer}>
        <div className={pageStyles.footerBrand}>
          <Image src="/logo.jpg" alt="TRY앵글" width={22} height={22} className={pageStyles.footerLogo} />
          ⓒ Artist Branding Company TRY앵글
        </div>
        <Link href="/insights">배우 인사이트</Link>
        <TrackedLink
          href={KAKAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          eventName="click_kakao_consult"
          eventParams={{ placement: 'coaching_footer' }}
        >
          카카오톡 채널
        </TrackedLink>
      </footer>
    </>
  );
}
