'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ContactForm from './ContactForm';
import { trackEvent } from './TrackedLink';
import styles from './ConsultationCta.module.css';

export default function ConsultationCta() {
  const pathname = usePathname();
  const [modalState, setModalState] = useState<'closed' | 'open' | 'closing'>('closed');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const open = modalState !== 'closed';

  const openModal = useCallback((placement = 'global_floating') => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setModalState('open');
    trackEvent('click_consultation_cta', { placement, page_path: pathname });
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
      const detail = (event as CustomEvent<{ placement?: string }>).detail;
      openModal(detail?.placement ?? 'external_consultation_cta');
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
        <div className={styles.ctaCopy}>
          <strong>내 캐릭터 방향이 궁금하다면</strong>
          <span>상담 신청은 약 1분이면 충분해요.</span>
        </div>
        <button className={styles.ctaButton} type="button" onClick={() => openModal()} aria-haspopup="dialog">
          상담 신청하기
        </button>
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
                <p className={styles.dialogHint}>현재 이미지와 목표를 확인한 뒤, 맞는 상담 일정을 안내해드려요.</p>
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
