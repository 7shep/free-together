import type { ReactNode } from 'react';
import { features, type FeatureColor } from '../../data/features';
import {
  IconCalendar,
  IconCheckCircle,
  IconHeart,
  IconStarOutline,
  IconSun,
} from '../icons';
import SectionHead from '../ui/SectionHead';
import FeatureDemo from '../visuals/FeatureDemo';
import styles from './Features.module.css';

const featBg: Record<FeatureColor, string> = {
  mint: styles.fMint,
  sun: styles.fSun,
  sky: styles.fSky,
  pink: styles.fPink,
  violet: styles.fViolet,
};

const iconBg: Record<FeatureColor, string> = {
  mint: styles.iMint,
  sun: styles.iSun,
  sky: styles.iSky,
  pink: styles.iPink,
  violet: styles.iViolet,
};

const icons: Record<FeatureColor, ReactNode> = {
  mint: <IconCalendar />,
  sun: <IconSun />,
  sky: <IconCheckCircle />,
  pink: <IconHeart />,
  violet: <IconStarOutline />,
};

interface FeatureProps {
  color: FeatureColor;
  size: 'big' | 'small';
  title: string;
  desc: string;
  children?: ReactNode;
}

function Feature({ color, size, title, desc, children }: FeatureProps) {
  const sizeClass = size === 'big' ? styles.big : styles.small;
  return (
    <div className={`reveal ${styles.feat} ${sizeClass} ${featBg[color]}`}>
      <span className={`${styles.fi} ${iconBg[color]}`} aria-hidden="true">
        {icons[color]}
      </span>
      <h3>{title}</h3>
      <p>{desc}</p>
      {children}
    </div>
  );
}

/** Feature grid: one wide "stacked calendar" card plus four supporting cards. */
export default function Features() {
  return (
    <section className={styles.features} id="features">
      <div className="wrap">
        <SectionHead
          kicker="Why it works"
          title="Built for actually hanging out"
          sub="Less coordinating, more showing up."
        />
        <div className={styles.grid}>
          {features.map((f) => (
            <Feature key={f.title} color={f.color} size={f.size} title={f.title} desc={f.desc}>
              {f.size === 'big' ? <FeatureDemo /> : null}
            </Feature>
          ))}
        </div>
      </div>
    </section>
  );
}
