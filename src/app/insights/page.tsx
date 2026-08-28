import type { Metadata } from 'next';
import { INSIGHTS } from './content';
import styles from './index.module.css';
import TrackedLink from '../TrackedLink';
import { KAKAO_CHANNEL_CHAT_URL } from '@/lib/external-links';

const KAKAO_URL = KAKAO_CHANNEL_CHAT_URL;
const FEATURED_SLUG = 'audition-self-introduction';

const PATHS = [
  { label: '오디션이 잡혔다면', title: '첫 30초와 제출 자료 점검', href: '/insights/audition-image-checklist' },
  { label: '프로필 촬영 전이라면', title: '사진·의상·순서 기준 정리', href: '/insights/profile-shoot-preparation-checklist' },
  { label: '지원해도 연락이 없다면', title: '프로필에서 놓친 신호 확인', href: '/insights/new-actor-profile-mistakes' },
  { label: '내 역할 방향이 흐리다면', title: '캐릭터 포지셔닝 기준 잡기', href: '/insights/character-branding-guide' },
] as const;

export const metadata: Metadata = {
  title: '배우 이미지·캐릭터 브랜딩 인사이트 | TRYANGLE',
  description: '배우 프로필, 오디션 이미지, 캐릭터 브랜딩을 위한 실전 인사이트를 확인해보세요.',
  alternates: { canonical: '/insights' },
};

export default function InsightsPage() {
  const featured = INSIGHTS.find((item) => item.slug === FEATURED_SLUG) ?? INSIGHTS[0];
  const articles = INSIGHTS.filter((item) => item.slug !== featured.slug);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>TRYANGLE INSIGHTS</p>
        <h1>오디션과 프로필을,<br />감이 아닌 판단 기준으로</h1>
        <p>읽고 끝나는 조언보다 바로 고치고 비교할 수 있는 예시·체크리스트·작성 틀을 제공합니다.</p>
      </section>

      <TrackedLink className={styles.featured} href={`/insights/${featured.slug}`} eventName="click_insight_article" eventParams={{ source: 'insights_featured', article: featured.slug }}>
        <div>
          <span className={styles.featuredLabel}>먼저 읽을 실전 가이드</span>
          <h2>{featured.title}</h2>
          <p>{featured.description}</p>
        </div>
        <div className={styles.featuredMeta}>
          <span>{featured.readingTime ?? '5분'}</span>
          <span>{featured.format ?? '실전 가이드'}</span>
          <strong>예시와 템플릿 보기 →</strong>
        </div>
      </TrackedLink>

      <section className={styles.paths} aria-labelledby="insight-paths-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>START FROM YOUR SITUATION</p>
          <h2 id="insight-paths-title">지금 필요한 기준부터</h2>
        </div>
        <div className={styles.pathGrid}>
          {PATHS.map((path) => (
            <TrackedLink key={path.href} href={path.href} eventName="click_insight_path" eventParams={{ source: 'insights_path', destination: path.href }}>
              <span>{path.label}</span>
              <strong>{path.title}</strong>
              <em>바로 확인하기 →</em>
            </TrackedLink>
          ))}
        </div>
      </section>

      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>PRACTICAL LIBRARY</p>
        <h2>실전 인사이트 전체 보기</h2>
      </div>
      <section className={styles.grid} aria-label="인사이트 목록">
        {articles.map((item) => (
          <TrackedLink className={styles.card} href={`/insights/${item.slug}`} key={item.slug} eventName="click_insight_article" eventParams={{ source: 'insights_index', article: item.slug }}>
            <span>실전 가이드</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <strong>{item.readingTime ?? '5분'} · 읽어보기 →</strong>
          </TrackedLink>
        ))}
      </section>
      <section className={styles.cta}>
        <div>
          <h2>내 배우 이미지 방향이 궁금하다면</h2>
          <p>인사이트를 읽고도 방향이 선명하지 않다면 현재 이미지와 목표를 함께 점검해보세요.</p>
        </div>
        <TrackedLink href={KAKAO_URL} target="_blank" rel="noopener noreferrer" eventName="click_kakao_consult" eventParams={{ placement: 'insights_index_cta' }}>
          카카오톡으로 상담하기
        </TrackedLink>
      </section>
      <a className={styles.rss} href="/insights/feed.xml">새 글 RSS로 받기 ↗</a>
    </main>
  );
}
