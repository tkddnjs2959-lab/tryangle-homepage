'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ContactForm from './ContactForm';
import TrackedLink, { trackEvent } from './TrackedLink';
import { useRemainingTime } from './EnrollmentCountdown';
import CountdownBoxes from './CountdownBoxes';
import styles from './ConsultationCta.module.css';

const EIGHTH_COHORT_REGISTRATION_DEADLINE = '2026-09-12T00:00:00+09:00';

export default function ConsultationCta() {
  const pathname = usePathname();
  const [modalState, setModalState] = useState<'closed' | 'open' | 'closing'>('closed');
  const remainingTime = useRemainingTime(EIGHTH_COHORT_REGISTRATION_DEADLINE);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const open = modalState !== 'closed';
  const isInsightPage = pathname.startsWith('/insights');

  const openModal = useCallback((placement = 'global_floating', alreadyTracked = false) => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setModalState('open');
    if (!alreadyTracked) {
      trackEvent('click_consultation_cta', { placement, page_path: pathname });
    }
    trackEvent('form_open', { form: 'contact_modal', placement, page_path: pathname });
  }, [pathname]);

  const closeModal = useCallback(() => {
    if (modalState !== 'open') return;
    setModalState('closing');
    trackEvent('form_close', { form: 'contact_modal', page_path: pathname });
    window.setTimeout(() => {
      setModalState('closed');
      previousFocusRef.current?.focus();
    }, 220);
  }, [modalState, pathname]);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ placement?: string; tracked?: boolean }>).detail;
      openModal(detail?.placement ?? 'external_consultation_cta', detail?.tracked === true);
    };
    window.addEventListener('tryangle:open-consultation', onOpen);
    return () => window.removeEventListener('tryangle:open-consultation', onOpen);
  }, [openModal]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeModal, open]);

  return (
    <>
      <div className={`${styles.ctaBar} ${pathname === '/' ? styles.homeCtaBar : ''}`}>
        <div className={styles.mobileDeadlineNotice} aria-label="8기 신청 마감 및 9기 신청 안내">
          <div className={styles.mobileDeadlineTop}>
            <strong>⏰ 8기 신청 마감까지</strong>
            <CountdownBoxes remainingTime={remainingTime} compact />
          </div>
          <span>9기 개강 예정일은 12월 중순입니다.</span>
        </div>
        <div className={styles.ctaCopy}>
          <strong className={styles.desktopCtaCopy}>내 캐릭터 방향이 궁금하다면</strong>
          <strong className={`${styles.mobileCtaCopy} ${styles.mobileCtaPrimary}`}>8기 한정가 45만원 / 상담 진행 중</strong>
          <span className={styles.desktopCtaCopy}>상담 신청은 약 1분이면 충분해요.</span>
          <span className={styles.mobileCtaCopy}>상담 신청은 약 1분이면 충분해요</span>
        </div>
        {isInsightPage ? (
          <TrackedLink className={styles.ctaButton} href="/#consultation" eventName="click_insight_to_home" eventParams={{ placement: 'global_floating', destination: 'home_consultation' }}>
            메인 페이지에서 확인하기
          </TrackedLink>
        ) : (
          <button className={styles.ctaButton} type="button" onClick={() => openModal()} aria-haspopup="dialog">
            상담 신청하기
          </button>
        )}
      </div>

      {open && (
        <div className={styles.backdrop} data-state={modalState} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}>
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="consultation-dialog-title">
            <div className={styles.dialogHeader}>
              <div>
                <p className={styles.dialogEyebrow}>TRY앵글 상담 신청</p>
                <h2 id="consultation-dialog-title">내 캐릭터 방향을 함께 찾아볼까요?</h2>
                <p className={styles.dialogHint}>작성해주신 내용을 확인한 뒤, 상담 가능 일정과 진행 방법을 안내해드립니다.</p>
              </div>
              <button ref={closeButtonRef} className={styles.closeButton} type="button" onClick={closeModal} aria-label="상담 신청 창 닫기">×</button>
            </div>
            <div className={styles.formScroll}>
              <ContactForm formName="contact_modal" successPlacement="consultation_modal_success" />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
