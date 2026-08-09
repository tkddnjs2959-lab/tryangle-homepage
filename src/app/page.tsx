import Image from 'next/image';
import styles from './page.module.css';

const KAKAO_URL = 'http://pf.kakao.com/_mWxcMb/chat';

const PROCESS = [
  {
    n: '01',
    title: '이미지 심층 분석',
    body: '퍼스널 리서치를 바탕으로 배우의 내·외적 이미지를 객관적으로 분석합니다.',
  },
  {
    n: '02',
    title: '캐릭터 포지션 적합도 분석',
    body: '이미지 심층 분석 결과와 클래스 진행 과정에서 확인한 배우의 특성(보이스 컬러, 매력, 개성 등)을 바탕으로 배우에게 가장 적합한 캐릭터 포지션을 탐색합니다.',
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
    body: '캐릭터 포지션이 연기영상에서도 일관되게 전달될 수 있도록 캐릭터 포지션에 적합한 모놀로그를 선정하고, 배우에게 맞게 디벨롭하여 연기영상을 완성합니다.',
  },
];

const CAREER = [
  '세종대학교 대학원 예술학 박사 수료 (연기 전공)',
  '세종대학교 대학원 예술학 석사 (연기 전공)',
  '배우 브랜딩 전문기업 TRY앵글 CEO',
  '도서 『퍼스널브랜딩 바이블』 저자',
  '한국퍼스널브랜딩연구소 콘텐츠개발본부 책임연구원',
  'SM엔터테인먼트 소속생 연기 지도',
  '본스타트레이닝센터 연기트레이너',
];

const NEWS = [
  { media: '텐아시아', title: '아티스트 브랜딩 컴퍼니 TRY앵글, 배우 브랜딩 시스템 고도화 추진', url: 'https://www.tenasia.co.kr/article/2023050398274' },
  { media: 'MK스포츠', title: '배우 컨설팅 기업 ‘TRY앵글’, 아티스트 브랜딩 컴퍼니로 새 출발', url: 'https://www.mksports.co.kr/news/entertain/10622411' },
  { media: '텐아시아', title: '배우 컨설팅 전문기업 ‘트라이앵글’, 신인배우 4인 라인업 추가 공개', url: 'https://www.tenasia.co.kr/article/2022070104014' },
  { media: '이데일리', title: '이주아 트라이앵글 CEO, 본격 배우 컨설팅 돌입', url: 'https://www.edaily.co.kr/news/read?newsId=01266086632262008&mediaCodeNo=258' },
  { media: 'MK스포츠', title: '‘트라이앵글’ CEO 배우 이주아 “연예계 새로운 신인배우 양성 시스템 도입할 것”', url: 'https://www.mksports.co.kr/news/entertain/10175753' },
  { media: '이데일리', title: '캐스팅디렉터 김용곤, 배우컨설팅 기업 \'트라이앵글\' 합류', url: 'https://www.edaily.co.kr/news/read?newsId=01125046629279176&mediaCodeNo=258' },
  { media: '텐아시아', title: '배우 이주아 사업가 변신, 배우 컨설팅 전문기업 ‘트라이앵글’ 설립 추진', url: 'https://www.tenasia.co.kr/article/2021112662554' },
];

export default function Home() {
  return (
    <>
      {/* ---------- 헤더 ---------- */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <Image src="/logo.jpg" alt="TRY앵글" width={36} height={36} className={styles.logoImg} priority />
            TRY앵글
          </div>
          <a className={styles.navKakao} href={KAKAO_URL} target="_blank" rel="noopener noreferrer">
            카카오 상담
          </a>
        </div>
      </header>

      <main className={styles.page}>
        {/* ---------- 히어로 ---------- */}
        <section className={styles.hero}>
          <Image
            src="/logo.jpg"
            alt="TRY앵글"
            width={72}
            height={72}
            className={styles.heroLogo}
            priority
          />
          <p className={styles.eyebrow}>TRY앵글 시그니처 클래스</p>
          <h1 className={styles.h1}>캐릭터 포지셔닝 클래스</h1>
          <p className={styles.heroLead}>
            배우의 캐릭터 포지션이 캐스팅 디렉터에게 명확하게 전달될 때,
            <br />
            오디션 기회로 이어질 가능성은 더욱 높아집니다.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.kakaoBtn} href={KAKAO_URL} target="_blank" rel="noopener noreferrer">
              카카오톡으로 상담하기
            </a>
          </div>
        </section>

        {/* ---------- 소개 ---------- */}
        <section className={styles.sheet}>
          <h2 className={styles.h2}>캐릭터 포지셔닝 클래스란</h2>
          <p className={styles.body}>
            TRY앵글 &lsquo;캐릭터 포지셔닝 클래스&rsquo;는 배우의 내·외적 이미지를 객관적으로 분석하고,
            클래스 진행 과정에서 확인한 보이스 컬러와 매력, 개성까지 종합적으로 고려하여 배우에게
            가장 경쟁력 있는 캐릭터 포지션을 도출합니다.
          </p>
          <p className={styles.body}>
            이후, 해당 캐릭터 포지션이 프로필과 연기영상에 일관되게 반영되어 캐스팅 디렉터에게
            명확하게 전달될 수 있도록 배우와 함께 전략을 수립하고, 최적의 결과물을 만들어가는
            프로그램입니다.
          </p>
          <p className={styles.body}>
            이 과정을 이끄는 캐릭터 포지셔닝 멘토 이주아는 &lsquo;브랜딩&rsquo;과 &lsquo;연기&rsquo; 두 분야의
            전문 지식을 바탕으로 감이 아닌, 근거 있는 캐릭터 포지셔닝을 진행합니다.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <b>오디션 기회</b>
              <span>눈에 띄는 증가</span>
            </div>
            <div className={styles.stat}>
              <b>배역 캐스팅</b>
              <span>주 · 조연급 캐스팅</span>
            </div>
            <div className={styles.stat}>
              <b>커리어 성과</b>
              <span>현장 진출 · 데뷔</span>
            </div>
          </div>
        </section>

        {/* ---------- 프로세스 ---------- */}
        <section className={styles.sheet}>
          <h2 className={styles.h2}>&lsquo;캐릭터 포지셔닝&rsquo;은 어떻게 진행될까요?</h2>
          <p className={styles.bodyMuted}>TRY앵글 캐릭터 포지셔닝 프로세스는 크게 5단계로 구성되어 있습니다.</p>

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

          <div className={styles.callout}>
            💡 1:1 방문상담에서는 보다 상세한 캐릭터 포지셔닝 프로세스와 실제 수강생들의 변화
            과정을 확인하실 수 있습니다.
          </div>
        </section>

        {/* ---------- 진행 방식 · 일정 ---------- */}
        <section className={styles.sheet}>
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
            💡 캐릭터 포지셔닝 클래스(그룹)는 연 4회만 오픈하는 클래스입니다.
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
            <p className={styles.calloutSub}>
              캐릭터 포지셔닝 클래스 8기 개강일 — 화요일 26.09.08(화) · 토요일 26.09.12(토)
              <br />※ 9기는 12월 중순 개강 예정입니다.
            </p>
          </div>
        </section>

        {/* ---------- 비용 ---------- */}
        <section className={styles.sheet}>
          <h2 className={styles.h2}>비용 안내</h2>
          <div className={styles.priceBox}>
            <div className={styles.priceOld}>정가 · 월 65만원</div>
            <div className={styles.priceNew}>
              8기 특별가 · <b>월 45만원</b>
              <em>8기 모집 기간 한정</em>
            </div>
          </div>
          <p className={styles.bodyMuted}>
            현재 TRY앵글 캐릭터 포지셔닝 클래스 8기 상담 및 신청이 진행 중입니다. 정원 마감 시
            모집이 조기 종료될 수 있으니, 상담을 원하시는 경우 미리 신청해주세요.
          </p>
        </section>

        {/* ---------- 1:1 맞춤형 ---------- */}
        <section className={`${styles.sheet} ${styles.privateSheet}`}>
          <span className={styles.privateTag}>1:1 맞춤형</span>
          <h2 className={styles.h2}>1:1 캐릭터 포지셔닝</h2>
          <p className={styles.body}>
            그룹 클래스가 아닌, 1:1 맞춤형 캐릭터 포지셔닝을 희망하신다면 아래 내용을 확인해주세요.
          </p>
          <p className={styles.body}>
            1:1 캐릭터 포지셔닝은 브랜딩 어드바이저가 배우와 1:1로 전 과정을 함께 설계하는 프리미엄
            프로그램입니다. 배우의 내·외적 이미지를 객관적으로 분석하고, 과정 전반에서 확인한
            보이스 컬러와 매력, 개성까지 종합적으로 고려하여 배우에게 가장 경쟁력 있는 캐릭터
            포지션을 도출합니다. 이후, 해당 캐릭터 포지션이 프로필과 연기영상에 일관되게 반영될 수
            있도록 배우 개인에게 최적화된 전략을 수립합니다.
          </p>
          <p className={styles.bodyMuted}>
            1:1 캐릭터 포지셔닝은 그룹 클래스와 달리 상시 신청이 가능합니다.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <b>주 1회 · 45분</b>
              <span>월 4회 진행</span>
            </div>
            <div className={styles.stat}>
              <b>100%</b>
              <span>1:1 맞춤 진행</span>
            </div>
            <div className={styles.stat}>
              <b>70만원</b>
              <span>VAT 포함</span>
            </div>
          </div>
        </section>

        {/* ---------- 멘토 소개 ---------- */}
        <section className={styles.sheet}>
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
              <p className={styles.body}>
                &lsquo;브랜딩&rsquo;과 &lsquo;연기&rsquo; 두 분야의 전문 지식을 바탕으로 최적의 캐릭터
                포지션을 확립할 수 있도록 돕습니다.
              </p>
            </div>
          </div>

          <h3 className={styles.h3}>주요 전문 분야</h3>
          <p className={styles.body}>배우 캐릭터 포지셔닝</p>

          <h3 className={styles.h3}>대표 이력</h3>
          <ul className={styles.list}>
            {CAREER.map((c) => (
              <li key={c}>{c}</li>
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

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Image src="/logo.jpg" alt="TRY앵글" width={22} height={22} className={styles.footerLogo} />
          ⓒ Artist Branding Company TRY앵글
        </div>
        <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer">
          카카오톡 채널
        </a>
      </footer>
    </>
  );
}
