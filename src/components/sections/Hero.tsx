import type { CSSVars } from '../../types/css';
import { IconCheck, StickerSquiggle, StickerStar } from '../icons';
import Button from '../ui/Button';
import Eyebrow from '../ui/Eyebrow';
import CalendarCard from '../visuals/CalendarCard';
import styles from './Hero.module.css';

/** Hero: headline + CTAs on the left, the live week-calendar card on the right. */
export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`wrap ${styles.heroGrid}`}>
        <div>
          <Eyebrow>Group plans, finally solved</Eyebrow>
          <h1 className={styles.title}>
            Find the night
            <br />
            you're <span className={styles.hl}>all free.</span>
          </h1>
          <p className={styles.sub}>
            Everyone drops in their schedule. Free Together shows the exact windows when your whole
            crew is open — no group-chat chaos.
          </p>
          <div className={styles.actions}>
            <Button href="#/auth" variant="primary" size="lg">
              Create your group →
            </Button>
            <Button href="#how" size="lg">
              See how it works
            </Button>
          </div>
          <div className={styles.meta}>
            <span className={styles.m}>
              <IconCheck /> Free forever
            </span>
            <span className={styles.m}>
              <IconCheck /> No app to download
            </span>
            <span className={styles.m}>
              <IconCheck /> Share one link
            </span>
          </div>
        </div>

        <div className={styles.visual}>
          <span
            className={`${styles.sticker} ${styles.s1}`}
            style={{ '--r': '-8deg' } as CSSVars}
            aria-hidden="true"
          >
            <StickerStar />
          </span>
          <span
            className={`${styles.sticker} ${styles.s2}`}
            style={{ '--r': '10deg' } as CSSVars}
            aria-hidden="true"
          >
            <StickerSquiggle />
          </span>
          <CalendarCard />
        </div>
      </div>
    </section>
  );
}
