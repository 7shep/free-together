import type { ReactNode } from 'react';
import type { CSSVars } from '../../types/css';
import styles from './AvatarStack.module.css';

interface AvatarStackProps {
  children: ReactNode;
  /** Pixel overlap between avatars (rendered as a negative left margin). */
  overlap?: number;
}

/** Lays out avatars in an overlapping row. */
export default function AvatarStack({ children, overlap = 9 }: AvatarStackProps) {
  return (
    <div className={styles.stack} style={{ '--ov': `-${overlap}px` } as CSSVars}>
      {children}
    </div>
  );
}
