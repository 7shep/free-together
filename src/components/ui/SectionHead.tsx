import styles from './SectionHead.module.css';

interface SectionHeadProps {
  kicker: string;
  title: string;
  sub: string;
}

/** Centred section header: uppercase kicker with flanking dashes, title, subtitle. */
export default function SectionHead({ kicker, title, sub }: SectionHeadProps) {
  return (
    <div className={`reveal ${styles.head}`}>
      <span className={styles.kicker}>{kicker}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.sub}>{sub}</p>
    </div>
  );
}
