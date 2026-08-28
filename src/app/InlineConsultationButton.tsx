'use client';

import { usePathname } from 'next/navigation';
import { trackEvent } from './TrackedLink';
import styles from './page.module.css';

type InlineConsultationButtonProps = {
  label: string;
  placement: string;
  emphasis?: boolean;
};

export default function InlineConsultationButton({ label, placement, emphasis = false }: InlineConsultationButtonProps) {
  const pathname = usePathname();

  function openConsultation() {
    trackEvent('click_consultation_cta', { placement, page_path: pathname });
    window.dispatchEvent(new CustomEvent('tryangle:open-consultation', {
      detail: { placement, tracked: true },
    }));
  }

  return (
    <div className={`${styles.inlineCta} ${emphasis ? styles.inlineCtaStrong : ''}`}>
      <button type="button" onClick={openConsultation}>{label}</button>
    </div>
  );
}
