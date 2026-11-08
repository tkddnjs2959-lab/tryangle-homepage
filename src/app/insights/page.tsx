import type { Metadata } from 'next';
import { INSIGHTS } from './content';
import styles from './index.module.css';
import TrackedLink from '../TrackedLink';

const KAKAO_URL = 'https://app.tryangle-official.co.kr/go/kakao?utm_source=homepage&utm_medium=owned&utm_campaign=insights_cta&utm_content=insights';

export const metadata: Metadata = {
  title: '배우 이미지·캐릭터 브랜딩 인사이트 | TRYANGLE',
  description: '배우 프로필, 오디션 이미지, 캐릭터 브랜딩을 위한 실전 인사이트를 확인해보세요.',
  alternates: { canonical: '/insights' },
};

export default function InsightsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>TRYANGLE INSIGHTS</p>
        <h1>배우의 이미지를<br />더 선명하게 만드는 방법</h1>
        <p>프로필, 오디션, 캐릭터 브랜딩에 바로 적용할 수 있는 실전 내용을 정리합니다.</p>
        <a className={styles.rss} href="/insights/feed.xml">새 글 RSS로 받기 ↗</a>
      </section>
      <section className={styles.grid} aria-label="인사이트 목록">
        {INSIGHTS.map((item) => (
          <TrackedLink className={styles.card} href={`/insights/${item.slug}`} key={item.slug} eventName="click_insight_article" eventParams={{ source: 'insights_index', article: item.slug }}>
            <span>INSIGHT</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <strong>읽어보기 →</strong>
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
    </main>
  );
}
