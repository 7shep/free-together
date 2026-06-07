import { useMemo } from 'react';
import styles from './Confetti.module.css';

const COLORS = ['var(--coral)', 'var(--sun)', 'var(--mint)', 'var(--sky)', 'var(--pink)'];

/** Scattered confetti pieces filling the dark closing-CTA card. Positions are
 *  randomised once on mount so they stay put across re-renders. */
export default function Confetti({ count = 26 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 6 + Math.random() * 9;
        return {
          left: Math.random() * 100,
          top: Math.random() * 100,
          width: size,
          height: size * 0.7,
          background: COLORS[i % COLORS.length],
          rotate: Math.random() * 360,
          opacity: Number((0.5 + Math.random() * 0.5).toFixed(2)),
        };
      }),
    [count],
  );

  return (
    <div className={styles.confetti} aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={styles.cf}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.width,
            height: p.height,
            background: p.background,
            transform: `rotate(${p.rotate}deg)`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
