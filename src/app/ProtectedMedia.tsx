import type { ReactNode } from 'react';
import styles from './ProtectedMedia.module.css';

type ProtectedMediaProps = {
  children: ReactNode;
  label?: string;
};

export default function ProtectedMedia({ children, label = 'TRY앵글' }: ProtectedMediaProps) {
  return (
    <span className={styles.root} data-protected-media>
      {children}
      <span className={styles.watermarks} aria-hidden="true">
        <span>{label}</span>
        <span>{label}</span>
        <span>{label}</span>
      </span>
    </span>
  );
}
