'use client';

import { useEffect } from 'react';

function isEditableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

export default function ContentProtection() {
  useEffect(() => {
    const preventPageAction = (event: Event) => {
      if (!isEditableTarget(event.target)) event.preventDefault();
    };

    const preventImageDrag = (event: DragEvent) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };

    const preventCopyShortcuts = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && ['c', 'x', 's', 'u', 'p'].includes(key)) {
        event.preventDefault();
      }

      // 일부 브라우저는 PrintScreen 키 이벤트를 페이지에 전달합니다.
      // 운영체제 수준 캡처는 웹페이지에서 완전히 차단할 수 없습니다.
      if (event.key === 'PrintScreen') event.preventDefault();
    };

    document.addEventListener('copy', preventPageAction, true);
    document.addEventListener('cut', preventPageAction, true);
    document.addEventListener('contextmenu', preventPageAction, true);
    document.addEventListener('dragstart', preventImageDrag, true);
    document.addEventListener('keydown', preventCopyShortcuts, true);

    return () => {
      document.removeEventListener('copy', preventPageAction, true);
      document.removeEventListener('cut', preventPageAction, true);
      document.removeEventListener('contextmenu', preventPageAction, true);
      document.removeEventListener('dragstart', preventImageDrag, true);
      document.removeEventListener('keydown', preventCopyShortcuts, true);
    };
  }, []);

  return null;
}
