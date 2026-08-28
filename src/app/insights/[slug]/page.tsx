import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TrackedLink from '../../TrackedLink';
import { getInsight, INSIGHTS } from '../content';
import styles from './page.module.css';
import InsightViewTracker from './InsightViewTracker';
import ShareButton from './ShareButton';
import { KAKAO_CHANNEL_CHAT_URL } from '@/lib/external-links';

const KAKAO_URL = KAKAO_CHANNEL_CHAT_URL;

export function generateStaticParams() {
  return INSIGHTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getInsight(slug);
  if (!item) return {};
  return { title: `${item.title} | TRYANGLE`, description: item.description, alternates: { canonical: `/insights/${slug}` } };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getInsight((await params).slug);
  if (!item) notFound();
  const related = INSIGHTS.filter((candidate) => candidate.slug !== item.slug).slice(0, 2);

  return (
    <main className={styles.page}>
      <InsightViewTracker slug={item.slug} />
      <article className={styles.article}>
        <p className={styles.eyebrow}>TRYANGLE INSIGHT</p>
        <h1>{item.title}</h1>
        <p className={styles.summary}>{item.summary}</p>
        {(item.readingTime || item.format) && (
          <div className={styles.articleMeta}>
            {item.readingTime && <span>읽는 시간 {item.readingTime}</span>}
            {item.format && <span>{item.format}</span>}
          </div>
        )}
        <div className={styles.shareRow}>
          <ShareButton title={item.title} slug={item.slug} />
        </div>
        {item.sections.map((section) => (
          <section key={section.heading} className={section.tone ? styles[section.tone] : undefined}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <div className={styles.cta}>
          <strong>내 이미지 방향이 아직 선명하지 않다면</strong>
          <TrackedLink href={KAKAO_URL} target="_blank" rel="noopener noreferrer" eventName="click_kakao_consult" eventParams={{ placement: `insight_${item.slug}` }}>
            {item.ctaLabel ?? '카카오톡으로 상담하기'}
          </TrackedLink>
        </div>
        <section className={styles.related}>
          <h2>함께 읽어보세요</h2>
          <div className={styles.relatedGrid}>
            {related.map((candidate) => (
              <TrackedLink href={`/insights/${candidate.slug}`} key={candidate.slug} eventName="click_insight_article" eventParams={{ source: 'related_article', article: candidate.slug, from_article: item.slug }}>
                <strong>{candidate.title}</strong>
                <span>읽어보기 →</span>
              </TrackedLink>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
