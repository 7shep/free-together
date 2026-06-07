import type { ReactNode } from 'react';
import styles from './Eyebrow.module.css';

/** Small pill with a pulsing green dot, sitting above the hero headline. */
export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className={styles.eyebrow}>
      <span className={styles.dot} />
      {children}
    </span>
  );
}
