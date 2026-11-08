import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TrackedLink from '../../TrackedLink';
import { getInsight, INSIGHTS } from '../content';
import styles from './page.module.css';
import InsightViewTracker from './InsightViewTracker';
import ShareButton from './ShareButton';

const KAKAO_URL = 'https://app.tryangle-official.co.kr/go/kakao?utm_source=homepage&utm_medium=owned&utm_campaign=insight_article&utm_content=insight';

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
        <div className={styles.shareRow}>
          <ShareButton title={item.title} slug={item.slug} />
        </div>
        {item.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <div className={styles.cta}>
          <strong>내 이미지 방향도 점검해보고 싶다면</strong>
          <TrackedLink href={KAKAO_URL} target="_blank" rel="noopener noreferrer" eventName="click_kakao_consult" eventParams={{ placement: `insight_${item.slug}` }}>
            카카오톡으로 상담하기
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
