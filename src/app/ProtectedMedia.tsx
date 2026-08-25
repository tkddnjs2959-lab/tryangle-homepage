import type { ReactNode } from 'react';
import styles from './ProtectedMedia.module.css';

type ProtectedMediaProps = {
  children: ReactNode;
};

export default function ProtectedMedia({ children }: ProtectedMediaProps) {
  return (
    <span className={styles.root} data-protected-media>
      {children}
    </span>
  );
}
