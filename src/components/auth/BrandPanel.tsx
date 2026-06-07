import Avatar from '../ui/Avatar';
import AvatarStack from '../ui/AvatarStack';
import Logo from '../ui/Logo';
import Confetti from '../visuals/Confetti';
import styles from './BrandPanel.module.css';

/**
 * Left half of the auth screen: a dark, confetti-strewn panel that restates the
 * product promise right where people sign up — the brand mark, a headline, a
 * live "Weekend Crew · all free Friday" card, and a reassuring footer line.
 */
export default function BrandPanel() {
  return (
    <aside className={styles.brandside}>
      <Confetti count={30} />

      <div className={styles.top}>
        <a href="#top" className={styles.brand}>
          <Logo width={36} height={30} />
          Free Together
        </a>
      </div>

      <div className={styles.mid}>
        <h1 className={styles.headline}>
          Your crew's next
          <br />
          hangout starts <span className={styles.hl}>here.</span>
        </h1>
        <p className={styles.lead}>Set up your group once. We'll do the schedule math forever.</p>

        <div className={styles.card}>
          <div className={styles.cardRow}>
            <AvatarStack overlap={10}>
              <Avatar label="M" color="var(--coral)" size={36} borderColor="var(--ink)" />
              <Avatar label="T" color="var(--violet)" size={36} borderColor="var(--ink)" />
              <Avatar label="J" color="var(--sky)" size={36} borderColor="var(--ink)" />
              <Avatar label="Y" color="var(--pink)" size={36} borderColor="var(--ink)" />
            </AvatarStack>
            <div className={styles.label}>
              Weekend Crew
              <small>4 people · all synced</small>
            </div>
          </div>
          <span className={styles.chip}>
            <span className={styles.star}>★</span> All free — Friday 7:30 PM
          </span>
        </div>
      </div>

      <div className={styles.foot}>
        <div className={styles.qm} aria-hidden="true">
          <span className={styles.q} style={{ background: 'var(--coral)' }} />
          <span className={styles.q} style={{ background: 'var(--violet)' }} />
          <span className={styles.q} style={{ background: 'var(--sky)' }} />
        </div>
        Join thousands of crews who stopped playing schedule tag.
      </div>
    </aside>
  );
}
