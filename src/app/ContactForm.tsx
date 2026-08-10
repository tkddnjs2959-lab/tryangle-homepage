'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { getAttribution } from './AttributionCapture';

/**
 * 현재 page.tsx 에서는 렌더링하지 않는다 (홈페이지 개설과 별개로
 * 나중에 다시 노출할 예정). /api/inquiry 와 카카오·이메일 알림
 * 파이프라인은 그대로 살아있으니, 다시 쓸 때는 이 컴포넌트를
 * import 해서 배치만 하면 된다.
 */
export default function ContactForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setError('이름과 연락처를 입력해주세요.');
      return;
    }
    setState('sending');
    setError(null);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, message, attribution: getAttribution() }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setError(json.message ?? '접수에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setState('idle');
        return;
      }
      setState('done');
    } catch {
      setError('네트워크 오류입니다. 연결을 확인하고 다시 시도해주세요.');
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <div className={styles.formDone}>
        <strong>문의가 접수되었습니다.</strong>
        <span>빠른 시일 내에 안내 연락드리겠습니다.</span>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.formRow}>
        <input
          className={styles.input}
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
        <input
          className={styles.input}
          placeholder="연락처 (전화번호 또는 카카오톡 ID)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          maxLength={60}
        />
      </div>
      <textarea
        className={styles.textarea}
        placeholder="궁금하신 점이나 상담받고 싶은 내용을 남겨주세요 (선택)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={1000}
        rows={4}
      />
      {error && <p className={styles.formError}>{error}</p>}
      <button className={styles.formSubmit} type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? '접수 중…' : '문의 남기기'}
      </button>
    </form>
  );
}
