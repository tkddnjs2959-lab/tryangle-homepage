'use client';

import { useState } from 'react';

type ShareButtonProps = {
  title: string;
  slug: string;
};

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = new URL(`/insights/${slug}`, window.location.origin);
    url.searchParams.set('utm_source', 'insight');
    url.searchParams.set('utm_medium', 'share');
    url.searchParams.set('utm_campaign', 'always_on');
    url.searchParams.set('utm_content', slug);

    const win = window as WindowWithDataLayer;
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ event: 'share_insight', article: slug });

    try {
      if (navigator.share) {
        await navigator.share({ title, url: url.toString() });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url.toString());
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // User cancellations should not surface as an error in the UI.
    }
  };

  return (
    <button className="shareInsightButton" type="button" onClick={handleShare}>
      {copied ? '공유 링크가 복사되었습니다' : '이 글 공유하기'}
    </button>
  );
}
