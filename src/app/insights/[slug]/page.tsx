import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TrackedLink from '../../TrackedLink';
import { getInsight, INSIGHTS } from '../content';
import styles from './page.module.css';
import InsightViewTracker from './InsightViewTracker';
import ShareButton from './ShareButton';

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
  const relatedCandidates = item.relatedSlugs
    ?.map((slug) => getInsight(slug))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));
  const related = (relatedCandidates?.length
    ? relatedCandidates
    : INSIGHTS.filter((candidate) => candidate.slug !== item.slug)).slice(0, 3);

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
        <nav className={styles.articleOutline} aria-label="이 글의 목차">
          <strong>이 글에서 확인할 기준</strong>
          <ol>
            {item.sections.map((section, index) => (
              <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>
            ))}
          </ol>
        </nav>
        {item.sections.map((section, index) => (
          <section id={`section-${index + 1}`} key={section.heading} className={section.tone ? styles[section.tone] : undefined}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <div className={styles.cta}>
          <div>
            <strong>읽은 내용을 내 자료에 적용하고 싶다면</strong>
            <p>메인 페이지에서 TRY앵글의 분석 과정과 상담 방식을 먼저 확인해보세요.</p>
          </div>
          <TrackedLink href="/#consultation" eventName="click_insight_to_home" eventParams={{ placement: `insight_${item.slug}`, destination: 'home_consultation' }}>
            {item.ctaLabel ?? '메인 페이지에서 상담 방식 보기'}
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
