'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from './TrackedLink';

export default function FunnelAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const seen = new Set<string>();
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-motion]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target.getAttribute('data-motion');
        if (!section || seen.has(section)) return;

        seen.add(section);
        trackEvent(`view_section_${section.replace(/[^a-z0-9_]/gi, '_')}`, {
          section,
          page_path: pathname,
        });
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.15 });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
